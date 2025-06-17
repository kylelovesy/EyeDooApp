// # 4.5 Settings Tab
// # 4.5.0 Account tab (default)
// app/(app)/dashboard/(settings)/index.tsx
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { CustomButton } from '../../../../components/ui/CustomButton';
import {
    BodyText,
    HeadlineText,
    TitleText,
} from '../../../../components/ui/Typography';
import { borderRadius, spacing, useAppTheme } from '../../../../constants/theme';
import { useAuth } from '../../../../contexts/AuthContext';

export default function AccountScreen() {
  const theme = useAppTheme();
  const styles = createThemedStyles(theme);
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const accountOptions = [
    { id: 1, title: 'Profile Information', icon: '👤' },
    { id: 2, title: 'Change Password', icon: '🔒' },
    { id: 3, title: 'Notification Preferences', icon: '🔔' },
    { id: 4, title: 'Privacy Settings', icon: '🛡️' },
    { id: 5, title: 'Subscription', icon: '💳' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HeadlineText size="medium" style={styles.title}>
          Account
        </HeadlineText>
        <BodyText size="large" style={styles.subtitle}>
          Manage your account settings
        </BodyText>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <HeadlineText size="small" style={styles.avatarText}>
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </HeadlineText>
        </View>
        <View style={styles.profileInfo}>
          <TitleText size="large" style={styles.profileName}>
            {user?.displayName || 'User Name'}
          </TitleText>
          <BodyText size="medium" style={styles.profileEmail}>
            {user?.email || 'user@example.com'}
          </BodyText>
        </View>
      </View>

      <View style={styles.optionsList}>
        {accountOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              index === accountOptions.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <BodyText size="large" style={styles.optionIcon}>
              {option.icon}
            </BodyText>
            <TitleText size="small" style={styles.optionTitle}>
              {option.title}
            </TitleText>
            <BodyText size="large" style={styles.optionArrow}>
              ›
            </BodyText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutButtonContainer}>
        <CustomButton
          title="Logout"
          variant="danger"
          onPress={handleLogout}
        />
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
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      margin: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...theme.elevation.level2,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      color: theme.colors.onPrimary,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      color: theme.colors.onSurface,
      marginBottom: spacing.xs,
    },
    profileEmail: {
      color: theme.colors.onSurfaceVariant,
    },
    optionsList: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      ...theme.elevation.level2,
      overflow: 'hidden',
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    optionIcon: {
      marginRight: spacing.md,
      width: 24,
      textAlign: 'center',
    },
    optionTitle: {
      flex: 1,
      color: theme.colors.onSurface,
    },
    optionArrow: {
      color: theme.colors.onSurfaceVariant,
    },
    logoutButtonContainer: {
      padding: spacing.md,
    },
  });