import 'react-native-get-random-values'; // Must be imported before uuid
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { TAG_COLORS } from '../constants/tagsTypes';

export const TagSchema = z.object({
  id: z.string().uuid().default(uuidv4),
  text: z.string().min(1, 'Tag text cannot be empty').max(30, 'Tag text is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default(TAG_COLORS[0]),
  createdAt: z.date().default(() => new Date()),
});

export type Tag = z.infer<typeof TagSchema>;