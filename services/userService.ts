/*-------------------------------------*/
// services/userService.ts
// Status: New
// What it does: 
// Manages data stored directly on a user's document in Firestore.
// This is responsible for all CRUD operations on the user's "Master Kit List".
/*-------------------------------------*/

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PACKING_CATEGORIES } from '../constants/kitChecklistTypes';
import { User } from '../types/auth'; // adjust path if needed
import { TKitChecklistItem, TMasterCategory } from '../types/kitChecklist';
import { db } from './firebase';

export interface MasterKit {
  categories: TMasterCategory[];
  items: TKitChecklistItem[];
}

export class UserService {
  private static getUserRef(userId: string) {
    return doc(db, 'users', userId);
  }

  /**
   * Retrieves the user's master kit (both categories and items).
   * If it doesn't exist, it seeds it with defaults and returns the new kit.
   */
  static async getOrCreateMasterKit(userId: string): Promise<MasterKit> {
    const userDocRef = this.getUserRef(userId);
    const userDocSnap = await getDoc(userDocRef);
    console.log('userService.ts > getOrCreateMasterKit > userDocSnap', userDocSnap.data());
    if (userDocSnap.exists() && userDocSnap.data()?.masterCategories && userDocSnap.data()?.masterKitList) {
      return {
        categories: userDocSnap.data().masterCategories as TMasterCategory[],
        items: userDocSnap.data().masterKitList as TKitChecklistItem[],
      };
    } else {
      return this.resetMasterKit(userId);
    }
  }

  /**
   * Overwrites the user's master kit with new lists for categories and items.
   */
  static async updateMasterKit(userId: string, kit: MasterKit): Promise<void> {
    const userDocRef = this.getUserRef(userId);
    console.log('userService.ts > updateMasterKit > userDocRef', userDocRef);
    await updateDoc(userDocRef, {
      masterCategories: kit.categories,
      masterKitList: kit.items,
    });
  }

  /**
   * Resets the user's master kit to the application defaults.
   */
  static async resetMasterKit(userId: string): Promise<MasterKit> {
    const defaultCategories: TMasterCategory[] = [];
    const defaultItems: TKitChecklistItem[] = [];

    DEFAULT_PACKING_CATEGORIES.forEach(category => {
      // Add the category itself to the list
      defaultCategories.push({
        id: category.id,
        displayName: category.displayName,
        isPredefined: category.isPredefined,
      });

      // Add all items for that category
      category.items.forEach(item => {
        defaultItems.push({
          id: uuidv4(),
          name: item.name,
          categoryId: category.id, // Link item to its category
          quantity: item.quantity || 1,
          notes: item.notes || '',
          isPredefined: true,
          packed: false,
        });
      });
    });

    const newMasterKit: MasterKit = {
      categories: defaultCategories,
      items: defaultItems,
    };

    const userDocRef = this.getUserRef(userId);
    await setDoc(userDocRef, { 
        masterCategories: newMasterKit.categories,
        masterKitList: newMasterKit.items,
     }, { merge: true });
    
    return newMasterKit;
  }

  /**
   * Updates the user's setup configuration
   */
  static async updateUserSetup(userId: string, setupUpdates: Partial<{
    firstTimeSetup: boolean;
    showOnboarding: boolean;
    customKitListSetup: boolean;
    customTaskListSetup: boolean;
    customNFCBusinessCardSetup: boolean;
    customGroupShotsSetup: boolean;
    customCoupleShotsSetup: boolean;
  }>): Promise<void> {
    const userDocRef = this.getUserRef(userId);

    const updateFields = Object.keys(setupUpdates).reduce((acc, key) => {
      acc[`setup.${key}`] = setupUpdates[key as keyof typeof setupUpdates];
      return acc;
    }, {} as Record<string, any>);

    updateFields.updatedAt = new Date();

    await updateDoc(userDocRef, updateFields);
  }

  /**
   * Complete the first-time setup process
   */
  static async completeFirstTimeSetup(userId: string, customizations: {
    customKitListSetup?: boolean;
    customTaskListSetup?: boolean;
    customNFCBusinessCardSetup?: boolean;
    customGroupShotsSetup?: boolean;
    customCoupleShotsSetup?: boolean;
  }): Promise<void> {
    console.log('userService.ts > completeFirstTimeSetup > customizations', customizations);
    const setupUpdates = {
      firstTimeSetup: false,
      showOnboarding: false,
      ...customizations,
    };
    console.log('userService.ts > completeFirstTimeSetup > setupUpdates', setupUpdates);
    await this.updateUserSetup(userId, setupUpdates);
  }
}

/**
 * Fetches the user document from Firestore.
 */
export async function getUserDoc(userId: string): Promise<User> {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    throw new Error('User document does not exist');
  }
  return { id: userDocSnap.id, ...userDocSnap.data() } as User;
}
