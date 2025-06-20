/* eslint-disable react/no-unescaped-entities */
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Dialog, FAB, HelperText, IconButton, Portal, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../contexts/AuthContext';
import { ProjectFormProvider, useForm1 } from '../../../contexts/Form1EssentialInfoContext';
import { ProjectProvider, useProjects } from '../../../contexts/ProjectContext';

import ProjectCard from '../../../components/cards/ProjectCard';
import { EssentialInfoFormModal } from '../../../components/modals/EssentialInfoForm';
import { CustomButton } from '../../../components/ui/CustomButton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { BodyText, HeadlineText } from '../../../components/ui/Typography';
import { spacing, useAppTheme } from '../../../constants/theme';
import { Project } from '../../../types/project';

// The screen is now wrapped in providers to ensure context is available
const ProjectsScreenWrapper = () => (
    <ProjectProvider>
        <ProjectFormProvider>
            <ProjectsScreen />
        </ProjectFormProvider>
    </ProjectProvider>
);

const ProjectsScreen = () => {
  const theme = useAppTheme();
  
  // State for managing UI
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [helpDialogVisible, setHelpDialogVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Hooks for context data and functions
  const { projects, isLoading, setCurrentProjectById, deleteProject } = useProjects();
  const { signOut } = useAuth();
  const { openModal } = useForm1(); // Get modal control from context

  // --- Handlers ---
  const handleProjectPress = (project: Project) => {
    setActiveProject(prev => (prev?.id === project.id ? null : project));
  };

  const handleLaunchProject = () => {
    if (!activeProject) return;
    setCurrentProjectById(activeProject.id);
    router.push('/(app)/dashboard/(home)');
  };

  const handleCreateProject = () => {
    openModal(); // Use context to open modal
  };
  
  const openDeleteDialog = () => {
      if (!activeProject) return;
      setDeleteDialogVisible(true);
      setDeleteError('');
      setDeleteConfirmText('');
  }

  const closeDeleteDialog = () => setDeleteDialogVisible(false);
  const showHelpDialog = () => setHelpDialogVisible(true);
  const hideHelpDialog = () => setHelpDialogVisible(false);

  const handleConfirmDelete = async () => {
    if (!activeProject) return;
    const personA = activeProject.form1.personA.firstName.toLowerCase();
    const personB = activeProject.form1.personB.firstName.toLowerCase();
    if (deleteConfirmText.toLowerCase() !== personA && deleteConfirmText.toLowerCase() !== personB) {
        setDeleteError("The name does not match. Deletion cancelled.");
        return;
    }
    await deleteProject(activeProject.id);
    setActiveProject(null);
    closeDeleteDialog();
  };

  // --- Render Logic ---
  const getStatusText = () => {
    if (isLoading) return 'Loading projects...';
    if (projects.length === 0) return 'No Projects Found';
    if (!activeProject) return 'Please Select A Project';
    return `Selected: ${activeProject.form1.personA.firstName} & ${activeProject.form1.personB.firstName}`;
  };

  const mainFabAction = () => {
      if (projects.length === 0) {
          showHelpDialog();
      } else if (activeProject) {
          openDeleteDialog();
      } else {
          handleCreateProject();
      }
  }

  const mainFabIcon = projects.length === 0 ? 'help' : (activeProject ? 'delete' : 'plus');
  
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <IconButton
            icon="logout"
            size={24}
            onPress={signOut}
            style={styles.signOutButton}
        />

        <View style={styles.header}>
            <HeadlineText>My Projects</HeadlineText>
            <BodyText style={{color: theme.colors.onSurfaceVariant}}>{getStatusText()}</BodyText>
        </View>

        {projects.length === 0 ? (
            <View style={styles.centeredContent}>
                 <EmptyState
                    title="Welcome!"
                    description="It looks like you don't have any projects yet."
                    onAction={handleCreateProject}
                 />
                 <Button 
                    mode="contained" 
                    onPress={handleCreateProject} 
                    style={styles.createProjectButton}
                    contentStyle={{paddingVertical: 8}}
                    labelStyle={{fontSize: 18}}
                >
                    Create Your First Project
                </Button>
            </View>
        ) : (
            <>
                <FlatList
                    data={projects}
                    renderItem={({ item }) => (
                        <ProjectCard
                            project={item}
                            onPress={() => handleProjectPress(item)}
                            isActive={activeProject?.id === item.id}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
                <View style={styles.footer}>
                    <CustomButton 
                        title="Launch Project" 
                        onPress={handleLaunchProject}
                        disabled={!activeProject}
                    />
                </View>
            </>
        )}
        
        <FAB
            style={[styles.fab, { bottom: projects.length > 0 ? 80 : 16 }, activeProject ? { backgroundColor: theme.colors.errorContainer } : {}]}
            color={activeProject ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer}
            icon={mainFabIcon}
            onPress={mainFabAction}
        />

        {/* Standardized Modal - managed by context */}
        <EssentialInfoFormModal />

        <Portal>
            <Dialog visible={deleteDialogVisible} onDismiss={closeDeleteDialog}>
                <Dialog.Title>Are you sure?</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">This action is permanent and cannot be undone. To confirm, please type the first name of either person in the couple.</Text>
                    <TextInput label="Confirm Name" value={deleteConfirmText} onChangeText={setDeleteConfirmText} mode="outlined" style={{ marginTop: spacing.md }} error={!!deleteError}/>
                    <HelperText type="error" visible={!!deleteError}>{deleteError}</HelperText>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={closeDeleteDialog}>Cancel</Button>
                    <Button onPress={handleConfirmDelete} disabled={!deleteConfirmText}>Delete</Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog visible={helpDialogVisible} onDismiss={hideHelpDialog}>
                <Dialog.Title>Getting Started</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        This is your project dashboard!
                        {"\n\n"}
                        - Use the large button in the center or the '+' icon to create your first project.
                        {"\n\n"}
                        - Once you have projects, you can tap to select them and then launch them to view their details.
                    </Text>
                </Dialog.Content>
                 <Dialog.Actions>
                    <Button onPress={hideHelpDialog}>Got it</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcfcff',
  },
  signOutButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
  },
  header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl, // Increased top padding to make space for sign out button
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
  },
  centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
  },
  createProjectButton: {
      marginTop: spacing.xl,
      width: '80%',
  },
  list: {
    paddingBottom: 100,
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.md,
      backgroundColor: '#fcfcff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default ProjectsScreenWrapper;
