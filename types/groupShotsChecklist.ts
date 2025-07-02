/*-------------------------------------*/
// types/groupShotsChecklist.ts
// Status: Updated
// What it does: 
// Modifies the GroupShotChecklistItemSchema to use a 'categoryId' string,
// allowing items to be associated with dynamic, user-created categories.
/*-------------------------------------*/

import { z } from 'zod';

/**
 * Zod schema for a single item in the user's group shot checklist.
 */
export const GroupShotsChecklistItemSchema = z.object({
  id: z.string().describe("The unique task ID (UUID)."),
  categoryId: z.string().describe("The ID of the category this task belongs in."),
  name: z.string().min(1, "Task name cannot be empty."),
  isPredefined: z.boolean().default(false),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
});

/**
 * Zod schema for the user's master group shot list.
 */
export const MasterGroupShotsListSchema = z.array(z.object({
    id: z.string(),
    displayName: z.string(),
    isPredefined: z.boolean(),
}));

// Inferred TypeScript types
export type TGroupShotsChecklistItem = z.infer<typeof GroupShotsChecklistItemSchema>;
export type TMasterGroupShotsCategory = z.infer<typeof MasterGroupShotsListSchema>[number];