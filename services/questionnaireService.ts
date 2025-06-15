// ######################################################################
// # FILE: src/services/questionnaireService.ts
// ######################################################################

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { EssentialInfo, FinalTouches, PeopleAndRoles, PhotographyPlan, Questionnaire } from '../types/questionnaire';
import { db } from './firebase';

export class QuestionnaireService {
  private static readonly COLLECTION_NAME = 'questionnaires';

  /**
   * Retrieves the full questionnaire for a project.
   * @param projectId The ID of the project.
   * @returns The questionnaire data or null if not found.
   */
  static async getQuestionnaire(projectId: string): Promise<Questionnaire | null> {
    try {
      const questionnaireRef = doc(db, this.COLLECTION_NAME, projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore Timestamps back to JS Dates for essentialInfo
        if (data.essentialInfo && data.essentialInfo.weddingDate && data.essentialInfo.weddingDate instanceof Timestamp) {
          data.essentialInfo.weddingDate = data.essentialInfo.weddingDate.toDate();
        }
        return { projectId: docSnap.id, ...data } as Questionnaire;
      }
      return null;
    } catch (error) {
      console.error('Error getting questionnaire:', error);
      throw new Error('Failed to load questionnaire data.');
    }
  }

  /**
   * Saves or updates a section of the questionnaire for a project.
   * This is a generic private method to handle saving any part of the questionnaire.
   * @param projectId The ID of the project.
   * @param data The partial questionnaire data to save.
   */
  private static async saveSection(projectId: string, data: Partial<Questionnaire>): Promise<void> {
    try {
        const questionnaireRef = doc(db, this.COLLECTION_NAME, projectId);
        
        // Firestore cannot store `undefined` values.
        // We also need to convert Date objects to Firestore Timestamps.
        const dataToSave = { ...data };
        if (dataToSave.essentialInfo?.weddingDate) {
            dataToSave.essentialInfo = {
                ...dataToSave.essentialInfo,
                weddingDate: Timestamp.fromDate(dataToSave.essentialInfo.weddingDate)
            };
        }

        // Using set with merge:true will create the document if it doesn't exist,
        // or update it if it does, without overwriting existing fields.
        await setDoc(questionnaireRef, dataToSave, { merge: true });
        console.log(`Questionnaire section saved for project: ${projectId}`);
    } catch (error) {
        console.error('Error saving questionnaire section:', error);
        throw new Error('Failed to save questionnaire data.');
    }
  }

  /**
   * Saves or updates the essential information for a project's questionnaire.
   */
  static async saveEssentialInfo(projectId: string, essentialInfo: EssentialInfo): Promise<void> {
    return this.saveSection(projectId, { essentialInfo });
  }

  /**
   * Saves or updates the people and roles for a project's questionnaire.
   */
  static async savePeopleAndRoles(projectId: string, peopleAndRoles: PeopleAndRoles): Promise<void> {
    return this.saveSection(projectId, { peopleAndRoles });
  }

  /**
   * Saves or updates the photography plan for a project's questionnaire.
   */
  static async savePhotographyPlan(projectId: string, photographyPlan: PhotographyPlan): Promise<void> {
    return this.saveSection(projectId, { photographyPlan });
  }

  /**
   * Saves or updates the final touches for a project's questionnaire.
   */
  static async saveFinalTouches(projectId: string, finalTouches: FinalTouches): Promise<void> {
    return this.saveSection(projectId, { finalTouches });
  }
}



// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { EssentialInfo, KeyPerson, PhotographyPlan, Questionnaire, TimelineEvent } from '../types/questionnaire';
// import { db } from './firebase';

// export class QuestionnaireService {
//   /**
//    * Saves or updates the essential information for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @param essentialInfo The essential information data.
//    */
//   static async saveEssentialInfo(projectId: string, essentialInfo: EssentialInfo): Promise<void> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       await setDoc(questionnaireRef, { essentialInfo }, { merge: true });
//       console.log('Essential info saved successfully for project:', projectId);
//     } catch (error) {
//       console.error('Error saving essential info:', error);
//       throw error;
//     }
//   }

//   /**
//    * Retrieves the essential information for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @returns The essential information data or null if not found.
//    */
//   static async getEssentialInfo(projectId: string): Promise<EssentialInfo | null> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       const docSnap = await getDoc(questionnaireRef);
//       if (docSnap.exists()) {
//         return docSnap.data().essentialInfo as EssentialInfo;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting essential info:', error);
//       throw error;
//     }
//   }

//   /**
//    * Retrieves the full questionnaire for a project.
//    * @param projectId The ID of the project.
//    * @returns The questionnaire data or null if not found.
//    */
//   static async getQuestionnaire(projectId: string): Promise<Questionnaire | null> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       const docSnap = await getDoc(questionnaireRef);
//       if (docSnap.exists()) {
//         return { projectId: docSnap.id, ...docSnap.data() } as Questionnaire;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting questionnaire:', error);
//       throw error;
//     }
//   }

//   /**
//    * Updates a specific field within the questionnaire.
//    * @param projectId The ID of the project.
//    * @param fieldPath The dot-separated path to the field to update (e.g., 'essentialInfo.weddingDate').
//    * @param value The new value for the field.
//    */
//   static async updateQuestionnaireField(projectId: string, fieldPath: string, value: any): Promise<void> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       await updateDoc(questionnaireRef, { [fieldPath]: value });
//       console.log(`Field ${fieldPath} updated successfully for project:`, projectId);
//     } catch (error) {
//       console.error(`Error updating field ${fieldPath}:`, error);
//       throw error;
//     }
//   }

