// ######################################################################
// # FILE: src/types/questionnaire.ts
// ######################################################################

import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// ## CONSTANTS

const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Other', 'Prefer not to say'] as const;
const LOCATION_TYPES = ['Main Venue', 'Ceremony', 'Getting Ready Location A', 'Getting Ready Location B', 'Reception', 'Other'] as const;
const CONTACT_TYPES = ['Officiant', 'Wedding Planner', 'Videographer', 'DJ/Band', 'Other'] as const;

// ## HELPER SCHEMAS

// Helper for Firestore Timestamp validation and conversion
const FirestoreTimestamp = z.union([
  z.date(),
  z.custom<Timestamp>((val) => val instanceof Timestamp, { 
    message: 'Must be a valid date or Firestore Timestamp' 
  })
]).transform((val) => val instanceof Timestamp ? val.toDate() : val);

// More flexible phone number validation
const PhoneSchema = z.string()
  .regex(/^[\+]?[0-9\s\-\(\)\.]{7,}$/, 'Invalid phone number format')
  .optional();

// Flexible ID schema - allows auto-generation
const OptionalIdSchema = z.string().optional();

// ## REUSABLE SUB-SCHEMAS

export const PersonInfoSchema = z.object({
  preferredPronouns: z.enum(PRONOUNS).optional(),
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: PhoneSchema,
}).refine(data => data.contactEmail || data.contactPhone, {
  message: "Either email or phone is required",
  path: ["contactEmail"],
});

export const LocationInfoSchema = z.object({
  id: OptionalIdSchema,
  locationType: z.enum(LOCATION_TYPES),
  locationAddress: z.string().min(1, 'Location address is required'),
  arriveTime: z.string().optional(),
  leaveTime: z.string().optional(),
  locationContactPerson: z.string().optional(),
  locationContactPhone: PhoneSchema,
  locationNotes: z.string().optional(),
});

export const WeddingPartyMemberSchema = z.object({
  id: OptionalIdSchema,
  fullName: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Role is required'),
  relationshipToCouple: z.string().optional(),
});

export const OtherKeyPersonSchema = z.object({
  id: OptionalIdSchema,
  typeOfContact: z.enum(CONTACT_TYPES),
  name: z.string().min(1, 'Name is required'),
  contactDetails: z.string().optional(),
});

export const GroupShotSchema = z.object({
  id: OptionalIdSchema,
  groupDescription: z.string().min(1, 'Group description is required'),
  optionalNotes: z.string().optional(),
});

export const TimelineEventSchema = z.object({
  id: OptionalIdSchema,
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  location: z.string().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  icon: z.string().optional(),
  iconColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color format').optional(),
  priority: z.number().min(1).max(5).default(3),
  notification: z.boolean().default(false),
  duration: z.number().positive().optional(), // Duration in minutes
});

// ## QUESTIONNAIRE SCHEMAS

// Questionnaire A: Essential Information
export const QuestionnaireASchema = z.object({
  title: z.string().min(1, 'Title is required.').max(200, 'Title cannot exceed 200 characters.'),
  personA: PersonInfoSchema,
  personB: PersonInfoSchema,
  sharedEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  weddingVibe: z.string().optional(),
  weddingDate: FirestoreTimestamp,
  locations: z.array(LocationInfoSchema).optional(),
  additionalNotes: z.string().optional(),
});

// Questionnaire B: Timeline Planning
export const QuestionnaireBSchema = z.object({
  events: z.array(TimelineEventSchema).optional(),
});

// Questionnaire C: People, Roles and Notes
export const QuestionnaireCSchema = z.object({
  parentsA: z.string().optional(),
  parentsB: z.string().optional(),
  grandparentsA: z.string().optional(),
  grandparentsB: z.string().optional(),
  weddingParty: z.array(WeddingPartyMemberSchema).optional(),
  otherKeyPeople: z.array(OtherKeyPersonSchema).optional(),
  familySituations: z.boolean().default(false),
  familySituationsNotes: z.string().optional(),
  guestsToAvoid: z.boolean().default(false),
  guestsToAvoidNotes: z.string().optional(),
  surprises: z.boolean().default(false),
  surprisesNotes: z.string().optional(),
});

// Questionnaire D: Photography Plan
export const QuestionnaireDSchema = z.object({
  mustHaveMoments: z.string().optional(),
  sentimentalItems: z.string().optional(),
  requestedShots: z.string().optional(),
  groupShots: z.array(GroupShotSchema).optional(),
  coupleShotIdeas: z.string().optional(),
  generalShotRequests: z.string().optional(),
});

// ## MAIN QUESTIONNAIRE SCHEMA

