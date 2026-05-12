'use client';

import { useMemo } from 'react';
import { BODY_PARTS, REGION_LABELS, type BodyRegion } from '@/lib/body';

interface Props {
  selectedId: string | null;
  visibleIds: Set<string>;
  enabledRegions: Set<BodyRegion>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggleVisible: (id: string) => void;
}

const REGION_ORDER: BodyRegion[] = [
  'head-neck',
  'shoulder-girdle',
  'arm',
  'chest',
  'back',
  'core',
  'pelvis-hip',
  'thigh',
  'lower-leg-foot',
  'skeleton',
];

export default function BodyList({
  selectedId,
  visibleIds,
  enabledRegions,
  onSelect,
  onHover,
  onToggleVisible,
}: Props) {
  const grouped = useMemo(() => {
    const map: Partial<Record<BodyRegion, { muscles: typeof BODY_PARTS; bones: typeof BODY_PARTS }>> = {};
    for (const p of BODY_PARTS) {
      const bucket = (map[p.region] ||= { muscles: [], bones: [] });
      if (p.kind === 'muscle') bucket.muscles.push(p);
      else bucket.bones.push(p);
    }
    return map;
  }, []);

  return (
    <div className="h-full overflow-y-auto p-3 space-y-4">
      {REGION_ORDER.filter((r) => enabledRegions.has(r)).map((region) => {
        const bucket = grouped[region];
        if (!bucket || (bucket.muscles.length === 0 && bucket.bones.length === 0)) return null;

        return (
          <section key={region}>
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mb-1.5">
              {REGION_LABELS[region]}
            </h3>
            {bucket.muscles.length > 0 && (
              <ul className="space-y-0.5 mb-2">
                {bucket.muscles.map((r) => {
                  const active = r.id === selectedId;
                  const visible = visibleIds.has(r.id);
                  return (
                    <li key={r.id}>
                      <div
                        className={`group flex items-center gap-2 px-2 py-1 rounded transition ${active ? 'bg-ink-700' : 'hover:bg-ink-800'}`}
                        onMouseEnter={() => visible && onHover(r.id)}
                        onMouseLeave={() => onHover(null)}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleVisible(r.id); }}
                          className={`w-3 h-3 rounded-sm border flex-shrink-0 transition ${visible ? 'border-transparent bg-[#c45050]' : 'border-ink-500'}`}
                          aria-label={visible ? `Hide ${r.name}` : `Show ${r.name}`}
                        />
                        <button
                          onClick={() => {
                            if (!visible) onToggleVisible(r.id);
                            onSelect(r.id);
                          }}
                          className={`flex-1 text-left text-xs leading-tight ${active ? 'text-ink-50' : visible ? 'text-ink-100 group-hover:text-ink-50' : 'text-ink-400'}`}
                        >
                          {r.shortName || r.name}
                          {r.side && <span className="text-ink-400 ml-1 font-mono text-[10px]">{r.side === 'l' ? 'L' : 'R'}</span>}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {bucket.bones.length > 0 && (
              <details className="text-[10px] text-ink-400" open={bucket.muscles.length === 0}>
                <summary className="cursor-pointer hover:text-ink-200">Bones ({bucket.bones.length})</summary>
                <ul className="mt-1 space-y-0.5">
                  {bucket.bones.map((r) => {
                    const active = r.id === selectedId;
                    const visible = visibleIds.has(r.id);
                    return (
                      <li key={r.id}>
                        <div className={`group flex items-center gap-2 px-2 py-0.5 rounded transition ${active ? 'bg-ink-700' : 'hover:bg-ink-800'}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); onToggleVisible(r.id); }}
                            className={`w-2.5 h-2.5 rounded-sm border flex-shrink-0 ${visible ? 'border-transparent bg-[#e8dec5]' : 'border-ink-500'}`}
                            aria-label={visible ? `Hide ${r.name}` : `Show ${r.name}`}
                          />
                          <button
                            onClick={() => onSelect(r.id)}
                            className={`flex-1 text-left text-[11px] leading-tight ${active ? 'text-ink-50' : visible ? 'text-ink-200' : 'text-ink-400'}`}
                          >
                            {r.name}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
