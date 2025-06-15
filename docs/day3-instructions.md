# Day 3: UI Components & Project Management
## Eye Do Plan Development - Wedding Photographer's Assistant by morlove

### 🎯 **Day 3 Overview**
Today we'll build the core UI component library and implement comprehensive project management functionality. This includes reusable components, project CRUD operations, enhanced dashboard, and professional UI patterns.

### ⏰ **Time Allocation (4 hours)**
- **Morning Session (2 hours)**
  - Task 3.1: Core UI Components Library (60 minutes)
  - Task 3.2: Project Management Service (60 minutes)
- **Afternoon Session (2 hours)**
  - Task 3.3: Project CRUD Screens (60 minutes)
  - Task 3.4: Enhanced Dashboard & Testing (60 minutes)

### 🎯 **Day 3 Goals**
- ✅ Complete reusable UI component library
- ✅ Implement project management system
- ✅ Create project CRUD operations
- ✅ Enhanced dashboard with project overview
- ✅ Professional UI patterns and theming
- ✅ Comprehensive testing on Android emulator

---

## Task 3.1: Core UI Components Library (60 minutes)

### Step 1: Create Component Library Structure

```bash
# Create component directories
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/cards
mkdir -p src/components/lists
mkdir -p src/components/modals
```

### Step 2: Custom Button Component

Create `src/components/ui/CustomButton.tsx`:

```typescript
/**
 * Eye Do Plan - Custom Button Component
 * Reusable button with Eye Do Plan theming and accessibility
 */

import React from 'react';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  contentStyle,
  disabled,
  loading,
  ...props
}) => {
  const theme = useTheme();

  const getButtonMode = (): ButtonProps['mode'] => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained-tonal';
      case 'outline':
        return 'outlined';
      case 'text':
        return 'text';
      case 'danger':
        return 'contained';
      default:
        return 'contained';
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'danger':
        return theme.colors.error;
      default:
        return undefined;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 4, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const buttonStyles = [
    styles.button,
    fullWidth && styles.fullWidth,
    style,
  ];

  const buttonContentStyles = [
    getSizeStyles(),
    contentStyle,
  ];

  return (
    <Button
      mode={getButtonMode()}
      buttonColor={getButtonColor()}
      style={buttonStyles}
      contentStyle={buttonContentStyles}
      disabled={disabled}
      loading={loading}
      icon={icon && iconPosition === 'left' ? icon : undefined}
      {...props}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  fullWidth: {
    width: '100%',
  },
});

export default CustomButton;
```

### Step 3: Custom Card Component

Create `src/components/cards/CustomCard.tsx`:

```typescript
/**
 * Eye Do Plan - Custom Card Component
 * Reusable card with Eye Do Plan styling and accessibility
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  onMenuPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
  variant?: 'default' | 'outlined' | 'filled';
  headerIcon?: string;
  menuIcon?: string;
  disabled?: boolean;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  onMenuPress,
  style,
  elevation = 2,
  variant = 'default',
  headerIcon,
  menuIcon = 'dots-vertical',
  disabled = false,
}) => {
  const theme = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      marginVertical: 4,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          backgroundColor: theme.colors.surface,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceVariant,
        };
      default:
        return baseStyle;
    }
  };

  const CardComponent = onPress ? Card : View;
  const cardProps = onPress ? { onPress, disabled } : {};

  return (
    <CardComponent
      style={[getCardStyle(), style]}
      elevation={variant === 'outlined' ? 0 : elevation}
      {...cardProps}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ disabled }}
    >
      {(title || subtitle || onMenuPress) && (
        <Card.Title
          title={title}
          subtitle={subtitle}
          left={headerIcon ? (props) => (
            <MaterialCommunityIcons
              name={headerIcon as any}
              size={24}
              color={theme.colors.onSurface}
              {...props}
            />
          ) : undefined}
          right={onMenuPress ? (props) => (
            <IconButton
              icon={menuIcon}
              size={20}
              onPress={onMenuPress}
              disabled={disabled}
              accessibilityLabel="Card menu"
              {...props}
            />
          ) : undefined}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
      )}
      
      {children && (
        <Card.Content style={styles.cardContent}>
          {children}
        </Card.Content>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardContent: {
    paddingTop: title || subtitle ? 0 : 16,
  },
});

export default CustomCard;
```

