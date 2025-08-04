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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailService } from './email.service';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,
    private readonly emailService: EmailService,
  ) {}
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) return; // Do not reveal if user exists

    // Generate token and hash
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    // Remove old tokens for this user
    await this.passwordResetRepo.delete({ user: { id: user.id } });

    // Store hashed token
    const reset = this.passwordResetRepo.create({
      tokenHash,
      expiresAt,
      user,
    });
    await this.passwordResetRepo.save(reset);

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const html = `<p>You requested a password reset. <a href="${resetUrl}">Click here to reset your password</a>. This link will expire in 30 minutes.</p>`;
    await this.emailService.sendMail(user.email, 'Password Reset Request', html);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const reset = await this.passwordResetRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
    if (!reset || reset.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    reset.user.password = hashed;
    await this.userService.create(reset.user); // save updated user

    // Invalidate token
    await this.passwordResetRepo.delete({ id: reset.id });
  }

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
