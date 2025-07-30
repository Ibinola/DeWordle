# Wordle Engine - Core Evaluation Logic

This module contains the fundamental engine for Dewordle game evaluation. It implements the core word evaluation logic as specified in issue #516.

## Overview

The `wordle.engine.ts` module exports a pure function that evaluates a player's guess against the solution word and returns the status for each letter.

## Key Files

- `wordle.engine.ts` - Main engine implementation
- `wordle.engine.spec.ts` - Comprehensive Jest test suite
- `test-wordle-engine.ts` - Manual testing script with visual output
- `quick-test.js` - Simple Node.js test script (no TypeScript compilation needed)

## Status Types

- **🟩 correct**: Letter is in the solution and in the correct position
- **🟨 present**: Letter is in the solution but in the wrong position
- **⬜ absent**: Letter is not in the solution at all

## Usage

```typescript
import { evaluateGuess } from './wordle.engine';

const result = evaluateGuess('CHEER', 'SPEED');
// Returns: [
//   { letter: 'C', status: 'absent' },
//   { letter: 'H', status: 'absent' },
//   { letter: 'E', status: 'correct' },
//   { letter: 'E', status: 'correct' },
//   { letter: 'R', status: 'absent' }
// ]
```

## Testing

### Jest Test Suite (Recommended)

```bash
npm test wordle.engine.spec.ts
```

### Manual Testing with Visual Output

```bash
npx ts-node src/dewordle/test-wordle-engine.ts
```

### Quick Command Line Test

```bash
node src/dewordle/quick-test.js
```

## Duplicate Letter Handling

The engine correctly handles the critical edge case of duplicate letters by:

1. **First Pass**: Marking all exact position matches as "correct"
2. **Second Pass**: Marking remaining letters as "present" if they exist in the solution
3. **Letter Counting**: Tracking available letter instances to prevent over-marking

### Examples

**CHEER vs SPEED**

- SPEED has E at positions 2 and 3
- CHEER has E at positions 2 and 3
- Result: Both E's marked as "correct" (exact matches)

**PAPER vs APPLE**

- APPLE: A(0), P(1), P(2), L(3), E(4)
- PAPER: P(0)→present, A(1)→present, P(2)→correct, E(3)→present, R(4)→absent

**LLAMA vs APPLE**

- APPLE has 1 L, 1 A (2 P's, 1 E)
- LLAMA: L(0)→present, L(1)→absent, A(2)→present, M(3)→absent, A(4)→absent
- Only first L and first A are marked present; duplicates are absent

## Implementation Details

- **Pure Function**: No external dependencies, stateless
- **Case Insensitive**: Handles mixed case input
- **Input Validation**: Ensures 5-letter words only
- **Error Handling**: Throws descriptive errors for invalid input
- **TypeScript**: Fully typed with interfaces and type exports
- **Performance**: O(n) time complexity where n=5 (constant time for Wordle)

## Acceptance Criteria 

- [x] Module `wordle.engine.ts` created in backend source directory
- [x] Exports `evaluateGuess(guess: string, solution: string)` function
- [x] Returns array of objects with `letter` and `status` properties
- [x] Correctly implements all three statuses (correct, present, absent)
- [x] Correctly handles duplicate letters edge cases
- [x] Includes comprehensive test suite with all edge cases
- [x] Provides multiple testing methods (Jest, manual, quick CLI)

The implementation is ready for integration into the Dewordle game backend!
