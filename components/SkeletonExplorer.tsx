'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/skeleton.glb';

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 1.0, 4.0];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 1.0, 0];

// Joints we expose as user-controllable sliders. Each one is a single bone
// name; rotating it rotates everything downstream in the chain.
const CONTROLLABLE_JOINTS: { id: string; label: string; axis: 'x' | 'y' | 'z'; min: number; max: number; defaultValue: number }[] = [
  { id: 'Forearm_r', label: 'Right elbow', axis: 'x', min: -150, max: 0, defaultValue: 0 },
  { id: 'Forearm_l', label: 'Left elbow', axis: 'x', min: -150, max: 0, defaultValue: 0 },
  { id: 'UpperArm_r', label: 'Right shoulder flex', axis: 'x', min: -90, max: 180, defaultValue: 0 },
  { id: 'UpperArm_l', label: 'Left shoulder flex', axis: 'x', min: -90, max: 180, defaultValue: 0 },
  { id: 'Thigh_r', label: 'Right hip flex', axis: 'x', min: -30, max: 120, defaultValue: 0 },
  { id: 'Thigh_l', label: 'Left hip flex', axis: 'x', min: -30, max: 120, defaultValue: 0 },
  { id: 'Shin_r', label: 'Right knee', axis: 'x', min: -120, max: 0, defaultValue: 0 },
  { id: 'Shin_l', label: 'Left knee', axis: 'x', min: -120, max: 0, defaultValue: 0 },
  { id: 'Spine_T7', label: 'Mid-back flex', axis: 'x', min: -45, max: 45, defaultValue: 0 },
  { id: 'Spine_L3', label: 'Lumbar flex', axis: 'x', min: -45, max: 45, defaultValue: 0 },
  { id: 'Head', label: 'Head tilt', axis: 'x', min: -45, max: 45, defaultValue: 0 },
];

interface Props {
  jointRotations: Record<string, number>; // degrees
}

function Scene({ jointRotations }: Props) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  // Capture the rest rotations once at load
  const restRotations = useRef<Map<string, THREE.Euler>>(new Map());
  useEffect(() => {
    gltf.scene.traverse((o) => {
      if ((o as THREE.Object3D).type === 'Bone') {
        const b = o as THREE.Bone;
        if (!restRotations.current.has(b.name)) {
          restRotations.current.set(b.name, b.rotation.clone());
        }
      }
    });
  }, [gltf.scene]);

  // Apply joint rotations every frame
  useFrame(() => {
    gltf.scene.traverse((o) => {
      const b = o as THREE.Bone;
      if ((o as THREE.Object3D).type === 'Bone') {
        const userAngle = jointRotations[b.name];
        if (userAngle !== undefined) {
          const rest = restRotations.current.get(b.name);
          if (rest) {
            // Apply user rotation on top of the rest local rotation
            const axisDef = CONTROLLABLE_JOINTS.find((j) => j.id === b.name);
            const axis = axisDef?.axis || 'x';
            const rad = (userAngle * Math.PI) / 180;
            b.rotation.set(rest.x, rest.y, rest.z);
            if (axis === 'x') b.rotation.x += rad;
            if (axis === 'y') b.rotation.y += rad;
            if (axis === 'z') b.rotation.z += rad;
          }
        }
      }
    });
  });

  return <primitive ref={groupRef} object={gltf.scene} />;
}

export default function SkeletonExplorer() {
  const [jointRotations, setJointRotations] = useState<Record<string, number>>(
    Object.fromEntries(CONTROLLABLE_JOINTS.map((j) => [j.id, j.defaultValue])),
  );

  const resetAll = () => {
    setJointRotations(
      Object.fromEntries(CONTROLLABLE_JOINTS.map((j) => [j.id, j.defaultValue])),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-[calc(100vh-64px)] bg-ink-900">
      <aside className="hidden lg:flex flex-col border-r border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-ink-700 flex-shrink-0">
          <h2 className="font-serif text-lg text-ink-50 leading-tight">Skeleton — Proof of Concept</h2>
          <p className="text-[11px] text-ink-300 mt-0.5">Drag a slider. The skeleton bends.</p>
          <button onClick={resetAll} className="mt-2 text-[10px] text-ink-400 hover:text-ink-100 underline">reset all</button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {CONTROLLABLE_JOINTS.map((j) => (
            <div key={j.id}>
              <div className="flex items-center justify-between gap-2 text-[11px] text-ink-200 mb-1">
                <span>{j.label}</span>
                <span className="text-ink-400 font-mono">{jointRotations[j.id]}°</span>
              </div>
              <input
                type="range"
                min={j.min}
                max={j.max}
                step={1}
                value={jointRotations[j.id]}
                onChange={(e) =>
                  setJointRotations((prev) => ({ ...prev, [j.id]: parseInt(e.target.value, 10) }))
                }
                className="w-full"
              />
            </div>
          ))}
        </div>
      </aside>

      <main className="relative min-h-0 h-full overflow-hidden">
        <Canvas
          camera={{ position: DEFAULT_CAMERA_POS, fov: 36 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <color attach="background" args={[0.055, 0.047, 0.031]} />
          <fog attach="fog" args={['#0e0c08', 5, 18]} />
          <ambientLight intensity={0.5} />
          <hemisphereLight args={['#fbe6c4', '#16131c', 0.55]} />
          <directionalLight position={[5, 6, 5]} intensity={1.0} />
          <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#9ec7e6" />

          <Suspense fallback={null}>
            <Scene jointRotations={jointRotations} />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.09}
            target={DEFAULT_CAMERA_TARGET}
            enablePan
            screenSpacePanning
            mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
            makeDefault
          />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-ink-300 bg-ink-900/70 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur pointer-events-none">
          Drag to rotate · right-drag to pan · scroll to zoom
        </div>
      </main>
    </div>
  );
}
