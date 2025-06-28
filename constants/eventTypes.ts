/*-------------------------------------*/
// constants/eventTypes.ts
// Status: Complete
// What it does: 
// This is the single source of truth for the shape of your event types. 
// It defines the EventType enum, along with related types like EventTypeDetail, and getEventTypeDetails.
/*-------------------------------------*/
import { FC, SVGProps } from 'react';

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
/**
 * Timeline event type enum
 */
export enum EventType {
  BRIDALPREP = 'Bridal Prep',
  GROOMPREP = 'Groom Prep',
  GUESTSARRIVE = 'Guests Arrive',
  CEREMONYBEGINS = 'Ceremony Begins',
  CONFETTIANDMINGLING = 'Confetti and Mingling',
  RECEPTIONDRINKS = 'Reception Drinks',
  GROUPPHOTOS = 'Group Photos',
  COUPLEPORTRAITS = 'Couple Portraits',
  WEDDINGBREAKFAST = 'Wedding Breakfast',
  SPEECHES = 'Speeches',
  EVENINGGUESTSARRIVE = 'Evening Guests Arrive',
  CAKECUTTING = 'Cake Cutting',
  FIRSTDANCE = 'First Dance',
  EVENINGENTERTAINMENT = 'Evening Entertainment',
  EVENINGBUFFET = 'Evening Buffet',
  CARRIAGES = 'Carriages',
  OTHER = 'Other',
}

export interface EventTypeDetail {
    type: EventType;
    displayName: string;
    Icon: FC<SVGProps<SVGSVGElement>>; // Assuming your icons are React components
  }

  export const eventTypeDetails: EventTypeDetail[] = [  
    {
        type: EventType.BRIDALPREP,
        displayName: 'Bridal Prep',
        Icon: BridalPrepIcon,
    },
    {
        type: EventType.GROOMPREP,
        displayName: 'Groom Prep',
        Icon: GroomIcon,
    },
    {
        type: EventType.GUESTSARRIVE,
        displayName: 'Guests Arrive',
        Icon: GuestsIcon,
    },
    {
        type: EventType.CEREMONYBEGINS,
        displayName: 'Ceremony Begins',
        Icon: CeremonyIcon,
    },
    {
        type: EventType.CONFETTIANDMINGLING,
        displayName: 'Confetti and Mingling',
        Icon: ConfettiIcon,
    },
    {
        type: EventType.RECEPTIONDRINKS,
        displayName: 'Reception Drinks',
        Icon: DrinksIcon,
    },
    {
        type: EventType.GROUPPHOTOS,
        displayName: 'Group Photos',
        Icon: GroupPhotosIcon,
    },
    {
        type: EventType.COUPLEPORTRAITS,
        displayName: 'Couple Portraits',
        Icon: CouplePhotosIcon,
    },
    {
        type: EventType.WEDDINGBREAKFAST,
        displayName: 'Wedding Breakfast',
        Icon: BreakfastIcon,
    },
    {
        type: EventType.SPEECHES,
        displayName: 'Speeches',
        Icon: SpeechesIcon,
    },
    {
        type: EventType.EVENINGGUESTSARRIVE,
        displayName: 'Evening Guests Arrive',
        Icon: EveningGuestsIcon,
    },
    {
        type: EventType.CAKECUTTING,
        displayName: 'Cake Cutting',
        Icon: CakeCutIcon,
    },
    {
        type: EventType.FIRSTDANCE,
        displayName: 'First Dance',
        Icon: FirstDanceIcon,
    },
    {
        type: EventType.EVENINGENTERTAINMENT,
        displayName: 'Evening Entertainment',
        Icon: DjBandIcon,
    },
    {
        type: EventType.EVENINGBUFFET,
        displayName: 'Evening Buffet',
        Icon: BuffetIcon,
    },
    {
        type: EventType.CARRIAGES,
        displayName: 'Carriages',
        Icon: CarriagesIcon,
    },
    {
        type: EventType.OTHER,
        displayName: 'Other',
        Icon: BrideIcon,
    },
];


// A helper function to easily get details by type
export const getEventTypeDetails = (type: EventType): EventTypeDetail | undefined => {
    return eventTypeDetails.find(detail => detail.type === type);
  };
  