### Step 4: Loading State Component

Create `src/components/ui/LoadingState.tsx`:

```typescript
/**
 * Eye Do Plan - Loading State Component
 * Consistent loading states throughout the app
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  overlay = false,
}) => {
  const theme = useTheme();

  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    { backgroundColor: overlay ? 'rgba(0,0,0,0.5)' : 'transparent' },
  ];

  return (
    <View style={containerStyle} accessibilityLabel={message}>
      <ActivityIndicator
        size={size}
        color={theme.colors.primary}
        accessibilityLabel="Loading indicator"
      />
      {message && (
        <Text
          variant="bodyMedium"
          style={[
            styles.message,
            { color: overlay ? '#fff' : theme.colors.onSurface },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoadingState;
```

### Step 5: Export Components

Create `src/components/index.ts`:

```typescript
// UI Components
export { default as CustomButton } from './ui/CustomButton';
export { default as LoadingState } from './ui/LoadingState';

// Card Components
export { default as CustomCard } from './cards/CustomCard';

// Re-export types
export type { CustomButtonProps } from './ui/CustomButton';
export type { CustomCardProps } from './cards/CustomCard';
export type { LoadingStateProps } from './ui/LoadingState';
```

---

## Task 3.2: Project Management Service (60 minutes)

### Step 1: Project Types and Schemas

Create `src/types/project.ts`:

```typescript
/**
 * Eye Do Plan - Project Types and Schemas
 * Type definitions for wedding photography projects
 */

import { z } from 'zod';

// Project status enum
export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled',
}

// Project type enum
export enum ProjectType {
  WEDDING = 'wedding',
  ENGAGEMENT = 'engagement',
  BRIDAL_SHOWER = 'bridal_shower',
  BACHELOR_PARTY = 'bachelor_party',
  REHEARSAL_DINNER = 'rehearsal_dinner',
  ELOPEMENT = 'elopement',
  OTHER = 'other',
}

// Zod schemas for validation
export const ProjectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  status: z.nativeEnum(ProjectStatus),
  
  // Client information
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  
  // Event details
  eventDate: z.date(),
  eventTime: z.string().optional(),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  
  // Project settings
  budget: z.number().optional(),
  packageType: z.string().optional(),
  numberOfGuests: z.number().optional(),
  
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Additional data
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
});

export type Project = z.infer<typeof ProjectSchema>;

// Create project input type (without generated fields)
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// Update project input type (all fields optional except id)
export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
```

### Step 2: Project Service

Create `src/services/projectService.ts`:

