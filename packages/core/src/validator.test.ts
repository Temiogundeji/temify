import { describe, it, expect } from 'vitest';
import { Validator, Rules } from './validator.js';
import { ValidationError } from './types/errors.js';

describe('Validator', () => {
  describe('basic validation', () => {
    it('should pass when all rules pass', () => {
      interface TestData {
        name: string;
        age: number;
      }

      const validator = new Validator<TestData>()
        .rule(Rules.required('name'))
        .rule(Rules.min('age', 0));

      const result = validator.validate({ name: 'Alice', age: 25 });

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should fail when a rule fails', () => {
      interface TestData {
        name: string;
      }

      const validator = new Validator<TestData>().rule(Rules.required('name'));

      const result = validator.validate({ name: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0].field).toBe('name');
      expect(result.errors?.[0].code).toBe('REQUIRED');
    });

    it('should collect multiple errors', () => {
      interface TestData {
        name: string;
        age: number;
      }

      const validator = new Validator<TestData>()
        .rule(Rules.required('name'))
        .rule(Rules.min('age', 18));

      const result = validator.validate({ name: '', age: 10 });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw when validation passes', () => {
      interface TestData {
        value: number;
      }

      const validator = new Validator<TestData>().rule(Rules.min('value', 0));

      expect(() => {
        validator.validateOrThrow({ value: 5 });
      }).not.toThrow();
    });

    it('should throw ValidationError when validation fails', () => {
      interface TestData {
        value: number;
      }

      const validator = new Validator<TestData>().rule(Rules.min('value', 10));

      expect(() => {
        validator.validateOrThrow({ value: 5 });
      }).toThrow(ValidationError);
    });
  });

  describe('Rules.required', () => {
    it('should pass for non-empty string', () => {
      const rule = Rules.required<{ name: string }>('name');
      const result = rule({ name: 'Alice' });

      expect(result.valid).toBe(true);
    });

    it('should fail for empty string', () => {
      const rule = Rules.required<{ name: string }>('name');
      const result = rule({ name: '' });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].code).toBe('REQUIRED');
    });

    it('should fail for null', () => {
      const rule = Rules.required<{ name: string | null }>('name');
      const result = rule({ name: null });

      expect(result.valid).toBe(false);
    });

    it('should fail for undefined', () => {
      const rule = Rules.required<{ name?: string }>('name');
      const result = rule({ name: undefined });

      expect(result.valid).toBe(false);
    });
  });

  describe('Rules.range', () => {
    it('should pass when value is within range', () => {
      const rule = Rules.range<{ score: number }>('score', 0, 100);
      const result = rule({ score: 50 });

      expect(result.valid).toBe(true);
    });

    it('should pass at min boundary', () => {
      const rule = Rules.range<{ score: number }>('score', 0, 100);
      const result = rule({ score: 0 });

      expect(result.valid).toBe(true);
    });

    it('should pass at max boundary', () => {
      const rule = Rules.range<{ score: number }>('score', 0, 100);
      const result = rule({ score: 100 });

      expect(result.valid).toBe(true);
    });

    it('should fail when value is below range', () => {
      const rule = Rules.range<{ score: number }>('score', 0, 100);
      const result = rule({ score: -1 });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].code).toBe('OUT_OF_RANGE');
    });

    it('should fail when value is above range', () => {
      const rule = Rules.range<{ score: number }>('score', 0, 100);
      const result = rule({ score: 101 });

      expect(result.valid).toBe(false);
    });

    it('should fail for non-number value', () => {
      const rule = Rules.range<{ score: unknown }>('score', 0, 100);
      const result = rule({ score: 'not a number' });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].code).toBe('INVALID_TYPE');
    });
  });

  describe('Rules.min', () => {
    it('should pass when value meets minimum', () => {
      const rule = Rules.min<{ age: number }>('age', 18);
      const result = rule({ age: 18 });

      expect(result.valid).toBe(true);
    });

    it('should pass when value exceeds minimum', () => {
      const rule = Rules.min<{ age: number }>('age', 18);
      const result = rule({ age: 25 });

      expect(result.valid).toBe(true);
    });

    it('should fail when value is below minimum', () => {
      const rule = Rules.min<{ age: number }>('age', 18);
      const result = rule({ age: 17 });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].code).toBe('TOO_SMALL');
    });
  });

  describe('Rules.max', () => {
    it('should pass when value meets maximum', () => {
      const rule = Rules.max<{ score: number }>('score', 100);
      const result = rule({ score: 100 });

      expect(result.valid).toBe(true);
    });

    it('should pass when value is below maximum', () => {
      const rule = Rules.max<{ score: number }>('score', 100);
      const result = rule({ score: 50 });

      expect(result.valid).toBe(true);
    });

    it('should fail when value exceeds maximum', () => {
      const rule = Rules.max<{ score: number }>('score', 100);
      const result = rule({ score: 101 });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].code).toBe('TOO_LARGE');
    });
  });

  describe('Rules.custom', () => {
    it('should pass when predicate returns true', () => {
      const rule = Rules.custom<{ email: string }>(
        'email',
        (value) => String(value).includes('@'),
        'Email must contain @'
      );

      const result = rule({ email: 'user@example.com' });

      expect(result.valid).toBe(true);
    });

    it('should fail when predicate returns false', () => {
      const rule = Rules.custom<{ email: string }>(
        'email',
        (value) => String(value).includes('@'),
        'Email must contain @'
      );

      const result = rule({ email: 'invalid-email' });

      expect(result.valid).toBe(false);
      expect(result.errors?.[0].message).toBe('Email must contain @');
      expect(result.errors?.[0].code).toBe('CUSTOM_VALIDATION');
    });

    it('should support custom error code', () => {
      const rule = Rules.custom<{ email: string }>(
        'email',
        (value) => String(value).includes('@'),
        'Email must contain @',
        'INVALID_EMAIL'
      );

      const result = rule({ email: 'invalid' });

      expect(result.errors?.[0].code).toBe('INVALID_EMAIL');
    });
  });
});
