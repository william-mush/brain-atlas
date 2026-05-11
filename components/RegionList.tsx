'use client';

import { useMemo } from 'react';
import { REGIONS, CATEGORY_LABELS, type RegionCategory } from '@/lib/regions';

interface Props {
  selectedId: string | null;
  visibleIds: Set<string>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggleVisible: (id: string) => void;
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

export default function RegionList({
  selectedId,
  visibleIds,
  onSelect,
  onHover,
  onToggleVisible,
}: Props) {
  const grouped = useMemo(() => {
    const map: Record<string, typeof REGIONS> = {};
    // Include anything we can actually render in 3D: real meshes or procedural nerves.
    for (const r of REGIONS.filter((r) => r.meshNode || r.nerveId)) {
      (map[r.category] ||= []).push(r);
    }
    return map;
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
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
                      {/* Visibility checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisible(r.id);
                        }}
                        className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 transition ${
                          visible
                            ? 'border-transparent'
                            : 'border-ink-500 bg-transparent hover:border-ink-300'
                        }`}
                        style={{
                          backgroundColor: visible ? r.color : 'transparent',
                        }}
                        aria-label={visible ? `Hide ${r.name}` : `Show ${r.name}`}
                        title={visible ? 'Hide' : 'Show'}
                      />
                      {/* Name — clicks select the region (and ensure it's visible) */}
                      <button
                        onClick={() => {
                          if (!visible) onToggleVisible(r.id);
                          onSelect(r.id);
                        }}
                        className={`flex-1 text-left text-sm leading-tight ${
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
}
