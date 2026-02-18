import type { TemifyEvent, EventListener } from './types/events.js';
import { TemifyError } from './types/errors.js';

/**
 * Event bus for pub/sub communication between modules
 * 
 * Key features:
 * - Synchronous by default (deterministic ordering)
 * - Listener failure isolation
 * - Wildcard subscriptions
 * - Type-safe event handling
 */
export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private wildcardListeners: Set<EventListener> = new Set();

  /**
   * Subscribe to a specific event type
   * Use '*' as eventType to listen to all events
   */
  subscribe(eventType: string, listener: EventListener): () => void {
    if (eventType === '*') {
      this.wildcardListeners.add(listener);
      return () => this.wildcardListeners.delete(listener);
    }

    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Unsubscribe from an event type
   */
  unsubscribe(eventType: string, listener: EventListener): void {
    if (eventType === '*') {
      this.wildcardListeners.delete(listener);
      return;
    }

    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * Failures in one listener don't affect others
   */
  emit<TPayload = unknown>(event: TemifyEvent<TPayload>): void {
    const errors: Error[] = [];

    // Notify type-specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      for (const listener of typeListeners) {
        try {
          const result = listener(event);
          if (result instanceof Promise) {
            result.catch((err) => console.error(`Async listener failed for ${event.type}:`, err));
          }
        } catch (error) {
          errors.push(
            error instanceof Error
              ? error
              : new Error('Unknown error in event listener')
          );
        }
      }
    }

    // Notify wildcard listeners
    for (const listener of this.wildcardListeners) {
      try {
        const result = listener(event);
        if (result instanceof Promise) {
          result.catch((err) => console.error(`Async wildcard listener failed for ${event.type}:`, err));
        }
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error
            : new Error('Unknown error in wildcard listener')
        );
      }
    }

    // If any listeners failed, report them
    if (errors.length > 0) {
      console.error(`EventBus: ${errors.length} listener(s) failed:`, errors);
    }
  }

  /**
   * Get count of listeners for an event type
   */
  listenerCount(eventType: string): number {
    if (eventType === '*') {
      return this.wildcardListeners.size;
    }
    return this.listeners.get(eventType)?.size ?? 0;
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.clear();
    this.wildcardListeners.clear();
  }

  /**
   * Get all registered event types
   */
  getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }
}
