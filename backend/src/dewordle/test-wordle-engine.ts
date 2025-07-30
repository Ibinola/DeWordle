#!/usr/bin/env ts-node

/**
 * Manual testing script for the Wordle Engine
 *
 * Run with: npx ts-node src/dewordle/test-wordle-engine.ts
 * Or: npm run test:engine (if you add this script to package.json)
 */

import {
  evaluateGuess,
  formatEvaluation,
  getStatusSymbols,
} from './wordle.engine';

interface TestCase {
  guess: string;
  solution: string;
  description: string;
  expected?: string; // Optional expected symbols for validation
}

const testCases: TestCase[] = [
  {
    guess: 'CHEER',
    solution: 'SPEED',
    description:
      'Example 1 from requirements: Both Es should be correct since SPEED has Es at positions 2 and 3',
    expected: '⬜⬜🟩🟩⬜',
  },
  {
    guess: 'PAPER',
    solution: 'APPLE',
    description: 'Example 2 from requirements: Duplicate P handling',
    expected: '🟨🟨🟩🟨⬜',
  },
  {
    guess: 'CRANE',
    solution: 'WORLD',
    description: 'Basic case with no duplicates',
    expected: '⬜🟨⬜⬜⬜',
  },
  {
    guess: 'WORLD',
    solution: 'WORLD',
    description: 'Perfect match - all correct',
    expected: '🟩🟩🟩🟩🟩',
  },
  {
    guess: 'GEESE',
    solution: 'SPEED',
    description: "Multiple E's in guess vs two E's in SPEED",
    expected: '⬜🟨🟩🟨⬜',
  },
  {
    guess: 'LLAMA',
    solution: 'APPLE',
    description: 'More duplicates in guess than solution',
    expected: '🟨⬜🟨⬜⬜',
  },
  {
    guess: 'ERASE',
    solution: 'WHEEL',
    description: 'Duplicate E in solution, single E in guess positions',
    expected: '🟨⬜⬜⬜🟨',
  },
  {
    guess: 'HELLO',
    solution: 'LLAMA',
    description: 'Test with clear double L logic',
    expected: '⬜⬜🟨🟨⬜',
  },
];

console.log('🎯 WORDLE ENGINE MANUAL TESTING');
console.log('================================\n');

let passedTests = 0;
const totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`Guess: ${testCase.guess} | Solution: ${testCase.solution}`);

  try {
    const result = evaluateGuess(testCase.guess, testCase.solution);
    const symbols = getStatusSymbols(result);
    const formatted = formatEvaluation(result);

    console.log(`Result: ${symbols}`);
    console.log(`Details: ${formatted}`);

    if (testCase.expected) {
      const passed = symbols === testCase.expected;
      console.log(`Expected: ${testCase.expected}`);
      console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
      if (passed) passedTests++;
    } else {
      console.log('Status: 📝 Manual verification needed');
    }
  } catch (error) {
    console.log(
      `❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

  console.log(''); // Empty line for readability
});

console.log(
  `📊 SUMMARY: ${passedTests}/${totalTests} automated tests passed\n`,
);

// Interactive testing section
if (process.argv.includes('--interactive')) {
  console.log('🎮 INTERACTIVE MODE');
  console.log(
    'For interactive testing, use the Jest test suite or modify the testCases array above.',
  );
  console.log('Run: npm test wordle.engine.spec.ts');
} else {
  console.log('💡 TIP: Run the Jest test suite for comprehensive testing:');
  console.log('npm test wordle.engine.spec.ts');
  console.log('Or run all tests: npm test');
}
