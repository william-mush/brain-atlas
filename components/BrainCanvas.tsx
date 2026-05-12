'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, type BrainRegion } from '@/lib/regions';
import { getCranialNerve } from '@/lib/cranial-nerves';

const MODEL_URL = '/models/brain.glb';
useGLTF.preload(MODEL_URL);

const SHELL_REGION_IDS = new Set([
  'cerebrum-shell-left',
  'cerebrum-shell-right',
]);

interface Props {
  selectedId: string | null;
  hoveredId: string | null;
  visibleIds: Set<string>;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  /** Optional per-region color override. Used by awareness mode to tint
   *  regions by limb (e.g. all prāṇāyāma regions in moss green). */
  tintMap?: Map<string, string>;
  /** Optional per-region opacity override [0..1]. Used for the samādhi
   *  dissolution animation — regions fade together rather than disappearing. */
  fadeMap?: Map<string, number>;
}

// Default camera position. The brain extends roughly x ±1.5, y -1.4 to 1.4,
// z ±1.5 in our scene units, so we sit ~8 units back with FOV 38° to fit
// the whole thing including the brainstem and cerebellum hanging below.
// Target is at y=0.3 (a bit above origin) because the cerebrum's center of
// mass is above the brainstem.
const DEFAULT_CAMERA_POS: [number, number, number] = [5.0, 1.5, 6.5];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.3, 0];

export default function BrainCanvas(props: Props) {
  const [shellOpacity, setShellOpacity] = useState(0.18);
  // Bumping this counter triggers the in-canvas reset effect.
  const [resetTick, setResetTick] = useState(0);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POS, fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <color attach="background" args={[0.055, 0.047, 0.031]} />
        <fog attach="fog" args={['#0e0c08', 8, 18]} />

        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#fbe6c4', '#16131c', 0.6]} />
        <directionalLight position={[5, 7, 5]} intensity={1.2} color="#fff6e0" />
        <directionalLight position={[-6, 3, -4]} intensity={0.55} color="#9ec7e6" />
        <pointLight position={[0, -2, 4]} intensity={0.4} color="#f7c79a" />

        <Suspense fallback={null}>
          <Scene
            selectedId={props.selectedId}
            hoveredId={props.hoveredId}
            visibleIds={props.visibleIds}
            onSelect={props.onSelect}
            onHover={props.onHover}
            shellOpacity={shellOpacity}
            resetTick={resetTick}
            tintMap={props.tintMap}
            fadeMap={props.fadeMap}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.09}
          rotateSpeed={0.85}
          zoomSpeed={0.6}
          panSpeed={0.9}
          minDistance={1.2}
          maxDistance={16}
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
          <span className="text-ink-300">Cerebrum</span>
          <button
            onClick={() => setShellOpacity(0.05)}
            className={`px-2 py-0.5 rounded-full transition ${shellOpacity <= 0.06 ? 'bg-ink-700 text-ink-50' : 'hover:bg-ink-800'}`}
          >
            x-ray
          </button>
          <button
            onClick={() => setShellOpacity(0.18)}
            className={`px-2 py-0.5 rounded-full transition ${shellOpacity > 0.06 && shellOpacity < 0.5 ? 'bg-ink-700 text-ink-50' : 'hover:bg-ink-800'}`}
          >
            ghost
          </button>
          <button
            onClick={() => setShellOpacity(0.85)}
            className={`px-2 py-0.5 rounded-full transition ${shellOpacity >= 0.5 ? 'bg-ink-700 text-ink-50' : 'hover:bg-ink-800'}`}
          >
            solid
          </button>
        </div>
        <button
          onClick={() => setResetTick((n) => n + 1)}
          className="flex items-center gap-1.5 text-[11px] text-ink-100 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 hover:bg-ink-800 hover:border-ink-500 backdrop-blur transition"
          title="Reset camera position and zoom"
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
  shellOpacity: number;
  resetTick: number;
}



