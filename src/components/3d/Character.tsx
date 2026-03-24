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

    // Cubic Bézier curve: B(t) = (1-t)³P0 + 3(1-t)²t·P1 + 3(1-t)t²P2 + t³P3
    function bezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
      const t2 = t * t;
      const t3 = t2 * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3;
    }

    // Bézier tangent: B'(t) = 3(1-t)²(P1-P0) + 6(1-t)t(P2-P1) + 3t²(P3-P2)
    function bezierTangent(t: number, p0: number, p1: number, p2: number, p3: number): number {
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      return 3 * mt2 * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t2 * (p3 - p2);
    }

    // Normalize a 3D vector to unit length
    function normalize(x: number, y: number, z: number): [number, number, number] {
      const len = Math.sqrt(x * x + y * y + z * z);
      if (len < 0.0001) return [0, 1, 0]; // Fallback for zero vector
      return [x / len, y / len, z / len];
    }

    function render() {
      const output: string[] = [];
      const zbuffer: number[] = [];

      // Initialize buffers
      for (let i = 0; i < width * height; i++) {
        output[i] = ' ';
        zbuffer[i] = 0;
      }

      // Render capital letter D - vertical bar + curved part
      // The D is made of a vertical bar on the left and a semicircular arc on the right

      // Vertical bar of D
      for (let barY = -2; barY <= 2; barY += 0.1) {
        for (let theta = 0; theta < Math.PI * 2; theta += 0.2) {
          const barRadius = 0.3;
          const x = -1.5 + barRadius * Math.cos(theta);
          const y = barY;
          const z = barRadius * Math.sin(theta);

          // Apply Y-axis rotation
          const x2 = x * Math.cos(rotationY) + z * Math.sin(rotationY);
          const y2 = y;
          const z2 = -x * Math.sin(rotationY) + z * Math.cos(rotationY);

          // Perspective projection
          const K2 = 10;
          const K1 = 50;
          const ooz = 1 / (z2 + K2);

          const xp = Math.floor(width / 2 + K1 * ooz * x2);
          const yp = Math.floor(height / 2 - K1 * ooz * y2 * 0.5);

          // Surface normal
          const nx = Math.cos(theta);
          const ny = 0;
          const nz = Math.sin(theta);

          const nx2 = nx * Math.cos(rotationY) + nz * Math.sin(rotationY);
          const nz2 = -nx * Math.sin(rotationY) + nz * Math.cos(rotationY);

          const luminance = nx2 * 0.4 + ny * 0.3 + nz2 * 0.8;

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

      // Curved part of D (semicircle)
      for (let u = -Math.PI / 2; u <= Math.PI / 2; u += 0.04) {
        for (let v = 0; v < Math.PI * 2; v += 0.1) {
          const majorRadius = 2.0;
          const tubeRadius = 0.3;

          const cx = majorRadius * Math.cos(u);
          const cy = majorRadius * Math.sin(u);

          const x = cx + tubeRadius * Math.cos(v) * Math.cos(u);
          const y = cy + tubeRadius * Math.sin(v);
          const z = tubeRadius * Math.cos(v) * Math.sin(u);

          // Apply Y-axis rotation (vertical axis - 360° spin)
          const x2 = x * Math.cos(rotationY) + z * Math.sin(rotationY);
          const y2 = y;
          const z2 = -x * Math.sin(rotationY) + z * Math.cos(rotationY);

          // Perspective projection
          const K2 = 10; // Distance from viewer
          const K1 = 50; // Scaling factor
          const ooz = 1 / (z2 + K2);

          const xp = Math.floor(width / 2 + K1 * ooz * x2);
          const yp = Math.floor(height / 2 - K1 * ooz * y2 * 0.5);

          // Calculate surface normal for curved part
          const nx = Math.cos(v) * Math.cos(u);
          const ny = Math.sin(v);
          const nz = Math.cos(v) * Math.sin(u);

          // Rotate normal with Y rotation
          const nx2 = nx * Math.cos(rotationY) + nz * Math.sin(rotationY);
          const ny2 = ny;
          const nz2 = -nx * Math.sin(rotationY) + nz * Math.cos(rotationY);

          // Lighting
          const luminance = nx2 * 0.4 + ny2 * 0.3 + nz2 * 0.8;

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
          color: '#F2C94C',
          textShadow: '0 0 20px rgba(242, 201, 76, 0.5), 0 0 10px rgba(242, 201, 76, 0.3)',
        }}
      />
    </div>
  );
}
