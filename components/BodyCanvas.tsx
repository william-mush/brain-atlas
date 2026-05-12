'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BODY_PARTS, ATTACHMENTS, type BodyPart } from '@/lib/body';
import { getStateForPart, STATE_COLORS, type Pose, type MuscleState } from '@/lib/poses';

const MODEL_URL = '/models/body.glb';
useGLTF.preload(MODEL_URL);

// Camera in front of the body, slightly elevated. The body spans roughly
// y in [-1.5, 1.5] so the target sits at y=0 (centered on chest).
const DEFAULT_CAMERA_POS: [number, number, number] = [0.0, 0.3, 6.5];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

interface Props {
  selectedId: string | null;
  hoveredId: string | null;
  visibleIds: Set<string>;
  activePose: Pose | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

export default function BodyCanvas(props: Props) {
  const [skinOpacity, setSkinOpacity] = useState(1.0);
  const [resetTick, setResetTick] = useState(0);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POS, fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <color attach="background" args={[0.055, 0.047, 0.031]} />
        <fog attach="fog" args={['#0e0c08', 9, 22]} />

        <ambientLight intensity={0.5} />
        <hemisphereLight args={['#fbe6c4', '#16131c', 0.55]} />
        <directionalLight position={[6, 8, 6]} intensity={1.2} color="#fff6e0" />
        <directionalLight position={[-7, 3, -4]} intensity={0.55} color="#9ec7e6" />
        <pointLight position={[0, -2, 5]} intensity={0.4} color="#f7c79a" />

        <Suspense fallback={null}>
          <Scene
            {...props}
            skinOpacity={skinOpacity}
            resetTick={resetTick}
          />
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
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          makeDefault
        />
      </Canvas>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="flex items-center gap-2 text-[11px] text-ink-200 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur">
          <span className="text-ink-300">Bones</span>
          <button
            onClick={() => setSkinOpacity(0.18)}
            className={`px-2 py-0.5 rounded-full transition ${skinOpacity <= 0.25 ? 'bg-ink-700 text-ink-50' : 'hover:bg-ink-800'}`}
          >
            ghost
          </button>
          <button
            onClick={() => setSkinOpacity(1.0)}
            className={`px-2 py-0.5 rounded-full transition ${skinOpacity > 0.25 ? 'bg-ink-700 text-ink-50' : 'hover:bg-ink-800'}`}
          >
            solid
          </button>
        </div>
        <button
          onClick={() => setResetTick((n) => n + 1)}
          className="flex items-center gap-1.5 text-[11px] text-ink-100 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 hover:bg-ink-800 hover:border-ink-500 backdrop-blur transition"
          title="Reset view"
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 8a6 6 0 1 1-1.76-4.24" />
            <polyline points="14 2 14 6 10 6" />
          </svg>
          Reset view
        </button>
      </div>
    </div>
  );
}

interface SceneProps extends Props {
  skinOpacity: number;
  resetTick: number;
}

