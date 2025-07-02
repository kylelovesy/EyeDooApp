/*-------------------------------------*/
// services/userService.ts
// Status: Modified
// What it does:
// Manages data stored directly on a user's document in Firestore.
// This is responsible for all CRUD operations on the user's "Master Kit List".
/*-------------------------------------*/

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "../types/auth"; // adjust path if needed
import { db } from "./firebase";

import { DEFAULT_TASK_CATEGORIES } from "../constants/taskChecklistTypes";
import { TMasterTaskCategory, TTaskChecklistItem } from "../types/taskChecklist";
import { generatePredefinedTasks } from "./utils/taskUtils";



import { DEFAULT_PACKING_CATEGORIES } from "../constants/kitChecklistTypes";
import { TKitChecklistItem, TMasterCategory } from "../types/kitChecklist";
import { generatePredefinedItems } from "./utils/kitUtils"; // You'll need this utility


import { DEFAULT_GROUPSHOT_CATEGORIES } from "../constants/groupShotsChecklistTypes";
import { TGroupShotsChecklistItem, TMasterGroupShotsCategory } from "../types/groupShotsChecklist";
import { generatePredefinedGroupShots } from "./utils/groupShotUtils";

import { TCoupleShotsChecklistItem, TMasterCoupleShotsCategory } from "../types/coupleShotsChecklist";


export interface MasterKit {
  categories: TMasterCategory[];
  items: TKitChecklistItem[];
}

export interface MasterTask {
  categories: TMasterTaskCategory[];
  tasks: TTaskChecklistItem[];
}

export interface MasterGroupShots {
  categories: TMasterGroupShotsCategory[];
  groupShots: TGroupShotsChecklistItem[];
}

export interface MasterCoupleShots {
  categories: TMasterCoupleShotsCategory[];
  coupleShots: TCoupleShotsChecklistItem[];
}

export class UserService {
  private static getUserRef(userId: string) {
    return doc(db, "users", userId);
  }

