'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, type BrainRegion } from '@/lib/regions';

interface Props {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

export default function BrainCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [3.8, 1.6, 4.2], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-5, -3, -4]} intensity={0.35} color="#a8c0e0" />
      <pointLight position={[0, -3, 2]} intensity={0.4} color="#ffd9a8" />

      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={0.6}
        minDistance={2}
        maxDistance={12}
        makeDefault
      />
    </Canvas>
  );
}

function Scene({ selectedId, hoveredId, onSelect, onHover }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current && !hoveredId && !selectedId) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft underlying brain mass — gives the regions a body to sit in */}
      <BrainShell />
      {REGIONS.map((region) => (
        <Region
          key={region.id}
          region={region}
          isSelected={selectedId === region.id}
          isHovered={hoveredId === region.id}
          dimmed={Boolean((selectedId || hoveredId) && selectedId !== region.id && hoveredId !== region.id)}
          onClick={() => onSelect(selectedId === region.id ? null : region.id)}
          onPointerOver={() => onHover(region.id)}
          onPointerOut={() => onHover(null)}
        />
      ))}

      {/* Floor disk so you have a sense of orientation when rotating */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 0]}>
        <ringGeometry args={[1.4, 2.2, 64]} />
        <meshBasicMaterial color="#cfc7b1" transparent opacity={0.18} />
      </mesh>

      {/* Tiny invisible control toggler — autoRotate is currently always off; left as an extension hook */}
      <mesh visible={false} onClick={() => setAutoRotate((v) => !v)}>
        <boxGeometry />
      </mesh>
    </group>
  );
}

/** Translucent ellipsoid that gives the brain a "body" beneath the labeled regions. */
function BrainShell() {
  return (
    <group>
      {/* Cerebrum */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[1.55, 64, 48]} />
        <meshStandardMaterial
          color="#f6f0e3"
          transparent
          opacity={0.14}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
      {/* Brainstem core */}
      <mesh position={[0, -0.7, -0.05]}>
        <cylinderGeometry args={[0.32, 0.35, 1.0, 24]} />
        <meshStandardMaterial color="#e8dec5" transparent opacity={0.18} roughness={0.9} />
      </mesh>
      {/* Spinal continuation */}
      <mesh position={[0, -2.1, -0.05]}>
        <cylinderGeometry args={[0.17, 0.17, 1.6, 16]} />
        <meshStandardMaterial color="#cfc7b1" transparent opacity={0.22} roughness={0.9} />
      </mesh>
    </group>
  );
}

interface RegionProps {
  region: BrainRegion;
  isSelected: boolean;
  isHovered: boolean;
  dimmed: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

function Region({
  region,
  isSelected,
  isHovered,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: RegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseColor = useMemo(() => new THREE.Color(region.color), [region.color]);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isSelected) {
      pulseRef.current += delta;
      const s = 1 + Math.sin(pulseRef.current * 2.4) * 0.04;
      meshRef.current.scale.set(region.scale[0] * s, region.scale[1] * s, region.scale[2] * s);
    } else {
      meshRef.current.scale.set(region.scale[0], region.scale[1], region.scale[2]);
    }
  });

  const emissive = isSelected
    ? baseColor.clone().multiplyScalar(0.6)
    : isHovered
      ? baseColor.clone().multiplyScalar(0.3)
      : new THREE.Color('#000');

  const opacity = dimmed ? 0.28 : isSelected ? 0.96 : 0.78;

  return (
    <group position={region.position} rotation={region.rotation || [0, 0, 0]}>
      <mesh
        ref={meshRef}
        scale={region.scale}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onPointerOut();
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.9 : isHovered ? 0.4 : 0.05}
          transparent
          opacity={opacity}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {(isHovered || isSelected) && (
        <Html
          center
          distanceFactor={8}
          position={[0, region.scale[1] + 0.25, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 rounded-md bg-ink-900/85 text-ink-50 text-xs font-medium whitespace-nowrap shadow-lg border border-ink-700">
            {region.shortName || region.name}
          </div>
        </Html>
      )}
    </group>
  );
}