function Scene({
  selectedId,
  hoveredId,
  visibleIds,
  activePose,
  onSelect,
  onHover,
  skinOpacity,
  resetTick,
}: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (resetTick === 0) return;
    camera.position.set(...DEFAULT_CAMERA_POS);
    if (groupRef.current) groupRef.current.rotation.set(0, 0, 0);
    const c = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (c?.target && c?.update) {
      c.target.set(...DEFAULT_CAMERA_TARGET);
      c.update();
    }
  }, [resetTick, camera, controls]);

  useEffect(() => {
    if (selectedId || hoveredId) setAutoRotate(false);
    else {
      const t = setTimeout(() => setAutoRotate(true), 2400);
      return () => clearTimeout(t);
    }
  }, [selectedId, hoveredId]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const meshChildren = useMemo(() => {
    const items: { part: BodyPart; mesh: THREE.Mesh }[] = [];
    gltf.scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const nodeName = obj.parent?.name || obj.name;
      const part = BODY_PARTS.find((p) => p.id === nodeName);
      if (part) items.push({ part, mesh });
    });
    return items;
  }, [gltf.scene]);

  const visibleMeshes = useMemo(
    () => meshChildren.filter(({ part }) => visibleIds.has(part.id)),
    [meshChildren, visibleIds],
  );

  return (
    <group ref={groupRef}>
      {visibleMeshes.map(({ part, mesh }) => {
        const state = getStateForPart(activePose, part);
        return (
          <BodyMesh
            key={part.id}
            part={part}
            sourceMesh={mesh}
            selectedId={selectedId}
            hoveredId={hoveredId}
            skinOpacity={skinOpacity}
            poseActive={!!activePose}
            poseState={state}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}

      {selectedId && <AttachmentMarkers partId={selectedId} />}
    </group>
  );
}

function AttachmentMarkers({ partId }: { partId: string }) {
  const att = ATTACHMENTS[partId];
  if (!att) return null;
  return (
    <>
      {att.origin && (
        <mesh position={att.origin as [number, number, number]}>
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color="#7a9461" emissive="#7a9461" emissiveIntensity={0.6} />
        </mesh>
      )}
      {att.insertion && (
        <mesh position={att.insertion as [number, number, number]}>
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color="#e89aa3" emissive="#e89aa3" emissiveIntensity={0.6} />
        </mesh>
      )}
      {att.origin && att.insertion && (
        <LineSegment a={att.origin as [number, number, number]} b={att.insertion as [number, number, number]} />
      )}
    </>
  );
}

function LineSegment({ a, b }: { a: [number, number, number]; b: [number, number, number] }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([a[0], a[1], a[2], b[0], b[1], b[2]], 3),
    );
    return g;
  }, [a, b]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#e8b04a" linewidth={2} />
    </line>
  );
}

interface BodyMeshProps {
  part: BodyPart;
  sourceMesh: THREE.Mesh;
  selectedId: string | null;
  hoveredId: string | null;
  skinOpacity: number;
  poseActive: boolean;
  poseState: MuscleState | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

function BodyMesh({
  part,
  sourceMesh,
  selectedId,
  hoveredId,
  skinOpacity,
  poseActive,
  poseState,
  onSelect,
  onHover,
}: BodyMeshProps) {
  const isSelected = selectedId === part.id;
  const isHovered = hoveredId === part.id;
  const anyFocus = Boolean(selectedId || hoveredId);
  const dimmed = anyFocus && !isSelected && !isHovered;

  const isBone = part.kind === 'bone';

  // Determine the BASE color for this part, given pose state if any.
  const baseColorHex = useMemo(() => {
    if (isBone) return '#e8dec5';
    if (poseActive) {
      if (poseState) return STATE_COLORS[poseState];
      // No state for this muscle in this pose: very muted
      return STATE_COLORS.unloaded;
    }
    return '#c45050';
  }, [isBone, poseActive, poseState]);

  const material = useMemo(() => {
    const baseColor = new THREE.Color(baseColorHex);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor.clone().multiplyScalar(0.05),
      emissiveIntensity: 0.4,
      roughness: 0.55,
      metalness: 0.05,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
    });
  }, [baseColorHex]);

  useEffect(() => {
    const baseColor = new THREE.Color(baseColorHex);
    material.color.copy(baseColor);
    if (isSelected) {
      material.emissive = baseColor.clone().multiplyScalar(0.55);
      material.emissiveIntensity = 1.0;
      material.opacity = 1.0;
    } else if (isHovered) {
      material.emissive = baseColor.clone().multiplyScalar(0.3);
      material.emissiveIntensity = 0.8;
      material.opacity = 1.0;
    } else if (dimmed) {
      material.emissive = baseColor.clone().multiplyScalar(0.04);
      material.emissiveIntensity = 0.2;
      material.opacity = isBone ? 0.15 : 0.25;
    } else {
      // When a pose is active, push muscles with no state to lower opacity
      // so the colored ones pop. Bones stay at the user-controlled opacity.
      const unloaded = poseActive && !poseState && !isBone;
      material.emissive = baseColor.clone().multiplyScalar(unloaded ? 0.02 : 0.08);
      material.emissiveIntensity = unloaded ? 0.15 : 0.45;
      if (isBone) {
        material.opacity = skinOpacity;
      } else {
        material.opacity = unloaded ? 0.35 : 0.95;
      }
    }
    material.depthWrite = material.opacity > 0.6;
    material.needsUpdate = true;
  }, [isSelected, isHovered, dimmed, material, isBone, skinOpacity, baseColorHex, poseActive, poseState]);

  return (
    <mesh
      geometry={sourceMesh.geometry}
      material={material}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : part.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(part.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
    />
  );
}
