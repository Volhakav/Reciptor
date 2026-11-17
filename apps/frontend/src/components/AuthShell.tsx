import React from 'react';
import { Sparkles, Bookmark, Leaf, Flame } from 'lucide-react';

interface AuthShellProps {
  children: React.ReactNode;
}

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-generated recipes',
    text: 'Turn whatever is in your fridge into a full dinner plan.',
  },
  {
    icon: Leaf,
    title: 'Goals that fit you',
    text: 'Weight loss, muscle gain, keto or balanced — pick one.',
  },
  {
    icon: Bookmark,
    title: 'Your personal cookbook',
    text: 'Save the hits and find them again in one tap.',
  },
];

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl lg:grid-cols-[1.05fr_1fr]">
        {/* Decorative side panel */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-500 via-brand-400 to-sun-500 lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <span className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-berry-500/25 blur-3xl" />
          <span className="pointer-events-none absolute right-10 top-14 h-24 w-24 rounded-full border border-white/30" />

          <div className="relative z-10 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/25">
              <Flame className="h-3.5 w-3.5" />
              Reciptor AI
            </span>

            <h2 className="mt-6 font-display text-4xl leading-tight text-white xl:text-5xl">
              Cook smarter with what you already have.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
              Tell us your ingredients and your goal — we will handle the recipe, the macros and the
              shopping list shortcuts.
            </p>

            <ul className="mt-9 space-y-4">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/18 text-white ring-1 ring-white/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-white/75">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Floating preview card */}
            <div className="animate-float mt-10 w-64 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-white/60">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-xl leading-none">
                  🥗
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">Lemon chicken bowl</p>
                  <p className="text-[11px] text-muted">ready in 25 min</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                {[
                  ['420', 'kcal'],
                  ['38g', 'protein'],
                  ['12g', 'carbs'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg bg-canvas px-1 py-1.5">
                    <p className="text-[12px] font-bold text-brand-600">{value}</p>
                    <p className="text-[9px] uppercase tracking-wide text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Form area */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-[440px]">{children}</div>
        </section>
      </div>
    </div>
  );
};
