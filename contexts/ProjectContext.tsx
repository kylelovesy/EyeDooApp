import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { ProjectService } from '../services/projectService';
import { CreateProjectInput, Project, ProjectContextType, ProjectStatus } from '../types/project';
import { useAuth } from './AuthContext';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  searchResults: Project[];
  upcomingProjects: Project[];
}

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Project[] }
  | { type: 'SET_UPCOMING_PROJECTS'; payload: Project[] };

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  searchResults: [],
  upcomingProjects: [],
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false, error: null };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [action.payload, ...state.projects],
        loading: false,
        error: null 
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.updates }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.id
          ? { ...state.currentProject, ...action.payload.updates }
          : state.currentProject,
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_UPCOMING_PROJECTS':
      return { ...state, upcomingProjects: action.payload };
    default:
      return state;
  }
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { user } = useAuth();

  // Load projects when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
      loadUpcomingProjects();
    } else {
      // Clear projects when user logs out
      dispatch({ type: 'SET_PROJECTS', payload: [] });
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      dispatch({ type: 'SET_UPCOMING_PROJECTS', payload: [] });
    }
  }, [user]);

  const loadProjects = async (): Promise<void> => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const projects = await ProjectService.getUserProjects(user.id);
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('EyeDooApp: Load projects error:', error);
    }
  };

  const createProject = async (projectData: CreateProjectInput): Promise<Project> => {
    if (!user) throw new Error('User not authenticated');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const newProject = await ProjectService.createProject(user.id, projectData);
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      
      return newProject;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await ProjectService.updateProject(id, updates as any);
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await ProjectService.deleteProject(id);
      dispatch({ type: 'REMOVE_PROJECT', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getProject = async (id: string): Promise<Project | null> => {
    try {
      // First check if project is already in state
      const existingProject = state.projects.find(p => p.id === id);
      if (existingProject) {
        return existingProject;
      }

      // If not found, fetch from service
      const project = await ProjectService.getProject(id);
      return project;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const setCurrentProject = (project: Project | null): void => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  };

  const searchProjects = async (searchTerm: string): Promise<void> => {
    if (!user) return;

    try {
      const results = await ProjectService.searchProjects(user.id, searchTerm);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('EyeDooApp: Search projects error:', error);
    }
  };

  const loadUpcomingProjects = async (): Promise<void> => {
    if (!user) return;

    try {
      const upcomingProjects = await ProjectService.getUpcomingProjects(user.id);
      dispatch({ type: 'SET_UPCOMING_PROJECTS', payload: upcomingProjects });
    } catch (error: any) {
      console.error('EyeDooApp: Load upcoming projects error:', error);
    }
  };

  const getProjectsByStatus = async (status: ProjectStatus): Promise<Project[]> => {
    if (!user) return [];

    try {
      return await ProjectService.getProjectsByStatus(user.id, status);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const value: ProjectContextType = {
    projects: state.projects,
    currentProject: state.currentProject,
    loading: state.loading,
    error: state.error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    getProject,
    searchProjects,
    loadUpcomingProjects,
    searchResults: state.searchResults,
    upcomingProjects: state.upcomingProjects,
    // getProjectsByStatus,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

// Additional hooks for specific use cases
export const useCurrentProject = () => {
  const { currentProject, setCurrentProject } = useProjects();
  return { currentProject, setCurrentProject };
};

export const useProjectSearch = () => {
  const { searchProjects } = useProjects();
  const [searchResults, setSearchResults] = React.useState<Project[]>([]);
  const [searching, setSearching] = React.useState(false);

  const search = async (term: string) => {
    setSearching(true);
    try {
      await searchProjects(term);
    } finally {
      setSearching(false);
    }
  };

  return { searchResults, searching, search };
};


