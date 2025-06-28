import { MaterialCommunityIcons } from '@expo/vector-icons';
import { differenceInDays } from 'date-fns';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Chip, IconButton, Surface } from 'react-native-paper';
import { borderRadius, spacing, useAppTheme } from '../../constants/theme';
import { convertFirestoreTimestamp } from '../../services/utils/timestampHelpers';
import { ProjectStatus } from '../../types/enum';
import { Project } from '../../types/project';
import { BodyText, LabelText, TitleText } from '../ui/Typography';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
  isActive?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onDelete,
  style,
  isActive = false,
}) => {
  const theme = useAppTheme();
  const { form1 } = project;

  const getStatusColor = (status: ProjectStatus | undefined) => {
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

  const getStatusLabel = (status: ProjectStatus | undefined) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'Active';
      case ProjectStatus.COMPLETED:
        return 'Complete';
      case ProjectStatus.DRAFT:
        return 'Draft';
      case ProjectStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Enhanced progress tracking with icons
  const getProgressStatus = () => {
    return {
      essentialInfo: true, // Always true since form1 exists
      timeline: project.timeline?.events?.length > 0,
      people: project.form3?.immediateFamily?.length > 0,
      photos: project.form4?.groupShots?.length > 0,
    };
  };

  const progressStatus = getProgressStatus();
  const completedSections = Object.values(progressStatus).filter(Boolean).length;

  const formatEventDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date)) return 'No date set';
    return convertFirestoreTimestamp(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilEvent = (eventDate: Date | undefined) => {
    if (!eventDate || !(eventDate instanceof Date)) return null;
    
    const now = new Date();
    const diffDays = differenceInDays(eventDate, now);
    
    if (diffDays < 0) return { text: 'Event passed', urgent: true };
    if (diffDays === 0) return { text: 'Today', urgent: true };
    if (diffDays === 1) return { text: 'Tomorrow', urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days`, urgent: true };
    return { text: `${diffDays} days`, urgent: false };
  };

  const eventCountdown = getDaysUntilEvent(form1.eventDate);
  
  const cardStyle: ViewStyle[] = [styles.card, style || {}];
  if (isActive) {
    cardStyle.push({
      borderColor: theme.colors.primary,
      borderWidth: 2,
      elevation: 6,
    });
  }
  
  const clientName = `${form1.personA.firstName} & ${form1.personB.firstName}`;
  const venue = form1.locations?.length > 0 ? form1.locations[0].locationAddress : 'Venue TBD';

  const ProgressIcon = ({ 
    iconName, 
    completed, 
    label 
  }: { 
    iconName: string; 
    completed: boolean; 
    label: string; 
  }) => (
    <View style={styles.progressIconContainer}>
      <Surface 
        style={[
          styles.progressIconSurface,
          { 
            backgroundColor: completed 
              ? theme.colors.primaryContainer 
              : theme.colors.surfaceVariant 
          }
        ]}
        elevation={completed ? 2 : 0}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={18}
          color={completed ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
      </Surface>
      <LabelText 
        size="small" 
        style={[
          styles.progressIconLabel,
          { 
            color: completed 
              ? theme.colors.onSurface 
              : theme.colors.onSurfaceVariant,
            opacity: completed ? 1 : 0.6
          }
        ]}
      >
        {label}
      </LabelText>
    </View>
  );

  return (
    <Card style={cardStyle} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TitleText size="large" numberOfLines={1} style={styles.projectTitle}>
              {form1.projectName}
            </TitleText>
            <BodyText 
              size="medium" 
              style={[styles.clientName, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {clientName}
            </BodyText>
          </View>
          
          <View style={styles.headerRight}>
            {form1.projectStatus && (
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(form1.projectStatus) + '15' }
                ]}
                textStyle={[
                  styles.statusChipText,
                  { color: getStatusColor(form1.projectStatus) }
                ]}
              >
                {getStatusLabel(form1.projectStatus)}
              </Chip>
            )}
            
            {onDelete && (
              <IconButton
                icon="delete-outline"
                size={20}
                onPress={onDelete}
                style={styles.deleteButton}
                iconColor={theme.colors.error}
              />
            )}
          </View>
        </View>

        {/* Event Info Section */}
        <View style={styles.eventInfoSection}>
          <View style={styles.eventInfoRow}>
            <MaterialCommunityIcons 
              name="calendar-outline" 
              size={16} 
              color={theme.colors.onSurfaceVariant}
              style={styles.infoIcon}
            />
            <BodyText size="small" style={styles.eventDate}>
              {formatEventDate(form1.eventDate)}
            </BodyText>
            
            {eventCountdown && (
              <>
                <View style={styles.countdownDivider} />
                <Surface 
                  style={[
                    styles.countdownBadge,
                    { 
                      backgroundColor: eventCountdown.urgent 
                        ? theme.colors.errorContainer 
                        : theme.colors.tertiaryContainer 
                    }
                  ]}
                  elevation={1}
                >
                  <LabelText 
                    size="small" 
                    style={[
                      styles.countdownText,
                      { 
                        color: eventCountdown.urgent 
                          ? theme.colors.onErrorContainer 
                          : theme.colors.onTertiaryContainer 
                      }
                    ]}
                  >
                    {eventCountdown.text}
                  </LabelText>
                </Surface>
              </>
            )}
          </View>

          <View style={styles.eventInfoRow}>
            <MaterialCommunityIcons 
              name="map-marker-outline" 
              size={16} 
              color={theme.colors.onSurfaceVariant}
              style={styles.infoIcon}
            />
            <BodyText 
              size="small" 
              numberOfLines={1} 
              style={[styles.venue, { color: theme.colors.onSurfaceVariant }]}
            >
              {venue}
            </BodyText>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <LabelText 
              size="small" 
              style={[styles.progressTitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Project Progress
            </LabelText>
            <LabelText 
              size="small" 
              style={[styles.progressCounter, { color: theme.colors.primary }]}
            >
              {completedSections}/4 Complete
            </LabelText>
          </View>
          
          <View style={styles.progressIconsRow}>
            <ProgressIcon 
              iconName="information-outline" 
              completed={progressStatus.essentialInfo} 
              label="Essential"
            />
            <ProgressIcon 
              iconName="timeline-outline" 
              completed={progressStatus.timeline} 
              label="Timeline"
            />
            <ProgressIcon 
              iconName="account-group-outline" 
              completed={progressStatus.people} 
              label="People"
            />
            <ProgressIcon 
              iconName="camera-outline" 
              completed={progressStatus.photos} 
              label="Photos"
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  cardContent: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  clientName: {
    opacity: 0.8,
  },
  statusChip: {
    height: 28,
    marginRight: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deleteButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  eventInfoSection: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: spacing.xs,
    width: 18,
  },
  eventDate: {
    fontWeight: '500',
  },
  countdownDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: spacing.sm,
  },
  countdownBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  countdownText: {
    fontWeight: '600',
    fontSize: 11,
  },
  venue: {
    flex: 1,
    opacity: 0.8,
  },
  progressSection: {
    marginTop: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    opacity: 0.7,
  },
  progressCounter: {
    fontWeight: '600',
  },
  progressIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  progressIconSurface: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  progressIconLabel: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default ProjectCard;
