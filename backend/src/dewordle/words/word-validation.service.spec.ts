import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordValidationService } from './word-validation.service';
import { Word } from '../../entities/word.entity';

describe('WordValidationService', () => {
  let service: WordValidationService;
  let wordRepository: jest.Mocked<Repository<Word>>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordValidationService,
        {
          provide: getRepositoryToken(Word),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WordValidationService>(WordValidationService);
    wordRepository = module.get(getRepositoryToken(Word));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isValidWord', () => {
    it('should return true if word exists in database', async () => {
      const mockWord = { id: '123', word: 'apple' };
      wordRepository.findOne.mockResolvedValue(mockWord as Word);

      const result = await service.isValidWord('APPLE');

      expect(result).toBe(true);
      expect(wordRepository.findOne).toHaveBeenCalledWith({
        where: { word: 'apple' },
        select: ['id'],
      });
    });

    it('should return false if word does not exist in database', async () => {
      wordRepository.findOne.mockResolvedValue(null);

      const result = await service.isValidWord('ZZZZZ');

      expect(result).toBe(false);
      expect(wordRepository.findOne).toHaveBeenCalledWith({
        where: { word: 'zzzzz' },
        select: ['id'],
      });
    });

    it('should return false for empty or null word', async () => {
      expect(await service.isValidWord('')).toBe(false);
      expect(await service.isValidWord(null as string)).toBe(false);
      expect(await service.isValidWord(undefined as string)).toBe(false);
      expect(wordRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return false for words that are not 5 letters', async () => {
      expect(await service.isValidWord('CAR')).toBe(false);
      expect(await service.isValidWord('CARROT')).toBe(false);
      expect(wordRepository.findOne).not.toHaveBeenCalled();
    });

    it('should handle case insensitivity and whitespace', async () => {
      const mockWord = { id: '123', word: 'apple' };
      wordRepository.findOne.mockResolvedValue(mockWord as Word);

      const result = await service.isValidWord(' ApPlE ');

      expect(result).toBe(true);
      expect(wordRepository.findOne).toHaveBeenCalledWith({
        where: { word: 'apple' },
        select: ['id'],
      });
    });

    it('should return false on database error', async () => {
      wordRepository.findOne.mockRejectedValue(new Error('Database error'));

      const result = await service.isValidWord('APPLE');

      expect(result).toBe(false);
    });
  });

  describe('validateWords', () => {
    it('should validate multiple words correctly', async () => {
      const mockWords = [{ word: 'apple' }, { word: 'grape' }];
      wordRepository.find.mockResolvedValue(mockWords as Word[]);

      const result = await service.validateWords(['APPLE', 'GRAPE', 'ZZZZZ']);

      expect(result).toEqual({
        APPLE: true,
        GRAPE: true,
        ZZZZZ: false,
      });
      expect(wordRepository.find).toHaveBeenCalledWith({
        where: [{ word: 'apple' }, { word: 'grape' }, { word: 'zzzzz' }],
        select: ['word'],
      });
    });

    it('should handle empty array', async () => {
      const result = await service.validateWords([]);

      expect(result).toEqual({});
      expect(wordRepository.find).toHaveBeenCalledWith({
        where: [],
        select: ['word'],
      });
    });

    it('should return all words as invalid on database error', async () => {
      wordRepository.find.mockRejectedValue(new Error('Database error'));

      const result = await service.validateWords(['APPLE', 'GRAPE']);

      expect(result).toEqual({
        APPLE: false,
        GRAPE: false,
      });
    });

    it('should handle case insensitivity and whitespace in batch validation', async () => {
      const mockWords = [{ word: 'apple' }];
      wordRepository.find.mockResolvedValue(mockWords as Word[]);

      const result = await service.validateWords([' ApPlE ', 'GRAPE']);

      expect(result).toEqual({
        ' ApPlE ': true,
        GRAPE: false,
      });
      expect(wordRepository.find).toHaveBeenCalledWith({
        where: [{ word: 'apple' }, { word: 'grape' }],
        select: ['word'],
      });
    });
  });
});
