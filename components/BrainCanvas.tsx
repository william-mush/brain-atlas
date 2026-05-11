'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, getRegion, type BrainRegion } from '@/lib/regions';

const MODEL_URL = '/models/brain.glb';
useGLTF.preload(MODEL_URL);

interface Props {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

export default function BrainCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [3.4, 0.8, 3.6], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ background: 'transparent' }}
      shadows
    >
      <color attach="background" args={[0.055, 0.047, 0.031]} />
      <fog attach="fog" args={['#0e0c08', 6, 14]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#fbe6c4', '#16131c', 0.55]} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#fff6e0" castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.55} color="#9ec7e6" />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#f7c79a" />

      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.09}
        rotateSpeed={0.85}
        zoomSpeed={0.6}
        minDistance={1.6}
        maxDistance={10}
        target={[0, 0, 0]}
        makeDefault
      />
    </Canvas>
  );
}

function Scene({ selectedId, hoveredId, onSelect, onHover }: Props) {
  const gltf = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // When user interacts, pause auto-rotate; resume after idle
  const lastInteractionRef = useRef(0);
  useEffect(() => {
    if (selectedId || hoveredId) {
      lastInteractionRef.current = performance.now();
      setAutoRotate(false);
    } else {
      const t = setTimeout(() => setAutoRotate(true), 1800);
      return () => clearTimeout(t);
    }
  }, [selectedId, hoveredId]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  // Walk every mesh in the GLB and attach our region metadata.
  // Each node in the GLB is named after the region id (we set this in the builder).
  const meshChildren = useMemo(() => {
    const items: { region: BrainRegion; mesh: THREE.Mesh }[] = [];
    gltf.scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      // Region node name lives on the parent node (which contained the mesh)
      const nodeName = obj.parent?.name || obj.name;
      // Find the region with that meshNode
      const region = REGIONS.find((r) => r.meshNode === nodeName);
      if (region) {
        items.push({ region, mesh });
      }
    });
    return items;
  }, [gltf.scene]);

  return (
    <group ref={groupRef}>
      {/* Real anatomical meshes */}
      {meshChildren.map(({ region, mesh }) => (
        <RealMesh
          key={region.id}
          region={region}
          sourceMesh={mesh}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {/* Procedural markers for regions without BP3D meshes */}
      {REGIONS.filter((r) => !r.meshNode && r.position && r.scale).map((region) => (
        <Marker
          key={region.id}
          region={region}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {/* Subtle floor for orientation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.3, 0]} receiveShadow>
        <ringGeometry args={[1.2, 2.0, 64]} />
        <meshBasicMaterial color="#cfc7b1" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

interface RealMeshProps {
  region: BrainRegion;
  sourceMesh: THREE.Mesh;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

function RealMesh({
  region,
  sourceMesh,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: RealMeshProps) {
  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anySelected = Boolean(selectedId);
  const anyHovered = Boolean(hoveredId);
  const dimmed = (anySelected || anyHovered) && !isSelected && !isHovered;

  // Each region gets its own material instance so we can tune emissive/opacity per-region
  const material = useMemo(() => {
    const baseColor = new THREE.Color(region.color);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor.clone().multiplyScalar(0.05),
      emissiveIntensity: 0.6,
      roughness: 0.55,
      metalness: 0.05,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });
  }, [region.color]);

  useEffect(() => {
    // Update material per state change without rebuilding
    const baseColor = new THREE.Color(region.color);
    if (isSelected) {
      material.emissive = baseColor.clone().multiplyScalar(0.55);
      material.emissiveIntensity = 1.1;
      material.opacity = 1.0;
    } else if (isHovered) {
      material.emissive = baseColor.clone().multiplyScalar(0.3);
      material.emissiveIntensity = 0.9;
      material.opacity = 1.0;
    } else {
      material.emissive = baseColor.clone().multiplyScalar(0.05);
      material.emissiveIntensity = 0.35;
      material.opacity = dimmed ? 0.18 : 0.95;
    }
    material.needsUpdate = true;
  }, [isSelected, isHovered, dimmed, material, region.color]);

  // Gentle pulse on selection
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isSelected) {
      pulseRef.current += delta;
      const s = 1 + Math.sin(pulseRef.current * 2.6) * 0.018;
      meshRef.current.scale.set(s, s, s);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const labelPos = useMemo(() => {
    const box = new THREE.Box3().setFromBufferAttribute(
      sourceMesh.geometry.attributes.position as THREE.BufferAttribute,
    );
    const center = box.getCenter(new THREE.Vector3());
    const sizeY = box.max.y - box.min.y;
    return [center.x, box.max.y + sizeY * 0.15 + 0.05, center.z] as const;
  }, [sourceMesh.geometry]);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={sourceMesh.geometry}
        material={material}
        castShadow
        receiveShadow
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

interface MarkerProps {
  region: BrainRegion;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

function Marker({ region, selectedId, hoveredId, onSelect, onHover }: MarkerProps) {
  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anySelected = Boolean(selectedId);
  const anyHovered = Boolean(hoveredId);
  const dimmed = (anySelected || anyHovered) && !isSelected && !isHovered;

  const baseColor = useMemo(() => new THREE.Color(region.color), [region.color]);
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isSelected) {
      pulseRef.current += delta;
      const s = 1 + Math.sin(pulseRef.current * 2.6) * 0.06;
      meshRef.current.scale.setScalar(s);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const emissive = isSelected
    ? baseColor.clone().multiplyScalar(0.7)
    : isHovered
      ? baseColor.clone().multiplyScalar(0.4)
      : baseColor.clone().multiplyScalar(0.1);

  const opacity = dimmed ? 0.25 : isSelected ? 1.0 : 0.85;
  const pos = region.position!;
  const sc = region.scale!;

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        scale={sc}
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
      >
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={isSelected ? 1.0 : 0.45}
          transparent
          opacity={opacity}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {(isHovered || isSelected) && (
        <Html center distanceFactor={6} position={[0, sc[1] * 1.2 + 0.1, 0]} style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-1 rounded-md bg-ink-900/90 text-ink-50 text-xs font-medium whitespace-nowrap shadow-lg border border-ink-700 backdrop-blur">
            {region.shortName || region.name}
          </div>
        </Html>
      )}
    </group>
  );
}
