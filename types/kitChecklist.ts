/*-------------------------------------*/
// types/kitChecklist.ts
// Status: Complete
// What it does: 
// Defines the Zod schemas for validating kit checklist data and infers the corresponding TypeScript types.
// This ensures that data stored in Firestore and used in the app is structured correctly.
/*-------------------------------------*/

import { z } from 'zod';
import { ChecklistCategory, KitCategory } from '../constants/kitChecklistTypes';

//================================================================================
// SECTION 1: KIT PACKING LIST (Inventory)
//================================================================================

/**
 * Zod schema for a single item in the user's kit inventory.
 * This represents a piece of equipment the user owns.
 */
export const KitChecklistItemSchema = z.object({
  id: z.string().uuid().describe("Unique identifier for the kit item"),
  name: z.string().min(1, "Item name cannot be empty."),
  category: z.nativeEnum(KitCategory).describe("The category of the equipment."),
  packed: z.boolean().default(false).describe("Whether the item has been packed for a specific project."),
  quantity: z.number().int().positive().optional().describe("How many of this item to pack."),
  notes: z.string().optional().describe("User-added notes for the item."),
});

/**
 * Zod schema for the entire kit checklist for a project.
 * This is stored as a subcollection under a project document.
 */
export const KitChecklistSchema = z.object({
  items: z.array(KitChecklistItemSchema).default([]).describe("The list of kit items for the project."),
});

// Inferred TypeScript types
export type TKitChecklistItem = z.infer<typeof KitChecklistItemSchema>;
export type TKitChecklist = z.infer<typeof KitChecklistSchema>;


//================================================================================
// SECTION 2: TASK CHECKLIST (Actions)
//================================================================================

/**
 * Zod schema for a single task in the photographer's preparation checklist.
 * This represents a single to-do item.
 */
export const TaskChecklistItemSchema = z.object({
    id: z.string().uuid().describe("Unique identifier for the task"),
    label: z.string().min(3, "Task label must be at least 3 characters."),
    category: z.nativeEnum(ChecklistCategory).describe("The phase of the checklist (e.g., Night Before)."),
    isComplete: z.boolean().default(false).describe("Whether the task has been completed."),
    isPredefined: z.boolean().default(false).describe("Whether the task is a default or user-added item."),
});

/**
 * Zod schema for the entire task checklist for a project.
 */
export const TaskChecklistSchema = z.object({
    tasks: z.array(TaskChecklistItemSchema).default([]).describe("The list of tasks for the project."),
});

// Inferred TypeScript types
export type TTaskChecklistItem = z.infer<typeof TaskChecklistItemSchema>;
export type TTaskChecklist = z.infer<typeof TaskChecklistSchema>;
