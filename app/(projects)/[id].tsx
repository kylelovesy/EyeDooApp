import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Chip, IconButton, useTheme } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { LoadingState } from '../../components/ui/LoadingState';
import { Screen } from '../../components/ui/Screen';
import { BodyText, HeadlineText, LabelText } from '../../components/ui/Typography';
import { spacing } from '../../constants/theme';
import { useProjects } from '../../contexts/ProjectContext';
import { Project, ProjectStatus } from '../../types/project';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getProject, loading, error, deleteProject, updateProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      loadProjectDetails(id as string);
    }
  }, [id]);

  const loadProjectDetails = async (projectId: string) => {
    try {
      const fetchedProject = await getProject(projectId);
      if (fetchedProject) {
        setProject(fetchedProject);
      } else {
        Alert.alert('Error', 'Project not found.');
        router.back();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load project details.');
      router.back();
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
              Alert.alert('Success', 'Project deleted successfully.');
              router.replace('/(tabs)/projects');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete project.');
            }
          },
        },
      ]
    );
  };

  const handleEditProject = () => {
    if (project) {
      router.push(`/(modals)/edit-project/${project.id}`);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return '#4CAF50';
      case ProjectStatus.COMPLETED:
        return '#2196F3';
      case ProjectStatus.DRAFT:
        return '#FF9800';
      case ProjectStatus.CANCELLED:
        return '#F44336';
      case ProjectStatus.ARCHIVED:
        return '#9E9E9E';
      default:
        return theme.colors.outline;
    }
  };

  const getProgressPercentage = () => {
    if (!project?.questionnaireProgress) return 0;
    
    const sections = Object.values(project.questionnaireProgress);
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  if (loading || !project) {
    return <LoadingState message="Loading project details..." />;
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: project.title,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <IconButton icon="pencil" onPress={handleEditProject} />
              <IconButton icon="delete" onPress={handleDeleteProject} />
            </View>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: spacing.md }}>
          {/* Project Header */}
          <View style={{ marginBottom: spacing.lg }}>
            <HeadlineText size="large" style={{ marginBottom: spacing.xs }}>
              {project.title}
            </HeadlineText>
            <BodyText size="medium" style={{ opacity: 0.7 }}>
              {project.clientName} - {format(project.eventDate, 'PPP')}
            </BodyText>
            <Chip
              style={{
                backgroundColor: getStatusColor(project.status) + '20',
                marginTop: spacing.sm,
                alignSelf: 'flex-start',
              }}
              textStyle={{ color: getStatusColor(project.status) }}
            >
              {project.status.toUpperCase()}
            </Chip>
          </View>

          {/* Client Information */}
          <View style={{ marginBottom: spacing.lg }}>
            <TitleText size="medium" style={{ marginBottom: spacing.sm }}>Client Details</TitleText>
            <View style={{ gap: spacing.xs }}>
              <BodyText>Email: {project.clientEmail || 'N/A'}</BodyText>
              <BodyText>Phone: {project.clientPhone || 'N/A'}</BodyText>
            </View>
          </View>

          {/* Event Details */}
          <View style={{ marginBottom: spacing.lg }}>
            <TitleText size="medium" style={{ marginBottom: spacing.sm }}>Event Details</TitleText>
            <View style={{ gap: spacing.xs }}>
              <BodyText>Date: {format(project.eventDate, 'PPPP')}</BodyText>
              {project.eventTime && <BodyText>Time: {project.eventTime}</BodyText>}
              {project.venue && <BodyText>Venue: {project.venue}</BodyText>}
              {project.venueAddress && <BodyText>Address: {project.venueAddress}</BodyText>}
              {project.numberOfGuests && <BodyText>Guests: {project.numberOfGuests}</BodyText>}
            </View>
          </View>

          {/* Project Details */}
          <View style={{ marginBottom: spacing.lg }}>
            <TitleText size="medium" style={{ marginBottom: spacing.sm }}>Project Details</TitleText>
            <View style={{ gap: spacing.xs }}>
              <BodyText>Type: {project.type}</BodyText>
              {project.budget && <BodyText>Budget: ${project.budget.toLocaleString()}</BodyText>}
              {project.packageType && <BodyText>Package: {project.packageType}</BodyText>}
              {project.description && <BodyText>Description: {project.description}</BodyText>}
              {project.notes && <BodyText>Notes: {project.notes}</BodyText>}
              {project.tags && project.tags.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm }}>
                  {project.tags.map((tag, index) => (
                    <Chip key={index}>{tag}</Chip>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Questionnaire Progress */}
          <View style={{ marginBottom: spacing.lg }}>
            <TitleText size="medium" style={{ marginBottom: spacing.sm }}>Questionnaire Progress</TitleText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <LabelText size="medium">Overall Progress</LabelText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 100,
                  height: 8,
                  backgroundColor: theme.colors.outline,
                  borderRadius: 4,
                  marginRight: spacing.sm,
                }}>
                  <View style={{
                    width: `${getProgressPercentage()}%`,
                    height: '100%',
                    backgroundColor: theme.colors.primary,
                    borderRadius: 4,
                  }} />
                </View>
                <LabelText size="medium">
                  {getProgressPercentage()}%
                </LabelText>
              </View>
            </View>
            {project.questionnaireProgress && (
              <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                {Object.entries(project.questionnaireProgress).map(([key, value]) => (
                  <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BodyText>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</BodyText>
                    <MaterialCommunityIcons
                      name={value ? 'check-circle' : 'circle-outline'}
                      size={20}
                      color={value ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            <CustomButton
              title="View Timeline"
              variant="secondary"
              size="large"
              style={{ flex: 1 }}
              onPress={() => Alert.alert('Navigate', 'Navigate to Timeline Screen')}
            />
            <CustomButton
              title="Open Questionnaire"
              variant="secondary"
              size="large"
              style={{ flex: 1 }}
              onPress={() => Alert.alert('Navigate', 'Navigate to Questionnaire Screen')}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, marginBottom: spacing.xl }}>
            <CustomButton
              title="Manage Shot List"
              variant="secondary"
              size="large"
              style={{ flex: 1 }}
              onPress={() => Alert.alert('Navigate', 'Navigate to Shot List Screen')}
            />
            <CustomButton
              title="View Notes"
              variant="secondary"
              size="large"
              style={{ flex: 1 }}
              onPress={() => Alert.alert('Navigate', 'Navigate to Notes Screen')}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}


