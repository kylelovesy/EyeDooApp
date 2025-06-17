import React, { createContext, useCallback, useContext, useState } from 'react';


interface ProjectContextType {
  projects: any[]; // Replace 'any' with your Project type
  isLoading: boolean;
  fetchProjects: (userId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback to prevent this function from being recreated on every render
  const fetchProjects = useCallback(async (userId: string) => {
      setIsLoading(true);
      // Your logic to fetch projects from Firestore for the given userId
      // const fetchedProjects = await getProjectsFromFirestore(userId);
      // setProjects(fetchedProjects);
      setIsLoading(false);
  }, []);

  const value = { projects, isLoading, fetchProjects };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within a ProjectProvider");
  return context;
}

// import React, { createContext, useState, useContext, useCallback } from 'react';
// // import { addProject, getUserProjects, updateProject, deleteProject, updateQuestionnaireProgress, getProjectsByStatus, getUpcomingProjects, subscribeToUserProjects, cacheProjects, clearCache } from '../services/projectService'; // Import your services

// const ProjectContext = createContext();

// export const ProjectProvider = ({ children }) => {
//   const [projects, setProjects] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   useEffect(() => {
//     const getUserProjects = async () => {
//       const data = await getUserProjects();
//       setProjects(data);
//     };
//     getUserProjects();
//   }, []);

//   return (
//     <ProjectContext.Provider value={{ projects, isModalVisible, setProjects, setIsModalVisible }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProjects = () => useContext(ProjectContext);
// export const useModal = () => useContext(ProjectContext);


// import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
// import { ProjectService } from '../services/projectService';
// import { CreateProjectData, Project, ProjectContextType, ProjectStatus, ProjectType, UpdateProjectData } from '../types/project';
// import { useAuth } from './AuthContext';

// interface ProjectState {
//   projects: Project[];
//   currentProject: Project | null;
//   loading: boolean;
//   error: string | null;
//   searchResults: Project[];
//   upcomingProjects: Project[];
// }

// type ProjectAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_PROJECTS'; payload: Project[] }
//   | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
//   | { type: 'SET_ERROR'; payload: string | null }
//   | { type: 'ADD_PROJECT'; payload: Project }
//   | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
//   | { type: 'REMOVE_PROJECT'; payload: string }
//   | { type: 'SET_SEARCH_RESULTS'; payload: Project[] }
//   | { type: 'SET_UPCOMING_PROJECTS'; payload: Project[] };

// const initialState: ProjectState = {
//   projects: [],
//   currentProject: null,
//   loading: false,
//   error: null,
//   searchResults: [],
//   upcomingProjects: [],
// };

// const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_PROJECTS':
//       return { ...state, projects: action.payload, loading: false, error: null };
//     case 'SET_CURRENT_PROJECT':
//       return { ...state, currentProject: action.payload };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload, loading: false };
//     case 'ADD_PROJECT':
//       return { 
//         ...state, 
//         projects: [action.payload, ...state.projects],
//         loading: false,
//         error: null 
//       };
//     case 'UPDATE_PROJECT':
//       return {
//         ...state,
//         projects: state.projects.map(project =>
//           project.id === action.payload.id
//             ? { ...project, ...action.payload.updates }
//             : project
//         ),
//         currentProject: state.currentProject?.id === action.payload.id
//           ? { ...state.currentProject, ...action.payload.updates }
//           : state.currentProject,
//       };
//     case 'REMOVE_PROJECT':
//       return {
//         ...state,
//         projects: state.projects.filter(project => project.id !== action.payload),
//         currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
//       };
//     case 'SET_SEARCH_RESULTS':
//       return { ...state, searchResults: action.payload };
//     case 'SET_UPCOMING_PROJECTS':
//       return { ...state, upcomingProjects: action.payload };
//     default:
//       return state;
//   }
// };

// const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// // Function to generate a random date in the near future or past
// const getRandomDate = () => {
//   const today = new Date();
//   const randomDays = Math.floor(Math.random() * 60) - 30; // -30 to +29 days
//   return new Date(today.setDate(today.getDate() + randomDays));
// };

// // Sample project data for seeding
// const sampleProjects: Omit<CreateProjectData, 'userId'>[] = [
//   {
//     projectName: "Sarah & Tom's Wedding",
//     clientName: 'Sarah & Tom',
//     venue: 'The Grand Ballroom',
//     projectType: ProjectType.WEDDING,
//     eventDate: getRandomDate(),
//     projectStatus: ProjectStatus.ACTIVE,
//   },
//   {
//     projectName: 'TechCorp 2025 Summit',
//     clientName: 'TechCorp Inc.',
//     venue: 'Convention Center Hall A',
//     projectType: ProjectType.OTHER,
//     eventDate: getRandomDate(),
//     projectStatus: ProjectStatus.DRAFT,
//   },
//   {
//     projectName: "Emily's 30th Birthday",
//     clientName: 'Emily Carter',
//     venue: 'The Rooftop Lounge',
//     projectType: ProjectType.OTHER,
//     eventDate: getRandomDate(),
//     projectStatus: ProjectStatus.COMPLETED,
//   },
// ];

// export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(projectReducer, initialState);
//   const { user } = useAuth();

//   // Dev-only: Seed projects if the user has none
//   useEffect(() => {
//     if (__DEV__ && user && state.projects.length === 0) {
//       const seedProjects = async () => {
//         console.log('DEV: No projects found. Seeding sample projects...');
//         for (const projectData of sampleProjects) {
//           try {
//             await createProject({ ...projectData, userId: user.id } as CreateProjectData);
//           } catch (error) {
//             console.error('DEV: Error seeding project:', error);
//           }
//         }
//         console.log('DEV: Seeding complete.');
//         loadProjects(); // Reload projects after seeding
//       };
//       seedProjects();
//     }
//   }, [user, state.projects.length]);

//   // Wrap all functions in useCallback to prevent recreating on every render
//   const loadProjects = useCallback(async (): Promise<void> => {
//     if (!user) return;

//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       dispatch({ type: 'SET_ERROR', payload: null });
      
//       const projects = await ProjectService.getUserProjects(user.id);
//       dispatch({ type: 'SET_PROJECTS', payload: projects });
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       console.error('EyeDooApp: Load projects error:', error);
//     }
//   }, [user]);

//   const loadUpcomingProjects = useCallback(async (): Promise<void> => {
//     if (!user) return;

//     try {
//       const upcomingProjects = await ProjectService.getUpcomingProjects(user.id);
//       dispatch({ type: 'SET_UPCOMING_PROJECTS', payload: upcomingProjects });
//     } catch (error: any) {
//       console.error('EyeDooApp: Load upcoming projects error:', error);
//     }
//   }, [user]);

//   const createProject = useCallback(async (projectData: CreateProjectData): Promise<Project> => {
//     if (!user) throw new Error('User not authenticated');

//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       dispatch({ type: 'SET_ERROR', payload: null });
      
//       const newProject = await ProjectService.createProject(user.id, projectData);
//       dispatch({ type: 'ADD_PROJECT', payload: newProject });
      
//       return newProject;
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       throw error;
//     }
//   }, [user]);

//   const updateProject = useCallback(async (id: string, updates: UpdateProjectData): Promise<void> => {
//     try {
//       dispatch({ type: 'SET_ERROR', payload: null });
      
//       await ProjectService.updateProject(id, updates as any);
//       dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } });
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       throw error;
//     }
//   }, [user]);

//   const deleteProject = useCallback(async (id: string): Promise<void> => {
//     try {
//       dispatch({ type: 'SET_ERROR', payload: null });
      
//       await ProjectService.deleteProject(id);
//       dispatch({ type: 'REMOVE_PROJECT', payload: id });
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       throw error;
//     }
//   }, [user]);

//   const getProject = useCallback(async (id: string): Promise<Project | null> => {
//     try {
//       // First check if project is already in state
//       const existingProject = state.projects.find(p => p.id === id);
//       if (existingProject) {
//         return existingProject;
//       }

//       // If not found, fetch from service
//       const project = await ProjectService.getProject(id);
//       return project;
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       throw error;
//     }
//   }, [state.projects]);

//   const setCurrentProject = useCallback((project: Project | null): void => {
//     dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
//   }, []);

//   const searchProjects = useCallback(async (searchTerm: string): Promise<void> => {
//     if (!user) return;

//     try {
//       const results = await ProjectService.searchProjects(user.id, searchTerm);
//       dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
//     } catch (error: any) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       console.error('EyeDooApp: Search projects error:', error);
//     }
//   }, [user]);

//   // Load projects when user changes - now with proper dependencies
//   useEffect(() => {
//     if (user) {
//       loadProjects();
//       loadUpcomingProjects();
//     } else {
//       // Clear projects when user logs out
//       dispatch({ type: 'SET_PROJECTS', payload: [] });
//       dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
//       dispatch({ type: 'SET_UPCOMING_PROJECTS', payload: [] });
//     }
//   }, [user, loadProjects, loadUpcomingProjects]);

//   const value: ProjectContextType = {
//     projects: state.projects,
//     currentProject: state.currentProject,
//     loading: state.loading,
//     error: state.error,
//     loadProjects,
//     createProject,
//     updateProject,
//     deleteProject,
//     setCurrentProject,
//     getProject,
//     searchProjects,
//     loadUpcomingProjects,
//     searchResults: state.searchResults,
//     upcomingProjects: state.upcomingProjects,
//     // getProjectsByStatus,
//   };

//   return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
// };

// export const useProjects = (): ProjectContextType => {
//   const context = useContext(ProjectContext);
//   if (context === undefined) {
//     throw new Error('useProjects must be used within a ProjectProvider');
//   }
//   return context;
// };

// // Additional hooks for specific use cases
// export const useCurrentProject = () => {
//   const { currentProject, setCurrentProject } = useProjects();
//   return { currentProject, setCurrentProject };
// };

// export const useProjectSearch = () => {
//   const { searchProjects } = useProjects();
//   const [searchResults, setSearchResults] = React.useState<Project[]>([]);
//   const [searching, setSearching] = React.useState(false);

//   const search = async (term: string) => {
//     setSearching(true);
//     try {
//       await searchProjects(term);
//     } finally {
//       setSearching(false);
//     }
//   };

//   return { searchResults, searching, search };
// };


