import { z } from "zod";
import { EventStyle, ProjectStatus, ProjectType } from "./enum";
import { FirestoreTimestampSchema, LocationInfoSchema, PersonInfoSchema } from "./reusableSchemas";

/**
 * Form 1: Essential Info Schema
 * Defines the structure for the data collected in the first step of project creation.
 * This schema does NOT include top-level document fields like 'id' or 'userId'.
 */
export const form1EssentialInfoSchema = z.object({
  projectName: z.string()
    .max(100, 'Project name must be under 100 characters')
    .describe('Name of the project'),
  
  projectType: z.nativeEnum(ProjectType)
    .default(ProjectType.WEDDING)
    .describe('Type of project'),
  
  projectStatus: z.nativeEnum(ProjectStatus)
    .default(ProjectStatus.DRAFT)
    .describe('Status of the project'),
  
  personA: PersonInfoSchema
    .describe('Couple Person A'),
  
  personB: PersonInfoSchema
    .describe('Couple Person B'),
  
  sharedEmail: z.string()
    .optional()
    .describe('Shared email address for the couple'),
  
  eventStyle: z.nativeEnum(EventStyle)
    .default(EventStyle.MODERN)
    .describe('Style of the event'),
  
  eventDate: FirestoreTimestampSchema
    .describe('Date of the event'),
  
  locations: z.array(LocationInfoSchema)
    .min(1, 'At least one location is required')
    .describe('Event locations'),
  
  notes: z.string()
    .max(500, 'Notes must be under 500 characters')
    .optional()
    .describe('Additional notes about the project'),
});

export type Form1EssentialInfo = z.infer<typeof form1EssentialInfoSchema>;
