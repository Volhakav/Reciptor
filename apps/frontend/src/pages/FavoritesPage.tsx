import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Bookmark, Utensils } from 'lucide-react';

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
      console.error('Ошибка загрузки избранного:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-stone-100 text-stone-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-amber-200/60 pb-6">
          <div className="p-3.5 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-md shadow-orange-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">Любимые рецепты</h1>
            <p className="text-stone-600 text-sm">Ваша личная семейная кулинарная книга</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-500 font-medium">
            Загрузка сохраненных рецептов...
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 bg-white border border-amber-100 rounded-3xl p-8 space-y-4 shadow-xl shadow-amber-900/5">
            <Utensils className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-bold text-stone-800">Пока нет сохраненных рецептов</h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              Сгенерируйте рецепт на главной странице и нажмите кнопку «Сохранить рецепт», чтобы он
              появился здесь!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(({ id, recipe }) => (
              <div
                key={id}
                className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xl shadow-amber-900/5 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-stone-900 leading-snug">
                      {recipe.title}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold shrink-0">
                      {recipe.dietType}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                      <span className="text-stone-500 block text-[10px]">Ккал</span>
                      <span className="font-extrabold text-amber-800">{recipe.calories}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <span className="text-stone-500 block text-[10px]">Белки</span>
                      <span className="font-extrabold text-emerald-800">{recipe.proteins}g</span>
                    </div>
                    <div className="bg-sky-50 p-2 rounded-xl border border-sky-100">
                      <span className="text-stone-500 block text-[10px]">Жиры</span>
                      <span className="font-extrabold text-sky-800">{recipe.fats}g</span>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-xl border border-purple-100">
                      <span className="text-stone-500 block text-[10px]">Углев</span>
                      <span className="font-extrabold text-purple-800">{recipe.carbs}g</span>
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
