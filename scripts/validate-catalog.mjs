import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import sharp from 'sharp';

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), '..');
const packageRoot = join(projectRoot, 'packages', 'workout-guide');
const manifest = JSON.parse(await readFile(join(packageRoot, 'manifest.json'), 'utf8'));
const zhCN = JSON.parse(await readFile(join(packageRoot, 'locales', 'zh-CN.json'), 'utf8'));

if (manifest.length !== 302) throw new Error(`Expected 302 exercises, found ${manifest.length}.`);
if (new Set(manifest.map((item) => item.id)).size !== 302) throw new Error('Exercise IDs are not unique.');
if (new Set(manifest.map((item) => item.slug)).size !== 302) throw new Error('Exercise slugs are not unique.');

function assertExactKeys(values, translations, label) {
  const expected = new Set(values);
  const actual = new Set(Object.keys(translations));
  const missing = [...expected].filter((value) => !actual.has(value));
  const unknown = [...actual].filter((value) => !expected.has(value));
  if (missing.length || unknown.length) {
    throw new Error(`${label} translations are incomplete. Missing: ${missing.join(', ') || 'none'}. Unknown: ${unknown.join(', ') || 'none'}.`);
  }
}

assertExactKeys(manifest.map((item) => item.id), zhCN.exerciseNames, 'Exercise name');
assertExactKeys([...new Set(manifest.map((item) => item.equipment))], zhCN.labels.equipment, 'Equipment');
assertExactKeys(
  [...new Set(manifest.flatMap((item) => [item.primaryMuscle, ...item.secondaryMuscles]))],
  zhCN.labels.muscles,
  'Muscle',
);
assertExactKeys([...new Set(manifest.map((item) => item.exerciseType))], zhCN.labels.exerciseTypes, 'Exercise type');

for (const [id, name] of Object.entries(zhCN.exerciseNames)) {
  if (typeof name !== 'string' || !/[\u3400-\u9fff]/.test(name)) {
    throw new Error(`${id} must have a Chinese exercise name.`);
  }
}

for (const [id, aliases] of Object.entries(zhCN.aliases)) {
  if (!manifest.some((item) => item.id === id) || !Array.isArray(aliases) || aliases.some((alias) => typeof alias !== 'string' || !alias.trim())) {
    throw new Error(`Invalid zh-CN aliases for ${id}.`);
  }
}

let frameCount = 0;
let sourcedCount = 0;
let sourcedFrameCount = 0;
for (const exercise of manifest) {
  if (exercise.frames.length !== 3) throw new Error(`${exercise.id} does not have three frames.`);
  if (exercise.attribution?.source) sourcedCount += 1;
  for (const [offset, frame] of exercise.frames.entries()) {
    if (frame.index !== offset + 1) throw new Error(`${exercise.id} frame order is invalid.`);
    if (frame.attribution?.creator !== 'Bryl Lim' || frame.attribution?.license !== 'CC BY-SA 4.0') {
      throw new Error(`${exercise.id} frame ${frame.index} has incomplete attribution.`);
    }
    if (frame.attribution.source) sourcedFrameCount += 1;
    const path = join(packageRoot, frame.path);
    await access(path);
    const metadata = await sharp(path).metadata();
    if (metadata.width !== 512 || metadata.height !== 512 || metadata.format !== 'svg' || !metadata.hasAlpha) {
      throw new Error(`${frame.path} must be a transparent 512 × 512 SVG.`);
    }
    frameCount += 1;
  }
}

if (frameCount !== 906) throw new Error(`Expected 906 frames, found ${frameCount}.`);
if (sourcedCount !== 76) throw new Error(`Expected 76 Everkinetic attributions, found ${sourcedCount}.`);
if (sourcedFrameCount !== 76) throw new Error(`Expected 76 sourced frame records, found ${sourcedFrameCount}.`);

console.log(`Validated ${manifest.length} exercises, ${frameCount} frames, ${sourcedCount} sourced poses, and zh-CN translations.`);
