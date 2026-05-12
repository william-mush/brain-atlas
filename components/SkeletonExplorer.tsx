'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/skeleton.glb';

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 1.0, 4.0];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 1.0, 0];

interface Joint {
  id: string;
  label: string;
  axis: 'x' | 'y' | 'z';
  min: number;
  max: number;
}

// Joints organized into anatomical groups. Each group is a collapsible
// section in the side panel.
interface JointGroup {
  id: string;
  label: string;
  defaultOpen: boolean;
  joints: Joint[];
}

const GROUPS: JointGroup[] = [
  {
    id: 'limbs',
    label: 'Limbs',
    defaultOpen: true,
    joints: [
      { id: 'UpperArm_r', label: 'Right shoulder', axis: 'x', min: -90, max: 180 },
      { id: 'UpperArm_l', label: 'Left shoulder', axis: 'x', min: -90, max: 180 },
      { id: 'Forearm_r', label: 'Right elbow', axis: 'x', min: -150, max: 0 },
      { id: 'Forearm_l', label: 'Left elbow', axis: 'x', min: -150, max: 0 },
      { id: 'Thigh_r', label: 'Right hip flex', axis: 'x', min: -30, max: 120 },
      { id: 'Thigh_l', label: 'Left hip flex', axis: 'x', min: -30, max: 120 },
      { id: 'Shin_r', label: 'Right knee', axis: 'x', min: -120, max: 0 },
      { id: 'Shin_l', label: 'Left knee', axis: 'x', min: -120, max: 0 },
    ],
  },
  {
    id: 'spine-regions',
    label: 'Spine — by region',
    defaultOpen: true,
    joints: [
      // Single-bone shortcuts per region — drives the whole region as a chunk.
      // Lumbar — L3 is the middle, so rotating it tips the upper body.
      { id: 'Spine_L3', label: 'Lumbar flex', axis: 'x', min: -45, max: 30 },
      // Thoracic — T7 mid-back
      { id: 'Spine_T7', label: 'Thoracic flex', axis: 'x', min: -30, max: 30 },
      // Cervical — C5 mid-neck
      { id: 'Neck_C5', label: 'Cervical flex', axis: 'x', min: -45, max: 45 },
      // Atlas (C1) — head nod
      { id: 'Neck_C1_Atlas', label: 'Head nod (atlanto-occipital)', axis: 'x', min: -25, max: 25 },
      // Axis (C2) — head rotation
      { id: 'Neck_C2_Axis', label: 'Head turn (atlanto-axial)', axis: 'y', min: -45, max: 45 },
      // Sacrum nutation/counter-nutation
      { id: 'Sacrum', label: 'Sacrum nutation', axis: 'x', min: -15, max: 15 },
      // Coccyx
      { id: 'Coccyx', label: 'Coccyx', axis: 'x', min: -10, max: 10 },
    ],
  },
  {
    id: 'spine-detailed',
    label: 'Spine — every vertebra',
    defaultOpen: false,
    joints: [
      // Cervical
      { id: 'Neck_C1_Atlas', label: 'C1 (atlas)', axis: 'x', min: -25, max: 25 },
      { id: 'Neck_C2_Axis', label: 'C2 (axis)', axis: 'y', min: -45, max: 45 },
      { id: 'Neck_C3', label: 'C3', axis: 'x', min: -15, max: 15 },
      { id: 'Neck_C4', label: 'C4', axis: 'x', min: -15, max: 15 },
      { id: 'Neck_C5', label: 'C5', axis: 'x', min: -15, max: 15 },
      { id: 'Neck_C6', label: 'C6', axis: 'x', min: -15, max: 15 },
      { id: 'Neck_C7', label: 'C7', axis: 'x', min: -15, max: 15 },
      // Thoracic
      { id: 'Spine_T1', label: 'T1', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T2', label: 'T2', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T3', label: 'T3', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T4', label: 'T4', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T5', label: 'T5', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T6', label: 'T6', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T7', label: 'T7', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T8', label: 'T8', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T9', label: 'T9', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T10', label: 'T10', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T11', label: 'T11', axis: 'x', min: -10, max: 10 },
      { id: 'Spine_T12', label: 'T12', axis: 'x', min: -10, max: 10 },
      // Lumbar
      { id: 'Spine_L1', label: 'L1', axis: 'x', min: -15, max: 15 },
      { id: 'Spine_L2', label: 'L2', axis: 'x', min: -15, max: 15 },
      { id: 'Spine_L3', label: 'L3', axis: 'x', min: -15, max: 15 },
      { id: 'Spine_L4', label: 'L4', axis: 'x', min: -15, max: 15 },
      { id: 'Spine_L5', label: 'L5', axis: 'x', min: -15, max: 15 },
      // Pelvic floor
      { id: 'Sacrum', label: 'Sacrum', axis: 'x', min: -15, max: 15 },
      { id: 'Coccyx', label: 'Coccyx', axis: 'x', min: -10, max: 10 },
    ],
  },
  {
    id: 'head',
    label: 'Head',
    defaultOpen: false,
    joints: [
      { id: 'Head', label: 'Head tilt forward/back', axis: 'x', min: -45, max: 45 },
      { id: 'Head', label: 'Head turn (yaw)', axis: 'y', min: -60, max: 60 },
      { id: 'Head', label: 'Head side-bend', axis: 'z', min: -30, max: 30 },
    ],
  },
];

