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
  where
} from 'firebase/firestore';
import { z } from 'zod';
import {
  CreateProjectInput,
  CreateProjectSchema,
  Project,
  ProjectSchema,
  UpdateProjectInput,
  UpdateProjectSchema
} from '../types/project';
import { db } from './firebase';
import { convertTimestampFields } from './utils/timestampHelpers';

export class ProjectService {
  private static readonly COLLECTION_NAME = 'projects';

  /**
   * Helper to parse data against a Zod schema and log detailed errors.
   */
  private static parseData<T extends z.ZodType<any, any>>(schema: T, data: unknown): z.infer<T> {
    console.log('projectServices.parseData: Parsing data:', data); 
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('projectServices.parseData.error: Zod validation error:', JSON.stringify(result.error.flatten(), null, 2));
      throw new Error('Data validation failed.');
    }
    return result.data;
  }

  /**
   * Converts Firestore timestamps in project data
   */
  private static convertProjectTimestamps(projectData: any): Project {
    console.log('projectServices.convertProjectTimestamps:', projectData);
    // Convert top-level timestamps
    const converted = convertTimestampFields(projectData, ['createdAt', 'updatedAt']);
    
    // Convert nested form1.eventDate timestamp if it exists
    if (converted.form1?.eventDate) {
      converted.form1 = convertTimestampFields(converted.form1, ['eventDate']);
    }
    
    return converted as Project;
  }

  /**
   * Creates a new project document in Firestore.
   */
  static async createProject(userId: string, projectInput: CreateProjectInput): Promise<Project> {
    console.log('projectServices.createProject:', projectInput);
    try {
      // Validate the incoming data against the creation schema.
      const validatedData = this.parseData(CreateProjectSchema, projectInput);

      const projectRef = collection(db, this.COLLECTION_NAME);

      // Add server-generated timestamps and userId.
      const projectToSave = {
        ...validatedData,
        userId,
        form1: {
          ...validatedData.form1,
          eventDate: validatedData.form1.eventDate,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(projectRef, projectToSave);
      const createdDocSnapshot = await getDoc(docRef);

      // Parse and convert timestamps in the final document from Firestore
      const rawData = {
        id: createdDocSnapshot.id,
        ...createdDocSnapshot.data(),
      };
      
      const finalProject = this.parseData(ProjectSchema, this.convertProjectTimestamps(rawData));
      
      console.log('EyeDooApp: Project created successfully:', finalProject.id);
      return finalProject;
    } catch (error) {
      console.error('projectServices.createProject.error: Create project error:', error);
      throw new Error('Failed to create project.');
    }
  }

  /**
   * Get a specific project by ID.
   */
  static async getProject(projectId: string): Promise<Project | null> {
    console.log('projectServices.getProject:', projectId);
    try {
      const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        return null;
      }

      // Parse the raw Firestore data and convert timestamps
      const rawData = {
        id: projectDoc.id,
        ...projectDoc.data(),
      };
      
      const project = this.parseData(ProjectSchema, this.convertProjectTimestamps(rawData));

      // console.log('EyeDooApp: Project retrieved successfully:', projectId);
      return project;
    } catch (error) {
      console.error(`projectServices.getProject.error: Get project error for ID ${projectId}:`, error);
      throw new Error('Failed to load project.');
    }
  }

  /**
   * Get all projects for a user.
   */
  static async getUserProjects(userId: string): Promise<Project[]> {
    console.log('projectServices.getUserProjects:', userId);
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      const projects = querySnapshot.docs.map(doc => {
        try {
          const rawData = { id: doc.id, ...doc.data() };
          return this.parseData(ProjectSchema, rawData);
        } catch (error) {
          console.error(`EyeDooApp: Failed to parse project ${doc.id}:`, error);
          return null;
        }
      }).filter((p): p is Project => p !== null);

      console.log(`EyeDooApp: Loaded ${projects.length} projects for user ${userId}`);
      return projects;
    } catch (error) {
      console.error('projectServices.getUserProjects.error: Get user projects error:', error);
      throw new Error('Failed to load projects.');
    }
  }

  /**
   * Subscribes to real-time updates for all projects belonging to a user.
   */
  static subscribeToUserProjects(
    userId: string,
    callback: (projects: Project[]) => void
  ): () => void {
    console.log('projectServices.subscribeToUserProjects:', userId);
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('form1.eventDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('projectServices.subscribeToUserProjects.unsubscribe:', querySnapshot.docs.length);
      const projects = querySnapshot.docs.map(doc => {
        try {
          // Parse each document and convert timestamps
          const rawData = { id: doc.id, ...doc.data() };
          return this.parseData(ProjectSchema, rawData);
        } catch (error) {
          console.error(`projectServices.subscribeToUserProjects.unsubscribe.error: Failed to parse project ${doc.id}:`, error);
          return null;
        }
      }).filter((p): p is Project => p !== null); // Filter out any that failed parsing

      callback(projects);
    }, (error) => {
      console.error('projectServices.subscribeToUserProjects.unsubscribe.error:', error);
      callback([]); // Return empty array on error
    });

    return unsubscribe;
  }
  
  /**
   * Updates an existing project.
   */
  static async updateProject(projectId: string, updates: UpdateProjectInput): Promise<void> {
    console.log('projectServices.updateProject:', projectId, 'with updates:', updates);
    try {
      const validatedUpdates = this.parseData(UpdateProjectSchema, updates);

      if (Object.keys(validatedUpdates).length === 0) {
        console.warn("projectServices.updateProject.warning: Update called with no data to change.");
        return;
      }

      const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      await updateDoc(projectRef, {
        ...validatedUpdates,
        updatedAt: serverTimestamp(),
      });
      console.log('projectServices.updateProject.success:', projectId);
    } catch (error) {
      console.error(`projectServices.updateProject.error: Update project error for ID ${projectId}:`, error);
      throw new Error('Failed to update project.');
    }
  }

  /**
   * Deletes a project from Firestore.
   */
  static async deleteProject(projectId: string): Promise<void> {
    console.log('projectServices.deleteProject:', projectId);
    try {
      const projectRef = doc(db, this.COLLECTION_NAME, projectId);
      await deleteDoc(projectRef);
      console.log('projectServices.deleteProject.success:', projectId);
    } catch (error) {
      console.error(`EyeDooApp: Delete project error for ID ${projectId}:`, error);
      throw new Error('Failed to delete project.');
    }
  }
}
  