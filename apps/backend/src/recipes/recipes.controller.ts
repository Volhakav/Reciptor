import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  generate(@Body() dto: GenerateRecipeDto) {
    return this.recipesService.generate(dto);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  getFavorites(@Req() req, @Query('page') page: string = '1', @Query('limit') limit: string = '6') {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    return this.recipesService.getFavorites(req.user.id, pageNum, limitNum);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  saveToFavorites(@Param('id') recipeId: string, @Req() req) {
    return this.recipesService.saveToFavorites(req.user.id, recipeId);
  }
}
