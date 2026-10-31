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
      className="card mb-6 border-line/80 bg-gradient-to-br from-card via-card to-accent-soft/30 p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Icon name="sparkle" className="h-3.5 w-3.5 text-accent" />
          {OCCASION_LABELS[plan.occasion]}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isUrgent
              ? 'border border-warn/30 bg-warn-soft text-warn'
              : 'border border-line bg-paper text-ink-soft'
          }`}
        >
          <Icon name="clock" className="h-3.5 w-3.5" />
          {countdown(days)}
        </span>
      </div>

      <div className="mt-3">
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
          <p className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-paper px-2.5 py-1 text-sm font-medium text-ink-soft">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Theme</span>
            <span>&ldquo;{plan.vibe}&rdquo;</span>
          </p>
        )}
      </div>

      <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
        <li className="flex items-center gap-2 rounded-xl border border-line bg-paper/80 px-3 py-2 text-ink">
          <Icon name="users" className="h-4 w-4 text-accent" />
          <span>{plan.guests} guests</span>
        </li>
        <li className="flex items-center gap-2 rounded-xl border border-line bg-paper/80 px-3 py-2 text-ink">
          <Icon name="wallet" className="h-4 w-4 text-accent" />
          <span>{toLakh(plan.totalBudget)} budget</span>
        </li>
        <li className="flex items-center gap-2 rounded-xl border border-line bg-paper/80 px-3 py-2 text-ink">
          <Icon name="calendar" className="h-4 w-4 text-accent" />
          <span>{formatDate(plan.eventDate)}</span>
        </li>
      </ul>
    </section>
  );
}
