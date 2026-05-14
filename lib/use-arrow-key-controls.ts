'use client';

import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Wire arrow-key controls into a Three.js scene.
 *
 *   Left / Right  → rotate the group around the Y axis
 *   Up    / Down  → dolly the camera in/out (zoom)
 *
 * Skips when the user is in a text input or contenteditable element
 * (so the keys still work for typing). Skips when modifier keys are
 * held (so it doesn't intercept browser shortcuts like Cmd-Right).
 */
export function useArrowKeyControls(
  groupRef: React.RefObject<THREE.Group | null>,
  camera: THREE.Camera,
  controls: unknown,
  options?: {
    /** Disable to opt out of arrow-key handling (useful for inset canvases
     *  that share a page with another canvas that owns the keyboard). */
    enabled?: boolean;
    rotateStep?: number; // radians per keypress
    zoomStep?: number; // fraction of distance per keypress
    minDistance?: number;
    maxDistance?: number;
  },
) {
  const enabled = options?.enabled ?? true;
  const rotateStep = options?.rotateStep ?? Math.PI / 12; // 15° per press
  const zoomStep = options?.zoomStep ?? 0.1;
  const minDistance = options?.minDistance ?? 1.0;
  const maxDistance = options?.maxDistance ?? 20.0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Don't steal keys from inputs / contenteditable.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (target.isContentEditable) return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

      const key = e.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowDown') return;

      e.preventDefault();

      // Get the OrbitControls instance with the target+update interface we need.
      const oc = controls as { target?: THREE.Vector3; update?: () => void } | null;

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const dir = key === 'ArrowLeft' ? -1 : 1;
        if (groupRef.current) {
          groupRef.current.rotation.y += dir * rotateStep;
        }
      } else {
        // Zoom in (Up) or out (Down). Move camera along the line from
        // its current position toward the controls target.
        const target = oc?.target ?? new THREE.Vector3(0, 0, 0);
        const offset = new THREE.Vector3().subVectors(camera.position, target);
        let distance = offset.length();
        const factor = key === 'ArrowUp' ? 1 - zoomStep : 1 + zoomStep;
        distance = Math.max(minDistance, Math.min(maxDistance, distance * factor));
        offset.setLength(distance);
        camera.position.copy(target).add(offset);
        oc?.update?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, groupRef, camera, controls, rotateStep, zoomStep, minDistance, maxDistance]);
}
