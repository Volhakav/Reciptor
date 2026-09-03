import React, { useState } from 'react';
import { api } from '../api/client';
import { Utensils, Sparkles, Plus, X, Check, AlertCircle, Heart } from 'lucide-react';

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
    'куриное филе',
    'яйца',
    'шпинат',
    'сыр',
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
      setError('Добавьте хотя бы один ингредиент!');
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
      setError(err.response?.data?.message || 'Ошибка генерации рецепта. Попробуйте снова.');
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-stone-100 text-stone-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Умная кулинарная книга Gemini AI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Что сегодня приготовим?
          </h1>
          <p className="text-stone-600 text-base max-w-xl mx-auto">
            Укажите продукты из вашего холодильника и выберите цель диеты — шеф-повар Gemini
            подберет уютный идеальный рецепт!
          </p>
        </div>

        {/* Generator Controls Card */}
        <div className="bg-white border border-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 space-y-6">
          {/* Ingredients Input */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Имеющиеся продукты (введите и нажмите Enter или +):
            </label>
            <form onSubmit={handleAddIngredient} className="flex gap-2 mb-3">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                placeholder="например: спелые томаты, свежий базилик, пармезан"
                className="flex-1 bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-2xl transition-colors shadow-md shadow-amber-500/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            {/* Ingredients Chips */}
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 bg-amber-100/80 border border-amber-200/80 text-amber-900 px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-xs"
                >
                  {item}
                  <button
                    onClick={() => handleRemoveIngredient(item)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Diet Type Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Цель / Тип диеты:
              </label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              >
                <option value="weight_loss">🔥 Похудение (Дефицит калорий)</option>
                <option value="weight_gain">💪 Набор массы (Белки + Калории)</option>
                <option value="keto">🥑 Кето-диета (Низкоуглеводная)</option>
                <option value="balanced">🥗 Сбалансированное домашнее питание</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Порций:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Шеф-повар Gemini готовит домашний рецепт...</span>
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                <span>Сгенерировать блюдо</span>
              </>
            )}
          </button>
        </div>

        {/* Recipe Result Card */}
        {recipe && (
          <div className="bg-white border border-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 space-y-6">
            {/* Title & Save Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
                  {recipe.title}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">{recipe.description}</p>
              </div>

              {recipe.id && (
                <button
                  onClick={handleSaveToFavorites}
                  disabled={saved}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shrink-0 ${
                    saved
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 hover:from-amber-600 hover:to-orange-600'
                  }`}
                >
                  {saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Heart className="w-4 h-4 fill-current" />
                  )}
                  <span>{saved ? 'В любимых!' : 'Сохранить рецепт'}</span>
                </button>
              )}
            </div>

            {/* KBZhU Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-amber-50/80 border border-amber-200/60 p-3 rounded-2xl text-center">
                <span className="text-xs text-amber-800 font-semibold block mb-1">Калории</span>
                <span className="text-lg font-black text-amber-900">{recipe.calories} ккал</span>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200/60 p-3 rounded-2xl text-center">
                <span className="text-xs text-emerald-800 font-semibold block mb-1">Белки</span>
                <span className="text-lg font-black text-emerald-900">{recipe.proteins} г</span>
              </div>
              <div className="bg-sky-50/80 border border-sky-200/60 p-3 rounded-2xl text-center">
                <span className="text-xs text-sky-800 font-semibold block mb-1">Жиры</span>
                <span className="text-lg font-black text-sky-900">{recipe.fats} г</span>
              </div>
              <div className="bg-purple-50/80 border border-purple-200/60 p-3 rounded-2xl text-center">
                <span className="text-xs text-purple-800 font-semibold block mb-1">Углеводы</span>
                <span className="text-lg font-black text-purple-900">{recipe.carbs} г</span>
              </div>
              <div className="bg-stone-100 border border-stone-200 p-3 rounded-2xl text-center col-span-2 sm:col-span-1">
                <span className="text-xs text-stone-600 font-semibold block mb-1">Время</span>
                <span className="text-lg font-black text-stone-800">
                  {recipe.prepTimeMinutes} мин
                </span>
              </div>
            </div>

            {/* Ingredients & Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Ingredients */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <span>🥗 Ингредиенты</span>
                </h3>
                <ul className="space-y-2 bg-stone-50 border border-stone-200/80 p-4 rounded-2xl">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm border-b border-stone-200/60 last:border-0 py-2"
                    >
                      <span className="text-stone-700 font-medium">{ing.name}</span>
                      <span className="font-bold text-amber-700">
                        {ing.amount} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <span>👨‍🍳 Шаги приготовления</span>
                </h3>
                <div className="space-y-3">
                  {recipe.instructions.map((step) => (
                    <div
                      key={step.step}
                      className="bg-stone-50 border border-stone-200/80 p-4 rounded-2xl space-y-1"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                        <span className="bg-amber-200/60 text-amber-900 px-2.5 py-0.5 rounded-full">
                          Шаг {step.step}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
