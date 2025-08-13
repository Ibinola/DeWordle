import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, IsNull } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Word } from 'src/entities/word.entity';
import moment from 'moment-timezone';

@Injectable()
export class WordScheduler implements OnModuleInit {
  private readonly logger = new Logger(WordScheduler.name);

  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureTodayWord();
  }

  @Cron(process.env.DAILY_WORD_SCHEDULE || CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyWordSelection() {
    await this.ensureTodayWord();
  }

  async ensureTodayWord() {
    const timezone =
      this.configService.get<string>('DAILY_WORD_TIMEZONE') || 'UTC';
    const today = moment().tz(timezone).startOf('day').format('YYYY-MM-DD');
    const todayDate = new Date(today);

    const existing = await this.wordRepo.findOneBy({ dailyDate: todayDate });
    if (existing) {
      this.logger.log(`Daily word for ${today} already selected: ${existing.word}`);
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const unusedWord = await manager.findOne(Word, {
        where: { isDaily: false },
        order: { createdAt: 'ASC' },
      });

      if (!unusedWord) {
        this.logger.warn('Word pool exhausted. Resetting...');
        await manager.update(Word, { id: Not(IsNull()) }, { isDaily: false });
        return;
      }

      unusedWord.isDaily = true;
      unusedWord.dailyDate = todayDate;
      await manager.save(unusedWord);
      this.logger.log(`Selected new daily word: ${unusedWord.word}`);
    });
  }
}