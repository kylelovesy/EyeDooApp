# Day 5: Timeline Management, Alerts & Maps Integration

## Overview
Day 5 focuses on implementing the interactive wedding day timeline with real-time updates, alert/notification system, and integrated maps functionality for venue directions. This builds on the foundation from Days 1-4 to create a comprehensive timeline management system.

## 🎯 **Day 5 Goals**
- Interactive timeline creation and editing
- Real-time timeline updates based on current time
- Alert and notification system for timeline events
- Google Maps integration for venue directions
- Weather integration for timeline planning
- Timeline auto-population from questionnaire data

## ⏰ **Time Allocation (4 hours)**

### Morning Session (2 hours)
- **Task 5.1**: Timeline Management System (60 minutes)
- **Task 5.2**: Real-time Updates & Current Time Tracking (60 minutes)

### Afternoon Session (2 hours)
- **Task 5.3**: Alerts & Notifications System (60 minutes)
- **Task 5.4**: Maps Integration & Directions (60 minutes)

---

## 📋 **Task 5.1: Timeline Management System (60 minutes)**

### Step 1: Timeline Data Models
Create comprehensive TypeScript interfaces for timeline management.

**File: `src/types/timeline.ts`**
```typescript
/**
 * Eye Do Plan - Timeline Management Types
 * Comprehensive timeline system for wedding day planning
 */

export interface TimelineEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  icon: string;
  locationId?: string;
  description?: string;
  alertSettings: AlertSettings;
  isCompleted: boolean;
  category: TimelineCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertSettings {
  enabled: boolean;
  minutesBefore: number;
  type: AlertType[];
  customMessage?: string;
}

export type AlertType = 'sound' | 'vibration' | 'notification';

export type TimelineCategory = 
  | 'getting_ready'
  | 'ceremony'
  | 'reception'
  | 'photography'
  | 'travel'
  | 'break'
  | 'custom';

export interface TimelineTemplate {
  id: string;
  name: string;
  description: string;
  events: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>[];
}

export interface TimelineState {
  events: TimelineEvent[];
  currentTime: Date;
  activeEvent?: TimelineEvent;
  upcomingEvents: TimelineEvent[];
  isLive: boolean;
}
```

### Step 2: Timeline Service
Create a comprehensive service for timeline management.

**File: `src/services/timelineService.ts`**
```typescript
/**
 * Eye Do Plan - Timeline Service
 * Manages wedding day timeline with real-time updates
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TimelineEvent, AlertSettings, TimelineCategory } from '../types/timeline';
import { handleError } from '../utils/errorHandler';

export class TimelineService {
  private static instance: TimelineService;
  private listeners: Map<string, () => void> = new Map();

  static getInstance(): TimelineService {
    if (!TimelineService.instance) {
      TimelineService.instance = new TimelineService();
    }
    return TimelineService.instance;
  }

  /**
   * Create a new timeline event
   */
  async createEvent(
    weddingId: string, 
    eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TimelineEvent> {
    try {
      const eventsRef = collection(db, 'weddings', weddingId, 'timelineEvents');
      const now = new Date();
      
      const newEvent = {
        ...eventData,
        startTime: Timestamp.fromDate(eventData.startTime),
        endTime: eventData.endTime ? Timestamp.fromDate(eventData.endTime) : null,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const docRef = await addDoc(eventsRef, newEvent);
      
      return {
        id: docRef.id,
        ...eventData,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      throw handleError(error, 'Failed to create timeline event');
    }
  }

  /**
   * Update an existing timeline event
   */
  async updateEvent(
    weddingId: string, 
    eventId: string, 
    updates: Partial<TimelineEvent>
  ): Promise<void> {
    try {
      const eventRef = doc(db, 'weddings', weddingId, 'timelineEvents', eventId);
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Convert Date objects to Timestamps
      if (updates.startTime) {
        updateData.startTime = Timestamp.fromDate(updates.startTime);
      }
      if (updates.endTime) {
        updateData.endTime = Timestamp.fromDate(updates.endTime);
      }

      await updateDoc(eventRef, updateData);
    } catch (error) {
      throw handleError(error, 'Failed to update timeline event');
    }
  }

  /**
   * Delete a timeline event
   */
  async deleteEvent(weddingId: string, eventId: string): Promise<void> {
    try {
      const eventRef = doc(db, 'weddings', weddingId, 'timelineEvents', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      throw handleError(error, 'Failed to delete timeline event');
    }
  }

  /**
   * Get all timeline events for a wedding
   */
  async getEvents(weddingId: string): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, 'weddings', weddingId, 'timelineEvents');
      const q = query(eventsRef, orderBy('startTime', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime.toDate(),
          endTime: data.endTime?.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as TimelineEvent;
      });
    } catch (error) {
      throw handleError(error, 'Failed to fetch timeline events');
    }
  }

  /**
   * Subscribe to real-time timeline updates
   */
  subscribeToEvents(
    weddingId: string, 
    callback: (events: TimelineEvent[]) => void
  ): () => void {
    try {
      const eventsRef = collection(db, 'weddings', weddingId, 'timelineEvents');
      const q = query(eventsRef, orderBy('startTime', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const events = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startTime: data.startTime.toDate(),
            endTime: data.endTime?.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as TimelineEvent;
        });
        callback(events);
      });

      this.listeners.set(weddingId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      throw handleError(error, 'Failed to subscribe to timeline events');
    }
  }

  /**
   * Auto-populate timeline from questionnaire data
   */
  async autoPopulateFromQuestionnaire(
    weddingId: string, 
    locations: any[]
  ): Promise<TimelineEvent[]> {
    try {
      const events: TimelineEvent[] = [];
      
      for (const location of locations) {
        if (location.arriveTime && location.leaveTime) {
          const event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `${location.locationType} - ${location.locationAddress_formatted}`,
            startTime: new Date(location.arriveTime),
            endTime: new Date(location.leaveTime),
            icon: this.getIconForLocationType(location.locationType),
            locationId: location.id,
            description: location.locationNotes || '',
            alertSettings: {
              enabled: true,
              minutesBefore: 15,
              type: ['notification', 'vibration']
            },
            isCompleted: false,
            category: this.getCategoryForLocationType(location.locationType)
          };
          
          const createdEvent = await this.createEvent(weddingId, event);
          events.push(createdEvent);
        }
      }
      
      return events;
    } catch (error) {
      throw handleError(error, 'Failed to auto-populate timeline');
    }
  }

  /**
   * Get current and upcoming events
   */
  getCurrentAndUpcomingEvents(events: TimelineEvent[]): {
    current?: TimelineEvent;
    upcoming: TimelineEvent[];
  } {
    const now = new Date();
    const current = events.find(event => 
      event.startTime <= now && 
      (event.endTime ? event.endTime >= now : true)
    );
    
    const upcoming = events
      .filter(event => event.startTime > now)
      .slice(0, 3);
    
    return { current, upcoming };
  }

  private getIconForLocationType(locationType: string): string {
    const iconMap: Record<string, string> = {
      'Main Venue': 'MapPin',
      'Ceremony': 'Heart',
      'Reception': 'Utensils',
      'Getting Ready Location A': 'Dress',
      'Getting Ready Location B': 'Shirt',
      'Photography Location': 'Camera'
    };
    return iconMap[locationType] || 'MapPin';
  }

  private getCategoryForLocationType(locationType: string): TimelineCategory {
    const categoryMap: Record<string, TimelineCategory> = {
      'Getting Ready Location A': 'getting_ready',
      'Getting Ready Location B': 'getting_ready',
      'Ceremony': 'ceremony',
      'Reception': 'reception',
      'Photography Location': 'photography'
    };
    return categoryMap[locationType] || 'custom';
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }
}

export const timelineService = TimelineService.getInstance();
```

