import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionProjectionEntity } from '../entities/session-projection.entity';
import { IngestedEventDto } from '../dto/ingested-event.dto';

@Injectable()
export class ProjectionService {
  private readonly logger = new Logger(ProjectionService.name);

  constructor(
    @InjectRepository(SessionProjectionEntity)
    private readonly sessionsRepo: Repository<SessionProjectionEntity>,
  ) {}

  /**
   * Applies an event to the projection. Idempotent: replaying the same
   * session_finalized event produces the same projection state (upsert by sessionId).
   */
  async apply(event: IngestedEventDto): Promise<boolean> {
    if (event.topic !== 'session_finalized') {
      return false;
    }

    const sessionId = String(event.payload.sessionId ?? '');
    if (!sessionId) {
      this.logger.warn(`session_finalized event missing sessionId txHash=${event.txHash}`);
      return false;
    }

    const existing = await this.sessionsRepo.findOne({
      where: { network: event.network, sessionId },
    });

    const projection = this.sessionsRepo.create({
      id: existing?.id,
      network: event.network,
      sessionId,
      player: String(event.payload.player ?? ''),
      dayId: Number(event.payload.dayId ?? 0),
      status: String(event.payload.status ?? 'Finalized'),
      attemptsUsed: Number(event.payload.attemptsUsed ?? 0),
      finalized: true,
    });

    await this.sessionsRepo.save(projection);
    return true;
  }
}
