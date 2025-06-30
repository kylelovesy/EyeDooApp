# How to Add a New Feature: A Step-by-Step Guide

This guide provides a standardized, step-by-step process for adding a new data-driven feature to the EyeDooApp. By following this pattern, we ensure that new features are modular, scalable, and consistent with the existing architecture.

We will use a **"Kit Preparation Checklist"** as our working example, based on the types defined in `constants/--prepListTypes.ts`.

---

## The Architectural Pattern

The core pattern involves five main steps, creating and linking pieces in each layer of the application:

1.  **Data (`constants` & `types`):** Define the feature's data shape and validation rules.
2.  **Service (`services`):** Create the logic to communicate with Firestore.
3.  **Context (`contexts`):** Manage the feature's state across the application.
4.  **UI (`components`):** Build the forms and views for user interaction.
5.  **Integration (`app`):** Wire everything together in a new screen.

---

### Step 1: Define the Data Structure

First, define what your data looks like.

1.  **Constants (`constants/kitChecklistTypes.ts`)**:
    You already have a starting point in `constants/--prepListTypes.ts`. Rename this file to `constants/kitChecklistTypes.ts`. This file defines your enums (`KitCategory`), interfaces (`KitItem`), and default data (`PHOTOGRAPHY_PACKING_LIST`). It is the single source of truth for the *types* of checklist items.

2.  **Types & Schemas (`types/kitChecklist.ts`)**:
    Create a new file to define the Zod schemas for validation and to infer the TypeScript types.

    ```typescript
    // types/kitChecklist.ts
    import { z } from 'zod';
    import { KitCategory } from '../constants/kitChecklistTypes';

    // Schema for a single checklist item stored in Firestore
    export const KitChecklistItemSchema = z.object({
      id: z.string().uuid(),
      name: z.string(),
      category: z.nativeEnum(KitCategory),
      packed: z.boolean().default(false),
      quantity: z.number().optional(),
      notes: z.string().optional(),
    });

    // An array of items, representing the whole checklist for a project
    export const KitChecklistSchema = z.object({
      items: z.array(KitChecklistItemSchema).optional().default([]),
    });

    export type TKitChecklistItem = z.infer<typeof KitChecklistItemSchema>;
    export type TKitChecklist = z.infer<typeof KitChecklistSchema>;
    ```

3.  **Update Project Schema (`types/projectSchema.ts`)**:
    Integrate your new schema into the main `ProjectSchema` so every project can have a kit checklist.

    ```typescript
    // ... inside types/projectSchema.ts
    import { KitChecklistSchema } from "./kitChecklist"; // 1. Import

    export const ProjectSchema = z.object({
      // ... other fields
      form4: form4PhotosSchema.describe('Photo requirements and requests'),
      kitChecklist: KitChecklistSchema.optional().describe('Kit preparation checklist'), // 2. Add new field
    });
    
    // Also add to UpdateProjectSchema
    export const UpdateProjectSchema = z.object({
        //...
        form4: form4PhotosSchema.optional(),
        kitChecklist: KitChecklistSchema.optional(), // 3. Add to updates
    }).partial();
    ```

### Step 2: Create the Service

The service class handles all communication with Firestore for this feature. We will treat the checklist as a **subcollection** to align with the Timeline pattern, which is highly scalable.

1.  **Create `services/kitChecklistService.ts`**:
    This service will manage CRUD operations for items in the `kitChecklist` subcollection of a project.

    ```typescript
    // services/kitChecklistService.ts
    import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
    import { db } from './firebase';
    import { TKitChecklistItem } from '../types/kitChecklist';

    export class KitChecklistService {
      private static getChecklistRef(projectId: string) {
        return collection(db, 'projects', projectId, 'kitChecklist');
      }

      // GET all checklist items for a project
      static async getChecklist(projectId: string): Promise<TKitChecklistItem[]> {
        const snapshot = await getDocs(this.getChecklistRef(projectId));
        return snapshot.docs.map(doc => doc.data() as TKitChecklistItem);
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

      // ... other methods like deleteChecklistItem
    }
    ```

### Step 3: Create the Context

The context manages the feature's state, making it available to any component that needs it.

