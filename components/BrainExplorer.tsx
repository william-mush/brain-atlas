'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import RegionPanel from './RegionPanel';
import RegionList from './RegionList';
import { REGIONS, SOURCE_LABELS, type RegionSource } from '@/lib/regions';

const BrainCanvas = dynamic(() => import('./BrainCanvas'), { ssr: false });

// All sources that exist in the data.
const ALL_SOURCES: RegionSource[] = ['bp3d', 'fsavg', 'xie', 'procedural'];

// Build per-source region id lists once.
const REGIONS_BY_SOURCE: Record<RegionSource, string[]> = {
  bp3d: REGIONS.filter((r) => r.source === 'bp3d' && r.meshNode).map((r) => r.id),
  fsavg: REGIONS.filter((r) => r.source === 'fsavg' && r.meshNode).map((r) => r.id),
  xie: REGIONS.filter((r) => r.source === 'xie' && r.meshNode).map((r) => r.id),
  procedural: REGIONS.filter((r) => r.source === 'procedural' && (r.nerveId || (r.position && r.scale))).map((r) => r.id),
};

const RENDERABLE_IDS = REGIONS.filter((r) => r.meshNode || r.nerveId || (r.position && r.scale)).map((r) => r.id);

// Default sources on: fsaverage (foliated cortex) and BP3D for subcortical.
// Xie nerves and procedural off by default — they'd clutter the initial view.
const DEFAULT_SOURCES: Set<RegionSource> = new Set(['bp3d', 'fsavg']);

// Initial visible regions: BP3D subcortical structures (the things fsavg
// doesn't cover) + the fsaverage cortex.
const FSAVG_DEFAULT = REGIONS_BY_SOURCE.fsavg;
const BP3D_SUBCORTICAL = REGIONS.filter(
  (r) => r.source === 'bp3d' && r.meshNode &&
    !['cerebrum-shell-left', 'cerebrum-shell-right', 'occipital-lobe', 'insula', 'anterior-cingulate'].includes(r.id),
).map((r) => r.id);
const INITIAL_VISIBLE = new Set<string>([...BP3D_SUBCORTICAL, ...FSAVG_DEFAULT]);

const PRESETS: { id: string; label: string; regionIds: string[] }[] = [
  { id: 'cortex+sub', label: 'Cortex + subcortical', regionIds: [...BP3D_SUBCORTICAL, ...FSAVG_DEFAULT] },
  { id: 'cortex-only', label: 'Cortex only (fsaverage)', regionIds: FSAVG_DEFAULT },
  { id: 'bp3d-only', label: 'BodyParts3D only', regionIds: REGIONS_BY_SOURCE.bp3d },
  { id: 'brainstem', label: 'Brainstem only', regionIds: ['midbrain', 'pons', 'medulla'] },
  { id: 'limbic', label: 'Limbic system', regionIds: ['hippocampus', 'amygdala', 'fornix', 'anterior-cingulate', 'hypothalamus'] },
  { id: 'basal-ganglia', label: 'Basal ganglia', regionIds: ['caudate', 'putamen', 'globus-pallidus', 'thalamus'] },
  { id: 'memory', label: 'Memory circuit', regionIds: ['hippocampus', 'fornix', 'hypothalamus', 'thalamus', 'anterior-cingulate'] },
  { id: 'autonomic-core', label: 'Autonomic core', regionIds: ['hypothalamus', 'medulla', 'pons', 'insula', 'anterior-cingulate'] },
  { id: 'cranial-nerves-real', label: 'Cranial nerves (Xie MRI)', regionIds: [...REGIONS_BY_SOURCE.xie, 'midbrain', 'pons', 'medulla'] },
  { id: 'cranial-nerves-all', label: 'All 12 cranial nerves', regionIds: [...REGIONS.filter((r) => r.nerveId).map((r) => r.id), 'midbrain', 'pons', 'medulla'] },
  { id: 'vision', label: 'Vision pathway', regionIds: ['xie-cn2-optic', 'thalamus', 'occipital-lobe', 'fsavg-L-pericalcarine', 'fsavg-R-pericalcarine'] },
  { id: 'language', label: 'Language network', regionIds: ['fsavg-L-parsopercularis', 'fsavg-L-parstriangularis', 'fsavg-L-superiortemporal', 'fsavg-L-bankssts', 'fsavg-L-supramarginal'] },
  { id: 'motor-strip', label: 'Motor cortex', regionIds: ['fsavg-L-precentral', 'fsavg-R-precentral', 'fsavg-L-paracentral', 'fsavg-R-paracentral'] },
  { id: 'somatosensory', label: 'Somatosensory cortex', regionIds: ['fsavg-L-postcentral', 'fsavg-R-postcentral'] },
  { id: 'default-mode', label: 'Default mode network', regionIds: ['fsavg-L-posteriorcingulate', 'fsavg-R-posteriorcingulate', 'fsavg-L-precuneus', 'fsavg-R-precuneus', 'fsavg-L-medialorbitofrontal', 'fsavg-R-medialorbitofrontal'] },
];

