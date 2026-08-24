# Workout Guide

An open exercise illustration library created by [Bryl Lim](https://bryllim.com). It contains 302 exercises, three consistent frames per exercise, a typed framework-neutral npm package, and a searchable static gallery.

[Browse the gallery](https://bryllim.github.io/workout-guide/) · [Read the guide](https://bryllim.github.io/workout-guide/guide/) · [Open the package on npm](https://www.npmjs.com/package/@bryllim/workout-guide)

## Install

```sh
npm install @bryllim/workout-guide
```

```ts
import { getExercise, searchExercises, getAssetUrl } from '@bryllim/workout-guide';

const pushUp = getExercise('push-up');
const bodyweightChest = searchExercises('chest', { equipment: 'bodyweight' });
const firstFrame = getAssetUrl('push-up', 1);
```

Direct asset imports and literal React Native `require()` examples are documented in the [integration guide](https://bryllim.github.io/workout-guide/guide/).

## Repository

This npm-workspace monorepo contains:

- `packages/workout-guide`: package API, canonical manifest, and all 906 transparent 512 × 512 PNGs.
- `apps/site`: Astro landing page, gallery, detail pages, and guide.
- `scripts`: deterministic catalog import and validation utilities.

Run the project locally:

```sh
npm install
npm run catalog:import
npm run check
npm run dev
```

The importer reads the adjacent Kabi source repository only when regenerating the catalog. Published consumers do not depend on Kabi.

## Licensing

Code and documentation are available under the [MIT License](./LICENSE). Visual assets are licensed under [CC BY-SA 4.0](./LICENSE-ASSETS). See [LICENSES.md](./LICENSES.md) and [ATTRIBUTION.md](./ATTRIBUTION.md) for the complete breakdown, including Everkinetic-derived poses.

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).