### Step 3: Timeline Context
Create a React context for timeline state management.

**File: `src/contexts/TimelineContext.tsx`**
```typescript
/**
 * Eye Do Plan - Timeline Context
 * Global state management for timeline functionality
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TimelineEvent, TimelineState } from '../types/timeline';
import { timelineService } from '../services/timelineService';

interface TimelineContextType {
  state: TimelineState;
  actions: {
    loadEvents: (weddingId: string) => Promise<void>;
    createEvent: (weddingId: string, event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateEvent: (weddingId: string, eventId: string, updates: Partial<TimelineEvent>) => Promise<void>;
    deleteEvent: (weddingId: string, eventId: string) => Promise<void>;
    markEventCompleted: (weddingId: string, eventId: string) => Promise<void>;
    startLiveMode: () => void;
    stopLiveMode: () => void;
  };
}

type TimelineAction = 
  | { type: 'SET_EVENTS'; payload: TimelineEvent[] }
  | { type: 'ADD_EVENT'; payload: TimelineEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<TimelineEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_CURRENT_TIME'; payload: Date }
  | { type: 'SET_LIVE_MODE'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: TimelineState = {
  events: [],
  currentTime: new Date(),
  isLive: false
};

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'SET_EVENTS':
      const events = action.payload;
      const { current, upcoming } = timelineService.getCurrentAndUpcomingEvents(events);
      return {
        ...state,
        events,
        activeEvent: current,
        upcomingEvents: upcoming
      };
    
    case 'ADD_EVENT':
      const newEvents = [...state.events, action.payload].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      );
      const { current: newCurrent, upcoming: newUpcoming } = 
        timelineService.getCurrentAndUpcomingEvents(newEvents);
      return {
        ...state,
        events: newEvents,
        activeEvent: newCurrent,
        upcomingEvents: newUpcoming
      };
    
    case 'UPDATE_EVENT':
      const updatedEvents = state.events.map(event =>
        event.id === action.payload.id 
          ? { ...event, ...action.payload.updates }
          : event
      );
      const { current: updatedCurrent, upcoming: updatedUpcoming } = 
        timelineService.getCurrentAndUpcomingEvents(updatedEvents);
      return {
        ...state,
        events: updatedEvents,
        activeEvent: updatedCurrent,
        upcomingEvents: updatedUpcoming
      };
    
    case 'DELETE_EVENT':
      const filteredEvents = state.events.filter(event => event.id !== action.payload);
      const { current: filteredCurrent, upcoming: filteredUpcoming } = 
        timelineService.getCurrentAndUpcomingEvents(filteredEvents);
      return {
        ...state,
        events: filteredEvents,
        activeEvent: filteredCurrent,
        upcomingEvents: filteredUpcoming
      };
    
    case 'SET_CURRENT_TIME':
      const { current: timeCurrent, upcoming: timeUpcoming } = 
        timelineService.getCurrentAndUpcomingEvents(state.events);
      return {
        ...state,
        currentTime: action.payload,
        activeEvent: timeCurrent,
        upcomingEvents: timeUpcoming
      };
    
    case 'SET_LIVE_MODE':
      return {
        ...state,
        isLive: action.payload
      };
    
    default:
      return state;
  }
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);

  // Update current time every minute when in live mode
  useEffect(() => {
    if (!state.isLive) return;

    const interval = setInterval(() => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: new Date() });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [state.isLive]);

  const actions = {
    loadEvents: async (weddingId: string) => {
      try {
        const events = await timelineService.getEvents(weddingId);
        dispatch({ type: 'SET_EVENTS', payload: events });
      } catch (error) {
        console.error('Failed to load timeline events:', error);
      }
    },

    createEvent: async (weddingId: string, eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const event = await timelineService.createEvent(weddingId, eventData);
        dispatch({ type: 'ADD_EVENT', payload: event });
      } catch (error) {
        console.error('Failed to create timeline event:', error);
      }
    },

    updateEvent: async (weddingId: string, eventId: string, updates: Partial<TimelineEvent>) => {
      try {
        await timelineService.updateEvent(weddingId, eventId, updates);
        dispatch({ type: 'UPDATE_EVENT', payload: { id: eventId, updates } });
      } catch (error) {
        console.error('Failed to update timeline event:', error);
      }
    },

    deleteEvent: async (weddingId: string, eventId: string) => {
      try {
        await timelineService.deleteEvent(weddingId, eventId);
        dispatch({ type: 'DELETE_EVENT', payload: eventId });
      } catch (error) {
        console.error('Failed to delete timeline event:', error);
      }
    },

    markEventCompleted: async (weddingId: string, eventId: string) => {
      try {
        await timelineService.updateEvent(weddingId, eventId, { isCompleted: true });
        dispatch({ type: 'UPDATE_EVENT', payload: { id: eventId, updates: { isCompleted: true } } });
      } catch (error) {
        console.error('Failed to mark event as completed:', error);
      }
    },

    startLiveMode: () => {
      dispatch({ type: 'SET_LIVE_MODE', payload: true });
      dispatch({ type: 'SET_CURRENT_TIME', payload: new Date() });
    },

    stopLiveMode: () => {
      dispatch({ type: 'SET_LIVE_MODE', payload: false });
    }
  };

  return (
    <TimelineContext.Provider value={{ state, actions }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
```

