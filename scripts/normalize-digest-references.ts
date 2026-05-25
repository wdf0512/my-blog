#!/usr/bin/env bun
/* One-shot fixer: converts `<details><summary>X</summary><ul>...</ul></details>`
 * blocks in a digest MDX file to plain markdown:
 *
 *     **X**:
 *
 *     - [title](url)
 *     - [title](url)
 *
 * The default MDX parser used by velite doesn't reliably handle the <details>
 * block when its contents are markdown — the existing successful digests use
 * plain bullets, so we conform. Run on each file via:
 *
 *     bun run scripts/normalize-digest-references.ts content/digests/foo.mdx
 */
import { promises as fs } from 'node:fs';
import { argv, exit } from 'node:process';

const RE_DETAILS = /<details><summary>([^<]+)<\/summary>\s*<ul>\s*([\s\S]*?)<\/ul>\s*<\/details>/g;
const RE_LI = /<li>\s*<a href="([^"]+)">([^<]*)<\/a>\s*<\/li>/g;

function transform(input: string): string {
  return input.replace(RE_DETAILS, (_match, summary: string, inner: string) => {
    const bullets: string[] = [];
    let m: RegExpExecArray | null;
    RE_LI.lastIndex = 0;
    while ((m = RE_LI.exec(inner)) !== null) {
      const [, href, text] = m;
      bullets.push(`- [${text.trim()}](${href})`);
    }
    if (bullets.length === 0) return '';
    return `**${summary.trim()}**:\n\n${bullets.join('\n')}`;
  });
}

async function main() {
  const files = argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: bun run scripts/normalize-digest-references.ts <file.mdx>...');
    exit(1);
  }
  for (const file of files) {
    const before = await fs.readFile(file, 'utf8');
    const after = transform(before);
    if (before === after) {
      console.log(`= ${file} (no changes)`);
      continue;
    }
    await fs.writeFile(file, after);
    const blocks = (before.match(RE_DETAILS) || []).length;
    console.log(`✓ ${file} — converted ${blocks} <details> blocks`);
  }
}

main().catch((err) => {
  console.error(err);
  exit(1);
});
