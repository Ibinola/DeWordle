import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { User } from 'src/auth/entities/user.entity';
import { GuessHistory } from './guess-history.entity';
import { GameSessionStatus } from '../game-sessions.constants';

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, { nullable: true })
  user: User;

  @ManyToOne(() => Game, (game) => game.sessions, { nullable: false })
  game: Game;

  @Column()
  score: number;

  @Column()
  durationSeconds: number;

  @Column({ type: 'enum', enum: GameSessionStatus, default: GameSessionStatus.IN_PROGRESS })
  status: GameSessionStatus;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  playedAt: Date;

  @Column({ length: 5, select: false })
  solution: string;

  @OneToMany(() => GuessHistory, (guess) => guess.session, {
    cascade: ['insert'],
    eager: false,
  })
  history: GuessHistory[];

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { solution, ...rest } = this;
    return rest;
  }
}