export const QuestionnaireSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'), // Remove UUID requirement
  createdAt: FirestoreTimestamp.default(() => new Date()),
  updatedAt: FirestoreTimestamp.default(() => new Date()),
  version: z.string().default('1.0'),
  questionnaireA: QuestionnaireASchema.optional(),
  // timeline: z.array(TimelineEventSchema).optional(),
  questionnaireB: QuestionnaireBSchema.optional(),
  questionnaireC: QuestionnaireCSchema.optional(),
  questionnaireD: QuestionnaireDSchema.optional(),  
}).refine(data => {
  // Ensure at least one questionnaire section is filled
  return data.questionnaireA || data.questionnaireB || data.questionnaireC || data.questionnaireD;
}, {
  message: "At least one questionnaire section must be completed",
});

// Schemas for creating/updating individual sections
export const CreateQuestionnaireASchema = QuestionnaireASchema;
export const CreateQuestionnaireBSchema = QuestionnaireBSchema;
export const CreateQuestionnaireCSchema = QuestionnaireCSchema;
export const CreateQuestionnaireDSchema = QuestionnaireDSchema;
export const CreateTimelineEventSchema = TimelineEventSchema.omit({ id: true });

// Update schemas (all fields optional)
export const UpdateQuestionnaireASchema = QuestionnaireASchema.partial();
export const UpdateQuestionnaireBSchema = QuestionnaireBSchema.partial();
export const UpdateQuestionnaireCSchema = QuestionnaireCSchema.partial();
export const UpdateQuestionnaireDSchema = QuestionnaireDSchema.partial();
export const UpdateTimelineEventSchema = TimelineEventSchema.partial();

// ## TYPE EXPORTS

export type PersonInfo = z.infer<typeof PersonInfoSchema>;
export type LocationInfo = z.infer<typeof LocationInfoSchema>;
export type WeddingPartyMember = z.infer<typeof WeddingPartyMemberSchema>;
export type OtherKeyPerson = z.infer<typeof OtherKeyPersonSchema>;
export type GroupShot = z.infer<typeof GroupShotSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export type QuestionnaireA = z.infer<typeof QuestionnaireASchema>;
export type QuestionnaireB = z.infer<typeof QuestionnaireBSchema>;
export type QuestionnaireC = z.infer<typeof QuestionnaireCSchema>;
export type QuestionnaireD = z.infer<typeof QuestionnaireDSchema>;
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// Create types (for new entries)
export type CreateQuestionnaireA = z.infer<typeof CreateQuestionnaireASchema>;
export type CreateQuestionnaireB = z.infer<typeof CreateQuestionnaireBSchema>;
export type CreateQuestionnaireC = z.infer<typeof CreateQuestionnaireCSchema>;
export type CreateQuestionnaireD = z.infer<typeof CreateQuestionnaireDSchema>;
export type CreateTimelineEvent = z.infer<typeof CreateTimelineEventSchema>;

// Update types (for existing entries)
export type UpdateQuestionnaireA = z.infer<typeof UpdateQuestionnaireASchema>;
export type UpdateQuestionnaireB = z.infer<typeof UpdateQuestionnaireBSchema>;
export type UpdateQuestionnaireC = z.infer<typeof UpdateQuestionnaireCSchema>;
export type UpdateQuestionnaireD = z.infer<typeof UpdateQuestionnaireDSchema>;
export type UpdateTimelineEvent = z.infer<typeof UpdateTimelineEventSchema>;

// Export constants for use in components
export { CONTACT_TYPES, LOCATION_TYPES, PRONOUNS };


// // ######################################################################
// // # FILE: src/types/questionnaire.ts
// // ######################################################################

// import { Timestamp } from 'firebase/firestore';
// import { z } from 'zod';

// // ## REUSABLE SUB-SCHEMAS

// const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Other', 'Prefer not to say'] as const;
// const LOCATION_TYPES = ['Main Venue', 'Ceremony', 'Getting Ready Location A', 'Getting Ready Location B', 'Reception', 'Other'] as const;

// export const PersonInfoSchema = z.object({
//   preferredPronouns: z.enum(PRONOUNS).optional(),
//   firstName: z.string().min(1, 'First name is required'),
//   surname: z.string().optional(),
//   contactEmail: z.string().email('Invalid email address'),
//   contactPhone: z.string()
//     .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')
//     .optional(),
// }).refine(data => data.contactEmail || data.contactPhone, {
//   message: "Either email or phone is required",
//   path: ["contactEmail"],
// });

// export const LocationInfoSchema = z.object({
//   id: z.string().uuid().optional(),
//   locationType: z.enum(LOCATION_TYPES),
//   locationAddress: z.string().min(1, 'Location address is required'),
//   arriveTime: z.string().optional(),
//   leaveTime: z.string().optional(),
//   locationContactPerson: z.string().optional(),
//   locationContactPhone: z.string().optional(),
//   locationNotes: z.string().optional(),
// });

// export const WeddingPartyMemberSchema = z.object({
//     id: z.string().uuid().optional(),
//     fullName: z.string().min(1, 'Full name is required'),
//     role: z.string().min(1, 'Role is required'),
//     relationshipToCouple: z.string().optional(),
// });

// export const OtherKeyPersonSchema = z.object({
//     id: z.string().uuid().optional(),
//     typeOfContact: z.enum(['Officiant', 'Wedding Planner', 'Videographer', 'DJ/Band', 'Other']),
//     name: z.string().min(1, 'Name is required'),
//     contactDetails: z.string().optional(),
// });

