'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { REGIONS, type BrainRegion } from '@/lib/regions';
import { getCranialNerve } from '@/lib/cranial-nerves';

const MODEL_URL = '/models/brain.glb';
useGLTF.preload(MODEL_URL);

// Regions that act as the outer "shell" of the cerebrum.
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
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
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

  const visibleNerves = useMemo(
    () => REGIONS.filter((r) => r.nerveId && visibleIds.has(r.id)),
    [visibleIds],
  );

  const totalVisible = visibleMeshes.length + visibleNerves.length;

  // Compute a target framing whenever visibility or selection changes.
  // If a region is selected, frame on that region. Otherwise frame on
  // the union bbox of all visible meshes.
  const framing = useMemo(() => {
    // selected region: focused close-up
    if (selectedId) {
      const selMesh = visibleMeshes.find((m) => m.region.id === selectedId);
      if (selMesh) {
        const box = new THREE.Box3().setFromBufferAttribute(
          selMesh.mesh.geometry.attributes.position as THREE.BufferAttribute,
        );
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        // distance to fit largest dim into ~60% of viewport at FOV 38
        const maxDim = Math.max(size.x, size.y, size.z);
        const dist = Math.max(maxDim * 2.6, 2.0);
        return { target: center, distance: dist };
      }
    }
    // Otherwise: fit union of visible meshes
    if (visibleMeshes.length === 0 && visibleNerves.length === 0) {
      return { target: new THREE.Vector3(0, 0.1, 0), distance: 5.5 };
    }
    const box = new THREE.Box3();
    for (const { mesh } of visibleMeshes) {
      const meshBox = new THREE.Box3().setFromBufferAttribute(
        mesh.geometry.attributes.position as THREE.BufferAttribute,
      );
      box.union(meshBox);
    }
    // For nerves (procedural), incorporate the first path's endpoints as a coarse bbox
    for (const region of visibleNerves) {
      const nerve = region.nerveId ? getCranialNerve(region.nerveId) : null;
      if (!nerve) continue;
      for (const p of nerve.paths) {
        for (const [x, y, z] of p.points) {
          box.expandByPoint(new THREE.Vector3(x, y, z));
        }
      }
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.6);
    const dist = Math.max(maxDim * 2.0, 3.0);
    return { target: center, distance: dist };
  }, [visibleMeshes, visibleNerves, selectedId]);

  // Smoothly animate camera target + distance toward the computed framing.
  const { camera } = useThree();
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const lerp = 1 - Math.exp(-delta * 4.5); // critically-damped feel
    // Smoothly move the target
    controls.target.lerp(framing.target, lerp);
    // Maintain the current camera *direction* from target; just adjust distance
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const currentDist = dir.length();
    if (currentDist > 0.0001) {
      const newDist = currentDist + (framing.distance - currentDist) * lerp;
      dir.setLength(newDist);
      camera.position.copy(controls.target).add(dir);
    }
    controls.update();
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef as React.Ref<OrbitControlsImpl>}
        enableDamping
        dampingFactor={0.09}
        rotateSpeed={0.85}
        zoomSpeed={0.6}
        minDistance={1.2}
        maxDistance={16}
        makeDefault
      />
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

        {totalVisible === 0 && (
          <Html center style={{ pointerEvents: 'none' }}>
            <div className="text-ink-300 text-sm whitespace-nowrap bg-ink-900/85 px-4 py-2.5 rounded-md border border-ink-700 backdrop-blur">
              Nothing selected. Check a part on the left to add it.
            </div>
          </Html>
        )}
      </group>
    </>
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

  const labelPos = useMemo<[number, number, number] | null>(() => {
    if (!nerve || nerve.paths.length === 0) return null;
    const first = nerve.paths[0].points[0];
    return [first[0] * 1.18, first[1] + 0.08, first[2] * 1.05];
  }, [nerve]);

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
      {(isHovered || isSelected) && labelPos && (
        <Html
          center
          position={labelPos as unknown as THREE.Vector3}
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 rounded-md bg-ink-900/90 text-ink-50 text-xs font-medium whitespace-nowrap shadow-lg border border-ink-700 backdrop-blur">
            {nerve.roman} · {nerve.name.replace(' Nerve', '')}
          </div>
        </Html>
      )}
    </group>
  );
}
