'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { POSE_ANGLES } from '@/lib/pose-angles';

const PosedRiggedBodyCanvas = dynamic(
  () => import('@/components/PosedRiggedBodyCanvas'),
  { ssr: false },
);

/**
 * EXPERIMENT — drop the auto-rigged anatomical body into a page and
 * apply pose-angles to it. This is the proof of concept that the
 * 305-muscle anatomical mesh can deform into yoga poses.
 *
 * If it works, the next step is integrating it into the main /body
 * page (replacing the standing-only model). If not, we learn from
 * what's broken and either fix the auto-rigger or fall back to a
 * different path.
 */
export default function PosesExperimentPage() {
  const [poseId, setPoseId] = useState('tadasana');

  return (
    <main className="h-[calc(100vh-64px)] flex flex-col bg-ink-900">
      <header className="px-6 py-3 border-b border-ink-700 bg-ink-800/60 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-baseline gap-3">
          <Link href="/body" className="text-[11px] text-ink-300 hover:text-ink-100">
            ← body atlas
          </Link>
          <h1 className="font-serif text-lg text-ink-50">Pose Experiment — auto-rigged body</h1>
          <span className="text-[11px] text-ink-400 italic">
            proof of concept · auto-weighted, rigid binding
          </span>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[220px_1fr] min-h-0">
        <aside className="border-r border-ink-700 bg-ink-800/40 p-3 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mb-2">
            Pose
          </p>
          <ul className="space-y-1">
            {POSE_ANGLES.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setPoseId(p.id)}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded transition ${
                    poseId === p.id
                      ? 'bg-ink-700 text-ink-50'
                      : 'text-ink-200 hover:bg-ink-800'
                  }`}
                >
                  <div>{p.english}</div>
                  <div className="text-[10px] text-ink-400 italic">{p.sanskrit}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="relative">
          <PosedRiggedBodyCanvas poseId={poseId} />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
            Drag or ← → to rotate · ↑ ↓ to zoom
          </div>
        </div>
      </div>
    </main>
  );
}
