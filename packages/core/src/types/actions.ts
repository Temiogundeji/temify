import type { PlayerId } from './brands.js';
import { TemifyEvent } from './events.js';
/**
 * Base action interface
 * All commands extend this
 */
export interface TemifyAction<TPayload = unknown> {
  readonly type: string;
  readonly playerId: PlayerId;
  readonly timestamp: string; // ISO 8601
  readonly payload: TPayload;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Action result after execution
 */
export interface ActionResult<TState = unknown> {
  readonly success: boolean;
  readonly state?: TState;
  readonly error?: TemifyErrorData;
  readonly events?: ReadonlyArray<TemifyEvent>;
}

/**
 * Error type for action failures
 */
export interface TemifyErrorData {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}
