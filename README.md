# Fitness Guide

[简体中文](./README.zh-CN.md)

A bilingual, local-first personal fitness guide built from 302 exercise illustrations. It starts in Chinese and offers an English switch on every page. The app provides a three-session weekly routine, set-by-set completion, weekly progress, and a searchable movement library; all training records remain in the browser's local storage.

The original pose artwork used by this project comes from [Everkinetic](https://github.com/everkinetic/data) under CC BY-SA 4.0. [Bryl Lim](https://bryllim.com) expanded upon that foundation with additional exercises and animation frames, normalized assets, structured metadata, package APIs, and the documentation gallery.

Run the local site at `http://localhost:4321/fitness-guide/`. Set `SITE_URL` before deploying so canonical URLs and the sitemap use your domain.

## Personal fitness app

Run the app locally, then open `http://localhost:4321/fitness-guide/`:

```sh
pnpm install
pnpm dev
```

The default plan has three sessions: foundation, strength, and movement & recovery. It requires no account or backend. Clear browser site data to reset personal training records.

## Reuse the exercise package

```sh
pnpm add @bryllim/workout-guide
```

```ts
import { getExercise, searchExercises, getAssetUrl } from '@bryllim/workout-guide';

const pushUp = getExercise('push-up');
const bodyweightChest = searchExercises('chest', { equipment: 'bodyweight' });
const firstFrame = getAssetUrl('push-up', 1);
```

The package remains framework-neutral, so its SVGs and typed metadata can be reused in other products.

## Repository

This pnpm workspace monorepo contains:

- `packages/workout-guide`: package API, canonical manifest, and all 906 transparent 512 × 512 SVGs, with PNG sources retained for compatibility.
- `apps/site`: Astro personal fitness guide, movement library, and exercise detail pages.
- `scripts`: deterministic catalog import and validation utilities.

Run all validation checks:

```sh
pnpm install
pnpm check
```

The normalized catalog and all package assets are checked into the repository. Maintainers can regenerate them from a compatible source export with `pnpm catalog:import -- /path/to/source`.

## Licensing

Code and documentation are available under the [MIT License](./LICENSE). Visual assets are licensed under [CC BY-SA 4.0](./LICENSE-ASSETS). See [LICENSES.md](./LICENSES.md) and [ATTRIBUTION.md](./ATTRIBUTION.md) for the complete breakdown, including Everkinetic-derived poses.

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).
