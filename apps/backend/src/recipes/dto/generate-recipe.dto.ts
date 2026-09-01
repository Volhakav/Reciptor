import { IsArray, IsString, IsOptional, IsInt } from 'class-validator';

export class GenerateRecipeDto {
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsString()
  dietType: string;

  @IsOptional()
  @IsInt()
  servings?: number;
}
