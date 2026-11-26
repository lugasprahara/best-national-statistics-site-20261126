// NusaData hand-in program (Node 22, standard library only).
//
// The site itself is the static app/ folder beside this file. This program
// is what hands it in: it copies app/ and screenshots/ into the output
// directory and writes dossier.json there with the vendored make.fun
// library (vendor/makefun-frontend.ts, kept byte for byte as the kit
// ships it, because the scorer rebuilds the dossier with its own copy
// and compares).
//
// In the grader the output directory is /output; locally it is whatever
// MAKEFUN_OUTPUT_DIR names:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: two runs over the same repository write
// the same bytes.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's published caps for this competition: the dossier text is
// cut at 160 KiB, at most 4 screenshots of at most 256 KiB each, and app/
// holds at most 993 entries and 16 MiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function repoRoot(): string {
  return fileURLToPath(new URL('.', import.meta.url));
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

function copyInto(from: string, to: string): number {
  if (!existsSync(from)) return 0;
  cpSync(from, to, { recursive: true });
  return readdirSync(to, { recursive: true }).length;
}

function main(): void {
  const root = repoRoot();
  const out = outputDir();
  mkdirSync(out, { recursive: true });

  const appFiles = copyInto(join(root, 'app'), join(out, 'app'));
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  const shots = copyInto(join(root, 'screenshots'), join(out, 'screenshots'));

  const dossier = buildDossier(out, CAPS);
  writeFileSync(join(out, 'dossier.json'), dossier);

  console.log(`NusaData handed in: ${appFiles} app entries, ${shots} screenshots, dossier ${dossier.length} bytes -> ${out}`);
}

main();
