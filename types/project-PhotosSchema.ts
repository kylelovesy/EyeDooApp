import { z } from "zod";
import { CandidShotSchema, CoupleShotSchema, GroupShotSchema, PhotoRequestSchema } from "./reusableSchemas";

/**
 * Form 4: Photos Schema
 * Defines the structure for photo-related data in a project.
 * All arrays default to empty to ensure consistent object shape.
 */
export const form4PhotosSchema = z.object({
  groupShots: z.array(GroupShotSchema)
    .optional()
    .default([])
    .describe('Group shots to be taken'),
  
  coupleShots: z.array(CoupleShotSchema)
    .optional()
    .default([])
    .describe('Couple shots to be taken'),
  
  candidShots: z.array(CandidShotSchema)
    .optional()
    .default([])
    .describe('Candid shots to be taken'),
  
  photoRequests: z.array(PhotoRequestSchema)
    .optional()
    .default([])
    .describe('General photo requests'),
  
  mustHaveMoments: z.array(PhotoRequestSchema)
    .optional()
    .default([])
    .describe('Must-have moments to capture'),
  
  sentimentalMoments: z.array(PhotoRequestSchema)
    .optional()
    .default([])
    .describe('Sentimental moments to capture'),
});

export type Form4Photos = z.infer<typeof form4PhotosSchema>;