//    /**
//    * Saves or updates timeline events for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @param timelineEvents An array of timeline event data.
//    */
//    static async saveTimelineEvents(projectId: string, timelineEvents: TimelineEvent[]): Promise<void> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       await updateDoc(questionnaireRef, { timeline: timelineEvents });
//       console.log('Timeline events saved successfully for project:', projectId);
//     } catch (error) {
//       console.error('Error saving timeline events:', error);
//       throw error;
//     }
//   }

//   /**
//    * Retrieves timeline events for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @returns An array of timeline event data or an empty array if not found.
//    */
//   static async getTimelineEvents(projectId: string): Promise<TimelineEvent[]> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       const docSnap = await getDoc(questionnaireRef);
//       if (docSnap.exists()) {
//         return (docSnap.data().timeline || []) as TimelineEvent[];
//       }
//       return [];
//     } catch (error) {
//       console.error('Error getting timeline events:', error);
//       throw error;
//     }
//   }

//   /**
//    * Saves or updates key people for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @param keyPeople An array of key person data.
//    */
//   static async saveKeyPeople(projectId: string, keyPeople: KeyPerson[]): Promise<void> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       await updateDoc(questionnaireRef, { keyPeople: keyPeople });
//       console.log('Key people saved successfully for project:', projectId);
//     } catch (error) {
//       console.error('Error saving key people:', error);
//       throw error;
//     }
//   }

//   /**
//    * Retrieves key people for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @returns An array of key person data or an empty array if not found.
//    */
//   static async getKeyPeople(projectId: string): Promise<KeyPerson[]> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       const docSnap = await getDoc(questionnaireRef);
//       if (docSnap.exists()) {
//         return (docSnap.data().keyPeople || []) as KeyPerson[];
//       }
//       return [];
//     } catch (error) {
//       console.error('Error getting key people:', error);
//       throw error;
//     }
//   }

//   /**
//    * Saves or updates photography plan for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @param photographyPlan The photography plan data.
//    */
//   static async savePhotographyPlan(projectId: string, photographyPlan: PhotographyPlan): Promise<void> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       await updateDoc(questionnaireRef, { photographyPlan: photographyPlan });
//       console.log('Photography plan saved successfully for project:', projectId);
//     } catch (error) {
//       console.error('Error saving photography plan:', error);
//       throw error;
//     }
//   }

//   /**
//    * Retrieves photography plan for a project's questionnaire.
//    * @param projectId The ID of the project.
//    * @returns The photography plan data or null if not found.
//    */
//   static async getPhotographyPlan(projectId: string): Promise<PhotographyPlan | null> {
//     try {
//       const questionnaireRef = doc(db, 'questionnaires', projectId);
//       const docSnap = await getDoc(questionnaireRef);
//       if (docSnap.exists()) {
//         return docSnap.data().photographyPlan as PhotographyPlan;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting photography plan:', error);
//       throw error;
//     }
//   }
// }

// // import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
// // import { db } from './firebase';
// // import { Questionnaire, EssentialInfo } from '../types/questionnaire';

// // export class QuestionnaireService {
// //   /**
// //    * Saves or updates the essential information for a project's questionnaire.
// //    * @param projectId The ID of the project.
// //    * @param essentialInfo The essential information data.
// //    */
// //   static async saveEssentialInfo(projectId: string, essentialInfo: EssentialInfo): Promise<void> {
// //     try {
// //       const questionnaireRef = doc(db, 'questionnaires', projectId);
// //       await setDoc(questionnaireRef, { essentialInfo }, { merge: true });
// //       console.log('Essential info saved successfully for project:', projectId);
// //     } catch (error) {
// //       console.error('Error saving essential info:', error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Retrieves the essential information for a project's questionnaire.
// //    * @param projectId The ID of the project.
// //    * @returns The essential information data or null if not found.
// //    */
// //   static async getEssentialInfo(projectId: string): Promise<EssentialInfo | null> {
// //     try {
// //       const questionnaireRef = doc(db, 'questionnaires', projectId);
// //       const docSnap = await getDoc(questionnaireRef);
// //       if (docSnap.exists()) {
// //         return docSnap.data().essentialInfo as EssentialInfo;
// //       }
// //       return null;
// //     } catch (error) {
// //       console.error('Error getting essential info:', error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Retrieves the full questionnaire for a project.
// //    * @param projectId The ID of the project.
// //    * @returns The questionnaire data or null if not found.
// //    */
// //   static async getQuestionnaire(projectId: string): Promise<Questionnaire | null> {
// //     try {
// //       const questionnaireRef = doc(db, 'questionnaires', projectId);
// //       const docSnap = await getDoc(questionnaireRef);
// //       if (docSnap.exists()) {
// //         return { id: docSnap.id, ...docSnap.data() } as Questionnaire;
// //       }
// //       return null;
// //     } catch (error) {
// //       console.error('Error getting questionnaire:', error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Updates a specific field within the questionnaire.
// //    * @param projectId The ID of the project.
// //    * @param fieldPath The dot-separated path to the field to update (e.g., 'essentialInfo.weddingDate').
// //    * @param value The new value for the field.
// //    */
// //   static async updateQuestionnaireField(projectId: string, fieldPath: string, value: any): Promise<void> {
// //     try {
// //       const questionnaireRef = doc(db, 'questionnaires', projectId);
// //       await updateDoc(questionnaireRef, { [fieldPath]: value });
// //       console.log(`Field ${fieldPath} updated successfully for project:`, projectId);
// //     } catch (error) {
// //       console.error(`Error updating field ${fieldPath}:`, error);
// //       throw error;
// //     }
// //   }
// // }