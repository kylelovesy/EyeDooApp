import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';
import { Project } from '../types/project';
import { form4PhotosSchema } from '../types/project-PhotosSchema';
import { CombinedEventsTimelineSchema } from '../types/timeline';
import { db } from './firebase'; // Adjust path to your Firebase config

// Define the structure for import data
interface ImportData {
  timeline?: z.infer<typeof CombinedEventsTimelineSchema>['events'];
  groupShots?: z.infer<typeof form4PhotosSchema>['groupShots'];
  coupleShots?: z.infer<typeof form4PhotosSchema>['coupleShots'];
  candidShots?: z.infer<typeof form4PhotosSchema>['candidShots'];
  photoRequests?: z.infer<typeof form4PhotosSchema>['photoRequests'];
  mustHaveMoments?: z.infer<typeof form4PhotosSchema>['mustHaveMoments'];
  sentimentalMoments?: z.infer<typeof form4PhotosSchema>['sentimentalMoments'];
}

// Define the update payload structure
interface ProjectUpdatePayload {
  timeline?: Partial<z.infer<typeof CombinedEventsTimelineSchema>>;
  form4?: Partial<z.infer<typeof form4PhotosSchema>>;
  updatedAt?: Date;
}

/**
 * Service class for handling data import operations with Firestore
 */
export class DataImportService {
  /**
   * Import data into a specific project
   * @param projectId - The ID of the project to update
   * @param importData - The validated import data
   * @param mergeStrategy - How to handle existing data ('replace' or 'merge')
   * @returns Promise<void>
   */
  static async importDataToProject(
    projectId: string,
    importData: ImportData,
    mergeStrategy: 'replace' | 'merge' = 'replace'
  ): Promise<void> {
    try {
      // First, get the current project data
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const currentProject = projectSnap.data() as Project;
      const updatePayload: ProjectUpdatePayload = {
        updatedAt: new Date(),
      };

      // Handle timeline data import
      if (importData.timeline && importData.timeline.length > 0) {
        if (mergeStrategy === 'replace') {
          // Replace existing timeline events
          updatePayload.timeline = {
            events: importData.timeline,
          };
        } else {
          // Merge with existing timeline events
          const existingEvents = currentProject.timeline?.events || [];
          const mergedEvents = [...existingEvents, ...importData.timeline];
          
          // Remove duplicates based on a combination of time and description
          const uniqueEvents = mergedEvents.filter((event, index, self) =>
            index === self.findIndex(e => 
              e.time === event.time && e.description === event.description
            )
          );

          updatePayload.timeline = {
            events: uniqueEvents,
          };
        }
      }

      // Handle photo data import
      const hasPhotoData = 
        (importData.groupShots && importData.groupShots.length > 0) ||
        (importData.coupleShots && importData.coupleShots.length > 0) ||
        (importData.candidShots && importData.candidShots.length > 0) ||
        (importData.photoRequests && importData.photoRequests.length > 0) ||
        (importData.mustHaveMoments && importData.mustHaveMoments.length > 0) ||
        (importData.sentimentalMoments && importData.sentimentalMoments.length > 0);

      if (hasPhotoData) {
        const currentForm4 = currentProject.form4 || {};

        if (mergeStrategy === 'replace') {
          // Replace existing photo data with imported data
          updatePayload.form4 = {
            groupShots: importData.groupShots || [],
            coupleShots: importData.coupleShots || [],
            candidShots: importData.candidShots || [],
            photoRequests: importData.photoRequests || [],
            mustHaveMoments: importData.mustHaveMoments || [],
            sentimentalMoments: importData.sentimentalMoments || [],
          };
        } else {
          // Merge with existing photo data
          updatePayload.form4 = {
            groupShots: this.mergePhotoArrays(currentForm4.groupShots || [], importData.groupShots || []),
            coupleShots: this.mergePhotoArrays(currentForm4.coupleShots || [], importData.coupleShots || []),
            candidShots: this.mergePhotoArrays(currentForm4.candidShots || [], importData.candidShots || []),
            photoRequests: this.mergePhotoArrays(currentForm4.photoRequests || [], importData.photoRequests || []),
            mustHaveMoments: this.mergePhotoArrays(currentForm4.mustHaveMoments || [], importData.mustHaveMoments || []),
            sentimentalMoments: this.mergePhotoArrays(currentForm4.sentimentalMoments || [], importData.sentimentalMoments || []),
          };
        }
      }

      // Validate the update payload before sending to Firestore
      if (updatePayload.timeline) {
        const timelineValidation = CombinedEventsTimelineSchema.safeParse(updatePayload.timeline);
        if (!timelineValidation.success) {
          throw new Error(`Timeline data validation failed: ${timelineValidation.error.message}`);
        }
      }

      if (updatePayload.form4) {
        const photosValidation = form4PhotosSchema.safeParse(updatePayload.form4);
        if (!photosValidation.success) {
          throw new Error(`Photos data validation failed: ${photosValidation.error.message}`);
        }
      }

      // Update the project in Firestore
      await updateDoc(projectRef, updatePayload as any);

      console.log(`Successfully imported data to project ${projectId}`);
    } catch (error) {
      console.error('Error importing data to project:', error);
      throw error;
    }
  }

