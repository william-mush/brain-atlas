'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import BodyPanel from './BodyPanel';
import BodyList from './BodyList';
import PoseSelector from './PoseSelector';
import { BODY_PARTS, getBodyPart, type BodyRegion, type BoneGroup, BONE_GROUP_LABELS } from '@/lib/body';
import { POSES, getPose, SIMPLE_STATE_COLORS, SIMPLE_STATE_LABELS, type SimpleState } from '@/lib/poses';

const BodyCanvas = dynamic(() => import('./BodyCanvas'), { ssr: false });

const ALL_REGIONS: BodyRegion[] = [
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

const REGION_SHORT: Record<BodyRegion, string> = {
  'head-neck': 'Head / neck',
  'shoulder-girdle': 'Shoulders',
  arm: 'Arms',
  chest: 'Chest',
  back: 'Back',
  core: 'Core',
  'pelvis-hip': 'Pelvis / hip',
  thigh: 'Thighs',
  'lower-leg-foot': 'Lower leg / foot',
  skeleton: 'Skeleton',
};

const RANGE_PRESETS: { id: string; label: string; regions: BodyRegion[] }[] = [
  { id: 'whole-body', label: 'Whole body', regions: ALL_REGIONS },
  { id: 'upper-body', label: 'Upper body', regions: ['head-neck', 'shoulder-girdle', 'arm', 'chest', 'back', 'core'] },
  { id: 'lower-body', label: 'Lower body', regions: ['core', 'pelvis-hip', 'thigh', 'lower-leg-foot'] },
  { id: 'hip-to-knee', label: 'Hip to knee', regions: ['pelvis-hip', 'thigh'] },
  { id: 'knee-to-foot', label: 'Knee to foot', regions: ['lower-leg-foot'] },
  { id: 'shoulder-to-hand', label: 'Shoulder to hand', regions: ['shoulder-girdle', 'arm'] },
  { id: 'trunk', label: 'Trunk only', regions: ['chest', 'back', 'core'] },
];

const INITIAL_REGIONS = new Set<BodyRegion>(ALL_REGIONS);
const INITIAL_VISIBLE = new Set(BODY_PARTS.map((p) => p.id));

const BONE_GROUP_ORDER: BoneGroup[] = [
  'skull', 'spine', 'ribs', 'pelvis', 'arm-bones', 'hand', 'leg-bones', 'foot',
];

function partsInBoneGroup(group: BoneGroup): string[] {
  return BODY_PARTS.filter((p) => p.kind === 'bone' && p.boneGroup === group).map((p) => p.id);
}

function partsInAllBoneGroups(): Map<BoneGroup, string[]> {
  const m = new Map<BoneGroup, string[]>();
  for (const g of BONE_GROUP_ORDER) {
    const ids = partsInBoneGroup(g);
    if (ids.length > 0) m.set(g, ids);
  }
  return m;
}
const BONE_GROUPS = partsInAllBoneGroups();

export default function BodyExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(INITIAL_VISIBLE);
  const [enabledRegions, setEnabledRegions] = useState<Set<BodyRegion>>(INITIAL_REGIONS);
  const [activePoseId, setActivePoseId] = useState<string | null>(null);
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
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleRegion = (r: BodyRegion) => {
    setEnabledRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r); else next.add(r);
      return next;
    });
  };

  const setRangeRegions = (regs: BodyRegion[]) => {
    setEnabledRegions(new Set(regs));
  };

  const selectAndShow = (id: string | null) => {
    if (id) {
      // Make sure its region is enabled
      const part = getBodyPart(id);
      if (part && !enabledRegions.has(part.region)) {
        setEnabledRegions((prev) => new Set([...prev, part.region]));
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

  const showAllParts = () => setVisibleIds(new Set(BODY_PARTS.map((p) => p.id)));
  const hideAllParts = () => setVisibleIds(new Set());

  // Toggle every bone in a bone group (show if any are hidden, else hide all).
  const toggleBoneGroup = (group: BoneGroup) => {
    const ids = BONE_GROUPS.get(group) || [];
    if (ids.length === 0) return;
    setVisibleIds((prev) => {
      const anyVisible = ids.some((id) => prev.has(id));
      const next = new Set(prev);
      if (anyVisible) {
        for (const id of ids) next.delete(id);
      } else {
        for (const id of ids) next.add(id);
      }
      return next;
    });
  };

  // Quick presets — show ONLY a particular bone group (hide everything else)
  const showOnlyBoneGroup = (group: BoneGroup) => {
    const ids = BONE_GROUPS.get(group) || [];
    setVisibleIds(new Set(ids));
    // Make sure all regions are on so we don't accidentally hide stuff
    setEnabledRegions(new Set(ALL_REGIONS));
  };

  const showAllBones = () => {
    const ids = BODY_PARTS.filter((p) => p.kind === 'bone').map((p) => p.id);
    setVisibleIds(new Set(ids));
  };

  const hideAllBones = () => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      for (const p of BODY_PARTS) {
        if (p.kind === 'bone') next.delete(p.id);
      }
      return next;
    });
  };

  const groupVisibility = useMemo(() => {
    const m: Partial<Record<BoneGroup, 'all' | 'some' | 'none'>> = {};
    for (const [g, ids] of BONE_GROUPS.entries()) {
      const onCount = ids.filter((id) => visibleIds.has(id)).length;
      if (onCount === 0) m[g] = 'none';
      else if (onCount === ids.length) m[g] = 'all';
      else m[g] = 'some';
    }
    return m;
  }, [visibleIds]);

  // The set the canvas actually renders: visible AND in an enabled region.
  const effectiveVisible = useMemo(() => {
    const result = new Set<string>();
    for (const id of visibleIds) {
      const part = getBodyPart(id);
      if (part && enabledRegions.has(part.region)) result.add(id);
    }
    return result;
  }, [visibleIds, enabledRegions]);

  const visibleCount = effectiveVisible.size;
  const totalCount = BODY_PARTS.filter((p) => enabledRegions.has(p.region)).length;

  const activeId = hoveredId || selectedId;
  const activePart = activeId ? getBodyPart(activeId) : null;

  const activePose = (activePoseId ? getPose(activePoseId) : null) ?? null;

  return (
    <div className={
      fullscreen
        ? 'fixed inset-0 z-50 grid grid-cols-1 h-screen w-screen bg-ink-900'
        : 'grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900'
    }>
      <aside className={`${fullscreen ? 'hidden' : 'hidden lg:flex'} flex-col border-r border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden`}>
        {/* Fixed header */}
        <div className="px-4 py-3 border-b border-ink-700 flex-shrink-0">
          <h2 className="font-serif text-lg text-ink-50 leading-tight">Body Atlas</h2>
          <p className="text-[11px] text-ink-300 mt-0.5">
            {visibleCount} of {totalCount} shown · Ashtanga lens
          </p>
        </div>

        {/* Scrollable column with collapsible groups */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Collapsible
            title="Sections"
            defaultOpen={false}
            actions={
              <span className="flex gap-2 text-[10px]">
                <button
                  onClick={(e) => { e.stopPropagation(); setRangeRegions(ALL_REGIONS); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  all
                </button>
                <span className="text-ink-600">·</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setEnabledRegions(new Set()); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  none
                </button>
              </span>
            }
          >
            <div className="grid grid-cols-2 gap-1">
              {ALL_REGIONS.map((r) => {
                const enabled = enabledRegions.has(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    className={`text-[11px] px-2 py-1 rounded border transition flex items-center gap-1.5 ${
                      enabled
                        ? 'bg-ink-700 text-ink-50 border-ink-600'
                        : 'text-ink-400 border-ink-700 hover:text-ink-200 hover:border-ink-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${enabled ? 'bg-ink-50' : 'border border-ink-500'}`} />
                    <span className="truncate">{REGION_SHORT[r]}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1 pt-2">
              {RANGE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setRangeRegions(p.regions)}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-ink-700 text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 pt-2">
              <button onClick={showAllParts} className="flex-1 text-[10px] px-2 py-1 rounded border border-ink-700 text-ink-200 hover:bg-ink-700 transition">Show all parts</button>
              <button onClick={hideAllParts} className="flex-1 text-[10px] px-2 py-1 rounded border border-ink-700 text-ink-200 hover:bg-ink-700 transition">Hide all</button>
            </div>
          </Collapsible>

          <Collapsible
            title="Bones"
            defaultOpen={false}
            actions={
              <span className="flex gap-2 text-[10px]">
                <button
                  onClick={(e) => { e.stopPropagation(); showAllBones(); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  all
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); hideAllBones(); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  none
                </button>
              </span>
            }
          >
            <div className="grid grid-cols-2 gap-1">
              {Array.from(BONE_GROUPS.keys()).map((g) => {
                const vis = groupVisibility[g] || 'none';
                const allOn = vis === 'all';
                const partial = vis === 'some';
                return (
                  <button
                    key={g}
                    onClick={() => toggleBoneGroup(g)}
                    onDoubleClick={() => showOnlyBoneGroup(g)}
                    title="Click to toggle; double-click to show only this group"
                    className={`text-[11px] px-2 py-1 rounded border transition flex items-center gap-1.5 ${
                      allOn
                        ? 'bg-ink-700 text-ink-50 border-ink-600'
                        : partial
                          ? 'bg-ink-800 text-ink-100 border-ink-600'
                          : 'text-ink-400 border-ink-700 hover:text-ink-200 hover:border-ink-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${
                      allOn ? 'bg-[#e8dec5]' : partial ? 'bg-[#e8dec5]/40' : 'border border-ink-500'
                    }`} />
                    <span className="truncate">{BONE_GROUP_LABELS[g]}</span>
                  </button>
                );
              })}
            </div>
          </Collapsible>

          <Collapsible
            title="Yoga Poses"
            count={POSES.length}
            defaultOpen={true}
            actions={
              activePoseId && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActivePoseId(null); }}
                  className="text-[10px] text-ink-400 hover:text-ink-100"
                >
                  clear
                </button>
              )
            }
          >
            <PoseSelector
              poses={POSES}
              activePoseId={activePoseId}
              onSelect={setActivePoseId}
              hideHeader
            />
          </Collapsible>

          <Collapsible
            title="Browse parts"
            defaultOpen={true}
            actions={
              <span className="flex gap-2 text-[10px]">
                <button
                  onClick={(e) => { e.stopPropagation(); showAllParts(); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  all
                </button>
                <span className="text-ink-600">·</span>
                <button
                  onClick={(e) => { e.stopPropagation(); hideAllParts(); }}
                  className="text-ink-400 hover:text-ink-100"
                >
                  none
                </button>
              </span>
            }
          >
            <BodyList
              selectedId={selectedId}
              visibleIds={visibleIds}
              enabledRegions={enabledRegions}
              onSelect={selectAndShow}
              onHover={setHoveredId}
              onToggleVisible={toggleVisible}
            />
          </Collapsible>
        </div>
      </aside>

      <main className="relative min-h-0 h-full overflow-hidden">
        <BodyCanvas
          selectedId={selectedId}
          hoveredId={hoveredId}
          visibleIds={effectiveVisible}
          activePose={activePose}
          onSelect={selectAndShow}
          onHover={setHoveredId}
        />
        <button
          onClick={() => setFullscreen((v) => !v)}
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 text-[11px] text-ink-100 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 hover:bg-ink-800 hover:border-ink-500 backdrop-blur transition"
        >
          {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>

        {activePart && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-sm text-ink-50 bg-ink-900/90 px-4 py-2 rounded-full border border-ink-700 backdrop-blur shadow-lg pointer-events-none">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activePart.kind === 'muscle' ? '#c45050' : '#e8dec5' }}
            />
            <span className="font-medium">{activePart.name}</span>
            {activePart.side && (
              <span className="text-ink-400 text-xs font-mono">{activePart.side === 'l' ? 'L' : 'R'}</span>
            )}
            {hoveredId && selectedId && hoveredId !== selectedId && (
              <span className="text-ink-400 text-xs">· hovering</span>
            )}
          </div>
        )}

        {visibleCount === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-ink-300 text-sm bg-ink-900/85 px-4 py-2.5 rounded-md border border-ink-700 backdrop-blur pointer-events-none">
            Nothing selected. Enable a section on the left or pick a part.
          </div>
        )}

        {/* Pose state legend — visible when a pose is active */}
        {activePose && (
          <div className="absolute bottom-16 left-3 z-20 bg-ink-900/85 px-3 py-2 rounded-md border border-ink-700 backdrop-blur text-[11px] text-ink-200 max-w-[220px]">
            <div className="font-medium text-ink-50 mb-1.5 truncate">{activePose.english}</div>
            <ul className="space-y-1.5">
              {(['working', 'stretching', 'at-risk', 'quiet'] as const).map((s: SimpleState) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-ink-700" style={{ backgroundColor: SIMPLE_STATE_COLORS[s] }} />
                  <span className="leading-tight">{SIMPLE_STATE_LABELS[s]}</span>
                </li>
              ))}
            </ul>
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
          activePose={activePose}
          onClose={() => setSelectedId(null)}
          onSelect={selectAndShow}
          onClearPose={() => setActivePoseId(null)}
        />
      </aside>
    </div>
  );
}

interface CollapsibleProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

function Collapsible({ title, count, defaultOpen = true, actions, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink-700/60 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-ink-800/50 transition"
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-200">
          <span className={`inline-block transition-transform text-ink-400 ${open ? 'rotate-90' : ''}`}>
            ▸
          </span>
          <span>{title}</span>
          {count !== undefined && (
            <span className="text-ink-500 font-mono normal-case tracking-normal">({count})</span>
          )}
        </span>
        {actions && (
          <span onClick={(e) => e.stopPropagation()}>{actions}</span>
        )}
      </button>
      {open && <div className="px-4 pb-3 pt-1">{children}</div>}
    </div>
  );
}
