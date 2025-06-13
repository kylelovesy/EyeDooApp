import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { EssentialInfo, Questionnaire } from '../types/questionnaire';
import { db } from './firebase';

export class QuestionnaireService {
  /**
   * Saves or updates the essential information for a project's questionnaire.
   * @param projectId The ID of the project.
   * @param essentialInfo The essential information data.
   */
  static async saveEssentialInfo(projectId: string, essentialInfo: EssentialInfo): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await setDoc(questionnaireRef, { essentialInfo }, { merge: true });
      console.log('Essential info saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving essential info:', error);
      throw error;
    }
  }

  /**
   * Retrieves the essential information for a project's questionnaire.
   * @param projectId The ID of the project.
   * @returns The essential information data or null if not found.
   */
  static async getEssentialInfo(projectId: string): Promise<EssentialInfo | null> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return docSnap.data().essentialInfo as EssentialInfo;
      }
      return null;
    } catch (error) {
      console.error('Error getting essential info:', error);
      throw error;
    }
  }

  /**
   * Retrieves the full questionnaire for a project.
   * @param projectId The ID of the project.
   * @returns The questionnaire data or null if not found.
   */
  static async getQuestionnaire(projectId: string): Promise<Questionnaire | null> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Questionnaire;
      }
      return null;
    } catch (error) {
      console.error('Error getting questionnaire:', error);
      throw error;
    }
  }

  /**
   * Updates a specific field within the questionnaire.
   * @param projectId The ID of the project.
   * @param fieldPath The dot-separated path to the field to update (e.g., 'essentialInfo.weddingDate').
   * @param value The new value for the field.
   */
  static async updateQuestionnaireField(projectId: string, fieldPath: string, value: any): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await updateDoc(questionnaireRef, { [fieldPath]: value });
      console.log(`Field ${fieldPath} updated successfully for project:`, projectId);
    } catch (error) {
      console.error(`Error updating field ${fieldPath}:`, error);
      throw error;
    }
  }
}