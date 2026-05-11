'use client';

import { useMemo } from 'react';
import {
  REGIONS,
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type RegionCategory,
  type RegionSource,
} from '@/lib/regions';

interface Props {
  selectedId: string | null;
  visibleIds: Set<string>;
  enabledSources: Set<RegionSource>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggleVisible: (id: string) => void;
}

const SOURCE_ORDER: RegionSource[] = ['bp3d', 'fsavg', 'xie', 'procedural'];
const CATEGORY_ORDER: RegionCategory[] = [
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

export default function RegionList({
  selectedId,
  visibleIds,
  enabledSources,
  onSelect,
  onHover,
  onToggleVisible,
}: Props) {
  // Group regions: source → category → [regions]
  const grouped = useMemo(() => {
    const map: Record<RegionSource, Record<string, typeof REGIONS>> = {
      bp3d: {}, fsavg: {}, xie: {}, procedural: {},
    };
    for (const r of REGIONS) {
      if (!enabledSources.has(r.source)) continue;
      if (!r.meshNode && !r.nerveId && !(r.position && r.scale)) continue;
      (map[r.source][r.category] ||= []).push(r);
    }
    return map;
  }, [enabledSources]);

  return (
    <div className="h-full overflow-y-auto p-3 space-y-4">
      {SOURCE_ORDER.map((src) => {
        const cats = grouped[src];
        const catKeys = Object.keys(cats);
        if (catKeys.length === 0) return null;

        return (
          <div key={src} className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] uppercase tracking-[0.22em] text-ink-400 font-medium">
                {SOURCE_LABELS[src]}
              </h2>
              <div className="flex-1 h-px bg-ink-700/60" />
            </div>

            {CATEGORY_ORDER.filter((c) => cats[c]?.length).map((cat) => {
              const regions = cats[cat]!;
              return (
                <section key={`${src}-${cat}`}>
                  <h3 className="text-[10px] uppercase tracking-[0.16em] text-ink-300 mb-1">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <ul className="space-y-0.5">
                    {regions.map((r) => {
                      const active = r.id === selectedId;
                      const visible = visibleIds.has(r.id);
                      return (
                        <li key={r.id}>
                          <div
                            className={`group flex items-center gap-2 px-2 py-1 rounded transition ${
                              active ? 'bg-ink-700' : 'hover:bg-ink-800'
                            }`}
                            onMouseEnter={() => visible && onHover(r.id)}
                            onMouseLeave={() => onHover(null)}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisible(r.id);
                              }}
                              className={`w-3 h-3 rounded-sm border flex-shrink-0 transition ${
                                visible ? 'border-transparent' : 'border-ink-500 bg-transparent hover:border-ink-300'
                              }`}
                              style={{ backgroundColor: visible ? r.color : 'transparent' }}
                              aria-label={visible ? `Hide ${r.name}` : `Show ${r.name}`}
                              title={visible ? 'Hide' : 'Show'}
                            />
                            <button
                              onClick={() => {
                                if (!visible) onToggleVisible(r.id);
                                onSelect(r.id);
                              }}
                              className={`flex-1 text-left text-xs leading-tight ${
                                active
                                  ? 'text-ink-50'
                                  : visible
                                    ? 'text-ink-100 group-hover:text-ink-50'
                                    : 'text-ink-400 group-hover:text-ink-200'
                              }`}
                            >
                              {r.shortName || r.name}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
