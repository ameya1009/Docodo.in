"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hyper-Dynamic Kinetic Rings with pulsing nodes
 * Represents interconnected booking schedules, real-time client traffic, and slot reservations.
 * Monochromatic Clinical Luxury Edition.
 */
export const KineticQuantumCore = () => {
  const outerRing = useRef<THREE.Group>(null!);
  const midRing = useRef<THREE.Group>(null!);
  const innerRing = useRef<THREE.Group>(null!);
  const coreIcosahedron = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRing.current) {
      outerRing.current.rotation.x = t * 0.25;
      outerRing.current.rotation.y = t * 0.35;
    }
    if (midRing.current) {
      midRing.current.rotation.y = -t * 0.4;
      midRing.current.rotation.z = t * 0.3;
    }
    if (innerRing.current) {
      innerRing.current.rotation.x = -t * 0.5;
      innerRing.current.rotation.z = -t * 0.45;
    }
    if (coreIcosahedron.current) {
      coreIcosahedron.current.rotation.y = t * 0.6;
      coreIcosahedron.current.rotation.x = Math.sin(t * 0.8) * 0.3;
      const s = 1 + Math.sin(t * 2) * 0.08;
      coreIcosahedron.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Quantum Node */}
      <mesh ref={coreIcosahedron}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Internal Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#E4E4E7"
          emissive="#FFFFFF"
          emissiveIntensity={0.9}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Ring 1 - Outer Torus Orbit */}
      <group ref={outerRing}>
        <mesh>
          <torusGeometry args={[3.2, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Orbiting Satellite Nodes on Ring 1 */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>

      {/* Ring 2 - Mid Diagonal Gyroscope Ring */}
      <group ref={midRing} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.4, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#E4E4E7"
            emissive="#FFFFFF"
            emissiveIntensity={0.55}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* Ring 3 - Inner Concentric Orbit */}
      <group ref={innerRing} rotation={[0, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.03, 16, 80]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.45}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 3D Clinical Double-Helix DNA Lattice
 * Represents modern evidence-based clinical diagnostics & medical precision.
 */
export const ClinicalHelixCore = () => {
  const helixRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (helixRef.current) {
      helixRef.current.rotation.y = t * 0.4;
      helixRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    }
  });

  const numNodes = 24;
  const radius = 1.3;
  const height = 4.2;

  const basePairs = useMemo(() => {
    const items = [];
    for (let i = 0; i < numNodes; i++) {
      const progress = i / numNodes;
      const angle = progress * Math.PI * 4;
      const y = (progress - 0.5) * height;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      items.push({ id: i, p1: [x1, y, z1] as [number, number, number], p2: [x2, y, z2] as [number, number, number] });
    }
    return items;
  }, []);

  return (
    <group ref={helixRef} position={[0, 0, 0]}>
      {basePairs.map((pair) => (
        <group key={pair.id}>
          {/* Strand 1 Node */}
          <mesh position={pair.p1}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
          </mesh>
          {/* Strand 2 Node */}
          <mesh position={pair.p2}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#E4E4E7" emissive="#FFFFFF" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * 3D Medical Beacon Cross with Radiant Scanner Ring
 */
export const MedicalBeaconCross = () => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
      groupRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Vertical beam */}
      <mesh>
        <boxGeometry args={[0.25, 1.4, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Horizontal beam */}
      <mesh>
        <boxGeometry args={[1.4, 0.25, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Scanning halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 16, 64]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

/**
 * Interactive Neural Constellation Particle Field (Monochrome Stardust)
 */
export const ConstellationField = ({ count = 1800 }) => {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      temp[i * 3] = Math.cos(theta) * r;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 8;
      temp[i * 3 + 2] = Math.sin(theta) * r;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = t * 0.04;
      points.current.rotation.x = Math.sin(t * 0.05) * 0.08;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#FFFFFF"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

export const GridPlane = () => (
  <gridHelper 
    args={[80, 40, "#FFFFFF", "#18181B"]} 
    position={[0, -4.5, 0]} 
    onUpdate={(self) => {
      if (self.material instanceof THREE.Material) {
        self.material.transparent = true;
        self.material.opacity = 0.08;
      }
    }}
  />
);
