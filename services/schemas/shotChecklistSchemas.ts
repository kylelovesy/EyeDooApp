import { z } from 'zod';
import { CommonSchemas } from '../utils/validationHelpers';

/**
 * EyeDooApp Shot Checklist Service Validation Schemas
 * Comprehensive validation for shot list and checklist operations
 */

// Shot status enumeration
export const ShotStatusSchema = z.enum(['planned', 'in_progress', 'completed', 'skipped', 'cancelled'], {
  errorMap: () => ({ message: 'Shot status must be planned, in_progress, completed, skipped, or cancelled' })
});

// Shot priority levels
export const ShotPrioritySchema = z.enum(['low', 'medium', 'high', 'critical'], {
  errorMap: () => ({ message: 'Shot priority must be low, medium, high, or critical' })
});

// Shot types
export const ShotTypeSchema = z.enum([
  'establishing',
  'wide',
  'medium',
  'close_up',
  'extreme_close_up',
  'over_shoulder',
  'two_shot',
  'insert',
  'cutaway',
  'b_roll',
  'beauty',
  'action',
  'dialogue',
  'montage'
], {
  errorMap: () => ({ message: 'Invalid shot type' })
});

// Camera movement types
export const CameraMovementSchema = z.enum([
  'static',
  'pan',
  'tilt',
  'zoom',
  'dolly',
  'tracking',
  'handheld',
  'steadicam',
  'crane',
  'drone'
], {
  errorMap: () => ({ message: 'Invalid camera movement type' })
});

// Equipment requirements schema
export const EquipmentSchema = z.object({
  camera: z.string().min(1, 'Camera is required').max(100, 'Camera name too long'),
  lens: z.string().max(100, 'Lens name too long').optional(),
  lighting: z.array(z.string().min(1).max(100)).max(20, 'Too many lighting items').default([]),
  audio: z.array(z.string().min(1).max(100)).max(10, 'Too many audio items').default([]),
  accessories: z.array(z.string().min(1).max(100)).max(30, 'Too many accessories').default([]),
  specialEquipment: z.string().max(500, 'Special equipment description too long').optional()
});

// Location requirements schema
export const LocationRequirementsSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(200, 'Location name too long'),
  address: z.string().max(300, 'Address too long').optional(),
  coordinates: z.object({
    latitude: CommonSchemas.latitude,
    longitude: CommonSchemas.longitude
  }).optional(),
  interiorExterior: z.enum(['interior', 'exterior', 'both']),
  timeOfDay: z.enum(['dawn', 'morning', 'noon', 'afternoon', 'sunset', 'night', 'golden_hour', 'blue_hour']),
  weatherRequirements: z.string().max(200, 'Weather requirements too long').optional(),
  permitsRequired: z.boolean().default(false),
  accessNotes: z.string().max(500, 'Access notes too long').optional()
});

// Technical specifications schema
export const TechnicalSpecsSchema = z.object({
  resolution: z.enum(['720p', '1080p', '4K', '8K']).default('1080p'),
  frameRate: z.number().min(1).max(120).default(24),
  aspectRatio: z.enum(['16:9', '4:3', '21:9', '1:1', '9:16']).default('16:9'),
  colorProfile: z.string().max(50, 'Color profile name too long').optional(),
  iso: z.number().min(50).max(204800).optional(),
  aperture: z.string().regex(/^f\/\d+(\.\d+)?$/, 'Invalid aperture format (use f/2.8)').optional(),
  shutterSpeed: z.string().max(20, 'Shutter speed too long').optional(),
  focusDistance: z.string().max(50, 'Focus distance too long').optional()
});

