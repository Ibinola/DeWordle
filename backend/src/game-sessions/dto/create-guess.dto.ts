import { Word } from 'src/entities/word.entity';
import { IsString, Length } from 'class-validator';

export class CreateGuessDto {
  @IsString({ message: 'Guess must be a string.' })
  @Length(5, 5, { message: 'Guess must be exactly 5 characters long.' })
  guess: Word['word'];
}
