import { z } from 'zod';

export const ShotItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  isCompleted: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ShotItem = z.infer<typeof ShotItemSchema>;

export const ShotChecklistSchema = z.object({
  projectId: z.string(),
  items: z.array(ShotItemSchema),
});

export type ShotChecklist = z.infer<typeof ShotChecklistSchema>;