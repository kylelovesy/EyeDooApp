import { Timestamp } from 'firebase/firestore';
import { z } from "zod";
import { CANDID_SHOT_CATEGORIES, CONTACT_TYPES, COUPLE_SHOT_CATEGORIES, GROUP_SHOT_CATEGORIES, LOCATION_TYPES, PHOTO_REQUEST_TYPES, PRONOUNS, RELATIONSHIP_TO_COUPLE } from "./enum";

// A flexible schema for international phone numbers
export const PhoneSchema = z.string().trim().min(1, { message: "Phone number cannot be empty." }).transform((phone) => phone.replace(/[\s-()]/g, '')).refine((phone) => /^\+?\d{7,15}$/.test(phone), {
    message: "Please enter a valid phone number with 7 to 15 digits, optionally starting with a '+'.",
});

// A schema specifically for UK postcodes
export const UKPostcodeSchema = z.string().trim().toUpperCase().refine((postcode) => /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i.test(postcode), {
    message: "Invalid UK postcode format.", 
});

//Couple Info
// Need to sort phone number schema out
export const PersonInfoSchema = z.object({
    preferredPronouns: z.enum(PRONOUNS).optional().default('Prefer not to say').describe('Pronouns used for this person'),
    firstName: z.string().min(1, 'First name is required').max(50).describe('First name of the person'),
    surname: z.string().max(50).optional().describe('Surname of the person'),
    contactEmail: z.string().email('Enter a valid email').describe('Email address'),
    contactPhone: PhoneSchema.optional().describe('Phone number (optional)'),
  });


  //LOCATION INFO
  // Need to sort phone number & postcode schema out
  export const LocationInfoSchema = z.object({
    locationType: z.enum(LOCATION_TYPES).describe('Type of location for the event').default('Main Venue'),
    locationAddress: z.string().min(5, 'Address is too short').max(200, 'Address is too long').optional().describe('Address of the location'),
    locationPostcode: UKPostcodeSchema.optional().describe('Postcode of the location'),
    arriveTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be in HH:MM format').optional().describe('Arrival time of the event'),
    leaveTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be in HH:MM format').optional().describe('Departure time of the event'),
    locationContactPerson: z.string().max(100, 'Contact person name is too long').optional().describe('Contact person name'),
    locationContactPhone: z.string().max(20, 'Phone number is too long').optional().describe('Contact phone number'),
  });

  //Timeline Info
  export const TimelineEventSchema = z.object({
    id: z.string().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be in HH:MM format').describe('Time of the event'),
    // time: z.FirestoreTimestampSchema.describe('Time of the event'),
    description: z.string().min(2, 'Description must be at least 2 characters').max(100, 'Description must be under 100 characters').describe('Description of the event'),
    location: z.string().max(100).optional().describe('Location of the event'),
    notes: z.string().max(200, 'Notes must be under 200 characters').optional().describe('Additional notes about this event'),
    icon: z.string().optional().describe('Icon for the event').default('calendar'),
    iconColor: z.string().optional().describe('Hex color string for the icon'),
    priority: z.number().describe('Priority of the event').optional().default(1),
    notification: z.boolean().describe('Notification for the event').optional().default(false),
    duration: z.number().optional().describe('Duration of the event in minutes').optional().default(30)
  });

  export const PersonWithRoleSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
    role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role must be under 100 characters').optional(),
    relationshipToCouple: z.enum(RELATIONSHIP_TO_COUPLE).optional(),
    notes: z.string().max(300, 'Notes must be under 300 characters').optional()
  });

  //OTHER KEY PERSON
  export const OtherKeyPersonSchema = z.object({
    id: z.string().optional(),
    typeOfContact: z.enum(CONTACT_TYPES).describe('Persons Role Type'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters').describe('Name of the key person'),
    contactDetails: z.string().max(300, 'Contact details must be under 300 characters').optional().describe('Additional contact details about this person')
  });

  //PHOTOS
  //Group Shot
export const GroupShotSchema = z.object({
    id: z.string().optional(),
    groupShotType: z.enum(GROUP_SHOT_CATEGORIES).describe('Type of group shot').default('Other'),
    groupName: z.string().max(60, 'Group name is too long').optional().describe('Name of the group'),
    groupDescription: z.string().max(100, 'Group description is too long').optional().describe('Description of the group'),
    groupMembers: z.array(z.string()).optional().describe('Members of the group'),
    optionalNotes: z.string().max(200, 'Optional notes must be under 200 characters').optional().describe('Additional notes about this group shot'),
    importance: z.enum(['low', 'medium', 'high']).optional().describe('Importance of the group shot').default('medium'),
    alwaysInclude: z.boolean().optional().describe('Always include this group shot').default(false)
  });

//Couple Shot
export const CoupleShotSchema = z.object({
    id: z.string().optional(),
    coupleShotType: z.enum(COUPLE_SHOT_CATEGORIES).describe('Type of couple shot').default('Other'),
    title: z.string().max(60, 'Title is too long').optional().describe('Title of the couple shot'),
    location: z.string().max(100, 'Location is too long').optional().describe('Location of the couple shot'),
    notes: z.string().max(200, 'Notes must be under 200 characters').optional().describe('Additional notes about this couple shot'),
    importance: z.enum(['low', 'medium', 'high']).optional().describe('Importance of the couple shot').default('medium'),
    alwaysInclude: z.boolean().optional().describe('Always include this couple shot').default(false)
  });

//Candid Shot
export const CandidShotSchema = z.object({
    id: z.string().optional(),
    candidShotType: z.enum(CANDID_SHOT_CATEGORIES).describe('Type of candid shot').default('Other'),
    title: z.string().max(60, 'Title is too long').optional().describe('Title of the candid shot'),
    location: z.string().max(100, 'Location is too long').optional().describe('Location of the candid shot'),
    notes: z.string().max(200, 'Notes must be under 200 characters').optional().describe('Additional notes about this candid shot'),
    importance: z.enum(['low', 'medium', 'high']).optional().describe('Importance of the candid shot').default('medium'),
    alwaysInclude: z.boolean().optional().describe('Always include this candid shot').default(false)
  });
//Photo Request
export const PhotoRequestSchema = z.object({
    id: z.string().optional(),
    photoRequestType: z.enum(PHOTO_REQUEST_TYPES).describe('Type of photo request').default('Other'),
    title: z.string().max(60, 'Title is too long').optional().describe('Title of the photo request'),
    location: z.string().max(100, 'Location is too long').optional().describe('Location of the photo request'),
    notes: z.string().max(200, 'Notes must be under 200 characters').optional().describe('Additional notes about this photo request'),
    importance: z.enum(['low', 'medium', 'high']).optional().describe('Importance of the photo request').default('medium')
  });

// A reusable Zod schema to validate that a value is a Firestore Timestamp.
// This is for data coming FROM Firestore.
export const FirestoreTimestampSchema = z.custom<Timestamp>(
    (val) => val instanceof Timestamp,
    { message: "Invalid Firestore Timestamp" }
  );