  //-----------KIT FUNCTIONS-----------
  //  This is now just for fetching the kit ---
  //Retrieves the user's master kit. Returns null if it doesn't exist.
  static async getMasterKit(userId: string): Promise<MasterKit | null> {
    const userDocRef = this.getUserRef(userId);
    const userDocSnap = await getDoc(userDocRef);

    if (
      userDocSnap.exists() &&
      userDocSnap.data()?.masterCategories &&
      userDocSnap.data()?.masterKitList
    ) {
      return {
        categories: userDocSnap.data().masterCategories as TMasterCategory[],
        items: userDocSnap.data().masterKitList as TKitChecklistItem[],
      };
    }
    // Return null if the kit doesn't exist
    return null;
  }
  // --- NEW: Function to create the default kit ---
  // Creates and saves a default MasterKit for a user.
  //  This is called when a user skips detailed setup or completes setup without customizing.
  static async createDefaultMasterKit(userId: string): Promise<MasterKit> {
    const defaultCategories: TMasterCategory[] =
      DEFAULT_PACKING_CATEGORIES.map((cat) => ({
        id: cat.id,
        displayName: cat.displayName,
        isPredefined: cat.isPredefined,
      }));

    // We assume you have a utility function to generate items.
    // If not, the logic from your old 'resetMasterKit' can be placed here.
    const defaultItems = generatePredefinedItems(DEFAULT_PACKING_CATEGORIES);

    const newMasterKit: MasterKit = {
      categories: defaultCategories,
      items: defaultItems,
    };

    const userDocRef = this.getUserRef(userId);
    // Use update to avoid overwriting the whole user document
    await updateDoc(userDocRef, {
      masterCategories: newMasterKit.categories,
      masterKitList: newMasterKit.items,
    });

    console.log(`LOG: Default master kit created for user ${userId}`);
    return newMasterKit;
  }
  // Overwrites the user's master kit with new lists for categories and items.
  static async updateMasterKit(userId: string, kit: MasterKit): Promise<void> {
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterCategories: kit.categories,
      masterKitList: kit.items,
    });
  }


  //-----------TASK FUNCTIONS-----------
  //  This is now just for fetching the task list ---
  //Retrieves the user's master task list. Returns null if it doesn't exist.
  static async getMasterTask(userId: string): Promise<MasterTask | null> {
    const userDocRef = this.getUserRef(userId);
    const userDocSnap = await getDoc(userDocRef);
    if (
      userDocSnap.exists() &&
      userDocSnap.data()?.masterTaskCategories && userDocSnap.data()?.masterTaskList
    ) {
      return {
        categories: userDocSnap.data().masterTaskCategories as TMasterTaskCategory[],
        tasks: userDocSnap.data().masterTaskList as TTaskChecklistItem[],
      };
    }
    // Return null if the kit doesn't exist
    return null;
  }

  // Creates and saves a default MasterTask for a user.
  //  This is called when a user skips detailed setup or completes setup without customizing.
  static async createDefaultMasterTask(userId: string): Promise<MasterTask> {
    const defaultCategories: TMasterTaskCategory[] =
      DEFAULT_TASK_CATEGORIES.map((cat) => ({
        id: cat.id,
        displayName: cat.displayName,
        isPredefined: cat.isPredefined,
      }));
    const defaultTasks = generatePredefinedTasks(DEFAULT_TASK_CATEGORIES);
    const newMasterTask: MasterTask = {
      categories: defaultCategories,
      tasks: defaultTasks,
    };
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterTaskCategories: newMasterTask.categories,
      masterTaskList: newMasterTask.tasks,
    });
    console.log(`LOG: Default master task list created for user ${userId}`);
    return newMasterTask;
  }
  // Overwrites the user's master task list with new lists for categories and tasks.
  static async updateMasterTask(userId: string, task: MasterTask): Promise<void> {
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterTaskCategories: task.categories,
      masterTaskList: task.tasks,
    });
  }

  //-----------GROUP SHOT FUNCTIONS-----------
  //  This is now just for fetching the task list ---
  //Retrieves the user's master task list. Returns null if it doesn't exist.
  static async getMasterGroupShots(userId: string): Promise<MasterGroupShots | null> {
    const userDocRef = this.getUserRef(userId);
    const userDocSnap = await getDoc(userDocRef);
    if (
      userDocSnap.exists() &&
      userDocSnap.data()?.masterGroupShotsCategories && userDocSnap.data()?.masterGroupShotsList
    ) {
      return {
        categories: userDocSnap.data().masterGroupShotsCategories as TMasterGroupShotsCategory[],
        groupShots: userDocSnap.data().masterGroupShotsList as TGroupShotsChecklistItem[],
      };
    }
    // Return null if the kit doesn't exist
    return null;
  }
  static async createDefaultMasterGroupShots(userId: string): Promise<MasterGroupShots> {
    const defaultCategories: TMasterGroupShotsCategory[] =
      DEFAULT_GROUPSHOT_CATEGORIES.map((cat) => ({
        id: cat.id,
        displayName: cat.displayName,
        isPredefined: cat.isPredefined,
      }));
    const defaultGroupShots = generatePredefinedGroupShots(DEFAULT_GROUPSHOT_CATEGORIES);
    const newMasterGroupShots: MasterGroupShots = {
      categories: defaultCategories,
      groupShots: defaultGroupShots,
    };
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterGroupShotsCategories: newMasterGroupShots.categories,
      masterGroupShotsList: newMasterGroupShots.groupShots,
    });
    console.log(`LOG: Default master group shot list created for user ${userId}`);
    return newMasterGroupShots;
  }
  // // Overwrites the user's master task list with new lists for categories and tasks.
  static async updateMasterGroupShots(userId: string, groupShots: MasterGroupShots): Promise<void> {
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterGroupShotsCategories: groupShots.categories,
      masterGroupShotsList: groupShots.groupShots,
    });
  }

 //-----------COUPLE SHOT FUNCTIONS-----------
  //  This is now just for fetching the task list ---
  //Retrieves the user's master task list. Returns null if it doesn't exist.
  static async getMasterCoupleShots(userId: string): Promise<MasterCoupleShots | null> {
    const userDocRef = this.getUserRef(userId);
    const userDocSnap = await getDoc(userDocRef);
    if (
      userDocSnap.exists() &&
      userDocSnap.data()?.masterCoupleShotsCategories && userDocSnap.data()?.masterCoupleShotsList
    ) {
      return {
        categories: userDocSnap.data().masterCoupleShotsCategories as TMasterCoupleShotsCategory[],
        coupleShots: userDocSnap.data().masterCoupleShotsList as TCoupleShotsChecklistItem[],
      };
    }
    // Return null if the kit doesn't exist
    return null;
  }
  static async createDefaultMasterCoupleShots(userId: string): Promise<MasterCoupleShots> {
    const defaultCategories: TMasterCoupleShotsCategory[] =
      DEFAULT_GROUPSHOT_CATEGORIES.map((cat) => ({
        id: cat.id,
        displayName: cat.displayName,
        isPredefined: cat.isPredefined,
      }));
    const defaultGroupShots = generatePredefinedGroupShots(DEFAULT_GROUPSHOT_CATEGORIES);
    const newMasterCoupleShots: MasterCoupleShots = {
      categories: defaultCategories,
      coupleShots: defaultGroupShots,
    };
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterCoupleShotsCategories: newMasterCoupleShots.categories,
      masterCoupleShotsList: newMasterCoupleShots.coupleShots,
    });
    console.log(`LOG: Default master couple shot list created for user ${userId}`);
    return newMasterCoupleShots;
  }
  // // Overwrites the user's master task list with new lists for categories and tasks.
  static async updateMasterCoupleShots(userId: string, coupleShots: MasterCoupleShots): Promise<void> {
    const userDocRef = this.getUserRef(userId);
    await updateDoc(userDocRef, {
      masterCoupleShotsCategories: coupleShots.categories,
      masterCoupleShotsList: coupleShots.coupleShots,
    });
  }





  // --- UNCHANGED: These utility functions are still valid ---
  static async updateUserSetup(
    userId: string,
    setupUpdates: Partial<{
      firstTimeSetup: boolean;
      showOnboarding: boolean;
      customKitListSetup: boolean;
      customTaskListSetup: boolean;
      customNFCBusinessCardSetup: boolean;
      customGroupShotsSetup: boolean;
      customCoupleShotsSetup: boolean;
    }>
  ): Promise<void> {
    const userDocRef = this.getUserRef(userId);

    const updateFields = Object.keys(setupUpdates).reduce((acc, key) => {
      acc[`setup.${key}`] = setupUpdates[key as keyof typeof setupUpdates];
      return acc;
    }, {} as Record<string, any>);

    updateFields.updatedAt = new Date();
    await updateDoc(userDocRef, updateFields);
  }

  static async completeFirstTimeSetup(
    userId: string,
    customizations: {
      customKitListSetup?: boolean;
      customTaskListSetup?: boolean;
      customNFCBusinessCardSetup?: boolean;
      customGroupShotsSetup?: boolean;
      customCoupleShotsSetup?: boolean;
    }
  ): Promise<void> {
    const setupUpdates = {
      firstTimeSetup: false,
      showOnboarding: false,
      ...customizations,
    };
    await this.updateUserSetup(userId, setupUpdates);
  }
}

