'use client';

import Link from 'next/link';
import {
  CATEGORY_LABELS,
  getRegion,
  AUTONOMIC_TAG_LABELS,
  AUTONOMIC_TAG_COLORS,
} from '@/lib/regions';
import { getAutonomicNote } from '@/lib/autonomic';

interface Props {
  regionId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function RegionPanel({ regionId, onClose, onSelect }: Props) {
  const region = regionId ? getRegion(regionId) : null;

  if (!region) {
    return (
      <div className="h-full flex flex-col items-start justify-start gap-4 p-6 text-ink-200">
        <h2 className="font-serif text-2xl text-ink-50">The Atlas</h2>
        <p className="text-sm leading-relaxed text-ink-200">
          Rotate the brain with the mouse. Scroll to zoom. Click any region to
          read what it does and how it connects to the rest of the nervous
          system — from cortex down through brainstem, spinal cord, vagus
          nerve, and the enteric "second brain" in the gut.
        </p>
        <p className="text-xs uppercase tracking-widest text-ink-300 mt-4">
          Or jump in
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['vagus-nerve', 'Vagus Nerve'],
            ['amygdala', 'Amygdala'],
            ['hippocampus', 'Hippocampus'],
            ['thalamus', 'Thalamus'],
            ['insula', 'Insula'],
            ['reticular-formation', 'Arousal'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="text-xs px-3 py-1.5 rounded-full border border-ink-600 text-ink-100 hover:bg-ink-700 transition"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const connected = (region.connects || [])
    .map((id) => getRegion(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const autonomic = getAutonomicNote(region.id);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
        <div className="min-w-0">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: region.color }}
          >
            {CATEGORY_LABELS[region.category]}
          </p>
          <h2 className="font-serif text-2xl text-ink-50 leading-tight">
            {region.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-ink-300 hover:text-ink-50 text-xl leading-none flex-shrink-0"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
        <p className="text-ink-100 leading-relaxed">{region.summary}</p>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">
            What it does
          </h3>
          <ul className="space-y-1.5 text-sm text-ink-100">
            {region.functions.map((f) => (
              <li key={f} className="flex gap-2">
                <span
                  className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: region.color }}
                />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {autonomic && (
          <section className="border-t border-ink-700/60 pt-5">
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">
              Autonomic role
            </h3>
            {autonomic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {autonomic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: AUTONOMIC_TAG_COLORS[tag] + '88',
                      color: AUTONOMIC_TAG_COLORS[tag],
                      backgroundColor: AUTONOMIC_TAG_COLORS[tag] + '14',
                    }}
                  >
                    {AUTONOMIC_TAG_LABELS[tag]}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-ink-100 leading-relaxed">{autonomic.text}</p>
          </section>
        )}

        {connected.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">
              Connects to
            </h3>
            <div className="flex flex-wrap gap-2">
              {connected.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="text-xs px-2.5 py-1 rounded-full border border-ink-600 text-ink-100 hover:bg-ink-700 transition"
                  style={{ borderColor: c.color + '55' }}
                >
                  {c.shortName || c.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {region.essay && (
          <section className="pt-2">
            <Link
              href={`/regions/${region.essay}`}
              className="inline-flex items-center gap-1.5 text-sm text-ink-50 underline decoration-ink-500 underline-offset-4 hover:decoration-ink-100"
            >
              Read the long-form essay
              <span aria-hidden>→</span>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
