import { z } from 'zod';
import { CreateProjectSchema, ProjectSchema, UpdateProjectSchema } from './projectSchema';

/**
 * Re-export project types for easier importing throughout the application
 */

/**
 * The complete Project object, including server-generated fields like id, createdAt, etc.
 * This is the type you'll use when reading data from Firestore.
 */
export type Project = z.infer<typeof ProjectSchema>;

/**
 * The data structure required to create a new project.
 * It excludes server-generated fields.
 */
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

/**
 * The data structure for updating an existing project.
 * All fields are optional, allowing for partial updates.
 */
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// Re-export schemas for validation
export { CreateProjectSchema, ProjectSchema, UpdateProjectSchema } from './projectSchema';

