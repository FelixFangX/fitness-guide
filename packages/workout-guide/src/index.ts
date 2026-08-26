import manifest from '../manifest.json';
import zhCNData from '../locales/zh-CN.json';

import type {
  AssetUrlOptions,
  Exercise,
  ExerciseFrame,
  ExerciseSearchFilters,
  ExerciseTranslation,
  ExerciseType,
  SupportedLocale,
} from './types';

export type {
  AssetUrlOptions,
  Exercise,
  ExerciseAttribution,
  ExerciseFrame,
  ExerciseSearchFilters,
  ExerciseTranslation,
  ExerciseType,
  SupportedLocale,
} from './types';

export const exercises = manifest as Exercise[];

const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
const exercisesBySlug = new Map(exercises.map((exercise) => [exercise.slug, exercise]));

type TranslationCatalog = {
  labels: {
    equipment: Record<string, string>;
    muscles: Record<string, string>;
    exerciseTypes: Record<ExerciseType, string>;
  };
  exerciseNames: Record<string, string>;
  aliases: Record<string, string[]>;
};

const zhCN = zhCNData as TranslationCatalog;
export const supportedLocales: readonly SupportedLocale[] = ['en', 'zh-CN'];

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function getExercise(idOrSlug: string) {
  return exercisesById.get(idOrSlug) ?? exercisesBySlug.get(idOrSlug) ?? null;
}

function getEnglishTranslation(exercise: Exercise): ExerciseTranslation {
  return {
    name: exercise.name,
    equipment: exercise.equipment,
    primaryMuscle: exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles,
    exerciseType: exercise.exerciseType.split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' '),
    aliases: [],
  };
}

function getChineseTranslation(exercise: Exercise): ExerciseTranslation {
  const name = zhCN.exerciseNames[exercise.id];
  if (!name) throw new Error(`Missing zh-CN translation for ${exercise.id}.`);

  return {
    name,
    equipment: zhCN.labels.equipment[exercise.equipment] ?? exercise.equipment,
    primaryMuscle: zhCN.labels.muscles[exercise.primaryMuscle] ?? exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles.map((muscle) => zhCN.labels.muscles[muscle] ?? muscle),
    exerciseType: zhCN.labels.exerciseTypes[exercise.exerciseType] ?? exercise.exerciseType,
    aliases: zhCN.aliases[exercise.id] ?? [],
  };
}

export function getExerciseTranslation(
  idOrSlug: string,
  locale: SupportedLocale = 'en',
): ExerciseTranslation | null {
  const exercise = getExercise(idOrSlug);
  if (!exercise) return null;
  return locale === 'zh-CN' ? getChineseTranslation(exercise) : getEnglishTranslation(exercise);
}

function matchesFilter(
  value: string,
  translatedValue: string,
  filter?: string | readonly string[],
) {
  if (filter === undefined) return true;
  const values = Array.isArray(filter) ? filter : [filter];
  return values.some((candidate) => {
    const normalizedCandidate = normalizeSearchText(candidate);
    return normalizedCandidate === normalizeSearchText(value)
      || normalizedCandidate === normalizeSearchText(translatedValue);
  });
}

export function searchExercises(query = '', filters: ExerciseSearchFilters = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const tokens = normalizedQuery ? normalizedQuery.split(' ') : [];

  return exercises.filter((exercise) => {
    const translation = getChineseTranslation(exercise);
    if (!matchesFilter(exercise.equipment, translation.equipment, filters.equipment)) return false;
    if (!matchesFilter(exercise.primaryMuscle, translation.primaryMuscle, filters.primaryMuscle)) return false;
    if (!matchesFilter(exercise.exerciseType, translation.exerciseType, filters.exerciseType)) return false;
    if (filters.isStretch !== undefined && exercise.isStretch !== filters.isStretch) return false;

    if (tokens.length === 0) return true;
    const searchable = normalizeSearchText([
      exercise.name,
      exercise.equipment,
      exercise.primaryMuscle,
      ...exercise.secondaryMuscles,
      translation.name,
      translation.equipment,
      translation.primaryMuscle,
      ...translation.secondaryMuscles,
      ...translation.aliases,
    ].join(' '));
    return tokens.every((token) => searchable.includes(token));
  });
}

export function getAssetUrl(
  idOrSlug: string,
  frameIndex: ExerciseFrame['index'],
  options: AssetUrlOptions = {},
) {
  const exercise = getExercise(idOrSlug);
  if (!exercise) return null;

  const frame = exercise.frames.find((candidate) => candidate.index === frameIndex);
  if (!frame) return null;

  const version = options.version ?? '1.0.0';
  const baseUrl = options.baseUrl ?? `https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@${version}/`;
  return new URL(frame.path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}
