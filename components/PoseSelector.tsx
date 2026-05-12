'use client';

import { useState } from 'react';
import type { Pose } from '@/lib/poses';

interface Props {
  poses: Pose[];
  activePoseId: string | null;
  onSelect: (id: string | null) => void;
  /** Hide the built-in header (used when nested inside an external Collapsible). */
  hideHeader?: boolean;
}

export default function PoseSelector({ poses, activePoseId, onSelect, hideHeader }: Props) {
  const [open, setOpen] = useState(true);

  if (hideHeader) {
    return (
      <div className="space-y-0.5">
        {poses.map((p) => {
          const active = p.id === activePoseId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(active ? null : p.id)}
              className={`w-full text-left px-2 py-1.5 rounded transition flex items-baseline gap-2 ${
                active
                  ? 'bg-ink-700 border border-ink-600 text-ink-50'
                  : 'border border-transparent text-ink-200 hover:bg-ink-800 hover:text-ink-50'
              }`}
            >
              <span className="text-[12px] font-medium leading-tight flex-shrink-0">{p.english}</span>
              <span className="text-[10px] text-ink-400 italic font-serif leading-tight truncate">
                {p.sanskrit}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Standalone header mode (legacy)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-ink-100 flex items-center gap-1"
        >
          <span>{open ? '▾' : '▸'}</span>
          <span>Yoga Poses</span>
          <span className="text-ink-500 font-mono">({poses.length})</span>
        </button>
        {activePoseId && (
          <button
            onClick={() => onSelect(null)}
            className="text-[10px] text-ink-400 hover:text-ink-100"
          >
            clear
          </button>
        )}
      </div>
      {open && (
        <div className="space-y-0.5">
          {poses.map((p) => {
            const active = p.id === activePoseId;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(active ? null : p.id)}
                className={`w-full text-left px-2 py-1.5 rounded transition ${
                  active
                    ? 'bg-ink-700 border border-ink-600 text-ink-50'
                    : 'border border-transparent text-ink-200 hover:bg-ink-800 hover:text-ink-50'
                }`}
              >
                <div className="text-[12px] font-medium leading-tight">{p.english}</div>
                <div className="text-[10px] text-ink-400 italic leading-tight font-serif">
                  {p.sanskrit}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
