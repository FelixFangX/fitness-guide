import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), '..');
const packageRoot = join(projectRoot, 'packages', 'workout-guide');
const temporary = await mkdtemp(join(tmpdir(), 'workout-guide-consumer-'));

try {
  execFileSync('pnpm', ['--filter', '@bryllim/workout-guide', 'run', 'build'], { cwd: projectRoot, stdio: 'inherit' });
  const archive = execFileSync('pnpm', ['pack', '--pack-destination', temporary], { cwd: packageRoot, encoding: 'utf8' }).trim().split('\n').at(-1);
  if (!archive) throw new Error('pnpm pack did not return an archive name.');
  const archivePath = isAbsolute(archive) ? archive : join(temporary, archive);

  await writeFile(join(temporary, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  execFileSync('pnpm', ['add', '--ignore-scripts', archivePath], { cwd: temporary, stdio: 'inherit' });
  await writeFile(join(temporary, 'esm.mjs'), "import { exercises, getExercise } from '@bryllim/workout-guide'; if (exercises.length !== 302 || !getExercise('push-up')) process.exit(1);\n");
  await writeFile(join(temporary, 'cjs.cjs'), "const { exercises, getExercise } = require('@bryllim/workout-guide'); if (exercises.length !== 302 || !getExercise('push-up')) process.exit(1);\n");
  execFileSync('node', ['esm.mjs'], { cwd: temporary, stdio: 'inherit' });
  execFileSync('node', ['cjs.cjs'], { cwd: temporary, stdio: 'inherit' });
  console.log('Validated temporary ESM and CommonJS consumer installs.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
