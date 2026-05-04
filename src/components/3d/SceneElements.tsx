"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ParticleField = ({ count = 2500 }) => {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.05;
    points.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#C8F135"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
};

export const OrbFloat = ({ size = 2.4, color = "#C8F135" }) => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.4;
    mesh.current.position.y = Math.sin(time) * 0.1;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.05}
        metalness={0.95}
      />
    </mesh>
  );
};

export const GridPlane = () => (
  <gridHelper 
    args={[100, 50, "#C8F135", "#141412"]} 
    position={[0, -5, 0]} 
    rotation={[0, 0, 0]} 
    opacity={0.04}
    transparent
  />
);
