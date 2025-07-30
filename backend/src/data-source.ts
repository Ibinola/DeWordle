import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TestEntity } from './entities/test.entity';
import { Word } from './entities/word.entity';
import { GameSession } from './game-sessions/entities/game-session.entity';
import { User } from './auth/entities/user.entity';
import { Game } from './games/entities/game.entity';
import * as path from 'path';
import { GuessHistory } from './game-sessions/entities/guess-history.entity';

// Load .env.development for local development, fallback to .env
const envPath =
  process.env.NODE_ENV === 'production'
    ? '.env'
    : path.join(__dirname, '..', '.env.development');

config({ path: envPath });

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: Number.parseInt(configService.get('DB_PORT') ?? '5432', 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  ssl:
    configService.get('DB_SSL') === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  entities: [TestEntity, Word, Game, User, GameSession, GuessHistory],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
