'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Character } from './Character';
import { Suspense } from 'react';

export function HeroScene() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        shadows
        className="bg-transparent"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, 3, -5]} intensity={0.5} color="#FFD93D" />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* 3D Character */}
          <Character />

          {/* Controls - allow user to rotate the scene */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
