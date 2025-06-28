// // src/components/views/EnhancedTimelineView.tsx
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getEventTypeDetails } from '../../constants/eventTypes';
import { borderRadius, spacing } from '../../constants/theme';
import { TTimelineEventForm } from '../../types/timeline';
import { BodyText, LabelText, TitleText } from '../ui/Typography';

type EventStatus = 'Complete' | 'Active' | 'Background' | 'Next' | 'Upcoming' | 'Draft' | 'Deleted' | 'DayNotStarted';

// Define the processed event type with a status
interface ProcessedTimelineEvent extends TTimelineEventForm {
  status: EventStatus;
}

// --- Child Component for a single timeline item ---
const TimelineItem: React.FC<{
  item: ProcessedTimelineEvent;
  isLast: boolean;
}> = ({ item, isLast }) => {
  const theme = useTheme();
  const styles = createItemStyles(theme);

  // Get icon and default description from the service
  const eventDetails = getEventTypeDetails(item.eventType);
  if (!eventDetails) return null;

  const { Icon: IconComponent, displayName: defaultDescription } = eventDetails;

  // Use custom description if provided, otherwise use the default
  const displayDescription = item.description || defaultDescription;
  
  // Handle timestamp conversion for display
  const displayTime = item.time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Get status-specific styles
  const getDotStyle = () => {
    switch (item.status) {
      case 'Complete':
        return { backgroundColor: theme.colors.onSurfaceVariant };
      case 'Active':
        return { backgroundColor: theme.colors.primary, transform: [{ scale: 1.1 }] };
      case 'Upcoming':
      default:
        return { backgroundColor: theme.colors.secondary };
    }
  };

  const getLineStyle = () => {
    switch (item.status) {
      case 'Complete':
      case 'Upcoming':
        return { backgroundColor: theme.colors.surfaceVariant };
      case 'Active':
        return { backgroundColor: theme.colors.primary };
      default:
        return { backgroundColor: theme.colors.surfaceVariant };
    }
  };

  const getCardStyle = () => {
    switch (item.status) {
      case 'Complete':
        return { borderColor: theme.colors.outline, opacity: 0.7 };
      case 'Active':
        return { borderColor: theme.colors.primary, borderWidth: 2 };
      case 'Upcoming':
      default:
        return { borderColor: theme.colors.outline };
    }
  };

  return (
    <View style={styles.itemContainer}>
      {/* The dot/icon on the timeline */}
      <View style={[styles.dotContainer, getDotStyle()]}>
        <IconComponent width={24} height={24} fill={theme.colors.onPrimary} />
      </View>

      {/* The connecting line */}
      {!isLast && <View style={[styles.line, getLineStyle()]} />}

      {/* The content card */}
      <View style={[styles.card, getCardStyle()]}>
        <TitleText size="medium" style={styles.descriptionText}>
          {displayDescription}
        </TitleText>
        <LabelText size="large" style={[styles.timeText, { color: theme.colors.primary }]}>
          {displayTime}
        </LabelText>
        {item.location && (
          <BodyText size="small" style={styles.locationText}>
            📍 {item.location}
          </BodyText>
        )}
      </View>
    </View>
  );
};

// --- Main Timeline View Component ---
interface EnhancedTimelineViewProps {
  events: TTimelineEventForm[];
}

const getEventStatus = (event: TTimelineEventForm, now: Date): EventStatus => {
    const eventTime = event.time.getTime();
    // @ts-ignore - duration is not in the type, using a 30-min default.
    const durationMs = (event.duration || 30) * 60 * 1000;
    const eventEndTime = eventTime + durationMs;
    const nowTime = now.getTime();

    if (nowTime > eventEndTime) {
        return 'Complete';
    }
    if (nowTime >= eventTime && nowTime <= eventEndTime) {
        return 'Active';
    }
    return 'Upcoming';
};

export const EnhancedTimelineView: React.FC<EnhancedTimelineViewProps> = ({ events }) => {
  // Memoize processed events to avoid recalculating on every render
  const processedEvents = useMemo(() => {
    const now = new Date();
    // 1. Sort events chronologically
    const sorted = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
    // 2. Add a status to each event
    return sorted.map((event) => ({
      ...event,
      status: getEventStatus(event, now),
    }));
  }, [events]);

  return (
    <View style={{ padding: spacing.md }}>
      {processedEvents.map((event, index) => (
        <TimelineItem
          key={event.eventId}
          item={event}
          isLast={index === processedEvents.length - 1}
        />
      ))}
    </View>
  );
};

// --- Stylesheet for the component ---
const createItemStyles = (theme: any) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      paddingLeft: 40, // Space for the dot and line
      paddingBottom: spacing.lg,
      position: 'relative',
    },
    dotContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 48,
      height: 48,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
      elevation: 4,
    },
    line: {
      position: 'absolute',
      left: 23, // Centered with the 48px dot
      top: 48, // Start below the dot
      bottom: -spacing.lg, // Extend to the next item's container
      width: 2,
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      marginLeft: 20, // Space from the dot
    },
    descriptionText: {
      color: theme.colors.onSurface,
    },
    timeText: {
      marginTop: spacing.xs,
    },
    locationText: {
      color: theme.colors.onSurfaceVariant,
      marginTop: spacing.md,
    },
  });