// # 4.2 Timeline Tab
// # 4.2.0 General tab (default)
// app/(app)/dashboard/(timeline)/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define your subpages for dashboard
const timelineSubPages = [
  { id: 'index', title: 'General', iconName: 'timeline-clock', route: '/timeline' },
  { id: 'notifications', title: 'Notifications', iconName: 'notifications-circle', route: '/timeline/notifications' },
  { id: 'edit', title: 'Edit/Update', iconName: 'pencil-circle', route: '/timeline/edit' },
];

export default function TimelineGeneralScreen() {
  const router = useRouter();
  
  // Create navigation object that matches the expected interface
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'index') {
      return false;
    }
    return subPage.id !== currentId;
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Timeline"
        subPages={timelineSubPages}
        currentSubPageId="index"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Timeline Overview</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Timeline content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import {
//     BodyText,
//     HeadlineText
// } from '../../../../components/ui/Typography';
// import { spacing, useAppTheme } from '../../../../constants/theme';

// interface TimelineEvent {
//   id: number;
//   time: string;
//   title: string;
//   status: 'completed' | 'current' | 'upcoming';
// }

// export default function TimelineGeneralScreen() {
//   const theme = useAppTheme();
//   const styles = createThemedStyles(theme);

//   const timelineEvents: TimelineEvent[] = [
//     { id: 1, time: '2:00 PM', title: 'Setup begins', status: 'completed' },
//     { id: 2, time: '2:30 PM', title: 'Vendor arrivals', status: 'completed' },
//     { id: 3, time: '3:00 PM', title: 'Guest arrival', status: 'current' },
//     { id: 4, time: '3:30 PM', title: 'Ceremony start', status: 'upcoming' },
//     { id: 5, time: '4:00 PM', title: 'Photo session', status: 'upcoming' },
//     { id: 6, time: '6:00 PM', title: 'Reception begins', status: 'upcoming' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <HeadlineText size="medium" style={styles.title}>
//           Event Timeline
//         </HeadlineText>
//         <BodyText size="large" style={styles.subtitle}>
//           July 15, 2025
//         </BodyText>
//       </View>

//       <View style={styles.timeline}>
//         {timelineEvents.map((event, index) => (
//           <View key={event.id} style={styles.timelineItem}>
//             <View style={styles.timelineContent}>
//               <View style={[styles.timelineDot, styles[`${event.status}Dot`]]} />
//               <View style={styles.timelineDetails}>
//                 <BodyText size="medium" style={styles.timelineTime}>
//                   {event.time}
//                 </BodyText>
//                 <BodyText
//                   size="large"
//                   style={[styles.timelineTitle, styles[`${event.status}Title`]]}
//                 >
//                   {event.title}
//                 </BodyText>
//               </View>
//             </View>
//             {index < timelineEvents.length - 1 && (
//               <View
//                 style={[
//                   styles.timelineLine,
//                   styles[`${timelineEvents[index + 1].status}Line`],
//                 ]}
//               />
//             )}
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const createThemedStyles = (theme: any) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//     },
//     header: {
//       padding: spacing.lg,
//       backgroundColor: theme.colors.surface,
//       borderBottomWidth: 1,
//       borderBottomColor: theme.colors.outline,
//     },
//     title: {
//       color: theme.colors.onSurface,
//       marginBottom: spacing.xs,
//     },
//     subtitle: {
//       color: theme.colors.onSurfaceVariant,
//     },
//     timeline: {
//       padding: spacing.lg,
//       paddingLeft: spacing.xl,
//     },
//     timelineItem: {
//       position: 'relative',
//       paddingBottom: spacing.lg,
//     },
//     timelineContent: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     timelineDot: {
//       width: 12,
//       height: 12,
//       borderRadius: 6,
//       position: 'absolute',
//       left: -22,
//     },
//     completedDot: {
//       backgroundColor: theme.colors.secondary,
//     },
//     currentDot: {
//       backgroundColor: theme.colors.primary,
//       transform: [{ scale: 1.2 }],
//     },
//     upcomingDot: {
//       backgroundColor: theme.colors.onSurfaceDisabled,
//     },
//     timelineDetails: {
//       flex: 1,
//     },
//     timelineTime: {
//       color: theme.colors.primary,
//       fontWeight: '600',
//       marginBottom: spacing.xs,
//     },
//     timelineTitle: {
//       color: theme.colors.onSurface,
//     },
//     completedTitle: {
//       color: theme.colors.onSurfaceVariant,
//       textDecorationLine: 'line-through',
//     },
//     currentTitle: {
//       fontWeight: 'bold',
//     },
//     upcomingTitle: {
//       // Default styles are fine
//     },
//     timelineLine: {
//       position: 'absolute',
//       left: -17,
//       top: 12,
//       bottom: -12,
//       width: 2,
//     },
//     completedLine: {
//       backgroundColor: theme.colors.secondary,
//     },
//     currentLine: {
//       backgroundColor: theme.colors.primary,
//     },
//     upcomingLine: {
//       backgroundColor: theme.colors.onSurfaceDisabled,
//     },
//   });