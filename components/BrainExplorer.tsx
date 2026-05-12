'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import RegionPanel from './RegionPanel';
import RegionList from './RegionList';
import { REGIONS, SOURCE_LABELS, getRegion, type RegionSource } from '@/lib/regions';
import { LIMB_MAPPINGS, allLimbRegions, type LimbMapping } from '@/lib/limb-mappings';
import type { EightLimb } from '@/lib/compendium';

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
  const [fullscreen, setFullscreen] = useState(false);

  // Awareness mode state.
  const [awarenessMode, setAwarenessMode] = useState(false);
  // null = neutral (mode on but no limb chosen), 'all' = show all 8 in their tints, or a specific limb id.
  const [selectedLimb, setSelectedLimb] = useState<EightLimb | 'all' | null>(null);
  // [0..1] opacity for the samadhi dissolution animation. 1 = solid, 0 = invisible.
  const [samadhiFade, setSamadhiFade] = useState(1);
  const fadeAnimRef = useRef<number | null>(null);

  // Run the samādhi dissolution: fade from 1 to ~0.1 over ~2.5s when samādhi is picked.
  useEffect(() => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
    if (selectedLimb === 'samadhi') {
      const start = performance.now();
      const duration = 2500;
      const startOpacity = 1;
      const endOpacity = 0.08;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Ease-in-out for the dissolution.
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setSamadhiFade(startOpacity + (endOpacity - startOpacity) * eased);
        if (t < 1) {
          fadeAnimRef.current = requestAnimationFrame(step);
        }
      };
      fadeAnimRef.current = requestAnimationFrame(step);
    } else {
      setSamadhiFade(1);
    }
    return () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
        fadeAnimRef.current = null;
      }
    };
  }, [selectedLimb]);

  // Escape exits fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

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

  const activeId = hoveredId || selectedId;
  const activeRegion = activeId ? getRegion(activeId) : null;

  // Awareness mode: derive tintMap (region id → color) and fadeMap (region id → opacity).
  const { tintMap, fadeMap, awarenessRegionIds } = useMemo(() => {
    if (!awarenessMode || !selectedLimb) {
      return {
        tintMap: undefined,
        fadeMap: undefined,
        awarenessRegionIds: [] as string[],
      };
    }
    const tint = new Map<string, string>();
    const fade = new Map<string, number>();
    const regionIds: string[] = [];
    if (selectedLimb === 'all') {
      // Show every limb's regions in its own tint. If a region appears in
      // multiple limbs, the latest one in the list wins (samādhi tint, which
      // is fine since samādhi includes everything).
      for (const m of LIMB_MAPPINGS) {
        for (const r of m.regions) {
          tint.set(r, m.tint);
          regionIds.push(r);
        }
      }
    } else {
      const mapping = LIMB_MAPPINGS.find((m) => m.limb === selectedLimb);
      if (mapping) {
        for (const r of mapping.regions) {
          tint.set(r, mapping.tint);
          regionIds.push(r);
          if (selectedLimb === 'samadhi') {
            fade.set(r, samadhiFade);
          }
        }
      }
    }
    return {
      tintMap: tint,
      fadeMap: fade.size > 0 ? fade : undefined,
      awarenessRegionIds: regionIds,
    };
  }, [awarenessMode, selectedLimb, samadhiFade]);

  // When awareness mode + a limb is selected, ensure the limb's regions are visible.
  useEffect(() => {
    if (!awarenessMode || !selectedLimb || awarenessRegionIds.length === 0) return;
    setVisibleIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of awarenessRegionIds) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      // Also make sure their sources are enabled.
      const neededSources = new Set<RegionSource>();
      for (const id of awarenessRegionIds) {
        const r = REGIONS.find((x) => x.id === id);
        if (r) neededSources.add(r.source);
      }
      setEnabledSources((sp) => {
        const ns = new Set(sp);
        let sChanged = false;
        for (const s of neededSources) {
          if (!ns.has(s)) {
            ns.add(s);
            sChanged = true;
          }
        }
        return sChanged ? ns : sp;
      });
      return changed ? next : prev;
    });
  }, [awarenessMode, selectedLimb, awarenessRegionIds]);

  // Find the active limb mapping for the UI panel.
  const activeLimbMapping: LimbMapping | null = useMemo(() => {
    if (!awarenessMode || !selectedLimb || selectedLimb === 'all') return null;
    return LIMB_MAPPINGS.find((m) => m.limb === selectedLimb) ?? null;
  }, [awarenessMode, selectedLimb]);

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 grid grid-cols-1 h-screen w-screen bg-ink-900'
          : 'grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900'
      }
    >
      <aside className={`${fullscreen ? 'hidden' : 'hidden lg:flex'} flex-col border-r border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden`}>
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

      <main className="relative min-h-0 h-full overflow-hidden">
        <BrainCanvas
          selectedId={selectedId}
          hoveredId={hoveredId}
          visibleIds={visibleIds}
          onSelect={selectAndShow}
          onHover={setHoveredId}
          tintMap={tintMap}
          fadeMap={fadeMap}
        />
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              setAwarenessMode((v) => {
                if (v) setSelectedLimb(null);
                return !v;
              });
            }}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border backdrop-blur transition ${
              awarenessMode
                ? 'bg-neural-violet/20 text-ink-50 border-neural-violet/60 hover:bg-neural-violet/30'
                : 'bg-ink-900/80 text-ink-100 border-ink-700 hover:bg-ink-800 hover:border-ink-500'
            }`}
            title="Toggle awareness mode — overlay the eight limbs of Ashtanga Yoga on the brain"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="2.5" />
            </svg>
            Awareness mode
          </button>
          <button
            onClick={() => setFullscreen((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] text-ink-100 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 hover:bg-ink-800 hover:border-ink-500 backdrop-blur transition"
            title={fullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? (
              <>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3v2H3M11 3v2h2M5 13v-2H3M11 13v-2h2" />
                </svg>
                Exit fullscreen
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6V3h3M13 6V3h-3M3 10v3h3M13 10v3h-3" />
                </svg>
                Fullscreen
              </>
            )}
          </button>
        </div>

        {/* Awareness mode panel */}
        {awarenessMode && (
          <div className="absolute top-16 left-3 z-20 w-[300px] max-h-[calc(100%-7rem)] overflow-y-auto bg-ink-900/95 border border-neural-violet/40 rounded-lg backdrop-blur shadow-xl">
            <div className="p-3 border-b border-ink-700">
              <p className="text-[10px] uppercase tracking-[0.18em] text-neural-violet mb-1">
                Awareness Mode
              </p>
              <p className="text-xs text-ink-200 leading-snug">
                The eight limbs of Ashtanga Yoga, overlaid on the nervous system. Pick one — or pick all.
              </p>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => setSelectedLimb('all')}
                className={`w-full text-left px-3 py-2 rounded text-xs transition ${
                  selectedLimb === 'all'
                    ? 'bg-ink-700 text-ink-50 border border-ink-500'
                    : 'text-ink-200 hover:bg-ink-800 border border-transparent'
                }`}
              >
                <span className="font-medium">Show all eight</span>
                <span className="block text-[10px] text-ink-400 mt-0.5">
                  Every limb in its own tint
                </span>
              </button>
              {LIMB_MAPPINGS.map((m) => {
                const isActive = selectedLimb === m.limb;
                const hasRegions = m.regions.length > 0;
                return (
                  <button
                    key={m.limb}
                    onClick={() => setSelectedLimb(m.limb)}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition border ${
                      isActive
                        ? 'bg-ink-800 text-ink-50 border-ink-600'
                        : 'text-ink-200 hover:bg-ink-800 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: m.tint }}
                      />
                      <span className="font-serif text-ink-400 text-[10px] w-5 shrink-0">
                        {m.numeral}
                      </span>
                      <span className="font-medium">{m.sanskrit}</span>
                      <span className="text-ink-400 text-[10px] italic">
                        {m.gloss}
                      </span>
                      {!hasRegions && (
                        <span className="ml-auto text-[9px] uppercase tracking-wider text-ink-500">
                          no anatomy
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {activeLimbMapping && (
              <div className="p-3 border-t border-ink-700 bg-ink-800/40">
                <p className="text-[11px] text-ink-200 leading-relaxed mb-2">
                  {activeLimbMapping.rationale}
                </p>
                <Link
                  href={activeLimbMapping.href}
                  className="inline-flex items-center gap-1 text-[11px] text-neural-violet hover:text-ink-50 transition"
                >
                  Read the essay
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
            {selectedLimb === 'all' && (
              <div className="p-3 border-t border-ink-700 bg-ink-800/40">
                <p className="text-[11px] text-ink-200 leading-relaxed mb-2">
                  All eight limbs at once. Each region is colored by the limb that engages it; where limbs overlap, samādhi&apos;s purple takes precedence — as it should.
                </p>
                <Link
                  href="/awareness/synthesis"
                  className="inline-flex items-center gap-1 text-[11px] text-neural-violet hover:text-ink-50 transition"
                >
                  Read the synthesis paper
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
            {selectedLimb === null && (
              <div className="p-3 border-t border-ink-700 bg-ink-800/40">
                <p className="text-[11px] text-ink-300 leading-relaxed italic">
                  Pick a limb to highlight the regions it engages. The brain stays neutral until you choose.
                </p>
              </div>
            )}
          </div>
        )}

        {activeRegion && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-sm text-ink-50 bg-ink-900/90 px-4 py-2 rounded-full border border-ink-700 backdrop-blur shadow-lg pointer-events-none max-w-[60%]">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeRegion.color }}
            />
            <span className="font-medium truncate">{activeRegion.shortName || activeRegion.name}</span>
            {hoveredId && selectedId && hoveredId !== selectedId && (
              <span className="text-ink-400 text-xs flex-shrink-0">· hovering</span>
            )}
          </div>
        )}

        {visibleCount === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-ink-300 text-sm bg-ink-900/85 px-4 py-2.5 rounded-md border border-ink-700 backdrop-blur pointer-events-none">
            Nothing selected. Check a part on the left to add it.
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag to rotate · right-drag to pan · scroll to zoom{fullscreen ? ' · Esc to exit' : ''}
        </div>
        {!fullscreen && (
          <a
            href="/credits"
            className="absolute bottom-3 right-3 text-[10px] text-ink-400 hover:text-ink-200 underline decoration-ink-700 underline-offset-2"
          >
            Credits & licenses
          </a>
        )}
      </main>

      <aside className={`${fullscreen ? 'hidden' : ''} border-l border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden`}>
        <RegionPanel
          regionId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={selectAndShow}
        />
      </aside>
    </div>
  );
}
