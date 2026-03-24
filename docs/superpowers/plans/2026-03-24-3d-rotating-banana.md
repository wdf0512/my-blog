# 3D Rotating Banana Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3D rotating "D" with a procedurally-generated 3D banana using Bézier curve geometry and dual-axis rotation (donut.c style).

**Architecture:** Modify Character.tsx to generate banana geometry using cubic Bézier spine with circular cross-sections. Apply dual-axis rotation (X and Y) with different speeds for organic wobble. Use same z-buffering, perspective projection, and ASCII shading as current implementation.

**Tech Stack:** React, TypeScript, Next.js (client component), requestAnimationFrame, 3D mathematics (Bézier curves, rotation matrices, perspective projection)

**Reference Spec:** `docs/superpowers/specs/2026-03-24-3d-rotating-banana-design.md`

---

## File Structure

**Modified Files:**
- `src/components/3d/Character.tsx` - Replace "D" geometry with banana geometry, add dual-axis rotation

**Unchanged Files:**
- `src/components/3d/HeroScene.tsx` - Wrapper remains identical
- `src/components/3d/HeroSceneLoader.tsx` - Loading state remains identical

**Reference Files:**
- `public/design/ascii-art.txt` - Source banana shape for visual reference

---

## Task 1: Set Up Dual-Axis Rotation Infrastructure

**Files:**
- Modify: `src/components/3d/Character.tsx:16,141`

- [ ] **Step 1: Add rotationX variable alongside rotationY**

In the render function closure (after line 16), change from single rotation to dual rotation:

```typescript
let rotationX = 0;
let rotationY = 0;
```

- [ ] **Step 2: Update rotation increments at end of render function**

Replace the single rotation increment (line 141) with dual-axis increments:

```typescript
// Smooth dual-axis rotation
rotationX += 0.03;
rotationY += 0.02;
```

- [ ] **Step 3: Verify rotation variables initialize**

Run dev server: `bun dev`
Open browser, check Console for errors
Expected: No errors, animation still runs (D still renders)

- [ ] **Step 4: Commit rotation infrastructure**

```bash
git add src/components/3d/Character.tsx
git commit -m "feat: add dual-axis rotation variables for banana

Add rotationX and rotationY with different increment rates
(0.03 and 0.02) to create organic wobble effect.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Implement Bézier Curve Utilities

**Files:**
- Modify: `src/components/3d/Character.tsx:19-21` (add utility functions before render function)

- [ ] **Step 1: Add Bézier curve evaluation function**

Add this function inside the useEffect, before the render function:

```typescript
// Cubic Bézier curve: B(t) = (1-t)³P0 + 3(1-t)²t·P1 + 3(1-t)t²P2 + t³P3
function bezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3;
}
```

- [ ] **Step 2: Add Bézier tangent (derivative) function**

Add after the bezier function:

```typescript
// Bézier tangent: B'(t) = 3(1-t)²(P1-P0) + 6(1-t)t(P2-P1) + 3t²(P3-P2)
function bezierTangent(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  return 3 * mt2 * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t2 * (p3 - p2);
}
```

- [ ] **Step 3: Add vector normalization utility**

Add after bezierTangent:

```typescript
// Normalize a 3D vector to unit length
function normalize(x: number, y: number, z: number): [number, number, number] {
  const len = Math.sqrt(x * x + y * y + z * z);
  if (len < 0.0001) return [0, 1, 0]; // Fallback for zero vector
  return [x / len, y / len, z / len];
}
```

- [ ] **Step 4: Test utility functions compile**

Check dev server (should hot-reload)
Expected: No TypeScript errors, page still renders

- [ ] **Step 5: Commit Bézier utilities**

```bash
git add src/components/3d/Character.tsx
git commit -m "feat: add Bézier curve math utilities

Add bezier(), bezierTangent(), and normalize() functions
for generating banana spine curve and tangent vectors.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Implement Banana Geometry Generation

**Files:**
- Modify: `src/components/3d/Character.tsx:31-128` (replace D geometry with banana)

- [ ] **Step 1: Define banana Bézier control points**

In render function, after buffer initialization (around line 29), add control points:

```typescript
// Banana Bézier curve control points (based on ASCII art analysis)
const p0 = { x: -2, y: 2, z: 0 };    // Stem end
const p1 = { x: -1, y: 1, z: 0 };    // Stem curve control
const p2 = { x: 1, y: -1, z: 0 };    // Body curve control
const p3 = { x: 2, y: -2, z: 0 };    // Tip end
```

- [ ] **Step 2: Remove old "D" geometry code**

Delete lines 34-128 (vertical bar and curved part of D)
Keep buffer initialization and final string conversion

- [ ] **Step 3: Implement banana surface generation loop**

Replace the deleted D geometry with banana generation:

```typescript
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
```

- [ ] **Step 4: Verify banana renders**

Check browser (should hot-reload)
Expected: See a curved 3D shape rotating with dual-axis wobble
Note: May need shape refinement, but should be clearly curved and rotating

