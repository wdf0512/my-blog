'use client';

import { useEffect, useRef } from 'react';

export function Character() {
  const preRef = useRef<HTMLPreElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!preRef.current) return;

    const pre = preRef.current;
    const width = 120;
    const height = 45;

    let rotationX = 0;
    let rotationY = 0;

    // Optimized character set for better shading
    const chars = ' .:!*oe&#%@';


    function render() {
      const output: string[] = [];
      const zbuffer: number[] = [];

      // Initialize buffers
      for (let i = 0; i < width * height; i++) {
        output[i] = ' ';
        zbuffer[i] = 0;
      }

      // Donut (torus) parameters
      const R1 = 1;    // Radius of the tube (small circle)
      const R2 = 2;    // Distance from center to tube center (big circle)
      const K2 = 5;    // Distance from viewer
      const K1 = width * K2 * 3 / (8 * (R1 + R2));  // Scale factor

      // Generate donut surface
      for (let theta = 0; theta < Math.PI * 2; theta += 0.07) {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        for (let phi = 0; phi < Math.PI * 2; phi += 0.02) {
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          // Calculate circle point before rotation
          const circleX = R2 + R1 * cosTheta;
          const circleY = R1 * sinTheta;

          // 3D coordinates
          const x = circleX * (cosPhi);
          const y = circleY;
          const z = circleX * (sinPhi);

          // Surface normal
          const nx = cosTheta * cosPhi;
          const ny = sinTheta;
          const nz = cosTheta * sinPhi;

          // Apply X-axis rotation
          const x1 = x;
          const y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
          const z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);

          // Apply Y-axis rotation
          const x2 = x1 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
          const y2 = y1;
          const z2 = -x1 * Math.sin(rotationY) + z1 * Math.cos(rotationY);

          // Rotate normals
          const nx1 = nx;
          const ny1 = ny * Math.cos(rotationX) - nz * Math.sin(rotationX);
          const nz1 = ny * Math.sin(rotationX) + nz * Math.cos(rotationX);

          const nx2 = nx1 * Math.cos(rotationY) + nz1 * Math.sin(rotationY);
          const ny2 = ny1;
          const nz2 = -nx1 * Math.sin(rotationY) + nz1 * Math.cos(rotationY);

          // Perspective projection
          const ooz = 1 / (z2 + K2);
          const xp = Math.floor(width / 2 + K1 * ooz * x2);
          const yp = Math.floor(height / 2 - K1 * ooz * y2);

          // Lighting calculation
          const luminance = ny2 * 0.5 + nz2 * 0.5;

          // Z-buffer test and render
          if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
            const idx = xp + yp * width;
            if (ooz > zbuffer[idx]) {
              zbuffer[idx] = ooz;
              const luminance_index = Math.floor((luminance + 1) * 5.5);
              output[idx] = luminance_index >= 0 && luminance_index < chars.length
                ? chars[Math.min(luminance_index, chars.length - 1)]
                : ' ';
            }
          }
        }
      }

      // Convert to string
      let result = '';
      for (let i = 0; i < height; i++) {
        result += output.slice(i * width, (i + 1) * width).join('') + '\n';
      }

      if (pre) {
        pre.textContent = result;
      }

      // Smooth dual-axis rotation
      rotationX += 0.03;
      rotationY += 0.02;

      frameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <pre
        ref={preRef}
        className="font-mono text-[0.4rem] md:text-[0.48rem] lg:text-[0.52rem] leading-[0.5] md:leading-[0.55] lg:leading-[0.58] select-none tracking-[-0.05em]"
        style={{
          color: '#D4A574',
          textShadow: '0 0 20px rgba(212, 165, 116, 0.5), 0 0 10px rgba(212, 165, 116, 0.3)',
        }}
      />
    </div>
  );
}
