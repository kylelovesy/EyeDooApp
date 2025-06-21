import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';

// Define your subpages for dashboard
const homeSubPages = [
  { id: 'index', title: 'Home', iconName: 'home', route: '/(app)/dashboard/(home)' },
  { id: 'key-people', title: 'Key People', iconName: 'key', route: '/(app)/dashboard/(home)/key-people' },
  { id: 'directions', title: 'Directions', iconName: 'directions', route: '/(app)/dashboard/(home)/directions' },
];

export default function DashboardHomeScreen() {
  const router = useRouter();
  
  // Create navigation object that matches the expected interface
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Dashboard"
        subPages={homeSubPages}
        currentSubPageId="index"
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Dashboard Overview</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Dashboard content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import { Card, Divider, FAB, Text } from 'react-native-paper';
// import { usePeopleModal, usePhotosModal, useTimelineModal } from '../../../../components/FormModals';
// import { CustomButton } from '../../../../components/ui/CustomButton';
// import { BodyText, HeadlineText, TitleText } from '../../../../components/ui/Typography';
// import { spacing, useAppTheme } from '../../../../constants/theme';
// import { useProjects } from '../../../../contexts/ProjectContext';

// import React from 'react';
// import { ScrollView, View } from 'react-native';
// import { Card } from 'react-native-paper';

// import { usePathname, useRouter } from 'expo-router';
// import DashboardAppBar, { SubPage } from '../../../../components/navigation/DashboardAppbar';
// import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
// import { homeSubPages } from './_layout';


// export default function HomeGeneralScreen() {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   // Create a navigation-like object for the AppBar
//   const navigation = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route),
//   };
//    // Custom visibility logic: hide cart and wishlist when cart is empty
//    const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if ( subPage.id === 'home') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <DashboardAppBar
//         navigation={navigation}
//         title="Home"
//         subPages={homeSubPages}
//         currentSubPageId="home"
//         isIconVisible={customVisibility}
//       />
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//       <HeadlineText size="large">Home</HeadlineText>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//             <BodyText>Home content goes here...</BodyText>
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }
//   const theme = useAppTheme();
//   const styles = createThemedStyles(theme);
  
//   // Get current project and functions
//   const { currentProject } = useProjects();
  
//   // Get modal controls using the standardized hooks
//   const timelineModal = useTimelineModal();
//   const peopleModal = usePeopleModal();
//   const photosModal = usePhotosModal();

//   if (!currentProject) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.emptyState}>
//           <HeadlineText size="medium" style={styles.emptyTitle}>
//             No Project Selected
//           </HeadlineText>
//           <BodyText size="large" style={styles.emptySubtitle}>
//             Please select a project from the projects screen to view the dashboard.
//           </BodyText>
//         </View>
//       </View>
//     );
//   }

//   const { form1, form2, form3, form4 } = currentProject;

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Project Header */}
//         <Card style={styles.headerCard}>
//           <Card.Content>
//             <HeadlineText size="large" style={styles.projectTitle}>
//               {form1.personA.firstName} & {form1.personB.firstName}
//             </HeadlineText>
//             <BodyText size="large" style={styles.projectSubtitle}>
//               {form1.projectType} • {form1.projectStatus}
//             </BodyText>
//             {form1.eventDate && (
//               <BodyText size="medium" style={styles.projectDate}>
//                 {new Date(form1.eventDate instanceof Date ? form1.eventDate : new Date(form1.eventDate)).toLocaleDateString()}
//               </BodyText>
//             )}
//           </Card.Content>
//         </Card>

//         {/* Quick Actions */}
//         <Card style={styles.actionsCard}>
//           <Card.Content>
//             <TitleText size="large" style={styles.sectionTitle}>Quick Actions</TitleText>
//             <Divider style={styles.divider} />
            
//             <View style={styles.actionGrid}>
//               <CustomButton
//                 title="Edit Timeline"
//                 variant="outline"
//                 size="medium"
//                 onPress={() => timelineModal.openModal(currentProject)}
//                 icon="clock"
//                 style={styles.actionButton}
//               />
              
//               <CustomButton
//                 title="Manage People"
//                 variant="outline"
//                 size="medium"
//                 onPress={() => peopleModal.openModal(currentProject)}
//                 icon="account-group"
//                 style={styles.actionButton}
//               />
              
//               <CustomButton
//                 title="Photo Requirements"
//                 variant="outline"
//                 size="medium"
//                 onPress={() => photosModal.openModal(currentProject)}
//                 icon="camera"
//                 style={styles.actionButton}
//               />
//             </View>
//           </Card.Content>
//         </Card>

