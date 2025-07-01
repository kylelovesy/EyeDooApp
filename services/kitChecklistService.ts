/*-------------------------------------*/
// services/kitChecklistService.ts
// Status: Updated
// What it does: 
// Manages the project-specific packing list (a subcollection).
// Its primary roles are to create the list from a master copy and update item packed status.
/*-------------------------------------*/

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { TKitChecklistItem } from '../types/kitChecklist';
import { db } from './firebase';

// Extended type to include Firestore document ID
export type TKitChecklistItemWithFirestoreId = TKitChecklistItem & { firestoreDocId: string };
  
export class KitChecklistService {
  /**
   * Gets a reference to the 'packingList' subcollection for a specific project.
   */
  private static getPackingListRef(projectId: string) {
    return collection(db, 'projects', projectId, 'packingList');
  }

  /**
   * Fetches the packing list for a given project.
   * @param projectId - The ID of the project.
   * @returns A promise that resolves to an array of packing list items with Firestore doc IDs.
   */
  static async getProjectPackingList(projectId: string): Promise<TKitChecklistItemWithFirestoreId[]> {
    try {
      console.log('kitChecklistService: Fetching packing list for project:', projectId);
      const snapshot = await getDocs(this.getPackingListRef(projectId));
      if (snapshot.empty) {
        console.log('kitChecklistService: No packing list found for project:', projectId);
        return [];
      }
      
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreDocId: doc.id, // Attach Firestore document ID
      } as TKitChecklistItemWithFirestoreId));
      
      console.log('kitChecklistService: Successfully fetched', items.length, 'items');
      return items;
    } catch (error) {
      console.error('kitChecklistService: Error fetching project packing list:', error);
      throw new Error(`Failed to fetch packing list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates the project's packing list by copying the user's master kit.
   * This is a "write-once" operation for a project.
   * @param projectId - The ID of the project to create the list for.
   * @param masterKitList - The user's master kit list to copy from.
   */
  static async createPackingListFromMaster(projectId: string, masterKitList: TKitChecklistItem[]): Promise<void> {
    try {
      console.log('kitChecklistService: Creating packing list from master for project:', projectId);
      const packingListRef = this.getPackingListRef(projectId);
      const batch = writeBatch(db);

      masterKitList.forEach(item => {
        const newDocRef = doc(packingListRef);
        // Ensure the 'packed' status is reset to false for the new project list
        const projectItem = { ...item, packed: false };
        batch.set(newDocRef, projectItem);
      });

      await batch.commit();
      console.log('kitChecklistService: Successfully created packing list with', masterKitList.length, 'items');
    } catch (error) {
      console.error('kitChecklistService: Error creating packing list from master:', error);
      throw new Error(`Failed to create packing list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates an item in a project's packing list using the Firestore document ID.
   * @param projectId - The ID of the project.
   * @param firestoreDocId - The Firestore document ID of the item to update.
   * @param updates - An object with the fields to update (typically `{ packed: boolean }`).
   */
  static async updatePackingListItem(projectId: string, firestoreDocId: string, updates: Partial<TKitChecklistItem>): Promise<void> {
    try {
      console.log('kitChecklistService: Updating item:', firestoreDocId, 'in project:', projectId, 'with updates:', updates);
      const docRef = doc(db, 'projects', projectId, 'packingList', firestoreDocId);
      await updateDoc(docRef, updates);
      console.log('kitChecklistService: Successfully updated item:', firestoreDocId);
    } catch (error) {
      console.error('kitChecklistService: Error updating packing list item:', error);
      throw new Error(`Failed to update packing list item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates an item in a project's packing list by finding it using the custom ID field.
   * Use this when you only have the custom ID, not the Firestore document ID.
   * @param projectId - The ID of the project.
   * @param customId - The custom ID field of the item to update.
   * @param updates - An object with the fields to update (typically `{ packed: boolean }`).
   */
  static async updatePackingListItemByCustomId(projectId: string, customId: string, updates: Partial<TKitChecklistItem>): Promise<void> {
    try {
      console.log('kitChecklistService: Updating item by custom ID:', customId, 'in project:', projectId, 'with updates:', updates);
      const q = query(this.getPackingListRef(projectId), where('id', '==', customId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Packing list item with custom ID ${customId} not found in project ${projectId}`);
      }
      
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, updates);
      console.log('kitChecklistService: Successfully updated item by custom ID:', customId);
    } catch (error) {
      console.error('kitChecklistService: Error updating packing list item by custom ID:', error);
      throw new Error(`Failed to update packing list item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
  
/*-------------------------------------*/
// services/kitChecklistService.ts
// Status: Complete
// What it does: 
// Provides a clean, abstracted API for all Firestore CRUD operations related to the kit checklist.
// It manages the 'kitChecklist' subcollection for any given project.
/*-------------------------------------*/

// import {
//     addDoc,
//     collection,
//     deleteDoc,
//     doc,
//     getDocs,
//     query,
//     updateDoc,
//     where,
//     writeBatch
// } from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
// import { KitItem, PHOTOGRAPHY_PACKING_LIST } from '../constants/kitChecklistTypes';
// import { TKitChecklistItem } from '../types/kitChecklist';
// import { db } from './firebase'; // Assuming your firebase config is exported from here
  
// export class KitChecklistService {
//     private static getChecklistRef(projectId: string) {
//       return collection(db, 'projects', projectId, 'kitChecklist');
//     }

//      // GET all checklist items for a project
//      static async getChecklist(projectId: string): Promise<TKitChecklistItem[]> {
//         const snapshot = await getDocs(this.getChecklistRef(projectId));
//         return snapshot.docs.map(doc => doc.data() as TKitChecklistItem);
//       }

//     // SEED the default checklist
//     static async seedDefaultChecklist(projectId: string): Promise<TKitChecklistItem[]> {
//         const checklistRef = this.getChecklistRef(projectId);
//         const existingItemsSnapshot = await getDocs(checklistRef);

//         if (!existingItemsSnapshot.empty) {
//             return existingItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TKitChecklistItem));
//         }
        
//         const batch = writeBatch(db);
//         const seededItems: TKitChecklistItem[] = [];

//         PHOTOGRAPHY_PACKING_LIST.forEach(category => {
//             category.items.forEach((item: KitItem) => {
//                 const newDocRef = doc(checklistRef);
//                 const newItem: TKitChecklistItem = {
//                     id: uuidv4(), // Use custom UUID
//                     name: item.name,
//                     category: category.type,
//                     packed: false,
//                     quantity: item.quantity,
//                     notes: item.notes || undefined, // Only include if it has a value
//                 };
                
//                 // Remove undefined fields before writing to Firestore
//                 const itemToWrite = { ...newItem };
//                 if (itemToWrite.notes === undefined) {
//                     delete itemToWrite.notes;
//                 }
//                 if (itemToWrite.quantity === undefined) {
//                     delete itemToWrite.quantity;
//                 }
                
//                 batch.set(newDocRef, itemToWrite);
//                 seededItems.push({ ...newItem, id: newDocRef.id }); // Use Firestore doc ID for updates
//             });
//         });

//         await batch.commit();
//         return seededItems;
//     }

//       // ADD a new item
//       static async addChecklistItem(projectId: string, item: TKitChecklistItem): Promise<void> {
//         await addDoc(this.getChecklistRef(projectId), item);
//       }

//       // UPDATE an item (e.g., to mark it as packed)
//       static async updateChecklistItem(projectId: string, itemId: string, updates: Partial<TKitChecklistItem>): Promise<void> {
//         // Query to find the document with the matching custom 'id' field
//         const q = query(this.getChecklistRef(projectId), where('id', '==', itemId));
//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//             const docToUpdateRef = querySnapshot.docs[0].ref;
//             await updateDoc(docToUpdateRef, updates);
//         } else {
//             throw new Error(`Checklist item with ID ${itemId} not found.`);
//         }
//       }

//       // DELETE an item
//       static async deleteChecklistItem(projectId: string, firestoreDocId: string): Promise<void> {
//         const docRef = doc(db, 'projects', projectId, 'kitChecklist', firestoreDocId);
//         await deleteDoc(docRef);
//     }

// }  

