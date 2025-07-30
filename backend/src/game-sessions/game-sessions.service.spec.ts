import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionsService } from './game-sessions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { Game } from '../games/entities/game.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { WordsService } from '../dewordle/words/words.service';
import { WordValidationService } from '../dewordle/words/word-validation.service';
import { EnrichedWord } from '../utils/dictionary.helper';
import { Repository } from 'typeorm';
import { GuessHistory } from './entities/guess-history.entity';
import { evaluateGuess, LetterEvaluation } from '../dewordle/wordle.engine';
import { GameSessionStatus } from './game-sessions.constants';

jest.mock('../dewordle/wordle.engine', () => {
  const actual = jest.requireActual<typeof import('../dewordle/wordle.engine')>(
    '../dewordle/wordle.engine',
  );
  return {
    ...actual,
    evaluateGuess: jest.fn() as jest.MockedFunction<
      typeof actual.evaluateGuess
    >,
  };
});

describe('GameSessionsService', () => {
  let service: GameSessionsService;
  let mockSessionRepo: any;
  let mockGameRepo: any;
  let mockEventEmitter: any;
  let mockLeaderboardService: any;
  let mockWordsService: any;
  let mockWordValidationService: any;
  let mockGuessHistoryRepo: Partial<Repository<GuessHistory>>;

  const mockRandomWord: EnrichedWord = {
    id: 'id',
    word: 'apple',
    isEnriched: false,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    mockSessionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockGameRepo = {
      findOne: jest.fn(),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    mockLeaderboardService = {
      upsertEntry: jest.fn(),
    };

    mockWordsService = {
      getRandomWord: jest.fn().mockResolvedValue(mockRandomWord),
    };

    mockWordValidationService = {
      isValidWord: jest.fn(),
      validateWords: jest.fn(),
    };

    mockGuessHistoryRepo = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionsService,
        {
          provide: getRepositoryToken(GameSession),
          useValue: mockSessionRepo,
        },
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepo,
        },
        {
          provide: getRepositoryToken(GuessHistory),
          useValue: mockGuessHistoryRepo,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: LeaderboardService,
          useValue: mockLeaderboardService,
        },
        {
          provide: WordsService,
          useValue: mockWordsService,
        },
        {
          provide: WordValidationService,
          useValue: mockWordValidationService,
        },
      ],
    }).compile();

    service = module.get<GameSessionsService>(GameSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockGame = { id: 1, name: 'Test Game' };
    const mockUser: Partial<User> = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
      walletAddress: '0x742d35Cc6634C0532925a3b8D8Cc6f9b2F3d217',
      sessions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createDto: CreateSessionDto = {
      gameId: 1,
      score: 100,
      durationSeconds: 60,
      metadata: { guestId: 'guest123' },
    };

    it('should create a session for authenticated user', async () => {
      mockGameRepo.findOne.mockResolvedValue(mockGame);
      mockSessionRepo.create.mockReturnValue({
        ...createDto,
        game: mockGame,
        user: mockUser,
      });
      mockSessionRepo.save.mockResolvedValue({
        id: 1,
        ...createDto,
        game: mockGame,
        user: mockUser,
      });

      const result = await service.create(createDto, mockUser as User);

      expect(mockGameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockSessionRepo.create).toHaveBeenCalledWith({
        ...createDto,
        game: mockGame,
        user: mockUser,
        solution: mockRandomWord.word,
      });
      expect(mockLeaderboardService.upsertEntry).toHaveBeenCalledWith(
        mockUser,
        mockGame,
        100,
        false,
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'session.completed',
        expect.any(Object),
      );
      expect(result).toEqual({
        id: 1,
        ...createDto,
        game: mockGame,
        user: mockUser,
      });
    });

    it('should create a guest session without user', async () => {
      mockGameRepo.findOne.mockResolvedValue(mockGame);
      mockSessionRepo.create.mockReturnValue({ ...createDto, game: mockGame });
      mockSessionRepo.save.mockResolvedValue({
        id: 1,
        ...createDto,
        game: mockGame,
      });

      const result = await service.create(createDto, null);

      expect(mockGameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockSessionRepo.create).toHaveBeenCalledWith({
        ...createDto,
        game: mockGame,
        solution: mockRandomWord.word,
      });
      expect(mockLeaderboardService.upsertEntry).not.toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'session.completed',
        expect.any(Object),
      );
      expect(result).toEqual({ id: 1, ...createDto, game: mockGame });
    });

    it('should throw NotFoundException when game not found', async () => {
      mockGameRepo.findOne.mockResolvedValue(null);

      await expect(service.create(createDto, mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockGameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException for negative score in guest session', async () => {
      const negativeScoreDto = { ...createDto, score: -10 };
      mockGameRepo.findOne.mockResolvedValue(mockGame);

      await expect(service.create(negativeScoreDto, null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow negative score for authenticated users', async () => {
      const negativeScoreDto = { ...createDto, score: -10 };
      mockGameRepo.findOne.mockResolvedValue(mockGame);
      mockSessionRepo.create.mockReturnValue({
        ...negativeScoreDto,
        game: mockGame,
        user: mockUser,
      });
      mockSessionRepo.save.mockResolvedValue({
        id: 1,
        ...negativeScoreDto,
        game: mockGame,
        user: mockUser,
      });

      const result = await service.create(negativeScoreDto, mockUser as User);

      expect(result).toBeDefined();
      expect(mockLeaderboardService.upsertEntry).toHaveBeenCalledWith(
        mockUser,
        mockGame,
        -10,
        false,
      );
    });

    it('should generate and store a solution when creating a session', async () => {
      mockGameRepo.findOne.mockResolvedValue(mockGame);
      mockSessionRepo.create.mockReturnValue({
        ...createDto,
        game: mockGame,
        user: mockUser,
        solution: mockRandomWord.word,
      });
      mockSessionRepo.save.mockResolvedValue({
        id: 1,
        ...createDto,
        game: mockGame,
        user: mockUser,
        solution: mockRandomWord.word,
      });

      const result = await service.create(createDto, mockUser as User);

      expect(mockSessionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          game: mockGame,
          user: mockUser,
          solution: mockRandomWord.word,
        }),
      );

      expect(mockSessionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ solution: mockRandomWord.word }),
      );
    });
  });

  describe('getUserSessions', () => {
    const mockUser: Partial<User> = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
      walletAddress: '0x742d35Cc6634C0532925a3b8D8Cc6f9b2F3d217',
      sessions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return user sessions for authenticated user', async () => {
      const mockSessions = [{ id: 1, score: 100 }];
      mockSessionRepo.find.mockResolvedValue(mockSessions);

      const result = await service.getUserSessions(mockUser as User);

      expect(mockSessionRepo.find).toHaveBeenCalledWith({
        where: { user: mockUser },
        relations: ['game'],
        order: { playedAt: 'DESC' },
      });
      expect(result).toEqual(mockSessions);
    });

    it('should return guest sessions by guestId', async () => {
      const mockSessions = [{ id: 1, score: 100, user: null }];

      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockSessions),
      };

      mockSessionRepo.createQueryBuilder = jest.fn().mockReturnValue(qb);

      const result = await service.getUserSessions(null, 'guest123');

      expect(mockSessionRepo.createQueryBuilder).toHaveBeenCalledWith(
        'session',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('session.game', 'game');
      expect(qb.where).toHaveBeenCalledWith('session.user IS NULL');
      expect(qb.andWhere).toHaveBeenCalledWith(
        "session.metadata->>'guestId' = :guestId",
        { guestId: 'guest123' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('session.playedAt', 'DESC');

      expect(result).toEqual(mockSessions);
    });

    it('should return empty array for guest without guestId', async () => {
      const result = await service.getUserSessions(null);

      expect(result).toEqual([]);
    });

    describe('getUserSessions - solution never leaked', () => {
      const mockUser = { id: 1 } as User;
      const playedAt = new Date('2025-07-25T12:00:00Z');

      let gs: GameSession;

      beforeEach(() => {
        gs = Object.assign(new GameSession(), {
          id: 42,
          score: 7,
          durationSeconds: 15,
          metadata: { foo: 'bar' },
          playedAt,
          game: { id: 99, name: 'Test Game' } as Game,
          solution: 'HELLO',
        });
      });

      it('authenticated: strips solution from .find() results', async () => {
        mockSessionRepo.find.mockResolvedValue([gs]);

        const sessions = await service.getUserSessions(mockUser, undefined);

        const result = JSON.parse(JSON.stringify(sessions[0]));

        expect(result).not.toHaveProperty('solution');

        expect(result).toEqual(
          expect.objectContaining({
            id: 42,
            score: 7,
            durationSeconds: 15,
            metadata: { foo: 'bar' },
            playedAt: playedAt.toISOString(),
            game: { id: 99, name: 'Test Game' },
          }),
        );
      });

      it('guest: strips solution from query-builder results', async () => {
        const qb: any = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([gs]),
        };
        mockSessionRepo.createQueryBuilder = jest.fn().mockReturnValue(qb);

        const sessions = await service.getUserSessions(null, 'guest-123');

        const result = JSON.parse(JSON.stringify(sessions[0]));

        expect(result).not.toHaveProperty('solution');
        expect(result).toEqual(
          expect.objectContaining({
            id: 42,
            score: 7,
            durationSeconds: 15,
            metadata: { foo: 'bar' },
            playedAt: playedAt.toISOString(),
            game: { id: 99, name: 'Test Game' },
          }),
        );
      });
    });
  });
  describe('guess()', () => {
    const mockUser = {
      id: 42,
      username: 'username',
      email: 'email@email.com',
      password: 'password',
      role: 'user',
      sessions: [],
      walletAddress: 'walletAddress',
      avatarUrl: 'avatarUrl',
      createdAt: new Date(),
      updatedAt: new Date(),
      toJSON() {
        const { toJSON, ...rest } = this;
        return rest;
      },
    } satisfies User;

    const mockGame = {
      id: 1,
      name: 'Test Game',
      slug: 'test-game',
      description: 'Test Game Description',
      sessions: [],
      is_active: true,
      type: 'wordle',
      created_at: new Date(),
    } satisfies Game;
    const MAX_ATTEMPTS = 6;
    const dummySolution = 'APPLE';

    describe('failure scenarios', () => {
      it('throws BadRequestException if no user and no guestId', async () => {
        await expect(service.guess(1, 'GUESS', null)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('throws NotFoundException when session not found for user', async () => {
        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(null);

        await expect(service.guess(1, 'GUESS', mockUser)).rejects.toThrow(
          NotFoundException,
        );

        expect(mockSessionRepo.findOne).toHaveBeenCalledWith({
          where: { id: 1, user: { id: mockUser.id } },
          relations: ['history'],
          select: ['id', 'solution'],
        });
      });

      it('throws NotFoundException when session not found for guest', async () => {
        const qb: any = {
          addSelect: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        };
        (mockSessionRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

        await expect(
          service.guess(1, 'GUESS', null, 'guestXYZ'),
        ).rejects.toThrow(NotFoundException);

        expect(qb.where).toHaveBeenCalledWith('session.id = :sessionId', {
          sessionId: 1,
        });
        expect(qb.andWhere).toHaveBeenCalledWith(
          "session.metadata->>'guestId' = :guestId",
          { guestId: 'guestXYZ' },
        );
      });
    });

    function mockEvaluate(result: LetterEvaluation[]) {
      (evaluateGuess as jest.Mock).mockReturnValue(result);
    }

    describe('when a session is found (user)', () => {
      let baseSession: GameSession;

      beforeEach(() => {
        baseSession = Object.assign(new GameSession(), {
          id: 1,
          solution: dummySolution,
          history: [],
          user: mockUser,
          game: mockGame,
          score: 0,
          durationSeconds: 0,
          metadata: {},
          playedAt: new Date(),
          status: GameSessionStatus.IN_PROGRESS,
        });
      });

      it('returns IN_PROGRESS on wrong guess before max attempts', async () => {
        const evaluation: LetterEvaluation[] = [
          { letter: 'X', status: 'absent' },
          { letter: 'Y', status: 'absent' },
          { letter: 'Z', status: 'absent' },
          { letter: 'W', status: 'absent' },
          { letter: 'V', status: 'absent' },
        ];

        mockEvaluate(evaluation);
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(true);

        const session = baseSession;

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        const result = await service.guess(1, 'XYZWV', mockUser);

        expect(
          (mockWordValidationService as jest.Mocked<WordValidationService>)
            .isValidWord,
        ).toHaveBeenCalledWith('XYZWV');
        expect(evaluateGuess).toHaveBeenCalledWith('XYZWV', dummySolution);
        expect(mockGuessHistoryRepo.create).toHaveBeenCalledWith({
          session,
          guess: 'XYZWV',
          result: evaluation,
          attemptNumber: 1,
        });
        expect(mockSessionRepo.save).toHaveBeenCalledWith({
          ...session,
          status: GameSessionStatus.IN_PROGRESS,
        });
        expect(result).toEqual({
          evaluation,
          attemptNumber: 1,
          status: GameSessionStatus.IN_PROGRESS,
        });
      });

      it('returns WON when guess is completely correct', async () => {
        const allCorrect = dummySolution
          .split('')
          .map((l) => ({ letter: l, status: 'correct' as const }));
        mockEvaluate(allCorrect);
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(true);

        const session: GameSession = Object.assign(new GameSession(), {
          ...baseSession,
          history: Array.from({ length: 1 }, () => new GuessHistory()),
        });

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        const result = await service.guess(1, dummySolution, mockUser);
        expect(result.status).toBe(GameSessionStatus.WON);
        expect(result.attemptNumber).toBe(2);
      });

      it('returns LOST on last allowed attempt if still wrong', async () => {
        mockEvaluate([{ letter: 'A', status: 'absent' as const }]);
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(true);

        const session: GameSession = Object.assign(new GameSession(), {
          ...baseSession,
          history: Array.from(
            { length: MAX_ATTEMPTS - 1 },
            () => new GuessHistory(),
          ),
        });

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        const result = await service.guess(1, 'XXXXX', mockUser);
        expect(result.attemptNumber).toBe(MAX_ATTEMPTS);
        expect(result.status).toBe(GameSessionStatus.LOST);
      });

      it('returns LOST when exceeding max attempts even if correct', async () => {
        const allCorrect = dummySolution
          .split('')
          .map((l) => ({ letter: l, status: 'correct' as const }));

        mockEvaluate(allCorrect);
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(true);

        const session: GameSession = Object.assign(new GameSession(), {
          ...baseSession,
          history: Array.from(
            { length: MAX_ATTEMPTS },
            () => new GuessHistory(),
          ),
        });

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        const result = await service.guess(1, dummySolution, mockUser);
        expect(result.attemptNumber).toBe(MAX_ATTEMPTS + 1);
        expect(result.status).toBe(GameSessionStatus.LOST);
      });

      describe('game session is not in progress', () => {
        it('throws BadRequestException if game session status is won', async () => {
          const session: GameSession = Object.assign(new GameSession(), {
            ...baseSession,
            status: GameSessionStatus.WON,
          });

          (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

          await expect(
            service.guess(1, dummySolution, mockUser),
          ).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException if game session status is lost', async () => {
          const session: GameSession = Object.assign(new GameSession(), {
            ...baseSession,
            status: GameSessionStatus.LOST,
          });

          (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

          await expect(
            service.guess(1, dummySolution, mockUser),
          ).rejects.toThrow(BadRequestException);
        });
      });

      it('rejects a non-5-letter guess', async () => {
        (evaluateGuess as jest.Mock).mockImplementationOnce(() => {
          throw new Error();
        });

        const session = baseSession;

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        await expect(service.guess(1, '', mockUser)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('rejects an invalid word with "Not in word list" message', async () => {
        const session = baseSession;
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(false);

        (mockSessionRepo.findOne as jest.Mock).mockResolvedValue(session);

        await expect(service.guess(1, 'ZZZZZ', mockUser)).rejects.toThrow(
          BadRequestException,
        );

        try {
          await service.guess(1, 'ZZZZZ', mockUser);
        } catch (error) {
          expect(error.message).toBe('Not in word list');
        }

        expect(
          (mockWordValidationService as jest.Mocked<WordValidationService>)
            .isValidWord,
        ).toHaveBeenCalledWith('ZZZZZ');
        expect(evaluateGuess).not.toHaveBeenCalled();
      });

      it('allows guest path and returns IN_PROGRESS', async () => {
        const evaluation: LetterEvaluation[] = [
          { letter: 'A', status: 'absent' as const },
        ];

        mockEvaluate(evaluation);
        (
          mockWordValidationService as jest.Mocked<WordValidationService>
        ).isValidWord.mockResolvedValue(true);

        const session = baseSession;

        const qb: any = {
          addSelect: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(session),
        };

        (mockSessionRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

        const result = await service.guess(2, 'HELLO', null, 'guest987');

        expect(qb.where).toHaveBeenCalledWith('session.id = :sessionId', {
          sessionId: 2,
        });
        expect(qb.andWhere).toHaveBeenCalledWith(
          "session.metadata->>'guestId' = :guestId",
          { guestId: 'guest987' },
        );
        expect(result).toEqual({
          evaluation: evaluation,
          attemptNumber: 1,
          status: GameSessionStatus.IN_PROGRESS,
        });
      });
    });
  });
});
