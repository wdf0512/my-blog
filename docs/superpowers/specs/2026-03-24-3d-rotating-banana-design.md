# 3D Rotating Banana Design Specification

**Date:** 2026-03-24
**Status:** Design Approved
**Author:** Claude (with user direction)

## Overview

Replace the existing 3D rotating "D" letter with a procedurally-generated 3D banana that rotates continuously using dual-axis rotation, inspired by the classic donut.c algorithm. The banana geometry will be modeled to match the shape shown in `/public/design/ascii-art.txt`.

## Goals

1. Generate a 3D banana using parametric geometry (Bézier curve spine with circular cross-sections)
2. Implement dual-axis rotation (X and Y axes) for dynamic wobble effect
3. Maintain the same rendering quality and performance as the current 3D "D"
4. Keep the existing component structure and styling
5. Match the banana curve from the ASCII art file as closely as possible

## Non-Goals

- Static ASCII art display with simple flipping (this was considered but user chose 3D generation)
- Manual animation or frame-based approaches
- Changes to HeroScene or HeroSceneLoader components
- Interactive controls (rotation is automatic and continuous)

## Technical Approach

### Architecture

The solution maintains the existing three-component structure:
- **Character.tsx** - Main component containing render loop and 3D mathematics
- **HeroScene.tsx** - Wrapper component (unchanged)
- **HeroSceneLoader.tsx** - Dynamic loader with loading state (unchanged)

### Banana Geometry Model

**Bézier Curve Spine:**
The banana's centerline is defined using a cubic Bézier curve with 4 control points:
- P0: Stem end `(-2, 2, 0)` - top-left of banana
- P1: Stem curve control `(-1, 1, 0)` - upper arc guide
- P2: Body curve control `(1, -1, 0)` - lower arc guide
- P3: Tip end `(2, -2, 0)` - bottom-right of banana

The curve is sampled using parameter `t` from 0 to 1 in increments of ~0.05.

Bézier curve formula:
```
B(t) = (1-t)³P0 + 3(1-t)²t·P1 + 3(1-t)t²P2 + t³P3
```

**Tangent Calculation:**
The tangent vector at each point (needed for perpendicular cross-sections):
```
B'(t) = 3(1-t)²(P1-P0) + 6(1-t)t(P2-P1) + 3t²(P3-P2)
```

**Cross-Section Circles:**
At each spine point, generate a circular cross-section perpendicular to the tangent. The radius varies to create natural banana tapering:

```javascript
radius(t) = 0.15 + 0.25 * Math.sin(Math.PI * t)
```

This creates:
- Stem (t=0): radius ≈ 0.15 (thin)
- Mid-body (t=0.5): radius ≈ 0.4 (thick)
- Tip (t=1): radius ≈ 0.15 (thin, pointed)

**Surface Point Generation:**
For each spine point with tangent T and radius r:
1. Calculate two perpendicular vectors to T (using cross products with world up vector)
2. Sample circle angle `v` from 0 to 2π in increments of ~0.2
3. Generate surface point: `spine_point + r * (cos(v) * perp1 + sin(v) * perp2)`

### Dual-Axis Rotation

**Rotation State:**
```javascript
let rotationX = 0;  // Rotation around X-axis (horizontal)
let rotationY = 0;  // Rotation around Y-axis (vertical)
```

**Rotation Increments per Frame:**
```javascript
rotationX += 0.03;  // Slightly faster tumble
rotationY += 0.02;  // Slightly slower spin
```

Different speeds create organic wobble, preventing predictable repetition.

**Transformation Order:**
For each 3D point `(x, y, z)`:

1. Apply X-axis rotation:
```javascript
const y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
const z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);
const x1 = x;
```

2. Apply Y-axis rotation:
```javascript
const x2 = x1 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
const y2 = y1;
const z2 = -x1 * Math.sin(rotationY) + z1 * Math.cos(rotationY);
```

3. Perspective projection (see Rendering Pipeline section)

### Lighting and Shading

**Surface Normal Calculation:**
For each surface point on the circular cross-section, the normal vector points radially outward from the spine:
```
normal = normalize(surface_point - spine_point)
```

**Normal Transformation:**
Apply same rotation matrices to normals:
1. Rotate normal by rotationX
2. Rotate result by rotationY

**Luminance Calculation:**
```javascript
const luminance = nx * 0.4 + ny * 0.3 + nz * 0.8;
```

Where `(nx, ny, nz)` is the rotated normal. This creates directional lighting with emphasis toward viewer and slightly upward.

**Character Mapping:**
```javascript
const chars = ' .:!*oe&#%@';
const luminance_index = Math.floor((luminance + 1) * 5.5);
const char = chars[Math.min(luminance_index, chars.length - 1)];
```

Maps luminance range [-1, 1] to character indices [0, 10]:
- Space: darkest/background
- `.` `:` `!`: shadows
- `*` `o` `e`: mid-tones
- `&` `#` `%` `@`: highlights

### Rendering Pipeline

**Frame Rendering Process:**

1. **Initialize Buffers**
```javascript
const width = 120;
const height = 45;
const output = new Array(width * height).fill(' ');
const zbuffer = new Array(width * height).fill(0);
```

