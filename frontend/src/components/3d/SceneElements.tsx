"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hyper-Dynamic Kinetic Rings with pulsing nodes
 * Represents interconnected booking schedules, real-time client traffic, and slot reservations.
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
          color="#C8F135"
          emissive="#C8F135"
          emissiveIntensity={0.65}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Internal Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#00FFAA"
          emissive="#00FFAA"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Ring 1 - Outer Torus Orbit */}
      <group ref={outerRing}>
        <mesh>
          <torusGeometry args={[3.2, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#C8F135"
            emissive="#C8F135"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Orbiting Satellite Nodes on Ring 1 */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#00FFAA" emissive="#00FFAA" emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>

      {/* Ring 2 - Mid Diagonal Gyroscope Ring */}
      <group ref={midRing} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.4, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#00FFAA"
            emissive="#00FFAA"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* Ring 3 - Inner Concentric Orbit */}
      <group ref={innerRing} rotation={[0, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.03, 16, 80]} />
          <meshStandardMaterial
            color="#C8F135"
            emissive="#C8F135"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Interactive Neural Constellation Particle Field
 */
export const ConstellationField = ({ count = 1800 }) => {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Swirling cylinder / galaxy distribution
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
        color="#C8F135"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
};

export const GridPlane = () => (
  <gridHelper 
    args={[80, 40, "#C8F135", "#161614"]} 
    position={[0, -4.5, 0]} 
    onUpdate={(self) => {
      if (self.material instanceof THREE.Material) {
        self.material.transparent = true;
        self.material.opacity = 0.06;
      }
    }}
  />
);