// Shot creation schema
export const CreateShotInputSchema = z.object({
  projectId: CommonSchemas.projectId,
  shotNumber: z.string()
    .min(1, 'Shot number is required')
    .max(20, 'Shot number too long')
    .regex(/^[A-Za-z0-9\-_\.]+$/, 'Shot number contains invalid characters'),
  title: z.string()
    .min(1, 'Shot title is required')
    .max(200, 'Shot title too long')
    .trim(),
  description: z.string()
    .max(1000, 'Shot description too long')
    .optional(),
  type: ShotTypeSchema,
  priority: ShotPrioritySchema.default('medium'),
  status: ShotStatusSchema.default('planned'),
  duration: z.number()
    .min(0.1, 'Duration must be at least 0.1 seconds')
    .max(3600, 'Duration cannot exceed 1 hour')
    .optional(),
  cameraMovement: CameraMovementSchema.default('static'),
  location: LocationRequirementsSchema,
  equipment: EquipmentSchema,
  technicalSpecs: TechnicalSpecsSchema.optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.array(z.string().min(1).max(50))
    .max(15, 'Maximum 15 tags allowed')
    .default([]),
  scheduledDate: z.date().optional(),
  estimatedDuration: z.number()
    .min(1, 'Estimated duration must be at least 1 minute')
    .max(1440, 'Estimated duration cannot exceed 24 hours')
    .optional(), // in minutes
  dependencies: z.array(z.string().min(1, 'Dependency shot ID cannot be empty'))
    .max(10, 'Maximum 10 dependencies allowed')
    .default([])
});

// Shot update schema
export const UpdateShotInputSchema = z.object({
  shotId: z.string().min(1, 'Shot ID is required'),
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(1000).optional(),
  type: ShotTypeSchema.optional(),
  priority: ShotPrioritySchema.optional(),
  status: ShotStatusSchema.optional(),
  duration: z.number().min(0.1).max(3600).optional(),
  cameraMovement: CameraMovementSchema.optional(),
  location: LocationRequirementsSchema.optional(),
  equipment: EquipmentSchema.optional(),
  technicalSpecs: TechnicalSpecsSchema.optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(15).optional(),
  scheduledDate: z.date().optional().or(z.null()),
  estimatedDuration: z.number().min(1).max(1440).optional(),
  dependencies: z.array(z.string().min(1)).max(10).optional(),
  actualStartTime: z.date().optional(),
  actualEndTime: z.date().optional(),
  completionNotes: z.string().max(1000).optional()
}).refine((data) => {
  // At least one field must be provided for update
  const updateFields = Object.keys(data).filter(key => key !== 'shotId');
  return updateFields.some(field => data[field as keyof typeof data] !== undefined);
}, {
  message: "At least one field must be provided for update"
}).refine((data) => {
  // If both actual start and end times are provided, start should be before end
  if (data.actualStartTime && data.actualEndTime) {
    return data.actualStartTime <= data.actualEndTime;
  }
  return true;
}, {
  message: "Actual start time must be before end time",
  path: ["actualEndTime"]
});

// Shot query/filter schema
export const ShotsQuerySchema = z.object({
  projectId: CommonSchemas.projectId,
  status: ShotStatusSchema.optional(),
  priority: ShotPrioritySchema.optional(),
  type: ShotTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  scheduledDateFrom: z.date().optional(),
  scheduledDateTo: z.date().optional(),
  search: z.string().max(100, 'Search query too long').optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['shotNumber', 'title', 'priority', 'status', 'scheduledDate', 'createdAt']).default('shotNumber'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
}).refine((data) => {
  // If both date filters are provided, from should be before to
  if (data.scheduledDateFrom && data.scheduledDateTo) {
    return data.scheduledDateFrom <= data.scheduledDateTo;
  }
  return true;
}, {
  message: "Scheduled date from must be before or equal to scheduled date to",
  path: ["scheduledDateTo"]
});

// Shot deletion schema
export const DeleteShotInputSchema = z.object({
  shotId: z.string().min(1, 'Shot ID is required'),
  permanent: z.boolean().default(false) // Soft delete by default
});