```typescript
/**
 * Eye Do Plan - Project Service
 * Comprehensive project management for wedding photographers
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleProfileError } from '../utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
  ProjectType,
  ProjectSchema,
} from '../types/project';

export interface ProjectQueryOptions {
  status?: ProjectStatus;
  type?: ProjectType;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'eventDate';
  orderDirection?: 'asc' | 'desc';
}

export interface ProjectServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Project Service Class for Eye Do Plan
 * Manages all project operations with comprehensive error handling
 */
export class ProjectService {
  private static readonly CACHE_KEY = 'eyedoplan_projects_cache';
  private static readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  /**
   * Create a new project
   */
  static async createProject(
    projectData: CreateProjectInput
  ): Promise<ProjectServiceResult<Project>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Validate input data
      const validatedData = CreateProjectSchema.parse(projectData);

      // Prepare project data
      const newProject = {
        ...validatedData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'projects'), newProject);

      // Get the created project
      const createdProject = await this.getProject(docRef.id);
      
      if (!createdProject.success || !createdProject.data) {
        throw new Error('Failed to retrieve created project');
      }

      // Clear cache to force refresh
      await this.clearProjectsCache();

      return {
        success: true,
        data: createdProject.data,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'createProject',
        userId: auth.currentUser?.uid,
        projectData,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProject(projectId: string): Promise<ProjectServiceResult<Project>> {
    try {
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Project not found',
        };
      }

      const data = docSnap.data();
      
      // Convert Firestore timestamps to dates
      const projectData = {
        ...data,
        id: docSnap.id,
        eventDate: data.eventDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };

      // Validate the data
      const validatedProject = ProjectSchema.parse(projectData);

      return {
        success: true,
        data: validatedProject,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getProject',
        projectId,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get user's projects with filtering and pagination
   */
  static async getUserProjects(
    options: ProjectQueryOptions = {}
  ): Promise<ProjectServiceResult<Project[]>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Check cache first
      const cachedProjects = await this.getCachedProjects();
      if (cachedProjects && !options.status && !options.type) {
        return {
          success: true,
          data: cachedProjects,
        };
      }

      // Build query
      let q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );

      // Add filters
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }

      // Add ordering
      const orderField = options.orderBy || 'updatedAt';
      const orderDirection = options.orderDirection || 'desc';
      q = query(q, orderBy(orderField, orderDirection));

      // Add limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      // Execute query
      const querySnapshot = await getDocs(q);
      
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const projectData = {
          ...data,
          id: doc.id,
          eventDate: data.eventDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };

        try {
          const validatedProject = ProjectSchema.parse(projectData);
          projects.push(validatedProject);
        } catch (validationError) {
          console.warn('Eye Do Plan: Invalid project data:', validationError);
        }
      });

      // Cache projects if no filters applied
      if (!options.status && !options.type) {
        await this.cacheProjects(projects);
      }

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getUserProjects',
        userId: auth.currentUser?.uid,
        options,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update a project
   */
  static async updateProject(
    projectData: UpdateProjectInput
  ): Promise<ProjectServiceResult<Project>> {
    try {
      const { id, ...updateData } = projectData;
      
      // Validate input data
      const validatedData = UpdateProjectSchema.parse(projectData);

      // Prepare update data
      const updatePayload = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      // Update in Firestore
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, updatePayload);

      // Get updated project
      const updatedProject = await this.getProject(id);
      
      if (!updatedProject.success || !updatedProject.data) {
        throw new Error('Failed to retrieve updated project');
      }

      // Clear cache to force refresh
      await this.clearProjectsCache();

      return {
        success: true,
        data: updatedProject.data,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'updateProject',
        projectData,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string): Promise<ProjectServiceResult<boolean>> {
    try {
      const docRef = doc(db, 'projects', projectId);
      await deleteDoc(docRef);

      // Clear cache to force refresh
      await this.clearProjectsCache();

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'deleteProject',
        projectId,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<ProjectServiceResult<{
    total: number;
    active: number;
    completed: number;
    upcoming: number;
  }>> {
    try {
      const projectsResult = await this.getUserProjects();
      
      if (!projectsResult.success || !projectsResult.data) {
        throw new Error('Failed to get projects for statistics');
      }

      const projects = projectsResult.data;
      const now = new Date();

      const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
        completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
        upcoming: projects.filter(p => 
          p.status === ProjectStatus.ACTIVE && 
          p.eventDate > now
        ).length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getProjectStats',
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Cache projects data
   */
  private static async cacheProjects(projects: Project[]): Promise<void> {
    try {
      const cacheData = {
        projects,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Eye Do Plan: Failed to cache projects:', error);
    }
  }

  /**
   * Get cached projects data
   */
  private static async getCachedProjects(): Promise<Project[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!cachedData) {
        return null;
      }

      const { projects, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        await this.clearProjectsCache();
        return null;
      }

      return projects;
    } catch (error) {
      console.warn('Eye Do Plan: Failed to get cached projects:', error);
      return null;
    }
  }

  /**
   * Clear projects cache
   */
  private static async clearProjectsCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Eye Do Plan: Failed to clear projects cache:', error);
    }
  }
}

export default ProjectService;
```

### 🧪 **Testing Task 3.2**

```bash
# Test on Android emulator
npx expo run:android

# Test project service functionality:
# 1. Create a new project
# 2. Verify project appears in list
# 3. Update project details
# 4. Check project statistics
# 5. Test error handling with invalid data
```

---

