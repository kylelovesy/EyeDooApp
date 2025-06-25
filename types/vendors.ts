import { z } from 'zod';


// TODO: Add vendor icons
// Import SVG assets as React components
// import BreakfastIcon from '../assets/icons/breakfast.svg';
// import BridalPrepIcon from '../assets/icons/bridalprep.svg';

// TODO: Use standard imports for name / email / phone

// === VENDOR ENUMS ===
// export const VendorTypeEnum = z.enum(['Officiant', 'WeddingPlanner', 'Photographer', 'Videographer', 'DJ', 'Band', 'Florist', 'Caterer', 'Venue', 'MakeupArtist', 'HairStylist', 'Transportation', 'Other']);
// // === VENDOR ENUMS ===
export enum VendorTypes{
  OFFICIANT = 'Officiant',
  WEDDING_PLANNER = 'Wedding Planner',
  PHOTOGRAPHER = 'Photographer',
  VIDEOGRAPHER = 'Videographer',
  DJ = 'DJ',
  BAND = 'Band',
  FLORIST = 'Florist',
  CATERER = 'Caterer',
  VENUE = 'Venue',
  MAKEUP_ARTIST = 'Makeup Artist',
  HAIR_STYLIST = 'Hair Stylist',
  TRANSPORTATION = 'Transportation',
  OTHER = 'Other',
}


 /**
 * Vendor contact schema
 * Used for vendor contact information
 */

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

// export type VendorType = z.infer<typeof VendorTypeEnum>;
export type VendorContact = z.infer<typeof VendorContactSchema>;
