import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{
    access_token: string;
    user: {
      id: number;
      email: string;
      username: string;
    };
  }> {
    const { email, password, username } = signupDto;

    // Check if email already exists
    const existingByEmail = await this.userService.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserName = await this.userService.findByUserName(username);
    if (existingUserName) {
      throw new ConflictException('Username already exists');
    }

    // Check if wallet address already exists
    // const existingByWallet =
    //   await this.userService.findByWalletAddress(walletAddress);
    // if (existingByWallet) {
    //   throw new ConflictException('Wallet address already exists');
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await this.userService.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser.id, newUser.email);

    return {
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    user: {
      id: number;
      email: string;
    };
    success_message: string;
  }> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
      success_message: 'Sign in Successful',
    };
  }

  async getProfile(userId: number): Promise<{
    id: number;
    email: string;
    createdAt: Date;
  }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private generateToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
