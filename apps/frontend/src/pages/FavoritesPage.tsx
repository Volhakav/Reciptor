import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Bookmark, ChefHat, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface SavedRecipeItem {
  id: string;
  recipe: {
    id: string;
    title: string;
    description: string;
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4EFE3] text-[#2B2E23] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3DCC8] pb-4">
          <div className="flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-[#C1502E]" />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2E23]">
                Saved Recipes
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6858]">
                Your personal AI recipe collection ({totalItems} saved)
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#8A6B3F] font-medium text-sm">
            Loading saved recipes…
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative p-8 text-center space-y-3">
            <div
              className="absolute left-0 top-5 bottom-5 w-[2px]"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
              }}
            />
            <ChefHat className="w-10 h-10 text-[#A9A18A] mx-auto" />
            <h3 className="font-serif text-lg font-semibold text-[#2B2E23]">
              No saved recipes yet
            </h3>
            <p className="text-xs text-[#6B6858] max-w-md mx-auto">
              Generate a recipe on the main page and click "Save Recipe" to add it here!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(({ id, recipe }) => (
                <div
                  key={id}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="bg-[#FFFBF2] border border-[#D8CFB8] hover:border-[#C1502E] rounded-sm relative p-6 space-y-4 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md group"
                >
                  <div
                    className="absolute left-0 top-4 bottom-4 w-[2px]"
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, #C1502E 0 5px, transparent 5px 10px)',
                    }}
                  />

                  <div className="pl-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold text-[#2B2E23] group-hover:text-[#C1502E] transition-colors leading-snug">
                        {recipe.title}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-sm bg-[#FAECE7] text-[#993C1D] font-medium shrink-0">
                        {recipe.dietType}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6858] line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="pl-1 pt-2 space-y-3">
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                      <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-1.5 rounded-sm">
                        <span className="text-[#8A6B3F] block text-[10px]">Kcal</span>
                        <span className="font-bold text-[#C1502E]">{recipe.calories}</span>
                      </div>
                      <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-1.5 rounded-sm">
                        <span className="text-[#8A6B3F] block text-[10px]">Prot</span>
                        <span className="font-bold text-[#3D4A2C]">{recipe.proteins}g</span>
                      </div>
                      <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-1.5 rounded-sm">
                        <span className="text-[#8A6B3F] block text-[10px]">Fat</span>
                        <span className="font-bold text-[#8A6B3F]">{recipe.fats}g</span>
                      </div>
                      <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-1.5 rounded-sm">
                        <span className="text-[#8A6B3F] block text-[10px]">Carb</span>
                        <span className="font-bold text-[#2B2E23]">{recipe.carbs}g</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end text-xs font-semibold text-[#C1502E] pt-1">
                      <span className="flex items-center gap-1 group-hover:underline">
                        <Eye className="w-3.5 h-3.5" />
                        View Full Recipe →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#E3DCC8]">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 border border-[#D8CFB8] bg-[#FFFDF8] hover:bg-[#F4EFE3] text-[#2B2E23] text-xs font-medium rounded-sm transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-[#6B6858] font-medium">
                  Page <strong className="text-[#2B2E23]">{page}</strong> of{' '}
                  <strong className="text-[#2B2E23]">{totalPages}</strong>
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border border-[#D8CFB8] bg-[#FFFDF8] hover:bg-[#F4EFE3] text-[#2B2E23] text-xs font-medium rounded-sm transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
