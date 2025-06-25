// src/hooks/useProcessedTimeline.ts

import { useEffect, useState } from 'react';
import { EventStatus, timelineUtils } from '../services/timelineService';
import { TimelineEvent } from '../types/timeline';

// Extends the base event type with UI-specific properties.
export interface ProcessedTimelineEvent extends TimelineEvent {
  status: EventStatus;
  progress?: number;
}

/**
 * A custom hook to process raw timeline events for display.
 * It sorts events, determines their status (completed, current, upcoming),
 * and calculates progress for current events.
 * * @param events - The raw array of timeline events.
 * @param currentTime - The current Date object to compare against.
 * @returns An object containing the processed events and the index of the current event.
 */
export const useProcessedTimeline = (events: TimelineEvent[], currentTime: Date) => {
  const [processedEvents, setProcessedEvents] = useState<ProcessedTimelineEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1);

  useEffect(() => {
    // Sort events by time first
    const sortedEvents = timelineUtils.sortEventsByTime(events);
    
    let newCurrentIndex = -1;

    // Map sorted events to processed events with status and progress
    const eventsWithStatus = sortedEvents.map((event, index) => {
      const status = timelineUtils.getEventStatus(event, currentTime);
      let progress;

      if (status === 'current') {
        progress = timelineUtils.calculateEventProgress(event, currentTime);
        newCurrentIndex = index;
      }

      return { ...event, status, progress };
    });

    setProcessedEvents(eventsWithStatus);
    setCurrentEventIndex(newCurrentIndex);
  }, [events, currentTime]);

  return { processedEvents, currentEventIndex };
};