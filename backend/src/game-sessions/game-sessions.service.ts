import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from './entities/game-session.entity';
import { Game } from '../games/entities/game.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { User } from '../auth/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { submitGuessProvider } from './providers/submit-guess';
import { WordsService } from '../dewordle/words/words.service';
import { WordValidationService } from '../dewordle/words/word-validation.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { evaluateGuess, LetterEvaluation } from '../dewordle/wordle.engine';
import { GuessHistory } from './entities/guess-history.entity';
import { GameSessionStatus, MAX_ATTEMPTS } from './game-sessions.constants';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectRepository(GameSession)
    private sessionRepo: Repository<GameSession>,
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    private eventEmitter: EventEmitter2,
    private leaderboardService: LeaderboardService,
    private submitGuessProvider: submitGuessProvider,
    private wordService: WordsService,
    private wordValidationService: WordValidationService,
    @InjectRepository(GuessHistory)
    private readonly guessHistoryRepo: Repository<GuessHistory>,
  ) {}

  async create(createDto: CreateSessionDto, user: User | null) {
    // Validate game exists
    const game = await this.gameRepo.findOne({
      where: { id: createDto.gameId },
    });
    if (!game) throw new NotFoundException('Game not found');

    // Validate score for guest sessions (prevent abuse)
    if (!user && createDto.score < 0) {
      throw new BadRequestException('Invalid score for guest session');
    }

    const { word: solution } = await this.wordService.getRandomWord();

    // Create session with user or null for guest
    const session = this.sessionRepo.create({
      ...createDto,
      game,
      ...(user ? { user } : {}),
      solution,
    });

    const saved = await this.sessionRepo.save(session);

    // Update leaderboard only for authenticated users
    // Guest sessions are excluded from leaderboard and stats
    if (user) {
      const win = false; // You may want to determine win logic based on session/score
      await this.leaderboardService.upsertEntry(
        user,
        game,
        createDto.score,
        win,
      );
    }

    // Emit event for both authenticated and guest sessions
    this.eventEmitter.emit('session.completed', saved);

    return saved;
  }

  /**
   * Get sessions for a specific user or guest
   * @param user - User entity for authenticated users, null for guests
   * @param guestId - Guest identifier for anonymous sessions
   */
  async getUserSessions(user: User | null, guestId?: string) {
    if (user) {
      // Return authenticated user sessions
      return await this.sessionRepo.find({
        where: { user },
        relations: ['game'],
        order: { playedAt: 'DESC' },
      });
    } else if (guestId) {
      // Return guest sessions by guestId in metadata using query builder
      return await this.sessionRepo
        .createQueryBuilder('session')
        .leftJoinAndSelect('session.game', 'game')
        .where('session.user IS NULL')
        .andWhere("session.metadata->>'guestId' = :guestId", { guestId })
        .orderBy('session.playedAt', 'DESC')
        .getMany();
    }

    return [];
  }

  public async submitGuess(sessionId: number, guess: string, user: User | null) {
    return this.submitGuessProvider.submitGuess(sessionId, guess, user);
  }

  /**
   * Attempt a guess for a specific session
   * @param sessionId   - Session ID
   * @param guess       - User's guess
   * @param user        - User entity for authenticated users, null for guests
   */
  async guess(
    sessionId: GameSession['id'],
    guess: CreateGuessDto['guess'],
    user: User | null,
    guestId?: string,
  ) {
    if (!user && !guestId) {
      throw new BadRequestException('GuestId is required for guest sessions');
    }
    // Validate Session Exists
    const session = await (user
      ? this.sessionRepo.findOne({
          where: { id: sessionId, user: { id: user.id } },
          relations: ['history'],
          select: ['id', 'solution'],
        })
      : this.sessionRepo
          .createQueryBuilder('session')
          .addSelect('session.solution')
          .leftJoinAndSelect('session.history', 'guess_history')
          .where('session.id = :sessionId', { sessionId })
          .andWhere('session.user IS NULL')
          .andWhere("session.metadata->>'guestId' = :guestId", { guestId })
          .getOne());

    if (!session) throw new NotFoundException('Session not found');

    if (session.status !== GameSessionStatus.IN_PROGRESS)
      throw new BadRequestException('Session is not in progress');

    // Validate the guess is a valid word
    const isValidWord = await this.wordValidationService.isValidWord(guess);
    if (!isValidWord) {
      throw new BadRequestException('Not in word list');
    }

    let result: LetterEvaluation[];

    try {
      result = evaluateGuess(guess, session.solution);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? `Invalid guess: ${error.message}`
          : 'Invalid guess';
      throw new BadRequestException(message);
    }

    const attemptNumber = session.history.length + 1;

    const newGuess = this.guessHistoryRepo.create({
      session,
      guess,
      result,
      attemptNumber,
    });

    const status = this.sessionStatus(result, attemptNumber, MAX_ATTEMPTS);

    session.history.push(newGuess);

    await this.sessionRepo.save({ ...session, status });

    return {
      evaluation: result,
      attemptNumber,
      status,
    };
  }

  /**
   * Determine the status of a specific session, bases on latest guess and attempts number
   * @param evaluation  - Evaluation of the latest guess
   * @param attemptNumber - Number of attempts
   * @param maxAttempts - Maximum number of attempts
   */

  private sessionStatus(
    evaluation: LetterEvaluation[],
    attemptNumber: number,
    maxAttempts: number,
  ) {
    // even if the solution is correct, the game is lost if the player has made too many attempts
    if (attemptNumber > maxAttempts) {
      return GameSessionStatus.LOST;
    }

    if (evaluation.every((e) => e.status === 'correct')) {
      return GameSessionStatus.WON;
    }

    if (attemptNumber === maxAttempts) {
      return GameSessionStatus.LOST;
    }

    return GameSessionStatus.IN_PROGRESS;
  }
}
