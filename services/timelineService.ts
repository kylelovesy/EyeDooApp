import {
    doc,
    FirestoreError,
    getDoc,
    onSnapshot,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { z } from 'zod';
import { form2TimelineSchema } from '../types/project-TimelineSchema';
import { TimelineEventSchema } from '../types/reusableSchemas';
import { db } from './firebase'; // Adjust path as needed
  
  type TimelineEvent = z.infer<typeof TimelineEventSchema>;
  type TimelineData = z.infer<typeof form2TimelineSchema>;
  
  export interface TimelineService {
    // Get timeline data for a project
    getProjectTimeline: (projectId: string) => Promise<TimelineData>;
    
    // Save complete timeline data
    saveProjectTimeline: (projectId: string, timelineData: TimelineData) => Promise<void>;
    
    // Update specific timeline event
    updateTimelineEvent: (projectId: string, eventId: string, eventData: TimelineEvent) => Promise<void>;
    
    // Delete specific timeline event
    deleteTimelineEvent: (projectId: string, eventId: string) => Promise<void>;
    
    // Add new timeline event
    addTimelineEvent: (projectId: string, eventData: TimelineEvent) => Promise<string>;
    
    // Subscribe to timeline changes
    subscribeToTimeline: (projectId: string, callback: (timeline: TimelineData) => void) => () => void;
  }
  
  class FirestoreTimelineService implements TimelineService {
    private readonly COLLECTION_NAME = 'projects';
    
    async getProjectTimeline(projectId: string): Promise<TimelineData> {
      try {
        const projectRef = doc(db, this.COLLECTION_NAME, projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (!projectSnap.exists()) {
          throw new Error('Project not found');
        }
        
        const projectData = projectSnap.data();
        const timelineData = projectData.form2 || { events: [] };
        
        // Validate and parse the timeline data
        const validatedData = form2TimelineSchema.parse(timelineData);
        return validatedData;
      } catch (error) {
        console.error('Error getting project timeline:', error);
        if (error instanceof z.ZodError) {
          console.error('Timeline data validation failed:', error.errors);
          // Return default structure if validation fails
          return { events: [] };
        }
        throw error;
      }
    }
    
    async saveProjectTimeline(projectId: string, timelineData: TimelineData): Promise<void> {
      try {
        // Validate the timeline data before saving
        const validatedData = form2TimelineSchema.parse(timelineData);
        
        const projectRef = doc(db, this.COLLECTION_NAME, projectId);
        
        // Update only the form2 field
        await updateDoc(projectRef, {
          'form2': validatedData,
          'updatedAt': Timestamp.now()
        });
        
        console.log('Timeline saved successfully');
      } catch (error) {
        console.error('Error saving timeline:', error);
        throw error;
      }
    }
    
    async updateTimelineEvent(projectId: string, eventId: string, eventData: TimelineEvent): Promise<void> {
      try {
        // Validate the event data
        const validatedEvent = TimelineEventSchema.parse(eventData);
        
        // Get current timeline
        const currentTimeline = await this.getProjectTimeline(projectId);
        
        // Find and update the specific event
        const eventIndex = currentTimeline.events.findIndex(event => event.id === eventId);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }
        
        currentTimeline.events[eventIndex] = validatedEvent;
        
        // Sort events by time
        currentTimeline.events.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
        
        // Save the updated timeline
        await this.saveProjectTimeline(projectId, currentTimeline);
      } catch (error) {
        console.error('Error updating timeline event:', error);
        throw error;
      }
    }
    
    async deleteTimelineEvent(projectId: string, eventId: string): Promise<void> {
      try {
        // Get current timeline
        const currentTimeline = await this.getProjectTimeline(projectId);
        
        // Remove the specific event
        currentTimeline.events = currentTimeline.events.filter(event => event.id !== eventId);
        
        // Save the updated timeline
        await this.saveProjectTimeline(projectId, currentTimeline);
      } catch (error) {
        console.error('Error deleting timeline event:', error);
        throw error;
      }
    }
    
    async addTimelineEvent(projectId: string, eventData: TimelineEvent): Promise<string> {
      try {
        // Generate ID if not provided
        const eventId = eventData.id || Date.now().toString();
        const eventWithId = { ...eventData, id: eventId };
        
        // Validate the event data
        const validatedEvent = TimelineEventSchema.parse(eventWithId);
        
        // Get current timeline
        const currentTimeline = await this.getProjectTimeline(projectId);
        
        // Add the new event
        currentTimeline.events.push(validatedEvent);
        
        // Sort events by time
        currentTimeline.events.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
        
        // Save the updated timeline
        await this.saveProjectTimeline(projectId, currentTimeline);
        
        return eventId;
      } catch (error) {
        console.error('Error adding timeline event:', error);
        throw error;
      }
    }
    
    subscribeToTimeline(projectId: string, callback: (timeline: TimelineData) => void): () => void {
      const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      
      const unsubscribe = onSnapshot(
        projectRef,
        (doc) => {
          if (doc.exists()) {
            const projectData = doc.data();
            const timelineData = projectData.form2 || { events: [] };
            
            try {
              const validatedData = form2TimelineSchema.parse(timelineData);
              callback(validatedData);
            } catch (error) {
              console.error('Timeline data validation failed:', error);
              callback({ events: [] });
            }
          } else {
            callback({ events: [] });
          }
        },
        (error: FirestoreError) => {
          console.error('Timeline subscription error:', error);
          // Call callback with empty data on error
          callback({ events: [] });
        }
      );
      
      return unsubscribe;
    }
  }
  
  // Export singleton instance
  export const timelineService = new FirestoreTimelineService();
  
  // Hook for using timeline service with React
  export const useTimelineService = () => {
    return timelineService;
  };
  
  // Utility functions for timeline operations
  export const timelineUtils = {
    // Sort events by time
    sortEventsByTime: (events: TimelineEvent[]): TimelineEvent[] => {
      return [...events].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    },
    
    // Validate timeline data
    validateTimelineData: (data: unknown): TimelineData => {
      return form2TimelineSchema.parse(data);
    },
    
    // Validate single event
    validateEvent: (data: unknown): TimelineEvent => {
      return TimelineEventSchema.parse(data);
    },
    
    // Generate unique event ID
    generateEventId: (): string => {
      return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Calculate event end time
    calculateEndTime: (startTime: string, duration: number = 30): string => {
      if (!startTime || !startTime.match(/^\d{2}:\d{2}$/)) {
        return '';
      }
      
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + duration;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    },
    
    // Format time to 12-hour format
    formatTime12Hour: (time: string): string => {
      if (!time || !time.match(/^\d{2}:\d{2}$/)) {
        return time || '';
      }
      
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };
  
  export default timelineService;
  
  