export default function BrainExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(INITIAL_VISIBLE);
  const [enabledSources, setEnabledSources] = useState<Set<RegionSource>>(DEFAULT_SOURCES);

  const toggleVisible = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSource = (s: RegionSource) => {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        next.delete(s);
        // Also hide all regions from that source
        setVisibleIds((vp) => {
          const nv = new Set(vp);
          for (const id of REGIONS_BY_SOURCE[s]) nv.delete(id);
          return nv;
        });
      } else {
        next.add(s);
      }
      return next;
    });
  };

  const selectAndShow = (id: string | null) => {
    if (id) {
      const region = REGIONS.find((r) => r.id === id);
      // Make sure its source is enabled
      if (region && !enabledSources.has(region.source)) {
        setEnabledSources((prev) => new Set([...prev, region.source]));
      }
      setVisibleIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
    setSelectedId(id);
  };

  const showOnly = (ids: string[]) => {
    // Enable any source the preset touches
    const needed = new Set<RegionSource>();
    for (const id of ids) {
      const r = REGIONS.find((x) => x.id === id);
      if (r) needed.add(r.source);
    }
    setEnabledSources((prev) => new Set([...prev, ...needed]));
    setVisibleIds(new Set(ids));
  };

  const showAll = () => {
    // Only show regions whose source is currently enabled
    const ids = REGIONS.filter((r) => enabledSources.has(r.source))
      .filter((r) => r.meshNode || r.nerveId || (r.position && r.scale))
      .map((r) => r.id);
    setVisibleIds(new Set(ids));
  };

  const hideAll = () => setVisibleIds(new Set());

  const visibleCount = useMemo(() => visibleIds.size, [visibleIds]);

  // Count of regions in currently-enabled sources
  const enabledTotal = useMemo(() => {
    return REGIONS.filter(
      (r) => enabledSources.has(r.source) && (r.meshNode || r.nerveId || (r.position && r.scale)),
    ).length;
  }, [enabledSources]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900">
      <aside className="hidden lg:flex flex-col border-r border-ink-700 bg-ink-800/60">
        <div className="p-4 border-b border-ink-700 space-y-3">
          <div>
            <h2 className="font-serif text-lg text-ink-50 leading-tight">Build a brain</h2>
            <p className="text-[11px] text-ink-300 mt-0.5">
              {visibleCount} of {enabledTotal} shown
            </p>
          </div>

          {/* Sources */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300">Sources</p>
            <div className="space-y-1">
              {ALL_SOURCES.map((s) => {
                const enabled = enabledSources.has(s);
                const count = REGIONS_BY_SOURCE[s].length;
                return (
                  <button
                    key={s}
                    onClick={() => toggleSource(s)}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-xs transition ${
                      enabled
                        ? 'bg-ink-700 text-ink-50 border border-ink-600'
                        : 'text-ink-300 hover:bg-ink-800 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2 leading-tight">
                      <span
                        className={`w-3 h-3 rounded-sm border ${
                          enabled ? 'bg-ink-50 border-ink-50' : 'border-ink-500'
                        }`}
                      />
                      <span>{SOURCE_LABELS[s]}</span>
                    </span>
                    <span className="text-ink-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={showAll}
              className="flex-1 text-[11px] px-2 py-1.5 rounded border border-ink-600 text-ink-100 hover:bg-ink-700 transition"
            >
              All
            </button>
            <button
              onClick={hideAll}
              className="flex-1 text-[11px] px-2 py-1.5 rounded border border-ink-600 text-ink-100 hover:bg-ink-700 transition"
            >
              None
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300">Presets</p>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => showOnly(p.regionIds)}
                  className="text-[11px] px-2 py-1 rounded-full border border-ink-600 text-ink-200 hover:bg-ink-700 hover:text-ink-50 transition"
                  title={p.regionIds.slice(0, 6).join(', ') + (p.regionIds.length > 6 ? '…' : '')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <RegionList
            selectedId={selectedId}
            visibleIds={visibleIds}
            enabledSources={enabledSources}
            onSelect={selectAndShow}
            onHover={setHoveredId}
            onToggleVisible={toggleVisible}
          />
        </div>
      </aside>

      <main className="relative">
        <BrainCanvas
          selectedId={selectedId}
          hoveredId={hoveredId}
          visibleIds={visibleIds}
          onSelect={selectAndShow}
          onHover={setHoveredId}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag to rotate · right-drag to pan · scroll to zoom
        </div>
        <a
          href="/credits"
          className="absolute bottom-3 right-3 text-[10px] text-ink-400 hover:text-ink-200 underline decoration-ink-700 underline-offset-2"
        >
          Credits & licenses
        </a>
      </main>

      <aside className="border-l border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden">
        <RegionPanel
          regionId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={selectAndShow}
        />
      </aside>
    </div>
  );
}