// export const GroupShotSchema = z.object({
//     id: z.string().uuid().optional(),
//     groupDescription: z.string().min(1, 'Group description is required'),
//     optionalNotes: z.string().optional(),
// });

// export const TimelineEventSchema = z.object({
//     id: z.string().uuid().optional(),
//     time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
//     description: z.string().min(1, 'Description is required').max(500),
//     location: z.string().optional(),
//     notes: z.string().max(1000).optional(),
//     icon: z.string().optional(),
//     iconColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
//     priority: z.number().min(1).max(5).default(3),
//     notification: z.boolean().default(false),
//     duration: z.number().positive().optional(), // Duration in minutes
// });

// // Add a helper for date conversion
// const FirestoreDate = z.union([
//   z.date(),
//   z.custom<Timestamp>((val) => val instanceof Timestamp)
// ]).transform((val) => val instanceof Timestamp ? val.toDate() : val);

// // Questionnaire A: Essential Information
// /**
//  * @schema QuestionnaireASchema
//  * @description Zod schema for validating QuestionnaireA.
//  */
// export const QuestionnaireASchema = z.object({
//   title: z.string().min(1, 'Title is required.').max(200, 'Title cannot exceed 200 characters.'),
//   personA: PersonInfoSchema,
//   personB: PersonInfoSchema,
//   sharedEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
//   weddingVibe: z.string().optional(),
//   weddingDate: FirestoreDate,
//   locations: z.array(LocationInfoSchema).optional(),
//   additionalNotes: z.string().optional(),
// });

// // Questionnaire B: Timeline (Handled separately)
// /**
//  * @schema QuestionnaireBSchema
//  * @description Zod schema for validating QuestionnaireB.
//  */
// export const QuestionnaireBSchema = z.object({
//   startDate: z.date(),
//   endDate: z.date(),
//   milestones: z.array(z.string()).optional(),
// });

// // Questionnaire C: People, Roles and Notes
// /**
//  * @schema QuestionnaireCSchema
//  * @description Zod schema for validating QuestionnaireC.
//  */
// export const QuestionnaireCSchema = z.object({
//   parentsA: z.string().optional(),
//   parentsB: z.string().optional(),
//   grandparentsA: z.string().optional(),
//   grandparentsB: z.string().optional(),
//   weddingParty: z.array(WeddingPartyMemberSchema).optional(),
//   otherKeyPeople: z.array(OtherKeyPersonSchema).optional(),
//   familySituations: z.boolean().default(false),
//   familySituationsNotes: z.string().optional(),
//   guestsToAvoid: z.boolean().default(false),
//   guestsToAvoidNotes: z.string().optional(),
//   surprises: z.boolean().default(false),
//   surprisesNotes: z.string().optional(),
// });

// // Questionnaire D: Photography Plan
// /**
//  * @schema QuestionnaireDSchema
//  * @description Zod schema for validating QuestionnaireD.
//  */
// export const QuestionnaireDSchema = z.object({
//   mustHaveMoments: z.string().optional(),
//   sentimentalItems: z.string().optional(),
//   requestedShots: z.string().optional(),
//   groupShots: z.array(GroupShotSchema).optional(),
//   coupleShotIdeas: z.string().optional(),
//   generalShotRequests: z.string().optional(),
  
// });

// // ## FULL QUESTIONNAIRE SCHEMA

// export const QuestionnaireSchema = z.object({
//   projectId: z.string().uuid(),
//   createdAt: z.date().default(() => new Date()),
//   updatedAt: z.date().default(() => new Date()),
//   version: z.string().default('1.0'),
//   questionnaireA: QuestionnaireASchema.optional(),
//   timeline: z.array(TimelineEventSchema).optional(),
//   questionnaireB: QuestionnaireBSchema.optional(),
//   questionnaireC: QuestionnaireCSchema.optional(),
//   questionnaireD: QuestionnaireDSchema.optional(),
// }).refine(data => {
//   // Ensure at least one questionnaire section is filled
//   return data.questionnaireA || data.questionnaireB || data.questionnaireC || data.questionnaireD;
// }, {
//   message: "At least one questionnaire section must be completed",
// });

// export type QuestionnaireA = z.infer<typeof QuestionnaireASchema>;
// export type QuestionnaireB = z.infer<typeof QuestionnaireBSchema>;
// export type QuestionnaireC = z.infer<typeof QuestionnaireCSchema>;
// export type QuestionnaireD = z.infer<typeof QuestionnaireDSchema>;
// export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
// export type WeddingPartyMember = z.infer<typeof WeddingPartyMemberSchema>;
// export type OtherKeyPerson = z.infer<typeof OtherKeyPersonSchema>;
// export type GroupShot = z.infer<typeof GroupShotSchema>;
// export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// export type PersonInfo = z.infer<typeof PersonInfoSchema>;
// export type LocationInfo = z.infer<typeof LocationInfoSchema>;

