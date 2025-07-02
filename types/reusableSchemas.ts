import { z } from "zod";
import {
  CandidShotCategory,
  ContactType,
  CoupleShotCategory,
  ImportanceLevel,
  LocationType,
  PhotoRequestType,
  Pronoun,
  RelationshipToCouple
} from "./enum";

/**
 * Reusable Zod schemas for consistent validation across the application
 */

// === TIMESTAMP HANDLING ===

/**
 * Standardized application timestamp schema
 * Accepts multiple input types but always outputs JavaScript Date objects
 * This solves the Firestore Timestamp vs Date inconsistency across the app
 */
export const FirestoreTimestampSchema = z.preprocess(
  (val) => {
    // Handle Firestore Timestamp objects
    if (val && typeof val === 'object') {
      // If it has a toDate method, use it
      if ('toDate' in val && typeof (val as any).toDate === 'function') {
        return (val as any).toDate();
      }
      // If it has seconds and nanoseconds as numbers, convert to Date
      if (
        'seconds' in val && 'nanoseconds' in val &&
        typeof (val as any).seconds === 'number' &&
        typeof (val as any).nanoseconds === 'number'
      ) {
        return new Date(
          (val as any).seconds * 1000 + Math.floor((val as any).nanoseconds / 1000000)
        );
      }
    }
    
    // Handle Firebase Timestamp objects
    if (val instanceof Date) {
      return val;
    }
    
    // Handle ISO string dates
    if (typeof val === 'string') {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    // Handle number timestamps
    if (typeof val === 'number') {
      return new Date(val);
    }
    
    // Invalid/null values or empty objects
    if (val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length === 0)) {
      return undefined;
    }
    
    // Log warning for unhandled types
    console.warn('EyeDooApp: Unhandled timestamp type:', typeof val, val);
    return val;
  },
  z.date({
    errorMap: () => ({ message: 'Invalid date format' })
  })
);

/**
 * Optional timestamp schema - same preprocessing but allows null/undefined
 */
export const OptionalFirestoreTimestampSchema = z.preprocess(
  (val) => {
    if (val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length === 0)) {
      return undefined;
    }
    
    // Use same preprocessing as FirestoreTimestampSchema
    if (val && typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') {
      return val.toDate();
    }
    
    if (val instanceof Date) {
      return val;
    }
    
    if (typeof val === 'string') {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    if (typeof val === 'number') {
      return new Date(val);
    }
    
    console.warn('EyeDooApp: Unhandled timestamp type:', typeof val, val);
    return val;
  },
  z.date().optional()
);

// === VALIDATION HELPERS ===

/**
 * Flexible schema for international phone numbers
 * Accepts various formats and normalizes them
 */
export const PhoneSchema = z.string()
  .trim()
  // .min(1, { message: "Phone number cannot be empty." })
  .transform((phone) => phone.replace(/[\s-()]/g, ''))
  .refine((phone) => /^\+?\d{7,15}$/.test(phone), {
    message: "Please enter a valid phone number with 7 to 15 digits, optionally starting with a '+'.",
  });

/**
 * Schema specifically for UK postcodes
 * Validates against standard UK postcode formats
 */
export const UKPostcodeSchema = z.string()
  .trim()
  .toUpperCase()
  .refine((postcode) => /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i.test(postcode), {
    message: "Invalid UK postcode format.", 
  });

/**
 * Time format validation (HH:MM)
 * Used across timeline and location schemas
 */
export const TimeFormatSchema = z.string()
  .regex(/^\d{2}:\d{2}$/, 'Must be in HH:MM format');

/**
 * Standard notes field with consistent length limits
 */
export const NotesSchema = z.string()
  .max(300, 'Notes must be under 300 characters')
  .optional();

/**
 * Standard name field with consistent validation
 */
export const NameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be under 100 characters');

// === CORE SCHEMAS ===

/**
 * Person information schema for couples
 * Used in essential info forms
 */
export const PersonInfoSchema = z.object({
  preferredPronouns: z.nativeEnum(Pronoun)
    .default(Pronoun.PREFER_NOT_TO_SAY)
    .describe('Pronouns used for this person'),
  
  firstName: NameSchema
    .describe('First name of the person'),
  
  surname: z.string()
    .max(50, 'Surname must be under 50 characters')
    .optional()
    .describe('Surname of the person'),
  
  contactEmail: z.string()
    .email('Enter a valid email')
    .describe('Email address'),
  
  contactPhone: PhoneSchema
    .optional()
    .describe('Phone number (optional)'),
});

/**
 * Location information schema
 * Used for venues and event locations
 */
