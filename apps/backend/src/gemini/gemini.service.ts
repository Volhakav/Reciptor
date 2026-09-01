import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GenerateRecipeDto } from '../recipes/dto/generate-recipe.dto';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables!');
    }
    // Initialize Gemini AI Client with provided API key
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async generateRecipe(dto: GenerateRecipeDto) {
    // Construct detailed prompt for Gemini AI
    const prompt = `
    You are a professional chef and nutritionist.
    Generate a creative, delicious, and healthy recipe using these available ingredients: ${dto.ingredients.join(', ')}.
    Take into account the target diet type: ${dto.dietType} (e.g. weight_loss for lower calories/carbs, weight_gain for higher protein/calories, keto for low carb).
    Number of servings: ${dto.servings || 1}.

    Return the output STRICTLY in valid JSON format matching this exact schema:
    {
      "title": "Recipe Name",
      "description": "Short appetizing description of the dish",
      "prepTimeMinutes": 25,
      "calories": 450,
      "proteins": 35,
      "fats": 12,
      "carbs": 40,
      "ingredients": [
        { "name": "Chicken Breast", "amount": 200, "unit": "g" }
      ],
      "instructions": [
        { "step": 1, "title": "Preparation", "text": "Dice the chicken breast..." }
      ]
    }
    `;

    try {
      // Call Gemini 2.0 Flash model requesting JSON output
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json', // Guarantees clean JSON without markdown blocks
        },
      });

      const jsonText = response.text || '{}';
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Error generating recipe with Gemini:', error);
      throw new InternalServerErrorException('Failed to generate recipe via Gemini AI');
    }
  }
}
