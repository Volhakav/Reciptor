import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ChefHat, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

interface RecipeDetail {
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
}

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
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4EFE3] text-[#2B2E23] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Back Button */}
        <button
          onClick={() => navigate('/favorites')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A6B3F] hover:text-[#C1502E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Favorites</span>
        </button>

        {loading ? (
          <div className="text-center py-20 text-[#8A6B3F] font-medium text-sm">
            Loading recipe details…
          </div>
        ) : error ? (
          <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-[#C1502E] mx-auto" />
            <h2 className="font-serif text-xl font-semibold text-[#2B2E23]">{error}</h2>
            <Link
              to="/favorites"
              className="inline-block px-4 py-2 bg-[#C1502E] text-[#FFFBF2] text-xs font-medium rounded-sm hover:bg-[#993C1D] transition-colors"
            >
              Return to Favorites
            </Link>
          </div>
        ) : recipe ? (
          <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative px-6 py-8 sm:px-10 shadow-sm space-y-8">
            {/* Stitched edge */}
            <div
              className="absolute left-0 top-6 bottom-6 w-[2px]"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
              }}
            />

            <div className="pl-2 space-y-8">
              {/* Recipe Title Header */}
              <div className="border-b border-[#E3DCC8] pb-6 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs px-2.5 py-1 rounded-sm bg-[#FAECE7] text-[#993C1D] font-bold uppercase tracking-wider">
                    {recipe.dietType.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-[#8A6B3F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C1502E]" />
                    {recipe.prepTimeMinutes} min prep
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2B2E23]">
                  {recipe.title}
                </h1>
                <p className="text-sm text-[#6B6858] leading-relaxed max-w-2xl">
                  {recipe.description}
                </p>
              </div>

              {/* KBZhU Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">
                    Calories
                  </span>
                  <span className="text-lg font-bold text-[#C1502E]">{recipe.calories} kcal</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">
                    Proteins
                  </span>
                  <span className="text-lg font-bold text-[#3D4A2C]">{recipe.proteins} g</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">Fats</span>
                  <span className="text-lg font-bold text-[#8A6B3F]">{recipe.fats} g</span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#D8CFB8] p-3 rounded-sm text-center">
                  <span className="text-[11px] text-[#8A6B3F] block mb-0.5 font-medium">Carbs</span>
                  <span className="text-lg font-bold text-[#2B2E23]">{recipe.carbs} g</span>
                </div>
              </div>

              {/* Ingredients & Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Ingredients List */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold text-[#2B2E23] flex items-center gap-2 border-b border-[#E3DCC8] pb-2">
                    <ChefHat className="w-5 h-5 text-[#C1502E]" />
                    <span>Ingredients</span>
                  </h3>
                  <ul className="space-y-2 bg-[#FFFDF8] border border-[#D8CFB8] p-4 rounded-sm">
                    {recipe.ingredients.map((ing, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-sm border-b border-[#E3DCC8] last:border-0 py-2"
                      >
                        <span className="text-[#2B2E23] font-medium">{ing.name}</span>
                        <span className="font-bold text-[#C1502E]">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions List */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold text-[#2B2E23] flex items-center gap-2 border-b border-[#E3DCC8] pb-2">
                    <span>👨‍🍳 Instructions</span>
                  </h3>
                  <div className="space-y-3">
                    {recipe.instructions.map((step) => (
                      <div
                        key={step.step}
                        className="bg-[#FFFDF8] border border-[#D8CFB8] p-4 rounded-sm space-y-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#C1502E]">
                          <span className="bg-[#FAECE7] px-2.5 py-0.5 rounded-sm">
                            Step {step.step}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5C5A4E] leading-relaxed pt-1">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
