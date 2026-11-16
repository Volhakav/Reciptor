import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Registration
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new BadRequestException('User with this email already exists');
      }
      if (dto.phone && existingUser.phone === dto.phone) {
        throw new BadRequestException('User with this phone number already exists');
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        gender: dto.gender,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        lastGenDate: new Date(),
      },
    });

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Change password
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password changed successfully' };
  }

  // Check availability of email/phone
  async checkAvailability(dto: CheckAvailabilityDto) {
    const result: { email?: { available: boolean }; phone?: { available: boolean } } = {};

    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      result.email = { available: !existing };
    }

    if (dto.phone) {
      const existing = await this.prisma.user.findFirst({
        where: { phone: dto.phone },
      });
      result.phone = { available: !existing };
    }

    return result;
  }

  // LogIn
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Not valid email or password');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Not valid email or password');
    }
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
