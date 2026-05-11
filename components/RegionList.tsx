'use client';

import { useMemo } from 'react';
import { REGIONS, CATEGORY_LABELS, type RegionCategory } from '@/lib/regions';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const ORDER: RegionCategory[] = [
  'cortex',
  'limbic',
  'basal-ganglia',
  'diencephalon',
  'brainstem',
  'cerebellum',
  'cranial-nerve',
  'spinal',
  'enteric',
];

export default function RegionList({ selectedId, onSelect, onHover }: Props) {
  const grouped = useMemo(() => {
    const map: Record<string, typeof REGIONS> = {};
    for (const r of REGIONS) {
      (map[r.category] ||= []).push(r);
    }
    return map;
  }, []);

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div>
        <h2 className="font-serif text-lg text-ink-50">Regions</h2>
        <p className="text-xs text-ink-300 mt-1">
          Grouped by anatomical system.
        </p>
      </div>
      {ORDER.map((cat) => {
        const regions = grouped[cat];
        if (!regions?.length) return null;
        return (
          <section key={cat}>
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mb-1.5">
              {CATEGORY_LABELS[cat]}
            </h3>
            <ul className="space-y-0.5">
              {regions.map((r) => {
                const active = r.id === selectedId;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => onSelect(r.id)}
                      onMouseEnter={() => onHover(r.id)}
                      onMouseLeave={() => onHover(null)}
                      className={`w-full text-left text-sm flex items-center gap-2 px-2 py-1 rounded transition ${
                        active
                          ? 'bg-ink-700 text-ink-50'
                          : 'text-ink-200 hover:bg-ink-800 hover:text-ink-50'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="leading-tight">
                        {r.shortName || r.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
