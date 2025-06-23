// # 4.2 Timeline Tab
// # 4.2.0 General tab (default)
// app/(app)/dashboard/(timeline)/index.tsx
import { BodyText, HeadlineText } from '@/components/ui/Typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { spacing } from '../../../../constants/theme';
import { useProjects } from '../../../../contexts/ProjectContext';

// Define your subpages for dashboard
const timelineSubPages = [
  { id: 'index', title: 'Timeline', iconName: 'timeline-clock-outline', route: '/(app)/dashboard/(timeline)' },
  { id: 'notifications', title: 'Notifications', iconName: 'bell-outline', route: '/(app)/dashboard/(timeline)/notifications' },
  { id: 'edit', title: 'Update', iconName: 'clock-edit-outline', route: '/(app)/dashboard/(timeline)/edit' },
];
interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  priority: string;
  notification: string;
  notes: string;
  location: string;
  icon: string;
  iconColor: string;
  status: 'completed' | 'current' | 'upcoming';
}

export default function TimelineGeneralScreen() {
  const router = useRouter();
  const theme = useTheme();

    // Get the projectId passed from the projects screen
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  // Get the state and the setter function from the context
  const { currentProject, setCurrentProjectById } = useProjects();
  
  // This effect runs when the screen loads or when the projectId parameter changes.
  // It ensures the correct project is set in the context.
  useEffect(() => {
    if (projectId) {
      setCurrentProjectById(projectId);
    }
  }, [projectId, setCurrentProjectById]);

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

  const styles = createThemedStyles(theme);

  const timelineEvents: TimelineEvent[] = [
    { id: 1, time: '10:00 AM', title: 'Bridal prep', description: 'Bride and party getting ready', priority: 'high', notification: 'none', notes: 'Hair, makeup, dress', location: 'Bridal Suite', icon: 'bride', iconColor: 'pink', status: 'completed' },
    { id: 2, time: '12:00 PM', title: 'Groom prep', description: 'Groom and party getting ready', priority: 'medium', notification: 'none', notes: 'Suits, speeches, photos', location: 'Groom Suite', icon: 'groom', iconColor: 'blue', status: 'completed' },
    { id: 3, time: '01:00 PM', title: 'Guests arrive', description: 'Guests begin arriving at the venue', priority: 'low', notification: 'none', notes: 'Welcome drinks, seating assistance', location: 'Venue', icon: 'guest', iconColor: 'teal', status: 'current' },
    { id: 4, time: '01:30 PM', title: 'Ceremony begins', description: 'Wedding ceremony starts', priority: 'high', notification: 'none', notes: 'Vows, readings, music', location: 'Ceremony Room', icon: 'ceremony', iconColor: 'blue', status: 'upcoming' },
    { id: 5, time: '02:00 PM', title: 'Confetti and mingling', description: 'Guests congratulate couple', priority: 'medium', notification: 'none', notes: 'Confetti tunnel, hugs, drinks', location: 'Outside venue', icon: 'confetti', iconColor: 'yellow', status: 'upcoming' },
    { id: 6, time: '02:15 PM', title: 'Reception drinks', description: 'Drinks and canapés served', priority: 'low', notification: 'none', notes: 'Informal mingling', location: 'Reception Area', icon: 'drinks', iconColor: 'teal', status: 'upcoming' },
    { id: 7, time: '02:30 PM', title: 'Group photos', description: 'Family and group shots', priority: 'medium', notification: 'none', notes: 'Photographer-led', location: 'Garden/Lawn', icon: 'group-photo', iconColor: 'purple', status: 'upcoming' },
    { id: 8, time: '03:00 PM', title: 'Couple portraits', description: 'Private photo session for couple', priority: 'low', notification: 'none', notes: 'Golden hour shots', location: 'Nearby spot', icon: 'portrait', iconColor: 'pink', status: 'upcoming' },
    { id: 9, time: '04:00 PM', title: 'Wedding breakfast', description: 'Formal meal with courses', priority: 'high', notification: 'none', notes: 'Toasts may begin', location: 'Dining Room', icon: 'dinner', iconColor: 'orange', status: 'upcoming' },
    { id: 10, time: '05:30 PM', title: 'Speeches', description: 'Speeches from father of the bride, groom, best man', priority: 'high', notification: 'none', notes: 'Microphones and order confirmed', location: 'Dining Room', icon: 'speech', iconColor: 'blue', status: 'upcoming' },
    { id: 11, time: '06:30 PM', title: 'Evening guests arrive', description: 'Additional guests for party', priority: 'low', notification: 'none', notes: 'Welcome drinks available', location: 'Entrance', icon: 'evening', iconColor: 'blue', status: 'upcoming' },
    { id: 12, time: '07:00 PM', title: 'Cake cutting', description: 'Couple cut the wedding cake', priority: 'medium', notification: 'none', notes: 'Cake table prepared near dance floor', location: 'Main Room', icon: 'cake', iconColor: 'pink', status: 'upcoming' },
    { id: 13, time: '07:15 PM', title: 'First dance', description: 'Couple’s first dance', priority: 'high', notification: 'none', notes: 'Followed by open dancing', location: 'Dance Floor', icon: 'dance', iconColor: 'purple', status: 'upcoming' },
    { id: 14, time: '07:30 PM', title: 'Evening entertainment', description: 'DJ or band starts', priority: 'medium', notification: 'none', notes: 'Dance floor open', location: 'Main Room', icon: 'music', iconColor: 'red', status: 'upcoming' },
    { id: 15, time: '08:30 PM', title: 'Evening buffet', description: 'Light food served', priority: 'low', notification: 'none', notes: 'Finger food, cake served', location: 'Buffet Area', icon: 'buffet', iconColor: 'green', status: 'upcoming' },
    { id: 16, time: '10:30 PM', title: 'Last dance', description: 'Final song of the night', priority: 'low', notification: 'none', notes: 'Wind down the party', location: 'Dance Floor', icon: 'last-dance', iconColor: 'blue', status: 'upcoming' },
    { id: 17, time: '11:00 PM', title: 'Carriages', description: 'Guests depart', priority: 'low', notification: 'none', notes: 'Taxis arranged', location: 'Venue entrance', icon: 'carriage', iconColor: 'grey', status: 'upcoming' }
  ];

  return (
    <Screen 
      scrollable={false}
      padding="none"
      safeArea={true}
      paddingTop={0}  
      edges={['top']}
      backgroundColor={theme.colors.background}
      statusBarStyle="auto"
      testID="dashboard-timeline-screen-index-full"
    >   
      {/* AppBar positioned directly under status bar */}
      <DashboardAppBar
        navigation={navigation}
        title="Timeline"
        subPages={timelineSubPages}
        currentSubPageId="index"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <HeadlineText size="medium" style={styles.title}>
          Event Timeline
        </HeadlineText> */}
        <HeadlineText size="medium" style={styles.subtitle}>
          July 15, 2025
        </HeadlineText>
      </View>

      <View style={styles.timeline}>
        {timelineEvents.map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineContent}>
              <View style={[styles.timelineDot, styles[`${event.status}Dot`]]} />
              <View style={styles.timelineDetails}>
                <BodyText size="medium" style={styles.timelineTime}>
                  {event.time}
                </BodyText>
                <BodyText
                  size="large"
                  style={[styles.timelineTitle, styles[`${event.status}Title`]]}
                >
                  {event.title}
                </BodyText>
              </View>
            </View>
            {index < timelineEvents.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  styles[`${timelineEvents[index + 1].status}Line`],
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
      {/* <HeadlineText>Timeline Overview</HeadlineText>
      <BodyText>Timeline content goes here...</BodyText>
      <BodyText>{currentProject?.form2?.events.length}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].description}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].time}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].priority}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].notification}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].duration}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].notes}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].location}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].icon}</BodyText>
      <BodyText>{currentProject?.form2?.events[0].iconColor}</BodyText>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Timeline Overview</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Timeline content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView> */}
    </Screen>
  );
}

const createThemedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    title: {
      color: theme.colors.onSurface,
      marginBottom: spacing.xs,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
    },
    timeline: {
      padding: spacing.lg,
      paddingLeft: spacing.xl,
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: spacing.lg,
    },
    timelineContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      position: 'absolute',
      left: -22,
    },
    completedDot: {
      backgroundColor: theme.colors.secondary,
    },
    currentDot: {
      backgroundColor: theme.colors.primary,
      transform: [{ scale: 1.2 }],
    },
    upcomingDot: {
      backgroundColor: theme.colors.onSurfaceDisabled,
    },
    timelineDetails: {
      flex: 1,
    },
    timelineTime: {
      color: theme.colors.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    timelineTitle: {
      color: theme.colors.onSurface,
    },
    completedTitle: {
      color: theme.colors.onSurfaceVariant,
      textDecorationLine: 'line-through',
    },
    currentTitle: {
      fontWeight: 'bold',
    },
    upcomingTitle: {
      // Default styles are fine
    },
    timelineLine: {
      position: 'absolute',
      left: -17,
      top: 12,
      bottom: -12,
      width: 2,
    },
    completedLine: {
      backgroundColor: theme.colors.secondary,
    },
    currentLine: {
      backgroundColor: theme.colors.primary,
    },
    upcomingLine: {
      backgroundColor: theme.colors.onSurfaceDisabled,
    },
  });

