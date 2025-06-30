/*-------------------------------------*/
// services/kitChecklistService.ts
// Status: Complete
// What it does: 
// Provides a clean, abstracted API for all Firestore CRUD operations related to the kit checklist.
// It manages the 'kitChecklist' subcollection for any given project.
/*-------------------------------------*/

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { KitItem, PHOTOGRAPHY_PACKING_LIST } from '../constants/kitChecklistTypes';
import { TKitChecklistItem } from '../types/kitChecklist';
import { db } from './firebase'; // Assuming your firebase config is exported from here
  
export class KitChecklistService {
    private static getChecklistRef(projectId: string) {
      return collection(db, 'projects', projectId, 'kitChecklist');
    }

     // GET all checklist items for a project
     static async getChecklist(projectId: string): Promise<TKitChecklistItem[]> {
        const snapshot = await getDocs(this.getChecklistRef(projectId));
        return snapshot.docs.map(doc => doc.data() as TKitChecklistItem);
      }

    // SEED the default checklist
    static async seedDefaultChecklist(projectId: string): Promise<TKitChecklistItem[]> {
        const checklistRef = this.getChecklistRef(projectId);
        const existingItemsSnapshot = await getDocs(checklistRef);

        if (!existingItemsSnapshot.empty) {
            return existingItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TKitChecklistItem));
        }
        
        const batch = writeBatch(db);
        const seededItems: TKitChecklistItem[] = [];

        PHOTOGRAPHY_PACKING_LIST.forEach(category => {
            category.items.forEach((item: KitItem) => {
                const newDocRef = doc(checklistRef);
                const newItem: TKitChecklistItem = {
                    id: uuidv4(), // Use custom UUID
                    name: item.name,
                    category: category.type,
                    packed: false,
                    quantity: item.quantity,
                    notes: item.notes || undefined, // Only include if it has a value
                };
                
                // Remove undefined fields before writing to Firestore
                const itemToWrite = { ...newItem };
                if (itemToWrite.notes === undefined) {
                    delete itemToWrite.notes;
                }
                if (itemToWrite.quantity === undefined) {
                    delete itemToWrite.quantity;
                }
                
                batch.set(newDocRef, itemToWrite);
                seededItems.push({ ...newItem, id: newDocRef.id }); // Use Firestore doc ID for updates
            });
        });

        await batch.commit();
        return seededItems;
    }

      // ADD a new item
      static async addChecklistItem(projectId: string, item: TKitChecklistItem): Promise<void> {
        await addDoc(this.getChecklistRef(projectId), item);
      }

      // UPDATE an item (e.g., to mark it as packed)
      static async updateChecklistItem(projectId: string, itemId: string, updates: Partial<TKitChecklistItem>): Promise<void> {
        // Query to find the document with the matching custom 'id' field
        const q = query(this.getChecklistRef(projectId), where('id', '==', itemId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docToUpdateRef = querySnapshot.docs[0].ref;
            await updateDoc(docToUpdateRef, updates);
        } else {
            throw new Error(`Checklist item with ID ${itemId} not found.`);
        }
      }

      // DELETE an item
      static async deleteChecklistItem(projectId: string, firestoreDocId: string): Promise<void> {
        const docRef = doc(db, 'projects', projectId, 'kitChecklist', firestoreDocId);
        await deleteDoc(docRef);
    }

}  


//   export class KitChecklistService {
//     /**
//      * Gets a reference to the 'kitChecklist' subcollection for a specific project.
//      * @param projectId - The ID of the project.
//      * @returns A CollectionReference to the subcollection.
//      */
//     private static getChecklistRef(projectId: string) {
//       return collection(db, 'projects', projectId, 'kitChecklist');
//     }
  
//     /**
//      * Fetches all checklist items for a given project.
//      * @param projectId - The ID of the project.
//      * @returns A promise that resolves to an array of checklist items.
//      */
//     static async getChecklist(projectId: string): Promise<TKitChecklistItem[]> {
//       const snapshot = await getDocs(this.getChecklistRef(projectId));
//       // Note: It's good practice to validate fetched data with your Zod schema here.
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TKitChecklistItem));
//     }
  
//     /**
//      * Seeds the default kit checklist for a project if it doesn't exist.
//      * @param projectId - The ID of the project.
//      */
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
//                     notes: item.notes,
//                 };
//                 batch.set(newDocRef, newItem);
//                 seededItems.push({ ...newItem, id: newDocRef.id }); // Use Firestore doc ID for updates
//             });
//         });
  
//         await batch.commit();
//         return seededItems;
//     }
  
  
//     /**
//      * Adds a new item to a project's checklist.
//      * @param projectId - The ID of the project.
//      * @param item - The checklist item to add (without the Firestore ID).
//      * @returns The newly created document reference.
//      */
//     static async addChecklistItem(projectId: string, item: Omit<TKitChecklistItem, 'id'>): Promise<DocumentReference> {
//       return await addDoc(this.getChecklistRef(projectId), item);
//     }
  
//     /**
//      * Updates an existing checklist item.
//      * @param projectId - The ID of the project.
//      * @param firestoreDocId - The Firestore document ID of the item to update.
//      * @param updates - An object with the fields to update.
//      */
//     static async updateChecklistItem(projectId: string, firestoreDocId: string, updates: Partial<TKitChecklistItem>): Promise<void> {
//       const docRef = doc(db, 'projects', projectId, 'kitChecklist', firestoreDocId);
//       await updateDoc(docRef, updates);
//     }
  
//     /**
//      * Deletes a checklist item.
//      * @param projectId - The ID of the project.
//      * @param firestoreDocId - The Firestore document ID of the item to delete.
//      */
//     static async deleteChecklistItem(projectId: string, firestoreDocId: string): Promise<void> {
//       const docRef = doc(db, 'projects', projectId, 'kitChecklist', firestoreDocId);
//       await deleteDoc(docRef);
//     }
//   }
  