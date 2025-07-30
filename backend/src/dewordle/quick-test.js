#!/usr/bin/env node

/**
 * Simple command line test for the Wordle Engine
 *
 * Run with: node src/dewordle/quick-test.js
 * No TypeScript compilation required
 */

const {
  evaluateGuess,
  formatEvaluation,
  getStatusSymbols,
} = require('./wordle.engine.ts');

console.log('🎯 Quick Wordle Engine Test\n');

const testCases = [
  { guess: 'CHEER', solution: 'SPEED', name: 'Example 1' },
  { guess: 'PAPER', solution: 'APPLE', name: 'Example 2' },
  { guess: 'CRANE', solution: 'WORLD', name: 'Basic test' },
  { guess: 'WORLD', solution: 'WORLD', name: 'Perfect match' },
];

testCases.forEach((test, i) => {
  console.log(`${i + 1}. ${test.name}: ${test.guess} vs ${test.solution}`);

  try {
    const result = evaluateGuess(test.guess, test.solution);
    const symbols = getStatusSymbols(result);
    const details = formatEvaluation(result);

    console.log(`   Result: ${symbols}`);
    console.log(`   Details: ${details}\n`);
  } catch (error) {
    console.log(`   ERROR: ${error.message}\n`);
  }
});

console.log(
  'All tests completed! Use the Jest test suite for comprehensive testing.',
);
console.log('   Run: npm test wordle.engine.spec.ts');
