import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { AlertCircle, ArrowLeft, Clock, Droplet, Dumbbell, Flame, Wheat } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  imageData?: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  prepTimeMinutes: number;
  dietType: string;
  ingredients: Array<{ name: string; amount: number; unit: string }>;
  instructions: Array<{ step: number; title: string; text: string }>;
}

const dietLabel = (value: string) =>
  value.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/recipes/${id}`);
      setRecipe(response.data);
    } catch (err: any) {
      console.error('Failed to load recipe:', err);
      setError(err.response?.data?.message || 'Recipe not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50/70 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/favorites')}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-muted ring-1 ring-line transition-colors hover:text-ink hover:ring-brand-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to saved recipes
        </button>

        {loading ? (
          <div className="mt-5 space-y-4">
            <div className="h-64 animate-pulse rounded-3xl bg-canvas-2" />
            <div className="rounded-3xl border border-line bg-surface p-6">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-canvas-2" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-canvas-2" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-lg bg-canvas-2" />
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-canvas-2" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="mt-5 rounded-3xl border border-line bg-surface p-10 text-center shadow-soft">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-berry-50 text-berry-500">
              <AlertCircle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl text-ink">{error}</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-muted">
              The recipe may have been removed from your cookbook.
            </p>
            <Link to="/favorites" className="mt-5 inline-block">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Return to saved recipes
              </Button>
            </Link>
          </div>
        ) : recipe ? (
          <article className="animate-rise mt-5 overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
            {recipe.imageData && (
              <div className="relative">
                <img
                  src={recipe.imageData}
                  alt={recipe.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  className="h-60 w-full object-cover sm:h-80"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-brand-700">
                      {dietLabel(recipe.dietType)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-ink">
                      <Clock className="h-3 w-3 text-brand-500" />
                      {recipe.prepTimeMinutes} min
                    </span>
                  </div>
                  <h1 className="mt-3 max-w-2xl font-display text-2xl leading-tight text-white drop-shadow-sm sm:text-4xl">
                    {recipe.title}
                  </h1>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-7">
              {!recipe.imageData && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
                      {dietLabel(recipe.dietType)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-[10.5px] font-bold text-ink">
                      <Clock className="h-3 w-3 text-brand-500" />
                      {recipe.prepTimeMinutes} min
                    </span>
                  </div>
                  <h1 className="mt-3 font-display text-2xl leading-tight text-ink sm:text-4xl">
                    {recipe.title}
                  </h1>
                </>
              )}

              <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-muted">
                {recipe.description}
              </p>

              {/* Macros */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  {
                    label: 'Calories',
                    value: recipe.calories,
                    unit: 'kcal',
                    tone: 'brand',
                    icon: Flame,
                  },
                  {
                    label: 'Protein',
                    value: recipe.proteins,
                    unit: 'g',
                    tone: 'leaf',
                    icon: Dumbbell,
                  },
                  { label: 'Fats', value: recipe.fats, unit: 'g', tone: 'sun', icon: Droplet },
                  { label: 'Carbs', value: recipe.carbs, unit: 'g', tone: 'berry', icon: Wheat },
                ].map(({ label, value, unit, tone, icon: Icon }) => (
                  <div
                    key={label}
                    className={
                      'rounded-2xl border p-3.5 ' +
                      (tone === 'brand'
                        ? 'border-brand-100 bg-brand-50'
                        : tone === 'leaf'
                          ? 'border-leaf-100 bg-leaf-50'
                          : tone === 'sun'
                            ? 'border-sun-500/20 bg-sun-50'
                            : 'border-berry-500/15 bg-berry-50')
                    }
                  >
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                    <p className="mt-1 text-xl font-extrabold tabular-nums text-ink">
                      {value}
                      <span className="ml-0.5 text-[11px] font-bold text-muted">{unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="mt-8 grid gap-7 md:grid-cols-[minmax(0,0.85fr)_1.15fr]">
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted">
                    <span className="text-base">🥗</span> Ingredients
                  </h2>
                  <ul className="divide-y divide-line rounded-2xl border border-line bg-canvas/60 px-4">
                    {recipe.ingredients.map((ing, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-3 py-3 text-[13.5px]"
                      >
                        <span className="font-medium text-ink">{ing.name}</span>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-bold text-brand-600 ring-1 ring-brand-100">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted">
                    <span className="text-base">🍳</span> Step by step
                  </h2>
                  <ol className="space-y-3">
                    {recipe.instructions.map((step) => (
                      <li
                        key={step.step}
                        className="flex gap-3 rounded-2xl border border-line bg-white p-3.5"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-[12px] font-bold text-white shadow-glow">
                          {step.step}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-ink">{step.title}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};
