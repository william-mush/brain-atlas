'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import RegionPanel from './RegionPanel';
import RegionList from './RegionList';
import { REGIONS } from '@/lib/regions';

const BrainCanvas = dynamic(() => import('./BrainCanvas'), { ssr: false });

// Initial set: show everything that has a real mesh
const INITIAL_VISIBLE = new Set(REGIONS.filter((r) => r.meshNode).map((r) => r.id));

const PRESETS: { id: string; label: string; regionIds: string[] }[] = [
  {
    id: 'all',
    label: 'Whole brain',
    regionIds: REGIONS.filter((r) => r.meshNode).map((r) => r.id),
  },
  {
    id: 'brainstem',
    label: 'Brainstem only',
    regionIds: ['midbrain', 'pons', 'medulla'],
  },
  {
    id: 'limbic',
    label: 'Limbic',
    regionIds: ['hippocampus', 'amygdala', 'fornix', 'anterior-cingulate', 'hypothalamus'],
  },
  {
    id: 'basal-ganglia',
    label: 'Basal ganglia',
    regionIds: ['caudate', 'putamen', 'globus-pallidus', 'thalamus'],
  },
  {
    id: 'memory',
    label: 'Memory circuit',
    regionIds: ['hippocampus', 'fornix', 'hypothalamus', 'thalamus', 'anterior-cingulate'],
  },
  {
    id: 'autonomic-core',
    label: 'Autonomic core',
    regionIds: ['hypothalamus', 'medulla', 'pons', 'insula', 'anterior-cingulate'],
  },
];

export default function BrainExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(INITIAL_VISIBLE);

  const toggleVisible = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Wrapper: when something is selected (e.g. via a "connects to" chip), make
  // sure it's also visible so the 3D actually shows it.
  const selectAndShow = (id: string | null) => {
    if (id) {
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
    setVisibleIds(new Set(ids));
  };

  const showAll = () => {
    setVisibleIds(new Set(REGIONS.filter((r) => r.meshNode).map((r) => r.id)));
  };

  const hideAll = () => {
    setVisibleIds(new Set());
  };

  // Visible-set summary for header
  const visibleCount = useMemo(() => visibleIds.size, [visibleIds]);
  const meshRegionCount = useMemo(
    () => REGIONS.filter((r) => r.meshNode).length,
    [],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900">
      <aside className="hidden lg:flex flex-col border-r border-ink-700 bg-ink-800/60">
        <div className="p-4 border-b border-ink-700 space-y-3">
          <div>
            <h2 className="font-serif text-lg text-ink-50 leading-tight">Build a brain</h2>
            <p className="text-[11px] text-ink-300 mt-0.5">
              Check the parts you want to see. {visibleCount}/{meshRegionCount} shown.
            </p>
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
                  title={p.regionIds.join(', ')}
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
          Drag to rotate · scroll to zoom · click a region
        </div>
        <a
          href="/credits"
          className="absolute bottom-3 right-3 text-[10px] text-ink-400 hover:text-ink-200 underline decoration-ink-700 underline-offset-2"
        >
          Anatomy: BodyParts3D © DBCLS, CC BY-SA 2.1 JP
        </a>
      </main>

      <aside className="border-l border-ink-700 bg-ink-800/60">
        <RegionPanel
          regionId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={selectAndShow}
        />
      </aside>
    </div>
  );
}