## Task 3.3: Project CRUD Screens (60 minutes)

### Step 1: Project List Screen

Create `app/(tabs)/projects.tsx`:

```typescript
/**
 * Eye Do Plan - Projects List Screen
 * Main projects overview with CRUD operations
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  FAB,
  Searchbar,
  Chip,
  useTheme,
  Menu,
  IconButton,
} from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CustomCard, LoadingState } from '../../src/components';
import ProjectService from '../../src/services/projectService';
import { Project, ProjectStatus, ProjectType } from '../../src/types/project';
import { handleError } from '../../src/utils/errorHandler';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function ProjectsScreen() {
  const theme = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [menuVisible, setMenuVisible] = useState(false);

  /**
   * Load projects from service
   */
  const loadProjects = useCallback(async () => {
    try {
      const result = await ProjectService.getUserProjects({
        orderBy: 'updatedAt',
        orderDirection: 'desc',
      });

      if (result.success && result.data) {
        setProjects(result.data);
        setFilteredProjects(result.data);
      } else {
        throw new Error(result.error || 'Failed to load projects');
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        screen: 'Projects',
        action: 'loadProjects',
      });
      console.error('Eye Do Plan: Failed to load projects:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Filter projects based on search and status
   */
  const filterProjects = useCallback(() => {
    let filtered = projects;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.clientName.toLowerCase().includes(query) ||
        project.venue?.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedStatus]);

  /**
   * Handle project deletion
   */
  const handleDeleteProject = async (projectId: string) => {
    try {
      const result = await ProjectService.deleteProject(projectId);
      
      if (result.success) {
        // Remove from local state
        const updatedProjects = projects.filter(p => p.id !== projectId);
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        screen: 'Projects',
        action: 'deleteProject',
        projectId,
      });
      console.error('Eye Do Plan: Failed to delete project:', errorMessage);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  /**
   * Navigate to create project screen
   */
  const handleCreateProject = () => {
    router.push('/(projects)/create');
  };

  /**
   * Navigate to project details
   */
  const handleProjectPress = (project: Project) => {
    router.push(`/(projects)/${project.id}`);
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Filter projects when dependencies change
  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  /**
   * Render project card
   */
  const renderProjectCard = (project: Project) => {
    const eventDate = new Date(project.eventDate);
    const isUpcoming = eventDate > new Date();
    const formattedDate = eventDate.toLocaleDateString();

    return (
      <CustomCard
        key={project.id}
        title={project.title}
        subtitle={`${project.clientName} • ${formattedDate}`}
        headerIcon="camera-iris"
        onPress={() => handleProjectPress(project)}
        onMenuPress={() => {
          // TODO: Implement project menu
        }}
        style={styles.projectCard}
      >
        <View style={styles.projectContent}>
          <View style={styles.projectInfo}>
            <Text variant="bodyMedium" style={styles.projectDescription}>
              {project.description || 'No description'}
            </Text>
            
            {project.venue && (
              <Text variant="bodySmall" style={styles.projectVenue}>
                📍 {project.venue}
              </Text>
            )}
          </View>

          <View style={styles.projectMeta}>
            <Chip
              mode="outlined"
              compact
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(project.status) },
              ]}
            >
              {project.status.replace('_', ' ').toUpperCase()}
            </Chip>
            
            <Text variant="bodySmall" style={styles.projectType}>
              {project.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </CustomCard>
    );
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return theme.colors.primaryContainer;
      case ProjectStatus.COMPLETED:
        return theme.colors.tertiaryContainer;
      case ProjectStatus.DRAFT:
        return theme.colors.surfaceVariant;
      case ProjectStatus.CANCELLED:
        return theme.colors.errorContainer;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  if (loading) {
    return <LoadingState message="Loading your projects..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name="camera-iris"
            size={24}
            color={theme.colors.primary}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Projects
          </Text>
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
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              // TODO: Implement export functionality
            }}
            title="Export Projects"
            leadingIcon="export"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              // TODO: Implement settings
            }}
            title="Settings"
            leadingIcon="cog"
          />
        </Menu>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search projects..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <Chip
            selected={selectedStatus === 'all'}
            onPress={() => setSelectedStatus('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={selectedStatus === ProjectStatus.ACTIVE}
            onPress={() => setSelectedStatus(ProjectStatus.ACTIVE)}
            style={styles.filterChip}
          >
            Active
          </Chip>
          <Chip
            selected={selectedStatus === ProjectStatus.COMPLETED}
            onPress={() => setSelectedStatus(ProjectStatus.COMPLETED)}
            style={styles.filterChip}
          >
            Completed
          </Chip>
          <Chip
            selected={selectedStatus === ProjectStatus.DRAFT}
            onPress={() => setSelectedStatus(ProjectStatus.DRAFT)}
            style={styles.filterChip}
          >
            Draft
          </Chip>
        </ScrollView>
      </View>

      {/* Projects List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="camera-off"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              {projects.length === 0 ? 'No Projects Yet' : 'No Matching Projects'}
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              {projects.length === 0
                ? 'Create your first wedding photography project to get started with Eye Do Plan.'
                : 'Try adjusting your search or filter criteria.'
              }
            </Text>
          </View>
        ) : (
          filteredProjects.map(renderProjectCard)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateProject}
        label={isTablet ? 'New Project' : undefined}
        accessibilityLabel="Create new project"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingRight: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  projectCard: {
    marginBottom: 12,
  },
  projectContent: {
    gap: 12,
  },
  projectInfo: {
    gap: 4,
  },
  projectDescription: {
    lineHeight: 20,
  },
  projectVenue: {
    opacity: 0.7,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  projectType: {
    opacity: 0.7,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
```

