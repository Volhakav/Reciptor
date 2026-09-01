import { Injectable } from '@nestjs/common';
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

  // 2. Add recipe to user's favorites
  async saveToFavorites(userId: string, recipeId: string) {
    return this.prisma.savedRecipe.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  // 3. Get all saved recipes for user
  async getFavorites(userId: string) {
    return this.prisma.savedRecipe.findMany({
      where: { userId },
      include: {
        recipe: true,
      },
    });
  }
}
