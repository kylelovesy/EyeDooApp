// src/services/projectService.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
// import { CreateProjectData, Project, ProjectStatus, UpdateProjectData } from '../types/project';
// import { db } from './firebase';

import { addDoc, collection } from "firebase/firestore";
import { TestFormData } from "../types/project";
import { db } from "./firebase";

export const createNewProject = async (projectData: TestFormData, userId: string): Promise<void> => {
    try {
      const projectPayload = {
        ...projectData.form1Data,
        ...projectData.form2Data,
        ...projectData.form3Data,
        ...projectData.form4Data,
        userId,
        createdAt: new Date(),
      };
  
      // 'projects' is the name of your collection in Firestore
      const docRef = await addDoc(collection(db, 'projects'), projectPayload);
  
      console.log('Document written with ID: ', docRef.id);
      // You can return the new document ID or the document itself if needed
    } catch (error) {
      console.error('Error adding document: ', error);
      // Re-throw the error to be caught by the component
      throw new Error('Failed to create project.');
    }
  };
  
//Add project
// export const addProject = async () => { console.log('projectService: addProject')}
// //Get project
// export const getProject = async () => { console.log('projectService: getProject')}
// //Get all user projects
// export const getUserProjects = async () => { console.log('projectService: getUserProjects')}
// //Update project
// export const updateProject = async () => { console.log('projectService: updateProject')}
// //Delete project
// export const deleteProject = async () => { console.log('projectService: deleteProject')}
// //Update questionnaire progress
// export const updateQuestionnaireProgress = async () => { console.log('projectService: updateQuestionnaireProgress')}
// //Get projects by status
// export const getProjectsByStatus = async () => { console.log('projectService: getProjectsByStatus')}
// //Get upcoming projects
// export const getUpcomingProjects = async () => { console.log('projectService: getUpcomingProjects')}
// //Subscribe to real-time project updates
// export const subscribeToUserProjects = async () => { console.log('projectService: subscribeToUserProjects')}
// //Cache management
// export const cacheProjects = async () => { console.log('projectService: cacheProjects')}
// export const clearCache = async () => { console.log('projectService: clearCache')}
// export class ProjectService {
//   private static readonly COLLECTION_NAME = 'projects';
//   private static readonly CACHE_KEY = 'eyedooapp_projects_cache';
//   private static readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

//   /** Create a new wedding project */
//   static async createProject(userId: string, projectData: CreateProjectInput): Promise<Project> {
//     try {
//       const projectRef = collection(db, this.COLLECTION_NAME);
      
//       const newProject = {
//         ...projectData,
//         userId,
//         status: projectData.status || ProjectStatus.DRAFT,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         questionnaireProgress: {
//           essentialInfo: false,
//           timelineReview: false,
//           peopleRoles: false,
//           photographyPlan: false,
//           finalTouches: false,
//         },
//         tags: projectData.tags || [],
//         notes: projectData.notes || '',
//       };

//       const docRef = await addDoc(projectRef, newProject);
      
//       // Get the created document to return with the generated ID
//       const createdDoc = await getDoc(docRef);
//       const createdData = createdDoc.data();
      
//       const project: Project = {
//         id: docRef.id,
//         ...createdData,
//         eventDate: createdData?.eventDate?.toDate() || projectData.eventDate,
//         createdAt: createdData?.createdAt?.toDate() || new Date(),
//         updatedAt: createdData?.updatedAt?.toDate() || new Date(),
//       } as Project;

//       // Clear cache to force refresh
//       await this.clearCache();
      
//       console.log('EyeDooApp: Project created successfully:', project.id);
//       return project;
//     } catch (error) {
//       console.error('EyeDooApp: Create project error:', error);
//       throw new Error('Failed to create project. Please try again.');
//     }
//   }

//   /** Get a specific project by ID */
//   static async getProject(projectId: string): Promise<Project | null> {
//     try {
//       const projectRef = doc(db, this.COLLECTION_NAME, projectId);
//       const projectDoc = await getDoc(projectRef);

//       if (!projectDoc.exists()) {
//         return null;
//       }

