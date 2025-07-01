/*-------------------------------------*/
// contexts/KitChecklistContext.tsx
// Status: Updated
// What it does: 
// Manages the state for the dynamic master categories and items, as well as
// the project-specific packing list.
/*-------------------------------------*/

import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { KitChecklistService, TKitChecklistItemWithFirestoreId } from '../services/kitChecklistService';
import { MasterKit, UserService } from '../services/userService';
import { TKitChecklistItem, TMasterCategory } from '../types/kitChecklist';
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectContext';

export interface KitChecklistContextType {
  masterCategories: TMasterCategory[];
  masterKitList: TKitChecklistItem[];
  projectPackingList: TKitChecklistItemWithFirestoreId[];
  isLoading: boolean;
  isModalVisible: boolean;
  error: string | null;
  openMasterKitModal: () => void;
  closeMasterKitModal: () => void;
  clearError: () => void;
  updateMasterKit: (updatedItems: TKitChecklistItem[], updatedCategories: TMasterCategory[]) => Promise<void>;
  resetMasterKit: () => Promise<void>;
  togglePackedStatus: (firestoreDocId: string, currentStatus: boolean) => Promise<void>;
}

export const KitChecklistContext = createContext<KitChecklistContextType | undefined>(undefined);

export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { currentProject } = useProjects();

  const [masterCategories, setMasterCategories] = useState<TMasterCategory[]>([]);
  const [masterKitList, setMasterKitList] = useState<TKitChecklistItem[]>([]);
  const [projectPackingList, setProjectPackingList] = useState<TKitChecklistItemWithFirestoreId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user || !currentProject) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('KitChecklistContext: Loading data for user:', user.id, 'project:', currentProject.id);
      
      // 1. Get or create the user's master kit (categories and items)
      const masterKit = await UserService.getOrCreateMasterKit(user.id);
      setMasterCategories(masterKit.categories);
      setMasterKitList(masterKit.items);
      
      // 2. Check if the current project already has a packing list
      let packingList = await KitChecklistService.getProjectPackingList(currentProject.id as string);
      
      // 3. If not, create one from the master list
      if (packingList.length === 0 && masterKit.items.length > 0) {
        console.log('KitChecklistContext: Creating new packing list from master kit');
        await KitChecklistService.createPackingListFromMaster(currentProject.id as string, masterKit.items);
        packingList = await KitChecklistService.getProjectPackingList(currentProject.id as string);
      }
      setProjectPackingList(packingList);

      console.log('KitChecklistContext: Successfully loaded data');
    } catch (error) {
      console.error('KitChecklistContext: Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load kit checklist data');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentProject]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openMasterKitModal = () => setIsModalVisible(true);
  const closeMasterKitModal = () => setIsModalVisible(false);
  const clearError = () => setError(null);

  const updateMasterKit = async (updatedItems: TKitChecklistItem[], updatedCategories: TMasterCategory[]) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('KitChecklistContext: Updating master kit');
      const updatedKit: MasterKit = { items: updatedItems, categories: updatedCategories };
      await UserService.updateMasterKit(user.id, updatedKit);
      setMasterKitList(updatedItems);
      setMasterCategories(updatedCategories);
      
      console.log('KitChecklistContext: Successfully updated master kit');
      closeMasterKitModal();
    } catch (error) {
      console.error('KitChecklistContext: Error updating master kit:', error);
      setError(error instanceof Error ? error.message : 'Failed to update master kit');
    } finally {
      setIsLoading(false);
    }
  };

  const resetMasterKit = async () => {
    if (!user || !currentProject) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('KitChecklistContext: Resetting master kit');
      const newMasterKit = await UserService.resetMasterKit(user.id);
      setMasterCategories(newMasterKit.categories);
      setMasterKitList(newMasterKit.items);
      
      await KitChecklistService.createPackingListFromMaster(currentProject.id as string, newMasterKit.items);
      const newPackingList = await KitChecklistService.getProjectPackingList(currentProject.id as string);
      setProjectPackingList(newPackingList);
      
      console.log('KitChecklistContext: Successfully reset master kit');
    } catch (error) {
      console.error('KitChecklistContext: Error resetting master kit:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset master kit');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePackedStatus = async (firestoreDocId: string, currentStatus: boolean) => {
    if (!currentProject) return;
    
    try {
      console.log('KitChecklistContext: Toggling packed status for item:', firestoreDocId);
      
      // Optimistically update the UI
      setProjectPackingList(prev => 
        prev.map(item => 
          item.firestoreDocId === firestoreDocId 
            ? { ...item, packed: !currentStatus } 
            : item
        )
      );
      
      // Update in Firestore
      await KitChecklistService.updatePackingListItem(
        currentProject.id as string, 
        firestoreDocId, 
        { packed: !currentStatus }
      );
      
      console.log('KitChecklistContext: Successfully toggled packed status');
    } catch (error) {
      console.error('KitChecklistContext: Error toggling packed status:', error);
      
      // Revert the optimistic update
      setProjectPackingList(prev => 
        prev.map(item => 
          item.firestoreDocId === firestoreDocId 
            ? { ...item, packed: currentStatus } 
            : item
        )
      );
      
      setError(error instanceof Error ? error.message : 'Failed to update packed status');
    }
  };

  const value = {
    masterCategories,
    masterKitList,
    projectPackingList,
    isLoading,
    isModalVisible,
    error,
    openMasterKitModal,
    closeMasterKitModal,
    clearError,
    updateMasterKit,
    resetMasterKit,
    togglePackedStatus,
  };

  return (
    <KitChecklistContext.Provider value={value}>
      {children}
    </KitChecklistContext.Provider>
  );
};