2. **Generate Banana Surface**
```javascript
for (let t = 0; t <= 1; t += 0.05) {
  // Calculate spine point from Bézier curve
  // Calculate tangent vector
  // Calculate radius at t
  // Generate perpendicular basis vectors

  for (let v = 0; v < Math.PI * 2; v += 0.2) {
    // Generate surface point
    // Calculate surface normal
    // Apply dual-axis rotations
    // Project to 2D
    // Z-buffer test and render
  }
}
```

3. **Perspective Projection**
```javascript
const K1 = 50;  // Scaling factor
const K2 = 10;  // Distance from viewer
const ooz = 1 / (z2 + K2);
const xp = Math.floor(width / 2 + K1 * ooz * x2);
const yp = Math.floor(height / 2 - K1 * ooz * y2 * 0.5);
```

4. **Z-Buffering and Character Selection**
```javascript
if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
  const idx = xp + yp * width;
  if (ooz > zbuffer[idx]) {
    zbuffer[idx] = ooz;
    output[idx] = getCharacterForLuminance(luminance);
  }
}
```

5. **Convert to String and Display**
```javascript
let result = '';
for (let i = 0; i < height; i++) {
  result += output.slice(i * width, (i + 1) * width).join('') + '\n';
}
pre.textContent = result;
```

6. **Update and Loop**
```javascript
rotationX += 0.03;
rotationY += 0.02;
frameRef.current = requestAnimationFrame(render);
```

### Component Implementation

**Character.tsx Structure:**

```typescript
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

    const chars = ' .:!*oe&#%@';

    function render() {
      // Implementation as described in Rendering Pipeline
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
```

**Unchanged Components:**
- `HeroScene.tsx` - No modifications required
- `HeroSceneLoader.tsx` - No modifications required

### Visual Styling

**Color Scheme (Banana Yellow):**
- Text color: `#F2C94C`
- Glow effect: `0 0 20px rgba(242, 201, 76, 0.5), 0 0 10px rgba(242, 201, 76, 0.3)`

**Responsive Typography:**
- Mobile: `0.4rem` font, `0.5` line-height
- Tablet: `0.48rem` font, `0.55` line-height
- Desktop: `0.52rem` font, `0.58` line-height
- Letter spacing: `-0.05em` (tight for compact ASCII)

**Layout:**
- Container: `w-full h-[400px] md:h-[500px]`
- Centered with flexbox
- Non-selectable text (`select-none`)

## Performance Considerations

**Computational Complexity:**
- Bézier curve: ~20 samples (t = 0 to 1, increment 0.05)
- Circle points per sample: ~32 points (v = 0 to 2π, increment 0.2)
- Total points per frame: ~640 3D points
- This is comparable to current "D" implementation

**Optimization Strategies:**
- Pre-calculate constant values outside loops
- Use `Math.floor` only when needed for array indexing
- Reuse rotation sine/cosine values
- Single string concatenation at end (not per-line)

**Expected Performance:**
- 60 FPS on modern devices
- Graceful degradation on slower devices
- Same performance profile as existing "D" animation

## Testing Approach

**Visual Verification:**
1. Banana shape recognizability from front view
2. Smooth rotation without jitter
3. Proper depth perception (z-buffering working)
4. Consistent shading across rotation
5. No visual artifacts or gaps

**Technical Verification:**
1. Animation starts immediately on mount
2. Animation stops cleanly on unmount (no memory leaks)
3. Responsive sizing works across breakpoints
4. Yellow color and glow effect render correctly
5. Performance maintains 60 FPS target

**Cross-Browser Testing:**
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## Rollout Plan

1. Implement new Character.tsx with banana geometry
2. Verify rendering in local development
3. Fine-tune Bézier control points to match ASCII art shape
4. Adjust rotation speeds if wobble feels too fast/slow
5. Performance test on various devices
6. Deploy to production (no breaking changes)

## Future Enhancements (Out of Scope)

- Interactive rotation control (mouse/touch drag)
- Configurable rotation speed
- Different fruit options
- Color scheme variations
- Accessibility: reduced motion preference support

## Risks and Mitigations

**Risk:** Banana shape doesn't match ASCII art well
**Mitigation:** Iterative tuning of Bézier control points, may need 5-6 points instead of 4 for more complex curve

**Risk:** Dual-axis rotation causes motion sickness
**Mitigation:** Keep rotation speeds moderate (0.02-0.03), test with users

**Risk:** Performance issues on mobile
**Mitigation:** Same geometry complexity as current "D", already proven performant

**Risk:** Mathematical errors in Bézier or rotation matrices
**Mitigation:** Reference classic donut.c implementation, use proven formulas

## Success Criteria

1. ✅ Rotating 3D banana is clearly recognizable as a banana
2. ✅ Smooth dual-axis rotation without stutter
3. ✅ Maintains 60 FPS performance
4. ✅ Curve approximates ASCII art banana shape
5. ✅ Visual quality matches or exceeds current "D" implementation
6. ✅ Zero breaking changes to other components

## References

- Classic donut.c: https://www.a1k0n.net/2011/07/20/donut-math.html
- Bézier curve mathematics: Standard cubic Bézier formulas
- ASCII art source: `/public/design/ascii-art.txt`
- Current implementation: `src/components/3d/Character.tsx` (rotating "D")
