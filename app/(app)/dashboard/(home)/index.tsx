// # 4.1 Home Tab
// # 4.1.0 Home tab
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, useTheme } from 'react-native-paper';

import NextTimelineEventCard from '@/components/cards/NextTimelineEventCard';
import { PeopleFormModal } from '../../../../components/modals/PeopleForm';
import { PhotosFormModal } from '../../../../components/modals/PhotosForm';
import DashboardAppBar, {
  NavigationProp,
} from '../../../../components/navigation/DashboardAppbar';
import { TimelineEventForm } from '../../../../components/timeline/TimelineEventForm';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Screen } from '../../../../components/ui/Screen';
import {
  BodyText,
  HeadlineText,
  TitleText,
} from '../../../../components/ui/Typography';
import { spacing } from '../../../../constants/theme';
import {
  useForm3
} from '../../../../contexts/Form3PersonaContext';
import {
  useForm4Photos
} from '../../../../contexts/Form4PhotosContext';
import { useProjects } from '../../../../contexts/ProjectContext';
import { useTimelineContext } from '../../../../contexts/TimelineContext';
import { convertFirestoreTimestamp } from '../../../../services/utils/timestampHelpers';

const homeSubPages = [
  { id: 'index', title: 'Home', iconName: 'home', route: '/(app)/dashboard/(home)' },
  { id: 'directions', title: 'Directions', iconName: 'directions-fork', route: '/(app)/dashboard/(home)/directions' },
  { id: 'key-people', title: 'Key People', iconName: 'account-key', route: '/(app)/dashboard/(home)/key-people' },
];

const DashboardHomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  // Get the projectId passed from the projects screen
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  // Get the state and the setter function from the context
  const { currentProject, setCurrentProjectById } = useProjects();

  const timelineModal = useTimelineContext();
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
      <Screen 
        scrollable={false}
        padding="none"
        safeArea={false}
        paddingTop={0}  
        edges={[]}
        backgroundColor={theme.colors.background}
        statusBarStyle="auto"
        testID="dashboard-home-screen-index-empty"
      >
        <DashboardAppBar
          navigation={navigation}
          title="Dashboard"
          subPages={homeSubPages}
          currentSubPageId="index"
        />
        <View style={styles.content}>
          <EmptyState
            title="No Project Selected"
            description="Please select a project from the projects screen to view the dashboard."
          />
        </View>
      </Screen>
    );
  }

  const { form1, timeline, form3, form4 } = currentProject;

  const getProgressStatus = () => {
    return {
      timeline: timeline?.events && timeline.events.length > 0,
      people: form3?.immediateFamily && form3.immediateFamily.length > 0,
      photos: form4?.groupShots && form4.groupShots.length > 0,
    };
  };
  const progress = getProgressStatus();

  return (
    <Screen 
      scrollable={false}
      padding="none"
      safeArea={true}
      paddingTop={0}  
      edges={['top']}
      backgroundColor={theme.colors.background}
      statusBarStyle="auto"
      testID="dashboard-home-screen-index-full"
    >   
      {/* AppBar positioned directly under status bar */}
      <DashboardAppBar
        navigation={navigation}
        title="Dashboard"
        subPages={homeSubPages}
        currentSubPageId="index"
      />
      
      {/* Content with proper padding */}
      <View style={styles.content}>
      {/* <View style={styles.content}> */}
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
                    ? `${timeline?.events?.length || 0} events`
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
        <NextTimelineEventCard
          events={timeline?.events || []}
        /> 
      </View>
      {/* </View> */}
      <TimelineEventForm 
        projectDate={form1.eventDate}
        onSubmit={() => {}}
        onCancel={() => {}}
        isLoading={false}
      />
      <PeopleFormModal />
      <PhotosFormModal />
    </Screen>
  );
};

const styles = StyleSheet.create({  
  content: {
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

