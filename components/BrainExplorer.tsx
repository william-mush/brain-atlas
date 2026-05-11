'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import RegionPanel from './RegionPanel';
import RegionList from './RegionList';

// 3D canvas is client-only and heavy — load it without SSR.
const BrainCanvas = dynamic(() => import('./BrainCanvas'), { ssr: false });

export default function BrainExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_360px] h-[calc(100vh-64px)] bg-ink-900">
      <aside className="hidden lg:block border-r border-ink-700 bg-ink-800/60">
        <RegionList
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
        />
      </aside>

      <main className="relative">
        <BrainCanvas
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag to rotate · scroll to zoom · click a region
        </div>
      </main>

      <aside className="border-l border-ink-700 bg-ink-800/60">
        <RegionPanel
          regionId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={setSelectedId}
        />
      </aside>
    </div>
  );
}
