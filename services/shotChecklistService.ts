import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShotChecklist, ShotItem } from '../types/shotlist';
import { db } from './firebase';

export class ShotChecklistService {
  /**
   * Saves or updates the shot checklist for a project.
   * @param projectId The ID of the project.
   * @param items An array of shot items.
   */
  static async saveShotChecklist(projectId: string, items: ShotItem[]): Promise<void> {
    try {
      const checklistRef = doc(db, 'shotChecklists', projectId);
      await setDoc(checklistRef, { projectId, items }, { merge: true });
      console.log('Shot checklist saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving shot checklist:', error);
      throw error;
    }
  }

  /**
   * Retrieves the shot checklist for a project.
   * @param projectId The ID of the project.
   * @returns The shot checklist data or null if not found.
   */
  static async getShotChecklist(projectId: string): Promise<ShotChecklist | null> {
    try {
      const checklistRef = doc(db, 'shotChecklists', projectId);
      const docSnap = await getDoc(checklistRef);
      if (docSnap.exists()) {
        return docSnap.data() as ShotChecklist;
      }
      return null;
    } catch (error) {
      console.error('Error getting shot checklist:', error);
      throw error;
    }
  }

  /**
   * Updates a specific shot item within the checklist.
   * @param projectId The ID of the project.
   * @param shotItem The shot item to update.
   */
  static async updateShotItem(projectId: string, shotItem: ShotItem): Promise<void> {
    try {
      const checklist = await this.getShotChecklist(projectId);
      if (!checklist) {
        throw new Error('Shot checklist not found for project.');
      }
      const updatedItems = checklist.items.map(item =>
        item.id === shotItem.id ? shotItem : item
      );
      await this.saveShotChecklist(projectId, updatedItems);
      console.log('Shot item updated successfully:', shotItem.id);
    } catch (error) {
      console.error('Error updating shot item:', error);
      throw error;
    }
  }

  /**
   * Deletes a shot item from the checklist.
   * @param projectId The ID of the project.
   * @param shotItemId The ID of the shot item to delete.
   */
  static async deleteShotItem(projectId: string, shotItemId: string): Promise<void> {
    try {
      const checklist = await this.getShotChecklist(projectId);
      if (!checklist) {
        throw new Error('Shot checklist not found for project.');
      }
      const updatedItems = checklist.items.filter(item => item.id !== shotItemId);
      await this.saveShotChecklist(projectId, updatedItems);
      console.log('Shot item deleted successfully:', shotItemId);
    } catch (error) {
      console.error('Error deleting shot item:', error);
      throw error;
    }
  }
}