---

## 📋 **Task 5.2: Real-time Updates & Current Time Tracking (60 minutes)**

### Step 1: Timeline Component with Real-time Updates
Create the main timeline component with live tracking.

**File: `src/components/timeline/TimelineView.tsx`**
```typescript
/**
 * Eye Do Plan - Timeline View Component
 * Interactive timeline with real-time updates and current time tracking
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, IconButton, Chip } from 'react-native-paper';
import { format, isToday, isBefore, isAfter, differenceInMinutes } from 'date-fns';
import { useTimeline } from '../../contexts/TimelineContext';
import { TimelineEvent } from '../../types/timeline';
import { TimelineEventModal } from './TimelineEventModal';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { WeatherWidget } from './WeatherWidget';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TimelineViewProps {
  weddingId: string;
  weddingDate: Date;
}

export function TimelineView({ weddingId, weddingDate }: TimelineViewProps) {
  const { state, actions } = useTimeline();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isWeddingDay, setIsWeddingDay] = useState(false);

  useEffect(() => {
    actions.loadEvents(weddingId);
    setIsWeddingDay(isToday(weddingDate));
  }, [weddingId, weddingDate]);

  useEffect(() => {
    if (isWeddingDay && !state.isLive) {
      actions.startLiveMode();
    }
  }, [isWeddingDay, state.isLive]);

  const handleEventPress = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (event: TimelineEvent) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => actions.deleteEvent(weddingId, event.id)
        }
      ]
    );
  };

  const getEventStatus = (event: TimelineEvent) => {
    if (event.isCompleted) return 'completed';
    if (!isWeddingDay) return 'scheduled';
    
    const now = state.currentTime;
    if (isBefore(now, event.startTime)) return 'upcoming';
    if (event.endTime && isAfter(now, event.endTime)) return 'overdue';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'active': return '#2196F3';
      case 'upcoming': return '#FF9800';
      case 'overdue': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getTimeUntilEvent = (event: TimelineEvent) => {
    if (!isWeddingDay) return null;
    const minutes = differenceInMinutes(event.startTime, state.currentTime);
    if (minutes < 0) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header with Live Mode Indicator */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          fontFamily: 'PlusJakartaSans-Bold',
          color: '#0d141c'
        }}>
          Wedding Day Timeline
        </Text>
        
        {isWeddingDay && (
          <Chip 
            icon="clock" 
            mode="flat"
            style={{ backgroundColor: '#e3f2fd' }}
            textStyle={{ color: '#1976d2', fontFamily: 'PlusJakartaSans-SemiBold' }}
          >
            LIVE
          </Chip>
        )}
      </View>

      {/* Weather Widget for Wedding Day */}
      {isWeddingDay && (
        <WeatherWidget weddingId={weddingId} />
      )}

      {/* Current Time Indicator */}
      {isWeddingDay && state.activeEvent && (
        <CurrentTimeIndicator 
          currentEvent={state.activeEvent}
          upcomingEvents={state.upcomingEvents}
          currentTime={state.currentTime}
        />
      )}

      {/* Timeline Events */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {state.events.map((event, index) => {
          const status = getEventStatus(event);
          const timeUntil = getTimeUntilEvent(event);
          
          return (
            <View key={event.id} style={{ marginBottom: 16 }}>
              {/* Timeline Line */}
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}>
                {/* Timeline Dot and Line */}
                <View style={{ 
                  alignItems: 'center',
                  marginRight: 16,
                  width: 40
                }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: getStatusColor(status),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 8
                  }}>
                    <Icon 
                      name={event.icon} 
                      size={14} 
                      color="white" 
                    />
                  </View>
                  
                  {index < state.events.length - 1 && (
                    <View style={{
                      width: 2,
                      height: 60,
                      backgroundColor: '#e0e0e0',
                      marginTop: 4
                    }} />
                  )}
                </View>

                {/* Event Card */}
                <Card 
                  style={{ 
                    flex: 1,
                    elevation: status === 'active' ? 4 : 2,
                    backgroundColor: status === 'active' ? '#e3f2fd' : 'white'
                  }}
                  onPress={() => handleEventPress(event)}
                >
                  <Card.Content style={{ padding: 16 }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: 'bold',
                          fontFamily: 'PlusJakartaSans-Bold',
                          color: '#0d141c',
                          marginBottom: 4
                        }}>
                          {event.title}
                        </Text>
                        
                        <Text style={{ 
                          fontSize: 14,
                          fontFamily: 'PlusJakartaSans-Regular',
                          color: '#49739c',
                          marginBottom: 8
                        }}>
                          {format(event.startTime, 'h:mm a')}
                          {event.endTime && ` - ${format(event.endTime, 'h:mm a')}`}
                        </Text>

                        {event.description && (
                          <Text style={{ 
                            fontSize: 12,
                            fontFamily: 'PlusJakartaSans-Regular',
                            color: '#666',
                            marginBottom: 8
                          }}>
                            {event.description}
                          </Text>
                        )}

                        {/* Status and Time Until */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Chip 
                            mode="flat"
                            style={{ 
                              backgroundColor: getStatusColor(status) + '20',
                              marginRight: 8
                            }}
                            textStyle={{ 
                              color: getStatusColor(status),
                              fontSize: 10,
                              fontFamily: 'PlusJakartaSans-SemiBold'
                            }}
                          >
                            {status.toUpperCase()}
                          </Chip>
                          
                          {timeUntil && (
                            <Chip 
                              mode="flat"
                              style={{ backgroundColor: '#fff3e0' }}
                              textStyle={{ 
                                color: '#f57c00',
                                fontSize: 10,
                                fontFamily: 'PlusJakartaSans-SemiBold'
                              }}
                            >
                              {timeUntil}
                            </Chip>
                          )}
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={{ flexDirection: 'row' }}>
                        {!event.isCompleted && status !== 'upcoming' && (
                          <IconButton
                            icon="check"
                            size={20}
                            iconColor="#4CAF50"
                            onPress={() => actions.markEventCompleted(weddingId, event.id)}
                          />
                        )}
                        
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor="#F44336"
                          onPress={() => handleDeleteEvent(event)}
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Event Button */}
      <View style={{ 
        position: 'absolute',
        bottom: 20,
        right: 20
      }}>
        <Button
          mode="contained"
          icon="plus"
          onPress={handleAddEvent}
          style={{ 
            backgroundColor: '#3d98f4',
            borderRadius: 28
          }}
          labelStyle={{ 
            fontFamily: 'PlusJakartaSans-Bold',
            color: 'white'
          }}
        >
          Add Event
        </Button>
      </View>

      {/* Event Modal */}
      <TimelineEventModal
        visible={showEventModal}
        event={selectedEvent}
        weddingId={weddingId}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
      />
    </View>
  );
}
```

