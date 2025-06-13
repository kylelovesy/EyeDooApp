import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { BodyText, HeadlineText } from './Typography';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={80}
          color={theme.colors.onSurfaceVariant}
          style={styles.icon}
        />
      )}
      <HeadlineText size="medium" textAlign="center" style={styles.title}>
        {title}
      </HeadlineText>
      {description && (
        <BodyText size="medium" textAlign="center" style={styles.description}>
          {description}
        </BodyText>
      )}
      {actionTitle && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionTitle}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  button: {
    marginTop: spacing.md,
  },
});


