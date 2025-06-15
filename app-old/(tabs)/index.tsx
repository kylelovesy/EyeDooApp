// // app/(tabs)/index.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { BodyText, HeadlineText, TitleText } from '../../components/ui/Typography';
import { spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const { user } = useAuth();
  const handleCreateProject = () => {
    router.push('/(tabs)/projects');
  };

  const handleViewProjects = () => {
    router.push('/(tabs)/projects');
  };

  const handleViewTimeline = () => {
    router.push('/(tabs)/timeline');
  };

  const handleViewChecklists = () => {
    router.push('/(tabs)/checklists');
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <HeadlineText size="medium" style={{ marginBottom: spacing.sm }}>
            Welcome back, {user?.displayName || 'Photographer'}!
          </HeadlineText>

          <BodyText size="large" style={{ opacity: 0.7 }}>
            Streamline your wedding photography workflow with EyeDooApp
          </BodyText>
        </View>

        {/* Quick Actions */}

        <Card style={{ marginBottom: spacing.md }}>
          <Card.Content>
            <TitleText size="large" style={{ marginBottom: spacing.md }}>
              Quick Actions
            </TitleText>
            <View style={{ gap: spacing.sm }}>
              <CustomButton
                title="Create New Project"
                variant="primary"
                size="medium"
                fullWidth
                icon="plus"
                onPress={handleCreateProject}
                testID="dashboard-create-project-button"
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <CustomButton
                  title="View Projects"
                  variant="outline"
                  size="medium"
                  style={{ flex: 1 }}
                  icon="folder-multiple"
                  onPress={handleViewProjects}
                  testID="dashboard-view-projects-button"
                />
                <CustomButton
                  title="Timeline"
                  variant="outline"
                  size="medium"
                  style={{ flex: 1 }}
                  icon="timeline"
                  onPress={handleViewTimeline}
                  testID="dashboard-view-timeline-button"
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={{ marginBottom: spacing.md }}>
          <Card.Content>
            <TitleText size="large" style={{ marginBottom: spacing.md }}>
              Recent Activity
            </TitleText>
            <BodyText size="medium" style={{ textAlign: 'center', opacity: 0.7, paddingVertical: spacing.lg }}>
              No recent activity. Create your first project to get started!
            </BodyText>
          </Card.Content>
        </Card>

        {/* Features Overview */}
        <Card style={{ marginBottom: spacing.md }}>
          <Card.Content>
            <TitleText size="large" style={{ marginBottom: spacing.md }}>
              EyeDooApp Features
            </TitleText>
            <View style={{ gap: spacing.sm }}>
              <FeatureItem
                icon="clipboard-list"
                title="Project Management"
                description="Organize and track your wedding photography projects"
              />

              <FeatureItem
                icon="form-select"
                title="Client Questionnaires"
                description="Comprehensive questionnaires to gather essential wedding details"
              />

              <FeatureItem
                icon="timeline"
                title="Timeline Planning"
                description="Interactive wedding day timeline with alerts and notifications"
              />

              <FeatureItem
                icon="checkbox-marked-circle"
                title="Shot Checklists"
                description="Categorized shot lists to ensure you capture every important moment"
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: spacing.md,
          right: 0,
          bottom: 0,
        }}
        onPress={handleCreateProject}
        testID="dashboard-fab-create-project"
      />
    </Screen>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color="#66C5CC"
        style={{ marginTop: 2 }}
      />

      <View style={{ flex: 1 }}>
        <TitleText size="medium" style={{ marginBottom: spacing.xs }}>
          {title}
        </TitleText>
        <BodyText size="small" style={{ opacity: 0.7 }}>
          {description}
        </BodyText>
      </View>
    </View>
  );
};


// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { Screen } from '../../components/ui/Screen';
// import { BodyText, HeadlineText } from '../../components/ui/Typography';
// import { spacing } from '../../constants/theme';

