// src/components/cards/ProjectCard.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { spacing, useAppTheme } from '../../constants/theme';
import { ProjectStatus, ProjectWithProgress } from '../../types/project';
import { BodyText, LabelText, TitleText } from '../ui/Typography';

interface ProjectCardProps {
  project: ProjectWithProgress;
  onPress: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
  isActive?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onDelete,
  style,
  isActive = false,
}) => {
  const theme = useAppTheme();

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

  const getProgressPercentage = () => {
    if (!project.questionnaireProgress) return 0;
    
    const sections = Object.values(project.questionnaireProgress);
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const formatEventDate = (date: Date) => {
    try {
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getDaysUntilEvent = () => {
    // const now = new Date();
    // const eventDate = project.eventDate.toDate();
    // const diffTime = eventDate.getTime() - now.getTime();
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // if (diffDays < 0) return 'Past event';
    // if (diffDays === 0) return 'Today';
    // if (diffDays === 1) return 'Tomorrow';
    // return `${diffDays} days`;
    return '10 days';
  };

  const cardStyle: ViewStyle[] = [style || {}];
  if (isActive) {
    cardStyle.push({
      borderColor: theme.colors.primary,
      borderWidth: 2,
      backgroundColor: theme.colors.primaryContainer,
    });
  }

  return (
    <Card style={cardStyle} onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: spacing.sm 
        }}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <TitleText size="large" numberOfLines={1}>
              {project.projectName}
            </TitleText>
            <BodyText size="medium" style={{ opacity: 0.7, marginTop: spacing.xs }}>
              {project.clientName}
            </BodyText>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Chip
              style={{ 
                backgroundColor: getStatusColor(project.projectStatus) + '20',
                marginRight: spacing.xs 
              }}
              textStyle={{ 
                color: getStatusColor(project.projectStatus),
                fontSize: 12 
              }}
            >
              {project.projectStatus.toUpperCase()}
            </Chip>
            
            {onDelete && (
              <IconButton
                icon="delete"
                size={20}
                onPress={onDelete}
                style={{ margin: 0 }}
              />
            )}
          </View>
        </View>

        {/* Event Details */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: spacing.sm 
        }}>
          <MaterialCommunityIcons 
            name="calendar" 
            size={16} 
            color={theme.colors.onSurfaceVariant}
            style={{ marginRight: spacing.xs }}
          />
          <BodyText size="small" style={{ marginRight: spacing.md }}>
            {project.projectStatus}
            {/* {formatEventDate(project.eventDate.toDate())} */}
          </BodyText>
          
          <MaterialCommunityIcons 
            name="clock" 
            size={16} 
            color={theme.colors.onSurfaceVariant}
            style={{ marginRight: spacing.xs }}
          />
          <BodyText size="small">
            {getDaysUntilEvent()}
          </BodyText>
        </View>

        {/* Venue */}
        {project.venue && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: spacing.sm 
          }}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color={theme.colors.onSurfaceVariant}
              style={{ marginRight: spacing.xs }}
            />
            <BodyText size="small" numberOfLines={1} style={{ flex: 1 }}>
              {project.venue}
            </BodyText>
          </View>
        )}

        {/* Progress */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <LabelText size="small" style={{ opacity: 0.7 }}>
            Questionnaire Progress
          </LabelText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 60,
              height: 4,
              backgroundColor: theme.colors.outline,
              borderRadius: 2,
              marginRight: spacing.xs,
            }}>
              <View style={{
                width: `${getProgressPercentage()}%`,
                height: '100%',
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
              }} />
            </View>
            <LabelText size="small">
              {getProgressPercentage()}%
            </LabelText>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};