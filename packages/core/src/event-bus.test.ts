import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from './event-bus.js';
import { createPlayerId } from './types/brands.js';
import type { TemifyEvent } from './types/events.js';

describe('EventBus', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  describe('subscribe and emit', () => {
    it('should notify listeners when event is emitted', () => {
      const listener = vi.fn();
      bus.subscribe('test.event', listener);

      const event: TemifyEvent = {
        type: 'test.event',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: { value: 42 },
      };

      bus.emit(event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners for same event', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      bus.subscribe('test.event', listener1);
      bus.subscribe('test.event', listener2);

      const event: TemifyEvent = {
        type: 'test.event',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      bus.emit(event);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should not notify unrelated listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      bus.subscribe('event.a', listener1);
      bus.subscribe('event.b', listener2);

      const event: TemifyEvent = {
        type: 'event.a',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      bus.emit(event);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('wildcard subscriptions', () => {
    it('should notify wildcard listeners for all events', () => {
      const wildcardListener = vi.fn();
      bus.subscribe('*', wildcardListener);

      const event1: TemifyEvent = {
        type: 'event.a',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      const event2: TemifyEvent = {
        type: 'event.b',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      bus.emit(event1);
      bus.emit(event2);

      expect(wildcardListener).toHaveBeenCalledTimes(2);
      expect(wildcardListener).toHaveBeenCalledWith(event1);
      expect(wildcardListener).toHaveBeenCalledWith(event2);
    });
  });

  describe('unsubscribe', () => {
    it('should stop notifying after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = bus.subscribe('test.event', listener);

      const event: TemifyEvent = {
        type: 'test.event',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      bus.emit(event);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      bus.emit(event);
      expect(listener).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should support unsubscribe via method', () => {
      const listener = vi.fn();
      bus.subscribe('test.event', listener);

      bus.unsubscribe('test.event', listener);

      const event: TemifyEvent = {
        type: 'test.event',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      bus.emit(event);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('error isolation', () => {
    it('should continue notifying other listeners if one throws', () => {
      const listener1 = vi.fn(() => {
        throw new Error('Listener 1 failed');
      });
      const listener2 = vi.fn();

      bus.subscribe('test.event', listener1);
      bus.subscribe('test.event', listener2);

      const event: TemifyEvent = {
        type: 'test.event',
        playerId: createPlayerId('player-1'),
        timestamp: new Date().toISOString(),
        payload: {},
      };

      // Should not throw
      expect(() => bus.emit(event)).not.toThrow();

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      expect(bus.listenerCount('test.event')).toBe(0);

      bus.subscribe('test.event', vi.fn());
      expect(bus.listenerCount('test.event')).toBe(1);

      bus.subscribe('test.event', vi.fn());
      expect(bus.listenerCount('test.event')).toBe(2);
    });

    it('should return wildcard listener count', () => {
      expect(bus.listenerCount('*')).toBe(0);

      bus.subscribe('*', vi.fn());
      expect(bus.listenerCount('*')).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all listeners', () => {
      bus.subscribe('event.a', vi.fn());
      bus.subscribe('event.b', vi.fn());
      bus.subscribe('*', vi.fn());

      expect(bus.listenerCount('event.a')).toBe(1);
      expect(bus.listenerCount('event.b')).toBe(1);
      expect(bus.listenerCount('*')).toBe(1);

      bus.clear();

      expect(bus.listenerCount('event.a')).toBe(0);
      expect(bus.listenerCount('event.b')).toBe(0);
      expect(bus.listenerCount('*')).toBe(0);
    });
  });

  describe('getEventTypes', () => {
    it('should return all registered event types', () => {
      bus.subscribe('event.a', vi.fn());
      bus.subscribe('event.b', vi.fn());

      const types = bus.getEventTypes();
      expect(types).toContain('event.a');
      expect(types).toContain('event.b');
      expect(types).toHaveLength(2);
    });
  });
});
