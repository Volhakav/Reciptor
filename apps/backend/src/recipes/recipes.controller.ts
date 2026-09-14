import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  saveToFavorites(@Param('id') recipeId: string, @Req() req) {
    return this.recipesService.saveToFavorites(req.user.id, recipeId);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  getFavorites(@Req() req) {
    return this.recipesService.getFavorites(req.user.id);
  }
}