### Step 2: Current Time Indicator Component
Create a component to show current progress and upcoming events.

**File: `src/components/timeline/CurrentTimeIndicator.tsx`**
```typescript
/**
 * Eye Do Plan - Current Time Indicator
 * Shows current event progress and upcoming events
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card, ProgressBar, Chip } from 'react-native-paper';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { TimelineEvent } from '../../types/timeline';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CurrentTimeIndicatorProps {
  currentEvent: TimelineEvent;
  upcomingEvents: TimelineEvent[];
  currentTime: Date;
}

export function CurrentTimeIndicator({ 
  currentEvent, 
  upcomingEvents, 
  currentTime 
}: CurrentTimeIndicatorProps) {
  const getEventProgress = () => {
    if (!currentEvent.endTime) return 0;
    
    const totalDuration = differenceInMinutes(currentEvent.endTime, currentEvent.startTime);
    const elapsed = differenceInMinutes(currentTime, currentEvent.startTime);
    
    return Math.max(0, Math.min(1, elapsed / totalDuration));
  };

  const getTimeRemaining = () => {
    if (!currentEvent.endTime) return null;
    
    const remaining = differenceInMinutes(currentEvent.endTime, currentTime);
    if (remaining <= 0) return 'Overdue';
    if (remaining < 60) return `${remaining}m remaining`;
    
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <Card style={{ 
      margin: 16, 
      backgroundColor: '#e8f5e8',
      elevation: 4
    }}>
      <Card.Content style={{ padding: 16 }}>
        {/* Current Event */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: 8
          }}>
            <Icon 
              name="clock" 
              size={20} 
              color="#2e7d32" 
              style={{ marginRight: 8 }}
            />
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold',
              fontFamily: 'PlusJakartaSans-Bold',
              color: '#2e7d32'
            }}>
              Current Event
            </Text>
          </View>
          
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold',
            fontFamily: 'PlusJakartaSans-Bold',
            color: '#0d141c',
            marginBottom: 4
          }}>
            {currentEvent.title}
          </Text>
          
          <Text style={{ 
            fontSize: 14,
            fontFamily: 'PlusJakartaSans-Regular',
            color: '#49739c',
            marginBottom: 8
          }}>
            Started at {format(currentEvent.startTime, 'h:mm a')}
            {currentEvent.endTime && ` • Ends at ${format(currentEvent.endTime, 'h:mm a')}`}
          </Text>

          {/* Progress Bar */}
          {currentEvent.endTime && (
            <View style={{ marginBottom: 8 }}>
              <ProgressBar 
                progress={getEventProgress()} 
                color="#4CAF50"
                style={{ height: 6, borderRadius: 3 }}
              />
              <Text style={{ 
                fontSize: 12,
                fontFamily: 'PlusJakartaSans-Regular',
                color: '#666',
                marginTop: 4,
                textAlign: 'center'
              }}>
                {getTimeRemaining()}
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: 'bold',
              fontFamily: 'PlusJakartaSans-Bold',
              color: '#0d141c',
              marginBottom: 8
            }}>
              Coming Up
            </Text>
            
            {upcomingEvents.slice(0, 2).map((event, index) => {
              const minutesUntil = differenceInMinutes(event.startTime, currentTime);
              
              return (
                <View 
                  key={event.id}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginBottom: index < upcomingEvents.length - 1 ? 8 : 0
                  }}
                >
                  <Icon 
                    name={event.icon} 
                    size={16} 
                    color="#49739c" 
                    style={{ marginRight: 8 }}
                  />
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 14,
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      color: '#0d141c'
                    }}>
                      {event.title}
                    </Text>
                    <Text style={{ 
                      fontSize: 12,
                      fontFamily: 'PlusJakartaSans-Regular',
                      color: '#49739c'
                    }}>
                      {format(event.startTime, 'h:mm a')}
                    </Text>
                  </View>
                  
                  <Chip 
                    mode="flat"
                    style={{ backgroundColor: '#fff3e0' }}
                    textStyle={{ 
                      color: '#f57c00',
                      fontSize: 10,
                      fontFamily: 'PlusJakartaSans-SemiBold'
                    }}
                  >
                    {minutesUntil < 60 ? `${minutesUntil}m` : `${Math.floor(minutesUntil / 60)}h`}
                  </Chip>
                </View>
              );
            })}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
```

