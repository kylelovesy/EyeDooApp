// # 4.1 Home Tab
// # 4.1.0 General tab (default)
// app/(app)/dashboard/(home)/index.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  BodyText,
  HeadlineText,
  TitleText,
} from '../../../../components/ui/Typography';
import { borderRadius, spacing, useAppTheme } from '../../../../constants/theme';
import { useProjects } from '../../../../contexts/ProjectContext';
import { ProjectStatus } from '../../../../types/project';


export default function HomeGeneralScreen() {
  const theme = useAppTheme();
  const styles = createThemedStyles(theme);
  const { currentProject } = useProjects();

  if (!currentProject) {
    return (
      <View style={[styles.container, styles.centered]}>
        <HeadlineText>No Project Selected</HeadlineText>
        <BodyText style={{ marginTop: spacing.sm, textAlign: 'center' }}>
          Please go back to the Projects screen and select a project to view its
          dashboard.
        </BodyText>
      </View>
    );
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return theme.colors.primary;
      case ProjectStatus.COMPLETED:
        return theme.colors.secondary;
      case ProjectStatus.DRAFT:
        return theme.colors.tertiary;
      case ProjectStatus.CANCELLED:
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const statusStyle = {
    backgroundColor: getStatusColor(currentProject.projectStatus),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <HeadlineText size="medium" style={styles.title}>
            {currentProject.projectName}
          </HeadlineText>
          <View style={[styles.statusIndicator, statusStyle]} />
        </View>
        <BodyText size="large" style={styles.subtitle}>
          {currentProject.projectStatus}
          {/* {format(currentProject.eventDate.toDate(), 'MMMM dd, yyyy')} */}
        </BodyText>
      </View>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
          <TitleText style={{ color: theme.colors.onPrimaryContainer }}>
            Client
          </TitleText>
          <BodyText style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>
            {currentProject.clientName || 'N/A'}
          </BodyText>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
          <TitleText style={{ color: theme.colors.onSecondaryContainer }}>
            Venue
          </TitleText>
          <BodyText style={{ color: theme.colors.onSecondaryContainer, opacity: 0.8 }}>
            {currentProject.venue || 'N/A'}
          </BodyText>
        </View>
      </View>

      <View style={styles.section}>
        <TitleText size="large" style={styles.sectionTitle}>
          Questionnaire Progress
        </TitleText>
        {/* Placeholder for progress bars */}
        <BodyText style={{ color: theme.colors.onSurfaceVariant }}>
          Progress tracking will be implemented here.
        </BodyText>
      </View>

      <View style={styles.section}>
        <TitleText size="large" style={styles.sectionTitle}>
          Upcoming Tasks
        </TitleText>
        {/* Placeholder for task list */}
        <BodyText style={{ color: theme.colors.onSurfaceVariant }}>
          A list of upcoming tasks will be displayed here.
        </BodyText>
      </View>
    </ScrollView>
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: spacing.sm,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: spacing.md,
      gap: spacing.md,
    },
    card: {
      width: '100%',
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...theme.elevation.level2,
    },
    section: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      marginBottom: spacing.sm,
      color: theme.colors.onBackground,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
  });