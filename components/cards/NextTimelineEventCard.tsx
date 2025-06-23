import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, ProgressBar, Text } from 'react-native-paper';
import { z } from 'zod';
import { timelineUtils } from '../../services/timelineService';
import { TimelineEventSchema } from '../../types/reusableSchemas';

type TimelineEvent = z.infer<typeof TimelineEventSchema>;

interface NextEventCardProps {
  events: TimelineEvent[];
  currentTime?: Date;
  onEventPress?: (event: TimelineEvent) => void;
  style?: any;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  isOverdue: boolean;
}

export const NextEventCard: React.FC<NextEventCardProps> = ({
  events = [],
  onEventPress,
  style
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [nextEvent, setNextEvent] = useState<TimelineEvent | null>(null);
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null);

  // Calculate time remaining until next event
  const calculateTimeRemaining = (eventTime: string, currentTime: Date): TimeRemaining => {
    const now = currentTime;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Parse event time (HH:MM format)
    const [hours, minutes] = eventTime.split(':').map(Number);
    const eventDateTime = new Date(today.getTime() + (hours * 60 + minutes) * 60 * 1000);
    
    const diffMs = eventDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    const isOverdue = diffMs < 0;
    const absDiffMinutes = Math.abs(diffMinutes);
    
    return {
      hours: Math.floor(absDiffMinutes / 60),
      minutes: absDiffMinutes % 60,
      seconds: Math.floor((Math.abs(diffMs) % (1000 * 60)) / 1000),
      totalMinutes: diffMinutes,
      isOverdue
    };
  };

  // Find current and next events
  const findCurrentAndNextEvents = (events: TimelineEvent[], currentTime: Date) => {
    if (events.length === 0) return { current: null, next: null };

    const sortedEvents = timelineUtils.sortEventsByTime(events);
    const now = currentTime;
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    let currentEvent: TimelineEvent | null = null;
    let nextEvent: TimelineEvent | null = null;

    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const [hours, minutes] = event.time.split(':').map(Number);
      const eventTimeMinutes = hours * 60 + minutes;
      const eventEndMinutes = eventTimeMinutes + (event.duration || 30);

      // Check if current time is within this event
      if (currentTimeMinutes >= eventTimeMinutes && currentTimeMinutes < eventEndMinutes) {
        currentEvent = event;
        // Next event is the one after current
        nextEvent = sortedEvents[i + 1] || null;
        break;
      }
      
      // If we haven't found a current event and this event is in the future
      if (currentTimeMinutes < eventTimeMinutes) {
        nextEvent = event;
        break;
      }
    }

    // If no current event found, but we have events, the next one is the first upcoming
    if (!currentEvent && !nextEvent && sortedEvents.length > 0) {
      const firstEvent = sortedEvents[0];
      const [hours, minutes] = firstEvent.time.split(':').map(Number);
      const firstEventTimeMinutes = hours * 60 + minutes;
      
      if (currentTimeMinutes < firstEventTimeMinutes) {
        nextEvent = firstEvent;
      }
    }

    return { current: currentEvent, next: nextEvent };
  };

  // Update time remaining every second
  useEffect(() => {
    const updateTimer = () => {
      const { current, next } = findCurrentAndNextEvents(events, new Date());
      setCurrentEvent(current);
      setNextEvent(next);

      if (next) {
        const remaining = calculateTimeRemaining(next.time, new Date());
        setTimeRemaining(remaining);
      } else {
        setTimeRemaining(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [events]);

  // Format time remaining display
  const formatTimeRemaining = (time: TimeRemaining): string => {
    if (time.isOverdue) {
      if (time.hours > 0) {
        return `${time.hours}h ${time.minutes}m overdue`;
      }
      return `${time.minutes}m overdue`;
    }

    if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m`;
    }
    if (time.minutes > 0) {
      return `${time.minutes}m`;
    }
    return `${time.seconds}s`;
  };

  // Calculate progress for current event
  const calculateCurrentEventProgress = (event: TimelineEvent, currentTime: Date): number => {
    const now = currentTime;
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventStartMinutes = hours * 60 + minutes;
    const eventDuration = event.duration || 30;
    
    const elapsed = currentTimeMinutes - eventStartMinutes;
    return Math.max(0, Math.min(1, elapsed / eventDuration));
  };

  if (events.length === 0) {
    return (
      <Card style={[styles.card, style]}>
        <Card.Content style={styles.emptyContent}>
          <IconButton icon="calendar-blank" size={32} iconColor="#999" />
          <Text variant="bodyMedium" style={styles.emptyText}>
            No timeline events
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Show current event if there is one
  if (currentEvent) {
    const progress = calculateCurrentEventProgress(currentEvent, new Date());
    const endTime = timelineUtils.calculateEndTime(currentEvent.time, currentEvent.duration);
    const timeRange = `${timelineUtils.formatTime12Hour(currentEvent.time)} - ${timelineUtils.formatTime12Hour(endTime)}`;

    return (
      <Card style={[styles.card, styles.currentEventCard, style]} onPress={() => onEventPress?.(currentEvent)}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: currentEvent.iconColor || '#6200ee' }]}>
              <IconButton
                icon={currentEvent.icon || 'calendar'}
                iconColor="white"
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.eventInfo}>
              <Text variant="labelSmall" style={styles.statusLabel}>
                HAPPENING NOW
              </Text>
              <Text variant="titleMedium" style={styles.eventTitle} numberOfLines={2}>
                {currentEvent.description}
              </Text>
              <Text variant="bodySmall" style={styles.eventTime}>
                {timeRange}
              </Text>
              {currentEvent.location && (
                <Text variant="bodySmall" style={styles.eventLocation}>
                  📍 {currentEvent.location}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={progress} 
              color="#4caf50" 
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressText}>
              {Math.round(progress * 100)}% complete
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Show next event
  if (nextEvent && timeRemaining) {
    const endTime = timelineUtils.calculateEndTime(nextEvent.time, nextEvent.duration);
    const timeRange = `${timelineUtils.formatTime12Hour(nextEvent.time)} - ${timelineUtils.formatTime12Hour(endTime)}`;

    return (
      <Card style={[styles.card, style]} onPress={() => onEventPress?.(nextEvent)}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: nextEvent.iconColor || '#6200ee' }]}>
              <IconButton
                icon={nextEvent.icon || 'calendar'}
                iconColor="white"
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.eventInfo}>
              <Text variant="labelSmall" style={styles.statusLabel}>
                NEXT EVENT
              </Text>
              <Text variant="titleMedium" style={styles.eventTitle} numberOfLines={2}>
                {nextEvent.description}
              </Text>
              <Text variant="bodySmall" style={styles.eventTime}>
                {timeRange}
              </Text>
              {nextEvent.location && (
                <Text variant="bodySmall" style={styles.eventLocation}>
                  📍 {nextEvent.location}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.countdownContainer}>
            <Text variant="headlineSmall" style={[
              styles.countdown,
              timeRemaining.isOverdue && styles.overdueCountdown
            ]}>
              {formatTimeRemaining(timeRemaining)}
            </Text>
            <Text variant="bodySmall" style={styles.countdownLabel}>
              {timeRemaining.isOverdue ? 'overdue' : 'remaining'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // No upcoming events
  return (
    <Card style={[styles.card, style]}>
      <Card.Content style={styles.emptyContent}>
        <IconButton icon="check-circle" size={32} iconColor="#4caf50" />
        <Text variant="bodyMedium" style={styles.emptyText}>
          All events completed!
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currentEventCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  content: {
    paddingVertical: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: '#999',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    margin: 0,
  },
  eventInfo: {
    flex: 1,
  },
  statusLabel: {
    color: '#6200ee',
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  eventTime: {
    color: '#666',
    marginBottom: 2,
  },
  eventLocation: {
    color: '#666',
  },
  countdownContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  countdown: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  overdueCountdown: {
    color: '#f44336',
  },
  countdownLabel: {
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default NextEventCard;

