import Link from 'next/link';
import {
  GLOSSARY,
  TRADITION_LABELS,
  TRADITION_ORDER,
  entriesByTradition,
} from '@/lib/glossary';

export const metadata = {
  title: 'Glossary · The Brain Atlas',
};

export default function GlossaryPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/awareness"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> awareness wing
      </Link>
      <p className="text-[11px] uppercase tracking-[0.22em] mb-3 text-neural-amber">
        Reference
      </p>
      <h1 className="font-serif text-4xl text-ink-50 leading-tight mb-3">
        Glossary
      </h1>
      <p className="text-ink-300 italic text-lg mb-10 max-w-2xl">
        Sanskrit, Pāli, Tibetan, Chinese, and Arabic terms used across the
        awareness wing — with proper diacritics, short glosses, and links
        to where each term is treated in fuller context.
      </p>

      {TRADITION_ORDER.map((t) => {
        const entries = entriesByTradition(t);
        if (entries.length === 0) return null;
        return (
          <section key={t} className="mb-12">
            <h2 className="font-serif text-2xl text-ink-50 mb-5">
              {TRADITION_LABELS[t]}
            </h2>
            <dl className="space-y-4">
              {entries.map((e) => (
                <div
                  key={e.term + e.tradition}
                  className="border-l-2 border-ink-700 pl-4 py-1"
                >
                  <dt className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif italic text-ink-50 text-lg">
                      {e.term}
                    </span>
                    <span className="text-ink-300 text-sm">— {e.gloss}</span>
                  </dt>
                  {e.description && (
                    <dd className="text-[14px] text-ink-200 mt-1.5 leading-relaxed">
                      {e.description}
                    </dd>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    {e.alsoSeen && e.alsoSeen.length > 0 && (
                      <span className="text-[11px] text-ink-400">
                        also seen as:{' '}
                        <span className="italic">
                          {e.alsoSeen.join(', ')}
                        </span>
                      </span>
                    )}
                    {e.href && (
                      <Link
                        href={e.href}
                        className="text-[11px] text-ink-300 hover:text-ink-50 underline decoration-ink-600 underline-offset-2"
                      >
                        → fuller treatment
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <p className="text-[12px] text-ink-400 italic mt-12 max-w-2xl border-t border-ink-700 pt-6">
        Total entries: {GLOSSARY.length}. This list grows with the wing.
        Diacritics use IAST transliteration for Sanskrit / Pāli; pinyin for
        Chinese; ALA-LC for Arabic; Wylie for Tibetan where possible.
      </p>
    </main>
  );
}
