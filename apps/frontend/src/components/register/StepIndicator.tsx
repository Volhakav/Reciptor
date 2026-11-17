import React from 'react';
import { cn } from '../../lib/cn';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 1-indexed
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5">
        {steps.map((step, i) => {
          const stepNumber = i + 1;
          const isDone = stepNumber < current;
          const isActive = stepNumber === current;

          return (
            <div
              key={step.label}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
              aria-hidden="true"
            >
              <span
                className={cn(
                  'block h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500',
                  isDone || isActive ? 'w-full' : 'w-0',
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        {steps.map((step, i) => {
          const stepNumber = i + 1;
          const isDone = stepNumber < current;
          const isActive = stepNumber === current;

          return (
            <span
              key={step.label}
              className={cn(
                'text-[11px] font-semibold transition-colors',
                isActive && 'text-brand-600',
                isDone && 'text-ink',
                !isActive && !isDone && 'text-muted/60',
              )}
            >
              <span className="mr-1 tabular-nums opacity-70">{stepNumber}.</span>
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
