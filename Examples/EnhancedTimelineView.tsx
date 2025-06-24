import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { z } from 'zod';
import { timelineUtils } from '../services/TimelineService';
import { TimelineEventSchema } from '../types/reusableSchemas';

type TimelineEvent = z.infer<typeof TimelineEventSchema>;

interface EnhancedTimelineViewProps {
  events: TimelineEvent[];
  currentTime?: Date;
  onEditEvent?: (event: TimelineEvent, index: number) => void;
  onDeleteEvent?: (index: number) => void;
  editable?: boolean;
  autoScrollToCurrent?: boolean;
}

type EventStatus = 'completed' | 'current' | 'upcoming';

interface EventWithStatus extends TimelineEvent {
  status: EventStatus;
  progress?: number; // For current events, 0-1
}

// Utility function to format time from HH:MM to 12-hour format
const formatTime = (time: string): string => {
  return timelineUtils.formatTime12Hour(time);
};

// Calculate end time based on start time and duration
const calculateEndTime = (startTime: string, duration: number = 30): string => {
  return timelineUtils.calculateEndTime(startTime, duration);
};

// Determine event status based on current time
const getEventStatus = (event: TimelineEvent, currentTime: Date): EventStatus => {
  const now = currentTime;
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [hours, minutes] = event.time.split(':').map(Number);
  const eventStartMinutes = hours * 60 + minutes;
  const eventEndMinutes = eventStartMinutes + (event.duration || 30);
  
  if (currentTimeMinutes < eventStartMinutes) {
    return 'upcoming';
  } else if (currentTimeMinutes >= eventStartMinutes && currentTimeMinutes < eventEndMinutes) {
    return 'current';
  } else {
    return 'completed';
  }
};

// Calculate progress for current events (0-1)
const calculateEventProgress = (event: TimelineEvent, currentTime: Date): number => {
  const now = currentTime;
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [hours, minutes] = event.time.split(':').map(Number);
  const eventStartMinutes = hours * 60 + minutes;
  const eventDuration = event.duration || 30;
  
  const elapsed = currentTimeMinutes - eventStartMinutes;
  return Math.max(0, Math.min(1, elapsed / eventDuration));
};

