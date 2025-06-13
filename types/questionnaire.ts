import { z } from 'zod';

// Define Zod schemas for questionnaire data

// Essential Information Schema
export const EssentialInfoSchema = z.object({
  weddingDate: z.string().min(1, 'Wedding date is required'),
  venue: z.string().min(1, 'Venue is required'),
  coupleNames: z.string().min(1, 'Couple names are required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  // Add other essential fields as needed
});

export type EssentialInfo = z.infer<typeof EssentialInfoSchema>;

// Main Questionnaire Schema (can be expanded later)
export const QuestionnaireSchema = z.object({
  projectId: z.string(),
  essentialInfo: EssentialInfoSchema.optional(),
  // Add other sections as they are developed
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// Example of a question type (can be expanded)
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});

export type Question = z.infer<typeof QuestionSchema>;

// Example of a section type (can be expanded)
export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(QuestionSchema),
});

export type Section = z.infer<typeof SectionSchema>;