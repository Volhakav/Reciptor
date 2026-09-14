import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Bookmark, ChefHat } from 'lucide-react';

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

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/recipes/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4EFE3] text-[#2B2E23] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b border-[#E3DCC8] pb-4">
          <Bookmark className="w-7 h-7 text-[#C1502E]" />
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2E23]">
              Saved Recipes
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6858]">Your personal AI recipe collection</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(({ id, recipe }) => (
              <div
                key={id}
                className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative p-6 space-y-4 flex flex-col justify-between hover:shadow-sm transition-shadow"
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
                    <h3 className="font-serif text-lg font-semibold text-[#2B2E23] leading-snug">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
