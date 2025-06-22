import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, useTheme } from 'react-native-paper';

import { PeopleFormModal } from '../../../../components/modals/PeopleForm';
import { PhotosFormModal } from '../../../../components/modals/PhotosForm';
import { TimelineFormModal } from '../../../../components/modals/TimelineForm';
import DashboardAppBar, {
  NavigationProp,
} from '../../../../components/navigation/DashboardAppbar';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Screen } from '../../../../components/ui/Screen';
import {
  BodyText,
  HeadlineText,
  TitleText,
} from '../../../../components/ui/Typography';
import { spacing } from '../../../../constants/theme';
import {
  useForm2
} from '../../../../contexts/Form2TimelineContext';
import {
  useForm3
} from '../../../../contexts/Form3PersonaContext';
import {
  useForm4Photos
} from '../../../../contexts/Form4PhotosContext';
import { useProjects } from '../../../../contexts/ProjectContext';
import { convertFirestoreTimestamp } from '../../../../services/utils/timestampHelpers';

const homeSubPages = [
  {
    id: 'index',
    title: 'Home',
    iconName: 'home',
    route: '/(app)/dashboard/(home)',
  },
  {
    id: 'key-people',
    title: 'Key People',
    iconName: 'key',
    route: '/(app)/dashboard/(home)/key-people',
  },
  {
    id: 'directions',
    title: 'Directions',
    iconName: 'directions',
    route: '/(app)/dashboard/(home)/directions',
  },
];


const DashboardHomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  // Get the projectId passed from the projects screen
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  // Get the state and the setter function from the context
  const { currentProject, setCurrentProjectById } = useProjects();

  const timelineModal = useForm2();
  const peopleModal = useForm3();
  const photosModal = useForm4Photos();

// This effect runs when the screen loads or when the projectId parameter changes.
  // It ensures the correct project is set in the context.
  useEffect(() => {
    if (projectId) {
      setCurrentProjectById(projectId);
    }
  }, [projectId, setCurrentProjectById]);

  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  if (!currentProject) {
    return (
      <Screen backgroundColor={theme.colors.background}>
        <DashboardAppBar
          navigation={navigation}
          title="Dashboard"
          subPages={homeSubPages}
          currentSubPageId="index"
        />
        <EmptyState
          title="No Project Selected"
          description="Please select a project from the projects screen to view the dashboard."
        />
      </Screen>
    );
  }

  const { form1, form2, form3, form4 } = currentProject;

  const getProgressStatus = () => {
    return {
      timeline: form2?.events && form2.events.length > 0,
      people: form3?.immediateFamily && form3.immediateFamily.length > 0,
      photos: form4?.groupShots && form4.groupShots.length > 0,
    };
  };
  const progress = getProgressStatus();

  return (
    <Screen style={styles.safeArea} padding="sm" statusBarStyle="auto" scrollable={true}>
    {/* <Screen backgroundColor={theme.colors.background}> */}
      <DashboardAppBar
        navigation={navigation}
        title="Dashboard"
        subPages={homeSubPages}
        currentSubPageId="index"
        style={{ padding: 8 }}
      />
      {/* <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}> */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <HeadlineText>{form1.projectName}</HeadlineText>
            <BodyText>
              {form1.personA.firstName} & {form1.personB.firstName}
            </BodyText>
            {form1.eventDate && (
              <BodyText>
                {convertFirestoreTimestamp(
                  form1.eventDate
                ).toLocaleDateString()}
              </BodyText>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <View style={styles.actionItem}>
              <View style={styles.actionText}>
                <TitleText>Timeline</TitleText>
                <BodyText>
                  {progress.timeline
                    ? `${form2?.events?.length || 0} events`
                    : 'Not started'}
                </BodyText>
              </View>
              <Button
                mode="contained"
                onPress={() => timelineModal.openModal(currentProject)}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {progress.timeline ? 'Edit' : 'Setup'}
              </Button>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.actionItem}>
              <View style={styles.actionText}>
                <TitleText>Key People</TitleText>
                <BodyText>
                  {progress.people
                    ? `${form3?.immediateFamily?.length || 0} people`
                    : 'Not started'}
                </BodyText>
              </View>
              <Button
                mode="contained"
                onPress={() => peopleModal.openModal(currentProject)}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {progress.people ? 'Edit' : 'Add'}
              </Button>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.actionItem}>
              <View style={styles.actionText}>
                <TitleText>Photo Requirements</TitleText>
                <BodyText>
                  {progress.photos
                    ? `${form4?.groupShots?.length || 0} group shots`
                    : 'Not started'}
                </BodyText>
              </View>
              <Button
                mode="contained"
                onPress={() => photosModal.openModal(currentProject)}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {progress.photos ? 'Edit' : 'Add'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      {/* </ScrollView> */}
      <TimelineFormModal />
      <PeopleFormModal />
      <PhotosFormModal />
    </Screen>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fcfcff',
    },
    signOutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    createProjectButton: {
        marginTop: spacing.xl,
        width: '80%',
    },
    list: {
      paddingBottom: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        backgroundColor: '#fcfcff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0'
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
    },
  // });
  
  container: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionText: {
    flex: 1,
  },
  divider: {
    marginVertical: spacing.xs,
  },
});

export default DashboardHomeScreen;

// import { useRouter } from 'expo-router';
// import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import { Button, Card, Divider } from 'react-native-paper';

