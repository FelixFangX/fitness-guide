import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import sharp from 'sharp';

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), '..');
const packageRoot = join(projectRoot, 'packages', 'workout-guide');
const sitePublic = join(projectRoot, 'apps', 'site', 'public');
const targetFrames = join(sitePublic, 'frames');

if (!targetFrames.startsWith(sitePublic)) throw new Error('Invalid site asset target.');
await rm(targetFrames, { recursive: true, force: true });
await mkdir(sitePublic, { recursive: true });
await cp(join(packageRoot, 'assets'), targetFrames, { recursive: true });

const manifest = JSON.parse(await readFile(join(packageRoot, 'manifest.json'), 'utf8'));
const featured = ['push-up', 'squat', 'deadlift'];
const composites = [];
for (const [index, slug] of featured.entries()) {
  const exercise = manifest.find((item) => item.slug === slug);
  if (!exercise) throw new Error(`Missing featured exercise: ${slug}`);
  const image = await sharp(join(packageRoot, exercise.frames[0].path))
    .resize(190, 190, { fit: 'contain' })
    .png()
    .toBuffer();
  composites.push({ input: image, left: 574 + index * 196, top: 218 });
}

const background = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f5f5f2"/>
    <rect x="548" y="94" width="622" height="442" rx="58" fill="#171717"/>
    <text x="72" y="220" fill="#171717" font-family="ui-rounded, system-ui" font-size="74" font-weight="700">Workout</text>
    <text x="72" y="292" fill="#171717" font-family="ui-rounded, system-ui" font-size="74" font-weight="700">Guide.</text>
    <text x="76" y="366" fill="#666666" font-family="ui-rounded, system-ui" font-size="28">302 exercises. 906 open-source frames.</text>
    <text x="76" y="502" fill="#171717" font-family="ui-rounded, system-ui" font-size="22">Created by Bryl Lim</text>
  </svg>
`);

await sharp(background)
  .composite(composites)
  .png({ quality: 100, effort: 10 })
  .toFile(join(sitePublic, 'og.png'));

console.log('Synced 906 site frames and generated social artwork.');
