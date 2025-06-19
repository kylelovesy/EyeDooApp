import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { ShotChecklist, ShotItem } from '../types/shotlist';
import { db } from './firebase';
import {
  CommonSchemas,
  createServiceError,
  OPERATION_NAMES,
  SERVICE_NAMES,
  validateAndParse,
  validateServiceParams
} from './schemas';
import { convertTimestampFields } from './utils/timestampHelpers';

export class ShotChecklistService {
  /**
   * Saves or updates the shot checklist for a project.
   * @param projectId The ID of the project.
   * @param items An array of shot items.
   */
  static async saveShotChecklist(projectId: string, items: ShotItem[]): Promise<void> {
    try {
      // Validate inputs
      validateServiceParams(
        { projectId, items },
        ['projectId', 'items'],
        SERVICE_NAMES.SHOTS,
        'saveShotChecklist'
      );

      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'saveShotChecklist projectId'
      );

      // Validate items array
      if (!Array.isArray(items)) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          'saveShotChecklist',
          new Error('Items must be an array')
        );
      }

      const checklistRef = doc(db, 'shotChecklists', validatedProjectId);
      await setDoc(checklistRef, { 
        projectId: validatedProjectId, 
        items,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('EyeDooApp: Shot checklist saved successfully for project:', validatedProjectId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        'saveShotChecklist',
        error,
        'Failed to save shot checklist'
      );
    }
  }

  /**
   * Retrieves the shot checklist for a project.
   * @param projectId The ID of the project.
   * @returns The shot checklist data or null if not found.
   */
  static async getShotChecklist(projectId: string): Promise<ShotChecklist | null> {
    try {
      // Validate input
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'getShotChecklist projectId'
      );

      const checklistRef = doc(db, 'shotChecklists', validatedProjectId);
      const docSnap = await getDoc(checklistRef);
      
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        
        // Convert timestamps if they exist
        const convertedData = convertTimestampFields(rawData, ['updatedAt']);
        
        return convertedData as ShotChecklist;
      }
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        'getShotChecklist',
        error,
        'Failed to retrieve shot checklist'
      );
    }
  }

  /**
   * Adds a new shot item to the checklist.
   * @param projectId The ID of the project.
   * @param newShotItem The shot item to add.
   */
  static async addShotItem(projectId: string, newShotItem: Omit<ShotItem, 'id'>): Promise<string> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'addShotItem projectId'
      );

      // Validate shot item structure
      validateServiceParams(
        { newShotItem },
        ['newShotItem'],
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.CREATE_SHOT
      );

      const checklist = await this.getShotChecklist(validatedProjectId);
      const shotItemWithId: ShotItem = {
        ...newShotItem,
        id: `shot-${Date.now()}`
      };

      const updatedItems = checklist ? [...checklist.items, shotItemWithId] : [shotItemWithId];
      await this.saveShotChecklist(validatedProjectId, updatedItems);
      
      console.log('EyeDooApp: Shot item added successfully for project:', validatedProjectId);
      return shotItemWithId.id!; // Safe to use ! since we just set it
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.CREATE_SHOT,
        error,
        'Failed to add shot item'
      );
    }
  }

  /**
   * Updates a specific shot item within the checklist.
   * @param projectId The ID of the project.
   * @param shotItem The shot item to update.
   */
  static async updateShotItem(projectId: string, shotItem: ShotItem): Promise<void> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'updateShotItem projectId'
      );

      // Validate shot item structure
      validateServiceParams(
        { shotItem },
        ['shotItem'],
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.UPDATE_SHOT
      );

      if (!shotItem.id) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.UPDATE_SHOT,
          new Error('Shot item ID is required for update')
        );
      }

      const checklist = await this.getShotChecklist(validatedProjectId);
      if (!checklist) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.UPDATE_SHOT,
          new Error('Shot checklist not found for project')
        );
      }

      const itemExists = checklist.items.some(item => item.id === shotItem.id);
      if (!itemExists) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.UPDATE_SHOT,
          new Error(`Shot item with ID ${shotItem.id} not found`)
        );
      }

      const updatedItems = checklist.items.map(item =>
        item.id === shotItem.id ? shotItem : item
      );
      
      await this.saveShotChecklist(validatedProjectId, updatedItems);
      console.log('EyeDooApp: Shot item updated successfully:', shotItem.id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.UPDATE_SHOT,
        error,
        'Failed to update shot item'
      );
    }
  }

  /**
   * Deletes a shot item from the checklist.
   * @param projectId The ID of the project.
   * @param shotItemId The ID of the shot item to delete.
   */
  static async deleteShotItem(projectId: string, shotItemId: string): Promise<void> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'deleteShotItem projectId'
      );

      const validatedShotItemId = validateAndParse(
        z.string().min(1, 'Shot item ID cannot be empty'),
        shotItemId,
        'deleteShotItem shotItemId'
      );

      const checklist = await this.getShotChecklist(validatedProjectId);
      if (!checklist) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.DELETE_SHOT,
          new Error('Shot checklist not found for project')
        );
      }

      const itemExists = checklist.items.some(item => item.id === validatedShotItemId);
      if (!itemExists) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.DELETE_SHOT,
          new Error(`Shot item with ID ${validatedShotItemId} not found`)
        );
      }

      const updatedItems = checklist.items.filter(item => item.id !== validatedShotItemId);
      await this.saveShotChecklist(validatedProjectId, updatedItems);
      
      console.log('EyeDooApp: Shot item deleted successfully:', validatedShotItemId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.DELETE_SHOT,
        error,
        'Failed to delete shot item'
      );
    }
  }

  /**
   * Searches shot items within a project checklist.
   * @param projectId The ID of the project.
   * @param searchTerm The term to search for.
   * @returns Array of matching shot items.
   */
  static async searchShotItems(projectId: string, searchTerm: string): Promise<ShotItem[]> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'searchShotItems projectId'
      );

      if (!searchTerm || searchTerm.trim().length < 2) {
        throw createServiceError(
          SERVICE_NAMES.SHOTS,
          OPERATION_NAMES.SEARCH,
          new Error('Search term must be at least 2 characters long')
        );
      }

      const checklist = await this.getShotChecklist(validatedProjectId);
      if (!checklist) {
        return [];
      }

      const searchTermLower = searchTerm.toLowerCase().trim();
      const matchingItems = checklist.items.filter(item =>
        item.description.toLowerCase().includes(searchTermLower) ||
        (item.notes && item.notes.toLowerCase().includes(searchTermLower))
      );

      console.log(`EyeDooApp: Found ${matchingItems.length} shot items matching search term for project:`, validatedProjectId);
      return matchingItems;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        OPERATION_NAMES.SEARCH,
        error,
        'Failed to search shot items'
      );
    }
  }

  /**
   * Gets shot items by completion status.
   * @param projectId The ID of the project.
   * @param isCompleted Whether to get completed or uncompleted items.
   * @returns Array of shot items with the specified completion status.
   */
  static async getShotItemsByCompletion(projectId: string, isCompleted: boolean): Promise<ShotItem[]> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'getShotItemsByCompletion projectId'
      );

      const checklist = await this.getShotChecklist(validatedProjectId);
      if (!checklist) {
        return [];
      }

      const filteredItems = checklist.items.filter(item => 
        item.isCompleted === isCompleted
      );

      console.log(`EyeDooApp: Found ${filteredItems.length} ${isCompleted ? 'completed' : 'uncompleted'} shot items for project:`, validatedProjectId);
      return filteredItems;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.SHOTS,
        'getShotItemsByCompletion',
        error,
        'Failed to get shot items by completion status'
      );
    }
  }
}