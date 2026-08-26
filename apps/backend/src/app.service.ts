import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Welcome to NestJS Backend API!';
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
