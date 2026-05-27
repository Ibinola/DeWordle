import { CursorService } from './cursor.service';
import { IndexerCursorEntity } from '../entities/indexer-cursor.entity';

const makeCursorEntity = (
  lastLedger: number,
  lastTxHash: string,
  lastEventIndex: number,
): IndexerCursorEntity =>
  Object.assign(new IndexerCursorEntity(), {
    id: 1,
    network: 'testnet',
    streamKey: 'core_game',
    lastLedger,
    lastTxHash,
    lastEventIndex,
    updatedAt: new Date(),
  });

const makeService = (existing?: IndexerCursorEntity) => {
  const saved: IndexerCursorEntity[] = [];
  const repo = {
    findOne: jest.fn().mockResolvedValue(existing ?? null),
    create: jest.fn((data) => Object.assign(new IndexerCursorEntity(), data)),
    save: jest.fn().mockImplementation(async (e) => { saved.push(e); return e; }),
  };
  const svc = new CursorService(repo as any);
  return { svc, repo, saved };
};

describe('CursorService.checkpoint', () => {
  it('advances cursor when ledger is greater', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'tx1', 0));
    const result = await svc.checkpoint('testnet', 'core_game', 11, 'tx1', 0);
    expect(result).toBe(true);
    expect(saved[0].lastLedger).toBe(11);
  });

  it('rejects regression to lower ledger', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'tx1', 0));
    const result = await svc.checkpoint('testnet', 'core_game', 9, 'tx1', 0);
    expect(result).toBe(false);
    expect(saved).toHaveLength(0);
  });

  it('advances cursor when same ledger but txHash is lexicographically greater', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'aaa', 0));
    const result = await svc.checkpoint('testnet', 'core_game', 10, 'bbb', 0);
    expect(result).toBe(true);
    expect(saved[0].lastTxHash).toBe('bbb');
  });

  it('rejects regression to lexicographically smaller txHash on same ledger', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'bbb', 0));
    const result = await svc.checkpoint('testnet', 'core_game', 10, 'aaa', 0);
    expect(result).toBe(false);
    expect(saved).toHaveLength(0);
  });

  it('advances cursor when same ledger+txHash but eventIndex is greater', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'tx1', 2));
    const result = await svc.checkpoint('testnet', 'core_game', 10, 'tx1', 3);
    expect(result).toBe(true);
    expect(saved[0].lastEventIndex).toBe(3);
  });

  it('rejects same position (no-op regression)', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'tx1', 2));
    const result = await svc.checkpoint('testnet', 'core_game', 10, 'tx1', 2);
    expect(result).toBe(false);
    expect(saved).toHaveLength(0);
  });

  it('rejects lower eventIndex on same ledger+txHash', async () => {
    const { svc, saved } = makeService(makeCursorEntity(10, 'tx1', 5));
    const result = await svc.checkpoint('testnet', 'core_game', 10, 'tx1', 4);
    expect(result).toBe(false);
    expect(saved).toHaveLength(0);
  });

  it('creates cursor from scratch when none exists and accepts first checkpoint', async () => {
    const { svc, saved } = makeService(undefined);
    const result = await svc.checkpoint('testnet', 'core_game', 1, 'tx1', 0);
    expect(result).toBe(true);
    // save called twice: once for create, once for checkpoint update
    expect(saved.length).toBeGreaterThanOrEqual(1);
  });
});
