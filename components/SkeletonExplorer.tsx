'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { POSE_ANGLES } from '@/lib/pose-angles';
import { useArrowKeyControls } from '@/lib/use-arrow-key-controls';

const MODEL_URL = '/models/skeleton.glb';

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 1.0, 4.0];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 1.0, 0];

interface Joint {
  id: string;
  label: string;
  axis: 'x' | 'y' | 'z';
  min: number;
  max: number;
  /**
   * If set, the slider's value is *distributed* across these bones rather
   * than applied to one. Use for regional spine sliders. Each entry is a
   * weight; the slider value is divided by total-weight, then each bone
   * gets weight × per-unit angle. Weights typically reflect anatomical
   * mobility — e.g. lower lumbar contributes more than upper to flexion.
   */
  distribute?: { boneId: string; weight: number }[];
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
      // SHOULDERS — three axes per side (glenohumeral is a ball-and-socket joint).
      // FLEXION range goes past 180° so the arm can reach overhead AND behind
      // the head — needed for full Wheel (Urdhva Dhanurasana) when the hands
      // land on the floor.
      { id: 'UpperArm_r', label: 'Right shoulder — flex / extend', axis: 'x', min: -60, max: 220 },
      { id: 'UpperArm_l', label: 'Left shoulder — flex / extend',  axis: 'x', min: -60, max: 220 },
      { id: 'UpperArm_r', label: 'Right shoulder — abduct',         axis: 'z', min: -180, max: 30 },
      { id: 'UpperArm_l', label: 'Left shoulder — abduct',          axis: 'z', min: -30, max: 180 },
      { id: 'UpperArm_r', label: 'Right shoulder — rotate',         axis: 'y', min: -90, max: 90 },
      { id: 'UpperArm_l', label: 'Left shoulder — rotate',          axis: 'y', min: -90, max: 90 },

      // ELBOW — flexion only (the elbow is a hinge, no abduction).
      { id: 'Forearm_r', label: 'Right elbow', axis: 'x', min: -150, max: 0 },
      { id: 'Forearm_l', label: 'Left elbow',  axis: 'x', min: -150, max: 0 },

      // WRIST / HAND — for floor placement in full Wheel the wrists extend
      // dramatically. Real wrist extension is ~70-80°.
      { id: 'Hand_r', label: 'Right wrist — flex / extend', axis: 'x', min: -80, max: 80 },
      { id: 'Hand_l', label: 'Left wrist — flex / extend',  axis: 'x', min: -80, max: 80 },

      // HIPS — primary flexion. Real-life flexion ~120°; extension ~30°.
      { id: 'Thigh_r', label: 'Right hip — flex / extend', axis: 'x', min: -30, max: 120 },
      { id: 'Thigh_l', label: 'Left hip — flex / extend',  axis: 'x', min: -30, max: 120 },
      // Hip abduction (Y in our frame) for wide stances
      { id: 'Thigh_r', label: 'Right hip — abduct', axis: 'z', min: -45, max: 45 },
      { id: 'Thigh_l', label: 'Left hip — abduct',  axis: 'z', min: -45, max: 45 },

