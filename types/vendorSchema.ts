import { z } from 'zod';
import { VendorTypes } from './enum';

export const VendorContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  businessName: z.string().max(100, 'Business name too long').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
  website: z.string().url('Invalid website URL').optional(),
  instagram: z.string().max(50, 'Instagram handle too long').optional(),
  facebook: z.string().max(100, 'Facebook URL too long').optional(),
  type: z.nativeEnum(VendorTypes).default(VendorTypes.OTHER),
  notes: z.string().max(500, 'Notes too long').optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type VendorContact = z.infer<typeof VendorContactSchema>;