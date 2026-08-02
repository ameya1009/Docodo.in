"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { ParticleField, OrbFloat, GridPlane } from "./SceneElements";

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
              <OrbFloat />
            </Float>

            {/* Orbiting Mini Orbs */}
            {[...Array(6)].map((_, i) => (
              <Float
                key={i}
                speed={2}
                rotationIntensity={1}
                floatIntensity={2}
                position={[
                  Math.cos(i * (Math.PI * 2) / 6) * 4,
                  Math.sin(i * (Math.PI * 2) / 6) * 4,
                  Math.sin(i) * 2
                ]}
              >
                <OrbFloat size={0.15} color={i % 2 === 0 ? "#C8F135" : "#00FFAA"} />
              </Float>
            ))}
          </group>

          <ParticleField />
          <GridPlane />

          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#C8F135" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFAA" />

          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.8}
              mipmapBlur
              intensity={0.6}
              radius={0.3}
            />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
