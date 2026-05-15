'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { POSE_ANGLES } from '@/lib/pose-angles';
import { JOINT_TARGETS } from '@/lib/joint-targets';
import { useArrowKeyControls } from '@/lib/use-arrow-key-controls';

const MODEL_URL = '/models/body_rigged.glb';

/**
 * Experimental canvas: load the auto-rigged anatomical body and drive it
 * with the same pose-angle data the skeleton uses. The body should
 * deform into the pose because every muscle/bone mesh is now skin-bound
 * to the armature.
 */

interface SceneProps {
  poseId: string;
}

function Scene({ poseId }: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const poseRootRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();

  useArrowKeyControls(groupRef, camera, controls);

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

    // Same aggregation logic as PosedSkeletonCanvas — accumulate
    // per-bone deltas from all joint targets, then apply.
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

    if (poseRootRef.current) {
      const rr = pose.rootRotation;
      if (rr) {
        poseRootRef.current.rotation.set(
          (rr[0] * Math.PI) / 180,
          (rr[1] * Math.PI) / 180,
          (rr[2] * Math.PI) / 180,
        );
      } else {
        poseRootRef.current.rotation.set(0, 0, 0);
      }
      const rt = pose.rootTranslation;
      if (rt) {
        poseRootRef.current.position.set(rt[0], rt[1], rt[2]);
      } else {
        poseRootRef.current.position.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={poseRootRef}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

interface Props {
  poseId: string;
}

// Body Y range is approximately 0 (feet) to 3 (head); X is left/right;
// Z is depth (offset around 1.5-1.9). Camera pulled back along Z to see
// the body from the front.
const DEFAULT_CAMERA_POS: [number, number, number] = [0, 1.5, 8.0];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 1.5, 1.65];

export default function PosedRiggedBodyCanvas({ poseId }: Props) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POS, fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <color attach="background" args={[0.055, 0.047, 0.031]} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#fbe6c4', '#16131c', 0.55]} />
        <directionalLight position={[6, 8, 6]} intensity={1.2} color="#fff6e0" />
        <directionalLight position={[-7, 3, -4]} intensity={0.55} color="#9ec7e6" />

        <Suspense fallback={null}>
          <Scene poseId={poseId} />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.09}
          rotateSpeed={0.85}
          zoomSpeed={0.6}
          panSpeed={0.9}
          minDistance={1.5}
          maxDistance={20}
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
