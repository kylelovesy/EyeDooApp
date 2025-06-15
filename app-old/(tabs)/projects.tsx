// app/(tabs)/projects.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { Chip, FAB, IconButton, Menu, Searchbar } from 'react-native-paper';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/LoadingState';
import { Screen } from '../../components/ui/Screen';
import { spacing } from '../../constants/theme';
import { useProjects } from '../../contexts/ProjectContext';
import { Project, ProjectStatus } from '../../types/project';

export default function ProjectsScreen() {
  const { projects, loading, error, loadProjects, deleteProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedStatus]);

  const filterProjects = () => {
    let filtered = projects;
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.clientName.toLowerCase().includes(query) ||
        (project.venue && project.venue.toLowerCase().includes(query))
      );
    }
  
  // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter(project => project.status === selectedStatus);  
      }  
      setFilteredProjects(filtered);  
    };
  

  // useEffect(() => {
  //   let filtered = projects;

  //   // Filter by search query
  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(project =>
  //       project.title.toLowerCase().includes(query) ||
  //       project.clientName.toLowerCase().includes(query) ||
  //       (project.venue && project.venue.toLowerCase().includes(query))
  //     );
  //   }

  //   // Filter by status
  //   if (selectedStatus !== 'all') {
  //     filtered = filtered.filter(project => project.status === selectedStatus);
  //   }

  //   setFilteredProjects(filtered);
  // }, [projects, searchQuery, selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProjects();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateProject = () => {
    router.push('/(modals)/create-project');
  };

  const handleProjectPress = (project: Project) => {
    router.push(`/(projects)/${project.id}`);
  };

  const handleDeleteProject = async (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return '#4CAF50';
      case ProjectStatus.COMPLETED:
        return '#2196F3';
      case ProjectStatus.DRAFT:
        return '#FF9800';
      case ProjectStatus.CANCELLED:
        return '#F44336';
      case ProjectStatus.ARCHIVED:
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const renderProject = ({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item)}
      onDelete={() => handleDeleteProject(item)}
      style={{ marginBottom: spacing.sm }}
    />
  );

  const renderEmptyState = () => {
    if (searchQuery.trim() || selectedStatus !== 'all') {
      return (
        <EmptyState
          icon="magnify"
          title="No projects found"
          description="Try adjusting your search or filter criteria"
          actionTitle="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatus('all');
          }}
        />
      );
    }

    return (
      <EmptyState
        icon="folder-plus"
        title="No projects yet"
        description="Create your first wedding photography project to get started"
        actionTitle="Create Project"
        onAction={handleCreateProject}
      />
    );
  };

  if (loading && projects.length === 0) {
    return <LoadingState message="Loading projects..." />;
  }

  return (
    <Screen>
      {/* Search and Filter Header */}
      <View style={{ marginBottom: spacing.md }}>
        <Searchbar
          placeholder="Search projects..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: spacing.sm }}
        />
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, flex: 1 }}>
            <Chip
              selected={selectedStatus === 'all'}
              onPress={() => setSelectedStatus('all')}
              style={{ marginRight: spacing.xs }}
            >
              All
            </Chip>
            {Object.values(ProjectStatus).map((status) => (
              <Chip
                key={status}
                selected={selectedStatus === status}
                onPress={() => setSelectedStatus(status)}
                style={{ marginRight: spacing.xs }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Chip>
            ))}
          </View>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => {}} title="Sort by Date" />
            <Menu.Item onPress={() => {}} title="Sort by Name" />
            <Menu.Item onPress={() => {}} title="Sort by Status" />
          </Menu>
        </View>
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredProjects.length === 0 ? { flex: 1 } : { paddingBottom: spacing.xl }
        }
      />

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
        testID="projects-fab-create"
      />
    </Screen>
  );
}