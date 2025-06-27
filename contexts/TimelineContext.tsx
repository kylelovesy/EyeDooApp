import React, { createContext, ReactNode, useContext, useState } from 'react';
import { TimelineService } from '../services/timelineService';
import { TTimelineEventForm } from '../types/timeline';

// This file now holds the state and uses the TimelineService to perform actions. 
// It's the perfect place to manage loading/error states and set up a real-time onSnapshot listener, 
// which automatically updates your UI when the database changes.

interface TimelineContextType {
  events: TTimelineEventForm[];
  addEvent: (event: TTimelineEventForm) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<TTimelineEventForm>) => void;
  loadTestData: (projectDate: Date) => void;
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
  const [events, setEvents] = useState<TTimelineEventForm[]>([]);

  const addEvent = (event: TTimelineEventForm) => {
    setEvents(prev => [...prev, event]);
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.eventId !== eventId));
  };

  const updateEvent = (eventId: string, updates: Partial<TTimelineEventForm>) => {
    setEvents(prev => prev.map(e => 
      e.eventId === eventId ? { ...e, ...updates } : e
    ));
  };

  const loadTestData = (projectDate: Date) => {
    const testData = TimelineService.getTestData(projectDate);
    setEvents(testData);
  };

  return (
    <TimelineContext.Provider value={{
      events,
      addEvent,
      removeEvent,
      updateEvent,
      loadTestData,
    }}>
      {children}
    </TimelineContext.Provider>
  );
};