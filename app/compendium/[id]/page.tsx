import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  COMPENDIUM,
  getEntry,
  TYPE_LABELS,
  TYPE_COLORS,
  LIMB_LABELS,
} from '@/lib/compendium';
import { REGIONS } from '@/lib/regions';
import EvidenceTag from '@/components/EvidenceTag';

export function generateStaticParams() {
  return COMPENDIUM.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) return { title: 'Not Found · The Compendium' };
  return { title: `${entry.title} · The Compendium` };
}

export default async function CompendiumEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();

  const related = entry.related
    ?.map((rid) => getEntry(rid))
    .filter((e): e is NonNullable<typeof e> => e !== undefined) ?? [];
  const regions = entry.regions
    ?.map((rid) => REGIONS.find((r) => r.id === rid))
    .filter((r): r is NonNullable<typeof r> => r !== undefined) ?? [];

  const typeColor = TYPE_COLORS[entry.type];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/compendium"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> the compendium
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: typeColor }}
          aria-hidden
        />
        <p
          className="text-[11px] uppercase tracking-[0.22em]"
          style={{ color: typeColor }}
        >
          {TYPE_LABELS[entry.type]}
        </p>
      </div>

      <article className="prose-atlas">
        <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span>{entry.title}</span>
          <EvidenceTag level={entry.evidence} />
        </h1>
        {entry.subtitle && (
          <p className="text-ink-300 italic text-lg -mt-3 mb-6">
            {entry.subtitle}
          </p>
        )}

        <p className="text-lg leading-relaxed">{entry.summary}</p>

        {entry.body && <p>{entry.body}</p>}

        {entry.link && (
          <p>
            <a
              href={entry.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.link.label}
            </a>
          </p>
        )}
      </article>

      {entry.limbs && entry.limbs.length > 0 && (
        <aside className="mt-10 pt-6 border-t border-ink-700">
          <p className="text-xs uppercase tracking-widest text-ink-300 mb-3">
            Eight Limbs
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.limbs.map((l) => (
              <span
                key={l}
                className="text-sm px-3 py-1 rounded-full border border-ink-600 text-ink-100"
              >
                {LIMB_LABELS[l]}
              </span>
            ))}
          </div>
        </aside>
      )}

      {regions.length > 0 && (
        <aside className="mt-8 pt-6 border-t border-ink-700">
          <p className="text-xs uppercase tracking-widest text-ink-300 mb-3">
            Regions
          </p>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <Link
                key={r.id}
                href={`/regions/${r.id}`}
                className="text-sm px-3 py-1.5 rounded-full border border-ink-600 text-ink-100 hover:bg-ink-800 transition"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </aside>
      )}

      {related.length > 0 && (
        <aside className="mt-8 pt-6 border-t border-ink-700">
          <p className="text-xs uppercase tracking-widest text-ink-300 mb-3">
            Related entries
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/compendium/${r.id}`}
                className="block rounded-md border border-ink-700 bg-ink-800/30 hover:bg-ink-800 transition p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-ink-50 text-[15px] leading-snug">
                    {r.title}
                  </span>
                  <EvidenceTag level={r.evidence} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.14em] mt-1"
                   style={{ color: TYPE_COLORS[r.type] }}>
                  {TYPE_LABELS[r.type]}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </main>
  );
}
