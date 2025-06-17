
// src/screens/ProjectsPage.tsx
import React from 'react';
import { Button, Text, View } from 'react-native';
import { ProjectModalContainer } from '../../../components/modals/ProjectModalContainer';
import { useProjectForm } from '../../../contexts/ProjectFormContext';

const ProjectsPage = () => {
  // Assume you get the userId from your auth context
  const authenticatedUserId = "user-123"; 

  const { openModal } = useProjectForm();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Projects List Would Be Here</Text>
      <Button title="Create New Project" onPress={openModal} />
      
      {/* The Modal is here, ready to be opened */}
      <ProjectModalContainer userId={authenticatedUserId} />
    </View>
  );
};

export default ProjectsPage;

// import { ProjectCard } from '@/components/cards/ProjectCard';
// import { LoadingState } from '@/components/ui/LoadingState';
// import { router } from 'expo-router';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Alert, FlatList, useColorScheme, View } from 'react-native';
// import { QuestionnaireModal } from '../../../components/modals/QuestionnaireModal';
// import { CustomButton } from '../../../components/ui/CustomButton';
// import { Screen } from '../../../components/ui/Screen';
// import { Toast, useToast } from '../../../components/ui/Toast';
// import { BodyText, HeadlineText } from '../../../components/ui/Typography';
// import { commonStyles } from '../../../constants/styles';
// import { darkTheme, lightTheme } from '../../../constants/theme';
// import { useProjects } from '../../../contexts/ProjectContext';
// import { Project, ProjectStatus } from '../../../types/project';

// export default function ProjectsScreen() {
//   const colorScheme = useColorScheme();
//   const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
//   const { 
//     projects, 
//     loading, 
//     error, 
//     loadProjects, 
//     searchProjects, 
//     searchResults,
//     currentProject,
//     setCurrentProject,
//     deleteProject,
//     createProject
//   } = useProjects();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const { toastProps, showError, showSuccess, showWarning } = useToast();

//   // Load projects on component mount
//   useEffect(() => {
//     loadProjects();
//   }, [loadProjects]);

//   // Show toast messages for errors
//   useEffect(() => {
//     if (error) {
//       showError(error, 'Error loading projects');
//     }
//   }, [showError, error]);

//   const handleRefresh = useCallback(async () => {
//     await loadProjects();
//   }, [loadProjects]);

//   const handleCreateProject = () => {
//     setShowQuestionnaireModal(true);
//   };

//   const handleProjectSelect = (project: Project) => {
//     console.log('Selected project:', project.id);
//     setCurrentProject(project);
//   };

//   const handleLaunchProject = () => {
//     if (currentProject) {
//       // Navigate to dashboard with active project
//       router.push('/(app)/dashboard/(home)');
//       showSuccess(`Launching ${currentProject.projectName}`, 'success');
//     }
//   };

//   const handleDeleteProject = () => {
//     if (currentProject) {
//       console.log('Show Delete Modal For Project:', currentProject.id);
//       setShowDeleteModal(true);
//     }
//   };

//   const confirmDeleteProject = async (projectId: string) => {
//     try {
//       await deleteProject(projectId);
//       setCurrentProject(null);
//       setShowDeleteModal(false);
//       showSuccess('Project deleted successfully', 'success');
//     } catch (error: any) {
//       showError(error.message || 'Failed to delete project', 'error');
//     }
//   };

//   const handleQuestionnaireComplete = async (projectData: any) => {
//     try {
//       const newProject = await createProject(projectData);
//       setShowQuestionnaireModal(false);
//       showSuccess('Project created successfully!', 'success');
//       setCurrentProject(newProject);
//     } catch (error: any) {
//       showError(error.message || 'Failed to create project', 'error');
//     }
//   };

//   const handleQuestionnaireClose = () => {
//     Alert.alert(
//       'Unsaved Changes',
//       'Are you sure you want to close? Any unsaved changes will be lost.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Close', 
//           style: 'destructive',
//           onPress: () => setShowQuestionnaireModal(false)
//         }
//       ]
//     );
//   };

