import { Timestamp } from 'firebase/firestore';

/**
 * EyeDooApp Timestamp Utilities
 * Standardized timestamp handling across all services
 */

/**
 * Converts a Firestore Timestamp to a JavaScript Date
 * Handles both Firestore Timestamp objects and potential null/undefined values
 */
export const convertFirestoreTimestamp = (timestamp: any): Date => {
  if (!timestamp) {
    console.warn('EyeDooApp: Null/undefined timestamp provided, using current date');
    return new Date();
  }
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  console.warn('EyeDooApp: Invalid timestamp format, using current date:', timestamp);
  return new Date();
};

/**
 * DEPRECATED: This conversion is now handled automatically by Zod schemas
 * Keep this file for backward compatibility, but new code should rely on Zod preprocessing
 */

// Add this warning function
export const deprecationWarning = () => {
  console.warn('EyeDooApp: Direct timestamp conversion is deprecated. Use Zod schema validation instead.');
};

/**
 * Safely converts multiple timestamp fields in an object
 * Used for converting Firestore documents with timestamp fields
 */
export const convertTimestampFields = <T extends Record<string, any>>(
  data: T,
  timestampFields: (keyof T)[]
): T => {
  deprecationWarning();
  const converted = { ...data };
  
  timestampFields.forEach(field => {
    if (converted[field]) {
      converted[field] = convertFirestoreTimestamp(converted[field]) as T[keyof T];
    }
  });
  
  return converted;
};

/**
 * Creates a standardized timestamp object for Firestore documents
 * Returns current date in consistent format
 */
export const createTimestamp = (): Date => {
  return new Date();
};

/**
 * Validates if a value is a valid timestamp
 * Returns true if the value can be converted to a valid Date
 */
export const isValidTimestamp = (timestamp: any): boolean => {
  if (!timestamp) return false;
  
  if (timestamp instanceof Timestamp || timestamp instanceof Date) {
    return true;
  }
  
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    return true;
  }
  
  if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return !isNaN(parsedDate.getTime());
  }
  
  return false;
};

/**
 * Converts all relevant timestamp fields in a user document to JS Date objects.
 */
export const convertUserTimestamps = (userData: any): any => ({
  ...userData,
  createdAt: convertFirestoreTimestamp(userData.createdAt),
  updatedAt: convertFirestoreTimestamp(userData.updatedAt),
  lastLoginAt: userData.lastLoginAt ? convertFirestoreTimestamp(userData.lastLoginAt) : undefined,
  // Add more fields as needed
});