---

## 📋 **Task 5.3: Alerts & Notifications System (60 minutes)**

### Step 1: Notification Service
Create a comprehensive notification system for timeline alerts.

**File: `src/services/notificationService.ts`**
```typescript
/**
 * Eye Do Plan - Notification Service
 * Handles alerts and notifications for timeline events
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { TimelineEvent, AlertType } from '../types/timeline';
import { handleError } from '../utils/errorHandler';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private scheduledNotifications: Map<string, string[]> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification permissions
   */
  async initialize(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('timeline-alerts', {
          name: 'Timeline Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3d98f4',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      throw handleError(error, 'Failed to initialize notifications');
    }
  }

  /**
   * Schedule notification for a timeline event
   */
  async scheduleEventNotification(event: TimelineEvent): Promise<void> {
    try {
      if (!event.alertSettings.enabled) return;

      // Cancel existing notifications for this event
      await this.cancelEventNotifications(event.id);

      const notifications: string[] = [];
      const alertTime = new Date(
        event.startTime.getTime() - (event.alertSettings.minutesBefore * 60 * 1000)
      );

      // Only schedule if alert time is in the future
      if (alertTime > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Eye Do Plan - Timeline Alert',
            body: event.alertSettings.customMessage || 
                  `${event.title} starts in ${event.alertSettings.minutesBefore} minutes`,
            data: {
              eventId: event.id,
              eventTitle: event.title,
              type: 'timeline-alert'
            },
            sound: event.alertSettings.type.includes('sound') ? 'default' : undefined,
            vibrate: event.alertSettings.type.includes('vibration') ? [0, 250, 250, 250] : undefined,
          },
          trigger: {
            date: alertTime,
            channelId: 'timeline-alerts'
          },
        });

        notifications.push(notificationId);
      }

      // Schedule additional reminder 5 minutes before if event is more than 30 minutes away
      if (event.alertSettings.minutesBefore > 30) {
        const reminderTime = new Date(event.startTime.getTime() - (5 * 60 * 1000));
        
        if (reminderTime > new Date()) {
          const reminderId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Eye Do Plan - Final Reminder',
              body: `${event.title} starts in 5 minutes`,
              data: {
                eventId: event.id,
                eventTitle: event.title,
                type: 'final-reminder'
              },
              sound: 'default',
              vibrate: [0, 250, 250, 250],
            },
            trigger: {
              date: reminderTime,
              channelId: 'timeline-alerts'
            },
          });

          notifications.push(reminderId);
        }
      }

      this.scheduledNotifications.set(event.id, notifications);
    } catch (error) {
      throw handleError(error, 'Failed to schedule event notification');
    }
  }

  /**
   * Cancel notifications for a specific event
   */
  async cancelEventNotifications(eventId: string): Promise<void> {
    try {
      const notificationIds = this.scheduledNotifications.get(eventId);
      if (notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(notificationIds[0]);
        for (const id of notificationIds) {
          await Notifications.cancelScheduledNotificationAsync(id);
        }
        this.scheduledNotifications.delete(eventId);
      }
    } catch (error) {
      throw handleError(error, 'Failed to cancel event notifications');
    }
  }

  /**
   * Schedule notifications for all events
   */
  async scheduleAllEventNotifications(events: TimelineEvent[]): Promise<void> {
    try {
      // Cancel all existing notifications
      await this.cancelAllNotifications();

      // Schedule notifications for each event
      for (const event of events) {
        if (event.alertSettings.enabled && !event.isCompleted) {
          await this.scheduleEventNotification(event);
        }
      }
    } catch (error) {
      throw handleError(error, 'Failed to schedule all event notifications');
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();
    } catch (error) {
      throw handleError(error, 'Failed to cancel all notifications');
    }
  }

  /**
   * Send immediate notification
   */
  async sendImmediateNotification(
    title: string, 
    body: string, 
    data?: any
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      throw handleError(error, 'Failed to send immediate notification');
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      throw handleError(error, 'Failed to get scheduled notifications');
    }
  }

  /**
   * Handle notification response (when user taps notification)
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Handle notification received while app is in foreground
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }
}

export const notificationService = NotificationService.getInstance();
```

