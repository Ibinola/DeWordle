import { getMetadataArgsStorage } from 'typeorm';
import { GameSession } from './game-session.entity';

describe('GameSession entity serialization', () => {
  it('should not include solution when converting to JSON', () => {
    const gs: GameSession = Object.assign(new GameSession(), {
      id: 42,
      score: 10,
      durationSeconds: 30,
      metadata: { foo: 'bar' },
      playedAt: new Date(),
      solution: 'hello',
    });

    const serialised = JSON.parse(JSON.stringify(gs)) as Record<
      string,
      unknown
    >;

    expect(serialised).not.toHaveProperty('solution');

    expect(serialised).toHaveProperty('id', 42);
    expect(serialised).toHaveProperty('score', 10);
  });
});

describe('GameSession entity relations', () => {
  it('should register a OneToMany relation to GuessHistory', () => {
    const relations = getMetadataArgsStorage().relations.filter(
      (r) => r.target === GameSession && r.propertyName === 'history',
    );
    expect(relations).toHaveLength(1);
    expect(relations[0].relationType).toBe('one-to-many');
  });
});
