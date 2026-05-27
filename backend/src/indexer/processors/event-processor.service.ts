import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestedEventDto } from '../dto/ingested-event.dto';
import { IngestedEventEntity } from '../entities/ingested-event.entity';
import { ProjectionService } from '../projections/projection.service';

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);
  private replaySkipCount = 0;

  constructor(
    @InjectRepository(IngestedEventEntity)
    private readonly eventsRepo: Repository<IngestedEventEntity>,
    private readonly projectionService: ProjectionService,
  ) {}

  async process(event: IngestedEventDto): Promise<boolean> {
    const exists = await this.eventsRepo.findOne({
      where: {
        network: event.network,
        txHash: event.txHash,
        eventIndex: event.eventIndex,
      },
    });

    if (exists) {
      this.replaySkipCount++;
      this.logger.debug(
        `Duplicate event skipped txHash=${event.txHash} eventIndex=${event.eventIndex} totalSkipped=${this.replaySkipCount}`,
      );
      return false;
    }

    await this.eventsRepo.save(this.eventsRepo.create(event));
    await this.projectionService.apply(event);
    return true;
  }

  getReplaySkipCount(): number {
    return this.replaySkipCount;
  }
}