### Step 2: Alert Settings Component
Create a component for configuring event alerts.

**File: `src/components/timeline/AlertSettingsModal.tsx`**
```typescript
/**
 * Eye Do Plan - Alert Settings Modal
 * Configure notifications and alerts for timeline events
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { 
  Modal, 
  Portal, 
  Card, 
  Button, 
  Switch, 
  Chip, 
  TextInput,
  Divider 
} from 'react-native-paper';
import { AlertSettings, AlertType } from '../../types/timeline';

interface AlertSettingsModalProps {
  visible: boolean;
  alertSettings: AlertSettings;
  onSave: (settings: AlertSettings) => void;
  onClose: () => void;
}

export function AlertSettingsModal({ 
  visible, 
  alertSettings, 
  onSave, 
  onClose 
}: AlertSettingsModalProps) {
  const [settings, setSettings] = useState<AlertSettings>(alertSettings);

  useEffect(() => {
    setSettings(alertSettings);
  }, [alertSettings]);

  const timeOptions = [
    { label: '5 minutes', value: 5 },
    { label: '10 minutes', value: 10 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 }
  ];

  const alertTypes: { label: string; value: AlertType }[] = [
    { label: 'Sound', value: 'sound' },
    { label: 'Vibration', value: 'vibration' },
    { label: 'Notification', value: 'notification' }
  ];

  const handleAlertTypeToggle = (type: AlertType) => {
    const newTypes = settings.type.includes(type)
      ? settings.type.filter(t => t !== type)
      : [...settings.type, type];
    
    setSettings({ ...settings, type: newTypes });
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%'
        }}
      >
        <ScrollView>
          <Card.Content style={{ padding: 24 }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold',
              fontFamily: 'PlusJakartaSans-Bold',
              color: '#0d141c',
              marginBottom: 20,
              textAlign: 'center'
            }}>
              Alert Settings
            </Text>

            {/* Enable Alerts */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ 
                fontSize: 16,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: '#0d141c'
              }}>
                Enable Alerts
              </Text>
              <Switch
                value={settings.enabled}
                onValueChange={(enabled) => setSettings({ ...settings, enabled })}
                color="#3d98f4"
              />
            </View>

            {settings.enabled && (
              <>
                <Divider style={{ marginBottom: 20 }} />

                {/* Alert Timing */}
                <Text style={{ 
                  fontSize: 16,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#0d141c',
                  marginBottom: 12
                }}>
                  Alert Timing
                </Text>
                
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap',
                  marginBottom: 20
                }}>
                  {timeOptions.map((option) => (
                    <Chip
                      key={option.value}
                      mode={settings.minutesBefore === option.value ? 'flat' : 'outlined'}
                      selected={settings.minutesBefore === option.value}
                      onPress={() => setSettings({ ...settings, minutesBefore: option.value })}
                      style={{ 
                        margin: 4,
                        backgroundColor: settings.minutesBefore === option.value ? '#3d98f4' : 'transparent'
                      }}
                      textStyle={{ 
                        color: settings.minutesBefore === option.value ? 'white' : '#0d141c',
                        fontFamily: 'PlusJakartaSans-SemiBold'
                      }}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </View>

                {/* Alert Types */}
                <Text style={{ 
                  fontSize: 16,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#0d141c',
                  marginBottom: 12
                }}>
                  Alert Types
                </Text>
                
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap',
                  marginBottom: 20
                }}>
                  {alertTypes.map((type) => (
                    <Chip
                      key={type.value}
                      mode={settings.type.includes(type.value) ? 'flat' : 'outlined'}
                      selected={settings.type.includes(type.value)}
                      onPress={() => handleAlertTypeToggle(type.value)}
                      style={{ 
                        margin: 4,
                        backgroundColor: settings.type.includes(type.value) ? '#4CAF50' : 'transparent'
                      }}
                      textStyle={{ 
                        color: settings.type.includes(type.value) ? 'white' : '#0d141c',
                        fontFamily: 'PlusJakartaSans-SemiBold'
                      }}
                    >
                      {type.label}
                    </Chip>
                  ))}
                </View>

                {/* Custom Message */}
                <Text style={{ 
                  fontSize: 16,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#0d141c',
                  marginBottom: 12
                }}>
                  Custom Alert Message (Optional)
                </Text>
                
                <TextInput
                  mode="outlined"
                  placeholder="Enter custom alert message..."
                  value={settings.customMessage || ''}
                  onChangeText={(text) => setSettings({ ...settings, customMessage: text })}
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: 20 }}
                  theme={{
                    colors: {
                      primary: '#3d98f4',
                      outline: '#e0e0e0'
                    }
                  }}
                />
              </>
            )}

            {/* Action Buttons */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              marginTop: 20
            }}>
              <Button
                mode="outlined"
                onPress={onClose}
                style={{ flex: 1, marginRight: 8 }}
                labelStyle={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                Cancel
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSave}
                style={{ 
                  flex: 1, 
                  marginLeft: 8,
                  backgroundColor: '#3d98f4'
                }}
                labelStyle={{ 
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: 'white'
                }}
              >
                Save
              </Button>
            </View>
          </Card.Content>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
```

---

## 📋 **Task 5.4: Maps Integration & Directions (60 minutes)**

### Step 1: Maps Service
Create a service for Google Maps integration and directions.

