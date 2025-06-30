// // app/(app)/dashboard/(timeline)/index.tsx
import { BodyText, HeadlineText } from '@/components/ui/Typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { EnhancedDataImportModal } from '../../../../components/import/EnhancedDataImportModal';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { EnhancedTimelineView } from '../../../../components/views/EnhancedTimelineView';
import { spacing } from '../../../../constants/theme';
import { useProjects } from '../../../../contexts/ProjectContext';
import { useTimelineContext } from '../../../../contexts/TimelineContext';
import { convertFirestoreTimestamp } from '../../../../services/utils/timestampHelpers';

const timelineSubPages: SubPage[] = [
  { id: 'index', title: 'Timeline', iconName: 'timeline-clock-outline', route: '/(app)/dashboard/(timeline)' },
  { id: 'notifications', title: 'Notifications', iconName: 'bell-outline', route: '/(app)/dashboard/(timeline)/notifications' },
  { id: 'edit', title: 'Update', iconName: 'clock-edit-outline', route: '/(app)/dashboard/(timeline)/edit' },
];

export default function TimelineGeneralScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createScreenStyles(theme);

  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const { currentProject, setCurrentProjectById } = useProjects();
  const { events, fetchEvents, loading } = useTimelineContext(); // get the fetchEvents function and loading state

  const timelineModal = useTimelineContext(); // Hook to control the timeline form modal
  
  // State for data import modal
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  useEffect(() => {
    if (projectId) {
      setCurrentProjectById(projectId);
    }
  }, [projectId, setCurrentProjectById]);

   // Add this useEffect to fetch events when the project changes
   useEffect(() => {
    if (currentProject) {
      fetchEvents(currentProject.id);
    }
  }, [currentProject, fetchEvents]);

  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };
  const hasEvents = events && events.length > 0;
  // const hasEvents = currentProject?.timeline?.events && currentProject.timeline.events.length > 0;

  // Functions to handle import modal
  const openImportModal = () => {
    setIsImportModalVisible(true);
  };

  const closeImportModal = () => {
    setIsImportModalVisible(false);
  };

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
      <DashboardAppBar
        navigation={navigation}
        title="Timeline"
        subPages={timelineSubPages}
        currentSubPageId="index"
        onBackPress={() => router.back()}
      />
      
      {loading ? ( // Add a loading indicator
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : hasEvents ? (
        // --- STATE 1: Display Timeline ---
        <ScrollView>
          <View style={styles.header}>
            <HeadlineText size="medium" style={styles.subtitle}>
              {currentProject?.form1.eventDate
                ? convertFirestoreTimestamp(currentProject.form1.eventDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : "Event Timeline"}
            </HeadlineText>
          </View>
          <EnhancedTimelineView events={events} />
        </ScrollView>
      ) : (
        // --- STATE 2: Empty State with Actions ---
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: spacing.lg }}>
          <HeadlineText style={{ marginBottom: spacing.lg }}>Your Timeline is Empty</HeadlineText>
          <BodyText style={{ marginBottom: spacing.xl }}>
            Get started by adding your first event.
          </BodyText>
          <View style={styles.buttonStack}>
          <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => currentProject && timelineModal.openModal(currentProject)}
              disabled={!currentProject}
            >
              Add Events Form
            </Button>
            <Button mode="outlined" icon="upload" onPress={openImportModal}>
              Upload Event Data
            </Button>
            <Button mode="outlined" icon="gesture-swipe" onPress={() => { /* TODO */ }}>
              Drag & Drop Events
            </Button>            
          </View>
        </View>
      )}

      {/* Data Import Modal */}
      {currentProject && (
        <EnhancedDataImportModal
          visible={isImportModalVisible}
          onDismiss={closeImportModal}
          project={currentProject}
        />
      )}
    </Screen>
  );
}

const createScreenStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      padding: spacing.md,
      paddingBottom: spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
    },
    buttonStack: {
      width: '75%',
      maxWidth: 350,
      gap: spacing.lg,
    },
  });