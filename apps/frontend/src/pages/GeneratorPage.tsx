import React, { useState } from 'react';
import { api } from '../api/client';
import { ChefHat, Sparkles, Plus, X, Check, AlertCircle, Heart, Utensils } from 'lucide-react';

interface RecipeResult {
  id?: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  ingredients: Array<{ name: string; amount: number; unit: string }>;
  instructions: Array<{ step: number; title: string; text: string }>;
}

export const GeneratorPage: React.FC = () => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([
    'chicken breast',
    'eggs',
    'spinach',
    'cheese',
  ]);
  const [dietType, setDietType] = useState('weight_loss');
  const [servings, setServings] = useState(1);
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (item: string) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient!');
      return;
    }

    setError('');
    setLoading(true);
    setRecipe(null);
    setSaved(false);

    try {
      const response = await api.post('/recipes/generate', {
        ingredients,
        dietType,
        servings,
      });

      setRecipe(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFavorites = async () => {
    if (!recipe?.id) return;
    try {
      await api.post(`/recipes/${recipe.id}/save`);
      setSaved(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4EFE3] text-[#2B2E23] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFDF8] border border-[#D8CFB8] text-[#8A6B3F] text-xs font-medium rounded-sm">
            <ChefHat className="w-4 h-4 text-[#C1502E]" />
            <span>Reciptor AI Culinary Book</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2B2E23]">
            What are we cooking today?
          </h1>
          <p className="text-[14px] text-[#6B6858] max-w-xl mx-auto">
            Select ingredients from your kitchen and choose your diet goal — Gemini AI will tailor
            the perfect home recipe!
          </p>
        </div>

        {/* Generator Controls Card (Vintage Recipe Notebook Style) */}
        <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative px-6 py-8 sm:px-8 shadow-sm space-y-6">
          {/* Stitched edge */}
          <div
            className="absolute left-0 top-5 bottom-5 w-[2px]"
            style={{
              background:
                'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
            }}
          />

          <div className="pl-1.5 space-y-6">
            {/* Ingredients Input */}
            <div>
              <label className="block text-xs font-semibold text-[#5C5A4E] mb-2">
                Available ingredients (type and press Enter or +):
              </label>
              <form onSubmit={handleAddIngredient} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="e.g. ripe tomatoes, fresh basil, parmesan"
                  className="flex-1 h-10 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-sm text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] rounded-sm transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {/* Ingredients Chips */}
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 bg-[#F4EFE3] border border-[#D8CFB8] text-[#2B2E23] px-3 py-1 rounded-sm text-xs font-medium"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveIngredient(item)}
                      className="hover:text-[#C1502E] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Diet Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C5A4E] mb-2">
                  Diet Goal / Type:
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full h-10 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-sm text-sm text-[#2B2E23] focus:outline-none focus:border-[#C1502E]"
                >
                  <option value="weight_loss">🔥 Weight Loss (Calorie deficit)</option>
                  <option value="weight_gain">💪 Muscle Gain (High protein)</option>
                  <option value="keto">🥑 Keto Diet (Low carb)</option>
                  <option value="balanced">🥗 Balanced Home Meal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C5A4E] mb-2">Servings:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-sm text-sm text-[#2B2E23] focus:outline-none focus:border-[#C1502E]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#FAECE7] border border-[#F0997B] rounded-sm flex items-center gap-2 text-[#993C1D] text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-11 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Gemini Chef is crafting your recipe…</span>
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>Generate Recipe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipe Result Card */}
        {recipe && (
          <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative px-6 py-8 sm:px-8 shadow-sm space-y-6">
            <div
              className="absolute left-0 top-5 bottom-5 w-[2px]"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #3D4A2C 0 6px, transparent 6px 12px)',
              }}
            />

            <div className="pl-1.5 space-y-6">
              {/* Title & Save Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DCC8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2E23] mb-1">
                    {recipe.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B6858] leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {recipe.id && (
                  <button
                    onClick={handleSaveToFavorites}
                    disabled={saved}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors shrink-0 ${
                      saved
                        ? 'bg-[#FAECE7] text-[#993C1D] border border-[#F0997B]'
                        : 'bg-[#3D4A2C] hover:bg-[#2B351E] text-[#FFFBF2]'
                    }`}
                  >
                    {saved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Heart className="w-4 h-4 fill-current" />
                    )}
                    <span>{saved ? 'Saved!' : 'Save Recipe'}</span>
                  </button>
                )}
              </div>

              {/* Nutrition Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">
                    Calories
                  </span>
                  <span className="text-base font-bold text-[#C1502E]">{recipe.calories} kcal</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">
                    Proteins
                  </span>
                  <span className="text-base font-bold text-[#3D4A2C]">{recipe.proteins} g</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">Fats</span>
                  <span className="text-base font-bold text-[#8A6B3F]">{recipe.fats} g</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">Carbs</span>
                  <span className="text-base font-bold text-[#2B2E23]">{recipe.carbs} g</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">
                    Prep Time
                  </span>
                  <span className="text-base font-bold text-[#2B2E23]">
                    {recipe.prepTimeMinutes} min
                  </span>
                </div>
              </div>

              {/* Ingredients & Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Ingredients */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-semibold text-[#2B2E23] flex items-center gap-2">
                    <span>🥗 Ingredients</span>
                  </h3>
                  <ul className="space-y-2 bg-[#FFFDF8] border border-[#D8CFB8] p-4 rounded-sm">
                    {recipe.ingredients.map((ing, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-xs sm:text-sm border-b border-[#E3DCC8] last:border-0 py-1.5"
                      >
                        <span className="text-[#2B2E23] font-medium">{ing.name}</span>
                        <span className="font-semibold text-[#C1502E]">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-semibold text-[#2B2E23] flex items-center gap-2">
                    <span>👨‍🍳 Instructions</span>
                  </h3>
                  <div className="space-y-3">
                    {recipe.instructions.map((step) => (
                      <div
                        key={step.step}
                        className="bg-[#FFFDF8] border border-[#D8CFB8] p-3.5 rounded-sm space-y-1"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#C1502E]">
                          <span className="bg-[#FAECE7] px-2 py-0.5 rounded-sm">
                            Step {step.step}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5C5A4E] leading-relaxed pt-0.5">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
