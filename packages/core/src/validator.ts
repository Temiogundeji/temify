import type { ValidationResult } from './types/config.js';
import { ValidationError } from './types/errors.js';

/**
 * Validation rule function type
 */
export type ValidationRule<T> = (value: T) => ValidationResult;

/**
 * Validator for state validation with fluent API
 */
export class Validator<T> {
  private rules: ValidationRule<T>[] = [];

  /**
   * Add a validation rule
   */
  rule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * Validate a value against all rules
   */
  validate(value: T): ValidationResult {
    let errors: Array<{ field: string; message: string; code: string }> | undefined;

    for (const rule of this.rules) {
      const result = rule(value);
      if (!result.valid && result.errors) {
        (errors = errors || []).push(...result.errors);
      }
    }

    return {
      valid: !errors,
      errors: errors,
    };
  }

  /**
   * Validate and throw if invalid
   */
  validateOrThrow(value: T): void {
    const result = this.validate(value);
    if (!result.valid && result.errors) {
      throw new ValidationError('Validation failed', {
        errors: result.errors,
      });
    }
  }
}

/**
 * Common validation rules
 */
export const Rules = {
  /**
   * Require a field to be present
   */
  required<T>(field: keyof T, message?: string): ValidationRule<T> {
    return (value: T): ValidationResult => {
      const fieldValue = value[field];
      const isPresent =
        fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== '';

      return {
        valid: isPresent,
        errors: isPresent
          ? undefined
          : [
              {
                field: String(field),
                message: message || `${String(field)} is required`,
                code: 'REQUIRED',
              },
            ],
      };
    };
  },

  /**
   * Validate that a number is within a range
   */
  range<T>(
    field: keyof T,
    min: number,
    max: number,
    message?: string
  ): ValidationRule<T> {
    return (value: T): ValidationResult => {
      const fieldValue = value[field] as unknown as number;

      if (typeof fieldValue !== 'number') {
        return {
          valid: false,
          errors: [
            {
              field: String(field),
              message: `${String(field)} must be a number`,
              code: 'INVALID_TYPE',
            },
          ],
        };
      }

      const inRange = fieldValue >= min && fieldValue <= max;

      return {
        valid: inRange,
        errors: inRange
          ? undefined
          : [
              {
                field: String(field),
                message:
                  message ||
                  `${String(field)} must be between ${min} and ${max}`,
                code: 'OUT_OF_RANGE',
              },
            ],
      };
    };
  },

  /**
   * Validate minimum value
   */
  min<T>(field: keyof T, minValue: number, message?: string): ValidationRule<T> {
    return (value: T): ValidationResult => {
      const fieldValue = value[field] as unknown as number;

      if (typeof fieldValue !== 'number') {
        return {
          valid: false,
          errors: [
            {
              field: String(field),
              message: `${String(field)} must be a number`,
              code: 'INVALID_TYPE',
            },
          ],
        };
      }

      const valid = fieldValue >= minValue;

      return {
        valid,
        errors: valid
          ? undefined
          : [
              {
                field: String(field),
                message:
                  message ||
                  `${String(field)} must be at least ${minValue}`,
                code: 'TOO_SMALL',
              },
            ],
      };
    };
  },

  /**
   * Validate maximum value
   */
  max<T>(field: keyof T, maxValue: number, message?: string): ValidationRule<T> {
    return (value: T): ValidationResult => {
      const fieldValue = value[field] as unknown as number;

      if (typeof fieldValue !== 'number') {
        return {
          valid: false,
          errors: [
            {
              field: String(field),
              message: `${String(field)} must be a number`,
              code: 'INVALID_TYPE',
            },
          ],
        };
      }

      const valid = fieldValue <= maxValue;

      return {
        valid,
        errors: valid
          ? undefined
          : [
              {
                field: String(field),
                message:
                  message || `${String(field)} must be at most ${maxValue}`,
                code: 'TOO_LARGE',
              },
            ],
      };
    };
  },

  /**
   * Custom validation rule
   */
  custom<T>(
    field: keyof T,
    predicate: (value: unknown) => boolean,
    message: string,
    code = 'CUSTOM_VALIDATION'
  ): ValidationRule<T> {
    return (value: T): ValidationResult => {
      const fieldValue = value[field];
      const valid = predicate(fieldValue);

      return {
        valid,
        errors: valid
          ? undefined
          : [
              {
                field: String(field),
                message,
                code,
              },
            ],
      };
    };
  },
};