// import { PeopleFormModal } from '../../../../components/modals/PeopleForm';
// import { PhotosFormModal } from '../../../../components/modals/PhotosForm';
// import { TimelineFormModal } from '../../../../components/modals/TimelineForm';
// import DashboardAppBar, {
//   NavigationProp,
// } from '../../../../components/navigation/DashboardAppbar';
// import { EmptyState } from '../../../../components/ui/EmptyState';
// import { Screen } from '../../../../components/ui/Screen';
// import {
//   BodyText,
//   HeadlineText,
//   TitleText,
// } from '../../../../components/ui/Typography';
// import { spacing } from '../../../../constants/theme';
// import {
//   Form2TimelineProvider,
//   useForm2,
// } from '../../../../contexts/Form2TimelineContext';
// import {
//   Form3PersonaProvider,
//   useForm3,
// } from '../../../../contexts/Form3PersonaContext';
// import {
//   Form4PhotosProvider,
//   useForm4Photos,
// } from '../../../../contexts/Form4PhotosContext';
// import { useProjects } from '../../../../contexts/ProjectContext';
// import { convertFirestoreTimestamp } from '../../../../services/utils/timestampHelpers';

// const homeSubPages = [
//   {
//     id: 'index',
//     title: 'Home',
//     iconName: 'home',
//     route: '/(app)/dashboard/(home)',
//   },
//   {
//     id: 'key-people',
//     title: 'Key People',
//     iconName: 'key',
//     route: '/(app)/dashboard/(home)/key-people',
//   },
//   {
//     id: 'directions',
//     title: 'Directions',
//     iconName: 'directions',
//     route: '/(app)/dashboard/(home)/directions',
//   },
// ];

// const DashboardHomeScreenWrapper = () => (
//   <Form2TimelineProvider>
//     <Form3PersonaProvider>
//       <Form4PhotosProvider>
//         <DashboardHomeScreen />
//       </Form4PhotosProvider>
//     </Form3PersonaProvider>
//   </Form2TimelineProvider>
// );

// const DashboardHomeScreen = () => {
//   const router = useRouter();
//   const { currentProject } = useProjects();

//   const timelineModal = useForm2();
//   const peopleModal = useForm3();
//   const photosModal = useForm4Photos();

//   const navigation: NavigationProp = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route as any),
//     push: (route: string) => router.push(route as any),
//     replace: (route: string) => router.replace(route as any),
//   };

//   if (!currentProject) {
//     return (
//       <Screen>
//         <DashboardAppBar
//           navigation={navigation}
//           title="Dashboard"
//           subPages={homeSubPages}
//           currentSubPageId="index"
//         />
//         <EmptyState
//           title="No Project Selected"
//           description="Please select a project from the projects screen to view the dashboard."
//         />
//       </Screen>
//     );
//   }

//   const { form1, form2, form3, form4 } = currentProject;

//   const getProgressStatus = () => {
//     return {
//       timeline: form2?.events && form2.events.length > 0,
//       people: form3?.immediateFamily && form3.immediateFamily.length > 0,
//       photos: form4?.groupShots && form4.groupShots.length > 0,
//     };
//   };
//   const progress = getProgressStatus();

//   return (
//     <Screen>
//       <DashboardAppBar
//         navigation={navigation}
//         title="Dashboard"
//         subPages={homeSubPages}
//         currentSubPageId="index"
//       />
//       <ScrollView style={styles.container}>
//         <Card style={styles.card}>
//           <Card.Content>
//             <HeadlineText>{form1.projectName}</HeadlineText>
//             <BodyText>
//               {form1.personA.firstName} & {form1.personB.firstName}
//             </BodyText>
//             {form1.eventDate && (
//               <BodyText>
//                 {convertFirestoreTimestamp(
//                   form1.eventDate
//                 ).toLocaleDateString()}
//               </BodyText>
//             )}
//           </Card.Content>
//         </Card>

//         <Card style={styles.card}>
//           <Card.Title title="Quick Actions" />
//           <Card.Content>
//             <View style={styles.actionItem}>
//               <View style={styles.actionText}>
//                 <TitleText>Timeline</TitleText>
//                 <BodyText>
//                   {progress.timeline
//                     ? `${form2?.events?.length || 0} events`
//                     : 'Not started'}
//                 </BodyText>
//               </View>
//               <Button
//                 mode="contained"
//                 onPress={() => timelineModal.openModal(currentProject)}
//               >
//                 {progress.timeline ? 'Edit' : 'Setup'}
//               </Button>
//             </View>
//             <Divider style={styles.divider} />
//             <View style={styles.actionItem}>
//               <View style={styles.actionText}>
//                 <TitleText>Key People</TitleText>
//                 <BodyText>
//                   {progress.people
//                     ? `${form3?.immediateFamily?.length || 0} people`
//                     : 'Not started'}
//                 </BodyText>
//               </View>
//               <Button
//                 mode="contained"
//                 onPress={() => peopleModal.openModal(currentProject)}
//               >
//                 {progress.people ? 'Edit' : 'Add'}
//               </Button>
//             </View>
//             <Divider style={styles.divider} />
//             <View style={styles.actionItem}>
//               <View style={styles.actionText}>
//                 <TitleText>Photo Requirements</TitleText>
//                 <BodyText>
//                   {progress.photos
//                     ? `${form4?.groupShots?.length || 0} group shots`
//                     : 'Not started'}
//                 </BodyText>
//               </View>
//               <Button
//                 mode="contained"
//                 onPress={() => photosModal.openModal(currentProject)}
//               >
//                 {progress.photos ? 'Edit' : 'Add'}
//               </Button>
//             </View>
//           </Card.Content>
//         </Card>
//       </ScrollView>
//       <TimelineFormModal />
//       <PeopleFormModal />
//       <PhotosFormModal />
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: spacing.md,
//   },
//   card: {
//     marginBottom: spacing.md,
//   },
//   actionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: spacing.sm,
//   },
//   actionText: {
//     flex: 1,
//   },
//   divider: {
//     marginVertical: spacing.xs,
//   },
// });

// export default DashboardHomeScreenWrapper;