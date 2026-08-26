# 健身指南 / Fitness Guide

[English](./README.md)

一个默认中文、支持中英切换且本地优先的个人健身指南。它使用 302 个健身动作插画，提供每周三练、逐组完成、每周进度与可搜索动作库；训练记录只保存在浏览器本地。

本项目使用的原始姿态插画来自 [Everkinetic](https://github.com/everkinetic/data)，采用 CC BY-SA 4.0 许可。[Bryl Lim](https://bryllim.com) 在此基础上补充了更多动作和动画帧，并提供规范化素材、结构化元数据、包 API 与文档图库。

本地启动后访问 `http://localhost:4321/fitness-guide/`。部署前请设置 `SITE_URL`，使规范链接和站点地图指向你的域名。

## 个人健身 App

本地启动后访问 `http://localhost:4321/fitness-guide/`：

```sh
pnpm install
pnpm dev
```

默认计划包含「基础激活」「力量与单腿」「活动与恢复」三节训练，无需登录或后端。清除浏览器站点数据即可重置个人训练记录。

## 复用动作包

```sh
pnpm add @bryllim/workout-guide
```

```ts
import { getExercise, searchExercises, getAssetUrl } from '@bryllim/workout-guide';

const pushUp = getExercise('push-up');
const bodyweightChest = searchExercises('胸肌', { equipment: '自重' });
const firstFrame = getAssetUrl('push-up', 1);
```

动作包仍保持框架无关，可在其他产品中复用 SVG 与带类型的元数据。

## 仓库结构

这个 pnpm workspace monorepo 包含：

- `packages/workout-guide`：包 API、规范清单与全部 906 张透明 512 × 512 SVG；为兼容性保留 PNG 源文件。
- `apps/site`：Astro 个人健身指南、动作库与动作详情页。
- `scripts`：确定性的目录导入与校验工具。

运行全部校验：

```sh
pnpm install
pnpm check
```

规范化目录和全部包素材均已提交到仓库。维护者可以通过 `pnpm catalog:import -- /path/to/source`，从兼容的源导出重新生成它们。

## 许可协议

代码和文档采用 [MIT License](./LICENSE)；视觉素材采用 [CC BY-SA 4.0](./LICENSE-ASSETS)。完整说明（包括 Everkinetic 派生姿态）请见 [LICENSES.md](./LICENSES.md) 与 [ATTRIBUTION.md](./ATTRIBUTION.md)。

欢迎贡献。请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 和 [Code of Conduct](./CODE_OF_CONDUCT.md)。
