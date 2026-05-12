'use client';

import { useEffect, useMemo, useState } from 'react';
import { BODY_PARTS, REGION_LABELS, type BodyRegion, getBodyPart } from '@/lib/body';

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

  // Open-state per region. Default: closed.
  const [openRegions, setOpenRegions] = useState<Set<BodyRegion>>(() => new Set());

  // Auto-open the region containing the currently selected part.
  useEffect(() => {
    if (!selectedId) return;
    const part = getBodyPart(selectedId);
    if (!part) return;
    setOpenRegions((prev) => {
      if (prev.has(part.region)) return prev;
      const next = new Set(prev);
      next.add(part.region);
      return next;
    });
  }, [selectedId]);

  const toggleRegion = (r: BodyRegion) => {
    setOpenRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const expandAll = () =>
    setOpenRegions(new Set(REGION_ORDER.filter((r) => enabledRegions.has(r))));
  const collapseAll = () => setOpenRegions(new Set());

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-end gap-2 text-[10px] text-ink-400 px-1 pb-1">
        <button onClick={expandAll} className="hover:text-ink-100">expand all</button>
        <span className="text-ink-600">·</span>
        <button onClick={collapseAll} className="hover:text-ink-100">collapse all</button>
      </div>
      {REGION_ORDER.filter((r) => enabledRegions.has(r)).map((region) => {
        const bucket = grouped[region];
        if (!bucket || (bucket.muscles.length === 0 && bucket.bones.length === 0)) return null;

        const open = openRegions.has(region);
        const totalCount = bucket.muscles.length + bucket.bones.length;
        const visibleCount =
          bucket.muscles.filter((p) => visibleIds.has(p.id)).length +
          bucket.bones.filter((p) => visibleIds.has(p.id)).length;

        return (
          <section key={region} className="border-b border-ink-700/40 last:border-b-0">
            <button
              onClick={() => toggleRegion(region)}
              className="w-full px-2 py-1.5 flex items-center justify-between gap-2 hover:bg-ink-800/40 rounded transition"
            >
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-300">
                <span className={`text-ink-500 transition-transform ${open ? 'rotate-90' : ''}`}>▸</span>
                <span>{REGION_LABELS[region]}</span>
              </span>
              <span className="text-[10px] text-ink-500 font-mono">
                {visibleCount}/{totalCount}
              </span>
            </button>

            {open && (
              <div className="pl-2 pb-2">
                {bucket.muscles.length > 0 && (
                  <ul className="space-y-0.5 mb-1.5">
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
                    <summary className="cursor-pointer hover:text-ink-200 px-2">Bones ({bucket.bones.length})</summary>
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
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
