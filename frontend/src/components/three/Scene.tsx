"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroScene } from './HeroScene';
import { OrbitControls, Preload } from '@react-three/drei';

export const MainScene = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-bg-deep">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <HeroScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};
