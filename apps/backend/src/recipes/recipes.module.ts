import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [AuthModule, PrismaModule, GeminiModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
