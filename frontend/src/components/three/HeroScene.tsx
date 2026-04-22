import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Icosahedron, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const CentralOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      // Subtle parallax based on mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 2, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 2, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Icosahedron ref={meshRef} args={[1.5, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00FFAA" 
          wireframe 
          emissive="#00FF41" 
          emissiveIntensity={0.5} 
        />
      </Icosahedron>
    </Float>
  );
};

const FloatingSpheres = () => {
  const count = 8;
  const spheres = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <>
      {spheres.map((props, i) => (
        <Float key={i} speed={props.speed} floatIntensity={3}>
          <Sphere args={[props.scale, 16, 16]} position={props.position}>
            <meshBasicMaterial color="#00FF41" wireframe transparent opacity={0.3} />
          </Sphere>
        </Float>
      ))}
    </>
  );
};

export const HeroScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#00FF41" />
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <CentralOrb />
      <FloatingSpheres />
    </>
  );
};
