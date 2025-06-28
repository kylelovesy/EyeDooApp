import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { getEventTypeDetails } from '../../constants/eventTypes';
import { TTimelineEventForm } from '../../types/timeline';

interface NextEventCardProps {
  events: TTimelineEventForm[];
  currentTime?: Date;
  onEventPress?: (event: TTimelineEventForm) => void;
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
  const [nextEvent, setNextEvent] = useState<TTimelineEventForm | null>(null);
  const [currentEvent, setCurrentEvent] = useState<TTimelineEventForm | null>(null);

  // Calculate time remaining until next event
  const calculateTimeRemaining = (eventTime: Date, currentTime: Date): TimeRemaining => {
    const now = currentTime;
    
    // Set event to today's date with the event's time
    const todayEvent = new Date(now);
    todayEvent.setHours(eventTime.getHours(), eventTime.getMinutes(), 0, 0);
    
    const diffMs = todayEvent.getTime() - now.getTime();
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
  const findCurrentAndNextEvents = (
    events: TTimelineEventForm[],
    currentTime: Date
  ) => {
    if (events.length === 0) return { current: null, next: null };

    const sortedEvents = [...events].sort(
      (a, b) => a.time.getTime() - b.time.getTime()
    );
    const now = currentTime.getTime();

    let currentEvent: TTimelineEventForm | null = null;
    let nextEvent: TTimelineEventForm | null = null;

    const nextEventIndex = sortedEvents.findIndex(
      (event) => event.time.getTime() > now
    );

    if (nextEventIndex === -1) {
      // All events are in the past. The last event might be considered 'current'.
      currentEvent = sortedEvents[sortedEvents.length - 1] || null;
    } else if (nextEventIndex === 0) {
      // All events are in the future.
      nextEvent = sortedEvents[0];
    } else {
      // We are between two events.
      currentEvent = sortedEvents[nextEventIndex - 1];
      nextEvent = sortedEvents[nextEventIndex];
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

  // Helper function to format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Helper function to get event display info
  const getEventDisplayInfo = (event: TTimelineEventForm) => {
    const eventDetails = getEventTypeDetails(event.eventType);
    const displayName = event.description || eventDetails?.displayName;
    const Icon = eventDetails?.Icon;

    return {
      Icon,
      displayName,
    };
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
    const timeDisplay = formatTime(currentEvent.time);
    const { displayName } = getEventDisplayInfo(currentEvent);

    return (
      <Card
        style={[styles.card, styles.currentEventCard, style]}
        onPress={() => onEventPress?.(currentEvent)}
      >
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: '#4caf50' }]}
            >
              <IconButton
                icon="play-circle"
                iconColor="white"
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.eventInfo}>
              <Text variant="labelSmall" style={styles.statusLabel}>
                HAPPENING NOW
              </Text>
              <Text
                variant="titleMedium"
                style={styles.eventTitle}
                numberOfLines={2}
              >
                {displayName}
              </Text>
              <Text variant="bodySmall" style={styles.eventTime}>
                Started at {timeDisplay}
              </Text>
              {currentEvent.location && (
                <Text variant="bodySmall" style={styles.eventLocation}>
                  📍 {currentEvent.location}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Show next event
  if (nextEvent && timeRemaining) {
    const timeDisplay = formatTime(nextEvent.time);
    const { displayName } = getEventDisplayInfo(nextEvent);

    return (
      <Card
        style={[styles.card, style]}
        onPress={() => onEventPress?.(nextEvent)}
      >
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: '#6200ee' }]}
            >
              <IconButton
                icon="clock-outline"
                iconColor="white"
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.eventInfo}>
              <Text variant="labelSmall" style={styles.statusLabel}>
                NEXT EVENT
              </Text>
              <Text
                variant="titleMedium"
                style={styles.eventTitle}
                numberOfLines={2}
              >
                {displayName}
              </Text>
              <Text variant="bodySmall" style={styles.eventTime}>
                Starts at {timeDisplay}
              </Text>
              {nextEvent.location && (
                <Text variant="bodySmall" style={styles.eventLocation}>
                  📍 {nextEvent.location}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.countdownContainer}>
            <Text
              variant="headlineSmall"
              style={[
                styles.countdown,
                timeRemaining.isOverdue && styles.overdueCountdown,
              ]}
            >
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
});

export default NextEventCard;