//         {/* Project Overview */}
//         <Card style={styles.overviewCard}>
//           <Card.Content>
//             <TitleText size="large" style={styles.sectionTitle}>Project Overview</TitleText>
//             <Divider style={styles.divider} />
            
//             <View style={styles.statRow}>
//               <View style={styles.statItem}>
//                 <Text variant="titleLarge" style={styles.statNumber}>
//                   {form2.events?.length || 0}
//                 </Text>
//                 <Text variant="bodyMedium" style={styles.statLabel}>
//                   Timeline Events
//                 </Text>
//               </View>
              
//               <View style={styles.statItem}>
//                 <Text variant="titleLarge" style={styles.statNumber}>
//                   {(form3.immediateFamily?.length || 0) + 
//                    (form3.extendedFamily?.length || 0) + 
//                    (form3.weddingParty?.length || 0)}
//                 </Text>
//                 <Text variant="bodyMedium" style={styles.statLabel}>
//                   People
//                 </Text>
//               </View>
              
//               <View style={styles.statItem}>
//                 <Text variant="titleLarge" style={styles.statNumber}>
//                   {(form4.groupShots?.length || 0) + 
//                    (form4.coupleShots?.length || 0)}
//                 </Text>
//                 <Text variant="bodyMedium" style={styles.statLabel}>
//                   Photo Requirements
//                 </Text>
//               </View>
//             </View>
//           </Card.Content>
//         </Card>

//         {/* Notes Section */}
//         {form1.notes && (
//           <Card style={styles.notesCard}>
//             <Card.Content>
//               <TitleText size="large" style={styles.sectionTitle}>Project Notes</TitleText>
//               <Divider style={styles.divider} />
//               <BodyText size="medium" style={styles.notesText}>
//                 {form1.notes}
//               </BodyText>
//             </Card.Content>
//           </Card>
//         )}
//       </ScrollView>

//       {/* Floating Action Button for quick timeline edit */}
//       <FAB
//         style={styles.fab}
//         size="medium"
//         icon="clock"
//         onPress={() => timelineModal.openModal(currentProject)}
//         label="Timeline"
//       />
//     </View>
//   );
// }

// const createThemedStyles = (theme: any) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//     },
//     scrollView: {
//       flex: 1,
//       padding: spacing.md,
//     },
//     emptyState: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: spacing.xl,
//     },
//     emptyTitle: {
//       color: theme.colors.onSurface,
//       marginBottom: spacing.sm,
//       textAlign: 'center',
//     },
//     emptySubtitle: {
//       color: theme.colors.onSurfaceVariant,
//       textAlign: 'center',
//     },
//     headerCard: {
//       marginBottom: spacing.md,
//       backgroundColor: theme.colors.primaryContainer,
//     },
//     projectTitle: {
//       color: theme.colors.onPrimaryContainer,
//       marginBottom: spacing.xs,
//     },
//     projectSubtitle: {
//       color: theme.colors.onPrimaryContainer,
//       opacity: 0.8,
//       marginBottom: spacing.xs,
//     },
//     projectDate: {
//       color: theme.colors.onPrimaryContainer,
//       opacity: 0.7,
//     },
//     actionsCard: {
//       marginBottom: spacing.md,
//       backgroundColor: theme.colors.surface,
//     },
//     overviewCard: {
//       marginBottom: spacing.md,
//       backgroundColor: theme.colors.surface,
//     },
//     notesCard: {
//       marginBottom: spacing.xl,
//       backgroundColor: theme.colors.surface,
//     },
//     sectionTitle: {
//       color: theme.colors.onSurface,
//       marginBottom: spacing.sm,
//     },
//     divider: {
//       marginBottom: spacing.md,
//       backgroundColor: theme.colors.outline,
//     },
//     actionGrid: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       gap: spacing.sm,
//       justifyContent: 'space-between',
//     },
//     actionButton: {
//       flex: 1,
//       minWidth: '30%',
//     },
//     statRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//     },
//     statItem: {
//       alignItems: 'center',
//     },
//     statNumber: {
//       color: theme.colors.primary,
//       fontWeight: 'bold',
//     },
//     statLabel: {
//       color: theme.colors.onSurfaceVariant,
//       textAlign: 'center',
//     },
//     notesText: {
//       color: theme.colors.onSurface,
//       lineHeight: 20,
//     },
//     fab: {
//       position: 'absolute',
//       margin: spacing.md,
//       right: 0,
//       bottom: 0,
//       backgroundColor: theme.colors.primary,
//     },
//   });