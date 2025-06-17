// src/types/projectSchema.ts
import { z } from 'zod';
// import { ProjectStatus, ProjectType } from './project';

// Schema for the first form step
export const formStep1Schema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  projectType: z.string().min(3, 'Project type must be at least 3 characters'),
});

// Schema for the second form step
export const formStep2Schema = z.object({
  clientName: z.string().min(3, 'Client name must be at least 3 characters'),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
});

// Schema for the third form step
export const formStep3Schema = z.object({
  eventDay: z.string().min(3, 'Event day must be at least 3 characters'),
  eventDate: z.string().min(3, 'Event date must be at least 3 characters'),
});

export const formStep4Schema = z.object({
  eventStyle: z.string().min(3, 'Event style must be at least 3 characters'),
  projectStatus: z.string().min(3, 'Project status must be at least 3 characters'),
});

// A combined schema to validate the entire form object at once
export const combinedProjectSchema = z.object({
    form1Data: formStep1Schema,
    form2Data: formStep2Schema,
    form3Data: formStep3Schema,
    form4Data: formStep4Schema,
});

