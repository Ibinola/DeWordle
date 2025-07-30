import {
  IsEmail,
  IsString,
  MinLength,
  IsEthereumAddress,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    format: 'text',
  })
  username: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @Optional()
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b8D8Cc6f9b2F3d217',
    pattern: '^0x[a-fA-F0-9]{40}$',
  })
  @IsEthereumAddress()
  walletAddress: string;
}
