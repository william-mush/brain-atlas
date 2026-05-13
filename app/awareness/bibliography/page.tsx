import Link from 'next/link';
import {
  BIBLIOGRAPHY,
  formatFullCite,
  type BiblioEntry,
  type WorkType,
} from '@/lib/bibliography';

export const metadata = {
  title: 'Bibliography · The Brain Atlas',
};

const TYPE_ORDER: WorkType[] = ['paper', 'book', 'chapter', 'preprint', 'sutra'];

const TYPE_LABELS: Record<WorkType, string> = {
  paper: 'Papers',
  book: 'Books',
  chapter: 'Chapters',
  preprint: 'Preprints',
  sutra: 'Source texts',
};

export default function BibliographyPage() {
  const grouped: Record<WorkType, BiblioEntry[]> = {
    paper: [],
    book: [],
    chapter: [],
    preprint: [],
    sutra: [],
  };
  for (const entry of BIBLIOGRAPHY) grouped[entry.type].push(entry);
  for (const t of TYPE_ORDER) {
    grouped[t].sort((a, b) => {
      const ay = typeof a.year === 'number' ? a.year : 0;
      const by = typeof b.year === 'number' ? b.year : 0;
      if (ay !== by) return by - ay;
      return a.authors.localeCompare(b.authors);
    });
  }

  return (
    <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/awareness"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> awareness wing
      </Link>
      <p className="text-[11px] uppercase tracking-[0.22em] mb-3 text-neural-teal">
        References
      </p>
      <h1 className="font-serif text-4xl text-ink-50 leading-tight mb-3">
        Bibliography
      </h1>
      <p className="text-ink-300 italic text-lg mb-10 max-w-2xl">
        Every paper, book, and source text cited across the awareness wing.
        Each entry includes a brief editorial note on why the work matters
        for what we&apos;re trying to do.
      </p>

      {TYPE_ORDER.map((type) => {
        const entries = grouped[type];
        if (entries.length === 0) return null;
        return (
          <section key={type} className="mb-12">
            <h2 className="font-serif text-2xl text-ink-50 mb-5">
              {TYPE_LABELS[type]}
            </h2>
            <ol className="space-y-5 list-none pl-0">
              {entries.map((e) => (
                <li
                  key={e.id}
                  id={e.id}
                  className="scroll-mt-20 border-l-2 border-ink-700 pl-4 py-1 target:border-neural-violet"
                >
                  <p
                    className="text-[15px] text-ink-100 leading-relaxed font-serif"
                    dangerouslySetInnerHTML={{
                      __html: renderCiteHTML(e),
                    }}
                  />
                  {e.note && (
                    <p className="text-[13px] text-ink-300 mt-2 leading-relaxed">
                      {e.note}
                    </p>
                  )}
                  {e.quote && (
                    <blockquote className="border-l-2 border-ink-600 pl-3 mt-2 text-[13px] text-ink-200 italic">
                      &ldquo;{e.quote}&rdquo;
                    </blockquote>
                  )}
                  {(e.doi || e.url) && (
                    <p className="text-[12px] mt-2">
                      <a
                        href={e.doi ? `https://doi.org/${e.doi}` : e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-300 hover:text-ink-50 underline decoration-ink-600"
                      >
                        {e.doi ? `doi:${e.doi}` : 'link'}
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </main>
  );
}

/** Render a citation as HTML (allows italic title for books). */
function renderCiteHTML(e: BiblioEntry): string {
  const parts: string[] = [];
  parts.push(`<strong>${escapeHTML(e.authors)}</strong> (${escapeHTML(String(e.year))}).`);
  const isBook = e.type === 'book';
  if (isBook) {
    parts.push(`<em>${escapeHTML(e.title)}</em>.`);
    if (e.venue) parts.push(`${escapeHTML(e.venue)}.`);
  } else {
    parts.push(`${escapeHTML(e.title)}.`);
    if (e.venue) {
      let v = `<em>${escapeHTML(e.venue)}</em>`;
      if (e.volume) v += `, ${escapeHTML(e.volume)}`;
      if (e.pages) v += `, ${escapeHTML(e.pages)}`;
      v += '.';
      parts.push(v);
    }
  }
  return parts.join(' ');
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