// This function remains the same
export async function getUserDoc(userId: string): Promise<User> {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    throw new Error("User document does not exist");
  }
  return { id: userDocSnap.id, ...userDocSnap.data() } as User;
}


// /*-------------------------------------*/
// // services/userService.ts
// // Status: New
// // What it does: 
// // Manages data stored directly on a user's document in Firestore.
// // This is responsible for all CRUD operations on the user's "Master Kit List".
// /*-------------------------------------*/

// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
// import { DEFAULT_PACKING_CATEGORIES } from '../constants/kitChecklistTypes';
// import { User } from '../types/auth'; // adjust path if needed
// import { TKitChecklistItem, TMasterCategory } from '../types/kitChecklist';
// import { db } from './firebase';

// export interface MasterKit {
//   categories: TMasterCategory[];
//   items: TKitChecklistItem[];
// }

// export class UserService {
//   private static getUserRef(userId: string) {
//     return doc(db, 'users', userId);
//   }

//   /**
//    * Retrieves the user's master kit (both categories and items).
//    * If it doesn't exist, it seeds it with defaults and returns the new kit.
//    */
//   static async getOrCreateMasterKit(userId: string): Promise<MasterKit> {
//     const userDocRef = this.getUserRef(userId);
//     const userDocSnap = await getDoc(userDocRef);
//     console.log('userService.ts > getOrCreateMasterKit > userDocSnap', userDocSnap.data());
//     if (userDocSnap.exists() && userDocSnap.data()?.masterCategories && userDocSnap.data()?.masterKitList) {
//       return {
//         categories: userDocSnap.data().masterCategories as TMasterCategory[],
//         items: userDocSnap.data().masterKitList as TKitChecklistItem[],
//       };
//     } else {
//       return this.resetMasterKit(userId);
//     }
//   }