/*-------------------------------------*/
// contexts/KitChecklistContext.tsx
// Status: Updated
// What it does: 
// Defines the KitChecklistContext and its Provider. The hook has been moved
// to its own file for better separation of concerns.
/*-------------------------------------*/

// import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
// import { PHOTOGRAPHY_PACKING_LIST } from '../constants/kitChecklistTypes';
// import { KitChecklistService } from '../services/kitChecklistService';
// import { UserService } from '../services/userService';
// import { TKitChecklistItem } from '../types/kitChecklist';
// import { useAuth } from './AuthContext';
// import { useProjects } from './ProjectContext';

// // The interface is now exported
// export interface KitChecklistContextType {
//   masterKitList: TKitChecklistItem[];
//   projectPackingList: TKitChecklistItem[];
//   isLoading: boolean;
//   isModalVisible: boolean;
//   openMasterKitModal: () => void;
//   closeMasterKitModal: () => void;
//   updateMasterKit: (newList: TKitChecklistItem[]) => Promise<void>;
//   resetMasterKit: () => Promise<void>;
//   togglePackedStatus: (firestoreDocId: string, currentStatus: boolean) => Promise<void>;
// }

// // The context object is now exported
// export const KitChecklistContext = createContext<KitChecklistContextType | undefined>(undefined);

// export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuth();
//   const { currentProject } = useProjects();

//   const [masterKitList, setMasterKitList] = useState<TKitChecklistItem[]>([]);
//   const [projectPackingList, setProjectPackingList] = useState<TKitChecklistItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [hasCheckedInitialState, setHasCheckedInitialState] = useState(false);

//   const loadData = useCallback(async () => {
//     if (!user || !currentProject) return;
    
//     setIsLoading(true);
    
//     const masterList = await UserService.getOrCreateMasterKitList(user.id);
//     setMasterKitList(masterList);
    
//     let packingList = await KitChecklistService.getProjectPackingList(currentProject.id);
    
//     if (packingList.length === 0) {
//       await KitChecklistService.createPackingListFromMaster(currentProject.id, masterList);
//       packingList = await KitChecklistService.getProjectPackingList(currentProject.id);
//     }
//     setProjectPackingList(packingList);

