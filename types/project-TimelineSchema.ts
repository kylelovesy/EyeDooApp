import { z } from "zod";
import { TimelineEventSchema } from "./reusableSchemas";

/**
 * Form 2: Timeline Schema
 * Defines the structure for timeline events in a project.
 * Defaults to an empty array to ensure consistent object shape.
 */
export const form2TimelineSchema = z.object({    
  events: z.array(TimelineEventSchema)
    .optional()
    .default([])
    .describe('Timeline events for the project'),
});

export type Form2Timeline = z.infer<typeof form2TimelineSchema>;