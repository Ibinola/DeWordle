import { IndexerService } from './indexer.service';
import { EventNormalizerService } from './processors/event-normalizer.service';
import { EventProcessorService } from './processors/event-processor.service';
import { CursorService } from './projections/cursor.service';
import { ConfigService } from '@nestjs/config';
import { INDEXER_STREAM_CORE_GAME } from './indexer.constants';

const makeCursor = (lastLedger = 0) => ({
  lastLedger,
  lastTxHash: '',
  lastEventIndex: 0,
});

const makeService = (overrides: {
  rpcUrl?: string;
  contractId?: string;
  network?: string;
  cursorLedger?: number;
}) => {
  const configGet = jest.fn((key: string) => {
    if (key === 'SOROBAN_RPC_URL') return overrides.rpcUrl ?? '';
    if (key === 'SOROBAN_CORE_GAME_CONTRACT_ID') return overrides.contractId ?? '';
    if (key === 'SOROBAN_NETWORK') return overrides.network ?? 'testnet';
    return undefined;
  });

  const cursorService = {
    getOrCreate: jest.fn().mockResolvedValue(makeCursor(overrides.cursorLedger ?? 0)),
    checkpoint: jest.fn().mockResolvedValue(undefined),
  } as unknown as CursorService;

  const eventProcessor = {
    process: jest.fn().mockResolvedValue(true),
  } as unknown as EventProcessorService;

  const svc = new IndexerService(
    eventProcessor,
    new EventNormalizerService(),
    cursorService,
    { get: configGet } as unknown as ConfigService,
  );

  return { svc, cursorService, eventProcessor };
};

describe('IndexerService.poll', () => {
  it('returns 0 and warns when RPC env vars are missing', async () => {
    const { svc } = makeService({ rpcUrl: '', contractId: '' });
    const result = await svc.poll();
    expect(result).toBe(0);
  });

  it('fetches, normalizes, orders and ingests events', async () => {
    const { svc, eventProcessor } = makeService({
      rpcUrl: 'http://rpc',
      contractId: 'CABC',
      cursorLedger: 10,
    });

    const rawEvents = [
      { contractId: 'CABC', topic: 'session_finalized', txHash: 'tx1', ledger: 12, eventIndex: 1, payload: {} },
      { contractId: 'CABC', topic: 'session_finalized', txHash: 'tx1', ledger: 11, eventIndex: 0, payload: {} },
    ];

    jest.spyOn(svc, 'fetchEvents').mockResolvedValue(rawEvents);

    const count = await svc.poll();

    expect(count).toBe(2);
    // Verify deterministic ordering: ledger 11 ingested before ledger 12
    const calls = (eventProcessor.process as jest.Mock).mock.calls;
    expect(calls[0][0].ledger).toBe(11);
    expect(calls[1][0].ledger).toBe(12);
  });

  it('skips invalid events (missing contractId)', async () => {
    const { svc, eventProcessor } = makeService({
      rpcUrl: 'http://rpc',
      contractId: 'CABC',
    });

    jest.spyOn(svc, 'fetchEvents').mockResolvedValue([
      { contractId: '', topic: 'session_finalized', txHash: 'tx1', ledger: 5, eventIndex: 0 },
    ]);

    const count = await svc.poll();
    expect(count).toBe(0);
    expect(eventProcessor.process).not.toHaveBeenCalled();
  });

  it('passes afterLedger from cursor to fetchEvents', async () => {
    const { svc } = makeService({ rpcUrl: 'http://rpc', contractId: 'CABC', cursorLedger: 42 });
    const fetchSpy = jest.spyOn(svc, 'fetchEvents').mockResolvedValue([]);

    await svc.poll();

    expect(fetchSpy).toHaveBeenCalledWith('http://rpc', 'CABC', 42);
  });

  it('uses INDEXER_STREAM_CORE_GAME stream key for cursor', async () => {
    const { svc, cursorService } = makeService({ rpcUrl: 'http://rpc', contractId: 'CABC' });
    jest.spyOn(svc, 'fetchEvents').mockResolvedValue([]);

    await svc.poll();

    expect(cursorService.getOrCreate).toHaveBeenCalledWith('testnet', INDEXER_STREAM_CORE_GAME);
  });
});