function Scene({
  selectedId,
  hoveredId,
  visibleIds,
  onSelect,
  onHover,
  shellOpacity,
  resetTick,
  tintMap,
  fadeMap,
}: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);

  // Reset the view when the resetTick changes.
  useEffect(() => {
    if (resetTick === 0) return;
    camera.position.set(...DEFAULT_CAMERA_POS);
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
    // `controls` is the makeDefault OrbitControls instance
    const c = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (c && c.target && c.update) {
      c.target.set(...DEFAULT_CAMERA_TARGET);
      c.update();
    }
  }, [resetTick, camera, controls]);

  useEffect(() => {
    if (selectedId || hoveredId) {
      setAutoRotate(false);
    } else {
      const t = setTimeout(() => setAutoRotate(true), 2400);
      return () => clearTimeout(t);
    }
  }, [selectedId, hoveredId]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const meshChildren = useMemo(() => {
    const items: { region: BrainRegion; mesh: THREE.Mesh }[] = [];
    gltf.scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const nodeName = obj.parent?.name || obj.name;
      const region = REGIONS.find((r) => r.meshNode === nodeName);
      if (region) items.push({ region, mesh });
    });
    return items;
  }, [gltf.scene]);

  const visibleMeshes = useMemo(
    () => meshChildren.filter(({ region }) => visibleIds.has(region.id)),
    [meshChildren, visibleIds],
  );

  const visibleNerves = useMemo(
    () => REGIONS.filter((r) => r.nerveId && visibleIds.has(r.id)),
    [visibleIds],
  );

  const totalVisible = visibleMeshes.length + visibleNerves.length;

  return (
    <group ref={groupRef}>
      {visibleMeshes.map(({ region, mesh }) => (
        <RealMesh
          key={region.id}
          region={region}
          sourceMesh={mesh}
          selectedId={selectedId}
          hoveredId={hoveredId}
          isShell={SHELL_REGION_IDS.has(region.id)}
          shellOpacity={shellOpacity}
          onSelect={onSelect}
          onHover={onHover}
          tintColor={tintMap?.get(region.id)}
          fade={fadeMap?.get(region.id)}
        />
      ))}

      {visibleNerves.map((region) => (
        <NerveTube
          key={region.id}
          region={region}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

    </group>
  );
}

interface RealMeshProps {
  region: BrainRegion;
  sourceMesh: THREE.Mesh;
  selectedId: string | null;
  hoveredId: string | null;
  isShell: boolean;
  shellOpacity: number;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  /** Optional override of region.color, used by awareness mode. */
  tintColor?: string;
  /** Optional opacity multiplier [0..1] from fadeMap. */
  fade?: number;
}

function RealMesh({
  region,
  sourceMesh,
  selectedId,
  hoveredId,
  isShell,
  shellOpacity,
  onSelect,
  onHover,
  tintColor,
  fade,
}: RealMeshProps) {
  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anyFocus = Boolean(selectedId || hoveredId);
  const dimmed = anyFocus && !isSelected && !isHovered;

  // Effective color: tintColor overrides region.color when set.
  const effectiveColor = tintColor ?? region.color;

  const material = useMemo(() => {
    const baseColor = new THREE.Color(effectiveColor);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor.clone().multiplyScalar(0.08),
      emissiveIntensity: 0.5,
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: !isShell,
    });
  }, [effectiveColor, isShell]);

  useEffect(() => {
    const baseColor = new THREE.Color(effectiveColor);
    material.color = baseColor;
    const fadeMultiplier = fade ?? 1;
    if (isSelected) {
      material.emissive = baseColor.clone().multiplyScalar(0.55);
      material.emissiveIntensity = 1.1 * fadeMultiplier;
      material.opacity = (isShell ? Math.max(shellOpacity, 0.55) : 1.0) * fadeMultiplier;
    } else if (isHovered) {
      material.emissive = baseColor.clone().multiplyScalar(0.3);
      material.emissiveIntensity = 0.85 * fadeMultiplier;
      material.opacity = (isShell ? Math.max(shellOpacity, 0.45) : 1.0) * fadeMultiplier;
    } else if (dimmed) {
      material.emissive = baseColor.clone().multiplyScalar(0.04);
      material.emissiveIntensity = 0.25 * fadeMultiplier;
      material.opacity = (isShell ? shellOpacity * 0.6 : 0.22) * fadeMultiplier;
    } else if (tintColor) {
      // Awareness mode: tinted regions get a stronger glow even when neutral
      material.emissive = baseColor.clone().multiplyScalar(0.45);
      material.emissiveIntensity = 0.95 * fadeMultiplier;
      material.opacity = (isShell ? Math.max(shellOpacity, 0.5) : 0.92) * fadeMultiplier;
    } else {
      material.emissive = baseColor.clone().multiplyScalar(0.08);
      material.emissiveIntensity = 0.4 * fadeMultiplier;
      material.opacity = (isShell ? shellOpacity : 0.95) * fadeMultiplier;
    }
    material.depthWrite = !isShell && material.opacity > 0.5;
    material.needsUpdate = true;
  }, [isSelected, isHovered, dimmed, material, effectiveColor, isShell, shellOpacity, tintColor, fade]);

  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isSelected) {
      pulseRef.current += delta;
      const s = 1 + Math.sin(pulseRef.current * 2.4) * 0.015;
      meshRef.current.scale.set(s, s, s);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={sourceMesh.geometry}
      material={material}
      renderOrder={isShell ? 2 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : region.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(region.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

interface NerveTubeProps {
  region: BrainRegion;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

function NerveTube({ region, selectedId, hoveredId, onSelect, onHover }: NerveTubeProps) {
  const nerve = getCranialNerve(region.nerveId!);
  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anyFocus = Boolean(selectedId || hoveredId);
  const dimmed = anyFocus && !isSelected && !isHovered;

  const tubes = useMemo(() => {
    if (!nerve) return [];
    return nerve.paths.map((p, i) => {
      const pts = p.points.map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2]));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.25);
      const segments = Math.max(24, pts.length * 12);
      const geometry = new THREE.TubeGeometry(curve, segments, nerve.radius, 10, false);
      return { key: `${p.side}-${i}`, geometry };
    });
  }, [nerve]);

  const material = useMemo(() => {
    const base = new THREE.Color(nerve?.color || region.color);
    return new THREE.MeshStandardMaterial({
      color: base,
      emissive: base.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.6,
      roughness: 0.45,
      metalness: 0.1,
      transparent: true,
      opacity: 1.0,
    });
  }, [nerve, region.color]);

  useEffect(() => {
    const base = new THREE.Color(nerve?.color || region.color);
    if (isSelected) {
      material.emissive = base.clone().multiplyScalar(0.7);
      material.emissiveIntensity = 1.3;
      material.opacity = 1.0;
    } else if (isHovered) {
      material.emissive = base.clone().multiplyScalar(0.45);
      material.emissiveIntensity = 1.0;
      material.opacity = 1.0;
    } else if (dimmed) {
      material.emissive = base.clone().multiplyScalar(0.05);
      material.emissiveIntensity = 0.2;
      material.opacity = 0.35;
    } else {
      material.emissive = base.clone().multiplyScalar(0.18);
      material.emissiveIntensity = 0.55;
      material.opacity = 0.95;
    }
    material.needsUpdate = true;
  }, [isSelected, isHovered, dimmed, material, nerve, region.color]);

  if (!nerve) return null;

  return (
    <group>
      {tubes.map(({ key, geometry }) => (
        <mesh
          key={key}
          geometry={geometry}
          material={material}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(isSelected ? null : region.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(region.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = 'auto';
          }}
        />
      ))}
    </group>
  );
}
