/*-------------------------------------*/
// hooks/useKitChecklist.ts
// Status: Updated
// What it does: 
// Provides a custom hook to easily access the KitChecklistContext.
// This keeps the context logic separate from the components that consume it.
// Now includes error handling and validation.
/*-------------------------------------*/

import { useContext } from 'react';
import { KitChecklistContext, KitChecklistContextType } from '../contexts/KitChecklistContext';

export const useKitChecklist = (): KitChecklistContextType => {
  try {
    const context = useContext(KitChecklistContext);
    
    if (context === undefined) {
      const errorMessage = 'useKitChecklist must be used within a KitChecklistProvider';
      console.error('useKitChecklist: ' + errorMessage);
      throw new Error(errorMessage);
    }
    
    return context;
  } catch (error) {
    console.error('useKitChecklist: Error accessing context:', error);
    throw error;
  }
};