//       const data = projectDoc.data();
//       return {
//         id: projectDoc.id,
//         ...data,
//         eventDate: data.eventDate?.toDate() || new Date(),
//         createdAt: data.createdAt?.toDate() || new Date(),
//         updatedAt: data.updatedAt?.toDate() || new Date(),
//       } as Project;
//     } catch (error) {
//       console.error('EyeDooApp: Get project error:', error);
//       throw new Error('Failed to load project. Please try again.');
//     }
//   }

//   /** Get all projects for a user with caching */
//   static async getUserProjects(userId: string, useCache: boolean = true): Promise<Project[]> {
//     try {
//       // Try to get from cache first
//       if (useCache) {
//         const cachedProjects = await this.getCachedProjects(userId);
//         if (cachedProjects) {
//           return cachedProjects;
//         }
//       }

//       const projectsRef = collection(db, this.COLLECTION_NAME);
//       const q = query(
//         projectsRef,
//         where('userId', '==', userId),
//         orderBy('updatedAt', 'desc')
//       );

//       const querySnapshot = await getDocs(q);
//       const projects: Project[] = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         projects.push({
//           id: doc.id,
//           ...data,
//           eventDate: data.eventDate?.toDate() || new Date(),
//           createdAt: data.createdAt?.toDate() || new Date(),
//           updatedAt: data.updatedAt?.toDate() || new Date(),
//         } as Project);
//       });

//       // Cache the results
//       await this.cacheProjects(userId, projects);

//       console.log(`EyeDooApp: Loaded ${projects.length} projects for user ${userId}`);
//       return projects;
//     } catch (error) {
//       console.error('EyeDooApp: Get user projects error:', error);
//       throw new Error('Failed to load projects. Please try again.');
//     }
//   }

//   /** Update an existing project */
//   static async updateProject(projectId: string, updates: UpdateProjectInput): Promise<void> {
//     try {
//       const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      
//       const updateData: any = {
//         ...updates,
//         updatedAt: serverTimestamp(),
//       };

//       if (updates.eventDate) {
//         (updateData as any).eventDate = Timestamp.fromDate(updates.eventDate);
//       }

//       await updateDoc(projectRef, updateData);
      
//       // Clear cache to force refresh
//       await this.clearCache();
      
//       console.log('EyeDooApp: Project updated successfully:', projectId);
//     } catch (error) {
//       console.error('EyeDooApp: Update project error:', error);
//       throw new Error('Failed to update project. Please try again.');
//     }
//   }

//   /** Delete a project */
//   static async deleteProject(projectId: string): Promise<void> {
//     try {
//       const projectRef = doc(db, this.COLLECTION_NAME, projectId);
//       await deleteDoc(projectRef);
      
//       // Clear cache to force refresh
//       await this.clearCache();
      
//       console.log('EyeDooApp: Project deleted successfully:', projectId);
//     } catch (error) {
//       console.error('EyeDooApp: Delete project error:', error);
//       throw new Error('Failed to delete project. Please try again.');
//     }
//   }

//   /** Update questionnaire progress for a project */
//   static async updateQuestionnaireProgress(
//     projectId: string, 
//     section: keyof Project['questionnaireProgress'], 
//     completed: boolean
//   ): Promise<void> {
//     try {
//       const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      
//       await updateDoc(projectRef, {
//         [`questionnaireProgress.${section}`]: completed,
//         updatedAt: serverTimestamp(),
//       });
      
//       console.log(`EyeDooApp: Questionnaire progress updated - ${section}: ${completed}`);
//     } catch (error) {
//       console.error('EyeDooApp: Update questionnaire progress error:', error);
//       throw new Error('Failed to update progress. Please try again.');
//     }
//   }

//   /** Get projects by status */
//   static async getProjectsByStatus(userId: string, status: ProjectStatus): Promise<Project[]> {
//     try {
//       const projectsRef = collection(db, this.COLLECTION_NAME);
//       const q = query(
//         projectsRef,
//         where('userId', '==', userId),
//         where('status', '==', status),
//         orderBy('eventDate', 'asc')
//       );

//       const querySnapshot = await getDocs(q);
//       const projects: Project[] = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         projects.push({
//           id: doc.id,
//           ...data,
//           eventDate: data.eventDate?.toDate() || new Date(),
//           createdAt: data.createdAt?.toDate() || new Date(),
//           updatedAt: data.updatedAt?.toDate() || new Date(),
//         } as Project);
//       });

