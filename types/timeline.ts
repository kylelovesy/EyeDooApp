import { Timestamp } from 'firebase/firestore';
import { Animated } from 'react-native';
import { z } from 'zod';
import { EventType } from '../constants/eventTypes';

// Enums for Zod schema
export const EventNotificationEnum = z.enum(['None', 'Push', 'Email', 'Text']);
export const EventStatusEnum = z.enum(['Complete', 'Active', 'Background', 'Next', 'Upcoming', 'Draft', 'Deleted', 'DayNotStarted']);

// Zod Schema for a Timeline Event
export const TimelineEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.nativeEnum(EventType),
  details: z.string().optional(),  
  time: z.instanceof(Timestamp), // Use Firestore Timestamp for storage
  notification: EventNotificationEnum.default('None'),
  status: EventStatusEnum.default('Draft'),
});

// TypeScript type inferred from the Zod schema
export type TTimelineEvent = z.infer<typeof TimelineEventSchema>;

// For forms, you might want a slightly different shape, e.g., using a JS Date object
export const TimelineEventFormSchema = TimelineEventSchema.extend({
  time: z.date(), // Use a standard Date object for form inputs
});

export type TTimelineEventForm = z.infer<typeof TimelineEventFormSchema>;

export interface TimelineEventFormProps {
  projectDate: Date;
  onSubmit: (event: TTimelineEventForm) => void;
  onCancel: () => void;
  initialData?: Partial<TTimelineEventForm>;
  isLoading?: boolean;
  updateEventIcons?: () => void;
}

export interface NewEventFormData {
  eventType?: EventType;
  time?: Date;
  details?: string;
  notification?: z.infer<typeof EventNotificationEnum>;
}

