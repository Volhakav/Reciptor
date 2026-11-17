import React, { useState } from 'react';
import { api } from '../api/client';
import {
  AlertCircle,
  Check,
  ChefHat,
  Flame,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/cn';

interface RecipeResult {
  id?: string;
  title: string;
  description: string;
  imageData?: string;
  prepTimeMinutes: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  ingredients: Array<{ name: string; amount: number; unit: string }>;
  instructions: Array<{ step: number; title: string; text: string }>;
}

const DIETS = [
  { value: 'weight_loss', emoji: '🔥', title: 'Weight loss', hint: 'Calorie deficit' },
  { value: 'weight_gain', emoji: '💪', title: 'Muscle gain', hint: 'High protein' },
  { value: 'keto', emoji: '🥑', title: 'Keto', hint: 'Low carb' },
  { value: 'balanced', emoji: '🥗', title: 'Balanced', hint: 'Everyday meal' },
];

const SUGGESTIONS = ['tomato', 'garlic', 'eggs', 'rice', 'avocado', 'mushrooms', 'salmon'];

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
    <div className="relative">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-50/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-500 via-brand-400 to-sun-500 px-6 py-8 text-white shadow-lift sm:px-10 sm:py-10">
          <span className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-berry-500/25 blur-3xl" />
          <span className="pointer-events-none absolute right-16 top-10 hidden h-24 w-24 rounded-full border border-white/30 sm:block" />

          {/* playful food cluster */}
          <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-52 w-52">
              <div className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20" />
              <div className="absolute inset-6 rounded-full border border-dashed border-white/25" />
              <span className="animate-float absolute left-3 top-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/90 text-[26px] leading-none shadow-soft">
                🥑
              </span>
              <span
                className="animate-float absolute right-2 top-16 grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-2xl leading-none shadow-soft"
                style={{ animationDelay: '-1.8s' }}
              >
                🍅
              </span>
              <span
                className="animate-float absolute bottom-6 left-10 grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-2xl leading-none shadow-soft"
                style={{ animationDelay: '-3.4s' }}
              >
                🥚
              </span>
              <span className="absolute bottom-2 right-8 grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-xl leading-none shadow-soft">
                🌿
              </span>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] ring-1 ring-white/25">
              <Sparkles className="h-3.5 w-3.5" />
              AI culinary studio
            </span>

            <h1 className="mt-4 font-display text-3xl leading-tight sm:text-[2.6rem]">
              What are we cooking today?
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-[15px]">
              Drop in what is already in your fridge, pick a goal, and get a complete recipe with
              macros, steps and a photo.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 text-[12px] font-semibold">
              {[
                { icon: Zap, text: 'Takes seconds' },
                { icon: Utensils, text: 'Full step-by-step' },
                { icon: Flame, text: 'Macros included' },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/20"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(320px,390px)_1fr] lg:items-start">
          {/* ================= FORM ================= */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6 lg:sticky lg:top-[5.5rem]">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ChefHat className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-ink">Build your recipe</h2>
                <p className="text-[11.5px] text-muted">
                  Everything below is optional except ingredients.
                </p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Your ingredients
              </p>

              <form onSubmit={handleAddIngredient} className="flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="e.g. ripe tomatoes, basil…"
                  className="h-11 flex-1 rounded-xl border border-line-strong bg-white px-3.5 text-sm text-ink placeholder:text-muted/55 transition-all focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
                <Button type="submit" size="md" className="!px-4" aria-label="Add ingredient">
                  <Plus className="h-4.5 w-4.5" />
                </Button>
              </form>

              {ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map((item) => (
                    <span
                      key={item}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-[12px] font-semibold text-brand-700 ring-1 ring-brand-100"
                    >
                      {item}
                      <button
                        onClick={() => handleRemoveIngredient(item)}
                        className="grid h-4.5 w-4.5 place-items-center rounded-full text-brand-500 transition-colors hover:bg-brand-100 hover:text-brand-700"
                        aria-label={`Remove ${item}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-canvas p-3 text-[12px] text-muted">
                  No ingredients yet — add at least one to continue.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted">Quick add:</span>
                {SUGGESTIONS.filter((s) => !ingredients.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => setIngredients([...ingredients, s])}
                    className="rounded-full border border-dashed border-line-strong px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet */}
            <div className="mt-5 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Diet goal</p>
              <div className="grid grid-cols-2 gap-2">
                {DIETS.map((diet) => {
                  const active = dietType === diet.value;
                  return (
                    <button
                      key={diet.value}
                      onClick={() => setDietType(diet.value)}
                      aria-pressed={active}
                      className={cn(
                        'rounded-2xl border p-3 text-left transition-all duration-200',
                        active
                          ? 'border-brand-300 bg-brand-50 shadow-xs'
                          : 'border-line bg-white hover:border-brand-200 hover:bg-brand-50/40',
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-lg leading-none">{diet.emoji}</span>
                        <span
                          className={cn(
                            'grid h-4 w-4 place-items-center rounded-full border transition-colors',
                            active
                              ? 'border-brand-500 bg-brand-500 text-white'
                              : 'border-line-strong',
                          )}
                        >
                          {active && <Check className="h-2.5 w-2.5" />}
                        </span>
                      </span>
                      <span className="mt-2 block text-[12.5px] font-bold text-ink">
                        {diet.title}
                      </span>
                      <span className="block text-[10.5px] text-muted">{diet.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Servings */}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
                Servings
              </p>
              <div className="flex items-center justify-between rounded-xl border border-line-strong bg-white p-1.5">
                <button
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
                  aria-label="Fewer servings"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold tabular-nums text-ink">
                  {servings} {servings === 1 ? 'person' : 'people'}
                </span>
                <button
                  onClick={() => setServings((s) => Math.min(10, s + 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
                  aria-label="More servings"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-berry-500/25 bg-berry-50 p-3 text-[12.5px] font-medium text-berry-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button size="lg" fullWidth loading={loading} onClick={handleGenerate} className="mt-5">
              {loading ? (
                'Cooking up your recipe…'
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  Generate recipe
                </>
              )}
            </Button>
          </section>

          {/* ================= RESULT ================= */}
          <div className="min-w-0">
            {loading && <RecipeSkeleton />}

            {!loading && !recipe && <EmptyState />}

            {!loading && recipe && (
              <article className="animate-rise overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
                {/* Image */}
                {recipe.imageData && (
                  <div className="relative">
                    <img
                      src={recipe.imageData}
                      alt={recipe.title}
                      loading="lazy"
                      onError={(e) => {
                        const wrapper = (e.currentTarget as HTMLImageElement).parentElement;
                        if (wrapper) wrapper.style.display = 'none';
                      }}
                      className="h-56 w-full object-cover sm:h-72"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-brand-700 shadow-xs">
                        {DIETS.find((d) => d.value === dietType)?.title ?? dietType}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-ink shadow-xs">
                        <Sparkles className="h-3 w-3 text-brand-500" />
                        AI recipe
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-6 p-5 sm:p-7">
                  {/* Title + actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl leading-tight text-ink sm:text-[1.75rem]">
                        {recipe.title}
                      </h2>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={handleGenerate}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-white text-muted transition-colors hover:border-brand-300 hover:text-brand-600"
                        title="Generate another"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Generate another</span>
                      </button>

                      {recipe.id && (
                        <Button
                          size="md"
                          variant={saved ? 'soft' : 'primary'}
                          onClick={handleSaveToFavorites}
                          disabled={saved}
                        >
                          {saved ? (
                            <>
                              <Check className="h-4 w-4" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Heart className="h-4 w-4" />
                              Save recipe
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      { label: 'Calories', value: recipe.calories, unit: 'kcal', tone: 'brand' },
                      { label: 'Protein', value: recipe.proteins, unit: 'g', tone: 'leaf' },
                      { label: 'Fats', value: recipe.fats, unit: 'g', tone: 'sun' },
                      { label: 'Carbs', value: recipe.carbs, unit: 'g', tone: 'berry' },
                    ].map((macro) => (
                      <div
                        key={macro.label}
                        className={cn(
                          'rounded-2xl border p-3 text-center',
                          macro.tone === 'brand' && 'border-brand-100 bg-brand-50',
                          macro.tone === 'leaf' && 'border-leaf-100 bg-leaf-50',
                          macro.tone === 'sun' && 'border-sun-500/20 bg-sun-50',
                          macro.tone === 'berry' && 'border-berry-500/15 bg-berry-50',
                        )}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                          {macro.label}
                        </p>
                        <p className="mt-0.5 text-lg font-extrabold tabular-nums text-ink">
                          {macro.value}
                          <span className="ml-0.5 text-[11px] font-bold text-muted">
                            {macro.unit}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-canvas px-3.5 py-2.5 text-[12px] font-semibold text-muted">
                    <Utensils className="h-4 w-4 text-brand-500" />
                    Ready in about {recipe.prepTimeMinutes} minutes
                  </div>

                  {/* Ingredients + steps */}
                  <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_1.15fr]">
                    <div>
                      <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted">
                        <span className="text-base">🥗</span> Ingredients
                      </h3>
                      <ul className="divide-y divide-line rounded-2xl border border-line bg-canvas/60 px-4">
                        {recipe.ingredients.map((ing, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between gap-3 py-2.5 text-[13px]"
                          >
                            <span className="font-medium text-ink">{ing.name}</span>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-bold text-brand-600 ring-1 ring-brand-100">
                              {ing.amount} {ing.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted">
                        <span className="text-base">🍳</span> Instructions
                      </h3>
                      <ol className="space-y-2.5">
                        {recipe.instructions.map((step) => (
                          <li
                            key={step.step}
                            className="flex gap-3 rounded-2xl border border-line bg-white p-3"
                          >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-[11.5px] font-bold text-white shadow-glow">
                              {step.step}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-bold text-ink">{step.title}</p>
                              <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                                {step.text}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- small presentational blocks ---------- */

const EmptyState: React.FC = () => (
  <div className="rounded-3xl border border-dashed border-line-strong bg-white/60 p-8 text-center sm:p-12">
    <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-500 ring-1 ring-brand-100">
      <ChefHat className="h-8 w-8" />
    </span>
    <h3 className="mt-4 font-display text-xl text-ink">Your recipe will appear here</h3>
    <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
      Add a few ingredients on the left and hit “Generate recipe”. We will do the thinking.
    </p>

    <div className="mx-auto mt-6 grid max-w-md gap-2 text-left">
      {[
        ['1', 'Add your ingredients', 'Anything you already have at home.'],
        ['2', 'Choose a diet goal', 'We balance macros around it.'],
        ['3', 'Cook with confidence', 'Clear steps, times and a photo.'],
      ].map(([step, title, text]) => (
        <div
          key={step}
          className="flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-line"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-600">
            {step}
          </span>
          <div>
            <p className="text-[12.5px] font-bold text-ink">{title}</p>
            <p className="text-[11.5px] text-muted">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecipeSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
    <div className="relative h-52 overflow-hidden bg-canvas-2 sm:h-64">
      <span className="animate-shimmer absolute inset-0" />
    </div>
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2 text-[12.5px] font-semibold text-brand-600">
        <Sparkles className="h-4 w-4 animate-spin" />
        Plating your dish…
      </div>
      <div className="h-7 w-2/3 animate-pulse rounded-lg bg-canvas-2" />
      <div className="h-4 w-full animate-pulse rounded-lg bg-canvas-2" />
      <div className="h-4 w-4/5 animate-pulse rounded-lg bg-canvas-2" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-canvas-2" />
        ))}
      </div>
    </div>
  </div>
);
