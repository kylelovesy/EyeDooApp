import { CandidShotCategory, ContactType, CoupleShotCategory, GroupShotCategory, LocationType, PhotoRequestType, Pronoun, RelationshipToCouple } from "./enum";

//COUPLE
export interface PersonInfo {
    preferredPronouns?: Pronoun;
    firstName: string;
    surname?: string;
    contactEmail: string;
    contactPhone?: string;
  }
  
  //VENUE
  export interface LocationInfo {
    id?: string | undefined;
    locationType: LocationType;
    locationAddress?: string;
    locationPostcode?: string;
    arriveTime?: string;
    leaveTime?: string;
    locationContactPerson?: string;
    locationContactPhone?: string;
    locationNotes?: string;
  }

  

  //TIMELINE
  export interface TimelineEvent {
    id?: string | undefined;
    time: string; // Format: HH:MM
    description: string;
    location?: string;
    notes?: string;
    icon?: string;
    iconColor?: string; // Hex color string
    priority: number;
    notification: boolean;
    duration?: number; // in minutes
  }

  //PEOPLE
  export interface FamilyMember {
    id?: string | undefined;
    name: string;
    role: string;
    relationshipToCouple?: RelationshipToCouple;
    notes?: string;
  }
  
  export interface WeddingPartyMember {
    id?: string | undefined;
    name: string;
    role: string;
    relationshipToCouple?: RelationshipToCouple;
    notes?: string;
  }
  
  export interface OtherKeyPerson {
    id?: string | undefined;
    typeOfContact: ContactType;
    name: string;
    contactDetails?: string;
  }
  
  //PHOTOS
  export interface GroupShot {
    id?: string | undefined;
    groupShotType: GroupShotCategory;
    groupName?: string;
    groupDescription?: string;
    groupMembers?: string[];
    optionalNotes?: string;
    alwaysInclude?: boolean;
  }

  export interface CoupleShot {
    id?: string | undefined;
    coupleShotType: CoupleShotCategory;
    title?: string;
    location?: string;
    notes?: string;
    importance?: 'low' | 'medium' | 'high';
    alwaysInclude?: boolean;
  }

  export interface CandidShot {
    id?: string | undefined;
    candidShotType: CandidShotCategory;
    title?: string;
    location?: string;
    notes?: string;
    importance?: 'low' | 'medium' | 'high';
    alwaysInclude?: boolean;
  }

  export interface PhotoRequest {
    id?: string | undefined;
    photoRequestType: PhotoRequestType;
    title?: string;
    location?: string;
    notes?: string;
    importance?: 'low' | 'medium' | 'high';
  }
  

  