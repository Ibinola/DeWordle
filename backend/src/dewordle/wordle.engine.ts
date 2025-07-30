/**
 * Core Wordle Game Engine
 *
 * This module contains the fundamental logic for evaluating player guesses
 * against the solution word. It's a pure function with no external dependencies.
 */

export type LetterStatus = 'correct' | 'present' | 'absent';

export interface LetterEvaluation {
  letter: string;
  status: LetterStatus;
}

/**
 * Evaluates a player's guess against the solution word
 *
 * @param guess - The player's 5-letter guess (case-insensitive)
 * @param solution - The correct 5-letter solution word (case-insensitive)
 * @returns Array of LetterEvaluation objects, one for each letter in the guess
 *
 * Status definitions:
 * - 'correct': Letter is in the solution and in the correct position (Green 🟩)
 * - 'present': Letter is in the solution but in the wrong position (Yellow 🟨)
 * - 'absent': Letter is not in the solution at all (Gray ⬜)
 *
 * @example
 * evaluateGuess('CHEER', 'SPEED')
 * // Returns: [
 * //   { letter: 'C', status: 'absent' },
 * //   { letter: 'H', status: 'absent' },
 * //   { letter: 'E', status: 'correct' },
 * //   { letter: 'E', status: 'correct' },
 * //   { letter: 'R', status: 'absent' }
 * // ]
 */
export function evaluateGuess(
  guess: string,
  solution: string,
): LetterEvaluation[] {
  // Normalize inputs to uppercase for consistent comparison
  const normalizedGuess = guess.toUpperCase().trim();
  const normalizedSolution = solution.toUpperCase().trim();

  // Validate inputs
  if (normalizedGuess.length !== 5 || normalizedSolution.length !== 5) {
    throw new Error('Both guess and solution must be exactly 5 letters long');
  }

  // Initialize result array with all letters marked as absent
  const result: LetterEvaluation[] = normalizedGuess
    .split('')
    .map((letter) => ({
      letter,
      status: 'absent' as LetterStatus,
    }));

  // Convert to arrays for easier manipulation
  const guessLetters = normalizedGuess.split('');
  const solutionLetters = normalizedSolution.split('');

  // Create a frequency map of available letters in the solution
  // This will help us track how many of each letter are available for matching
  const solutionLetterCounts: Record<string, number> = {};
  for (const letter of solutionLetters) {
    solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1;
  }

  // First pass: Mark all correct letters (exact position matches)
  // This must be done first to ensure correct letters are prioritized
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === solutionLetters[i]) {
      result[i].status = 'correct';
      // Reduce the available count for this letter
      solutionLetterCounts[guessLetters[i]]--;
    }
  }

  // Second pass: Mark present letters (wrong position)
  // Only check letters that weren't marked as correct
  for (let i = 0; i < 5; i++) {
    const guessLetter = guessLetters[i];

    // Skip if already marked as correct
    if (result[i].status === 'correct') {
      continue;
    }

    // Check if this letter exists in the solution and we have available instances
    if (solutionLetterCounts[guessLetter] > 0) {
      result[i].status = 'present';
      // Reduce the available count for this letter
      solutionLetterCounts[guessLetter]--;
    }
    // If not available, it remains 'absent' (already set in initialization)
  }

  return result;
}

/**
 * Helper function to format evaluation results for easy reading
 * Useful for testing and debugging
 */
export function formatEvaluation(evaluation: LetterEvaluation[]): string {
  const statusSymbols = {
    correct: '🟩',
    present: '🟨',
    absent: '⬜',
  };

  return evaluation
    .map(
      ({ letter, status }) => `${letter}: ${status} ${statusSymbols[status]}`,
    )
    .join(', ');
}

/**
 * Helper function to get just the status symbols for visual representation
 */
export function getStatusSymbols(evaluation: LetterEvaluation[]): string {
  const statusSymbols = {
    correct: '🟩',
    present: '🟨',
    absent: '⬜',
  };

  return evaluation.map(({ status }) => statusSymbols[status]).join('');
}