  /**
   * Merge two arrays of photo objects, removing duplicates based on content similarity
   * @param existing - Existing array of photo objects
   * @param imported - Imported array of photo objects
   * @returns Merged array with duplicates removed
   */
  private static mergePhotoArrays<T extends { id?: string; [key: string]: any }>(
    existing: T[],
    imported: T[]
  ): T[] {
    const merged = [...existing, ...imported];
    
    // Remove duplicates based on content similarity (excluding id field)
    const unique = merged.filter((item, index, self) => {
      return index === self.findIndex(other => {
        // Compare all fields except id
        const itemWithoutId = { ...item };
        delete itemWithoutId.id;
        const otherWithoutId = { ...other };
        delete otherWithoutId.id;
        
        return JSON.stringify(itemWithoutId) === JSON.stringify(otherWithoutId);
      });
    });

    return unique;
  }

  /**
   * Validate imported data against schemas before processing
   * @param importData - The data to validate
   * @returns Validation result with any errors
   */
  static validateImportData(importData: ImportData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate timeline data
    if (importData.timeline) {
      try {
        CombinedEventsTimelineSchema.parse({ events: importData.timeline });
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(`Timeline validation error: ${error.message}`);
        }
      }
    }

    // Validate photo data
    const photoData = {
      groupShots: importData.groupShots || [],
      coupleShots: importData.coupleShots || [],
      candidShots: importData.candidShots || [],
      photoRequests: importData.photoRequests || [],
      mustHaveMoments: importData.mustHaveMoments || [],
      sentimentalMoments: importData.sentimentalMoments || [],
    };

    try {
      form4PhotosSchema.parse(photoData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Photos validation error: ${error.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get import statistics for a project
   * @param projectId - The ID of the project
   * @returns Statistics about the project's data
   */
  static async getProjectImportStats(projectId: string): Promise<{
    timelineEvents: number;
    groupShots: number;
    coupleShots: number;
    candidShots: number;
    photoRequests: number;
    mustHaveMoments: number;
    sentimentalMoments: number;
    totalItems: number;
  }> {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const project = projectSnap.data() as Project;
      
      const stats = {
        timelineEvents: project.timeline?.events?.length || 0,
        groupShots: project.form4?.groupShots?.length || 0,
        coupleShots: project.form4?.coupleShots?.length || 0,
        candidShots: project.form4?.candidShots?.length || 0,
        photoRequests: project.form4?.photoRequests?.length || 0,
        mustHaveMoments: project.form4?.mustHaveMoments?.length || 0,
        sentimentalMoments: project.form4?.sentimentalMoments?.length || 0,
        totalItems: 0,
      };

      stats.totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0) - stats.totalItems; // Subtract totalItems to avoid double counting

      return stats;
    } catch (error) {
      console.error('Error getting project import stats:', error);
      throw error;
    }
  }

  /**
   * Backup project data before import (optional safety feature)
   * @param projectId - The ID of the project to backup
   * @returns The backed up project data
   */
  static async backupProjectData(projectId: string): Promise<Project> {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const projectData = projectSnap.data() as Project;
      
      // You could save this to a separate collection or return it for local storage
      console.log(`Backed up project ${projectId} data`);
      
      return projectData;
    } catch (error) {
      console.error('Error backing up project data:', error);
      throw error;
    }
  }
}

