/*-------------------------------------*/
// types/kitChecklist.ts
// Status: Updated
// What it does: 
// Modifies the KitChecklistItemSchema to use a 'categoryId' string,
// allowing items to be associated with dynamic, user-created categories.
/*-------------------------------------*/

import { z } from 'zod';

/**
 * Zod schema for a single item in the user's kit inventory.
 */
export const KitChecklistItemSchema = z.object({
  id: z.string().describe("The unique item ID (UUID)."),
  // The 'category' enum is replaced with a string 'categoryId'
  categoryId: z.string().describe("The ID of the category this item belongs to."),
  name: z.string().min(1, "Item name cannot be empty."),
  packed: z.boolean().default(false),
  isPredefined: z.boolean().default(false),
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for the user's master category list.
 */
export const MasterCategoryListSchema = z.array(z.object({
    id: z.string(),
    displayName: z.string(),
    isPredefined: z.boolean(),
}));

// Inferred TypeScript types
export type TKitChecklistItem = z.infer<typeof KitChecklistItemSchema>;
export type TMasterCategory = z.infer<typeof MasterCategoryListSchema>[number];