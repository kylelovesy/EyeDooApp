// Create services/utils/errorHelpers.ts
export class ServiceError extends Error {
    constructor(
      public service: string,
      public operation: string,
      public originalError: any,
      message?: string
    ) {
      super(message || `${service}: ${operation} failed`);
    }
  }

/**
 * Recursively removes undefined values from an object
 * This is necessary because Firestore doesn't accept undefined values
 */
export const removeUndefinedValues = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }

    // Add this check to prevent corruption of Date objects
    if (obj instanceof Date) {
      return obj;
    }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues) as T;
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    }
    return cleaned as T;
  }

  return obj;
};