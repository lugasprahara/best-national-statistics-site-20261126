// NusaData hand-in program (Node 22, standard library only).
//
// The site itself is the static app/ folder beside this file — plain HTML,
// CSS and ES modules with no build step, whose content is entirely its own
// files. This program's only job is the hand-in: copy app/ and screenshots/
// into the output directory and write dossier.json there with the vendored
// make.fun library (vendor/makefun-frontend.ts, kept byte for byte as the
// kit issued it, because the scorer rebuilds the dossier with its own copy
// and compares the two).
//
// In the grader the output directory is /output; outside it, set
// MAKEFUN_OUTPUT_DIR to a folder of your choice:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
const shotsDir = join(repoDir, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// The caps passed here are the scorer's own (see the kit's gate description):
// at most 4 screenshots of 256 KiB each, at most 993 entries and 16 MiB in
// app/, and the dossier text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
