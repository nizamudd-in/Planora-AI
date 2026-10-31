import { categoryLabel, formatINR, percentOf, toLakh, type BudgetStatus } from '../engine';
import { CATEGORIES, type Category, type Plan } from '../schemas';

/**
 * Tonal palette for the split, as CSS classes (see index.css) so the strict CSP needs no inline
 * styles. Meaning is carried by the text legend, never by colour alone.
 */
export const SWATCH_CLASS: Record<Category, string> = {
  venue: 'sw-venue',
  catering: 'sw-catering',
  decor: 'sw-decor',
  photography: 'sw-photography',
  entertainment: 'sw-entertainment',
  misc: 'sw-misc',
  contingency: 'sw-contingency',
};

export function BudgetSummaryCards({ status }: { status: BudgetStatus }) {
  const cards = [
    {
      label: 'Total budget',
      val: formatINR(status.total),
      sub: toLakh(status.total),
      subCls: 'font-semibold text-accent',
      valCls: 'text-ink',
    },
    {
      label: 'Committed (verified quotations)',
      val: formatINR(status.committed),
      sub: 'Locked by signed quotes',
      subCls: 'text-ink-soft',
      valCls: 'text-ok',
    },
    {
      label: 'Estimated (not yet quoted)',
      val: formatINR(status.estimated),
      sub: 'Engine baseline allocations',
      subCls: 'text-ink-soft',
      valCls: 'text-ink',
    },
  ];
  return (
    <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-line bg-paper/60 p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {c.label}
          </dt>
          <dd
            className={`tabular mt-1 font-display text-2xl font-extrabold ${c.valCls} sm:text-3xl`}
          >
            {c.val}
          </dd>
          <dd className={`mt-0.5 text-xs ${c.subCls}`}>{c.sub}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AllocationBar({ plan }: { plan: Plan }) {
  const pctOf = (c: (typeof CATEGORIES)[number]) => percentOf(plan.allocation[c], plan.totalBudget);
  const parts = CATEGORIES.map((c, i) => ({
    category: c,
    label: categoryLabel(plan.occasion, c),
    pct: pctOf(c),
    x: CATEGORIES.slice(0, i).reduce((sum, before) => sum + pctOf(before), 0),
  }));
  const summary = parts.map((p) => `${p.label} ${p.pct}%`).join(', ');

  return (
    <div>
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-line/80 shadow-inner">
        <svg
          role="img"
          aria-label={`Budget split: ${summary}`}
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          {parts.map((p) => (
            <rect
              key={p.category}
              x={p.x}
              y={0}
              width={p.pct}
              height={1}
              className={SWATCH_CLASS[p.category]}
            />
          ))}
        </svg>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        {parts.map((p) => (
          <li
            key={p.category}
            className="flex items-center gap-2 rounded-lg border border-line/60 bg-paper/50 px-2.5 py-1.5"
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ${SWATCH_CLASS[p.category]}`}
            />
            <span className="truncate font-semibold text-ink">{p.label}</span>
            <span className="tabular ml-auto font-medium text-ink-soft">{p.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
