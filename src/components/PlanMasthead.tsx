import { diffDays, OCCASION_LABELS, toLakh } from '../engine';
import { formatDate } from '../lib/format';
import type { Plan } from '../schemas';
import { Icon } from './Icon';

function countdown(days: number): string {
  if (days > 1) return `${days} days to go`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today';
  return 'This date has passed';
}

/** The event command center header, shown above tabs to anchor the entire planning experience. */
export function PlanMasthead({ plan, today }: { plan: Plan; today: string }) {
  const days = diffDays(today, plan.eventDate);
  const isUrgent = days >= 0 && days <= 14;

  return (
    <section
      aria-label="Plan summary"
      className="card mb-6 border-line/60 bg-card p-6 sm:p-7 shadow-card-lg rounded-3xl relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-accent shadow-sm">
          <Icon name="sparkle" className="h-3.5 w-3.5 text-accent" />
          {OCCASION_LABELS[plan.occasion]}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ${
            isUrgent
              ? 'border border-warn/30 bg-warn-soft text-warn'
              : 'border border-line/60 bg-paper text-ink-soft'
          }`}
        >
          <Icon name="clock" className="h-3.5 w-3.5" />
          {countdown(days)}
        </span>
      </div>

      <div className="mt-4">
        <h2
          id="plan-title"
          tabIndex={-1}
          className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {OCCASION_LABELS[plan.occasion]}
          <span className="block font-normal text-ink-soft sm:inline">
            <span className="hidden sm:inline"> · </span>
            {formatDate(plan.eventDate)}
          </span>
        </h2>
        {plan.vibe && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-paper/80 px-3 py-1.5 text-sm font-medium text-ink-soft border border-line/50">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Theme</span>
            <span className="text-ink font-semibold">&ldquo;{plan.vibe}&rdquo;</span>
          </p>
        )}
      </div>

      <ul className="mt-5 flex flex-wrap gap-2.5 text-xs font-semibold sm:gap-3 sm:text-sm">
        <li className="flex items-center gap-2.5 rounded-2xl border border-accent/15 bg-card-lavender/50 px-4 py-2.5 text-ink transition-transform hover:scale-[1.02]">
          <Icon name="users" className="h-4 w-4 text-accent" />
          <span>{plan.guests} guests</span>
        </li>
        <li className="flex items-center gap-2.5 rounded-2xl border border-ok/20 bg-card-mint/60 px-4 py-2.5 text-ink transition-transform hover:scale-[1.02]">
          <Icon name="wallet" className="h-4 w-4 text-ok" />
          <span>{toLakh(plan.totalBudget)} budget</span>
        </li>
        <li className="flex items-center gap-2.5 rounded-2xl border border-line/80 bg-card-peach/60 px-4 py-2.5 text-ink transition-transform hover:scale-[1.02]">
          <Icon name="calendar" className="h-4 w-4 text-ink" />
          <span>{formatDate(plan.eventDate)}</span>
        </li>
      </ul>
    </section>
  );
}
