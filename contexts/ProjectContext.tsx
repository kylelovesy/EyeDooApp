import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ProjectService } from '../services/projectServices';
import { CreateProjectInput, Project, UpdateProjectInput } from '../types/project';
import { useAuth } from './AuthContext';

// --- State and Actions ---
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null };

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: true,
  error: null,
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, isLoading: false, error: null };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    default:
      return state;
  }
};

// --- Context Definition ---
interface ProjectContextType extends ProjectState {
  createProject: (projectInput: CreateProjectInput) => Promise<Project | undefined>;
  updateProject: (projectId: string, updates: UpdateProjectInput) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getProjectById: (projectId: string) => Project | undefined;
  setCurrentProjectById: (projectId: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// --- Provider Component ---
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_PROJECTS', payload: [] });
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    const unsubscribe = ProjectService.subscribeToUserProjects(user.id, (projects) => {
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    });

    return () => unsubscribe();
  }, [user]);
  
  const createProject = useCallback(async (projectInput: CreateProjectInput) => {
      if (!user) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to create project: User not authenticated.' });
          return;
      }
      try {
          return await ProjectService.createProject(user.id, projectInput);
      } catch (error) {
          console.error("EyeDooApp: Failed to create project:", error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to create project.' });
      }
  }, [user]);

  const updateProject = useCallback(async (projectId: string, updates: UpdateProjectInput) => {
    try {
        await ProjectService.updateProject(projectId, updates);
    } catch (error) {
        console.error(`EyeDooApp: Failed to update project ${projectId}:`, error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update project.' });
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    try {
        await ProjectService.deleteProject(projectId);
    } catch (error) {
        console.error(`EyeDooApp: Failed to delete project ${projectId}:`, error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project.' });
    }
  }, []);

  const getProjectById = useCallback((projectId: string) => {
    return state.projects.find(p => p.id === projectId);
  }, [state.projects]);

  const setCurrentProjectById = useCallback((projectId: string | null) => {
    if (projectId === null) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
        return;
    }
    const project = state.projects.find(p => p.id === projectId);
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project || null });
  }, [state.projects]);

  const value: ProjectContextType = {
    ...state,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setCurrentProjectById,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

// --- Custom Hook ---
export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};


// import React, {
//   createContext,
//   ReactNode,
//   useCallback,
//   useContext,
//   useEffect,
//   useReducer
// } from 'react';
// import { z } from 'zod';
// import { ProjectService } from '../services/projectServices'; // Ensure path is correct
// import { useAuth } from './AuthContext'; // Assuming an AuthContext

// // --- 1. Import your Zod schemas ---
// import {
//   CombinedProjectCreateSchema,
//   CombinedProjectReadSchema,
//   CombinedProjectUpdateSchema
// } from '../types/projectSchema'; // Ensure path is correct

// // --- 2. Infer Types from the final, combined schemas ---
// type Project = z.infer<typeof CombinedProjectReadSchema>;
// type CreateProjectInput = z.infer<typeof CombinedProjectCreateSchema>;
// type UpdateProjectInput = z.infer<typeof CombinedProjectUpdateSchema>;

// // --- 3. Define State and Actions ---
// interface ProjectState {
//   projects: Project[];
//   currentProject: Project | null;
//   isLoading: boolean;
//   error: string | null;
// }

// type ProjectAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_ERROR'; payload: string | null }
//   | { type: 'SET_PROJECTS'; payload: Project[] }
//   | { type: 'SET_CURRENT_PROJECT'; payload: Project | null };

// const initialState: ProjectState = {
//   projects: [],
//   currentProject: null,
//   isLoading: true,
//   error: null,
// };

// const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload, isLoading: false };
//     case 'SET_PROJECTS':
//       // When projects are updated, check if the currentProject still exists and update it.
//       const updatedCurrentProject = state.currentProject
//         ? action.payload.find(p => p.form1.id === state.currentProject!.form1.id) || null
//         : null;
//       return { ...state, projects: action.payload, isLoading: false, error: null, currentProject: updatedCurrentProject };
//     case 'SET_CURRENT_PROJECT':
//         return { ...state, currentProject: action.payload };
//     default:
//       return state;
//   }
// };

// // --- 4. Define the Context Shape ---
// interface ProjectContextType extends ProjectState {
//   createProject: (projectInput: CreateProjectInput) => Promise<Project>;
//   updateProject: (projectId: string, updates: UpdateProjectInput) => Promise<void>;
//   deleteProject: (projectId: string) => Promise<void>;
//   getProjectById: (projectId: string) => Project | undefined;
//   setCurrentProject: (project: Project | null) => void;
// }

// const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// // --- 5. Create the Provider Component ---
// export const ProjectProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(projectReducer, initialState);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user) {
//       dispatch({ type: 'SET_PROJECTS', payload: [] });
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return;
//     }

//     dispatch({ type: 'SET_LOADING', payload: true });

//     // The service handles real-time updates. The context just listens.
//     const unsubscribe = ProjectService.subscribeToUserProjects(user.id, (projects) => {
//       dispatch({ type: 'SET_PROJECTS', payload: projects });
//     });

//     return () => unsubscribe();
//   }, [user]);

//   // --- Service Interaction Callbacks ---
  
//   const createProject = useCallback(async (projectInput: CreateProjectInput): Promise<Project> => {
//     if (!user) throw new Error("User not authenticated.");
//     return ProjectService.createProject(user.id, projectInput);
//   }, [user]);

//   const updateProject = useCallback(async (projectId: string, updates: UpdateProjectInput): Promise<void> => {
//     return ProjectService.updateProject(projectId, updates);
//   }, []);

//   const deleteProject = useCallback(async (projectId: string): Promise<void> => {
//     return ProjectService.deleteProject(projectId);
//   }, []);

//   // --- Local State Management Callbacks ---

//   const getProjectById = useCallback((projectId: string): Project | undefined => {
//     // The project ID is now nested inside form1
//     return state.projects.find(p => p.form1.id === projectId);
//   }, [state.projects]);

//   const setCurrentProject = useCallback((project: Project | null) => {
//     dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
//   }, []);

//   const value: ProjectContextType = {
//     ...state,
//     createProject,
//     updateProject,
//     deleteProject,
//     getProjectById,
//     setCurrentProject,
//   };

//   return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
// };

// // --- 6. Custom Hook ---
// export const useProjects = (): ProjectContextType => {
//   const context = useContext(ProjectContext);
//   if (context === undefined) {
//     throw new Error('useProjects must be used within a ProjectProvider');
//   }
//   return context;
// };
