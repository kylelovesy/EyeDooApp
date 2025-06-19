import { z } from 'zod';

/**
 * EyeDooApp Validation Utilities
 * Standardized validation patterns across all services
 */

/**
 * Standard validation result interface
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Service error class for consistent error handling
 */
export class ServiceError extends Error {
  constructor(
    public service: string,
    public operation: string,
    public originalError?: any,
    message?: string
  ) {
    super(message || `EyeDooApp: ${service} ${operation} failed`);
    this.name = 'ServiceError';
  }
}

/**
 * Helper to parse data against a Zod schema with detailed error logging
 * Extended from projectServices.ts pattern
 */
export const validateAndParse = <T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown,
  context?: string
): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const contextMsg = context ? ` (${context})` : '';
    console.error(`EyeDooApp: Zod validation error${contextMsg}:`, JSON.stringify(result.error.flatten(), null, 2));
    throw new Error(`Data validation failed${contextMsg}.`);
  }
  return result.data;
};

/**
 * Safe validation that returns a result object instead of throwing
 */
export const validateSafe = <T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown,
  context?: string
): ValidationResult<z.infer<T>> => {
  try {
    const validatedData = validateAndParse(schema, data, context);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
};

/**
 * Validates an array of items against a schema
 */
export const validateArray = <T extends z.ZodType<any, any>>(
  schema: T,
  items: unknown[],
  context?: string
): z.infer<T>[] => {
  return items.map((item, index) => 
    validateAndParse(schema, item, `${context} item ${index}`)
  );
};

/**
 * Creates a standardized service error with logging
 */
export const createServiceError = (
  service: string,
  operation: string,
  originalError: any,
  customMessage?: string
): ServiceError => {
  const error = new ServiceError(service, operation, originalError, customMessage);
  console.error(`EyeDooApp: ${service} ${operation} error:`, originalError);
  return error;
};

/**
 * Standardized parameter validation for service methods
 */
export const validateServiceParams = (
  params: Record<string, any>,
  requiredFields: string[],
  service: string,
  operation: string
): void => {
  const missingFields = requiredFields.filter(field => 
    params[field] === undefined || params[field] === null || params[field] === ''
  );
  
  if (missingFields.length > 0) {
    throw createServiceError(
      service,
      operation,
      new Error(`Missing required parameters: ${missingFields.join(', ')}`),
      `Missing required parameters: ${missingFields.join(', ')}`
    );
  }
};

/**
 * Common validation schemas used across services
 */
export const CommonSchemas = {
  // Project ID validation
  projectId: z.string()
    .min(1, 'Project ID cannot be empty')
    .max(50, 'Project ID too long'),
  
  // User ID validation
  userId: z.string()
    .min(1, 'User ID cannot be empty')
    .max(50, 'User ID too long'),
  
  // Email validation
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long'),
  
  // Password validation
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-zA-Z])/, 'Password must contain at least one letter'),
  
  // Display name validation
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name too long')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Display name contains invalid characters'),
  
  // Note content validation
  noteContent: z.string()
    .min(1, 'Note content cannot be empty')
    .max(1000, 'Note content too long')
    .trim(),
  
  // Coordinates validation
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  
  // City name validation
  cityName: z.string()
    .min(2, 'City name too short')
    .max(100, 'City name too long')
    .regex(/^[a-zA-Z\s\-,\.]+$/, 'City name contains invalid characters'),
  
  // Weather units validation
  weatherUnit: z.enum(['metric', 'imperial'], {
    errorMap: () => ({ message: 'Weather unit must be metric or imperial' })
  }),
  
  // URL validation
  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL too long'),
  
  // File extension validation for images
  imageExtension: z.string()
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, 'Invalid image file extension')
}; 