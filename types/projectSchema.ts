import { z } from "zod";
import { form1EssentialInfoSchema } from "./project-EssentialInfoSchema";
import { form3PeopleSchema } from "./project-PersonaSchema";
import { form4PhotosSchema } from "./project-PhotosSchema";
import { FirestoreTimestampSchema } from "./reusableSchemas";
//TIMELINE
import { KitChecklistItemSchema } from "./kitChecklist";
import { CombinedEventsTimelineSchema } from "./timeline";

/**
 * Complete Project Schema
 * This is the single source of truth for a project's structure in Firestore.
 * Includes all server-generated fields and nested form data.
 */
export const ProjectSchema = z.object({
  // Server-generated fields
  id: z.string().describe('Firestore document ID'),
  userId: z.string().describe('ID of the project owner'),
  createdAt: FirestoreTimestampSchema.optional().nullable(),
  updatedAt: FirestoreTimestampSchema.optional().nullable(),
  
  // Form data - each form's data is nested under its own key
  form1: form1EssentialInfoSchema.describe('Essential project information'),
  timeline: CombinedEventsTimelineSchema.describe('Project timeline data'),
  form3: form3PeopleSchema.describe('People involved in the project'),
  form4: form4PhotosSchema.describe('Photo requirements and requests'),
  kitChecklist: KitChecklistItemSchema.optional().describe('Photographer\'s kit checklist'),
  // taskChecklist: TaskChecklistSchema.optional().describe('Photographer\'s task checklist'),
});

/**
 * Create Project Schema
 * Used when creating a NEW project. Omits server-generated fields.
 */
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  userId: true, // Omit userId, as it's added by the service from the authenticated user.
  createdAt: true,
  updatedAt: true,
});

/**
 * Update Project Schema
 * Used for updating an EXISTING project. All fields are optional
 * and allows for deep partial updates (e.g., updating only form1.name).
 */
export const UpdateProjectSchema = z.object({
  userId: z.string().optional(),
  projectId: z.string().optional(),
  form1: form1EssentialInfoSchema.partial().optional(),
  timeline: CombinedEventsTimelineSchema.optional(),
  form3: form3PeopleSchema.optional(),
  form4: form4PhotosSchema.optional(),
  kitChecklist: KitChecklistItemSchema.optional(),
  // taskChecklist: TaskChecklistSchema.optional(),
}).partial();

// Export types for use throughout the application
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;