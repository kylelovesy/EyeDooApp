// # 4.3 Shots Tab
// # 4.3.0 Groups tab (default)
// app/(app)/dashboard/(shots)/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define your subpages for dashboard
const shotsSubPages = [
  { id: 'index', title: 'Groups Shots', iconName: 'photo-camera', route: '/shots' },
  { id: 'requested', title: 'Requested Shots', iconName: 'photograph', route: '/shots/requested' },
  { id: 'other', title: 'Other Shots', iconName: 'photo-library', route: '/shots/other' },
];

export default function ShotsGroupsScreen() {
  const router = useRouter();
  
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

  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Groups Shots"
        subPages={shotsSubPages}
        currentSubPageId="index"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Groups Shots</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Groups Shots content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import {
//     ScrollView,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { CustomButton } from '../../../../components/ui/CustomButton';
// import {
//     BodyText,
//     HeadlineText,
//     LabelText,
//     TitleText,
// } from '../../../../components/ui/Typography';
// import { borderRadius, spacing, useAppTheme } from '../../../../constants/theme';

// export default function ShotsGroupsScreen() {
//   const theme = useAppTheme();
//   const styles = createThemedStyles(theme);

//   const shotGroups = [
//     { id: 1, name: 'Ceremony', count: 45, completed: 30 },
//     { id: 2, name: 'Family Portraits', count: 25, completed: 20 },
//     { id: 3, name: 'Reception', count: 60, completed: 15 },
//     { id: 4, name: 'Details', count: 20, completed: 18 },
//     { id: 5, name: 'Candid Moments', count: 40, completed: 25 },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <HeadlineText size="medium" style={styles.title}>
//           Photo Groups
//         </HeadlineText>
//         <BodyText size="large" style={styles.subtitle}>
//           Organize your shots by category
//         </BodyText>
//       </View>

//       <View style={styles.groupsList}>
//         {shotGroups.map((group) => (
//           <TouchableOpacity key={group.id} style={styles.groupCard}>
//             <View style={styles.groupInfo}>
//               <TitleText size="medium" style={styles.groupName}>
//                 {group.name}
//               </TitleText>
//               <BodyText size="medium" style={styles.groupProgress}>
//                 {group.completed} of {group.count} shots
//               </BodyText>
//             </View>
//             <View style={styles.progressContainer}>
//               <View style={styles.progressBar}>
//                 <View
//                   style={[
//                     styles.progressFill,
//                     { width: `${(group.completed / group.count) * 100}%` },
//                   ]}
//                 />
//               </View>
//               <LabelText size="large" style={styles.percentage}>
//                 {Math.round((group.completed / group.count) * 100)}%
//               </LabelText>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.addButtonContainer}>
//         <CustomButton
//           title="+ Add New Group"
//           variant="primary"
//           onPress={() => {}}
//         />
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
//     groupsList: {
//       padding: spacing.md,
//     },
//     groupCard: {
//       backgroundColor: theme.colors.surface,
//       padding: spacing.md,
//       marginBottom: spacing.sm,
//       borderRadius: borderRadius.lg,
//       ...theme.elevation.level2,
//     },
//     groupInfo: {
//       marginBottom: spacing.md,
//     },
//     groupName: {
//       color: theme.colors.onSurface,
//       marginBottom: spacing.xs,
//     },
//     groupProgress: {
//       color: theme.colors.onSurfaceVariant,
//     },
//     progressContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     progressBar: {
//       flex: 1,
//       height: 8,
//       backgroundColor: theme.colors.surfaceVariant,
//       borderRadius: borderRadius.full,
//       marginRight: spacing.md,
//     },
//     progressFill: {
//       height: '100%',
//       backgroundColor: theme.colors.primary,
//       borderRadius: borderRadius.full,
//     },
//     percentage: {
//       color: theme.colors.primary,
//       fontWeight: '600',
//       minWidth: 40,
//       textAlign: 'right',
//     },
//     addButtonContainer: {
//       paddingHorizontal: spacing.md,
//       paddingVertical: spacing.lg,
//     },
//   });