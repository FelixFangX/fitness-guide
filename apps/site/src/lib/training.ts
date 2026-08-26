import { getExercise, type Exercise } from '@bryllim/workout-guide';

import type { SiteLocale } from './locale';

type LocalizedText = Record<SiteLocale, string>;

export type PlannedExercise = {
  slug: string;
  sets: number;
  target: LocalizedText;
  rest: LocalizedText;
  cue: LocalizedText;
};

export type TrainingSession = {
  id: string;
  number: string;
  title: LocalizedText;
  focus: LocalizedText;
  summary: LocalizedText;
  duration: LocalizedText;
  exercises: PlannedExercise[];
};

export const trainingSessions: readonly TrainingSession[] = [
  {
    id: 'foundation',
    number: '01',
    title: { 'zh-CN': '全身基础', en: 'Full-body foundations' },
    focus: { 'zh-CN': '下肢 · 推 · 臀 · 核心', en: 'Legs · push · glutes · core' },
    summary: { 'zh-CN': '用稳定、可重复的基础动作建立训练节奏。', en: 'Build a repeatable rhythm with steady foundational movements.' },
    duration: { 'zh-CN': '约 32 分钟', en: 'About 32 min' },
    exercises: [
      { slug: 'bodyweight-squat', sets: 3, target: { 'zh-CN': '12 次', en: '12 reps' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '膝盖跟随脚尖方向，起身时均匀踩地。', en: 'Let knees track your toes and drive evenly through the floor.' } },
      { slug: 'push-up', sets: 3, target: { 'zh-CN': '8 次', en: '8 reps' }, rest: { 'zh-CN': '休息 60 秒', en: 'Rest 60 sec' }, cue: { 'zh-CN': '身体保持一条直线，胸部朝双手之间下降。', en: 'Keep one long line and lower your chest between your hands.' } },
      { slug: 'glute-bridge', sets: 3, target: { 'zh-CN': '12 次', en: '12 reps' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '收紧臀部抬髋，避免用腰部硬顶。', en: 'Squeeze glutes to lift; avoid forcing the movement through your low back.' } },
      { slug: 'plank', sets: 3, target: { 'zh-CN': '30 秒', en: '30 sec' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '轻收下巴，肋骨与骨盆保持稳定。', en: 'Keep your chin soft and your ribs stacked over the pelvis.' } },
    ],
  },
  {
    id: 'strength',
    number: '02',
    title: { 'zh-CN': '拉力与单腿', en: 'Pull and single-leg' },
    focus: { 'zh-CN': '背部 · 单腿 · 核心', en: 'Back · single-leg · core' },
    summary: { 'zh-CN': '用拉力与单腿控制补足全身稳定性。', en: 'Balance the week with pulling strength and single-leg control.' },
    duration: { 'zh-CN': '约 30 分钟', en: 'About 30 min' },
    exercises: [
      { slug: 'doorway-row', sets: 3, target: { 'zh-CN': '8 次', en: '8 reps' }, rest: { 'zh-CN': '休息 60 秒', en: 'Rest 60 sec' }, cue: { 'zh-CN': '先确认门框稳固，再让胸部靠近双手。', en: 'Confirm the doorway is stable, then pull your chest toward your hands.' } },
      { slug: 'reverse-lunge', sets: 3, target: { 'zh-CN': '每侧 8 次', en: '8 reps / side' }, rest: { 'zh-CN': '休息 60 秒', en: 'Rest 60 sec' }, cue: { 'zh-CN': '向后迈步轻落地，前脚完整踩稳。', en: 'Step back softly and keep the front foot fully grounded.' } },
      { slug: 'dead-bug', sets: 3, target: { 'zh-CN': '每侧 8 次', en: '8 reps / side' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '动作缓慢，腰背保持与地面轻触。', en: 'Move slowly while keeping a gentle low-back connection to the floor.' } },
    ],
  },
  {
    id: 'move',
    number: '03',
    title: { 'zh-CN': '心肺与活动度', en: 'Cardio and mobility' },
    focus: { 'zh-CN': '心肺 · 髋部 · 脊柱', en: 'Cardio · hips · spine' },
    summary: { 'zh-CN': '轻快提升心率，再用可控活动度收尾。', en: 'Raise the heart rate lightly, then finish with controlled mobility.' },
    duration: { 'zh-CN': '约 24 分钟', en: 'About 24 min' },
    exercises: [
      { slug: 'jumping-jack', sets: 3, target: { 'zh-CN': '40 秒', en: '40 sec' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '落地轻柔，保持可以说短句的节奏。', en: 'Land softly and keep a pace at which you can still speak in short phrases.' } },
      { slug: 'bird-dog', sets: 3, target: { 'zh-CN': '每侧 8 次', en: '8 reps / side' }, rest: { 'zh-CN': '休息 45 秒', en: 'Rest 45 sec' }, cue: { 'zh-CN': '四点支撑稳定，再慢慢伸出对侧手脚。', en: 'Stabilize on all fours, then slowly reach the opposite arm and leg.' } },
      { slug: 'cat-cow-stretch', sets: 2, target: { 'zh-CN': '每侧 8 次', en: '8 reps / side' }, rest: { 'zh-CN': '按呼吸进行', en: 'Follow your breath' }, cue: { 'zh-CN': '让呼吸带动脊柱逐节活动，不必追求幅度。', en: 'Let the breath guide each spinal segment; range is not the goal.' } },
    ],
  },
] as const;

export function getTrainingSession(id: string | undefined) {
  return trainingSessions.find((session) => session.id === id) ?? trainingSessions[0];
}

export function getPlannedExercises(session: TrainingSession) {
  return session.exercises.map((plan) => {
    const exercise = getExercise(plan.slug);
    if (!exercise) throw new Error(`Missing exercise for training plan: ${plan.slug}`);
    return { ...plan, exercise: exercise as Exercise };
  });
}

export function getSessionText(session: TrainingSession, locale: SiteLocale) {
  return {
    title: session.title[locale],
    focus: session.focus[locale],
    summary: session.summary[locale],
    duration: session.duration[locale],
  };
}
