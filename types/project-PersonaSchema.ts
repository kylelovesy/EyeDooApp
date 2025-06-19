import { z } from "zod";
import { OtherKeyPersonSchema, PersonWithRoleSchema } from "./reusableSchemas";

/**
 * Form 3: People Schema
 * Defines the structure for people involved in the project.
 * All fields have defaults to ensure consistent object shape.
 */
export const form3PeopleSchema = z.object({
  immediateFamily: z.array(PersonWithRoleSchema)
    .optional()
    .default([])
    .describe('Immediate family members'),
  
  extendedFamily: z.array(PersonWithRoleSchema)
    .optional()
    .default([])
    .describe('Extended family members'),
  
  weddingParty: z.array(PersonWithRoleSchema)
    .optional()
    .default([])
    .describe('Wedding party members'),
  
  otherKeyPeople: z.array(OtherKeyPersonSchema)
    .optional()
    .default([])
    .describe('Other key people involved'),
  
  familySituations: z.boolean()
    .optional()
    .default(false)
    .describe('Are there any family situations to consider?'),
  
  familySituationsNotes: z.string()
    .max(300, 'Notes must be under 300 characters')
    .optional()
    .default('')
    .describe('Notes about family situations'),
  
  guestsToAvoid: z.boolean()
    .optional()
    .default(false)
    .describe('Are there guests that should be avoided?'),
  
  guestsToAvoidNotes: z.string()
    .max(300, 'Notes must be under 300 characters')
    .optional()
    .default('')
    .describe('Notes about guests to avoid'),
  
  surprises: z.boolean()
    .optional()
    .default(false)
    .describe('Are there any surprises planned?'),
  
  surprisesNotes: z.string()
    .max(300, 'Notes must be under 300 characters')
    .optional()
    .default('')
    .describe('Notes about surprises'),
});

export type Form3People = z.infer<typeof form3PeopleSchema>;