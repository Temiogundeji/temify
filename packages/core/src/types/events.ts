import type { PlayerId } from './brands.js';

/**
 * Base event interface
 * All domain events extend this
 */
export interface TemifyEvent<TPayload = unknown> {
  readonly type: string;
  readonly playerId: PlayerId;
  readonly timestamp: string; // ISO 8601
  readonly payload: TPayload;
  readonly metadata?: EventMetadata & Record<string, unknown>;
}

/**
 * Event metadata for tracking
 */
export interface EventMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly source?: string;
}

/**
 * Event listener function type
 */
export type EventListener<TPayload = unknown> = (
  event: TemifyEvent<TPayload>
) => void | Promise<void>;

/**
 * Event subscription
 */
export interface EventSubscription {
  readonly eventType: string;
  readonly listener: EventListener;
  unsubscribe: () => void;
}
