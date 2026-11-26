// NusaData hand-in program (Node 22, standard library only).
//
// The site itself is the static app/ folder beside this file — plain HTML,
// CSS and ES modules with no build step, whose content lives entirely in
// its own files. This program does only the hand-in: it copies app/ and
// screenshots/ into the output directory and writes dossier.json there,
// using the vendored make.fun library (vendor/makefun-frontend.ts, kept
// byte for byte as the kit issued it — the scorer rebuilds the dossier
// with its own copy and compares the two byte for byte).
//
// In the grader the output directory is /output; outside it, set
// MAKEFUN_OUTPUT_DIR to a folder of your choice:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

const shots = join(repoRoot, 'screenshots');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shots)) {
  cpSync(shots, join(outputDir, 'screenshots'), { recursive: true });
}

// The limits below are the scorer's own (see the kit's gate description):
// at most 4 screenshots of 256 KiB each, at most 993 entries and 16 MiB in
// app/, and the dossier text capped at 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`NusaData handed in to ${outputDir} (${dossier.length} byte dossier)`);