- [ ] **Step 5: Commit banana geometry**

```bash
git add src/components/3d/Character.tsx
git commit -m "feat: implement 3D banana geometry with Bézier curves

Replace D geometry with banana using cubic Bézier spine and
circular cross-sections. Generates surface points with varying
radius (thick middle, thin ends) and applies dual-axis rotation.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Refine Banana Shape to Match ASCII Art

**Files:**
- Modify: `src/components/3d/Character.tsx` (Bézier control points)
- Reference: `public/design/ascii-art.txt`

- [ ] **Step 1: Open ASCII art for visual comparison**

```bash
cat public/design/ascii-art.txt
```

Compare the curve of the ASCII banana with the rendered 3D banana.

- [ ] **Step 2: Adjust Bézier control points iteratively**

Looking at the ASCII art, the banana curves from upper-left to lower-right with a gentle arc.

Try these refined control points (adjust the p0-p3 definitions):

```typescript
// Refined control points for better curve match
const p0 = { x: -2.2, y: 2.5, z: 0 };    // Stem end (adjusted)
const p1 = { x: -0.8, y: 1.2, z: 0 };    // Stem curve control
const p2 = { x: 0.8, y: -1.2, z: 0 };    // Body curve control
const p3 = { x: 2.2, y: -2.5, z: 0 };    // Tip end (adjusted)
```

Save and observe. If curve doesn't match well, continue adjusting.

**Iteration guidance:**
- Moving P1 changes the stem curve steepness
- Moving P2 changes the body curve steepness
- Moving P0/P3 changes the endpoints
- Adjust Y values to match vertical span
- Adjust X values to match horizontal span

- [ ] **Step 3: Fine-tune radius function if needed**

If banana appears too thick or thin, adjust radius formula:

```typescript
// Try different radius multipliers
const radius = 0.15 + 0.3 * Math.sin(Math.PI * t);  // Slightly thicker
// or
const radius = 0.15 + 0.2 * Math.sin(Math.PI * t);  // Slightly thinner
```

- [ ] **Step 4: Verify banana shape is recognizable**

Check browser from multiple rotation angles
Expected: Clearly recognizable as a banana (curved, tapered at ends)

- [ ] **Step 5: Commit shape refinements**

```bash
git add src/components/3d/Character.tsx
git commit -m "refine: adjust banana Bézier curve to match ASCII art

Fine-tune control points and radius function to better match
the banana shape from ascii-art.txt.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Performance Optimization

**Files:**
- Modify: `src/components/3d/Character.tsx` (render function)

- [ ] **Step 1: Pre-calculate rotation sine/cosine values**

At the start of the render function, after initializing buffers, add:

```typescript
// Pre-calculate rotation values (used many times in loops)
const cosX = Math.cos(rotationX);
const sinX = Math.sin(rotationX);
const cosY = Math.cos(rotationY);
const sinY = Math.sin(rotationY);
```

- [ ] **Step 2: Replace Math.cos/sin calls with pre-calculated values**

In the banana generation loop, replace:
- `Math.cos(rotationX)` with `cosX`
- `Math.sin(rotationX)` with `sinX`
- `Math.cos(rotationY)` with `cosY`
- `Math.sin(rotationY)` with `sinY`

Example transformation:
```typescript
// Before:
const y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);

// After:
const y1 = y * cosX - z * sinX;
```

- [ ] **Step 3: Test performance in browser**

Open DevTools → Performance tab → Record for 5 seconds
Expected: Smooth 60 FPS, no dropped frames
Check CPU usage is reasonable (<50% on modern devices)

- [ ] **Step 4: Verify animation still renders correctly**

Check browser, ensure banana still rotates smoothly
Expected: No visual changes, just performance improvement

- [ ] **Step 5: Commit performance optimization**

