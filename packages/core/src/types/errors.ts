/**
 * Base error class for all Temify errors
 */
export class TemifyError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TemifyError';
    Object.setPrototypeOf(this, TemifyError.prototype);
  }
}

/**
 * Validation error - thrown when input is invalid
 */
export class ValidationError extends TemifyError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Invariant error - thrown when system state is corrupted
 */
export class InvariantError extends TemifyError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('INVARIANT_ERROR', message, details);
    this.name = 'InvariantError';
    Object.setPrototypeOf(this, InvariantError.prototype);
  }
}

/**
 * Configuration error - thrown when config is invalid
 */
export class ConfigurationError extends TemifyError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFIGURATION_ERROR', message, details);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
