import {
  IsInt,
  IsOptional,
  IsJSON,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestMetadataDto {
  @IsOptional()
  @IsString()
  guestId?: string;
}

export class CreateSessionDto {
  @IsInt()
  gameId: number;

  @IsInt()
  score: number;

  @IsInt()
  durationSeconds: number;

  @IsOptional()
  @IsJSON()
  @ValidateNested()
  @Type(() => GuestMetadataDto)
  metadata?: Record<string, any>;
}