// All controllable joints flattened (for the React state)
const ALL_JOINT_KEYS = (() => {
  const set = new Set<string>();
  for (const g of GROUPS) for (const j of g.joints) set.add(`${j.id}__${j.axis}`);
  return Array.from(set);
})();

interface SceneProps {
  jointRotations: Record<string, number>; // key = `${boneId}__${axis}`, value = degrees
}

function Scene({ jointRotations }: SceneProps) {
  const gltf = useGLTF(MODEL_URL);

  // Capture each bone's rest local rotation once at load
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

  // Apply rotations every frame
  useFrame(() => {
    gltf.scene.traverse((o) => {
      if ((o as THREE.Object3D).type !== 'Bone') return;
      const b = o as THREE.Bone;
      const rest = restRotations.current.get(b.name);
      if (!rest) return;

      // Sum up user rotations on this bone across axes
      const xKey = `${b.name}__x`;
      const yKey = `${b.name}__y`;
      const zKey = `${b.name}__z`;
      const dx = (jointRotations[xKey] ?? 0) * (Math.PI / 180);
      const dy = (jointRotations[yKey] ?? 0) * (Math.PI / 180);
      const dz = (jointRotations[zKey] ?? 0) * (Math.PI / 180);

      b.rotation.set(rest.x + dx, rest.y + dy, rest.z + dz);
    });
  });

  return <primitive object={gltf.scene} />;
}

export default function SkeletonExplorer() {
  // State key: `${boneId}__${axis}`. Value: degrees.
  const [jointRotations, setJointRotations] = useState<Record<string, number>>(
    Object.fromEntries(ALL_JOINT_KEYS.map((k) => [k, 0])),
  );
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(GROUPS.filter((g) => g.defaultOpen).map((g) => g.id)),
  );

  const resetAll = () => {
    setJointRotations(Object.fromEntries(ALL_JOINT_KEYS.map((k) => [k, 0])));
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-[calc(100vh-64px)] bg-ink-900">
      <aside className="hidden lg:flex flex-col border-r border-ink-700 bg-ink-800/60 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-ink-700 flex-shrink-0">
          <h2 className="font-serif text-lg text-ink-50 leading-tight">Skeleton — Rig POC</h2>
          <p className="text-[11px] text-ink-300 mt-0.5">
            Drag any slider. The skeleton bends in real time.
          </p>
          <button onClick={resetAll} className="mt-2 text-[10px] text-ink-400 hover:text-ink-100 underline">
            reset all
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {GROUPS.map((group) => {
            const open = openGroups.has(group.id);
            return (
              <div key={group.id} className="border-b border-ink-700/60 last:border-b-0">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-ink-800/50 transition"
                >
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-200">
                    <span className={`text-ink-400 transition-transform ${open ? 'rotate-90' : ''}`}>▸</span>
                    <span>{group.label}</span>
                    <span className="text-ink-500 font-mono normal-case tracking-normal">({group.joints.length})</span>
                  </span>
                </button>
                {open && (
                  <div className="px-4 pb-3 pt-1 space-y-3">
                    {group.joints.map((j, idx) => {
                      const key = `${j.id}__${j.axis}`;
                      const value = jointRotations[key] ?? 0;
                      return (
                        <div key={`${j.id}_${j.axis}_${idx}`}>
                          <div className="flex items-center justify-between gap-2 text-[11px] text-ink-200 mb-1">
                            <span>{j.label}</span>
                            <span className="text-ink-400 font-mono">{value}°</span>
                          </div>
                          <input
                            type="range"
                            min={j.min}
                            max={j.max}
                            step={1}
                            value={value}
                            onChange={(e) =>
                              setJointRotations((prev) => ({
                                ...prev,
                                [key]: parseInt(e.target.value, 10),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
