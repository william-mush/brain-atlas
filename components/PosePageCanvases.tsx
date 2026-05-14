'use client';

import dynamic from 'next/dynamic';

const PosedSkeletonCanvas = dynamic(
  () => import('@/components/PosedSkeletonCanvas'),
  { ssr: false },
);

const PosedBodyCanvas = dynamic(
  () => import('@/components/PosedBodyCanvas'),
  { ssr: false },
);

interface Props {
  poseId: string;
  hasAngles: boolean;
}

/**
 * Client-side wrapper for the two canvas components on /poses/[id].
 * Lives in its own file so the page can stay a server component
 * (dynamic ssr:false can only be used inside a client component).
 */
export default function PosePageCanvases({ poseId, hasAngles }: Props) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
      <div className="relative border-r border-ink-700 min-h-0">
        <div className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.18em] text-ink-300 bg-ink-900/80 px-2.5 py-1 rounded-full border border-ink-700 backdrop-blur">
          Skeleton in pose
        </div>
        {hasAngles ? (
          <PosedSkeletonCanvas poseId={poseId} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-300 text-sm italic px-6 text-center">
            No skeleton angles authored for this pose yet.
            <br />
            <span className="text-ink-400 text-xs mt-2">
              The muscle data is complete; the rig data isn&apos;t.
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag or ← → to rotate · ↑ ↓ to zoom
        </div>
      </div>

      <div className="relative min-h-0">
        <div className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.18em] text-ink-300 bg-ink-900/80 px-2.5 py-1 rounded-full border border-ink-700 backdrop-blur">
          Muscles, in this pose
        </div>
        <PosedBodyCanvas poseId={poseId} />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag or ← → to rotate · ↑ ↓ to zoom
        </div>
      </div>
    </div>
  );
}
