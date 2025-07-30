import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../../entities/word.entity';

@Injectable()
export class WordValidationService {
  private readonly logger = new Logger(WordValidationService.name);

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  /**
   * Validates if a word exists in the official word list
   * @param word - The word to validate (case-insensitive)
   * @returns Promise<boolean> - True if the word exists in the dictionary
   */
  async isValidWord(word: string): Promise<boolean> {
    if (!word || word.length !== 5) {
      return false;
    }

    const normalizedWord = word.toLowerCase().trim();

    try {
      const foundWord = await this.wordRepository.findOne({
        where: { word: normalizedWord },
        select: ['id'], // Only select id for performance
      });

      const isValid = !!foundWord;
      this.logger.debug(`Word validation for "${normalizedWord}": ${isValid}`);

      return isValid;
    } catch (error) {
      this.logger.error(
        `Error validating word "${normalizedWord}": ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Validates multiple words at once
   * @param words - Array of words to validate
   * @returns Promise<Record<string, boolean>> - Object mapping each word to its validity
   */
  async validateWords(words: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    const normalizedWords = words.map((word) => word.toLowerCase().trim());

    try {
      const foundWords = await this.wordRepository.find({
        where: normalizedWords.map((word) => ({ word })),
        select: ['word'],
      });

      const validWordsSet = new Set(foundWords.map((w) => w.word));

      for (let i = 0; i < words.length; i++) {
        const originalWord = words[i];
        const normalizedWord = normalizedWords[i];
        results[originalWord] = validWordsSet.has(normalizedWord);
      }

      return results;
    } catch (error) {
      this.logger.error(
        `Error validating multiple words: ${error.message}`,
        error.stack,
      );

      // Return all words as invalid in case of error
      words.forEach((word) => {
        results[word] = false;
      });

      return results;
    }
  }
}
