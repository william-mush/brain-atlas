'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, type BrainRegion } from '@/lib/regions';

const MODEL_URL = '/models/brain.glb';
useGLTF.preload(MODEL_URL);

// Regions that act as the outer "shell" of the cerebrum.
// We render these semi-transparent so the interior structures are visible.
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
}

export default function BrainCanvas(props: Props) {
  const [shellOpacity, setShellOpacity] = useState(0.18);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [4.5, 1.2, 5.0], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
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
          />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.09}
          rotateSpeed={0.85}
          zoomSpeed={0.6}
          minDistance={2.2}
          maxDistance={14}
          target={[0, 0.1, 0]}
          makeDefault
        />
      </Canvas>

      {/* Shell-opacity toggle */}
      <div className="absolute top-3 right-3 flex items-center gap-2 text-[11px] text-ink-200 bg-ink-900/80 px-3 py-1.5 rounded-full border border-ink-700 backdrop-blur">
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
    </div>
  );
}

interface SceneProps extends Props {
  shellOpacity: number;
}

function Scene({
  selectedId,
  hoveredId,
  visibleIds,
  onSelect,
  onHover,
  shellOpacity,
}: SceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(true);

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
        />
      ))}
      {visibleMeshes.length === 0 && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div className="text-ink-300 text-sm whitespace-nowrap bg-ink-900/85 px-4 py-2.5 rounded-md border border-ink-700 backdrop-blur">
            Nothing selected. Check a part on the left to add it.
          </div>
        </Html>
      )}
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
}: RealMeshProps) {
  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anyFocus = Boolean(selectedId || hoveredId);
  const dimmed = anyFocus && !isSelected && !isHovered;

  const material = useMemo(() => {
    const baseColor = new THREE.Color(region.color);
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
  }, [region.color, isShell]);

  useEffect(() => {
    const baseColor = new THREE.Color(region.color);
    if (isSelected) {
      material.emissive = baseColor.clone().multiplyScalar(0.55);
      material.emissiveIntensity = 1.1;
      material.opacity = isShell ? Math.max(shellOpacity, 0.55) : 1.0;
    } else if (isHovered) {
      material.emissive = baseColor.clone().multiplyScalar(0.3);
      material.emissiveIntensity = 0.85;
      material.opacity = isShell ? Math.max(shellOpacity, 0.45) : 1.0;
    } else if (dimmed) {
      material.emissive = baseColor.clone().multiplyScalar(0.04);
      material.emissiveIntensity = 0.25;
      material.opacity = isShell ? shellOpacity * 0.6 : 0.22;
    } else {
      material.emissive = baseColor.clone().multiplyScalar(0.08);
      material.emissiveIntensity = 0.4;
      material.opacity = isShell ? shellOpacity : 0.95;
    }
    material.depthWrite = !isShell && material.opacity > 0.5;
    material.needsUpdate = true;
  }, [isSelected, isHovered, dimmed, material, region.color, isShell, shellOpacity]);

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

  const labelPos = useMemo(() => {
    const pos = sourceMesh.geometry.attributes.position as THREE.BufferAttribute;
    const box = new THREE.Box3().setFromBufferAttribute(pos);
    const center = box.getCenter(new THREE.Vector3());
    return [center.x, box.max.y + 0.08, center.z] as const;
  }, [sourceMesh.geometry]);

  return (
    <group>
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
      {(isHovered || isSelected) && (
        <Html
          center
          position={labelPos as unknown as THREE.Vector3}
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 rounded-md bg-ink-900/90 text-ink-50 text-xs font-medium whitespace-nowrap shadow-lg border border-ink-700 backdrop-blur">
            {region.shortName || region.name}
          </div>
        </Html>
      )}
    </group>
  );
}
