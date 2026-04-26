import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const CentralOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.25;
      
      // Responsive parallax
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#C8F135" 
          emissive="#C8F135"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
};

const ParticleField = () => {
  return (
    <Sparkles 
      count={2000} 
      scale={20} 
      size={0.6} 
      speed={0.4} 
      color="#C8F135" 
      opacity={0.6}
    />
  );
};

export const HeroScene = () => {
  return (
    <>
      <color attach="background" args={["#080807"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#C8F135" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFAA" />
      
      <CentralOrb />
      <ParticleField />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
    </>
  );
};