// Checklist item schema
export const ChecklistItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Checklist item title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  isCompleted: z.boolean().default(false),
  completedBy: CommonSchemas.userId.optional(),
  completedAt: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.enum(['pre_production', 'production', 'post_production']).default('production'),
  assignedTo: CommonSchemas.userId.optional(),
  dueDate: z.date().optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  attachments: z.array(z.object({
    name: z.string().min(1),
    url: CommonSchemas.url,
    type: z.string().min(1)
  })).max(5, 'Maximum 5 attachments allowed').default([])
});

// Shot checklist schema
export const ShotChecklistSchema = z.object({
  shotId: z.string().min(1, 'Shot ID is required'),
  items: z.array(ChecklistItemSchema)
    .min(1, 'At least one checklist item is required')
    .max(50, 'Maximum 50 checklist items allowed')
});

// Bulk shot operations schema
export const BulkShotOperationSchema = z.object({
  projectId: CommonSchemas.projectId,
  shotIds: z.array(z.string().min(1))
    .min(1, 'At least one shot ID is required')
    .max(100, 'Maximum 100 shots can be processed at once'),
  operation: z.enum(['update_status', 'update_priority', 'delete', 'assign_location', 'bulk_edit']),
  data: z.record(z.any()).optional() // Flexible data for different operations
});

// Shot template schema
export const ShotTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  type: ShotTypeSchema,
  cameraMovement: CameraMovementSchema.default('static'),
  equipment: EquipmentSchema,
  technicalSpecs: TechnicalSpecsSchema.optional(),
  estimatedDuration: z.number().min(1).max(1440).optional(),
  defaultChecklist: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(500).optional(),
    category: z.enum(['pre_production', 'production', 'post_production']).default('production'),
    priority: z.enum(['low', 'medium', 'high']).default('medium')
  })).max(20, 'Maximum 20 default checklist items').default([]),
  isPublic: z.boolean().default(false) // Templates can be shared
});

// Complete shot schema (for database storage)
export const ShotSchema = z.object({
  id: z.string().min(1),
  projectId: CommonSchemas.projectId,
  userId: CommonSchemas.userId,
  shotNumber: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: ShotTypeSchema,
  priority: ShotPrioritySchema,
  status: ShotStatusSchema,
  duration: z.number().optional(),
  cameraMovement: CameraMovementSchema,
  location: LocationRequirementsSchema,
  equipment: EquipmentSchema,
  technicalSpecs: TechnicalSpecsSchema.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  scheduledDate: z.date().optional(),
  estimatedDuration: z.number().optional(),
  actualStartTime: z.date().optional(),
  actualEndTime: z.date().optional(),
  completionNotes: z.string().optional(),
  dependencies: z.array(z.string()),
  checklist: z.array(ChecklistItemSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().default(1)
});

// Type exports for use in services
export type CreateShotInput = z.infer<typeof CreateShotInputSchema>;
export type UpdateShotInput = z.infer<typeof UpdateShotInputSchema>;
export type ShotsQuery = z.infer<typeof ShotsQuerySchema>;
export type DeleteShotInput = z.infer<typeof DeleteShotInputSchema>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type ShotChecklist = z.infer<typeof ShotChecklistSchema>;
export type BulkShotOperation = z.infer<typeof BulkShotOperationSchema>;
export type ShotTemplate = z.infer<typeof ShotTemplateSchema>;
export type Shot = z.infer<typeof ShotSchema>;
export type ShotStatus = z.infer<typeof ShotStatusSchema>;
export type ShotPriority = z.infer<typeof ShotPrioritySchema>;
export type ShotType = z.infer<typeof ShotTypeSchema>;
export type CameraMovement = z.infer<typeof CameraMovementSchema>;
export type LocationRequirements = z.infer<typeof LocationRequirementsSchema>;
export type Equipment = z.infer<typeof EquipmentSchema>;
export type TechnicalSpecs = z.infer<typeof TechnicalSpecsSchema>; 