//       return projects;
//     } catch (error) {
//       console.error('EyeDooApp: Get projects by status error:', error);
//       throw new Error('Failed to load projects. Please try again.');
//     }
//   }

//   /** Subscribe to real-time project updates */
//   static subscribeToUserProjects(
//     userId: string, 
//     callback: (projects: Project[]) => void
//   ): () => void {
//     const projectsRef = collection(db, this.COLLECTION_NAME);
//     const q = query(
//       projectsRef,
//       where('userId', '==', userId),
//       orderBy('updatedAt', 'desc')
//     );

//     return onSnapshot(q, (querySnapshot) => {
//       const projects: Project[] = [];
      
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         projects.push({
//           id: doc.id,
//           ...data,
//           eventDate: data.eventDate?.toDate() || new Date(),
//           createdAt: data.createdAt?.toDate() || new Date(),
//           updatedAt: data.updatedAt?.toDate() || new Date(),
//         } as Project);
//       });

//       callback(projects);
//     }, (error) => {
//       console.error('EyeDooApp: Projects subscription error:', error);
//     });
//   }

//   /** Search projects by title or client name */
//   // static async searchProjects(userId: string, searchTerm: string): Promise<Project[]> {
//   //   try {
//   //     const allProjects = await this.getUserProjects(userId);
      
//   //     const searchLower = searchTerm.toLowerCase();
//   //     return allProjects.filter(project => 
//   //       project.title.toLowerCase().includes(searchLower) ||
//   //       project.clientName.toLowerCase().includes(searchLower) ||
//   //       (project.venue && project.venue.toLowerCase().includes(searchLower))
//   //     );
//   //   } catch (error) {
//   //     console.error('EyeDooApp: Search projects error:', error);
//   //     throw new Error('Failed to search projects. Please try again.');
//   //   }
//   // }

//   /** Get upcoming projects (within next 30 days) */
//   static async getUpcomingProjects(userId: string): Promise<Project[]> {
//     try {
//       const now = new Date();
//       const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
//       const allProjects = await this.getUserProjects(userId);
      
//       return allProjects.filter(project => 
//         project.eventDate >= now && 
//         project.eventDate <= thirtyDaysFromNow &&
//         project.status === ProjectStatus.ACTIVE
//       ).sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
//     } catch (error) {
//       console.error('EyeDooApp: Get upcoming projects error:', error);
//       throw new Error('Failed to load upcoming projects. Please try again.');
//     }
//   }

//   // Private cache management methods
//   private static async getCachedProjects(userId: string): Promise<Project[] | null> {
//     try {
//       const cacheKey = `${this.CACHE_KEY}_${userId}`;
//       const cachedData = await AsyncStorage.getItem(cacheKey);
      
//       if (!cachedData) return null;
      
//       const { projects, timestamp } = JSON.parse(cachedData);
//       const now = Date.now();
      
//       // Check if cache is expired
//       if (now - timestamp > this.CACHE_EXPIRY) {
//         await AsyncStorage.removeItem(cacheKey);
//         return null;
//       }
      
//       // Convert date strings back to Date objects
//       return projects.map((project: any) => ({
//         ...project,
//         eventDate: new Date(project.eventDate),
//         createdAt: new Date(project.createdAt),
//         updatedAt: new Date(project.updatedAt),
//       }));
//     } catch (error) {
//       console.error('EyeDooApp: Get cached projects error:', error);
//       return null;
//     }
//   }

//   private static async cacheProjects(userId: string, projects: Project[]): Promise<void> {
//     try {
//       const cacheKey = `${this.CACHE_KEY}_${userId}`;
//       const cacheData = {
//         projects,
//         timestamp: Date.now(),
//       };
      
//       await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
//     } catch (error) {
//       console.error('EyeDooApp: Cache projects error:', error);
//       // Don't throw error for cache failures
//     }
//   }

//   private static async clearCache(): Promise<void> {
//     try {
//       const keys = await AsyncStorage.getAllKeys();
//       const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY));
//       await AsyncStorage.multiRemove(cacheKeys);
//     } catch (error) {
//       console.error('EyeDooApp: Clear cache error:', error);
//       // Don't throw error for cache failures
//     }
//   }
// }