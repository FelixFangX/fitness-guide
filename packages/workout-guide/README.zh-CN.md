# @bryllim/workout-guide

[English](./README.md)

框架无关的动作元数据和 906 张动作帧。原始姿态插画来自 [Everkinetic](https://github.com/everkinetic/data)，采用 CC BY-SA 4.0 许可；[Bryl Lim](https://bryllim.com) 在此基础上增加了动作、动画帧、规范化素材、元数据和包 API。

```sh
pnpm add @bryllim/workout-guide
```

```ts
import { getExercise, getExerciseTranslation, searchExercises } from '@bryllim/workout-guide';

const pushUp = getExercise('push-up');
const translation = getExerciseTranslation('push-up', 'zh-CN');
const chestExercises = searchExercises('胸肌', { equipment: '自重' });
```

本包保留英文 `id`、`slug`、资源路径和 API 名称以确保稳定兼容，同时提供中文动作名、器械、肌群和中文搜索支持。

本地导入、CDN URL 以及 Expo 示例请见[接入指南](https://bryllim.github.io/workout-guide/guide/)。

代码采用 MIT 许可；视觉素材采用 CC BY-SA 4.0。详见 `LICENSES.md` 与 `ATTRIBUTION.md`。