// Individual timeline item component with enhanced visual cues
const EnhancedTimelineItem: React.FC<{
  event: EventWithStatus;
  index: number;
  isLast: boolean;
  onEdit?: (event: TimelineEvent, index: number) => void;
  onDelete?: (index: number) => void;
  editable?: boolean;
  isCurrent?: boolean;
}> = ({ event, index, isLast, onEdit, onDelete, editable = false, isCurrent = false }) => {
  const startTime = formatTime(event.time);
  const endTime = calculateEndTime(event.time, event.duration);
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

  const getItemStyles = () => {
    const baseStyles = [styles.timelineItem];
    
    if (isCurrent) {
      baseStyles.push(styles.currentTimelineItem);
    }
    
    return baseStyles;
  };

  const getContentStyles = () => {
    const baseStyles = [styles.timelineContent];
    
    switch (event.status) {
      case 'completed':
        baseStyles.push(styles.completedContent);
        break;
      case 'current':
        baseStyles.push(styles.currentContent);
        break;
      case 'upcoming':
        baseStyles.push(styles.upcomingContent);
        break;
    }
    
    return baseStyles;
  };

  const getIconContainerStyles = () => {
    const baseStyles = [
      styles.iconContainer,
      { backgroundColor: event.iconColor || '#6200ee' }
    ];
    
    switch (event.status) {
      case 'completed':
        baseStyles.push(styles.completedIcon);
        break;
      case 'current':
        baseStyles.push(styles.currentIcon);
        break;
      case 'upcoming':
        baseStyles.push(styles.upcomingIcon);
        break;
    }
    
    return baseStyles;
  };

  const getTextStyles = (baseStyle: any) => {
    const styles = [baseStyle];
    
    switch (event.status) {
      case 'completed':
        styles.push({ opacity: 0.6 });
        break;
      case 'current':
        styles.push({ fontWeight: 'bold' });
        break;
    }
    
    return styles;
  };

  return (
    <View style={getItemStyles()}>
      <View style={getContentStyles()}>
        {/* Icon with colored background and status-based styling */}
        <View style={getIconContainerStyles()}>
          <IconButton
            icon={event.status === 'completed' ? 'check' : event.icon || 'calendar'}
            iconColor="white"
            size={isCurrent ? 24 : 20}
            style={styles.eventIcon}
          />
          {event.status === 'current' && (
            <View style={styles.currentIndicator} />
          )}
        </View>

        {/* Event details with status-based styling */}
        <View style={styles.eventDetails}>
          <Text 
            variant={isCurrent ? "titleLarge" : "titleMedium"} 
            style={getTextStyles(styles.eventTitle)}
            numberOfLines={2}
          >
            {event.description}
          </Text>
          <Text 
            variant={isCurrent ? "bodyLarge" : "bodyMedium"} 
            style={getTextStyles(styles.eventTime)}
          >
            {timeRange}
          </Text>
          {event.location && (
            <Text 
              variant="bodySmall" 
              style={getTextStyles(styles.eventLocation)}
            >
              📍 {event.location}
            </Text>
          )}
          {event.notes && (
            <Text 
              variant="bodySmall" 
              style={getTextStyles(styles.eventNotes)}
            >
              {event.notes}
            </Text>
          )}
          
          {/* Progress bar for current events */}
          {event.status === 'current' && event.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${event.progress * 100}%` }
                  ]} 
                />
              </View>
              <Text variant="bodySmall" style={styles.progressText}>
                {Math.round(event.progress * 100)}% complete
              </Text>
            </View>
          )}
          
          {/* Status indicator */}
          <View style={styles.statusContainer}>
            <Text variant="labelSmall" style={[
              styles.statusLabel,
              event.status === 'completed' && styles.completedStatus,
              event.status === 'current' && styles.currentStatus,
              event.status === 'upcoming' && styles.upcomingStatus,
            ]}>
              {event.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Edit/Delete buttons (only in editable mode) */}
        {editable && (
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit?.(event, index)}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete?.(index)}
              style={styles.actionButton}
              iconColor="#f44336"
            />
          </View>
        )}
      </View>

      {/* Connecting line to next event with status-based styling */}
      {!isLast && (
        <View style={[
          styles.connectingLine,
          event.status === 'completed' && styles.completedLine,
          event.status === 'current' && styles.currentLine,
          event.status === 'upcoming' && styles.upcomingLine,
        ]} />
      )}
    </View>
  );
};

// Main enhanced timeline view component
export const EnhancedTimelineView: React.FC<EnhancedTimelineViewProps> = ({
  events = [],
  currentTime = new Date(),
  onEditEvent,
  onDeleteEvent,
  editable = false,
  autoScrollToCurrent = true
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [eventsWithStatus, setEventsWithStatus] = useState<EventWithStatus[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1);
  const itemRefs = useRef<{ [key: number]: View | null }>({});

  // Update events with status and progress
  useEffect(() => {
    const sortedEvents = timelineUtils.sortEventsByTime(events);
    let currentIndex = -1;
    
    const eventsWithStatus: EventWithStatus[] = sortedEvents.map((event, index) => {
      const status = getEventStatus(event, currentTime);
      const progress = status === 'current' ? calculateEventProgress(event, currentTime) : undefined;
      
      if (status === 'current') {
        currentIndex = index;
      }
      
      return {
        ...event,
        status,
        progress
      };
    });
    
    setEventsWithStatus(eventsWithStatus);
    setCurrentEventIndex(currentIndex);
  }, [events, currentTime]);

  // Auto-scroll to current event
  useEffect(() => {
    if (autoScrollToCurrent && currentEventIndex >= 0 && scrollViewRef.current) {
      const currentItemRef = itemRefs.current[currentEventIndex];
      if (currentItemRef) {
        currentItemRef.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y, width, height) => {
            const screenHeight = Dimensions.get('window').height;
            const scrollToY = Math.max(0, y - (screenHeight / 2) + (height / 2));
            
            scrollViewRef.current?.scrollTo({
              y: scrollToY,
              animated: true
            });
          },
          () => {
            // Fallback if measureLayout fails
            console.log('Failed to measure current event position');
          }
        );
      }
    }
  }, [currentEventIndex, autoScrollToCurrent]);

  if (eventsWithStatus.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          No timeline events yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Add your first event to get started
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.timeline}>
        {eventsWithStatus.map((event, index) => (
          <View
            key={event.id || index}
            ref={(ref) => { itemRefs.current[index] = ref; }}
          >
            <EnhancedTimelineItem
              event={event}
              index={index}
              isLast={index === eventsWithStatus.length - 1}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              editable={editable}
              isCurrent={index === currentEventIndex}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  timeline: {
    padding: 16,
    paddingLeft: 32,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 24,
  },
  currentTimelineItem: {
    marginVertical: 32, // Extra spacing for current event
  },
  timelineContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  completedContent: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  currentContent: {
    elevation: 4,
    shadowOpacity: 0.3,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    backgroundColor: '#fff',
  },
  upcomingContent: {
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -24,
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    position: 'relative',
  },
  completedIcon: {
    opacity: 0.7,
  },
  currentIcon: {
    transform: [{ scale: 1.1 }],
    elevation: 4,
  },
  upcomingIcon: {
    // Default styling
  },
  currentIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: 'white',
  },
  eventIcon: {
    margin: 0,
  },
  eventDetails: {
    flex: 1,
    paddingTop: 4,
  },
  eventTitle: {
    marginBottom: 4,
    color: '#1a1a1a',
  },
  eventTime: {
    color: '#6200ee',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventLocation: {
    color: '#666',
    marginBottom: 2,
  },
  eventNotes: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 2,
  },
  progressText: {
    color: '#666',
    fontSize: 12,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  completedStatus: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  currentStatus: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  upcomingStatus: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  connectingLine: {
    position: 'absolute',
    left: -1,
    top: 48,
    bottom: -24,
    width: 2,
  },
  completedLine: {
    backgroundColor: '#c8e6c9',
  },
  currentLine: {
    backgroundColor: '#4caf50',
  },
  upcomingLine: {
    backgroundColor: '#e0e0e0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
  },
});

export default EnhancedTimelineView;

