"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';

// A single layer of the pyramid
const PyramidLayer = ({ 
  position, 
  scale, 
  color, 
  text,
  scrollProgress,
  index
}: { 
  position: [number, number, number], 
  scale: [number, number, number], 
  color: string, 
  text: string,
  scrollProgress: any,
  index: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate the layer coming in based on scroll
  useFrame(() => {
    if (meshRef.current) {
      // Calculate a staggered reveal threshold based on index
      // Top layer (index 0) reveals first, bottom layer (index 3) reveals last
      const threshold = 0.2 + (3 - index) * 0.15;
      const progress = Math.max(0, Math.min(1, (scrollProgress.current - threshold) * 4));
      
      // Interpolate Y position from above to target position
      meshRef.current.position.y = THREE.MathUtils.lerp(
        position[1] + 5, // Start 5 units above
        position[1],     // Target position
        progress
      );
      
      // Add a slight rotation for dynamic feel
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        Math.PI / 4,
        0,
        progress
      );
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...scale)]} />
          <lineBasicMaterial color="#00FF41" linewidth={2} />
        </lineSegments>
      </mesh>
    </group>
  );
};

const PyramidScene = ({ scrollProgress }: { scrollProgress: any }) => {
  return (
    <group rotation={[0.4, Math.PI / 4, 0]}>
      {/* Level 1: Top (Velocity) */}
      <PyramidLayer index={0} position={[0, 1.5, 0]} scale={[1.5, 0.8, 1.5]} color="#00FFAA" text="Velocity" scrollProgress={scrollProgress} />
      {/* Level 2: Growth Automation */}
      <PyramidLayer index={1} position={[0, 0.5, 0]} scale={[2.5, 0.8, 2.5]} color="#00FF41" text="Growth Automation" scrollProgress={scrollProgress} />
      {/* Level 3: Infrastructure */}
      <PyramidLayer index={2} position={[0, -0.5, 0]} scale={[3.5, 0.8, 3.5]} color="#111111" text="Infrastructure" scrollProgress={scrollProgress} />
      {/* Level 4: Bottom (Systems Audit) */}
      <PyramidLayer index={3} position={[0, -1.5, 0]} scale={[4.5, 0.8, 4.5]} color="#050505" text="Systems Audit" scrollProgress={scrollProgress} />
    </group>
  );
};

export const FounderStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Keep a mutable ref of scroll progress for R3F to read inside useFrame
  const scrollRef = useRef(0);
  scrollYProgress.on("change", (latest) => {
    scrollRef.current = latest;
  });

  return (
    <section ref={containerRef} className="h-[150vh] bg-[var(--color-bg-primary)] relative">
      <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 z-10 p-8">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-h2 font-cabinet mb-6 glow-text"
          >
            Founder-First Growth Stack™
          </motion.h2>
          
          <div className="space-y-6">
            {[
              { title: "Velocity Optimization", desc: "Scale beyond 10k leads smoothly." },
              { title: "Growth Automation", desc: "WhatsApp bots & automated workflows." },
              { title: "Infrastructure", desc: "AWS + Firebase scalable foundation." },
              { title: "Systems Audit", desc: "Finding leaks in your current funnel." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                style={{ 
                  opacity: useTransform(scrollYProgress, 
                    [0.2 + (3-i)*0.15, 0.4 + (3-i)*0.15], 
                    [0.3, 1]
                  ) 
                }}
                className="border-l-2 border-[var(--color-accent-primary)] pl-4"
              >
                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: 3D Pyramid Canvas */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative pointer-events-none">
          <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <PyramidScene scrollProgress={scrollRef} />
            </Float>
          </Canvas>
        </div>
        
      </div>
    </section>
  );
};
