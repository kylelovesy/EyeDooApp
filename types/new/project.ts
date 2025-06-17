// src/types/project.ts

// import z from "zod";
import { Timestamp } from "firebase/firestore";
import { EventStyle, ProjectStatus, ProjectType } from "./enum";
import {
  CandidShot,
  CoupleShot,
  FamilyMember,
  GroupShot,
  LocationInfo,
  OtherKeyPerson,
  PersonInfo,
  PhotoRequest,
  TimelineEvent,
  WeddingPartyMember
} from "./reusableInterfaces";


export interface AddProjectFormData {
  form1EssentialInfoData: {
    id: string,
    userId: string,
    name: string,
    type?: ProjectType,
    status?: ProjectStatus,
    personA: PersonInfo,
    personB: PersonInfo,
    sharedEmail?: string,
    style?: EventStyle,
    eventDate?: Timestamp, // Changed from FirestoreTimestamp to Date
    createdAt?: Timestamp,
    updatedAt?: Timestamp,
    locations: LocationInfo[], // Changed from LocationInfoSchema to any[]
    notes?: string,
  };
  form2TimelineData: {
    events: TimelineEvent[],
  };
  form3PeopleData: {
    immediateFamily?: FamilyMember[],
    extendedFamily?: FamilyMember[],
    weddingParty?: WeddingPartyMember[],
    otherKeyPeople?: OtherKeyPerson[],
    familySituations?: boolean,
    familySituationsNotes?: string,
    guestsToAvoid?: boolean,
    guestsToAvoidNotes?: string,
    surprises?: boolean,
    surprisesNotes?: string,
  };
  form4PhotosData: {
    groupShots?: GroupShot[],
    coupleShots?: CoupleShot[],
    candidShots?: CandidShot[],
    photoRequests?: PhotoRequest[],
    mustHaveMoments?: PhotoRequest[],
    sentimentalMoments?: PhotoRequest[]
  }
}