//   /**
//    * Overwrites the user's master kit with new lists for categories and items.
//    */
//   static async updateMasterKit(userId: string, kit: MasterKit): Promise<void> {
//     const userDocRef = this.getUserRef(userId);
//     console.log('userService.ts > updateMasterKit > userDocRef', userDocRef);
//     await updateDoc(userDocRef, {
//       masterCategories: kit.categories,
//       masterKitList: kit.items,
//     });
//   }

//   /**
//    * Resets the user's master kit to the application defaults.
//    */
//   static async resetMasterKit(userId: string): Promise<MasterKit> {
//     const defaultCategories: TMasterCategory[] = [];
//     const defaultItems: TKitChecklistItem[] = [];

//     DEFAULT_PACKING_CATEGORIES.forEach(category => {
//       // Add the category itself to the list
//       defaultCategories.push({
//         id: category.id,
//         displayName: category.displayName,
//         isPredefined: category.isPredefined,
//       });

//       // Add all items for that category
//       category.items.forEach(item => {
//         defaultItems.push({
//           id: uuidv4(),
//           name: item.name,
//           categoryId: category.id, // Link item to its category
//           quantity: item.quantity || 1,
//           notes: item.notes || '',
//           isPredefined: true,
//           packed: false,
//         });
//       });
//     });

//     const newMasterKit: MasterKit = {
//       categories: defaultCategories,
//       items: defaultItems,
//     };

//     const userDocRef = this.getUserRef(userId);
//     await setDoc(userDocRef, { 
//         masterCategories: newMasterKit.categories,
//         masterKitList: newMasterKit.items,
//      }, { merge: true });
    
//     return newMasterKit;
//   }

//   /**
//    * Updates the user's setup configuration
//    */
//   static async updateUserSetup(userId: string, setupUpdates: Partial<{
//     firstTimeSetup: boolean;
//     showOnboarding: boolean;
//     customKitListSetup: boolean;
//     customTaskListSetup: boolean;
//     customNFCBusinessCardSetup: boolean;
//     customGroupShotsSetup: boolean;
//     customCoupleShotsSetup: boolean;
//   }>): Promise<void> {
//     const userDocRef = this.getUserRef(userId);

//     const updateFields = Object.keys(setupUpdates).reduce((acc, key) => {
//       acc[`setup.${key}`] = setupUpdates[key as keyof typeof setupUpdates];
//       return acc;
//     }, {} as Record<string, any>);

//     updateFields.updatedAt = new Date();

//     await updateDoc(userDocRef, updateFields);
//   }

//   /**
//    * Complete the first-time setup process
//    */
//   static async completeFirstTimeSetup(userId: string, customizations: {
//     customKitListSetup?: boolean;
//     customTaskListSetup?: boolean;
//     customNFCBusinessCardSetup?: boolean;
//     customGroupShotsSetup?: boolean;
//     customCoupleShotsSetup?: boolean;
//   }): Promise<void> {
//     console.log('userService.ts > completeFirstTimeSetup > customizations', customizations);
//     const setupUpdates = {
//       firstTimeSetup: false,
//       showOnboarding: false,
//       ...customizations,
//     };
//     console.log('userService.ts > completeFirstTimeSetup > setupUpdates', setupUpdates);
//     await this.updateUserSetup(userId, setupUpdates);
//   }
// }

// /**
//  * Fetches the user document from Firestore.
//  */
// export async function getUserDoc(userId: string): Promise<User> {
//   const userDocRef = doc(db, 'users', userId);
//   const userDocSnap = await getDoc(userDocRef);
//   if (!userDocSnap.exists()) {
//     throw new Error('User document does not exist');
//   }
//   return { id: userDocSnap.id, ...userDocSnap.data() } as User;
// }
