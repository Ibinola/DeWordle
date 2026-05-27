import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IngestedEventDto } from './dto/ingested-event.dto';
import { EventProcessorService } from './processors/event-processor.service';
import { CursorService } from './projections/cursor.service';
import { INDEXER_STREAM_CORE_GAME } from './indexer.constants';

/** Observability counters for indexer health metrics. */
export interface IndexerMetrics {
  ingestedTotal: number;
  replaySkips: number;
  projectionErrors: number;
  pollCycles: number;
  lastCursorLedger: number;
}

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  readonly metrics: IndexerMetrics = {
    ingestedTotal: 0,
    replaySkips: 0,
    projectionErrors: 0,
    pollCycles: 0,
    lastCursorLedger: 0,
  };

  constructor(
    private readonly eventProcessor: EventProcessorService,
    private readonly cursorService: CursorService,
    private readonly configService: ConfigService,
  ) {}

  async ingest(event: IngestedEventDto) {
    const t0 = Date.now();
    try {
      await this.eventProcessor.process(event);
      await this.cursorService.checkpoint(
        event.network,
        INDEXER_STREAM_CORE_GAME,
        event.ledger,
        event.txHash,
        event.eventIndex,
      );
      this.metrics.ingestedTotal++;
      this.metrics.lastCursorLedger = event.ledger;
      this.logger.log({
        msg: 'indexer.ingest.ok',
        topic: event.topic,
        ledger: event.ledger,
        txHash: event.txHash,
        eventIndex: event.eventIndex,
        latencyMs: Date.now() - t0,
      });
    } catch (err) {
      this.metrics.projectionErrors++;
      this.logger.error({
        msg: 'indexer.ingest.error',
        topic: event.topic,
        ledger: event.ledger,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  async poll() {
    const network =
      (this.configService.get<string>('SOROBAN_NETWORK') as 'testnet' | 'mainnet') ||
      'testnet';
    const rpcUrl = this.configService.get<string>('SOROBAN_RPC_URL');
    const contractId = this.configService.get<string>('SOROBAN_CORE_GAME_CONTRACT_ID');

    const cursor = await this.cursorService.getOrCreate(network, INDEXER_STREAM_CORE_GAME);
    this.metrics.pollCycles++;
    this.metrics.lastCursorLedger = cursor.lastLedger;

    this.logger.log({
      msg: 'indexer.poll.tick',
      network,
      rpc: rpcUrl ?? 'unset',
      contract: contractId ?? 'unset',
      cursorLedger: cursor.lastLedger,
      cursorTxHash: cursor.lastTxHash,
      cursorEventIndex: cursor.lastEventIndex,
      metrics: { ...this.metrics },
    });

    // Phase 2 scaffold:
    // 1. Fetch events after cursor
    // 2. Normalize and validate each event
    // 3. Ingest in deterministic order (ledger, txHash, eventIndex)
    // 4. Checkpoint after each successful projection
  }

  recordReplaySkip(ledger: number, txHash: string, eventIndex: number) {
    this.metrics.replaySkips++;
    this.logger.warn({
      msg: 'indexer.replay.skip',
      ledger,
      txHash,
      eventIndex,
      totalSkips: this.metrics.replaySkips,
    });
  }
}
