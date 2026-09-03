import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 1-indexed
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => {
  return (
    <div className="flex items-center mb-6">
      {steps.map((step, i) => {
        const stepNumber = i + 1;
        const isDone = stepNumber < current;
        const isActive = stepNumber === current;

        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-sm border flex items-center justify-center text-xs font-medium transition-colors ${
                  isDone
                    ? 'bg-[#C1502E] border-[#C1502E] text-[#FFFBF2]'
                    : isActive
                      ? 'border-[#C1502E] text-[#C1502E] bg-[#FFFBF2]'
                      : 'border-[#D8CFB8] text-[#A9A18A] bg-[#FFFDF8]'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : stepNumber}
              </div>
              <span
                className={`text-[11px] whitespace-nowrap ${
                  isActive ? 'text-[#2B2E23] font-medium' : 'text-[#A9A18A]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {stepNumber < steps.length && (
              <div
                className={`flex-1 h-[1px] mx-2 mb-4 transition-colors ${
                  isDone ? 'bg-[#C1502E]' : 'bg-[#E3DCC8]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
