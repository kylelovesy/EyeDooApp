/*-------------------------------------*/
// types/coupleShotsChecklist.ts
// Status: Updated
// What it does: 
// Modifies the CoupleShotChecklistItemSchema to use a 'categoryId' string,
// allowing items to be associated with dynamic, user-created categories.
/*-------------------------------------*/

import { z } from 'zod';

/**
 * Zod schema for a single item in the user's group shot checklist.
 */
export const CoupleShotsChecklistItemSchema = z.object({
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
export const MasterCoupleShotsListSchema = z.array(z.object({
    id: z.string(),
    displayName: z.string(),
    isPredefined: z.boolean(),
}));

// Inferred TypeScript types
export type TCoupleShotsChecklistItem = z.infer<typeof CoupleShotsChecklistItemSchema>;
export type TMasterCoupleShotsCategory = z.infer<typeof MasterCoupleShotsListSchema>[number];