#!/usr/bin/env bun
/* Generates 1344×768 PNG covers for digest issues, in the Anthropic warm-cream
 * + coral brand vocabulary. Pure SVG shape compositions (no text — the cover
 * cards already overlay date/numeral dynamically), rasterized via sharp.
 *
 * Run: `bun run scripts/generate-digest-covers.ts`
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const W = 1344;
const H = 768;

const PALETTE = {
  paper: '#F0EBE0', // warm cream background
  paperDeep: '#E8E1D0', // darker cream for diptych / shadows
  coral: '#CC785C', // Anthropic primary clay/coral
  coralDeep: '#A85A40', // darker coral for layering
  ink: '#2C1810', // very dark warm brown for accents
};

type Spec = {
  date: string; // YYYY-MM-DD
};

const DATES: Spec[] = [
  '2026-05-16',
  '2026-05-17',
  '2026-05-18',
  '2026-05-19',
  '2026-05-20',
  '2026-05-21',
  '2026-05-22',
  '2026-05-23',
  '2026-05-24',
  '2026-05-25',
].map((d) => ({ date: d }));

type ArchetypeFn = () => string;

/* 10 archetype compositions — pure shapes, no text. */
const ARCHETYPES: ArchetypeFn[] = [
  // 1 — Tilted square, off-center
  () => `
    <rect x="380" y="120" width="560" height="560" fill="${PALETTE.coral}"
          transform="rotate(-8, 660, 400)" />
    <circle cx="980" cy="240" r="40" fill="${PALETTE.ink}" opacity="0.85" />
  `,
  // 2 — Half-arch (anchored to bottom)
  () => `
    <path d="M 200,768 L 200,420 A 472,420 0 0,1 1144,420 L 1144,768 Z"
          fill="${PALETTE.coral}" />
    <rect x="0" y="700" width="${W}" height="6" fill="${PALETTE.ink}" opacity="0.6" />
  `,
  // 3 — Full disc bleeding off right edge
  () => `
    <circle cx="1100" cy="384" r="480" fill="${PALETTE.coral}" />
    <circle cx="1100" cy="384" r="200" fill="${PALETTE.paper}" />
    <circle cx="1100" cy="384" r="80" fill="${PALETTE.coralDeep}" />
  `,
  // 4 — Diptych (vertical bars)
  () => `
    <rect x="0" y="0" width="448" height="${H}" fill="${PALETTE.paperDeep}" />
    <rect x="896" y="0" width="448" height="${H}" fill="${PALETTE.coral}" />
    <rect x="660" y="280" width="24" height="208" fill="${PALETTE.ink}" />
  `,
  // 5 — Stacked rules
  () =>
    Array.from({ length: 9 })
      .map((_, i) => {
        const y = 100 + i * 65;
        const w = 1100 - (i % 3) * 220;
        const x = i % 2 === 0 ? 120 : 220;
        const fill = i % 4 === 0 ? PALETTE.coralDeep : PALETTE.coral;
        return `<rect x="${x}" y="${y}" width="${w}" height="${i === 4 ? 36 : 14}" fill="${fill}" />`;
      })
      .join('\n'),
  // 6 — Eclipsed disc
  () => `
    <circle cx="600" cy="384" r="320" fill="${PALETTE.coral}" />
    <circle cx="780" cy="384" r="320" fill="${PALETTE.paper}" />
    <circle cx="780" cy="384" r="6" fill="${PALETTE.ink}" />
  `,
  // 7 — Off-grid triangle bleeding top
  () => `
    <polygon points="200,-100 1200,-100 700,640" fill="${PALETTE.coral}" />
    <polygon points="700,640 1100,800 300,800" fill="${PALETTE.coralDeep}" opacity="0.9" />
  `,
  // 8 — Soft blob
  () => `
    <path d="M 300,200
             C 500,80 900,120 1050,260
             S 1180,560 980,640
             S 540,720 360,600
             S 100,320 300,200 Z"
          fill="${PALETTE.coral}" />
    <circle cx="900" cy="430" r="40" fill="${PALETTE.paper}" />
  `,
  // 9 — Rotated rectangle (long bar at angle)
  () => `
    <rect x="-100" y="320" width="1544" height="130" fill="${PALETTE.coral}"
          transform="rotate(-12, 672, 384)" />
    <rect x="-100" y="320" width="1544" height="14" fill="${PALETTE.ink}"
          transform="rotate(-12, 672, 384)" opacity="0.4" />
  `,
  // 10 — Vertical bar grid
  () =>
    Array.from({ length: 7 })
      .map((_, i) => {
        const x = 140 + i * 160;
        const h = 200 + ((i * 113) % 380);
        const y = (H - h) / 2 + (i % 2 === 0 ? -20 : 20);
        const fill = i === 3 ? PALETTE.coralDeep : PALETTE.coral;
        return `<rect x="${x}" y="${y}" width="80" height="${h}" fill="${fill}" />`;
      })
      .join('\n'),
];

/** Deterministic archetype pick — uses day-of-month so the 10 dates 16..25
 *  receive 10 distinct compositions (no hash collisions). */
function pickArchetype(date: string): ArchetypeFn {
  const day = Number(date.slice(8, 10));
  return ARCHETYPES[day % ARCHETYPES.length];
}

/** Build the SVG string for a single cover. Inlines the paper-grain SVG as a
 *  base64 data URL so the rasterizer doesn't have to resolve the asset path. */
async function buildSvg(spec: Spec, grainDataUrl: string): Promise<string> {
  const archetype = pickArchetype(spec.date)();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${PALETTE.paper}" />

  <!-- Composition -->
  <g>${archetype}</g>

  <!-- Paper grain overlay -->
  <image
    href="${grainDataUrl}"
    x="0" y="0" width="${W}" height="${H}"
    preserveAspectRatio="xMidYMid slice"
    opacity="0.10"
    style="mix-blend-mode: multiply" />

  <!-- Outer vignette / paper edge -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="none"
        stroke="${PALETTE.ink}" stroke-width="1" opacity="0.04" />
</svg>`;
}

async function main() {
  const projectRoot = join(import.meta.dir, '..');
  const grainPath = join(projectRoot, 'public/textures/paper-grain.svg');
  const grainBuf = await fs.readFile(grainPath);
  const grainDataUrl = `data:image/svg+xml;base64,${grainBuf.toString('base64')}`;

  const outDir = join(projectRoot, 'public/digests');
  await fs.mkdir(outDir, { recursive: true });

  for (const spec of DATES) {
    const svg = await buildSvg(spec, grainDataUrl);
    const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
    const outPath = join(outDir, `cover-${spec.date}.png`);
    await fs.writeFile(outPath, png);
    console.log(`✓ ${outPath} (${(png.length / 1024).toFixed(0)} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
