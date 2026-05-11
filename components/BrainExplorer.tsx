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
          onSelect={setSelectedId}
        />
      </aside>
    </div>
  );
}