1.  **Create `contexts/KitChecklistContext.tsx`**:
    This will look very similar to `TimelineContext.tsx`, using `useBaseFormContext` for modal control.

    ```typescript
    // contexts/KitChecklistContext.tsx
    import React, { createContext, useContext, useState, ReactNode } from 'react';
    import { useBaseFormContext, BaseFormContextType } from './useBaseFormContext';
    import { KitChecklistService } from '../services/kitChecklistService';
    import { TKitChecklistItem, TKitChecklist, KitChecklistSchema } from '../types/kitChecklist';
    import { Project } from '../types/project';
    
    // ... (define context type, initial data)

    // Example of the Provider
    export const KitChecklistProvider = ({ children }: { children: ReactNode }) => {
      const baseContext = useBaseFormContext(KitChecklistSchema, 'kitChecklist', { items: [] });
      const [items, setItems] = useState<TKitChecklistItem[]>([]);
      const [loading, setLoading] = useState(false);
      const [activeProject, setActiveProject] = useState<Project | null>(null);

      const fetchItems = async (projectId: string) => {
        setLoading(true);
        const fetchedItems = await KitChecklistService.getChecklist(projectId);
        setItems(fetchedItems);
        baseContext.setFormData({ items: fetchedItems });
        setLoading(false);
      };
      
      // ... implement add, update, delete functions that call the service

      const openModal = (project?: Project) => {
        if (project) {
          setActiveProject(project);
          fetchItems(project.id);
        }
        baseContext.openModal(project);
      };

      const contextValue = { /* ... combine baseContext and new functions ... */ };

      return (
        <KitChecklistContext.Provider value={contextValue}>
          {children}
        </KitChecklistContext.Provider>
      );
    }

    // ... create useKitChecklistContext hook
    ```
2. **Add to `ProviderWrappers.tsx`**: Create a new HOC to wrap screens with your new provider.

    ```typescript
    // contexts/ProviderWrappers.tsx
    import { KitChecklistProvider } from './KitChecklistContext';
    
    export const withKitChecklistProvider = <P extends object>(Component: React.ComponentType<P>) => {
      const WrappedComponent = (props: P) => (
        <ProjectProvider>
          <KitChecklistProvider>
            <Component {...props} />
          </KitChecklistProvider>
        </ProjectProvider>
      );
      WrappedComponent.displayName = `withKitChecklistProvider(...)`;
      return WrappedComponent;
    };
    ```

### Step 4: Create the UI Components

Now, build the user-facing parts.

1.  **Form Component (`components/kit/KitItemForm.tsx`)**: The form to add or edit a single checklist item. This should have its own logic hook (`hooks/useKitItemForm.ts`) just like `useTimelineForm`.
2.  **View Component (`components/views/KitChecklistView.tsx`)**: A component to display the list of kit items, perhaps grouped by category. It would take the `items` array from the `KitChecklistContext` as a prop.
3.  **Modal Integration (`components/FormModals.tsx`)**:
    -   First, create the modal component itself, e.g., `components/modals/KitChecklistFormModal.tsx`.
    -   Then, add your new modal to `FormModals.tsx` and export a hook for easy access.

    ```typescript
    // components/FormModals.tsx
    import { KitChecklistFormModal } from './modals/KitChecklistFormModal'; // 1. Import

    export const FormModals: React.FC = () => {
      return (
        <>
          <EssentialInfoFormModal />
          <TimelineFormModal />
          <PeopleFormModal />
          <PhotosFormModal />
          <KitChecklistFormModal /> {/* 2. Add to render tree */}
        </>
      );
    };
    
    // 3. Export a custom hook for easy access
    export { useKitChecklistContext as useKitChecklistModal } from '../contexts/KitChecklistContext';
    ```

### Step 5: Integrate into the App

Finally, create a screen for the new feature.

1.  **Create Screen (`app/(app)/dashboard/preparation/index.tsx`)**: Create a new route in the app. The "Other" tab seems like a good place for a "Preparation" screen.
2.  **Layout (`app/(app)/dashboard/other/_layout.tsx`)**: Add the new screen to the layout definition for the "Other" tab.
3.  **Implement the Screen**:
    -   Wrap the screen component with your new provider HOC: `export default withKitChecklistProvider(PreparationScreen);`.
    -   Use the `useKitChecklistContext` hook to get the checklist items and display them using your `KitChecklistView`.
    -   Use the `useKitChecklistModal` hook to get the `openModal` function and connect it to an "Add Item" button.

By following these steps, you create a fully integrated, robust, and maintainable new feature that aligns perfectly with the project's existing high-quality architecture. 