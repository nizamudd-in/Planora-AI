import { useState } from 'react';
import { budgetTier } from '../engine';
import { suggestIdeas, type RequestOptions } from '../lib/api';
import { useAiCall } from '../lib/useAiCall';
import type { Plan } from '../schemas';
import { Icon } from './Icon';
import { AnswerMeta } from './ThinkingTrace';
import { AiError, AiLoading } from './ui';

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-accent/15 bg-card-lavender/30 p-5 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-accent">{title}</h4>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs font-medium leading-relaxed text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function IdeasPanel({ plan }: { plan: Plan }) {
  const [round, setRound] = useState(0);
  const ai = useAiCall((options: RequestOptions, request: Parameters<typeof suggestIdeas>[0]) =>
    suggestIdeas(request, options),
  );

  const generate = () => {
    setRound((r) => r + 1);
    return ai.run({
      occasion: plan.occasion,
      vibe: plan.vibe,
      guests: plan.guests,
      budgetTier: budgetTier(plan),
      nonNegotiables: plan.priorities,
      variation: round,
    });
  };

  const data = ai.state.status === 'done' ? ai.state.data : null;
  return (
    <section className="card shadow-card-lg rounded-3xl" aria-labelledby="ideas-h">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card-lavender text-accent shadow-sm">
            <Icon name="sparkle" className="h-5 w-5" />
          </div>
          <div>
            <h2 id="ideas-h" className="text-lg font-bold sm:text-xl">
              Ideas for your celebration
            </h2>
            <p className="hint">
              AI suggestions · no prices. Tuned to your occasion, style and guest count.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn-secondary min-h-10 px-4 text-xs font-semibold"
          onClick={() => void generate()}
          disabled={ai.state.status === 'loading'}
        >
          <Icon name="sparkle" className="h-4 w-4 text-accent" />
          {data ? 'Regenerate ideas' : 'Get ideas'}
        </button>
      </div>
      <div aria-live="polite" className="mt-4">
        {ai.state.status === 'loading' && (
          <AiLoading label="Gemini is thinking up ideas…" progress={ai.progress} />
        )}
        {ai.state.status === 'error' && (
          <AiError message={ai.state.message} onRetry={() => void generate()} />
        )}
        {data && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">
                Curated Celebration Themes
              </h3>
              <ul className="mt-2.5 grid gap-3 md:grid-cols-2">
                {data.themes.map((t) => (
                  <li
                    key={t.title}
                    className="rounded-2xl border border-line bg-card p-4 shadow-sm hover:border-accent/40 transition-all"
                  >
                    <p className="font-bold text-ink">{t.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <List title="Activities" items={data.activities} />
              <List title="Food style" items={data.foodStyle} />
              <List title="Personal touches" items={data.personalTouches} />
            </div>
            <AnswerMeta progress={ai.progress} />
            <figure className="rounded-2xl border border-accent/20 bg-gradient-to-r from-accent-soft/40 to-card p-5 shadow-sm">
              <figcaption className="text-xs font-bold uppercase tracking-wider text-accent">
                Suggested Invitation Line
              </figcaption>
              <blockquote className="mt-2 font-display text-lg font-semibold italic text-ink sm:text-xl">
                {data.invitationLine}
              </blockquote>
            </figure>
          </div>
        )}
      </div>
    </section>
  );
}
