// ######################################################################
// # FILE: src/types/questionnaire.ts
// ######################################################################

import { z } from 'zod';

// ## REUSABLE SUB-SCHEMAS

export const PersonInfoSchema = z.object({
  preferredPronouns: z.enum(['She/Her', 'He/Him', 'They/Them', 'Other', 'Prefer not to say']).optional(),
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string(),
}).refine(data => data.contactEmail || data.contactPhone, {
  message: "Either Email or Phone is required",
  path: ["contactEmail"],
});

export const LocationInfoSchema = z.object({
  id: z.string().uuid().optional(),
  locationType: z.enum(['Main Venue', 'Ceremony', 'Getting Ready Location A', 'Getting Ready Location B', 'Reception']),
  locationAddress: z.string().min(1, 'Location address is required'),
  arriveTime: z.string().optional(),
  leaveTime: z.string().optional(),
  locationContactPerson: z.string().optional(),
  locationContactPhone: z.string().optional(),
  locationNotes: z.string().optional(),
});

export const WeddingPartyMemberSchema = z.object({
    id: z.string().uuid().optional(),
    fullName: z.string().min(1, 'Full name is required'),
    role: z.string().min(1, 'Role is required'),
    relationshipToCouple: z.string().optional(),
});

export const OtherKeyPersonSchema = z.object({
    id: z.string().uuid().optional(),
    typeOfContact: z.enum(['Officiant', 'Wedding Planner', 'Videographer', 'DJ/Band', 'Other']),
    name: z.string().min(1, 'Name is required'),
    contactDetails: z.string().optional(),
});

export const GroupShotSchema = z.object({
    id: z.string().uuid().optional(),
    groupDescription: z.string().min(1, 'Group description is required'),
    optionalNotes: z.string().optional(),
});

export const VendorInfoSchema = z.object({
    id: z.string().uuid().optional(),
    vendorType: z.enum(['Florist', 'Cake Maker', 'Hair Stylist', 'Makeup Artist', 'Other']),
    name: z.string().min(1, 'Name is required'),
    contactDetails: z.string().optional(),
});


// ## QUESTIONNAIRE SECTION SCHEMAS

// Questionnaire 1: Essential Information
export const EssentialInfoSchema = z.object({
  personA: PersonInfoSchema,
  personB: PersonInfoSchema,
  sharedEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  weddingVibe: z.string().optional(),
  weddingDate: z.date(),
  locations: z.array(LocationInfoSchema).optional(),
});

// Questionnaire 2: Timeline (Handled separately)
export const TimelineEventSchema = z.object({
  id: z.string().optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'), // HH:MM format
  description: z.string().min(1, 'Description is required'),
  location: z.string().optional(),
  notes: z.string().optional(),
});


// Questionnaire 3: People & Roles
export const PeopleAndRolesSchema = z.object({
  parentsA: z.string().optional(),
  parentsB: z.string().optional(),
  grandparentsA: z.string().optional(),
  grandparentsB: z.string().optional(),
  weddingParty: z.array(WeddingPartyMemberSchema).optional(),
  otherKeyPeople: z.array(OtherKeyPersonSchema).optional(),
});

// Questionnaire 4: Photography Plan
export const PhotographyPlanSchema = z.object({
  mustHaveMoments: z.string().optional(),
  sentimentalItems: z.string().optional(),
  requestedShots: z.string().optional(),
  groupShots: z.array(GroupShotSchema).optional(),
  coupleShotIdeas: z.string().optional(),
  generalShotRequests: z.string().optional(),
  familySituations: z.boolean().default(false),
  familySituationsNotes: z.string().optional(),
  guestsToAvoid: z.boolean().default(false),
  guestsToAvoidNotes: z.string().optional(),
  surprises: z.boolean().default(false),
  surprisesNotes: z.string().optional(),
});

// Questionnaire 5: Final Touches
export const FinalTouchesSchema = z.object({
  otherVendors: z.array(VendorInfoSchema).optional(),
  additionalNotes: z.string().optional(),
  referral: z.string().optional(),
});


// ## FULL QUESTIONNAIRE SCHEMA

export const QuestionnaireSchema = z.object({
  projectId: z.string(),
  essentialInfo: EssentialInfoSchema.optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  peopleAndRoles: PeopleAndRolesSchema.optional(),
  photographyPlan: PhotographyPlanSchema.optional(),
  finalTouches: FinalTouchesSchema.optional(),
});

export type EssentialInfo = z.infer<typeof EssentialInfoSchema>;
export type LocationInfo = z.infer<typeof LocationInfoSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type PeopleAndRoles = z.infer<typeof PeopleAndRolesSchema>;
export type WeddingPartyMember = z.infer<typeof WeddingPartyMemberSchema>;
export type OtherKeyPerson = z.infer<typeof OtherKeyPersonSchema>;
export type PhotographyPlan = z.infer<typeof PhotographyPlanSchema>;
export type GroupShot = z.infer<typeof GroupShotSchema>;
export type FinalTouches = z.infer<typeof FinalTouchesSchema>;
export type VendorInfo = z.infer<typeof VendorInfoSchema>;
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// import { z } from 'zod';

// // Define Zod schemas for questionnaire data
// export const TimelineEventSchema = z.object({
//   id: z.string().optional(),
//   time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'), // HH:MM format
//   description: z.string().min(1, 'Description is required'),
//   location: z.string().optional(),
//   notes: z.string().optional(),
// });

// export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// // Key Person Schema
// export const KeyPersonSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(1, 'Name is required'),
//   role: z.string().min(1, 'Role is required'),
//   contact: z.string().optional(),
//   notes: z.string().optional(),
// });

// export type KeyPerson = z.infer<typeof KeyPersonSchema>;

// // Essential Information Schema
// export const EssentialInfoSchema = z.object({
//   weddingDate: z.string().min(1, 'Wedding date is required'),
//   venue: z.string().min(1, 'Venue is required'),
//   coupleNames: z.string().min(1, 'Couple names are required'),
//   contactNumber: z.string().min(1, 'Contact number is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   // Add other essential fields as needed
// });

// export type EssentialInfo = z.infer<typeof EssentialInfoSchema>;

// // Photography Plan Schema
// export const PhotographyPlanSchema = z.object({
//   shotListPreferences: z.string().optional(),
//   specialMoments: z.array(z.string()).optional(),
//   photographyStyle: z.string().optional(),
//   equipmentNeeds: z.string().optional(),
//   lightingPreferences: z.string().optional(),
//   groupShotsList: z.string().optional(),
//   specialRequests: z.string().optional(),
// });

// export type PhotographyPlan = z.infer<typeof PhotographyPlanSchema>;

// // Main Questionnaire Schema (can be expanded later)
// export const QuestionnaireSchema = z.object({
//   projectId: z.string(),
//   essentialInfo: EssentialInfoSchema.optional(),
//   timeline: z.array(TimelineEventSchema).optional(),
//   keyPeople: z.array(KeyPersonSchema).optional(),
//   photographyPlan: PhotographyPlanSchema.optional(),
// });

// export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// // Example of a question type (can be expanded)
// export const QuestionSchema = z.object({
//   id: z.string(),
//   text: z.string(),
//   type: z.enum(['text', 'number', 'date', 'select', 'multiselect']),
//   options: z.array(z.string()).optional(),
//   required: z.boolean().default(false),
// });

// export type Question = z.infer<typeof QuestionSchema>;

// // Example of a section type (can be expanded)
// export const SectionSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   questions: z.array(QuestionSchema),
// });

// export type Section = z.infer<typeof SectionSchema>;