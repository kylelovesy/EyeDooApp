/**
 * EyeDooApp Service Validation Schemas
 * Central export file for all validation schemas
 */

// Re-export all validation utilities
export * from '../utils/validationHelpers';

// Re-export all authentication schemas
export * from './authSchemas';

// Re-export all notes schemas
export * from './notesSchemas';

// Re-export all shot checklist schemas
export * from './shotChecklistSchemas';

// Re-export all weather schemas
export * from './weatherSchemas';

// Service name constants for consistent error reporting
export const SERVICE_NAMES = {
  AUTH: 'AuthService',
  PROJECTS: 'ProjectService', 
  NOTES: 'PrivateNotesService',
  SHOTS: 'ShotChecklistService',
  WEATHER: 'WeatherService',
  FIREBASE: 'FirebaseService'
} as const;

// Operation name constants for consistent error reporting
export const OPERATION_NAMES = {
  // Common operations
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  SEARCH: 'search',
  
  // Auth specific
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
  
  // Project specific
  GET_PROJECT: 'getProject',
  CREATE_PROJECT: 'createProject',
  UPDATE_PROJECT: 'updateProject',
  DELETE_PROJECT: 'deleteProject',
  
  // Notes specific
  CREATE_NOTE: 'createNote',
  UPDATE_NOTE: 'updateNote',
  DELETE_NOTE: 'deleteNote',
  
  // Shots specific
  CREATE_SHOT: 'createShot',
  UPDATE_SHOT: 'updateShot',
  DELETE_SHOT: 'deleteShot',
  
  // Weather specific
  GET_WEATHER: 'getWeather',
  GET_FORECAST: 'getForecast',
  SEARCH_LOCATIONS: 'searchLocations'
} as const; 