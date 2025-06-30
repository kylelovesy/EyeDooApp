// services/timelineService.ts

import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { z } from 'zod';
import { TimelineEventFormSchema, TTimelineEvent, TTimelineEventForm } from '../types/timeline';
import { db } from './firebase';

// Helper to remove undefined values from objects (Firestore doesn't accept undefined)
const removeUndefinedValues = <T extends Record<string, any>>(obj: T): T => {
  const cleaned = {} as T;
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key as keyof T] = obj[key];
    }
  });
  return cleaned;
};

// Helper to convert form data to Firestore-compatible data
const formDataToFirestoreData = (event: TTimelineEventForm): TTimelineEvent => {
  const firestoreData = {
    ...event,
    time: Timestamp.fromDate(event.time),
  };
  
  // Remove any undefined values before sending to Firestore
  return removeUndefinedValues(firestoreData);
};

// Helper to convert Firestore data to form-compatible data
const firestoreDocToEventForm = (doc: any): TTimelineEventForm => {
  const data = doc.data() as TTimelineEvent;
  return {
    ...data,
    time: data.time.toDate(),
  };
};

export class TimelineService {
  private static getProjectTimelineRef(projectId: string) {
    return collection(db, 'projects', projectId, 'timeline');
  }

  // GET ALL EVENTS FOR A PROJECT
  static async getProjectTimelineEvents(projectId: string): Promise<TTimelineEventForm[]> {
    try {
      const timelineRef = this.getProjectTimelineRef(projectId);
      const timelineSnap = await getDocs(timelineRef);

      if (timelineSnap.empty) {
        return []; // Return empty array if no events exist
      }

      const timelineData = timelineSnap.docs.map(firestoreDocToEventForm);
      
      // Validate the array of events using the correct schema
      const validatedData = z.array(TimelineEventFormSchema).parse(timelineData);
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      throw error;
    }
  }

  // ADD A NEW EVENT TO A PROJECT TIMELINE
  static async addProjectTimelineEvent(projectId: string, event: TTimelineEventForm): Promise<TTimelineEventForm> {
    try {
      const timelineRef = this.getProjectTimelineRef(projectId);
      
      // Convert JS Date to Firestore Timestamp and remove undefined values
      const newEventForFirestore = formDataToFirestoreData(event);
      
      console.log('Saving event to Firestore:', newEventForFirestore);
      
      const docRef = await addDoc(timelineRef, newEventForFirestore);
      
      console.log('Timeline event added with ID:', docRef.id);
      return event; // Return the original form event for immediate UI update
    } catch (error) {
      console.error('Error adding timeline event:', error);
      throw error;
    }
  }

  // UPDATE AN EXISTING EVENT IN A PROJECT TIMELINE
  static async updateProjectTimelineEvent(projectId: string, eventId: string, updates: Partial<TTimelineEventForm>): Promise<void> {
    try {
      const timelineRef = this.getProjectTimelineRef(projectId);
      const q = query(timelineRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`Event with ID ${eventId} not found.`);
      }

      const docToUpdateRef = querySnapshot.docs[0].ref;
      
      // Create finalUpdates with proper type conversion
      const { time, ...restUpdates } = updates;
      let finalUpdates: Partial<TTimelineEvent> = { ...restUpdates };

      // If the time is being updated, convert it to a Timestamp
      if (time) {
        finalUpdates.time = Timestamp.fromDate(time);
      }

      // Remove undefined values before updating
      const cleanedUpdates = removeUndefinedValues(finalUpdates);

      await updateDoc(docToUpdateRef, cleanedUpdates);
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  }

  // DELETE AN EVENT FROM A PROJECT TIMELINE
  static async deleteProjectTimelineEvent(projectId: string, eventId: string): Promise<void> {
    try {
      const timelineRef = this.getProjectTimelineRef(projectId);
      const q = query(timelineRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Event with ID ${eventId} not found.`);
      }

      const docToDeleteRef = querySnapshot.docs[0].ref;
      await deleteDoc(docToDeleteRef);
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      throw error;
    }
  }
  
  // Test data remains unchanged
  static getTestData(projectDate: Date): TTimelineEventForm[] {
    // ... same as before
    return [];
  }
}
