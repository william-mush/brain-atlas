'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { POSE_ANGLES } from '@/lib/pose-angles';
import { useArrowKeyControls } from '@/lib/use-arrow-key-controls';

const MODEL_URL = '/models/skeleton.glb';

// Joint definitions — kept in sync with SkeletonExplorer. Each entry maps a
// slider key (`${boneId}__${axis}`) to either a single bone or a distributed
// set of bones with weights. Distributed sliders are used for spinal
// regions (lumbar/thoracic/cervical).

interface JointTarget {
  boneId: string;
  axis: 'x' | 'y' | 'z';
  distribute?: { boneId: string; weight: number }[];
}

const JOINT_TARGETS: Record<string, JointTarget> = {
  // Limbs — same set SkeletonExplorer uses
  'UpperArm_r__x': { boneId: 'UpperArm_r', axis: 'x' },
  'UpperArm_l__x': { boneId: 'UpperArm_l', axis: 'x' },
  'UpperArm_r__y': { boneId: 'UpperArm_r', axis: 'y' },
  'UpperArm_l__y': { boneId: 'UpperArm_l', axis: 'y' },
  'UpperArm_r__z': { boneId: 'UpperArm_r', axis: 'z' },
  'UpperArm_l__z': { boneId: 'UpperArm_l', axis: 'z' },
  'Forearm_r__x': { boneId: 'Forearm_r', axis: 'x' },
  'Forearm_l__x': { boneId: 'Forearm_l', axis: 'x' },
  'Hand_r__x': { boneId: 'Hand_r', axis: 'x' },
  'Hand_l__x': { boneId: 'Hand_l', axis: 'x' },
  'Thigh_r__x': { boneId: 'Thigh_r', axis: 'x' },
  'Thigh_l__x': { boneId: 'Thigh_l', axis: 'x' },
  'Thigh_r__z': { boneId: 'Thigh_r', axis: 'z' },
  'Thigh_l__z': { boneId: 'Thigh_l', axis: 'z' },
  'Shin_r__x': { boneId: 'Shin_r', axis: 'x' },
  'Shin_l__x': { boneId: 'Shin_l', axis: 'x' },
  'region:lumbar__x': {
    boneId: 'region:lumbar',
    axis: 'x',
    distribute: [
      { boneId: 'Spine_L1', weight: 0.15 },
      { boneId: 'Spine_L2', weight: 0.18 },
      { boneId: 'Spine_L3', weight: 0.2 },
      { boneId: 'Spine_L4', weight: 0.23 },
      { boneId: 'Spine_L5', weight: 0.24 },
    ],
  },
  'region:thoracic__x': {
    boneId: 'region:thoracic',
    axis: 'x',
    distribute: [
      { boneId: 'Spine_T1', weight: 0.04 },
      { boneId: 'Spine_T2', weight: 0.05 },
      { boneId: 'Spine_T3', weight: 0.05 },
      { boneId: 'Spine_T4', weight: 0.06 },
      { boneId: 'Spine_T5', weight: 0.07 },
      { boneId: 'Spine_T6', weight: 0.08 },
      { boneId: 'Spine_T7', weight: 0.09 },
      { boneId: 'Spine_T8', weight: 0.1 },
      { boneId: 'Spine_T9', weight: 0.1 },
      { boneId: 'Spine_T10', weight: 0.11 },
      { boneId: 'Spine_T11', weight: 0.12 },
      { boneId: 'Spine_T12', weight: 0.13 },
    ],
  },
  'region:cervical__x': {
    boneId: 'region:cervical',
    axis: 'x',
    distribute: [
      { boneId: 'Neck_C1_Atlas', weight: 0.18 },
      { boneId: 'Neck_C2_Axis', weight: 0.16 },
      { boneId: 'Neck_C3', weight: 0.14 },
      { boneId: 'Neck_C4', weight: 0.14 },
      { boneId: 'Neck_C5', weight: 0.14 },
      { boneId: 'Neck_C6', weight: 0.12 },
      { boneId: 'Neck_C7', weight: 0.12 },
    ],
  },
};

interface SceneProps {
  poseId: string;
  /** When false, the scene won't register window-level arrow-key handlers.
   *  Use for inset versions that share a page with another canvas that
   *  owns the keyboard. Defaults to true. */
  arrowKeys?: boolean;
}

function Scene({ poseId, arrowKeys = true }: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();

  useArrowKeyControls(groupRef, camera, controls, { enabled: arrowKeys });

  // Capture rest rotations once
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

  useFrame(() => {
    const pose = POSE_ANGLES.find((p) => p.id === poseId);
    if (!pose) return;

    // Aggregate per-bone deltas across all joint targets.
    const deltas: Map<string, { x: number; y: number; z: number }> = new Map();
    const accumulate = (boneName: string, axis: 'x' | 'y' | 'z', rad: number) => {
      let d = deltas.get(boneName);
      if (!d) {
        d = { x: 0, y: 0, z: 0 };
        deltas.set(boneName, d);
      }
      d[axis] += rad;
    };

    for (const [key, degrees] of Object.entries(pose.angles)) {
      const target = JOINT_TARGETS[key];
      if (!target) continue;
      const rad = (degrees * Math.PI) / 180;
      if (target.distribute) {
        for (const d of target.distribute) {
          accumulate(d.boneId, target.axis, rad * d.weight);
        }
      } else {
        accumulate(target.boneId, target.axis, rad);
      }
    }

    // Apply rest + delta to every named bone in the scene.
    gltf.scene.traverse((o) => {
      if ((o as THREE.Object3D).type !== 'Bone') return;
      const b = o as THREE.Bone;
      const rest = restRotations.current.get(b.name);
      if (!rest) return;
      const d = deltas.get(b.name);
      if (d) {
        b.rotation.set(rest.x + d.x, rest.y + d.y, rest.z + d.z);
      } else {
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

interface Props {
  poseId: string;
  /** When false, this canvas won't listen for arrow keys. Use for inset
   *  versions sharing a page with another canvas that owns the keyboard. */
  arrowKeys?: boolean;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 0.9, 3.5];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.9, 0];

export default function PosedSkeletonCanvas({ poseId, arrowKeys = true }: Props) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POS, fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <color attach="background" args={[0.055, 0.047, 0.031]} />
        <fog attach="fog" args={['#0e0c08', 6, 14]} />

        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#fbe6c4', '#16131c', 0.6]} />
        <directionalLight position={[5, 7, 5]} intensity={1.2} color="#fff6e0" />
        <directionalLight position={[-6, 3, -4]} intensity={0.55} color="#9ec7e6" />

        <Suspense fallback={null}>
          <Scene poseId={poseId} arrowKeys={arrowKeys} />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.09}
          rotateSpeed={0.85}
          zoomSpeed={0.6}
          panSpeed={0.9}
          minDistance={1.0}
          maxDistance={12}
          target={DEFAULT_CAMERA_TARGET}
          enablePan
          screenSpacePanning
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