//     if (!hasCheckedInitialState) {
//         const defaultNames = new Set(PHOTOGRAPHY_PACKING_LIST.flatMap(c => c.items.map(i => i.name)));
//         const masterNames = new Set(masterList.map(i => i.name));
//         if (defaultNames.size === masterNames.size && [...defaultNames].every(name => masterNames.has(name))) {
//             setIsModalVisible(true);
//         }
//         setHasCheckedInitialState(true);
//     }

//     setIsLoading(false);
//   }, [user, currentProject, hasCheckedInitialState]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const openMasterKitModal = () => setIsModalVisible(true);
//   const closeMasterKitModal = () => setIsModalVisible(false);

//   const updateMasterKit = async (newList: TKitChecklistItem[]) => {
//     if (!user) return;
//     setIsLoading(true);
//     await UserService.updateMasterKitList(user.id, newList);
//     setMasterKitList(newList);
//     setIsLoading(false);
//     closeMasterKitModal();
//   };

//   const resetMasterKit = async () => {
//     if (!user || !currentProject) return;
//     setIsLoading(true);
//     const newMasterList = await UserService.resetMasterKitList(user.id);
//     setMasterKitList(newMasterList);
//     await KitChecklistService.createPackingListFromMaster(currentProject.id, newMasterList);
//     const newPackingList = await KitChecklistService.getProjectPackingList(currentProject.id);
//     setProjectPackingList(newPackingList);
//     setIsLoading(false);
//   };

//   const togglePackedStatus = async (firestoreDocId: string, currentStatus: boolean) => {
//     if (!currentProject) return;
//     setProjectPackingList(prev =>
//       prev.map(item =>
//         item.id === firestoreDocId ? { ...item, packed: !currentStatus } : item
//       )
//     );
//     try {
//       await KitChecklistService.updatePackingListItem(currentProject.id, firestoreDocId, { packed: !currentStatus });
//     } catch (error) {
//       setProjectPackingList(prev =>
//         prev.map(item =>
//           item.id === firestoreDocId ? { ...item, packed: currentStatus } : item
//         )
//       );
//       console.error("Failed to update packed status:", error);
//     }
//   };

//   const value = {
//     masterKitList,
//     projectPackingList,
//     isLoading,
//     isModalVisible,
//     openMasterKitModal,
//     closeMasterKitModal,
//     updateMasterKit,
//     resetMasterKit,
//     togglePackedStatus,
//   };

//   return (
//     <KitChecklistContext.Provider value={value}>
//       {children}
//     </KitChecklistContext.Provider>
//   );
// };

//------------------------------------------------------------------------------
// The useKitChecklist hook has been removed from this file.


// import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { KitChecklistService } from '../services/kitChecklistService';
// import { KitChecklistSchema, TKitChecklistItem } from '../types/kitChecklist';
// import { Project } from '../types/project';
// import { useProjects } from './ProjectContext';
// import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// interface KitChecklistContextType extends BaseFormContextType<TKitChecklistItem> {
//     activeProject: Project | null;
//     items: TKitChecklistItem[];
//     loading: boolean;
//     error: Error | null;
//     addItem: (item: Omit<TKitChecklistItem, 'id' | 'packed'>) => Promise<void>;
//     updateItem: (firestoreDocId: string, updates: Partial<TKitChecklistItem>) => Promise<void>;
//     deleteItem: (firestoreDocId: string) => Promise<void>;
//     togglePackedStatus: (firestoreDocId: string, currentStatus: boolean) => Promise<void>;
//     fetchAndSeedItems: (projectId: string) => Promise<void>;
//   }
  
//   const KitChecklistContext = createContext<KitChecklistContextType | undefined>(undefined);


//   //Gemini 1
//   export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
//     const baseContext = useBaseFormContext(
//         KitChecklistSchema, 'kitChecklist', { items: [] }, {
//         successMessage: 'Checklist updated successfully!',
//         errorMessage: 'Failed to update checklist. Please try again.',
//       }
//     );
//     const { currentProject } = useProjects();
//     const [activeProject, setActiveProject] = useState<Project | null>(null);
//     const [items, setItems] = useState<TKitChecklistItem[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<Error | null>(null);
  
