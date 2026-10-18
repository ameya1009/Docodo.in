"use client";

import React, { Suspense, useState, useEffect, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { 
  KineticQuantumCore, 
  ClinicalHelixCore, 
  MedicalBeaconCross, 
  ConstellationField, 
  GridPlane 
} from "./SceneElements";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("HeroScene WebGL gracefully caught fallback:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const HeroScene = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsSupported(false);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-85 sm:opacity-95">
      <WebGLErrorBoundary>
        <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={45} />

          <Suspense fallback={null}>
            {/* Main Floating Gyroscopic Engine & DNA Helix */}
            <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
              <group position={[0, 0.2, 0]}>
                <KineticQuantumCore />
                <ClinicalHelixCore />
              </group>
            </Float>

            {/* Orbiting Medical Beacon Cross */}
            <Float speed={2.2} rotationIntensity={0.8} floatIntensity={0.9}>
              <group position={[3.6, 1.8, -1.5]}>
                <MedicalBeaconCross />
              </group>
            </Float>

            {/* Monochromatic Stardust Particle Cloud */}
            <ConstellationField count={1800} />

            {/* Depth Grid Plane */}
            <GridPlane />

            <Environment preset="night" />
            <ambientLight intensity={0.35} />
            <pointLight position={[8, 8, 8]} intensity={3.5} color="#FFFFFF" />
            <pointLight position={[-8, -8, -8]} intensity={1.8} color="#E4E4E7" />
            <pointLight position={[0, 5, 2]} intensity={2.5} color="#FFFFFF" />

            <EffectComposer enableNormalPass={false}>
              <Bloom
                luminanceThreshold={0.55}
                mipmapBlur
                intensity={1.1}
                radius={0.45}
              />
              <Noise opacity={0.012} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
