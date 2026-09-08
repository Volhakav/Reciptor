import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, CheckCircle2 } from 'lucide-react';

export const RegistrationSuccessPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F4EFE3]">
      <div className="w-full max-w-sm my-6 bg-[#FFFBF2] border border-[#D8CFB8] rounded-2xl relative px-8 py-9">
        {/* stitched edge */}
        <div
          className="absolute left-0 top-5 bottom-5 w-[2px]"
          style={{
            background: 'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
          }}
        />

        <div className="pl-1.5 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ChefHat className="w-5 h-5 text-[#C1502E]" />
            <span className="text-sm font-medium text-[#8A6B3F]">Reciptor</span>
          </div>

          <div className="w-12 h-12 mx-auto mb-4 rounded-lg border border-[#3D4A2C] flex items-center justify-center bg-[#EEF1E7]">
            <CheckCircle2 className="w-6 h-6 text-[#3D4A2C]" />
          </div>

          <h1 className="font-serif text-[24px] font-semibold text-[#2B2E23] mb-2">
            Account created
          </h1>
          <p className="text-[13px] text-[#6B6858] mb-7">
            Your account has been created successfully. Sign in to start generating recipes.
          </p>

          <Link
            to="/login"
            className="w-full h-11 flex items-center justify-center bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-lg transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
