'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import BodyPanel from './BodyPanel';
import BodyList from './BodyList';
import { BODY_PARTS, getBodyPart } from '@/lib/body';

const BodyCanvas = dynamic(() => import('./BodyCanvas'), { ssr: false });

// Initial: show muscles only (skeleton on but ghosted via skinOpacity)
const INITIAL_VISIBLE = new Set(BODY_PARTS.map((p) => p.id));

const PRESETS: { id: string; label: string; regionIds: string[] }[] = [
  { id: 'all', label: 'Whole body', regionIds: BODY_PARTS.map((p) => p.id) },
  {
    id: 'skeleton',
    label: 'Skeleton only',
    regionIds: BODY_PARTS.filter((p) => p.kind === 'bone').map((p) => p.id),
  },
  {
    id: 'muscles',
    label: 'Muscles only',
    regionIds: BODY_PARTS.filter((p) => p.kind === 'muscle').map((p) => p.id),
  },
  {
    id: 'core',
    label: 'Core',
    regionIds: BODY_PARTS.filter((p) => p.region === 'core').map((p) => p.id),
  },
  {
    id: 'hips',
    label: 'Hips & glutes',
    regionIds: BODY_PARTS.filter((p) => p.region === 'pelvis-hip').map((p) => p.id),
  },
  {
    id: 'thighs',
    label: 'Thighs',
    regionIds: BODY_PARTS.filter((p) => p.region === 'thigh').map((p) => p.id),
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    regionIds: BODY_PARTS.filter((p) => p.region === 'shoulder-girdle').map((p) => p.id),
  },
  {
    id: 'back',
    label: 'Back',
    regionIds: BODY_PARTS.filter((p) => p.region === 'back').map((p) => p.id),
  },
  {
    id: 'hamstrings',
    label: 'Hamstrings',
    regionIds: BODY_PARTS.filter((p) =>
      ['long_head_of_biceps_femoris', 'short_head_of_biceps_femoris', 'semitendinosus_muscle', 'semimembranosus_muscle'].includes(p.id.replace(/_(l|r)$/, '').replace(/^muscle_/, '')),
    ).map((p) => p.id),
  },
];

export default function BodyExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(INITIAL_VISIBLE);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
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

  const showOnly = (ids: string[]) => setVisibleIds(new Set(ids));
  const showAll = () => setVisibleIds(new Set(BODY_PARTS.map((p) => p.id)));
  const hideAll = () => setVisibleIds(new Set());

  const visibleCount = useMemo(() => visibleIds.size, [visibleIds]);
  const totalCount = BODY_PARTS.length;

  // Active = the thing the user is currently pointing at (hover wins over select)
  const activeId = hoveredId || selectedId;
  const activePart = activeId ? getBodyPart(activeId) : null;

  return (
    <div className={
      fullscreen
        ? 'fixed inset-0 z-50 grid grid-cols-1 h-screen w-screen bg-ink-900'
        : 'grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900'
    }>
      <aside className={`${fullscreen ? 'hidden' : 'hidden lg:flex'} flex-col border-r border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden`}>
        <div className="p-4 border-b border-ink-700 space-y-3">
          <div>
            <h2 className="font-serif text-lg text-ink-50 leading-tight">Body Atlas</h2>
            <p className="text-[11px] text-ink-300 mt-0.5">
              {visibleCount} of {totalCount} shown · Ashtanga lens
            </p>
          </div>

          <div className="flex gap-1.5">
            <button onClick={showAll} className="flex-1 text-[11px] px-2 py-1.5 rounded border border-ink-600 text-ink-100 hover:bg-ink-700 transition">All</button>
            <button onClick={hideAll} className="flex-1 text-[11px] px-2 py-1.5 rounded border border-ink-600 text-ink-100 hover:bg-ink-700 transition">None</button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300">Presets</p>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => showOnly(p.regionIds)}
                  className="text-[11px] px-2 py-1 rounded-full border border-ink-600 text-ink-200 hover:bg-ink-700 hover:text-ink-50 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <BodyList
            selectedId={selectedId}
            visibleIds={visibleIds}
            onSelect={selectAndShow}
            onHover={setHoveredId}
            onToggleVisible={toggleVisible}
          />
        </div>
      </aside>

      <main className="relative min-h-0 h-full overflow-hidden">
        <BodyCanvas
          selectedId={selectedId}
          hoveredId={hoveredId}
          visibleIds={visibleIds}
          onSelect={selectAndShow}
          onHover={setHoveredId}
        />
        <button
          onClick={() => setFullscreen((v) => !v)}
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 text-[11px] text-ink-100 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 hover:bg-ink-800 hover:border-ink-500 backdrop-blur transition"
        >
          {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>

        {/* Active-part label — fixed at top center so it never covers the body */}
        {activePart && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-sm text-ink-50 bg-ink-900/90 px-4 py-2 rounded-full border border-ink-700 backdrop-blur shadow-lg pointer-events-none">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activePart.kind === 'muscle' ? '#c45050' : '#e8dec5' }}
            />
            <span className="font-medium">{activePart.name}</span>
            {activePart.side && (
              <span className="text-ink-400 text-xs font-mono">
                {activePart.side === 'l' ? 'L' : 'R'}
              </span>
            )}
            {hoveredId && selectedId && hoveredId !== selectedId && (
              <span className="text-ink-400 text-xs">· hovering</span>
            )}
          </div>
        )}

        {visibleCount === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-ink-300 text-sm bg-ink-900/85 px-4 py-2.5 rounded-md border border-ink-700 backdrop-blur pointer-events-none">
            Nothing selected. Check a part on the left to add it.
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag to rotate · right-drag to pan · scroll to zoom
        </div>
        {!fullscreen && (
          <a href="/credits" className="absolute bottom-3 right-3 text-[10px] text-ink-400 hover:text-ink-200 underline decoration-ink-700 underline-offset-2">
            Anatomy: Z-Anatomy / BodyParts3D, CC BY-SA
          </a>
        )}
      </main>

      <aside className={`${fullscreen ? 'hidden' : ''} border-l border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden`}>
        <BodyPanel
          partId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={selectAndShow}
        />
      </aside>
    </div>
  );
}
