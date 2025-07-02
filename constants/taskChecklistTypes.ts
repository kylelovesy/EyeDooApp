/*-------------------------------------*/
// constants/taskChecklistTypes.ts
// Status: To Do
// What it does: 
// This is the single source of truth for the shape of your task checklist types. 
// It defines the ChecklistCategory enum, along with related types like ChecklistItem, and getChecklistItems.
/*-------------------------------------*/
import { FC, SVGProps } from 'react';


// --- Icon Imports (placeholders for your actual icon assets) ---
import PostWeddingIcon from '../assets/icons/afterwedding.svg';
import GenericIcon from '../assets/icons/generic.svg';
import MorningOfIcon from '../assets/icons/morningof.svg';
import NightBeforeIcon from '../assets/icons/nightbefore.svg';
import WeekBeforeIcon from '../assets/icons/weekbefore.svg';

// Export the generic icon for use in other files
export { GenericIcon };

// Interface defining a single task to be completed.
export interface TaskItem {
    name: string;
    completed: boolean;
    notes?: string;
  }

  // Interface defining a category of task. This is now the primary data structure
  // for categories, supporting both predefined and user-created ones.
export interface TaskCategory {
    id: string; // A unique ID for the category (e.g., 'cat_weekbefore' or a UUID)
    displayName: string;
    isPredefined: boolean;
    // The Icon component is now handled dynamically in the UI
  }


  // A map to associate predefined category IDs with their specific icons.
export const PREDEFINED_TASK_CATEGORY_ICONS: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
    cat_weekbefore: WeekBeforeIcon,
    cat_nightbefore: NightBeforeIcon,
    cat_morningof: MorningOfIcon,
    cat_afterwedding: PostWeddingIcon,
  };
  
// A comprehensive default list of categories and items for seeding a new user's master list.
export const DEFAULT_TASK_CATEGORIES: (TaskCategory & { tasks: TaskItem[] })[] = [
    {
      id: 'cat_weekbefore',
      displayName: 'Week Before',
      isPredefined: true,
      tasks: [
        { name: 'Finalize and confirm timeline with the couple', completed: false },
        { name: 'Check in with videographer/other key vendors', completed: false },
        { name: 'Prepare and print the group shot list', completed: false },
        { name: 'Check long-range weather forecast', completed: false },
        { name: 'Confirm second shooter/assistant and share info', completed: false },
      ],
    },
    {
      id: 'cat_nightbefore',
      displayName: 'Night Before',
      isPredefined: true,
      tasks: [
        { name: 'Charge ALL batteries (cameras, flashes, triggers)', completed: false },
        { name: 'Format all memory cards in-camera', completed: false },
        { name: 'Clean lenses, filters, and camera sensors', completed: false },
        { name: 'Synchronize time and date on all camera bodies', completed: false },
        { name: 'Pack camera bag according to the packing list', completed: false },
        { name: 'Review wedding day timeline and shot list again', completed: false },
        { name: 'Download offline maps of venues', completed: false },
        { name: 'Prepare snacks, water, and any meals', completed: false },
        { name: 'Lay out wedding day clothes and comfortable shoes', completed: false },
        { name: 'Set multiple alarms', completed: false },
      ],
    }, 
    {
      id: 'cat_morningof',
      displayName: 'Morning Of',
      isPredefined: true,
      tasks: [
        { name: 'Check the latest weather forecast and traffic', completed: false },
        { name: 'Eat a substantial breakfast and hydrate', completed: false },
        { name: 'Load all gear into the car', completed: false },
        { name: 'Do a final mental walkthrough of the day', completed: false },
        { name: 'Leave with plenty of buffer time', completed: false },
        { name: 'Put phone on silent before arriving', completed: false },
      ],
    },
    {
      id: 'cat_afterwedding',
      displayName: 'After Wedding',
      isPredefined: true,
      tasks: [
        { name: 'Immediately back up all memory cards (2-3 locations)', completed: false },
        { name: 'Verify backup integrity before formatting cards', completed: false },
        { name: 'Send a sneak peek gallery to the couple (1-5 images)', completed: false },
        { name: 'Put all batteries back on to charge', completed: false },
        { name: 'Clean gear before storing it away', completed: false },
      ],
    }
  ];