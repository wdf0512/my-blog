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

      // Banana Bézier curve control points (based on ASCII art analysis)
      const p0 = { x: -2, y: 2, z: 0 };    // Stem end
      const p1 = { x: -1, y: 1, z: 0 };    // Stem curve control
      const p2 = { x: 1, y: -1, z: 0 };    // Body curve control
      const p3 = { x: 2, y: -2, z: 0 };    // Tip end

      // Generate banana surface using Bézier spine with circular cross-sections
      for (let t = 0; t <= 1; t += 0.05) {
        // Calculate spine point from Bézier curve
        const spineX = bezier(t, p0.x, p1.x, p2.x, p3.x);
        const spineY = bezier(t, p0.y, p1.y, p2.y, p3.y);
        const spineZ = bezier(t, p0.z, p1.z, p2.z, p3.z);

        // Calculate tangent vector (derivative of Bézier curve)
        const tangentX = bezierTangent(t, p0.x, p1.x, p2.x, p3.x);
        const tangentY = bezierTangent(t, p0.y, p1.y, p2.y, p3.y);
        const tangentZ = bezierTangent(t, p0.z, p1.z, p2.z, p3.z);

        const [tanX, tanY, tanZ] = normalize(tangentX, tangentY, tangentZ);

        // Calculate radius at this point (thick in middle, thin at ends)
        const radius = 0.15 + 0.25 * Math.sin(Math.PI * t);

        // Create perpendicular basis vectors for circular cross-section
        // Use world up vector [0, 1, 0] to create first perpendicular
        let perpX = tanY;
        let perpY = -tanX;
        let perpZ = 0;
        [perpX, perpY, perpZ] = normalize(perpX, perpY, perpZ);

        // Second perpendicular is cross product of tangent and first perp
        let perp2X = tanY * perpZ - tanZ * perpY;
        let perp2Y = tanZ * perpX - tanX * perpZ;
        let perp2Z = tanX * perpY - tanY * perpX;
        [perp2X, perp2Y, perp2Z] = normalize(perp2X, perp2Y, perp2Z);

        // Generate circular cross-section
        for (let v = 0; v < Math.PI * 2; v += 0.2) {
          const cosV = Math.cos(v);
          const sinV = Math.sin(v);

          // Surface point on circle
          const x = spineX + radius * (cosV * perpX + sinV * perp2X);
          const y = spineY + radius * (cosV * perpY + sinV * perp2Y);
          const z = spineZ + radius * (cosV * perpZ + sinV * perp2Z);

          // Surface normal (points radially outward from spine)
          const [nx, ny, nz] = normalize(
            cosV * perpX + sinV * perp2X,
            cosV * perpY + sinV * perp2Y,
            cosV * perpZ + sinV * perp2Z
          );

          // Apply X-axis rotation
          const y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
          const z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);
          const x1 = x;

          // Apply Y-axis rotation
          const x2 = x1 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
          const y2 = y1;
          const z2 = -x1 * Math.sin(rotationY) + z1 * Math.cos(rotationY);

          // Rotate normal vectors same way
          const ny1 = ny * Math.cos(rotationX) - nz * Math.sin(rotationX);
          const nz1 = ny * Math.sin(rotationX) + nz * Math.cos(rotationX);
          const nx1 = nx;

          const nx2 = nx1 * Math.cos(rotationY) + nz1 * Math.sin(rotationY);
          const ny2 = ny1;
          const nz2 = -nx1 * Math.sin(rotationY) + nz1 * Math.cos(rotationY);

          // Perspective projection
          const K2 = 10;
          const K1 = 50;
          const ooz = 1 / (z2 + K2);

          const xp = Math.floor(width / 2 + K1 * ooz * x2);
          const yp = Math.floor(height / 2 - K1 * ooz * y2 * 0.5);

          // Lighting calculation
          const luminance = nx2 * 0.4 + ny2 * 0.3 + nz2 * 0.8;

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
          color: '#F2C94C',
          textShadow: '0 0 20px rgba(242, 201, 76, 0.5), 0 0 10px rgba(242, 201, 76, 0.3)',
        }}
      />
    </div>
  );
}
