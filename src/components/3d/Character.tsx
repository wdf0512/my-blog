'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

export function Character() {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <Sphere args={[0.4, 32, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>

      {/* Glasses */}
      <group position={[0, 1.65, 0.35]}>
        {/* Left lens */}
        <Cylinder args={[0.12, 0.12, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} position={[-0.15, 0, 0]}>
          <meshStandardMaterial color="#333" opacity={0.3} transparent />
        </Cylinder>
        {/* Right lens */}
        <Cylinder args={[0.12, 0.12, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0.15, 0, 0]}>
          <meshStandardMaterial color="#333" opacity={0.3} transparent />
        </Cylinder>
        {/* Bridge */}
        <Cylinder args={[0.02, 0.02, 0.1, 8]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333" />
        </Cylinder>
      </group>

      {/* Cap */}
      <group position={[0, 1.95, 0]} rotation={[0.1, 0, 0]}>
        {/* Cap top */}
        <Cylinder args={[0.35, 0.35, 0.1, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2C2C2C" />
        </Cylinder>
        {/* Cap brim */}
        <Cylinder args={[0.5, 0.48, 0.05, 32]} position={[0, -0.05, 0.1]}>
          <meshStandardMaterial color="#2C2C2C" />
        </Cylinder>
      </group>

      {/* Body (torso) */}
      <Box args={[0.8, 1, 0.4]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#4A5568" />
      </Box>

      {/* Arms */}
      <Cylinder args={[0.1, 0.1, 0.7, 16]} position={[-0.5, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#ffdbac" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.7, 16]} position={[0.5, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#ffdbac" />
      </Cylinder>

      {/* Laptop */}
      <group position={[0, 0.4, 0.4]} rotation={[-0.3, 0, 0]}>
        {/* Laptop base */}
        <Box args={[0.6, 0.02, 0.4]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Laptop screen */}
        <Box args={[0.6, 0.4, 0.02]} position={[0, 0.21, -0.19]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </Box>
        {/* Screen content (glowing) */}
        <Box args={[0.55, 0.35, 0.01]} position={[0, 0.21, -0.18]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" emissive="#4A90E2" emissiveIntensity={0.5} />
        </Box>
        {/* Banana logo on laptop */}
        <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Cone args={[0.08, 0.3, 8]} rotation={[0, 0, Math.PI / 6]}>
            <meshStandardMaterial color="#FFD93D" emissive="#FFD93D" emissiveIntensity={0.3} />
          </Cone>
        </group>
      </group>

      {/* Legs */}
      <Cylinder args={[0.12, 0.12, 0.8, 16]} position={[-0.2, -0.3, 0]}>
        <meshStandardMaterial color="#2C3E50" />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 0.8, 16]} position={[0.2, -0.3, 0]}>
        <meshStandardMaterial color="#2C3E50" />
      </Cylinder>
    </group>
  );
}
