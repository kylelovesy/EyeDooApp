import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming React Native for cache
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from '../../services/firebase'; // Assuming you have a Firebase config export
  
  // --- 1. Import your Zod schemas ---
  import {
    CombinedProjectCreateSchema,
    CombinedProjectReadSchema,
    CombinedProjectUpdateSchema,
} from './projectSchema';
  
  
  // --- 2. Infer your main types directly from the schemas ---
  type Project = z.infer<typeof CombinedProjectReadSchema>;
  type CreateProjectInput = z.infer<typeof CombinedProjectCreateSchema>;
  type UpdateProjectInput = z.infer<typeof CombinedProjectUpdateSchema>;
  
  export class ProjectService {
    private static readonly COLLECTION_NAME = 'projects';
    private static readonly CACHE_KEY = 'eyedooapp_projects_cache';
    private static readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  
    /**
     * Helper function to parse data and handle Zod errors
     */
    private static parseData<T extends z.ZodType<any, any>>(schema: T, data: unknown): z.infer<T> {
      try {
        return schema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Log the detailed validation error for easier debugging
          console.error('EyeDooApp: Zod validation error:', JSON.stringify(error.errors, null, 2));
          throw new Error('Data validation failed. The data does not match the expected structure.');
        }
        throw error; // Re-throw other errors
      }
    }
  
    /** * Create a new project with validation 
     */
    static async createProject(userId: string, projectInput: CreateProjectInput): Promise<Project> {
      try {
        // 1. Validate the incoming data. This replaces manual checks and default setting.
        const validatedData = this.parseData(CombinedProjectCreateSchema, projectInput);
        
        const projectRef = collection(db, this.COLLECTION_NAME);
        
        const newProjectDoc = {
          ...validatedData,
          userId,
          // These timestamps are added by the server
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
  
        const docRef = await addDoc(projectRef, newProjectDoc as any); // Use `any` to allow serverTimestamp
        
        // Get the created document to return the full object with server-generated values
        const createdDoc = await getDoc(docRef);
        
        // 2. Parse the final data from Firestore to ensure it's correct and fully typed
        const project = this.parseData(CombinedProjectReadSchema, {
          id: createdDoc.id,
          ...createdDoc.data(),
        });
        
        await this.clearCache();
        console.log('EyeDooApp: Project created successfully:', project.form1.id);
        return project;
  
      } catch (error) {
        console.error('EyeDooApp: Create project error:', error);
        throw new Error('Failed to create project. Please try again.');
      }
    }
  
    /** * Get a specific project by ID and validate its structure
     */
    static async getProject(projectId: string): Promise<Project | null> {
      try {
        const projectRef = doc(db, this.COLLECTION_NAME, projectId);
        const projectDoc = await getDoc(projectRef);
  
        if (!projectDoc.exists()) {
          return null;
        }
        
        // 1. Parse the raw Firestore data. This handles all type conversions (e.g., Timestamps).
        return this.parseData(CombinedProjectReadSchema, {
          id: projectDoc.id,
          ...projectDoc.data(),
        });
  
      } catch (error) {
        console.error(`EyeDooApp: Get project error for ID ${projectId}:`, error);
        throw new Error('Failed to load project. Please try again.');
      }
    }
  
    /** * Get all projects for a user with caching and validation
     */
    static async getUserProjects(userId: string, useCache: boolean = true): Promise<Project[]> {
      if (useCache) {
        const cachedProjects = await this.getCachedProjects(userId);
        if (cachedProjects) return cachedProjects;
      }
  
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
  
        const querySnapshot = await getDocs(q);
        
        // 1. Map and parse each document. This replaces the manual `forEach` loop.
        const projects = querySnapshot.docs.map(doc =>
          this.parseData(CombinedProjectReadSchema, { id: doc.id, ...doc.data() })
        );
  
        await this.cacheProjects(userId, projects);
  
        console.log(`EyeDooApp: Loaded ${projects.length} projects for user ${userId}`);
        return projects;
      } catch (error) {
        console.error('EyeDooApp: Get user projects error:', error);
        throw new Error('Failed to load projects. Please try again.');
      }
    }
  
    /** * Update an existing project with validation
     */
    static async updateProject(projectId: string, updates: UpdateProjectInput): Promise<void> {
      try {
        // 1. Validate the partial update data.
        const validatedUpdates = this.parseData(CombinedProjectUpdateSchema, updates);
  
        if (Object.keys(validatedUpdates).length === 0) {
          console.warn("EyeDooApp: Update called with no data to change.");
          return;
        }
        
        const projectRef = doc(db, this.COLLECTION_NAME, projectId);
        
        const updateData = {
          ...validatedUpdates,
          updatedAt: serverTimestamp(),
        };
        
        // Use `any` here because the Firebase SDK expects a specific type for nested updates,
        // but our data is guaranteed to be safe and valid by Zod.
        await updateDoc(projectRef, updateData as any);
        
        await this.clearCache();
        console.log('EyeDooApp: Project updated successfully:', projectId);
      } catch (error) {
        console.error('EyeDooApp: Update project error:', error);
        throw new Error('Failed to update project. Please try again.');
      }
    }
    
    /** * Subscribe to real-time project updates with validation
     */
    static subscribeToUserProjects(
      userId: string, 
      callback: (projects: Project[]) => void
    ): () => void {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
  
      return onSnapshot(q, (querySnapshot) => {
        try {
          // 1. Map and parse each document on every update.
          const projects = querySnapshot.docs.map(doc =>
            this.parseData(CombinedProjectReadSchema, { id: doc.id, ...doc.data() })
          );
          callback(projects);
        } catch (error) {
          console.error('EyeDooApp: Error parsing data in real-time subscription:', error);
          // Decide how to handle this - maybe call the callback with an empty array?
          callback([]); 
        }
      }, (error) => {
        console.error('EyeDooApp: Projects subscription error:', error);
      });
    }
  
    // --- Other methods like deleteProject, getProjectsByStatus would follow the same pattern ---
    // --- Caching methods can remain largely the same, but now they cache fully typed objects ---
  
    /** Delete a project */
    static async deleteProject(projectId: string): Promise<void> {
      try {
        await deleteDoc(doc(db, this.COLLECTION_NAME, projectId));
        await this.clearCache();
        console.log('EyeDooApp: Project deleted successfully:', projectId);
      } catch (error) {
        console.error('EyeDooApp: Delete project error:', error);
        throw new Error('Failed to delete project. Please try again.');
      }
    }
  
    // Caching methods can stay mostly the same, but now handle fully validated objects.
    private static async getCachedProjects(userId: string): Promise<Project[] | null> {
      // This implementation depends heavily on AsyncStorage and how you serialize Date objects.
      // The previous implementation is fine, but parsing with Zod on retrieval adds safety.
      try {
          const cacheKey = `${this.CACHE_KEY}_${userId}`;
          const cachedData = await AsyncStorage.getItem(cacheKey);
          if (!cachedData) return null;
  
          const { projects: rawProjects, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp > this.CACHE_EXPIRY) {
              await AsyncStorage.removeItem(cacheKey);
              return null;
          }
  
          // Re-validate cached data to be safe
          return rawProjects.map((p: unknown) => this.parseData(CombinedProjectReadSchema, p));
      } catch (error) {
          console.error('EyeDooApp: Get cached projects error:', error);
          return null;
      }
    }
  
    private static async cacheProjects(userId: string, projects: Project[]): Promise<void> {
      try {
        const cacheKey = `${this.CACHE_KEY}_${userId}`;
        const cacheData = {
          projects, // Already validated, safe to store
          timestamp: Date.now(),
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (error) {
        console.error('EyeDooApp: Cache projects error:', error);
      }
    }
  
    private static async clearCache(): Promise<void> {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY));
        await AsyncStorage.multiRemove(cacheKeys);
      } catch (error) {
        console.error('EyeDooApp: Clear cache error:', error);
      }
    }
  }
  