//     // CORRECTED LOGIC: This useCallback now handles the full fetch-and-seed process.
//     const fetchAndSeedItems = useCallback(async (projectId: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//         // The service method now handles both checking for existing items and seeding if necessary.
//         const fetchedItems = await KitChecklistService.seedDefaultChecklist(projectId);
//         setItems(fetchedItems);
//         } catch (e) {
//         setError(e as Error);
//         console.error("Failed to fetch or seed checklist items:", e);
//         } finally {
//         setLoading(false);
//         }
//     }, []);

//     // CORRECTED LOGIC: This useEffect now correctly triggers the data fetch/seed when the project changes.
//     useEffect(() => {
//         if (currentProject?.id) {
//         fetchAndSeedItems(currentProject.id);
//         } else {
//         // If there's no project, clear the items and stop loading.
//         setItems([]);
//         setLoading(false);
//         }
//     }, [currentProject, fetchAndSeedItems]);
  
//     const addItem = async (item: Omit<TKitChecklistItem, 'id' | 'packed'>) => {
//         if (!currentProject?.id) return;
//         setLoading(true);
//         try {
//             const newItemData = { ...item, id: uuidv4(), packed: false };
//             await KitChecklistService.addChecklistItem(currentProject.id, newItemData);
//             // After adding, we re-run the main fetch function to get the latest state
//             await fetchAndSeedItems(currentProject.id); 
//         } catch (e) {
//             setError(e as Error);
//         } finally {
//             setLoading(false);
//             closeModal(); // Close modal on success
//         }
//     };
  
//     const updateItem = async (firestoreDocId: string, updates: Partial<TKitChecklistItem>) => {
//     if (!currentProject?.id) return;
//     // Optimistic update for better UX
//     setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, ...updates } : item));
//     try {
//         await KitChecklistService.updateChecklistItem(currentProject.id, firestoreDocId, updates);
//     } catch (e) {
//         // Revert on error
//         setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, ...updates } : item));
//         setError(e as Error);
//     }
//     };
    
//     const togglePackedStatus = async (firestoreDocId: string, currentStatus: boolean) => {
//         if (!currentProject?.id) return;
//         // Optimistic update
//         setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, packed: !currentStatus } : item));
//         try {
//             await KitChecklistService.updateChecklistItem(currentProject.id, firestoreDocId, { packed: !currentStatus });
//         } catch(e) {
//             // Revert on error
//             setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, packed: currentStatus } : item));
//             setError(e as Error);
//             console.error("Failed to toggle packed status:", e);
//         }
//     };
  
//     const deleteItem = async (firestoreDocId: string) => {
//       if (!currentProject?.id) return;
//       const originalItems = items;
//       // Optimistic update
//       setItems(prev => prev.filter(item => item.id !== firestoreDocId));
//       try {
//         await KitChecklistService.deleteChecklistItem(currentProject.id, firestoreDocId);
//       } catch (e) {
//         // Revert on error
//         setItems(originalItems);
//         setError(e as Error);
//       }
//     };
    
//     const openModalWithProject = (project?: Project) => {
//         if (project) {
//             setActiveProject(project);
//           }
//         baseContext.openModal(project);
//     };
  
//     // Expose closeModal from baseContext
//     const { closeModal } = baseContext;

//     const contextValue: KitChecklistContextType = {
//         ...baseContext,
//         activeProject,
//         fetchAndSeedItems,
//         openModal: openModalWithProject,
//         closeModal,
//         loading,
//         error,
//         addItem,
//         updateItem,
//         deleteItem,
//         togglePackedStatus,
//         items,
//     };
  
//     return (
//       <KitChecklistContext.Provider value={contextValue}>
//         {children}
//       </KitChecklistContext.Provider>
//     );
//   };

//   export const useKitChecklistContext = () => {
//     const context = useContext(KitChecklistContext);
//     if (context === undefined) {
//       throw new Error('useKitChecklistContext must be used within a KitChecklistProvider');
//     }
//     return context;
//   };