      // KNEES — hinges. Real flexion 130-150°.
      { id: 'Shin_r', label: 'Right knee', axis: 'x', min: -150, max: 0 },
      { id: 'Shin_l', label: 'Left knee',  axis: 'x', min: -150, max: 0 },
    ],
  },
  {
    id: 'spine-regions',
    label: 'Spine — by region',
    defaultOpen: true,
    joints: [
      // LUMBAR — distributed across L1–L5.
      // In Z-Anatomy's bone-frame, NEGATIVE X = backbend (extension);
      // POSITIVE X = forward fold (flexion).
      // Anatomically: lumbar flexion ~50–60°; lumbar extension ~30–45°.
      // Lower-lumbar contributes more than upper.
      {
        id: 'region:lumbar',
        label: 'Lumbar (L1–L5)  — −back  /  fold +',
        axis: 'x',
        min: -45,
        max: 60,
        distribute: [
          { boneId: 'Spine_L1', weight: 0.15 },
          { boneId: 'Spine_L2', weight: 0.18 },
          { boneId: 'Spine_L3', weight: 0.20 },
          { boneId: 'Spine_L4', weight: 0.23 },
          { boneId: 'Spine_L5', weight: 0.24 },
        ],
      },
      // THORACIC — extension ~25–30°; flexion ~30–35°.
      {
        id: 'region:thoracic',
        label: 'Thoracic (T1–T12)  — −back  /  fold +',
        axis: 'x',
        min: -30,
        max: 35,
        distribute: [
          { boneId: 'Spine_T1', weight: 0.04 },
          { boneId: 'Spine_T2', weight: 0.05 },
          { boneId: 'Spine_T3', weight: 0.05 },
          { boneId: 'Spine_T4', weight: 0.06 },
          { boneId: 'Spine_T5', weight: 0.07 },
          { boneId: 'Spine_T6', weight: 0.08 },
          { boneId: 'Spine_T7', weight: 0.09 },
          { boneId: 'Spine_T8', weight: 0.10 },
          { boneId: 'Spine_T9', weight: 0.10 },
          { boneId: 'Spine_T10', weight: 0.11 },
          { boneId: 'Spine_T11', weight: 0.12 },
          { boneId: 'Spine_T12', weight: 0.13 },
        ],
      },
      // CERVICAL — flexion ~60°, extension ~70°.
      {
        id: 'region:cervical',
        label: 'Cervical (C3–C7)  — −back  /  fold +',
        axis: 'x',
        min: -70,
        max: 60,
        distribute: [
          { boneId: 'Neck_C3', weight: 0.20 },
          { boneId: 'Neck_C4', weight: 0.22 },
          { boneId: 'Neck_C5', weight: 0.22 },
          { boneId: 'Neck_C6', weight: 0.20 },
          { boneId: 'Neck_C7', weight: 0.16 },
        ],
      },
      // ============================================================
      // SPINAL LATERAL FLEXION (side-bend, Z-axis in bone-frame)
      // Critical for Trikonasana, Parsvakonasana, side bends, half-moon.
      // Anatomical ranges:
      //   Lumbar: ~20° each side
      //   Thoracic: ~25° each side (more mobile than flexion/extension)
      //   Cervical: ~45° each side
      // Sign: positive = side-bend to the right (right ear toward right shoulder).
      // ============================================================
      {
        id: 'region:lumbar-side',
        label: 'Lumbar side-bend  — −left  /  right +',
        axis: 'z',
        min: -25,
        max: 25,
        distribute: [
          { boneId: 'Spine_L1', weight: 0.18 },
          { boneId: 'Spine_L2', weight: 0.20 },
          { boneId: 'Spine_L3', weight: 0.22 },
          { boneId: 'Spine_L4', weight: 0.20 },
          { boneId: 'Spine_L5', weight: 0.20 },
        ],
      },
      {
        id: 'region:thoracic-side',
        label: 'Thoracic side-bend  — −left  /  right +',
        axis: 'z',
        min: -30,
        max: 30,
        distribute: [
          { boneId: 'Spine_T1', weight: 0.05 },
          { boneId: 'Spine_T2', weight: 0.06 },
          { boneId: 'Spine_T3', weight: 0.07 },
          { boneId: 'Spine_T4', weight: 0.07 },
          { boneId: 'Spine_T5', weight: 0.08 },
          { boneId: 'Spine_T6', weight: 0.09 },
          { boneId: 'Spine_T7', weight: 0.09 },
          { boneId: 'Spine_T8', weight: 0.10 },
          { boneId: 'Spine_T9', weight: 0.10 },
          { boneId: 'Spine_T10', weight: 0.10 },
          { boneId: 'Spine_T11', weight: 0.10 },
          { boneId: 'Spine_T12', weight: 0.09 },
        ],
      },
      {
        id: 'region:cervical-side',
        label: 'Cervical side-bend  — −left  /  right +',
        axis: 'z',
        min: -45,
        max: 45,
        distribute: [
          { boneId: 'Neck_C3', weight: 0.20 },
          { boneId: 'Neck_C4', weight: 0.22 },
          { boneId: 'Neck_C5', weight: 0.22 },
          { boneId: 'Neck_C6', weight: 0.20 },
          { boneId: 'Neck_C7', weight: 0.16 },
        ],
      },
      // ============================================================
      // SPINAL ROTATION (twist, Y-axis in bone-frame)
      // Critical for Marichyasana, Parivrtta Trikonasana, twists generally.
      // Anatomical ranges:
      //   Lumbar: ~5–13° each side (limited — spine isn't built to twist
      //     at the lumbar; most "lumbar twist" sensation is actually
      //     thoracic. Range is small.)
      //   Thoracic: ~35° each side (where most of the twist happens)
      //   Cervical: ~70° each side
      // Sign: positive = rotation to the right.
      // ============================================================
      {
        id: 'region:lumbar-twist',
        label: 'Lumbar twist  — −left  /  right +',
        axis: 'y',
        min: -12,
        max: 12,
        distribute: [
          { boneId: 'Spine_L1', weight: 0.22 },
          { boneId: 'Spine_L2', weight: 0.22 },
          { boneId: 'Spine_L3', weight: 0.20 },
          { boneId: 'Spine_L4', weight: 0.18 },
          { boneId: 'Spine_L5', weight: 0.18 },
        ],
      },
      {
        id: 'region:thoracic-twist',
        label: 'Thoracic twist  — −left  /  right +',
        axis: 'y',
        min: -40,
        max: 40,
        distribute: [
          { boneId: 'Spine_T1', weight: 0.10 },
          { boneId: 'Spine_T2', weight: 0.10 },
          { boneId: 'Spine_T3', weight: 0.10 },
          { boneId: 'Spine_T4', weight: 0.09 },
          { boneId: 'Spine_T5', weight: 0.09 },
          { boneId: 'Spine_T6', weight: 0.08 },
          { boneId: 'Spine_T7', weight: 0.08 },
          { boneId: 'Spine_T8', weight: 0.07 },
          { boneId: 'Spine_T9', weight: 0.07 },
          { boneId: 'Spine_T10', weight: 0.06 },
          { boneId: 'Spine_T11', weight: 0.05 },
          { boneId: 'Spine_T12', weight: 0.05 },
        ],
      },
      {
        id: 'region:cervical-twist',
        label: 'Cervical twist  — −left  /  right +',
        axis: 'y',
        min: -70,
        max: 70,
        distribute: [
          { boneId: 'Neck_C3', weight: 0.18 },
          { boneId: 'Neck_C4', weight: 0.20 },
          { boneId: 'Neck_C5', weight: 0.22 },
          { boneId: 'Neck_C6', weight: 0.20 },
          { boneId: 'Neck_C7', weight: 0.20 },
        ],
      },
      // ============================================================
      // HIP HINGE (compound: pelvis + counter-rotated thighs)
      // The rig's root is the pelvis, with the legs hanging from it.
      // A real hip hinge tilts the pelvis forward at the hip joints
      // while the legs stay vertical in world space.
      //
      // We model this by tipping the Pelvis forward AND counter-
      // rotating both thighs by the same amount in the opposite
      // direction. Net visual: torso folds forward at the hips; legs
      // stay vertical. This is what Uttanasana, Padangusthasana,
      // Parsvottanasana actually look like.
      //
      // Sign: positive = forward fold at the hips.
      // ============================================================
      {
        id: 'region:hip-hinge',
        label: 'Hip hinge  — fold forward +',
        axis: 'x',
        min: -30,
        max: 110,
        distribute: [
          { boneId: 'Pelvis', weight: 1.0 },
          { boneId: 'Thigh_l', weight: -1.0 },
          { boneId: 'Thigh_r', weight: -1.0 },
        ],
      },
      // Atlas — head nod (atlanto-occipital). Total range ~15-20° nod.
      { id: 'Neck_C1_Atlas', label: 'Head nod (atlanto-occipital)', axis: 'x', min: -25, max: 25 },
      // Axis — head rotation (atlanto-axial). Real range ~45° each side.
      { id: 'Neck_C2_Axis', label: 'Head turn (atlanto-axial)', axis: 'y', min: -45, max: 45 },
      // Sacrum nutation/counter-nutation — small but real
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

// All joints with their distribute info, flat — used by the frame loop.
const ALL_JOINTS: Joint[] = (() => {
  const seen = new Set<string>();
  const out: Joint[] = [];
  for (const g of GROUPS) {
    for (const j of g.joints) {
      const k = `${j.id}__${j.axis}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(j);
    }
  }
  return out;
})();

interface SceneProps {
  jointRotations: Record<string, number>; // key = `${boneId}__${axis}`, value = degrees
}

function Scene({ jointRotations }: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();

  // Arrow-key controls: Left/Right rotate, Up/Down zoom.
  useArrowKeyControls(groupRef, camera, controls);

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

  // Build per-bone aggregate deltas from all controllable joints, then apply.
  useFrame(() => {
    // delta[boneName][axis] = total radians to add to rest
    const deltas: Map<string, { x: number; y: number; z: number }> = new Map();

    const accumulate = (boneName: string, axis: 'x' | 'y' | 'z', rad: number) => {
      let d = deltas.get(boneName);
      if (!d) {
        d = { x: 0, y: 0, z: 0 };
        deltas.set(boneName, d);
      }
      d[axis] += rad;
    };

    for (const j of ALL_JOINTS) {
      const key = `${j.id}__${j.axis}`;
      const v = jointRotations[key];
      if (!v) continue;
      const rad = (v * Math.PI) / 180;

      if (j.distribute && j.distribute.length > 0) {
        const totalWeight = j.distribute.reduce((s, e) => s + e.weight, 0) || 1;
        for (const entry of j.distribute) {
          accumulate(entry.boneId, j.axis, rad * (entry.weight / totalWeight));
        }
      } else {
        // Single-bone joint: id is the actual bone name
        accumulate(j.id, j.axis, rad);
      }
    }

    // Apply: rest + delta per bone
    gltf.scene.traverse((o) => {
      if ((o as THREE.Object3D).type !== 'Bone') return;
      const b = o as THREE.Bone;
      const rest = restRotations.current.get(b.name);
      if (!rest) return;
      const d = deltas.get(b.name);
      if (d) {
        b.rotation.set(rest.x + d.x, rest.y + d.y, rest.z + d.z);
      } else {
        // No user input on this bone — keep rest
        b.rotation.copy(rest);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function SkeletonExplorer() {
  // State key: `${boneId}__${axis}`. Value: degrees.
  const [jointRotations, setJointRotations] = useState<Record<string, number>>(
    Object.fromEntries(ALL_JOINT_KEYS.map((k) => [k, 0])),
  );
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(GROUPS.filter((g) => g.defaultOpen).map((g) => g.id)),
  );

  const [activePoseId, setActivePoseId] = useState<string | null>(null);

  const resetAll = () => {
    setJointRotations(Object.fromEntries(ALL_JOINT_KEYS.map((k) => [k, 0])));
    setActivePoseId(null);
  };

  const applyPose = (poseId: string) => {
    const pose = POSE_ANGLES.find((p) => p.id === poseId);
    if (!pose) return;
    // Reset everything to zero, then apply the pose's angles
    const next: Record<string, number> = Object.fromEntries(ALL_JOINT_KEYS.map((k) => [k, 0]));
    for (const [key, deg] of Object.entries(pose.angles)) {
      next[key] = deg;
    }
    setJointRotations(next);
    setActivePoseId(poseId);
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
        <div className="p-4 border-b border-ink-700 flex-shrink-0 space-y-3">
          <div>
            <h2 className="font-serif text-lg text-ink-50 leading-tight">Skeleton — Rig POC</h2>
            <p className="text-[11px] text-ink-300 mt-0.5">
              Pick a pose, or drag sliders below.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300">Pose presets</p>
              <button
                onClick={resetAll}
                className="text-[10px] text-ink-400 hover:text-ink-100"
              >
                reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {POSE_ANGLES.map((p) => {
                const active = p.id === activePoseId;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPose(p.id)}
                    title={p.sanskrit}
                    className={`text-[11px] px-2 py-1.5 rounded border transition text-left leading-tight ${
                      active
                        ? 'bg-ink-700 text-ink-50 border-ink-600'
                        : 'text-ink-200 border-ink-700 hover:bg-ink-800 hover:border-ink-500'
                    }`}
                  >
                    {p.english}
                  </button>
                );
              })}
            </div>
          </div>
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
          Drag or ← → to rotate · ↑ ↓ to zoom · right-drag to pan
        </div>
      </main>
    </div>
  );
}
