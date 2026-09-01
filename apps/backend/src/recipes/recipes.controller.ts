import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('generate')
  generate(@Body() dto: GenerateRecipeDto) {
    return this.recipesService.generate(dto);
  }

  @Post(':id/save')
  saveToFavorites(@Param('id') recipeId: string) {
    // Demo userId for testing (will be replaced with JWT Auth User ID)
    const demoUserId = 'demo-user-id';
    return this.recipesService.saveToFavorites(demoUserId, recipeId);
  }

  @Get('favorites')
  getFavorites() {
    // Demo userId for testing (will be replaced with JWT Auth User ID)
    const demoUserId = 'demo-user-id';
    return this.recipesService.getFavorites(demoUserId);
  }
}
