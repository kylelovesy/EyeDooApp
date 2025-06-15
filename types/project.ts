// src/types/project.ts
import { z } from 'zod';

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled',
}

export enum ProjectType {
  WEDDING = 'wedding',
  ENGAGEMENT = 'engagement',
  BRIDAL_SHOWER = 'bridal_shower',
  BACHELOR_PARTY = 'bachelor_party',
  REHEARSAL_DINNER = 'rehearsal_dinner',
  ELOPEMENT = 'elopement',
  OTHER = 'other',
}

// Zod schemas for validation
export const ProjectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  status: z.nativeEnum(ProjectStatus),
  
  // Client information
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  
  // Event details
  eventDate: z.date(),
  eventTime: z.string().optional(),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  venueCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  
  // Project settings
  budget: z.number().optional(),
  packageType: z.string().optional(),
  numberOfGuests: z.number().optional(),
  
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Additional data
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  
  // Progress tracking
  questionnaireProgress: z.object({
    essentialInfo: z.boolean().default(false),
    timelineReview: z.boolean().default(false),
    peopleRoles: z.boolean().default(false),
    photographyPlan: z.boolean().default(false),
    finalTouches: z.boolean().default(false),
  }).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Create project input type (without generated fields)
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// Update project input type (all fields optional except id)
export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadProjects: () => Promise<void>;
  createProject: (project: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  loadUpcomingProjects: () => Promise<void>;
  searchResults: Project[];
  upcomingProjects: Project[];
  // getProjectsByStatus: (status: ProjectStatus) => Project[];
  setCurrentProject: (project: Project | null) => void;
  getProject: (id: string) => Promise<Project | null>;
}