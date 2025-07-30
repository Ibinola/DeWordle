import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { GameSession } from './game-session.entity';

@Entity('guess_history')
@Index(['session', 'attemptNumber'], { unique: true })
export class GuessHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GameSession, (session) => session.history, {
    onDelete: 'CASCADE',
  })
  session: GameSession;

  @Column({ length: 5 })
  guess: string;

  @Column({ type: 'jsonb' })
  result: Array<{
    letter: string;
    status: 'correct' | 'present' | 'absent';
  }>;

  @Column({ type: 'int' })
  attemptNumber: number;

  @CreateDateColumn()
  createdAt: Date;
}