### 🧪 **Testing Task 3.3**

```bash
# Test on Android emulator
npx expo run:android

# Test project list functionality:
# 1. View projects list (should be empty initially)
# 2. Test search functionality
# 3. Test status filters
# 4. Test refresh functionality
# 5. Verify empty state displays correctly
# 6. Test FAB navigation (will fail until create screen exists)
```

---

## Task 3.4: Enhanced Dashboard & Testing (60 minutes)

### Step 1: Enhanced Dashboard Screen

Update `app/(tabs)/index.tsx`:

```typescript
/**
 * Eye Do Plan - Enhanced Dashboard Screen
 * Main dashboard with project overview and quick actions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CustomCard, LoadingState, CustomButton } from '../src/components';
import ProjectService from '../src/services/projectService';
import ProfileService from '../src/services/profileService';
import { Project, ProjectStatus } from '../src/types/project';
import { UserProfile } from '../src/services/profileService';
import { handleError } from '../src/utils/errorHandler';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface DashboardStats {
  total: number;
  active: number;
  completed: number;
  upcoming: number;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load dashboard data
   */
  const loadDashboardData = useCallback(async () => {
    try {
      // Load user profile
      const profileResult = await ProfileService.getCurrentUserProfile();
      if (profileResult) {
        setProfile(profileResult);
      }

      // Load project statistics
      const statsResult = await ProjectService.getProjectStats();
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }

      // Load recent projects
      const recentResult = await ProjectService.getUserProjects({
        limit: 5,
        orderBy: 'updatedAt',
        orderDirection: 'desc',
      });
      if (recentResult.success && recentResult.data) {
        setRecentProjects(recentResult.data);
      }

      // Load upcoming projects
      const upcomingResult = await ProjectService.getUserProjects({
        status: ProjectStatus.ACTIVE,
        limit: 3,
        orderBy: 'eventDate',
        orderDirection: 'asc',
      });
      if (upcomingResult.success && upcomingResult.data) {
        const now = new Date();
        const upcoming = upcomingResult.data.filter(p => p.eventDate > now);
        setUpcomingProjects(upcoming);
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        screen: 'Dashboard',
        action: 'loadDashboardData',
      });
      console.error('Eye Do Plan: Failed to load dashboard data:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Render stats card
   */
  const renderStatsCard = () => {
    if (!stats) return null;

    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return (
      <CustomCard
        title="Project Overview"
        headerIcon="chart-line"
        style={styles.statsCard}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.total}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Projects
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
              {stats.active}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Active
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.tertiary }]}>
              {stats.completed}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Completed
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.secondary }]}>
              {stats.upcoming}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Upcoming
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="bodyMedium">Completion Rate</Text>
            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
              {completionRate.toFixed(0)}%
            </Text>
          </View>
          <ProgressBar
            progress={completionRate / 100}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      </CustomCard>
    );
  };

  /**
   * Render quick actions
   */
  const renderQuickActions = () => (
    <CustomCard
      title="Quick Actions"
      headerIcon="lightning-bolt"
      style={styles.quickActionsCard}
    >
      <View style={styles.quickActionsGrid}>
        <CustomButton
          title="New Project"
          icon="plus"
          variant="primary"
          size="small"
          onPress={() => router.push('/(projects)/create')}
          style={styles.quickActionButton}
        />
        
        <CustomButton
          title="View All"
          icon="view-list"
          variant="outline"
          size="small"
          onPress={() => router.push('/(tabs)/projects')}
          style={styles.quickActionButton}
        />
        
        <CustomButton
          title="Calendar"
          icon="calendar"
          variant="outline"
          size="small"
          onPress={() => {
            // TODO: Navigate to calendar view
          }}
          style={styles.quickActionButton}
        />
        
        <CustomButton
          title="Settings"
          icon="cog"
          variant="text"
          size="small"
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.quickActionButton}
        />
      </View>
    </CustomCard>
  );

  /**
   * Render upcoming projects
   */
  const renderUpcomingProjects = () => {
    if (upcomingProjects.length === 0) return null;

    return (
      <CustomCard
        title="Upcoming Events"
        headerIcon="calendar-clock"
        style={styles.upcomingCard}
      >
        {upcomingProjects.map((project, index) => {
          const daysUntil = Math.ceil(
            (project.eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <View key={project.id} style={styles.upcomingItem}>
              <View style={styles.upcomingInfo}>
                <Text variant="bodyLarge" style={styles.upcomingTitle}>
                  {project.title}
                </Text>
                <Text variant="bodySmall" style={styles.upcomingClient}>
                  {project.clientName}
                </Text>
                <Text variant="bodySmall" style={styles.upcomingDate}>
                  {project.eventDate.toLocaleDateString()} • {daysUntil} days
                </Text>
              </View>
              
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
          );
        })}
        
        <CustomButton
          title="View Calendar"
          variant="text"
          size="small"
          onPress={() => {
            // TODO: Navigate to calendar view
          }}
          style={styles.viewAllButton}
        />
      </CustomCard>
    );
  };

  /**
   * Render recent projects
   */
  const renderRecentProjects = () => {
    if (recentProjects.length === 0) return null;

    return (
      <CustomCard
        title="Recent Projects"
        headerIcon="history"
        style={styles.recentCard}
      >
        {recentProjects.slice(0, 3).map((project) => (
          <View key={project.id} style={styles.recentItem}>
            <View style={styles.recentInfo}>
              <Text variant="bodyMedium" style={styles.recentTitle}>
                {project.title}
              </Text>
              <Text variant="bodySmall" style={styles.recentMeta}>
                {project.clientName} • {project.status.replace('_', ' ')}
              </Text>
            </View>
            
            <Text variant="bodySmall" style={styles.recentDate}>
              {project.updatedAt.toLocaleDateString()}
            </Text>
          </View>
        ))}
        
        <CustomButton
          title="View All Projects"
          variant="text"
          size="small"
          onPress={() => router.push('/(tabs)/projects')}
          style={styles.viewAllButton}
        />
      </CustomCard>
    );
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name="camera-iris"
            size={28}
            color={theme.colors.primary}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Eye Do Plan
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Welcome back, {profile?.firstName || 'Photographer'}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Completion Banner */}
        {profile && !profile.isProfileComplete && (
          <Card style={styles.bannerCard} mode="contained">
            <Card.Content style={styles.bannerContent}>
              <MaterialCommunityIcons
                name="account-alert"
                size={24}
                color={theme.colors.onPrimaryContainer}
              />
              <View style={styles.bannerText}>
                <Text variant="bodyMedium" style={styles.bannerTitle}>
                  Complete Your Profile
                </Text>
                <Text variant="bodySmall" style={styles.bannerDescription}>
                  Add more details to get the most out of Eye Do Plan
                </Text>
              </View>
              <Button
                mode="contained-tonal"
                compact
                onPress={() => router.push('/(tabs)/profile')}
              >
                Complete
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Stats Overview */}
        {renderStatsCard()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Upcoming Projects */}
        {renderUpcomingProjects()}

        {/* Recent Projects */}
        {renderRecentProjects()}

        {/* Empty State */}
        {stats?.total === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Start Your First Project
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Create your first wedding photography project to begin organizing your shoots with Eye Do Plan.
            </Text>
            <CustomButton
              title="Create Project"
              icon="plus"
              variant="primary"
              onPress={() => router.push('/(projects)/create')}
              style={styles.emptyActionButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  bannerCard: {
    marginBottom: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontWeight: '600',
  },
  bannerDescription: {
    opacity: 0.8,
  },
  statsCard: {
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  quickActionsCard: {
    marginBottom: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    flex: isTablet ? 0 : 1,
    minWidth: isTablet ? 120 : undefined,
  },
  upcomingCard: {
    marginBottom: 8,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontWeight: '600',
  },
  upcomingClient: {
    opacity: 0.7,
  },
  upcomingDate: {
    opacity: 0.7,
    fontSize: 12,
  },
  recentCard: {
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontWeight: '600',
  },
  recentMeta: {
    opacity: 0.7,
  },
  recentDate: {
    opacity: 0.7,
    fontSize: 12,
  },
  viewAllButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  emptyActionButton: {
    marginTop: 8,
  },
});
```

