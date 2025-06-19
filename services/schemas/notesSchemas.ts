import { z } from 'zod';
import { CommonSchemas } from '../utils/validationHelpers';

/**
 * EyeDooApp Private Notes Service Validation Schemas
 * Comprehensive validation for note operations
 */

// Note priority levels
export const NotePrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'], {
  errorMap: () => ({ message: 'Priority must be low, medium, high, or urgent' })
});

// Note categories
export const NoteCategorySchema = z.enum([
  'general',
  'todo',
  'idea',
  'meeting',
  'reminder',
  'project',
  'personal',
  'work'
], {
  errorMap: () => ({ message: 'Invalid note category' })
});

// Note status
export const NoteStatusSchema = z.enum(['active', 'archived', 'deleted'], {
  errorMap: () => ({ message: 'Status must be active, archived, or deleted' })
});

// Base note creation schema
export const CreateNoteInputSchema = z.object({
  projectId: CommonSchemas.projectId,
  title: z.string()
    .min(1, 'Note title cannot be empty')
    .max(200, 'Note title too long (maximum 200 characters)')
    .trim(),
  content: CommonSchemas.noteContent,
  category: NoteCategorySchema.default('general'),
  priority: NotePrioritySchema.default('medium'),
  tags: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  isPrivate: z.boolean().default(true),
  reminderAt: z.date().optional(),
  attachments: z.array(z.object({
    name: z.string().min(1, 'Attachment name is required'),
    url: CommonSchemas.url,
    type: z.string().min(1, 'Attachment type is required'),
    size: z.number().min(0, 'File size cannot be negative').max(50 * 1024 * 1024, 'File too large (max 50MB)')
  })).max(5, 'Maximum 5 attachments allowed').default([])
});

// Note update schema
export const UpdateNoteInputSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required'),
  title: z.string()
    .min(1, 'Note title cannot be empty')
    .max(200, 'Note title too long')
    .trim()
    .optional(),
  content: CommonSchemas.noteContent.optional(),
  category: NoteCategorySchema.optional(),
  priority: NotePrioritySchema.optional(),
  tags: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  isPrivate: z.boolean().optional(),
  reminderAt: z.date().optional().or(z.null()),
  status: NoteStatusSchema.optional(),
  attachments: z.array(z.object({
    name: z.string().min(1, 'Attachment name is required'),
    url: CommonSchemas.url,
    type: z.string().min(1, 'Attachment type is required'),
    size: z.number().min(0).max(50 * 1024 * 1024)
  })).max(5, 'Maximum 5 attachments allowed').optional()
}).refine((data) => {
  // At least one field must be provided for update
  const updateFields = ['title', 'content', 'category', 'priority', 'tags', 'isPrivate', 'reminderAt', 'status', 'attachments'];
  return updateFields.some(field => data[field as keyof typeof data] !== undefined);
}, {
  message: "At least one field must be provided for update"
});

// Note query/filter schema
export const NotesQuerySchema = z.object({
  projectId: CommonSchemas.projectId,
  category: NoteCategorySchema.optional(),
  priority: NotePrioritySchema.optional(),
  status: NoteStatusSchema.default('active'),
  tags: z.array(z.string()).optional(),
  search: z.string().max(100, 'Search query too long').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
}).refine((data) => {
  // If both startDate and endDate are provided, startDate should be before endDate
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"]
});

// Note deletion schema
export const DeleteNoteInputSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required'),
  permanent: z.boolean().default(false) // Soft delete by default
});

// Note sharing schema
export const ShareNoteInputSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required'),
  shareWithEmails: z.array(CommonSchemas.email)
    .min(1, 'At least one email is required')
    .max(10, 'Maximum 10 recipients allowed'),
  permissions: z.enum(['view', 'edit']).default('view'),
  expiresAt: z.date().optional(),
  message: z.string()
    .max(500, 'Message too long (maximum 500 characters)')
    .optional()
});

// Note export schema
export const ExportNotesInputSchema = z.object({
  projectId: CommonSchemas.projectId,
  format: z.enum(['json', 'csv', 'pdf', 'markdown']).default('json'),
  includeAttachments: z.boolean().default(false),
  filters: z.object({
    category: NoteCategorySchema.optional(),
    priority: NotePrioritySchema.optional(),
    status: NoteStatusSchema.default('active'),
    tags: z.array(z.string()).optional(),
    search: z.string().max(100, 'Search query too long').optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority']).default('updatedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }).optional()
});

// Note import schema
export const ImportNotesInputSchema = z.object({
  projectId: CommonSchemas.projectId,
  format: z.enum(['json', 'csv', 'markdown']),
  data: z.string().min(1, 'Import data cannot be empty'),
  overwriteExisting: z.boolean().default(false),
  validateOnly: z.boolean().default(false) // For preview mode
});

// Note template schema
export const NoteTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  title: z.string().min(1, 'Template title is required').max(200, 'Template title too long'),
  content: CommonSchemas.noteContent,
  category: NoteCategorySchema.default('general'),
  priority: NotePrioritySchema.default('medium'),
  tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  isPublic: z.boolean().default(false) // Templates can be shared publicly
});

// Note comment schema (for collaborative features)
export const NoteCommentSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required'),
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment too long (maximum 1000 characters)')
    .trim(),
  parentCommentId: z.string().optional() // For threaded comments
});

// Complete note schema (for database storage)
export const NoteSchema = z.object({
  id: z.string().min(1),
  projectId: CommonSchemas.projectId,
  userId: CommonSchemas.userId,
  title: z.string().min(1).max(200),
  content: CommonSchemas.noteContent,
  category: NoteCategorySchema,
  priority: NotePrioritySchema,
  status: NoteStatusSchema,
  tags: z.array(z.string()),
  isPrivate: z.boolean(),
  reminderAt: z.date().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number()
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().default(1), // For versioning
  sharedWith: z.array(z.object({
    email: z.string(),
    permissions: z.enum(['view', 'edit']),
    sharedAt: z.date()
  })).default([])
});

// Type exports for use in services
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;
export type NotesQuery = z.infer<typeof NotesQuerySchema>;
export type DeleteNoteInput = z.infer<typeof DeleteNoteInputSchema>;
export type ShareNoteInput = z.infer<typeof ShareNoteInputSchema>;
export type ExportNotesInput = z.infer<typeof ExportNotesInputSchema>;
export type ImportNotesInput = z.infer<typeof ImportNotesInputSchema>;
export type NoteTemplate = z.infer<typeof NoteTemplateSchema>;
export type NoteComment = z.infer<typeof NoteCommentSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type NotePriority = z.infer<typeof NotePrioritySchema>;
export type NoteCategory = z.infer<typeof NoteCategorySchema>;
export type NoteStatus = z.infer<typeof NoteStatusSchema>; 