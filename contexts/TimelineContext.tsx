import React, { createContext, ReactNode, useContext, useState } from 'react';
import { z } from 'zod';
// Import the Timestamp class from Firestore
import { Timestamp } from 'firebase/firestore';
import { TimelineService } from '../services/timelineService';
// Import the Project type
import { Project } from '../types/project';
import { CombinedEventsTimelineSchema, TTimelineEventForm } from '../types/timeline';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type TimelineData = z.infer<typeof CombinedEventsTimelineSchema>;

const initialTimelineData: TimelineData = {
  events: [],
};

// Add activeProject to the context's type definition
interface TimelineContextType extends BaseFormContextType<TimelineData> {
  activeProject: Project | null; // The project currently being edited in the modal
  events: TTimelineEventForm[];
  loading: boolean;
  error: string | null;
  fetchEvents: (projectId: string) => Promise<void>;
  addEvent: (projectId: string, event: TTimelineEventForm) => Promise<void>;
  removeEvent: (projectId: string, eventId: string) => Promise<void>;
  updateEvent: (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => Promise<void>;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext must be used within a TimelineProvider');
  }
  return context;
};

interface TimelineProviderProps {
  children: ReactNode;
}

export const TimelineProvider: React.FC<TimelineProviderProps> = ({ children }) => {
  const baseContext = useBaseFormContext(
    CombinedEventsTimelineSchema,
    'timeline',
    initialTimelineData,
    {
      successMessage: 'Timeline updated successfully!',
      errorMessage: 'Failed to update timeline. Please try again.',
    }
  );

  const [events, setEvents] = useState<TTimelineEventForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const fetchEvents = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedEvents = await TimelineService.getProjectTimelineEvents(projectId);
      const sortedEvents = fetchedEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
      setEvents(sortedEvents);
      // Correctly convert Date objects to Firestore Timestamps for the base context
      baseContext.setFormData({ events: sortedEvents.map(e => ({...e, time: Timestamp.fromDate(e.time)})) });
    } catch (err) {
      console.error("Failed to fetch timeline events:", err);
      setError('Failed to fetch timeline events.');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (projectId: string, event: TTimelineEventForm) => {
    setLoading(true);
    setError(null);
    try {
      await TimelineService.addProjectTimelineEvent(projectId, event);
      const newEvents = [...events, event].sort((a, b) => a.time.getTime() - b.time.getTime());
      setEvents(newEvents);
      
      // Correctly convert Date to Timestamp for the base context
      baseContext.setFormData({ events: newEvents.map(e => ({...e, time: Timestamp.fromDate(e.time)})) });
      
    } catch (err) {
      console.error("Failed to add event:", err);
      setError('Failed to add event.');
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = async (projectId: string, eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      await TimelineService.deleteProjectTimelineEvent(projectId, eventId);
      const newEvents = events.filter(e => e.eventId !== eventId);
      setEvents(newEvents);
      
      // Correctly convert Date to Timestamp for the base context
      baseContext.setFormData({ events: newEvents.map(e => ({...e, time: Timestamp.fromDate(e.time)})) });
      
    } catch (err) {
      console.error("Failed to remove event:", err);
      setError('Failed to remove event.');
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => {
    setLoading(true);
    setError(null);
    try {
      await TimelineService.updateProjectTimelineEvent(projectId, eventId, updates);
      const newEvents = events.map(e => 
        e.eventId === eventId ? { ...e, ...updates } : e
      ).sort((a, b) => a.time.getTime() - b.time.getTime());
      setEvents(newEvents);
      
      // Correctly convert Date to Timestamp for the base context
      baseContext.setFormData({ events: newEvents.map(e => ({...e, time: Timestamp.fromDate(e.time)})) });
      
    } catch (err) {
      console.error("Failed to update event:", err);
      setError('Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  // Wrap the original openModal function to also set the active project state
  const openModal = (project?: Project) => {
    if (project) {
      setActiveProject(project);
      fetchEvents(project.id); // Fetch events when the modal is opened
    }
    baseContext.openModal(project);
  };

  // Wrap the original closeModal to clear the active project state
  const closeModal = () => {
    setActiveProject(null);
    baseContext.closeModal();
  };

  const contextValue: TimelineContextType = {
    ...baseContext,
    // Override base context functions with our wrapped versions
    openModal,
    closeModal,
    activeProject,
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    removeEvent,
    updateEvent,
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};

// import React, { createContext, ReactNode, useContext, useState } from 'react';
// import { z } from 'zod';
// import { TimelineService } from '../services/timelineService';
// import { CombinedEventsTimelineSchema, TTimelineEventForm } from '../types/timeline';
// import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// type TimelineData = z.infer<typeof CombinedEventsTimelineSchema>;

// const initialTimelineData: TimelineData = {
//   events: [],
// };

// interface TimelineContextType extends BaseFormContextType<TimelineData> {
//   events: TTimelineEventForm[];
//   loading: boolean;
//   error: string | null;
//   fetchEvents: (projectId: string) => Promise<void>;
//   addEvent: (projectId: string, event: TTimelineEventForm) => Promise<void>;
//   removeEvent: (projectId: string, eventId: string) => Promise<void>;
//   updateEvent: (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => Promise<void>;
// }

// const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// export const useTimelineContext = () => {
//   const context = useContext(TimelineContext);
//   if (!context) {
//     throw new Error('useTimelineContext must be used within a TimelineProvider');
//   }
//   return context;
// };

// interface TimelineProviderProps {
//   children: ReactNode;
// }

// export const TimelineProvider: React.FC<TimelineProviderProps> = ({ children }) => {
//   const baseContext = useBaseFormContext(
//     CombinedEventsTimelineSchema,
//     'timeline',
//     initialTimelineData,
//     {
//       successMessage: 'Timeline updated successfully!',
//       errorMessage: 'Failed to update timeline. Please try again.',
//     }
//   );

//   const [events, setEvents] = useState<TTimelineEventForm[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEvents = async (projectId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const fetchedEvents = await TimelineService.getProjectTimelineEvents(projectId);
//       const sortedEvents = fetchedEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
//       setEvents(sortedEvents);
//       // FIX: Set the data in the base context as well.
//       baseContext.setFormData({ events: sortedEvents.map(e => ({...e, time: e.time})) });
//     } catch (err) {
//       setError('Failed to fetch timeline events.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addEvent = async (projectId: string, event: TTimelineEventForm) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await TimelineService.addProjectTimelineEvent(projectId, event);
//       const newEvents = [...events, event].sort((a, b) => a.time.getTime() - b.time.getTime());
//       setEvents(newEvents);
      
//       // FIX: Update the base form context data as well
//       baseContext.setFormData({ events: newEvents.map(e => ({...e, time: e.time})) });
      
//     } catch (err) {
//       setError('Failed to add event.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeEvent = async (projectId: string, eventId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await TimelineService.deleteProjectTimelineEvent(projectId, eventId);
//       const newEvents = events.filter(e => e.eventId !== eventId);
//       setEvents(newEvents);
      
//       // FIX: Update the base form context data as well
//       baseContext.setFormData({ events: newEvents.map(e => ({...e, time: e.time})) });
      
//     } catch (err) {
//       setError('Failed to remove event.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateEvent = async (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await TimelineService.updateProjectTimelineEvent(projectId, eventId, updates);
//       const newEvents = events.map(e => 
//         e.eventId === eventId ? { ...e, ...updates } : e
//       ).sort((a, b) => a.time.getTime() - b.time.getTime());
//       setEvents(newEvents);
      
//       // FIX: Update the base form context data as well
//       baseContext.setFormData({ events: newEvents.map(e => ({...e, time: e.time})) });
      
//     } catch (err) {
//       setError('Failed to update event.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const contextValue: TimelineContextType = {
//     ...baseContext,
//     events,
//     loading,
//     error,
//     fetchEvents,
//     addEvent,
//     removeEvent,
//     updateEvent,
//   };

//   return (
//     <TimelineContext.Provider value={contextValue}>
//       {children}
//     </TimelineContext.Provider>
//   );
// };

// export const TimelineFormProvider = TimelineProvider;
// export const useTimelineForm = useTimelineContext;

// import React, { createContext, ReactNode, useContext } from 'react';
// import { z } from 'zod';
// import { TimelineService } from '../services/timelineService';
// import { CombinedEventsTimelineSchema, TTimelineEventForm } from '../types/timeline';
// import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// // Infer the form data type from the Zod schema
// type TimelineData = z.infer<typeof CombinedEventsTimelineSchema>;

// // Define the initial state for an empty timeline form
// const initialTimelineData: TimelineData = {
//   events: [],
// };

// // Extended context type that combines base form functionality with timeline-specific features
// interface TimelineContextType extends BaseFormContextType<TimelineData> {
//   // Timeline-specific functions for working with individual events
//   addEventToProject: (projectId: string, event: TTimelineEventForm) => Promise<void>;
//   removeEventFromProject: (projectId: string, eventId: string) => Promise<void>;
//   updateEventInProject: (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => Promise<void>;
// }

// const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// export const useTimelineContext = () => {
//   const context = useContext(TimelineContext);
//   if (!context) {
//     throw new Error('useTimelineContext must be used within a TimelineProvider');
//   }
//   return context;
// };

// interface TimelineProviderProps {
//   children: ReactNode;
// }

// export const TimelineProvider: React.FC<TimelineProviderProps> = ({ children }) => {
//   // Use the base form context to get modal functionality
//   const baseContext = useBaseFormContext(
//     CombinedEventsTimelineSchema,
//     'timeline',
//     initialTimelineData,
//     {
//       successMessage: 'Timeline updated successfully!',
//       errorMessage: 'Failed to update timeline. Please try again.',
//     }
//   );

//   // Timeline-specific functions
//   const addEventToProject = async (projectId: string, event: TTimelineEventForm) => {
//     try {
//       await TimelineService.addProjectTimelineEvent(projectId, event);
      
//       // Update the form data with the new event
//       const currentData = baseContext.formData || initialTimelineData;
//       const updatedData = {
//         ...currentData,
//         events: [...(currentData.events || []), event].sort((a, b) => a.time.getTime() - b.time.getTime())
//       };
//       baseContext.setFormData(updatedData);
      
//       baseContext.showSnackbar('Event added successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to add event:', error);
//       baseContext.showSnackbar('Failed to add event. Please try again.', 'error');
//     }
//   };

//   const removeEventFromProject = async (projectId: string, eventId: string) => {
//     try {
//       await TimelineService.deleteProjectTimelineEvent(projectId, eventId);
      
//       // Update the form data by removing the event
//       const currentData = baseContext.formData || initialTimelineData;
//       const updatedData = {
//         ...currentData,
//         events: (currentData.events || []).filter(e => e.eventId !== eventId)
//       };
//       baseContext.setFormData(updatedData);
      
//       baseContext.showSnackbar('Event removed successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to remove event:', error);
//       baseContext.showSnackbar('Failed to remove event. Please try again.', 'error');
//     }
//   };

//   const updateEventInProject = async (projectId: string, eventId: string, updates: Partial<TTimelineEventForm>) => {
//     try {
//       await TimelineService.updateProjectTimelineEvent(projectId, eventId, updates);
      
//       // Update the form data with the updated event
//       const currentData = baseContext.formData || initialTimelineData;
//       const updatedData = {
//         ...currentData,
//         events: (currentData.events || []).map(e => 
//           e.eventId === eventId ? { ...e, ...updates } : e
//         ).sort((a, b) => a.time.getTime() - b.time.getTime())
//       };
//       baseContext.setFormData(updatedData);
      
//       baseContext.showSnackbar('Event updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update event:', error);
//       baseContext.showSnackbar('Failed to update event. Please try again.', 'error');
//     }
//   };

//   // Combine base context with timeline-specific functionality
//   const contextValue: TimelineContextType = {
//     ...baseContext,
//     addEventToProject,
//     removeEventFromProject,
//     updateEventInProject,
//   };

//   return (
//     <TimelineContext.Provider value={contextValue}>
//       {children}
//     </TimelineContext.Provider>
//   );
// };

// // Backward compatibility aliases
// export const TimelineFormProvider = TimelineProvider;
// export const useTimelineForm = useTimelineContext;