// export default function TabOneScreen() {
//   const handleViewChecklists = () => {
//     // This function is currently not used, but can be implemented later
//     console.log('View Checklists');
//   };

//   return (
//     <Screen>
//       <View style={styles.container}>
//         <HeadlineText size="large" style={styles.title}>Welcome to EyeDooApp!</HeadlineText>
//         <BodyText size="medium" style={styles.subtitle}>Your personal wedding photography assistant.</BodyText>

//         <View style={styles.iconContainer}>
//           <MaterialCommunityIcons name="camera-iris" size={100} color="#66C5CC" />
//         </View>

//         <BodyText size="medium" style={styles.description}>
//           Manage your projects, track questionnaires, organize timelines, and keep your shot lists in order.
//         </BodyText>

//         {/* Example of using MaterialCommunityIcons */}
//         <View style={styles.featureItem}>
//           <MaterialCommunityIcons name="folder-multiple-outline" size={24} color="#4AAEA5" />
//           <BodyText size="medium" style={styles.featureText}>Project Management</BodyText>
//         </View>
//         <View style={styles.featureItem}>
//           <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="#4AAEA5" />
//           <BodyText size="medium" style={styles.featureText}>Questionnaires</BodyText>
//         </View>
//         <View style={styles.featureItem}>
//           <MaterialCommunityIcons name="timeline-text-outline" size={24} color="#4AAEA5" />
//           <BodyText size="medium" style={styles.featureText}>Timeline Planning</BodyText>
//         </View>
//         <View style={styles.featureItem}>
//           <MaterialCommunityIcons name="format-list-checks" size={24} color="#4AAEA5" />
//           <BodyText size="medium" style={styles.featureText}>Shot Checklists</BodyText>
//         </View>
//       </View>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: spacing.lg,
//   },
//   title: {
//     marginBottom: spacing.sm,
//   },
//   subtitle: {
//     marginBottom: spacing.xl,
//     textAlign: 'center',
//     opacity: 0.7,
//   },
//   iconContainer: {
//     marginBottom: spacing.xl,
//   },
//   description: {
//     textAlign: 'center',
//     marginBottom: spacing.lg,
//     lineHeight: 24,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.sm,
//     width: '100%',
//     maxWidth: 300,
//   },
//   featureText: {
//     marginLeft: spacing.sm,
//   },
// });
// // import { router } from 'expo-router';
// // import React from 'react';
// // import { ScrollView, View } from 'react-native';
// // import { Card, FAB } from 'react-native-paper';
// // import { CustomButton } from '../../components/ui/CustomButton';
// // import { Screen } from '../../components/ui/Screen';
// // import { BodyText, HeadlineText, TitleText } from '../../components/ui/Typography';
// // import { spacing } from '../../constants/theme';
// // import { useAuth } from '../../contexts/AuthContext';

// // export default function DashboardScreen() {
// //   const { user } = useAuth();

// //   const handleCreateProject = () => {
// //     router.push('/(tabs)/projects');
// //   };

// //   const handleViewProjects = () => {
// //     router.push('/(tabs)/projects');
// //   };

// //   const handleViewTimeline = () => {
// //     router.push('/(tabs)/timeline');
// //   };

// //   const handleViewChecklists = () => {
// //     router.push('/(tabs)/checklists');
// //   };

// //   return (
// //     <Screen>
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Welcome Section */}
// //         <View style={{ marginBottom: spacing.lg }}>
// //           <HeadlineText size="medium" style={{ marginBottom: spacing.sm }}>
// //             Welcome back, {user?.displayName || 'Photographer'}!
// //           </HeadlineText>
// //           <BodyText size="large" style={{ opacity: 0.7 }}>
// //             Streamline your wedding photography workflow with EyeDooApp
// //           </BodyText>
// //         </View>