export interface AccordionFormProps {
  animation: Animated.Value;
  formData: NewEventFormData;
  errors: Record<string, string>;
  showTimePicker: boolean;
  projectDate: Date;
  isLoading: boolean;
  isExpanded: boolean;
  isFormComplete: boolean;
  onFieldChange: (key: keyof NewEventFormData, value: any) => void;
  onTimePickerToggle: (show: boolean) => void;
  onTimeChange: (event: any, selectedDate?: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface EventTypeDropdownProps {
  selectedType?: EventType;
  onSelect: (type: EventType) => void;
  error?: string;
  disabled?: boolean;
}

export interface SnackbarState {
  visible: boolean;
  message: string;
}

// import { z } from 'zod';
// import { ImportanceLevel, NotificationType } from './enum';
// import { FirestoreTimestampSchema } from './reusableSchemas';

// // Import SVG assets as React components
// import BreakfastIcon from '../assets/icons/breakfast.svg';
// import BridalPrepIcon from '../assets/icons/bridalprep.svg';
// import BrideIcon from '../assets/icons/bride.svg';
// import BuffetIcon from '../assets/icons/buffet.svg';
// import CakeCutIcon from '../assets/icons/cakecut.svg';
// import CarriagesIcon from '../assets/icons/carriages.svg';
// import CeremonyIcon from '../assets/icons/ceremony.svg';
// import ConfettiIcon from '../assets/icons/confetti.svg';
// import CouplePhotosIcon from '../assets/icons/couplephotos.svg';
// import DjBandIcon from '../assets/icons/djband.svg';
// import DrinksIcon from '../assets/icons/drinks.svg';
// import EveningGuestsIcon from '../assets/icons/eveningguests.svg';
// import FirstDanceIcon from '../assets/icons/firstdance.svg';
// import GroomIcon from '../assets/icons/groom.svg';
// import GroupPhotosIcon from '../assets/icons/groupphotos.svg';
// import GuestsIcon from '../assets/icons/guests.svg';
// import SpeechesIcon from '../assets/icons/speeches.svg';


// // === TIMELINE ENUMS ===
// export const TimelineEventTypeEnum = z.enum(['BridalPrep', 'GroomPrep', 'GuestsArrive', 'CeremonyBegins', 'ConfettiAndMingling', 'ReceptionDrinks', 'GroupPhotos', 'CouplePortraits', 'WeddingBreakfast', 'Speeches', 'EveningGuestsArrive', 'CakeCutting', 'FirstDance', 'EveningEntertainment', 'EveningBuffet', 'Carriages', 'Other']);


//   /**
//  * Timeline event schema
//  * Used for scheduling and event planning
//  */
// export const TimelineEventSchema = z.object({
//     id: z.string().optional(),  
//     time: FirestoreTimestampSchema.describe('Time of the event'),
//     eventType: TimelineEventTypeEnum,
//     description: z.string().max(100, 'Description must be under 100 characters').optional().describe('Description of the event'),
//     location: z.string().max(100, 'Location must be under 100 characters').optional().describe('Location of the event'),  
//     priority: z.nativeEnum(ImportanceLevel).default(ImportanceLevel.MEDIUM).describe('Importance level of the event'),  
//     notification: z.nativeEnum(NotificationType).default(NotificationType.NONE).optional().describe('Notification type for the event'),
//     duration: z.number().positive().optional().describe('Duration of the event in minutes')
//   });
  
//   export type EventType = z.infer<typeof TimelineEventTypeEnum>;
//   export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

//   /**
//  * UPDATED MAPPING:
//  * This now links an EventType to its corresponding SVG icon file and description.
//  * The 'icon' property now holds a reference to the SVG asset.
//  */
// export const EVENT_TYPE_DETAILS: Record<EventType, { icon: any; description: string }> = {
//     BridalPrep: { icon: BridalPrepIcon, description: 'Bride getting ready' },
//     GroomPrep: { icon: GroomIcon, description: 'Groom getting ready' },
//     GuestsArrive: { icon: GuestsIcon, description: 'Guest arrival' },
//     CeremonyBegins: { icon: CeremonyIcon, description: 'Ceremony start' },
//     ConfettiAndMingling: { icon: ConfettiIcon, description: 'Confetti and mingling' },
//     ReceptionDrinks: { icon: DrinksIcon, description: 'Reception begins' },
//     GroupPhotos: { icon: GroupPhotosIcon, description: 'Group photos' },
//     CouplePortraits: { icon: CouplePhotosIcon, description: 'Couple photos' },
//     WeddingBreakfast: { icon: BreakfastIcon, description: 'Wedding breakfast' },
//     Speeches: { icon: SpeechesIcon, description: 'Speeches and toasts' },
//     EveningGuestsArrive: { icon: EveningGuestsIcon, description: 'Evening guests arrival' },
//     CakeCutting: { icon: CakeCutIcon, description: 'Cake cutting' },
//     FirstDance: { icon: FirstDanceIcon, description: 'First dance' },
//     EveningEntertainment: { icon: DjBandIcon, description: 'Evening entertainment' },
//     EveningBuffet: { icon: BuffetIcon, description: 'Evening buffet' },
//     Carriages: { icon: CarriagesIcon, description: 'Carriages' },
//     Other: { icon: BrideIcon, description: 'Other' },
//   };
// import { z } from 'zod';
// import { ImportanceLevel, NotificationType } from './enum';
// import { FirestoreTimestampSchema } from './reusableSchemas';


// // === TIMELINE ENUMS ===
// export const TimelineEventTypeEnum = z.enum(['BridalPrep', 'GroomPrep', 'GuestsArrive', 'CeremonyBegins', 'ConfettiAndMingling', 'ReceptionDrinks', 'GroupPhotos', 'CouplePortraits', 'WeddingBreakfast', 'Speeches', 'EveningGuestsArrive', 'CakeCutting', 'FirstDance', 'EveningEntertainment', 'EveningBuffet', 'Carriages', 'Other']);


//   /**
//  * Timeline event schema
//  * Used for scheduling and event planning
//  */
// export const TimelineEventSchema = z.object({
//     id: z.string().optional(),  
//     time: FirestoreTimestampSchema.describe('Time of the event'),
//     eventType: TimelineEventTypeEnum,
//     description: z.string().max(100, 'Description must be under 100 characters').optional().describe('Description of the event'),
//     location: z.string().max(100, 'Location must be under 100 characters').optional().describe('Location of the event'),  
//     priority: z.nativeEnum(ImportanceLevel).default(ImportanceLevel.MEDIUM).describe('Importance level of the event'),  
//     notification: z.nativeEnum(NotificationType).default(NotificationType.NONE).optional().describe('Notification type for the event'),
//     duration: z.number().positive().optional().describe('Duration of the event in minutes')
//   });
  
//   export type EventType = z.infer<typeof TimelineEventTypeEnum>;
//   export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

//   /**
//  * UPDATED MAPPING:
//  * This now links an EventType to its corresponding SVG icon file and description.
//  * The 'icon' property now holds a reference to the SVG asset.
//  */
// export const EVENT_TYPE_DETAILS: Record<EventType, { icon: any; description: string }> = {
//     BridalPrep: { icon: require('../assets/icons/bridalprep.svg'), description: 'Bride getting ready' },
//     GroomPrep: { icon: require('../assets/icons/groom.svg'), description: 'Groom getting ready' },
//     GuestsArrive: { icon: require('../assets/icons/guests.svg'), description: 'Guest arrival' },
//     CeremonyBegins: { icon: require('../assets/icons/ceremony.svg'), description: 'Ceremony start' },
//     ConfettiAndMingling: { icon: require('../assets/icons/confetti.svg'), description: 'Confetti and mingling' },
//     ReceptionDrinks: { icon: require('../assets/icons/drinks.svg'), description: 'Reception begins' },
//     GroupPhotos: { icon: require('../assets/icons/groupphotos.svg'), description: 'Group photos' },
//     CouplePortraits: { icon: require('../assets/icons/couplephotos.svg'), description: 'Couple photos' },
//     WeddingBreakfast: { icon: require('../assets/icons/breakfast.svg'), description: 'Wedding breakfast' },
//     Speeches: { icon: require('../assets/icons/speeches.svg'), description: 'Speeches and toasts' },
//     EveningGuestsArrive: { icon: require('../assets/icons/eveningguests.svg'), description: 'Evening guests arrival' },
//     CakeCutting: { icon: require('../assets/icons/cakecut.svg'), description: 'Cake cutting' },
//     FirstDance: { icon: require('../assets/icons/firstdance.svg'), description: 'First dance' },
//     EveningEntertainment: { icon: require('../assets/icons/djband.svg'), description: 'Evening entertainment' },
//     EveningBuffet: { icon: require('../assets/icons/buffet.svg'), description: 'Evening buffet' },
//     Carriages: { icon: require('../assets/icons/carriages.svg'), description: 'Carriages' },
//     Other: { icon: require('../assets/icons/bride.svg'), description: 'Other' },
//   };
  
  
    