```bash
git add src/components/3d/Character.tsx
git commit -m "perf: pre-calculate rotation trigonometry values

Extract cos/sin calculations outside loops to avoid redundant
computation. Called once per frame instead of ~640 times.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Visual Quality Verification

**Files:**
- Test: Browser visual inspection, DevTools performance testing

- [ ] **Step 1: Verify banana shape from multiple angles**

Watch the banana rotate through full 360° cycles
Check list:
- [ ] Recognizable as banana from all angles
- [ ] Smooth curve (no sharp edges or gaps)
- [ ] Proper tapering (thick middle, thin ends)
- [ ] Stem end and tip end distinguishable

- [ ] **Step 2: Verify dual-axis rotation effect**

Observe the wobble motion
Check list:
- [ ] Rotates around both X and Y axes
- [ ] Motion appears organic (not mechanical)
- [ ] Different rotation speeds create Lissajous pattern
- [ ] No jittering or stuttering

- [ ] **Step 3: Verify shading and depth**

Check the ASCII character shading
Check list:
- [ ] Highlights shift across surface as it rotates
- [ ] Dark/light contrast creates 3D depth perception
- [ ] No missing pixels or "holes" in surface
- [ ] Z-buffering works (closer parts occlude farther parts)

- [ ] **Step 4: Verify styling and presentation**

Check list:
- [ ] Yellow color (#F2C94C) displays correctly
- [ ] Glow effect visible and appealing
- [ ] Responsive sizing works on mobile/tablet/desktop
- [ ] Centers properly in container
- [ ] Loading state shows before animation starts

- [ ] **Step 5: Cross-browser testing**

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Mobile Safari or Chrome (check mobile responsiveness)

Expected: Consistent rendering across all browsers

---

## Task 7: Performance Validation

**Files:**
- Test: DevTools Performance profiling

- [ ] **Step 1: Measure frame rate**

Open DevTools → Performance → Enable "Show frames per second (FPS) chart"
Record for 10 seconds while animation runs
Expected: Consistent 60 FPS with minimal drops

- [ ] **Step 2: Check CPU usage**

In Performance recording, examine Main thread activity
Expected:
- Smooth sawtooth pattern (requestAnimationFrame cycles)
- No long tasks (>50ms)
- Low CPU usage (<50% on modern desktop)

- [ ] **Step 3: Test on slower device (if available)**

Test on older device or throttle CPU (DevTools → Performance → CPU: 4x slowdown)
Expected: Still maintains ~30 FPS minimum (acceptable on slow devices)

- [ ] **Step 4: Check memory usage**

DevTools → Memory → Take heap snapshot while animation runs
Run for 2 minutes, take another snapshot
Expected: No significant memory growth (no memory leaks)

- [ ] **Step 5: Document performance metrics**

Create performance summary:
```
Performance Metrics (3D Rotating Banana):
- Desktop (Modern): 60 FPS, ~10% CPU
- Mobile (4x throttled): 30-45 FPS, ~25% CPU
- Memory: Stable at ~1-2MB (no leaks)
- Points per frame: ~640 (20 spine samples × 32 circle points)
```

---

## Task 8: Final Integration Testing

**Files:**
- Test: Full page integration, responsive design, production build

- [ ] **Step 1: Test in full page context**

Navigate to homepage where HeroScene is displayed
Check list:
- [ ] Banana loads and animates immediately
- [ ] No layout shifts or jank during load
- [ ] Integrates well with surrounding content
- [ ] No console errors or warnings

- [ ] **Step 2: Test responsive breakpoints**

Resize browser window through all breakpoints:
- Mobile (<768px)
- Tablet (768px-1024px)
- Desktop (>1024px)

Expected:
- Font sizes scale appropriately
- Container height adjusts (400px → 500px)
- Animation quality maintained at all sizes

- [ ] **Step 3: Test with reduced motion preference**

Note: Current implementation doesn't respect prefers-reduced-motion.
This is acceptable for MVP (matches current behavior).

Future enhancement: Could add motion detection and show static banana.

- [ ] **Step 4: Build and test production bundle**

```bash
bun run build
bun run start
```

Open http://localhost:3000
Expected: Banana renders identically to dev mode, no build errors

- [ ] **Step 5: Final commit and summary**

```bash
git add -A
git commit -m "test: verify 3D banana implementation complete

All visual quality, performance, and integration tests passed.
Banana shape matches ASCII art, dual-axis rotation working,
60 FPS performance maintained, cross-browser compatible.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Success Criteria Checklist

After completing all tasks, verify these criteria from the spec:

- [ ] ✅ Rotating 3D banana is clearly recognizable as a banana
- [ ] ✅ Smooth dual-axis rotation without stutter
- [ ] ✅ Maintains 60 FPS performance on modern devices
- [ ] ✅ Curve approximates ASCII art banana shape
- [ ] ✅ Visual quality matches or exceeds current "D" implementation
- [ ] ✅ Zero breaking changes to other components (HeroScene, HeroSceneLoader unchanged)

---

## Rollback Plan

If issues arise during implementation:

```bash
# Revert to previous working state
git log --oneline  # Find commit before banana implementation
git revert <commit-hash>..HEAD  # Revert all banana commits
```

Or restore the "D" implementation:
```bash
git checkout HEAD~N -- src/components/3d/Character.tsx  # N = number of commits back
```

---

## Notes for Implementer

**Mathematical Debugging:**
- If banana appears inside-out, flip normal vectors (multiply nx, ny, nz by -1)
- If banana appears flat, increase radius multiplier
- If curve is wrong, adjust P1/P2 control points (P0/P3 are endpoints)

**Performance Debugging:**
- If FPS drops below 30, reduce sample density (increase t increment from 0.05 to 0.07)
- If FPS drops below 30, reduce circle points (increase v increment from 0.2 to 0.3)

**Visual Debugging:**
- Console.log a few (x2, y2, z2) values to verify coordinates are reasonable
- Temporarily disable z-buffer to see all surface points (will look glitchy but helps debug)

**Testing Note:**
This is visual/animation code without traditional unit tests. Verification is done through:
1. Visual inspection (does it look like a banana?)
2. Performance metrics (does it run smoothly?)
3. Integration testing (does it work in the page?)

This is appropriate for this type of code.
