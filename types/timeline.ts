import { z } from 'zod';
import { ImportanceLevel, NotificationType } from './enum';
import { FirestoreTimestampSchema } from './reusableSchemas';

// Import SVG assets as React components
import BreakfastIcon from '../assets/icons/breakfast.svg';
import BridalPrepIcon from '../assets/icons/bridalprep.svg';
import BrideIcon from '../assets/icons/bride.svg';
import BuffetIcon from '../assets/icons/buffet.svg';
import CakeCutIcon from '../assets/icons/cakecut.svg';
import CarriagesIcon from '../assets/icons/carriages.svg';
import CeremonyIcon from '../assets/icons/ceremony.svg';
import ConfettiIcon from '../assets/icons/confetti.svg';
import CouplePhotosIcon from '../assets/icons/couplephotos.svg';
import DjBandIcon from '../assets/icons/djband.svg';
import DrinksIcon from '../assets/icons/drinks.svg';
import EveningGuestsIcon from '../assets/icons/eveningguests.svg';
import FirstDanceIcon from '../assets/icons/firstdance.svg';
import GroomIcon from '../assets/icons/groom.svg';
import GroupPhotosIcon from '../assets/icons/groupphotos.svg';
import GuestsIcon from '../assets/icons/guests.svg';
import SpeechesIcon from '../assets/icons/speeches.svg';


// === TIMELINE ENUMS ===
export const TimelineEventTypeEnum = z.enum(['BridalPrep', 'GroomPrep', 'GuestsArrive', 'CeremonyBegins', 'ConfettiAndMingling', 'ReceptionDrinks', 'GroupPhotos', 'CouplePortraits', 'WeddingBreakfast', 'Speeches', 'EveningGuestsArrive', 'CakeCutting', 'FirstDance', 'EveningEntertainment', 'EveningBuffet', 'Carriages', 'Other']);


  /**
 * Timeline event schema
 * Used for scheduling and event planning
 */
export const TimelineEventSchema = z.object({
    id: z.string().optional(),  
    time: FirestoreTimestampSchema.describe('Time of the event'),
    eventType: TimelineEventTypeEnum,
    description: z.string().max(100, 'Description must be under 100 characters').optional().describe('Description of the event'),
    location: z.string().max(100, 'Location must be under 100 characters').optional().describe('Location of the event'),  
    priority: z.nativeEnum(ImportanceLevel).default(ImportanceLevel.MEDIUM).describe('Importance level of the event'),  
    notification: z.nativeEnum(NotificationType).default(NotificationType.NONE).optional().describe('Notification type for the event'),
    duration: z.number().positive().optional().describe('Duration of the event in minutes')
  });
  
  export type EventType = z.infer<typeof TimelineEventTypeEnum>;
  export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

  /**
 * UPDATED MAPPING:
 * This now links an EventType to its corresponding SVG icon file and description.
 * The 'icon' property now holds a reference to the SVG asset.
 */
export const EVENT_TYPE_DETAILS: Record<EventType, { icon: any; description: string }> = {
    BridalPrep: { icon: BridalPrepIcon, description: 'Bride getting ready' },
    GroomPrep: { icon: GroomIcon, description: 'Groom getting ready' },
    GuestsArrive: { icon: GuestsIcon, description: 'Guest arrival' },
    CeremonyBegins: { icon: CeremonyIcon, description: 'Ceremony start' },
    ConfettiAndMingling: { icon: ConfettiIcon, description: 'Confetti and mingling' },
    ReceptionDrinks: { icon: DrinksIcon, description: 'Reception begins' },
    GroupPhotos: { icon: GroupPhotosIcon, description: 'Group photos' },
    CouplePortraits: { icon: CouplePhotosIcon, description: 'Couple photos' },
    WeddingBreakfast: { icon: BreakfastIcon, description: 'Wedding breakfast' },
    Speeches: { icon: SpeechesIcon, description: 'Speeches and toasts' },
    EveningGuestsArrive: { icon: EveningGuestsIcon, description: 'Evening guests arrival' },
    CakeCutting: { icon: CakeCutIcon, description: 'Cake cutting' },
    FirstDance: { icon: FirstDanceIcon, description: 'First dance' },
    EveningEntertainment: { icon: DjBandIcon, description: 'Evening entertainment' },
    EveningBuffet: { icon: BuffetIcon, description: 'Evening buffet' },
    Carriages: { icon: CarriagesIcon, description: 'Carriages' },
    Other: { icon: BrideIcon, description: 'Other' },
  };

    