**File: `src/services/mapsService.ts`**
```typescript
/**
 * Eye Do Plan - Maps Service
 * Google Maps integration for venue directions and location services
 */

import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { handleError } from '../utils/errorHandler';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  coordinates: LocationCoordinates;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  photos?: string[];
}

export interface DirectionsOptions {
  mode: 'driving' | 'walking' | 'transit';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

export class MapsService {
  private static instance: MapsService;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  static getInstance(): MapsService {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService();
    }
    return MapsService.instance;
  }

  /**
   * Get current user location
   */
  async getCurrentLocation(): Promise<LocationCoordinates> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      throw handleError(error, 'Failed to get current location');
    }
  }

  /**
   * Search for places using Google Places API
   */
  async searchPlaces(query: string, location?: LocationCoordinates): Promise<PlaceDetails[]> {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;
      
      if (location) {
        url += `&location=${location.latitude},${location.longitude}&radius=50000`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status}`);
      }

      return data.results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        formattedAddress: place.formatted_address,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating,
        photos: place.photos?.map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        ),
      }));
    } catch (error) {
      throw handleError(error, 'Failed to search places');
    }
  }

  /**
   * Get detailed information about a place
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,formatted_phone_number,website,rating,photos&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Place Details API error: ${data.status}`);
      }

      const place = data.result;
      return {
        placeId,
        name: place.name,
        formattedAddress: place.formatted_address,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        phoneNumber: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        photos: place.photos?.map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        ),
      };
    } catch (error) {
      throw handleError(error, 'Failed to get place details');
    }
  }

  /**
   * Calculate distance and duration between two locations
   */
  async getDirections(
    origin: LocationCoordinates | string,
    destination: LocationCoordinates | string,
    options: DirectionsOptions = { mode: 'driving' }
  ): Promise<{
    distance: string;
    duration: string;
    steps: any[];
  }> {
    try {
      const originStr = typeof origin === 'string' 
        ? encodeURIComponent(origin)
        : `${origin.latitude},${origin.longitude}`;
      
      const destinationStr = typeof destination === 'string'
        ? encodeURIComponent(destination)
        : `${destination.latitude},${destination.longitude}`;

      let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${options.mode}&key=${this.apiKey}`;
      
      if (options.avoidTolls) url += '&avoid=tolls';
      if (options.avoidHighways) url += '&avoid=highways';

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Directions API error: ${data.status}`);
      }

      const route = data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        steps: leg.steps,
      };
    } catch (error) {
      throw handleError(error, 'Failed to get directions');
    }
  }

  /**
   * Open directions in native maps app
   */
  async openDirections(
    destination: LocationCoordinates | string,
    origin?: LocationCoordinates | string,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): Promise<void> {
    try {
      const destinationStr = typeof destination === 'string'
        ? encodeURIComponent(destination)
        : `${destination.latitude},${destination.longitude}`;

      let url: string;

      if (Platform.OS === 'ios') {
        // Use Apple Maps on iOS
        url = `http://maps.apple.com/?daddr=${destinationStr}`;
        if (origin) {
          const originStr = typeof origin === 'string'
            ? encodeURIComponent(origin)
            : `${origin.latitude},${origin.longitude}`;
          url += `&saddr=${originStr}`;
        }
        if (mode === 'walking') url += '&dirflg=w';
        if (mode === 'transit') url += '&dirflg=r';
      } else {
        // Use Google Maps on Android
        url = `google.navigation:q=${destinationStr}`;
        if (mode === 'walking') url += '&mode=w';
        if (mode === 'transit') url += '&mode=r';
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to web Google Maps
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationStr}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      throw handleError(error, 'Failed to open directions');
    }
  }

  /**
   * Get travel time between locations
   */
  async getTravelTime(
    origin: LocationCoordinates,
    destination: LocationCoordinates,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): Promise<{
    duration: string;
    durationValue: number; // in seconds
    distance: string;
  }> {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=${mode}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Distance Matrix API error: ${data.status}`);
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error(`No route found: ${element.status}`);
      }

      return {
        duration: element.duration.text,
        durationValue: element.duration.value,
        distance: element.distance.text,
      };
    } catch (error) {
      throw handleError(error, 'Failed to get travel time');
    }
  }

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(address: string): Promise<LocationCoordinates> {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      throw handleError(error, 'Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(coordinates: LocationCoordinates): Promise<string> {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error(`Reverse geocoding failed: ${data.status}`);
      }

      return data.results[0].formatted_address;
    } catch (error) {
      throw handleError(error, 'Failed to reverse geocode coordinates');
    }
  }
}

export const mapsService = MapsService.getInstance();
```

### Step 2: Location Card Component
Create a component to display venue information with directions.

**File: `src/components/timeline/LocationCard.tsx`**
```typescript
/**
 * Eye Do Plan - Location Card Component
 * Displays venue information with directions and travel time
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, IconButton, Chip } from 'react-native-paper';
import { mapsService, LocationCoordinates } from '../../services/mapsService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LocationCardProps {
  title: string;
  address: string;
  coordinates?: LocationCoordinates;
  contactPerson?: string;
  contactPhone?: string;
  notes?: string;
  showDirections?: boolean;
  showTravelTime?: boolean;
}

export function LocationCard({
  title,
  address,
  coordinates,
  contactPerson,
  contactPhone,
  notes,
  showDirections = true,
  showTravelTime = true
}: LocationCardProps) {
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showTravelTime && coordinates) {
      calculateTravelTime();
    }
  }, [coordinates, showTravelTime]);

  const calculateTravelTime = async () => {
    try {
      setLoading(true);
      const currentLocation = await mapsService.getCurrentLocation();
      const travel = await mapsService.getTravelTime(currentLocation, coordinates!);
      setTravelTime(travel.duration);
    } catch (error) {
      console.error('Failed to calculate travel time:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDirections = async () => {
    try {
      if (coordinates) {
        await mapsService.openDirections(coordinates);
      } else {
        await mapsService.openDirections(address);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open directions. Please check your maps app.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCall = () => {
    if (contactPhone) {
      const phoneUrl = `tel:${contactPhone}`;
      mapsService.openDirections(phoneUrl);
    }
  };

  return (
    <Card style={{ 
      margin: 8,
      elevation: 2,
      backgroundColor: 'white'
    }}>
      <Card.Content style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Icon 
            name="map-marker" 
            size={24} 
            color="#3d98f4" 
            style={{ marginRight: 8 }}
          />
          <Text style={{ 
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'PlusJakartaSans-Bold',
            color: '#0d141c',
            flex: 1
          }}>
            {title}
          </Text>
          
          {travelTime && (
            <Chip 
              mode="flat"
              style={{ backgroundColor: '#e3f2fd' }}
              textStyle={{ 
                color: '#1976d2',
                fontSize: 12,
                fontFamily: 'PlusJakartaSans-SemiBold'
              }}
            >
              {travelTime}
            </Chip>
          )}
        </View>

        {/* Address */}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 12
        }}>
          <Icon 
            name="map" 
            size={16} 
            color="#49739c" 
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Text style={{ 
            fontSize: 14,
            fontFamily: 'PlusJakartaSans-Regular',
            color: '#49739c',
            flex: 1,
            lineHeight: 20
          }}>
            {address}
          </Text>
        </View>

        {/* Contact Information */}
        {(contactPerson || contactPhone) && (
          <View style={{ marginBottom: 12 }}>
            {contactPerson && (
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4
              }}>
                <Icon 
                  name="account" 
                  size={16} 
                  color="#49739c" 
                  style={{ marginRight: 8 }}
                />
                <Text style={{ 
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-Regular',
                  color: '#49739c'
                }}>
                  {contactPerson}
                </Text>
              </View>
            )}
            
            {contactPhone && (
              <TouchableOpacity 
                onPress={handleCall}
                style={{ 
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Icon 
                  name="phone" 
                  size={16} 
                  color="#4CAF50" 
                  style={{ marginRight: 8 }}
                />
                <Text style={{ 
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-Regular',
                  color: '#4CAF50',
                  textDecorationLine: 'underline'
                }}>
                  {contactPhone}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Notes */}
        {notes && (
          <View style={{ 
            backgroundColor: '#f8f9fa',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Text style={{ 
              fontSize: 12,
              fontFamily: 'PlusJakartaSans-Regular',
              color: '#666',
              fontStyle: 'italic'
            }}>
              {notes}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {showDirections && (
          <View style={{ 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button
              mode="contained"
              icon="directions"
              onPress={handleDirections}
              style={{ 
                backgroundColor: '#3d98f4',
                flex: 1,
                marginRight: contactPhone ? 8 : 0
              }}
              labelStyle={{ 
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: 'white'
              }}
            >
              Directions
            </Button>
            
            {contactPhone && (
              <IconButton
                icon="phone"
                size={24}
                iconColor="#4CAF50"
                style={{ 
                  backgroundColor: '#e8f5e8',
                  margin: 0
                }}
                onPress={handleCall}
              />
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
```

---

## 🧪 **Testing Protocol for Day 5**

### Android Emulator Testing
```bash
# Start development server
npx expo start

# Test timeline functionality
# 1. Create new timeline events
# 2. Edit existing events
# 3. Set up alerts and notifications
# 4. Test real-time updates
# 5. Test maps integration and directions

# Test notifications
# 1. Schedule event notifications
# 2. Test notification permissions
# 3. Verify alert timing
# 4. Test notification responses

# Test maps integration
# 1. Search for venues
# 2. Get directions to venues
# 3. Calculate travel times
# 4. Test location permissions
```

### Key Testing Areas
1. **Timeline Management**: Create, edit, delete events
2. **Real-time Updates**: Current time tracking and event status
3. **Notifications**: Alert scheduling and delivery
4. **Maps Integration**: Directions and location services
5. **Performance**: Smooth scrolling and responsive UI

---

## 📊 **Day 5 Success Metrics**

### Functionality Goals
- ✅ Interactive timeline with CRUD operations
- ✅ Real-time current time tracking
- ✅ Alert and notification system working
- ✅ Google Maps integration functional
- ✅ Auto-population from questionnaire data

### Technical Goals
- ✅ TypeScript interfaces for all timeline features
- ✅ Comprehensive error handling
- ✅ Offline support for timeline data
- ✅ Performance optimization for large timelines
- ✅ Accessibility compliance

### User Experience Goals
- ✅ Intuitive timeline interface
- ✅ Clear visual indicators for event status
- ✅ Smooth navigation and interactions
- ✅ Professional Eye Do Plan branding
- ✅ Responsive design for all screen sizes

---

## 🔄 **Integration with Previous Days**

Day 5 builds upon:
- **Day 1-2**: Authentication and user management
- **Day 3**: UI components and project management
- **Day 4**: Questionnaire data for timeline auto-population

Day 5 prepares for:
- **Day 6**: Shot list integration and additional features
- **Future**: Advanced timeline features and analytics

---

## 📝 **Notes for Day 6**

Features to implement in Day 6:
- Shot list integration with timeline
- Weather widget enhancements
- Private notes system
- Packing checklist
- Warning/alerts system
- Jakarta Sans font implementation throughout
- Additional UI polish and missing features from wireframes

