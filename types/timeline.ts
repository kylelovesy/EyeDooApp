/*-------------------------------------*/
// types/timeline.ts
// Status: Complete
// What it does: 
// This is the single source of truth for the shape of your timeline data. 
// It defines the TimelineEvent type, along with related types like EventType, EventCategory, and EventStatus.
/*-------------------------------------*/
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
  // FIX: Changed 'details' to 'description' to match its usage in other files.
  description: z.string().optional(),
  // FIX: Added 'location' to the schema as it is used in TimelineListItemCard.tsx
  location: z.string().optional(),
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

// For an array of Events (TimelineEventSchema) to form a timeline
export const CombinedEventsTimelineSchema = z.object({    
  events: z.array(TimelineEventSchema)
    .optional()
    .default([])
    .describe('Timeline events for the project'),
});

export type EventsArrayTimelineData = z.infer<typeof CombinedEventsTimelineSchema>;

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
  description?: string;
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
  // FIX: Changed 'details' to 'description' in the key
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

// /*-------------------------------------*/
// // types/timeline.ts
// // Status: Complete
// // What it does: 
// // This is the single source of truth for the shape of your timeline data. 
// // It defines the TimelineEvent type, along with related types like EventType, EventCategory, and EventStatus.
// /*-------------------------------------*/
// import { Timestamp } from 'firebase/firestore';
// import { Animated } from 'react-native';
// import { z } from 'zod';
// import { EventType } from '../constants/eventTypes';

// // Enums for Zod schema
// export const EventNotificationEnum = z.enum(['None', 'Push', 'Email', 'Text']);
// export const EventStatusEnum = z.enum(['Complete', 'Active', 'Background', 'Next', 'Upcoming', 'Draft', 'Deleted', 'DayNotStarted']);

// // Zod Schema for a Timeline Event
// export const TimelineEventSchema = z.object({
//   eventId: z.string().uuid(),
//   eventType: z.nativeEnum(EventType),
//   details: z.string().optional(),  
//   time: z.instanceof(Timestamp), // Use Firestore Timestamp for storage
//   notification: EventNotificationEnum.default('None'),
//   status: EventStatusEnum.default('Draft'),
// });

// // TypeScript type inferred from the Zod schema
// export type TTimelineEvent = z.infer<typeof TimelineEventSchema>;

// // For forms, you might want a slightly different shape, e.g., using a JS Date object
// export const TimelineEventFormSchema = TimelineEventSchema.extend({
//   time: z.date(), // Use a standard Date object for form inputs
// });

// export type TTimelineEventForm = z.infer<typeof TimelineEventFormSchema>;

// // For an array of Events (TimelineEventSchema) to form a timeline
// export const CombinedEventsTimelineSchema = z.object({    
//   events: z.array(TimelineEventSchema)
//     .optional()
//     .default([])
//     .describe('Timeline events for the project'),
// });

// export type EventsArrayTimelineData = z.infer<typeof CombinedEventsTimelineSchema>;





// export interface TimelineEventFormProps {
//   projectDate: Date;
//   onSubmit: (event: TTimelineEventForm) => void;
//   onCancel: () => void;
//   initialData?: Partial<TTimelineEventForm>;
//   isLoading?: boolean;
//   updateEventIcons?: () => void;
// }

// export interface NewEventFormData {
//   eventType?: EventType;
//   time?: Date;
//   details?: string;
//   notification?: z.infer<typeof EventNotificationEnum>;
// }

// export interface AccordionFormProps {
//   animation: Animated.Value;
//   formData: NewEventFormData;
//   errors: Record<string, string>;
//   showTimePicker: boolean;
//   projectDate: Date;
//   isLoading: boolean;
//   isExpanded: boolean;
//   isFormComplete: boolean;
//   onFieldChange: (key: keyof NewEventFormData, value: any) => void;
//   onTimePickerToggle: (show: boolean) => void;
//   onTimeChange: (event: any, selectedDate?: Date) => void;
//   onCancel: () => void;
//   onConfirm: () => void;
// }

// export interface EventTypeDropdownProps {
//   selectedType?: EventType;
//   onSelect: (type: EventType) => void;
//   error?: string;
//   disabled?: boolean;
// }

// export interface SnackbarState {
//   visible: boolean;
//   message: string;
// }
