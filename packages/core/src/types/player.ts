import type { PlayerId } from './brands.js';

/**
 * PlayerState is the single mutable state object
 * Passed through all modules
 */
export interface PlayerState {
  readonly id: PlayerId;
  readonly createdAt: string; // ISO 8601
  readonly updatedAt: string; // ISO 8601
  readonly metadata: Record<string, unknown>;
  
  // Module-specific state (populated by individual modules)
  readonly metrics?: Record<string, number>;
  readonly achievements?: Record<string, unknown>;
  readonly streaks?: Record<string, unknown>;
  readonly quests?: Record<string, unknown>;
}

/**
 * Context passed with every action
 */
export interface PlayerContext {
  readonly playerId: PlayerId;
  readonly timestamp: string; // ISO 8601
  readonly source?: string; // Action source (e.g., 'api', 'cron', 'user')
  readonly metadata?: Record<string, unknown>;
}
