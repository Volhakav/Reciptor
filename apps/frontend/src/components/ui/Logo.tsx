import React from 'react';
import { ChefHat } from 'lucide-react';
import { cn } from '../../lib/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showAiBadge?: boolean;
  className?: string;
}

const SIZES = {
  sm: { box: 'h-9 w-9 rounded-xl', icon: 'h-5 w-5', text: 'text-lg' },
  md: { box: 'h-10 w-10 rounded-2xl', icon: 'h-5.5 w-5.5', text: 'text-xl' },
  lg: { box: 'h-12 w-12 rounded-2xl', icon: 'h-6 w-6', text: 'text-2xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showAiBadge = true, className }) => {
  const s = SIZES[size];
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className="flex items-center gap-1.5">
        <span className={cn('font-display font-semibold tracking-tight text-ink', s.text)}>
          Reciptor
        </span>
        {showAiBadge && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-600 ring-1 ring-brand-100">
            AI
          </span>
        )}
      </span>
    </span>
  );
};

export const LogoMark: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const s = SIZES[size];
  return (
    <span
      className={cn(
        'grid place-items-center bg-gradient-to-br from-brand-500 via-brand-400 to-sun-500 text-white shadow-glow',
        s.box,
        className,
      )}
    >
      <ChefHat className={s.icon} strokeWidth={2.2} />
    </span>
  );
};
