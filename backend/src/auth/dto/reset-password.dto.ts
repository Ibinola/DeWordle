import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token', description: 'Password reset token' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newStrongPassword123', minLength: 8, description: 'New password (min 8 chars)' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
