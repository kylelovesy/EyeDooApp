import { z } from "zod";
import { EVENT_STYLES, PROJECT_STATUS, PROJECT_TYPES } from "../new/enum";
import { CandidShotSchema, CoupleShotSchema, FirestoreTimestampSchema, GroupShotSchema, LocationInfoSchema, OtherKeyPersonSchema, PersonInfoSchema, PersonWithRoleSchema, PhotoRequestSchema, TimelineEventSchema } from "./reusableSchemas";
// import { Timestamp, FieldValue, serverTimestamp } from 'firebase/firestore';

// --- Form 1: Essential Info ---
// Schema for the first form step
export const form1EssentialInfoReadSchema = z.object({
    id: z.string().describe('ID of the project'),
    userId: z.string().describe('UserId of project owner'),
    name: z.string().min(3, 'Project name must be at least 3 characters').describe('Name of the project'),
    type: z.enum(PROJECT_TYPES).optional().default('Wedding').describe('Type of project'),
    status: z.enum(PROJECT_STATUS).optional().default('Draft').describe('Status of the project'),
    personA: PersonInfoSchema.describe('Couple Person A'),
    personB: PersonInfoSchema.describe('Couple Person B'),
    sharedEmail: z.string().optional().describe('Shared email address for the couple'),
    style: z.enum(EVENT_STYLES).optional().describe('Style of the event'),
    eventDate: FirestoreTimestampSchema.optional().describe('Date of the event'),
    createdAt: FirestoreTimestampSchema.optional().describe('Date and time the project was created'),
    updatedAt: FirestoreTimestampSchema.optional().describe('Date and time the project was last updated'),
    locations: z.array(LocationInfoSchema).describe('Locations of the event'),
    notes: z.string().optional().describe('Additional notes about the project'),
  });
  
  export const form1EssentialInfoCreateSchema = form1EssentialInfoReadSchema.omit({ id: true, createdAt: true, updatedAt: true });
  export const form1EssentialInfoUpdateSchema = form1EssentialInfoCreateSchema.partial();

  // --- Form 2: Timeline ---
  // Schema for the second form step
  export const form2TimelineReadSchema = z.object({    
    events: z.array(TimelineEventSchema).describe('Timeline events of the project'),
  });
  
  export const form2TimelineCreateSchema = form2TimelineReadSchema;
  export const form2TimelineUpdateSchema = form2TimelineCreateSchema.partial();

  // --- Form 3: People ---
  // Schema for the third form step
  export const form3PeopleReadSchema = z.object({
    immediateFamily: z.array(PersonWithRoleSchema).optional(),
    extendedFamily: z.array(PersonWithRoleSchema).optional(),
    weddingParty: z.array(PersonWithRoleSchema).optional(),
    otherKeyPeople: z.array(OtherKeyPersonSchema).optional(),
    familySituations: z.boolean().optional().describe('Are there any family situations that need to be considered?').default(false),
    familySituationsNotes: z.string().max(300, 'Notes must be under 300 characters').optional().describe('Additional notes about family situations'),
    guestsToAvoid: z.boolean().optional().describe('Are there any guests that need to be avoided?').default(false),
    guestsToAvoidNotes: z.string().max(300, 'Notes must be under 300 characters').optional().describe('Additional notes about guests to avoid'),
    surprises: z.boolean().optional().describe('Are there any surprises that need to be considered?').default(false),
    surprisesNotes: z.string().max(300, 'Notes must be under 300 characters').optional().describe('Additional notes about surprises'),
  });
  export const form3PeopleCreateSchema = form3PeopleReadSchema;
  export const form3PeopleUpdateSchema = form3PeopleCreateSchema.partial();

  // --- Form 4: Photos ---
  // Schema for the fourth form step
  export const form4PhotosReadSchema = z.object({    
    groupShots: z.array(GroupShotSchema).optional().describe('Group shots to be taken'),
    coupleShots: z.array(CoupleShotSchema).optional().describe('Couple shots to be taken'),
    candidShots: z.array(CandidShotSchema).optional().describe('Candid shots to be taken'),
    photoRequests: z.array(PhotoRequestSchema).optional().describe('Photo requests to be taken'),
    mustHaveMoments: z.array(PhotoRequestSchema).optional().describe('Must have moments to be taken'),
    sentimentalMoments: z.array(PhotoRequestSchema).optional().describe('Sentimental moments to be taken'),
  });
  export const form4PhotosCreateSchema = form4PhotosReadSchema;
  export const form4PhotosUpdateSchema = form4PhotosCreateSchema.partial();

  export const CombinedProjectReadSchema = z.object({
    form1: form1EssentialInfoReadSchema,
    form2: form2TimelineReadSchema,
    form3: form3PeopleReadSchema,
    form4: form4PhotosReadSchema,
  });

  export const CombinedProjectCreateSchema = z.object({
    form1: form1EssentialInfoCreateSchema,
    form2: form2TimelineCreateSchema,
    form3: form3PeopleCreateSchema,
    form4: form4PhotosCreateSchema,
  });

  export const CombinedProjectUpdateSchema = CombinedProjectReadSchema.partial();