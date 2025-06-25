import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { TagSchema } from './tag';

export const PhotoTagLinkSchema = z.object({
  id: z.string().uuid().default(uuidv4),
  photoUri: z.string().min(1, 'Photo URI cannot be empty'),
  tagIds: z.array(TagSchema.shape.id),
  projectId: z.string().min(1, 'Project ID cannot be empty'),
  createdAt: z.date().default(() => new Date()),
});

export type PhotoTagLink = z.infer<typeof PhotoTagLinkSchema>;