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

    let recipe: any = null;

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
        recipe = JSON.parse(jsonText);
      } catch (error) {
        console.error(
          '[GeminiService] Error calling Gemini API, using smart culinary generator:',
          error,
        );
      }
    }

    // Smart culinary generator fallback if API key is not set or API call fails
    if (!recipe) {
      const mainIngredient = dto.ingredients[0] || 'Fresh Ingredients';
      const dietLabel =
        dto.dietType === 'weight_loss'
          ? 'Fit & Light'
          : dto.dietType === 'keto'
            ? 'Keto Delight'
            : 'Chef Special';

      recipe = {
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

    // Attach a dish image (real food photo from a free API, local illustration as fallback).
    if (recipe) {
      recipe.imageData = await this.buildDishImage(recipe, dto);
    }

    return recipe;
  }

  /**
   * Builds a ready-to-use `data:` URL with a picture of a dish.
   * Tries to download a real food photo from TheMealDB (free, no API key),
   * and falls back to a locally generated SVG illustration when the network is unavailable.
   */
  private async buildDishImage(recipe: any, dto: GenerateRecipeDto): Promise<string> {
    const photo = await this.fetchDishPhoto(recipe, dto);
    if (photo) return photo;
    return this.buildLocalIllustration(recipe);
  }

  /** Looks up a matching meal photo on TheMealDB and returns it as a base64 data URL. */
  private async fetchDishPhoto(recipe: any, dto: GenerateRecipeDto): Promise<string | null> {
    const queries = this.buildPhotoQueries(recipe, dto);

    for (const query of queries) {
      try {
        const meals = await this.mealDbRequest(query);
        if (!meals || meals.length === 0) continue;

        // Deterministic pick so the same dish always shows the same photo.
        const index = Math.abs(this.hash(recipe.title || '')) % meals.length;
        const meal = meals[index];
        const thumb: string | undefined = meal?.strMealThumb;
        if (!thumb) continue;

        const dataUrl = await this.downloadAsDataUrl(thumb);
        if (dataUrl) return dataUrl;
      } catch {
        // ignore and try the next query
      }
    }

    return null;
  }

  private buildPhotoQueries(recipe: any, dto: GenerateRecipeDto): string[] {
    const queries: string[] = [];

    const ingredients: string[] = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((i: any) => String(i?.name || ''))
      : [];
    const all = [...ingredients, ...(dto.ingredients || [])];

    const seen = new Set<string>();
    for (const raw of all) {
      const name = raw.toLowerCase().trim();
      if (!name) continue;
      // Use the main word of an ingredient ("chicken breast" -> "chicken").
      const main = name.split(/[\s,]+/)[0].replace(/[^a-z]/g, '');
      if (!main || seen.has(main)) continue;
      seen.add(main);
      queries.push(`filter.php?i=${encodeURIComponent(main)}`);
    }

    // Also try the dish title itself (TheMealDB search works on partial names).
    const titleWords = String(recipe.title || '')
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'and', 'bowl', 'easy', 'quick'].includes(w));
    if (titleWords.length > 0) {
      queries.push(`search.php?s=${encodeURIComponent(titleWords[0])}`);
    }

    return queries;
  }

  private async mealDbRequest(query: string): Promise<any[]> {
    const url = `https://www.themealdb.com/api/json/v1/1/${query}`;
    const response = await this.httpGet(url, 6000);
    if (!response.ok) return [];
    const json: any = await response.json();
    return Array.isArray(json?.meals) ? json.meals : [];
  }

  private async downloadAsDataUrl(url: string): Promise<string | null> {
    const response = await this.httpGet(url, 8000);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    // Keep the payload sane (avoid storing huge images in the database).
    if (buffer.length === 0 || buffer.length > 3 * 1024 * 1024) return null;

    return `data:${contentType.split(';')[0]};base64,${buffer.toString('base64')}`;
  }

  private async httpGet(url: string, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Reciptor/1.0' },
      });
    } finally {
      clearTimeout(timer);
    }
  }

  /** Offline fallback: a self-contained SVG illustration, no network required. */
  private buildLocalIllustration(recipe: any): string {
    const title = String(recipe?.title || 'Homemade Dish');
    const escaped = title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const accents = [
      ['#C1502E', '#E8A87C'],
      ['#3D4A2C', '#9CAF88'],
      ['#8A6B3F', '#D9C3A0'],
    ];
    const palette = accents[Math.abs(this.hash(title)) % accents.length];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF7ED"/>
          <stop offset="100%" stop-color="#F4EFE3"/>
        </linearGradient>
        <radialGradient id="plate" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#EDE4D3"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <circle cx="400" cy="215" r="150" fill="url(#plate)" stroke="#D8CFB8" stroke-width="4"/>
      <circle cx="400" cy="215" r="112" fill="none" stroke="#E3DCC8" stroke-width="3"/>
      <ellipse cx="365" cy="205" rx="62" ry="44" fill="${palette[0]}" opacity="0.9"/>
      <ellipse cx="440" cy="235" rx="54" ry="38" fill="${palette[1]}" opacity="0.95"/>
      <circle cx="415" cy="180" r="22" fill="#E0B04A" opacity="0.9"/>
      <circle cx="352" cy="250" r="16" fill="#7C9A5B" opacity="0.9"/>
      <circle cx="470" cy="188" r="13" fill="#7C9A5B" opacity="0.9"/>
      <text x="400" y="405" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#2B2E23">${escaped}</text>
      <text x="400" y="440" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" letter-spacing="3" fill="#8A6B3F">RECIPTOR AI</text>
    </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  private hash(value: string): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
      h = (h << 5) - h + value.charCodeAt(i);
      h |= 0;
    }
    return h;
  }
}
