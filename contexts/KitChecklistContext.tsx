/*-------------------------------------*/
// contexts/KitChecklistContext.tsx
// Status: Complete
// What it does: 
// Manages the state of the kit checklist for the active project.
// It fetches, adds, updates, and deletes items by calling the KitChecklistService.
// It also handles modal visibility for the add/edit form.
/*-------------------------------------*/

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KitChecklistService } from '../services/kitChecklistService';
import { KitChecklistSchema, TKitChecklistItem } from '../types/kitChecklist';
import { Project } from '../types/project';
import { useProjects } from './ProjectContext';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

interface KitChecklistContextType extends BaseFormContextType<TKitChecklistItem> {
    activeProject: Project | null;
    items: TKitChecklistItem[];
    loading: boolean;
    error: Error | null;
    addItem: (item: Omit<TKitChecklistItem, 'id' | 'packed'>) => Promise<void>;
    updateItem: (firestoreDocId: string, updates: Partial<TKitChecklistItem>) => Promise<void>;
    deleteItem: (firestoreDocId: string) => Promise<void>;
    togglePackedStatus: (firestoreDocId: string, currentStatus: boolean) => Promise<void>;
    fetchAndSeedItems: (projectId: string) => Promise<void>;
  }
  
  const KitChecklistContext = createContext<KitChecklistContextType | undefined>(undefined);


  //Gemini 1
  export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
    const baseContext = useBaseFormContext(
        KitChecklistSchema, 'kitChecklist', { items: [] }, {
        successMessage: 'Checklist updated successfully!',
        errorMessage: 'Failed to update checklist. Please try again.',
      }
    );
    const { currentProject } = useProjects();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [items, setItems] = useState<TKitChecklistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    // CORRECTED LOGIC: This useCallback now handles the full fetch-and-seed process.
    const fetchAndSeedItems = useCallback(async (projectId: string) => {
        setLoading(true);
        setError(null);
        try {
        // The service method now handles both checking for existing items and seeding if necessary.
        const fetchedItems = await KitChecklistService.seedDefaultChecklist(projectId);
        setItems(fetchedItems);
        } catch (e) {
        setError(e as Error);
        console.error("Failed to fetch or seed checklist items:", e);
        } finally {
        setLoading(false);
        }
    }, []);

    // CORRECTED LOGIC: This useEffect now correctly triggers the data fetch/seed when the project changes.
    useEffect(() => {
        if (currentProject?.id) {
        fetchAndSeedItems(currentProject.id);
        } else {
        // If there's no project, clear the items and stop loading.
        setItems([]);
        setLoading(false);
        }
    }, [currentProject, fetchAndSeedItems]);
  
    const addItem = async (item: Omit<TKitChecklistItem, 'id' | 'packed'>) => {
        if (!currentProject?.id) return;
        setLoading(true);
        try {
            const newItemData = { ...item, id: uuidv4(), packed: false };
            await KitChecklistService.addChecklistItem(currentProject.id, newItemData);
            // After adding, we re-run the main fetch function to get the latest state
            await fetchAndSeedItems(currentProject.id); 
        } catch (e) {
            setError(e as Error);
        } finally {
            setLoading(false);
            closeModal(); // Close modal on success
        }
    };
  
    const updateItem = async (firestoreDocId: string, updates: Partial<TKitChecklistItem>) => {
    if (!currentProject?.id) return;
    // Optimistic update for better UX
    setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, ...updates } : item));
    try {
        await KitChecklistService.updateChecklistItem(currentProject.id, firestoreDocId, updates);
    } catch (e) {
        // Revert on error
        setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, ...updates } : item));
        setError(e as Error);
    }
    };
    
    const togglePackedStatus = async (firestoreDocId: string, currentStatus: boolean) => {
        if (!currentProject?.id) return;
        // Optimistic update
        setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, packed: !currentStatus } : item));
        try {
            await KitChecklistService.updateChecklistItem(currentProject.id, firestoreDocId, { packed: !currentStatus });
        } catch(e) {
            // Revert on error
            setItems(prev => prev.map(item => item.id === firestoreDocId ? { ...item, packed: currentStatus } : item));
            setError(e as Error);
            console.error("Failed to toggle packed status:", e);
        }
    };
  
    const deleteItem = async (firestoreDocId: string) => {
      if (!currentProject?.id) return;
      const originalItems = items;
      // Optimistic update
      setItems(prev => prev.filter(item => item.id !== firestoreDocId));
      try {
        await KitChecklistService.deleteChecklistItem(currentProject.id, firestoreDocId);
      } catch (e) {
        // Revert on error
        setItems(originalItems);
        setError(e as Error);
      }
    };
    
    const openModalWithProject = (project?: Project) => {
        if (project) {
            setActiveProject(project);
          }
        baseContext.openModal(project);
    };
  
    // Expose closeModal from baseContext
    const { closeModal } = baseContext;

    const contextValue: KitChecklistContextType = {
        ...baseContext,
        activeProject,
        fetchAndSeedItems,
        openModal: openModalWithProject,
        closeModal,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        togglePackedStatus,
        items,
    };
  
    return (
      <KitChecklistContext.Provider value={contextValue}>
        {children}
      </KitChecklistContext.Provider>
    );
  };

  export const useKitChecklistContext = () => {
    const context = useContext(KitChecklistContext);
    if (context === undefined) {
      throw new Error('useKitChecklistContext must be used within a KitChecklistProvider');
    }
    return context;
  };

// Example of the Provider
// export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
//     const baseContext = useBaseFormContext(KitChecklistSchema, 'kitChecklist', { items: [] });
//     const [items, setItems] = useState<TKitChecklistItem[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [activeProject, setActiveProject] = useState<Project | null>(null);

//     const fetchItems = async (projectId: string) => {
//       setLoading(true);
//       const fetchedItems = await KitChecklistService.getChecklist(projectId);
//       setItems(fetchedItems);
//       baseContext.setFormData({ items: fetchedItems });
//       setLoading(false);
//     };
    
//     // ... implement add, update, delete functions that call the service

//     const openModal = (project?: Project) => {
//       if (project) {
//         setActiveProject(project);
//         fetchItems(project.id);
//       }
//       baseContext.openModal(project);
//     };

//     const contextValue = { /* ... combine baseContext and new functions ... */ };

//     return (
//       <KitChecklistContext.Provider value={contextValue}>
//         {children}
//       </KitChecklistContext.Provider>
//     );
//   }