// # 4.2 Timeline Tab
// # 4.2.0 General tab (default)
// app/(app)/dashboard/(timeline)/index.tsx
// import { BodyText, HeadlineText } from '@/components/ui/Typography';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect } from 'react';
// import { ScrollView } from 'react-native';
// import { Card, Text, useTheme } from 'react-native-paper';
// import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
// import { Screen } from '../../../../components/ui/Screen';
// import { useProjects } from '../../../../contexts/ProjectContext';

// // Define your subpages for dashboard
// const timelineSubPages = [
//   { id: 'index', title: 'Timeline', iconName: 'timeline-clock-outline', route: '/(app)/dashboard/(timeline)' },
//   { id: 'notifications', title: 'Notifications', iconName: 'bell-outline', route: '/(app)/dashboard/(timeline)/notifications' },
//   { id: 'edit', title: 'Update', iconName: 'clock-edit-outline', route: '/(app)/dashboard/(timeline)/edit' },
// ];

// export default function TimelineGeneralScreen() {
//   const router = useRouter();
//   const theme = useTheme();

//     // Get the projectId passed from the projects screen
//   const { projectId } = useLocalSearchParams<{ projectId?: string }>();

//   // Get the state and the setter function from the context
//   const { currentProject, setCurrentProjectById } = useProjects();
  
//   // This effect runs when the screen loads or when the projectId parameter changes.
//   // It ensures the correct project is set in the context.
//   useEffect(() => {
//     if (projectId) {
//       setCurrentProjectById(projectId);
//     }
//   }, [projectId, setCurrentProjectById]);

//   // Create navigation object that matches the expected interface
//   const navigation: NavigationProp = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route as any),
//     push: (route: string) => router.push(route as any),
//     replace: (route: string) => router.replace(route as any),
//   };

//   const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if (subPage.id === 'index') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };

//   return (
//     <Screen 
//       scrollable={false}
//       padding="none"
//       safeArea={true}
//       paddingTop={0}  
//       edges={['top']}
//       backgroundColor={theme.colors.background}
//       statusBarStyle="auto"
//       testID="dashboard-timeline-screen-index-full"
//     >   
//       {/* AppBar positioned directly under status bar */}
//       <DashboardAppBar
//         navigation={navigation}
//         title="Timeline"
//         subPages={timelineSubPages}
//         currentSubPageId="index"
//         onBackPress={() => router.back()}
//         isIconVisible={customVisibility}
//       />
//       <HeadlineText>Timeline Overview</HeadlineText>
//       <BodyText>Timeline content goes here...</BodyText>
//       <BodyText>{currentProject?.form2?.events.length}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].description}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].time}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].priority}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].notification}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].duration}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].notes}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].location}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].icon}</BodyText>
//       <BodyText>{currentProject?.form2?.events[0].iconColor}</BodyText>
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//         <Text variant="headlineMedium">Timeline Overview</Text>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//             <Text>Timeline content goes here...</Text>
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </Screen>
//   );
// }
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