//   // Sort projects by wedding date (eventDate) and then by status
//   const sortedProjects = React.useMemo(() => {
//     const projectsToSort = isSearching ? searchResults : projects;
//     return [...projectsToSort].sort((a, b) => {
//       // First sort by event date
//       // const dateA = new Date(a.eventDate.toDate()).getTime();
//       // const dateB = new Date(b.eventDate.toDate()).getTime();
//       // const currentDate = new Date().getTime();
      
//       // // Compare with current date
//       // const diffA = Math.abs(dateA - currentDate);
//       // const diffB = Math.abs(dateB - currentDate);
      
//       // if (diffA !== diffB) {
//       //   return diffA - diffB; // Closer dates first
//       // }
      
//       // If dates are similar, sort by status priority
//       const statusPriority = {
//         [ProjectStatus.ACTIVE]: 1,
//         [ProjectStatus.DRAFT]: 2,
//         [ProjectStatus.COMPLETED]: 3,
//         [ProjectStatus.CANCELLED]: 4,
//       };
      
//       return statusPriority[a.projectStatus] - statusPriority[b.projectStatus];
//     });
//   }, [projects, searchResults, isSearching]);

//   const getStatusText = () => {
//     if (projects.length === 0) return "No Projects Found";
//     if (!currentProject) return "Please Select A Project";    
//     // Extract couple names from the project title or use a default format
//     const title = currentProject.projectName || "Selected";
//     return title;
//   };

//   const renderEmptyState = () => (
//     <View style={commonStyles.centerContent}>
//       <HeadlineText size="small" textAlign="center">No Projects Yet</HeadlineText>
//       <BodyText textAlign="center" style={{ opacity: 0.7, marginTop: 10, marginBottom: 30 }}>
//         Create your first project to get started with planning your special day.
//       </BodyText>
//       <CustomButton
//         title="Create Your First Project"
//         variant="primary"
//         onPress={handleCreateProject}
//         // style={styles.createFirstProjectButton}
//       />
//     </View>
//   );

//   const renderProjectCard = ({ item }: { item: Project }) => {
//     const isActive = currentProject?.id === item.id;
//     return (
//       <ProjectCard
//         project={item}
//         onPress={() => handleProjectSelect(item)}
//         style={commonStyles.card}
//         isActive={isActive}
//       />
//     );
//   };

//   // Show loading overlay on initial load
//   if (loading && !projects.length) {
//     return (
//       <Screen style={commonStyles.centerContent}>
//         <LoadingState overlay message="Loading projects..." />
//       </Screen>
//     );
//   }

//   return (
//     <Screen>
//       <FlatList
//         data={sortedProjects}
//         keyExtractor={(item) => item.id}
//         renderItem={renderProjectCard}
//         ListEmptyComponent={renderEmptyState}
//         contentContainerStyle={{ padding: 15 }}
//         ListHeaderComponent={
//           <View style={{ marginBottom: 15 }}>
//             <HeadlineText size="large">My Projects</HeadlineText>
//             <BodyText style={{ opacity: 0.7 }}>
//               Select a project to view its dashboard or create a new one.
//             </BodyText>
//           </View>
//         }
//       />

//       <View style={commonStyles.buttonContainer}>
//         <CustomButton
//           title="New Project"
//           variant="secondary"
//           onPress={handleCreateProject}
//           style={{ flex: 1 }}
//         />
//         <CustomButton
//           title="Launch Dashboard"
//           variant="primary"
//           onPress={handleLaunchProject}
//           disabled={!currentProject}
//           style={{ flex: 1 }}
//         />
//       </View>

//       <QuestionnaireModal
//         visible={showQuestionnaireModal}
//         onClose={handleQuestionnaireClose}
//         onComplete={handleQuestionnaireComplete}
//       />

//       {/* Toast Notification */}
//       {toastProps && <Toast {...toastProps} />}
//     </Screen>
//   );
// }
