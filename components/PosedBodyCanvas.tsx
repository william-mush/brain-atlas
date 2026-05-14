'use client';

import { useState } from 'react';
import BodyCanvas from './BodyCanvas';
import { BODY_PARTS } from '@/lib/body';
import { getPose } from '@/lib/poses';

// Build the all-parts visibility set once.
const ALL_VISIBLE = new Set(BODY_PARTS.map((p) => p.id));

interface Props {
  poseId: string;
}

/**
 * Read-only body canvas for the /poses/[id] view. Shows the body in
 * standing position (the model has no rig — see notes in lib/body.ts)
 * with muscle coloring driven by the named pose. No interactivity beyond
 * the canvas's built-in orbit controls.
 */
export default function PosedBodyCanvas({ poseId }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activePose = getPose(poseId) ?? null;

  return (
    <BodyCanvas
      selectedId={selectedId}
      hoveredId={hoveredId}
      visibleIds={ALL_VISIBLE}
      activePose={activePose}
      onSelect={setSelectedId}
      onHover={setHoveredId}
    />
  );
}
