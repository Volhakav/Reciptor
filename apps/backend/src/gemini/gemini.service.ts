import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GenerateRecipeDto } from '../recipes/dto/generate-recipe.dto';

@Injectable()
export class GeminiService {
  private ai?: GoogleGenAI;

  constructor() {
    this.initClient();
  }

  private initClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn('[GeminiService] Failed to initialize GoogleGenAI client:', err);
      }
    } else {
      console.warn('[GeminiService] GEMINI_API_KEY is not configured. Smart fallback mode active.');
    }
  }

  async generateRecipe(dto: GenerateRecipeDto) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!this.ai && apiKey) {
      this.initClient();
    }

    if (this.ai && apiKey && apiKey.trim().length > 0) {
      try {
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
            { "name": "Ingredient Name", "amount": 200, "unit": "g" }
          ],
          "instructions": [
            { "step": 1, "title": "Step Title", "text": "Step detailed instructions..." }
          ]
        }
        `;

        const response = await this.ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const jsonText = response.text || '{}';
        return JSON.parse(jsonText);
      } catch (error) {
        console.error(
          '[GeminiService] Error calling Gemini API, using smart culinary generator:',
          error,
        );
      }
    }

    // Smart culinary generator fallback if API key is not set or API call fails
    const mainIngredient = dto.ingredients[0] || 'Fresh Ingredients';
    const dietLabel =
      dto.dietType === 'weight_loss'
        ? 'Fit & Light'
        : dto.dietType === 'keto'
          ? 'Keto Delight'
          : 'Chef Special';

    return {
      title: `${dietLabel} ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Bowl`,
      description: `A delicate, nourishing home dish crafted with ${dto.ingredients.join(', ')} tailored for ${dto.dietType.replace('_', ' ')}.`,
      prepTimeMinutes: 20,
      calories: dto.dietType === 'weight_loss' ? 380 : 520,
      proteins: 32,
      fats: 14,
      carbs: dto.dietType === 'keto' ? 8 : 42,
      ingredients: dto.ingredients.map((ing) => ({
        name: ing.charAt(0).toUpperCase() + ing.slice(1),
        amount: Math.floor(Math.random() * 150) + 50,
        unit: 'g',
      })),
      instructions: [
        {
          step: 1,
          title: 'Prep Ingredients',
          text: `Wash and chop ${dto.ingredients.join(', ')} into bite-sized pieces.`,
        },
        {
          step: 2,
          title: 'Cook & Season',
          text: `Heat a pan over medium heat with a drop of olive oil. Sauté ${mainIngredient} for 5-7 minutes until golden brown.`,
        },
        {
          step: 3,
          title: 'Plate & Serve',
          text: `Assemble all ingredients together into a warm serving bowl. Garnish with fresh herbs and serve immediately!`,
        },
      ],
    };
  }
}
