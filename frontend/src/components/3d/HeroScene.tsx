"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { KineticQuantumCore, ConstellationField, GridPlane } from "./SceneElements";

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 sm:opacity-95">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={45} />

        <Suspense fallback={null}>
          {/* Main Floating Gyroscopic Engine */}
          <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
            <KineticQuantumCore />
          </Float>

          {/* Galaxy Particle Cloud */}
          <ConstellationField count={1800} />

          {/* Depth Grid Plane */}
          <GridPlane />

          <Environment preset="night" />
          <ambientLight intensity={0.25} />
          <pointLight position={[8, 8, 8]} intensity={2.5} color="#C8F135" />
          <pointLight position={[-8, -8, -8]} intensity={1.2} color="#00FFAA" />
          <pointLight position={[0, 5, 2]} intensity={1.8} color="#C8F135" />

          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.7}
              mipmapBlur
              intensity={0.8}
              radius={0.4}
            />
            <Noise opacity={0.015} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