### 🧪 **Testing Task 3.4**

```bash
# Test on Android emulator
npx expo run:android

# Test enhanced dashboard functionality:
# 1. View dashboard with empty state
# 2. Test profile completion banner
# 3. Test quick actions navigation
# 4. Test refresh functionality
# 5. Verify responsive design on different screen sizes
# 6. Test error handling with network issues
```

---

## 📋 **Day 3 Completion Checklist**

### ✅ **Completed Tasks**
- [ ] Core UI Components Library (CustomButton, CustomCard, LoadingState)
- [ ] Project Management Service with full CRUD operations
- [ ] Project Types and Schemas with Zod validation
- [ ] Projects List Screen with search and filtering
- [ ] Enhanced Dashboard with statistics and quick actions
- [ ] Comprehensive error handling throughout
- [ ] Android emulator testing completed

### 🎯 **Day 3 Achievements**
- **Reusable Component Library**: Professional UI components with Eye Do Plan branding
- **Project Management System**: Complete CRUD operations with offline caching
- **Enhanced User Experience**: Responsive design with accessibility compliance
- **Professional Dashboard**: Statistics, quick actions, and project overview
- **Robust Error Handling**: Comprehensive error management with user-friendly messages

### 📱 **Testing Results**
- [ ] All components render correctly on Android emulator
- [ ] Navigation between screens works properly
- [ ] Error states display user-friendly messages
- [ ] Loading states provide good user feedback
- [ ] Responsive design works on different screen sizes
- [ ] Accessibility features function correctly

### 🚀 **Ready for Day 4**
With Day 3 complete, you now have:
- A solid foundation of reusable UI components
- Complete project management functionality
- Professional dashboard with statistics
- Robust error handling and loading states
- Ready to build questionnaires and timeline features

---

## 🔧 **Troubleshooting Day 3**

### Common Issues:
1. **Import Errors**: Ensure all component exports are correct in `src/components/index.ts`
2. **Navigation Issues**: Verify Expo Router setup and route structure
3. **Firebase Errors**: Check Firebase configuration and security rules
4. **TypeScript Errors**: Ensure all types are properly imported and defined
5. **Android Build Issues**: Clear cache with `npx expo start --clear`

### Performance Tips:
- Use React.memo for expensive components
- Implement proper loading states
- Cache data appropriately
- Optimize image loading and rendering

**Day 3 Complete! 🎉 Ready to move on to Day 4: Questionnaires & Data Management**

