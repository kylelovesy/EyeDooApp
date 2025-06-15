import { z } from 'zod';

export const PrivateNoteSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'Note content cannot be empty'),
  createdAt: z.string().optional(), // Store as ISO string
  updatedAt: z.string().optional(), // Store as ISO string
});

export type PrivateNote = z.infer<typeof PrivateNoteSchema>;

export const ProjectNotesSchema = z.object({
  projectId: z.string(),
  notes: z.array(PrivateNoteSchema),
});

export type ProjectNotes = z.infer<typeof ProjectNotesSchema>;