import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export const RegistrationSuccessPage: React.FC = () => {
  return (
    <AuthShell>
      <div className="rounded-3xl border border-line bg-surface p-7 text-center shadow-soft sm:p-9">
        <div className="mb-7 flex justify-center">
          <Logo size="sm" showAiBadge={false} />
        </div>

        <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full bg-leaf-100" />
          <span className="absolute inset-2 rounded-full bg-leaf-50" />
          <CheckCircle2 className="relative h-8 w-8 text-leaf-600" />
        </div>

        <h1 className="font-display text-[26px] leading-tight text-ink">Account created</h1>
        <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted">
          You are all set. Sign in and turn whatever is in your kitchen into tonight's dinner.
        </p>

        <div className="mt-6 rounded-2xl bg-canvas p-4 text-left">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-600">
            <Sparkles className="h-3.5 w-3.5" />
            What happens next
          </p>
          <ul className="mt-2 space-y-1.5 text-[12.5px] text-muted">
            <li>1. Add the ingredients you already have.</li>
            <li>2. Pick a diet goal and servings.</li>
            <li>3. Get a full recipe with macros and a photo.</li>
          </ul>
        </div>

        <Link to="/login" className="mt-6 block">
          <Button size="lg" fullWidth>
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </AuthShell>
  );
};
