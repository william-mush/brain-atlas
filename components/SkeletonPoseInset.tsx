'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PosedSkeletonCanvas = dynamic(
  () => import('./PosedSkeletonCanvas'),
  { ssr: false },
);

interface Props {
  /** Pose id whose skeleton angles to render. Null = no inset. */
  poseId: string | null;
  /** True if the pose has authored skeleton angles (otherwise the inset
   *  displays a "no rig data yet" placeholder). */
  hasAngles: boolean;
  /** Display name for the pose (shown in the inset header). */
  poseName?: string;
}

/**
 * A small, draggable-but-fixed-position skeleton-in-pose inset for the
 * /body view. Renders when a pose is active. Click the corner button to
 * expand to a larger size; click again to collapse. Always positioned
 * in the bottom-right of the parent (which must be position: relative).
 *
 * The inset's canvas has its own OrbitControls (drag to rotate), but
 * we don't wire up keyboard arrow keys for the inset — those stay on
 * the main body canvas so the keyboard never feels ambiguous.
 */
export default function SkeletonPoseInset({ poseId, hasAngles, poseName }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!poseId) return null;

  // Sizes: small (default) vs. expanded.
  const sizeClasses = expanded
    ? 'w-[420px] h-[520px]'
    : 'w-[220px] h-[280px]';

  return (
    <div
      className={`absolute bottom-3 right-3 z-20 ${sizeClasses} rounded-lg overflow-hidden border border-ink-700 bg-ink-900/90 backdrop-blur shadow-2xl transition-all duration-200`}
    >
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-2 px-2.5 py-1.5 bg-ink-900/70 border-b border-ink-700 pointer-events-none">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.18em] text-ink-400 leading-none">
            Skeleton in pose
          </p>
          {poseName && (
            <p className="text-[11px] text-ink-100 truncate leading-tight mt-0.5">
              {poseName}
            </p>
          )}
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[10px] text-ink-300 hover:text-ink-50 px-1.5 py-0.5 rounded border border-ink-700 hover:border-ink-500 bg-ink-900/80 pointer-events-auto"
          title={expanded ? 'Shrink' : 'Expand'}
          aria-label={expanded ? 'Shrink skeleton inset' : 'Expand skeleton inset'}
        >
          {expanded ? '⇲' : '⇱'}
        </button>
      </div>

      <div className="absolute inset-0 pt-9">
        {hasAngles ? (
          <PosedSkeletonCanvas poseId={poseId} arrowKeys={false} />
        ) : (
          <div className="h-full flex items-center justify-center text-ink-300 text-[11px] italic px-4 text-center leading-snug">
            No skeleton rig data
            <br />
            authored for this pose
            <br />
            <span className="text-ink-500 text-[10px] mt-2 block">
              (muscle data is still live)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
