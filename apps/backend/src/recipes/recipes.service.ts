import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  // 1. Generate new recipe via Gemini AI and store in PostgreSQL
  async generate(dto: GenerateRecipeDto) {
    const aiRecipe = await this.geminiService.generateRecipe(dto);

    const recipe = await this.prisma.recipe.create({
      data: {
        title: aiRecipe.title,
        description: aiRecipe.description,
        imageData: aiRecipe.imageData ?? null,
        ingredients: aiRecipe.ingredients,
        instructions: aiRecipe.instructions,
        dietType: dto.dietType,
        calories: aiRecipe.calories,
        proteins: aiRecipe.proteins,
        fats: aiRecipe.fats,
        carbs: aiRecipe.carbs,
        prepTimeMinutes: aiRecipe.prepTimeMinutes,
      },
    });

    return recipe;
  }

  // 2. Get single recipe details by ID
  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  // 3. Add recipe to user's favorites
  async saveToFavorites(userId: string, recipeId: string) {
    const existing = await this.prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.savedRecipe.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  // 4. Get paginated saved recipes for user
  async getFavorites(userId: string, page: number = 1, limit: number = 6) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.savedRecipe.count({
        where: { userId },
      }),
      this.prisma.savedRecipe.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          recipe: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
