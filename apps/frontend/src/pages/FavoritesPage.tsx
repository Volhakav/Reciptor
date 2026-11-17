import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { ArrowRight, Bookmark, ChefHat, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface SavedRecipeItem {
  id: string;
  recipe: {
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
  };
}

const dietLabel = (value: string) =>
  value.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<SavedRecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();
  const limit = 6;

  useEffect(() => {
    fetchFavorites(page);
  }, [page]);

  const fetchFavorites = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await api.get('/recipes/favorites', {
        params: { page: currentPage, limit },
      });

      if (response.data.data) {
        setFavorites(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        // Fallback for array response
        setFavorites(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sun-500 text-white shadow-glow">
              <Bookmark className="h-5.5 w-5.5" />
            </span>
            <div>
              <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
                Saved recipes
              </h1>
              <p className="mt-0.5 text-[13px] text-muted">
                {totalItems > 0
                  ? `${totalItems} ${totalItems === 1 ? 'recipe' : 'recipes'} in your personal cookbook`
                  : 'Your personal cookbook, ready when you are'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4 text-brand-500" />
            New recipe
          </Button>
        </div>

        {/* Content */}
        <div className="mt-7">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-line bg-surface">
                  <div className="relative h-40 bg-canvas-2">
                    <span className="animate-shimmer absolute inset-0" />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded-lg bg-canvas-2" />
                    <div className="h-3.5 w-full animate-pulse rounded-lg bg-canvas-2" />
                    <div className="h-14 animate-pulse rounded-xl bg-canvas-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line-strong bg-white/60 px-6 py-14 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-500 ring-1 ring-brand-100">
                <ChefHat className="h-8 w-8" />
              </span>
              <h2 className="mt-4 font-display text-xl text-ink">Nothing saved yet</h2>
              <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
                Generate a recipe you like and tap “Save recipe”. It will land here with all macros
                and steps.
              </p>
              <Button className="mt-5" onClick={() => navigate('/')}>
                <Sparkles className="h-4 w-4" />
                Generate my first recipe
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map(({ id, recipe }) => (
                  <article
                    key={id}
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                  >
                    {recipe.imageData ? (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={recipe.imageData}
                          alt={recipe.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 shadow-xs">
                          {dietLabel(recipe.dietType)}
                        </span>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      </div>
                    ) : (
                      <div className="grid h-40 place-items-center bg-gradient-to-br from-brand-50 to-sun-50">
                        <ChefHat className="h-8 w-8 text-brand-300" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start gap-2">
                        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-brand-600">
                          {recipe.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                        {recipe.description}
                      </p>

                      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
                        {[
                          ['kcal', recipe.calories, 'text-brand-600'],
                          ['prot', `${recipe.proteins}g`, 'text-leaf-600'],
                          ['fat', `${recipe.fats}g`, 'text-muted'],
                          ['carb', `${recipe.carbs}g`, 'text-ink'],
                        ].map(([label, value, color]) => (
                          <div key={label} className="rounded-xl bg-canvas px-1 py-1.5">
                            <span className="block text-[9px] font-bold uppercase tracking-wide text-muted">
                              {label}
                            </span>
                            <span className={`text-[12.5px] font-extrabold ${color}`}>{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 text-[12px]">
                        <span className="font-semibold text-muted">
                          {recipe.prepTimeMinutes} min
                        </span>
                        <span className="flex items-center gap-1 font-bold text-brand-600 transition-transform group-hover:translate-x-0.5">
                          View recipe
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 border-t border-line pt-5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-muted ring-1 ring-line">
                    Page <strong className="text-ink">{page}</strong> of{' '}
                    <strong className="text-ink">{totalPages}</strong>
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