export const LocationInfoSchema = z.object({
  locationType: z.nativeEnum(LocationType)
    .default(LocationType.MAIN_VENUE)
    .describe('Type of location for the event'),
  
  locationAddress: z.string()
    .max(200, 'Address is too long')
    .optional()
    .describe('Address of the location'),
  
  locationPostcode: UKPostcodeSchema
    .optional()
    .describe('Postcode of the location'),
  
  arriveTime: TimeFormatSchema
    .optional()
    .describe('Arrival time at this location'),
  
  leaveTime: TimeFormatSchema
    .optional()
    .describe('Departure time from this location'),
  
  locationContactPerson: NameSchema
    .optional()
    .describe('Contact person name'),
  
  locationContactPhone: PhoneSchema
    .optional()
    .describe('Contact phone number'),
  
  locationNotes: NotesSchema
    .describe('Additional notes about this location'),
});

// /**
//  * Timeline event schema
//  * Used for scheduling and event planning
//  */
// export const TimelineEventSchema = z.object({
//   id: z.string().optional(),  
//   time: FirestoreTimestampSchema.describe('Time of the event'),
//   eventType: z.nativeEnum(TimelineEventType).describe('Type of event'),
//   description: z.string().max(100, 'Description must be under 100 characters').optional().describe('Description of the event'),
//     location: z.string()
//     .max(100, 'Location must be under 100 characters')
//     .optional()
//     .describe('Location of the event'),  
//   priority: z.nativeEnum(ImportanceLevel)
//     .default(ImportanceLevel.MEDIUM)
//     .describe('Importance level of the event'),  
//   notification: z.nativeEnum(NotificationType)
//     .default(NotificationType.NONE)
//     .describe('Notification type for the event'),
//   duration: z.number().positive().optional().describe('Duration of the event in minutes')
// });

/**
 * Person with role schema
 * Used for family and wedding party members
 */
export const PersonWithRoleSchema = z.object({
  id: z.string().optional(),
  
  name: NameSchema
    .describe('Name of the person'),
  
  role: z.string()
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role must be under 100 characters')
    .optional()
    .describe('Role or title of this person'),
  
  relationshipToCouple: z.nativeEnum(RelationshipToCouple)
    .optional()
    .describe('Relationship to the couple'),
  
  notes: NotesSchema
    .describe('Additional notes about this person')
});

/**
 * Other key person schema
 * Used for vendors and important contacts
 */
export const OtherKeyPersonSchema = z.object({
  id: z.string().optional(),
  
  typeOfContact: z.nativeEnum(ContactType)
    .describe('Type of contact/vendor'),
  
  name: NameSchema
    .describe('Name of the key person'),
  
  contactDetails: z.string()
    .max(300, 'Contact details must be under 300 characters')
    .optional()
    .describe('Additional contact details')
});

// === PHOTO SCHEMAS ===

/**
 * Base photo schema with common fields
 * Extended by specific photo type schemas
 */
const BasePhotoSchema = z.object({
  id: z.string().optional(),
  
  title: z.string()
    .max(60, 'Title must be under 60 characters')
    .optional()
    .describe('Title or name for this shot'),
  
  location: z.string()
    .max(100, 'Location must be under 100 characters')
    .optional()
    .describe('Specific location for this shot'),
  
  notes: z.string()
    .max(200, 'Notes must be under 200 characters')
    .optional()
    .describe('Additional notes about this shot'),
  
  importance: z.nativeEnum(ImportanceLevel)
    .default(ImportanceLevel.MEDIUM)
    .describe('Importance level of this shot'),
  
  alwaysInclude: z.boolean()
    .optional()
    .default(false)
    .describe('Whether this shot should always be included')
});



/**
 * Couple shot schema
 * For romantic couple photography
 */
export const CoupleShotSchema = BasePhotoSchema.extend({
  coupleShotType: z.nativeEnum(CoupleShotCategory)
    .default(CoupleShotCategory.OTHER)
    .describe('Category of couple shot'),
});

/**
 * Candid shot schema
 * For natural, unposed photography
 */
export const CandidShotSchema = BasePhotoSchema.extend({
  candidShotType: z.nativeEnum(CandidShotCategory)
    .default(CandidShotCategory.OTHER)
    .describe('Category of candid shot'),
});

/**
 * General photo request schema
 * For miscellaneous photo requirements
 */
export const PhotoRequestSchema = z.object({
  id: z.string().optional(),
  
  photoRequestType: z.nativeEnum(PhotoRequestType)
    .default(PhotoRequestType.OTHER)
    .describe('Type of photo request'),
  
  title: z.string()
    .max(60, 'Title must be under 60 characters')
    .optional()
    .describe('Title of the photo request'),
  
  location: z.string()
    .max(100, 'Location must be under 100 characters')
    .optional()
    .describe('Location for this photo'),
  
  notes: z.string()
    .max(200, 'Notes must be under 200 characters')
    .optional()
    .describe('Additional notes about this request'),
  
  importance: z.nativeEnum(ImportanceLevel)
    .default(ImportanceLevel.MEDIUM)
    .describe('Importance level of this request')
});



