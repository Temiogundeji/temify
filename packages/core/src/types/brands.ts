/**
 * Branded types prevent mixing different ID types
 * Example: Can't pass AchievementId where PlayerId is expected
 */

declare const brand: unique symbol;

type Brand<T, TBrand> = T & { [brand]: TBrand };

export type PlayerId = Brand<string, 'PlayerId'>;
export type MetricId = Brand<string, 'MetricId'>;
export type AchievementId = Brand<string, 'AchievementId'>;
export type StreakId = Brand<string, 'StreakId'>;
export type QuestId = Brand<string, 'QuestId'>;
export type LeaderboardId = Brand<string, 'LeaderboardId'>;
export type LevelId = Brand<string, 'LevelId'>;

/**
 * Create a branded ID from a plain string
 */
export function createPlayerId(id: string): PlayerId {
  return id as PlayerId;
}

export function createMetricId(id: string): MetricId {
  return id as MetricId;
}

export function createAchievementId(id: string): AchievementId {
  return id as AchievementId;
}

export function createStreakId(id: string): StreakId {
  return id as StreakId;
}

export function createQuestId(id: string): QuestId {
  return id as QuestId;
}

export function createLeaderboardId(id: string): LeaderboardId {
  return id as LeaderboardId;
}

export function createLevelId(id: string): LevelId {
  return id as LevelId;
}