// //         {/* Quick Actions */}
// //         <Card style={{ marginBottom: spacing.md }}>
// //           <Card.Content>
// //             <TitleText size="large" style={{ marginBottom: spacing.md }}>
// //               Quick Actions
// //             </TitleText>
// //             <View style={{ gap: spacing.sm }}>
// //               <CustomButton
// //                 title="Create New Project"
// //                 variant="primary"
// //                 size="medium"
// //                 fullWidth
// //                 icon="plus"
// //                 onPress={handleCreateProject}
// //                 testID="dashboard-create-project-button"
// //               />
// //               <View style={{ flexDirection: 'row', gap: spacing.sm }}>
// //                 <CustomButton
// //                   title="View Projects"
// //                   variant="outline"
// //                   size="medium"
// //                   style={{ flex: 1 }}
// //                   icon="folder-multiple"
// //                   onPress={handleViewProjects}
// //                   testID="dashboard-view-projects-button"
// //                 />
// //                 <CustomButton
// //                   title="Timeline"
// //                   variant="outline"
// //                   size="medium"
// //                   style={{ flex: 1 }}
// //                   icon="timeline"
// //                   onPress={handleViewTimeline}
// //                   testID="dashboard-view-timeline-button"
// //                 />
// //               </View>
// //             </View>
// //           </Card.Content>
// //         </Card>

// //         {/* Recent Activity */}
// //         <Card style={{ marginBottom: spacing.md }}>
// //           <Card.Content>
// //             <TitleText size="large" style={{ marginBottom: spacing.md }}>
// //               Recent Activity
// //             </TitleText>
// //             <BodyText size="medium" style={{ textAlign: 'center', opacity: 0.7, paddingVertical: spacing.lg }}>
// //               No recent activity. Create your first project to get started!
// //             </BodyText>
// //           </Card.Content>
// //         </Card>

// //         {/* Features Overview */}
// //         <Card style={{ marginBottom: spacing.md }}>
// //           <Card.Content>
// //             <TitleText size="large" style={{ marginBottom: spacing.md }}>
// //               EyeDooApp Features
// //             </TitleText>
// //             <View style={{ gap: spacing.sm }}>
// //               <FeatureItem
// //                 icon="clipboard-list"
// //                 title="Project Management"
// //                 description="Organize and track your wedding photography projects"
// //               />
// //               <FeatureItem
// //                 icon="form-select"
// //                 title="Client Questionnaires"
// //                 description="Comprehensive questionnaires to gather essential wedding details"
// //               />
// //               <FeatureItem
// //                 icon="timeline"
// //                 title="Timeline Planning"
// //                 description="Interactive wedding day timeline with alerts and notifications"
// //               />
// //               <FeatureItem
// //                 icon="checkbox-marked-circle"
// //                 title="Shot Checklists"
// //                 description="Categorized shot lists to ensure you capture every important moment"
// //               />
// //             </View>
// //           </Card.Content>
// //         </Card>
// //       </ScrollView>

// //       {/* Floating Action Button */}
// //       <FAB
// //         icon="plus"
// //         style={{
// //           position: 'absolute',
// //           margin: spacing.md,
// //           right: 0,
// //           bottom: 0,
// //         }}
// //         onPress={handleCreateProject}
// //         testID="dashboard-fab-create-project"
// //       />
// //     </Screen>
// //   );
// // }

// // interface FeatureItemProps {
// //   icon: string;
// //   title: string;
// //   description: string;
// // }

// // const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
// //   return (
// //     <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
// //       <MaterialCommunityIcons
// //         name={icon as any}
// //         size={24}
// //         color="#66C5CC"
// //         style={{ marginTop: 2 }}
// //       />
// //       <View style={{ flex: 1 }}>
// //         <TitleText size="medium" style={{ marginBottom: spacing.xs }}>
// //           {title}
// //         </TitleText>
// //         <BodyText size="small" style={{ opacity: 0.7 }}>
// //           {description}
// //         </BodyText>
// //       </View>
// //     </View>
// //   );
// // };