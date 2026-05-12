import Link from 'next/link';
import {
  COMPENDIUM,
  TYPE_LABELS,
  TYPE_COLORS,
  type CompendiumType,
} from '@/lib/compendium';
import EvidenceTag from '@/components/EvidenceTag';

export const metadata = {
  title: 'The Compendium · The Brain Atlas',
};

const TYPE_ORDER: CompendiumType[] = [
  'experiment',
  'thinker',
  'term',
  'practice',
  'region',
];

export default function CompendiumIndex() {
  const grouped: Record<CompendiumType, typeof COMPENDIUM> = {
    experiment: [],
    thinker: [],
    term: [],
    practice: [],
    region: [],
  };
  for (const entry of COMPENDIUM) grouped[entry.type].push(entry);
  for (const t of TYPE_ORDER) {
    grouped[t].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
      <p className="text-[11px] uppercase tracking-[0.22em] mb-3 text-neural-teal">
        Reference
      </p>
      <h1 className="font-serif text-4xl text-ink-50 leading-tight mb-3">
        The Compendium
      </h1>
      <p className="text-ink-300 italic text-lg mb-10 max-w-2xl">
        Experiments, thinkers, terms, and practices — every claim tagged for
        evidence.
      </p>

      <article className="prose-atlas mb-12 max-w-2xl">
        <p>
          A structured index of everything the{' '}
          <Link href="/awareness">awareness wing</Link> references and
          everything the synthesis paper draws on. Each entry carries an
          evidence tag — <strong>evidenced</strong>,{' '}
          <strong>suggestive</strong>, or <strong>philosophical</strong> —
          so the seam between what imaging shows, what inference suggests,
          and what is best held as a way of speaking is visible at a glance.
        </p>
        <p>
          The compendium is meant to be browsed sideways. Most entries link
          to others. Follow them.
        </p>
      </article>

      {TYPE_ORDER.map((type) => {
        const entries = grouped[type];
        if (entries.length === 0) return null;
        return (
          <section key={type} className="mb-12">
            <h2 className="flex items-baseline gap-3 mb-5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[type] }}
                aria-hidden
              />
              <span className="font-serif text-2xl text-ink-50">
                {TYPE_LABELS[type]}s
              </span>
              <span className="text-ink-400 text-sm">
                {entries.length}
              </span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0">
              {entries.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/compendium/${e.id}`}
                    className="block rounded-lg border border-ink-700 bg-ink-800/40 hover:bg-ink-800 hover:border-ink-600 transition p-4 h-full"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-lg text-ink-50 leading-snug">
                        {e.title}
                      </h3>
                      <EvidenceTag level={e.evidence} />
                    </div>
                    {e.subtitle && (
                      <p className="text-xs text-ink-300 mb-2 italic">
                        {e.subtitle}
                      </p>
                    )}
                    <p className="text-[14px] text-ink-200 leading-relaxed line-clamp-3">
                      {e.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
