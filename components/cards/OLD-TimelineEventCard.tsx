// // src/components/cards/TimelineEventCard.tsx
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { useTheme } from 'react-native-paper';
// import { spacing } from '../../constants/theme';
// import { timelineUtils } from '../../services/timelineService';
// import { EventType, TimelineEvent } from '../../types/timeline';
// import { BodyText, LabelText, TitleText } from '../ui/Typography';

// interface TimelineEventCardProps {
//   event: TimelineEvent;
//   isCurrent?: boolean;
// }

// export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ event, isCurrent = false }) => {
//   const theme = useTheme();
//   const styles = createCardStyles(theme);

//   const displayTime = timelineUtils.formatTime12Hour(event.time);
//   const eventTypeFormatted = timelineUtils.formatEventType(event.eventType as EventType);
//   const displayDescription = event.description || timelineUtils.getEventTypeDetails(event.eventType as EventType).description;

//   return (
//     <View style={styles.card}>
//       {/* Use formatted Event Type as the main title */}
//       <TitleText size="medium" style={isCurrent ? { color: theme.colors.primary } : styles.titleText}>
//         {eventTypeFormatted}
//       </TitleText>

//       {/* Use the description as the body, respecting line limits */}
//       <BodyText size="medium" style={styles.descriptionText} numberOfLines={2}>
//         {displayDescription}
//       </BodyText>
      
//       <LabelText size="large" style={styles.timeText}>
//         {displayTime}
//       </LabelText>
      
//       {event.location && (
//         <BodyText size="small" style={styles.locationText} numberOfLines={1}>
//           {event.location}
//         </BodyText>
//       )}
//     </View>
//   );
// };

// const createCardStyles = (theme: any) => StyleSheet.create({
//     card: {
//       flex: 1,
//       paddingVertical: spacing.xs,
//     },
//     titleText: {
//       color: theme.colors.onSurface,
//       textTransform: 'uppercase',
//       letterSpacing: 0.5,
//     },
//     descriptionText: {
//       color: theme.colors.onSurfaceVariant,
//       marginTop: spacing.xs,
//     },
//     timeText: {
//       color: theme.colors.primary,
//       fontWeight: 'bold',
//       marginTop: spacing.md,
//     },
//     locationText: {
//       color: theme.colors.onSurfaceVariant,
//       marginTop: spacing.sm,
//     },
// });