/**
 * EyeDooApp Types Index
 * Centralized export of all application types for easy importing
 */

// === ENUMS ===
export * from './enum';

// === CORE TYPES ===
export * from './user';

// === AUTHENTICATION TYPES ===
export type {
  AuthContextType, AuthError,
  AuthState, ChangePasswordFormData, ResetPasswordFormData, SignInFormData, SignUpFormData
} from './auth';

// === PROJECT TYPES ===
export type {
  CreateProjectInput, Project, UpdateProjectInput
} from './project';

export type { CombinedEventsTimelineSchema } from './timeline';

export type { Form1EssentialInfo } from './project-EssentialInfoSchema';
export type { Form3People } from './project-PersonaSchema';
export type { Form4Photos } from './project-PhotosSchema';

// === UTILITY SCHEMAS ===
export type {
  CandidShotSchema, CoupleShotSchema, FirestoreTimestampSchema, GroupShotSchema, LocationInfoSchema, NameSchema, NotesSchema, OtherKeyPersonSchema, PersonInfoSchema, PersonWithRoleSchema, PhoneSchema, PhotoRequestSchema, TimeFormatSchema, UKPostcodeSchema
} from './reusableSchemas';

// === OTHER TYPES ===
export * from './notes';
export * from './shotlist';

// === VALIDATION UTILITIES ===
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}>;

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
} 