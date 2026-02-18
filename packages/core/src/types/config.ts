/**
 * Base configuration interface
 */
export interface EngineConfig {
  readonly modules?: ModuleConfig;
  readonly validation?: ValidationConfig;
  readonly events?: EventConfig;
}

/**
 * Module-specific configurations
 */
export interface ModuleConfig {
  readonly metrics?: Record<string, unknown>;
  readonly levels?: Record<string, unknown>;
  readonly achievements?: Record<string, unknown>;
  readonly streaks?: Record<string, unknown>;
  readonly quests?: Record<string, unknown>;
  readonly leaderboards?: Record<string, unknown>;
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  readonly strict?: boolean;
  readonly throwOnError?: boolean;
}

/**
 * Event system configuration
 */
export interface EventConfig {
  readonly async?: boolean;
  readonly isolateErrors?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors?: ReadonlyArray<ValidationError>;
}

interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}
