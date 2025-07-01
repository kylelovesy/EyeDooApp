/*-------------------------------------*/
// constants/kitChecklistTypes.ts
// Status: To Do
// What it does: 
// This is the single source of truth for the shape of your kit checklist types. 
// It defines the PrepListType enum, along with related types like PrepListTypeDetail, and getPrepListTypeDetails.
/*-------------------------------------*/
import { FC, SVGProps } from 'react';


// --- Icon Imports (placeholders for your actual icon assets) ---
import BagIcon from '../assets/icons/bag.svg';
import BatteryIcon from '../assets/icons/battery.svg';
import CameraIcon from '../assets/icons/camera.svg';
import DocumentsIcon from '../assets/icons/documents.svg';
import EssentialsIcon from '../assets/icons/essentials.svg';
import FlashIcon from '../assets/icons/flash.svg';
import GenericIcon from '../assets/icons/generic.svg';
import LaptopIcon from '../assets/icons/laptop.svg';
import LensIcon from '../assets/icons/lens.svg';
import MemoryCardIcon from '../assets/icons/memorycard.svg';
import TripodIcon from '../assets/icons/tripod.svg';

// Export the generic icon for use in other files
export { GenericIcon };

//================================================================================
// SECTION 1: PHOTOGRAPHY KIT PACKING LIST
//================================================================================

/**
 * Interface defining a single item to be packed.
 */
export interface KitItem {
  name: string;
  quantity?: number;
  notes?: string;
}

/**
 * Interface defining a category of kit. This is now the primary data structure
 * for categories, supporting both predefined and user-created ones.
 */
export interface PackingCategory {
  id: string; // A unique ID for the category (e.g., 'cat_lenses' or a UUID)
  displayName: string;
  isPredefined: boolean;
  // The Icon component is now handled dynamically in the UI
}

/**
 * A map to associate predefined category IDs with their specific icons.
 */
export const PREDEFINED_CATEGORY_ICONS: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
  cat_camera_bodies: CameraIcon,
  cat_lenses: LensIcon,
  cat_lighting: FlashIcon,
  cat_power: BatteryIcon,
  cat_media: MemoryCardIcon,
  cat_support: TripodIcon,
  cat_bags: BagIcon,
  cat_data_management: LaptopIcon,
  cat_documents: DocumentsIcon,
  cat_essentials: EssentialsIcon,
};


/**
 * A comprehensive default list of categories and items for seeding a new user's master list.
 */
export const DEFAULT_PACKING_CATEGORIES: (PackingCategory & { items: KitItem[] })[] = [
  {
    id: 'cat_camera_bodies',
    displayName: 'Camera Bodies',
    isPredefined: true,
    items: [
      { name: 'Primary Camera Body', quantity: 1 },
      { name: 'Backup Camera Body', quantity: 1 },
    ],
  },
  {
    id: 'cat_lenses',
    displayName: 'Lenses',
    isPredefined: true,
    items: [
      { name: 'Wide-Angle Lens', notes: 'e.g., 24mm or 35mm' },
      { name: 'Standard Zoom Lens', notes: 'e.g., 24-70mm' },
      { name: 'Telephoto Lens', notes: 'e.g., 70-200mm' },
      { name: 'Prime/Portrait Lens', notes: 'e.g., 50mm or 85mm' },
      { name: 'Macro Lens', notes: 'For ring shots' },
    ],
  }, 
  {
    id: 'cat_lighting',
    displayName: 'Lighting',
    isPredefined: true,
    items: [
      { name: 'On-Camera Flash (Speedlite)', quantity: 2 },
      { name: 'Off-Camera Flash Strobe', quantity: 2 },
      { name: 'Flash Triggers/Receiver', quantity: 1 },
      { name: 'Light Stands', quantity: 2 },
      { name: 'Umbrellas or Softboxes', quantity: 2 },
      { name: 'Gels & Grids', quantity: 1 },
    ],
  },
  {
    id: 'cat_power',
    displayName: 'Power',
    isPredefined: true,
    items: [
      { name: 'Camera Batteries', quantity: 4 },
      { name: 'Flash Batteries (AA)', quantity: 16 },
      { name: 'Strobe Battery Packs', quantity: 2 },
      { name: 'Battery Chargers', quantity: 3 },
      { name: 'Portable Power Bank', quantity: 1 },
    ],
  },
  {
    id: 'cat_media',
    displayName: 'Memory Cards',
    isPredefined: true,
    items: [
      { name: 'Primary Memory Cards (High Capacity)', quantity: 4 },
      { name: 'Backup Memory Cards', quantity: 4 },
      { name: 'Memory Card Holder/Case', quantity: 1 },
    ],
  },
  {
    id: 'cat_support',
    displayName: 'Support Gear',
    isPredefined: true,
    items: [
      { name: 'Tripod / Monopod', quantity: 1 },
      { name: 'Camera Straps/Harness', quantity: 1 },
    ],
  },
  {
    id: 'cat_bags',
    displayName: 'Bags & Cases',
    isPredefined: true,
    items: [
      { name: 'Main Camera Bag (Roller or Backpack)', quantity: 1 },
      { name: 'Light Stand Bag', quantity: 1 },
    ],
  },
  {
    id: 'cat_data_management',
    displayName: 'Data Management',
    isPredefined: true,
    items: [
      { name: 'Laptop or Tablet', quantity: 1 },
      { name: 'Portable SSD/Hard Drive', notes: 'For on-site backup' },
      { name: 'Card Reader', quantity: 1 },
    ],
  },
  {
    id: 'cat_documents',
    displayName: 'Documents',
    isPredefined: true,
    items: [
      { name: 'Printed Timeline & Shot List', quantity: 1 },
      { name: 'Contact Sheet (Couple, Vendors)', quantity: 1 },
      { name: 'Copy of Contract & Insurance', quantity: 1 },
    ],
  },
  {
    id: 'cat_essentials',
    displayName: 'Day Essentials',
    isPredefined: true,
    items: [
      { name: 'Comfortable Shoes', quantity: 1 },
      { name: 'Water Bottle & Snacks', quantity: 1 },
      { name: 'Painkillers & Plasters', quantity: 1 },
      { name: 'Business Cards', quantity: 20 },
      { name: 'Rain Cover for Bag/Camera', quantity: 1 },
    ],
  },
];


//================================================================================
// SECTION 2: PHOTOGRAPHER TASK CHECKLIST
// Defines the chronological tasks to perform before, during, and after the wedding.
//================================================================================

/**
 * Enum for the different phases of a photographer's wedding checklist.
 */
export enum ChecklistCategory {
  WEEK_BEFORE = 'Week Before',
  NIGHT_BEFORE = 'Night Before',
  MORNING_OF = 'Morning Of',
  POST_WEDDING = 'Post-Wedding',
}

/**
 * Interface defining the shape of a single checklist item.
 */
export interface ChecklistItem {
  label: string;
  category: ChecklistCategory;
}

/**
 * A comprehensive default checklist of tasks for wedding photographers.
 */
export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Week Before
  { label: 'Finalize and confirm timeline with the couple', category: ChecklistCategory.WEEK_BEFORE },
  { label: 'Check in with videographer/other key vendors', category: ChecklistCategory.WEEK_BEFORE },
  { label: 'Prepare and print the group shot list', category: ChecklistCategory.WEEK_BEFORE },
  { label: 'Check long-range weather forecast', category: ChecklistCategory.WEEK_BEFORE },
  { label: 'Confirm second shooter/assistant and share info', category: ChecklistCategory.WEEK_BEFORE },

  // Night Before
  { label: 'Charge ALL batteries (cameras, flashes, triggers)', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Format all memory cards in-camera', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Clean lenses, filters, and camera sensors', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Synchronize time and date on all camera bodies', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Pack camera bag according to the packing list', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Review wedding day timeline and shot list again', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Download offline maps of venues', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Prepare snacks, water, and any meals', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Lay out wedding day clothes and comfortable shoes', category: ChecklistCategory.NIGHT_BEFORE },
  { label: 'Set multiple alarms', category: ChecklistCategory.NIGHT_BEFORE },

  // Morning Of
  { label: 'Check the latest weather forecast and traffic', category: ChecklistCategory.MORNING_OF },
  { label: 'Eat a substantial breakfast and hydrate', category: ChecklistCategory.MORNING_OF },
  { label: 'Load all gear into the car', category: ChecklistCategory.MORNING_OF },
  { label: 'Do a final mental walkthrough of the day', category: ChecklistCategory.MORNING_OF },
  { label: 'Leave with plenty of buffer time', category: ChecklistCategory.MORNING_OF },
  { label: 'Put phone on silent before arriving', category: ChecklistCategory.MORNING_OF },

  // Post-Wedding
  { label: 'Immediately back up all memory cards (2-3 locations)', category: ChecklistCategory.POST_WEDDING },
  { label: 'Verify backup integrity before formatting cards', category: ChecklistCategory.POST_WEDDING },
  { label: 'Send a sneak peek gallery to the couple (1-5 images)', category: ChecklistCategory.POST_WEDDING },
  { label: 'Put all batteries back on to charge', category: ChecklistCategory.POST_WEDDING },
  { label: 'Clean gear before storing it away', category: ChecklistCategory.POST_WEDDING },
];


//================================================================================
// SECTION 1: PHOTOGRAPHY KIT PACKING LIST
// Defines the categories and specific items to pack.
//================================================================================

/**
 * Enum for the different categories of photography equipment.
 */
// export enum KitCategory {
//   CAMERA_BODIES = 'Camera Bodies',
//   LENSES = 'Lenses',
//   LIGHTING = 'Lighting & Modifiers',
//   POWER = 'Power & Batteries',
//   MEDIA = 'Memory Cards & Storage',
//   SUPPORT = 'Support & Stability',
//   BAGS = 'Bags & Cases',
//   DATA_MANAGEMENT = 'Data Management',
//   DOCUMENTS = 'Documents & Info',
//   ESSENTIALS = 'Personal & Day Essentials',
// }

// /**
//  * Interface defining a single item to be packed.
//  */
// export interface KitItem {
//   name: string;
//   quantity?: number; // Optional: specify how many, e.g., 4 batteries
//   notes?: string;    // Optional: for details like "50mm f/1.4"
// }

// /**
//  * Interface defining a category of kit, containing a list of items.
//  */
// export interface PackingCategory {
//   type: KitCategory;
//   displayName: string;
//   Icon: FC<SVGProps<SVGSVGElement>>;
//   items: KitItem[];
// }

// /**
//  * A comprehensive packing list, categorized with default items.
//  */
// export const PHOTOGRAPHY_PACKING_LIST: PackingCategory[] = [
//   {
//     type: KitCategory.CAMERA_BODIES,
//     displayName: 'Camera Bodies',
//     Icon: CameraIcon,
//     items: [
//       { name: 'Primary Camera Body', quantity: 1 },
//       { name: 'Backup Camera Body', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.LENSES,
//     displayName: 'Lenses',
//     Icon: LensIcon,
//     items: [
//       { name: 'Wide-Angle Lens', notes: 'e.g., 24mm or 35mm' },
//       { name: 'Standard Zoom Lens', notes: 'e.g., 24-70mm' },
//       { name: 'Telephoto Lens', notes: 'e.g., 70-200mm' },
//       { name: 'Prime/Portrait Lens', notes: 'e.g., 50mm or 85mm' },
//       { name: 'Macro Lens', notes: 'For ring shots' },
//     ],
//   },
//   {
//     type: KitCategory.LIGHTING,
//     displayName: 'Lighting',
//     Icon: FlashIcon,
//     items: [
//       { name: 'On-Camera Flash (Speedlite)', quantity: 2 },
//       { name: 'Off-Camera Flash Strobe', quantity: 2 },
//       { name: 'Flash Triggers/Receiver', quantity: 1 },
//       { name: 'Light Stands', quantity: 2 },
//       { name: 'Umbrellas or Softboxes', quantity: 2 },
//       { name: 'Gels & Grids', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.POWER,
//     displayName: 'Power',
//     Icon: BatteryIcon,
//     items: [
//       { name: 'Camera Batteries', quantity: 4 },
//       { name: 'Flash Batteries (AA)', quantity: 16 },
//       { name: 'Strobe Battery Packs', quantity: 2 },
//       { name: 'Battery Chargers', quantity: 3 },
//       { name: 'Portable Power Bank', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.MEDIA,
//     displayName: 'Memory Cards',
//     Icon: MemoryCardIcon,
//     items: [
//       { name: 'Primary Memory Cards (High Capacity)', quantity: 4 },
//       { name: 'Backup Memory Cards', quantity: 4 },
//       { name: 'Memory Card Holder/Case', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.SUPPORT,
//     displayName: 'Support Gear',
//     Icon: TripodIcon,
//     items: [
//       { name: 'Tripod / Monopod', quantity: 1 },
//       { name: 'Camera Straps/Harness', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.BAGS,
//     displayName: 'Bags & Cases',
//     Icon: BagIcon,
//     items: [
//       { name: 'Main Camera Bag (Roller or Backpack)', quantity: 1 },
//       { name: 'Light Stand Bag', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.DATA_MANAGEMENT,
//     displayName: 'Data Management',
//     Icon: LaptopIcon,
//     items: [
//       { name: 'Laptop or Tablet', quantity: 1 },
//       { name: 'Portable SSD/Hard Drive', notes: 'For on-site backup' },
//       { name: 'Card Reader', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.DOCUMENTS,
//     displayName: 'Documents',
//     Icon: DocumentsIcon,
//     items: [
//       { name: 'Printed Timeline & Shot List', quantity: 1 },
//       { name: 'Contact Sheet (Couple, Vendors)', quantity: 1 },
//       { name: 'Copy of Contract & Insurance', quantity: 1 },
//     ],
//   },
//   {
//     type: KitCategory.ESSENTIALS,
//     displayName: 'Day Essentials',
//     Icon: EssentialsIcon,
//     items: [
//       { name: 'Comfortable Shoes', quantity: 1 },
//       { name: 'Water Bottle & Snacks', quantity: 1 },
//       { name: 'Painkillers & Plasters', quantity: 1 },
//       { name: 'Business Cards', quantity: 20 },
//       { name: 'Rain Cover for Bag/Camera', quantity: 1 },
//     ],
//   },
// ];


// //================================================================================
// // SECTION 2: PHOTOGRAPHER TASK CHECKLIST
// // Defines the chronological tasks to perform before, during, and after the wedding.
// //================================================================================

// /**
//  * Enum for the different phases of a photographer's wedding checklist.
//  */
// export enum ChecklistCategory {
//   WEEK_BEFORE = 'Week Before',
//   NIGHT_BEFORE = 'Night Before',
//   MORNING_OF = 'Morning Of',
//   POST_WEDDING = 'Post-Wedding',
// }

// /**
//  * Interface defining the shape of a single checklist item.
//  */
// export interface ChecklistItem {
//   label: string;
//   category: ChecklistCategory;
// }

// /**
//  * A comprehensive default checklist of tasks for wedding photographers.
//  */
// export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
//   // Week Before
//   { label: 'Finalize and confirm timeline with the couple', category: ChecklistCategory.WEEK_BEFORE },
//   { label: 'Check in with videographer/other key vendors', category: ChecklistCategory.WEEK_BEFORE },
//   { label: 'Prepare and print the group shot list', category: ChecklistCategory.WEEK_BEFORE },
//   { label: 'Check long-range weather forecast', category: ChecklistCategory.WEEK_BEFORE },
//   { label: 'Confirm second shooter/assistant and share info', category: ChecklistCategory.WEEK_BEFORE },

//   // Night Before
//   { label: 'Charge ALL batteries (cameras, flashes, triggers)', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Format all memory cards in-camera', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Clean lenses, filters, and camera sensors', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Synchronize time and date on all camera bodies', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Pack camera bag according to the packing list', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Review wedding day timeline and shot list again', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Download offline maps of venues', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Prepare snacks, water, and any meals', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Lay out wedding day clothes and comfortable shoes', category: ChecklistCategory.NIGHT_BEFORE },
//   { label: 'Set multiple alarms', category: ChecklistCategory.NIGHT_BEFORE },

//   // Morning Of
//   { label: 'Check the latest weather forecast and traffic', category: ChecklistCategory.MORNING_OF },
//   { label: 'Eat a substantial breakfast and hydrate', category: ChecklistCategory.MORNING_OF },
//   { label: 'Load all gear into the car', category: ChecklistCategory.MORNING_OF },
//   { label: 'Do a final mental walkthrough of the day', category: ChecklistCategory.MORNING_OF },
//   { label: 'Leave with plenty of buffer time', category: ChecklistCategory.MORNING_OF },
//   { label: 'Put phone on silent before arriving', category: ChecklistCategory.MORNING_OF },

//   // Post-Wedding
//   { label: 'Immediately back up all memory cards (2-3 locations)', category: ChecklistCategory.POST_WEDDING },
//   { label: 'Verify backup integrity before formatting cards', category: ChecklistCategory.POST_WEDDING },
//   { label: 'Send a sneak peek gallery to the couple (1-5 images)', category: ChecklistCategory.POST_WEDDING },
//   { label: 'Put all batteries back on to charge', category: ChecklistCategory.POST_WEDDING },
//   { label: 'Clean gear before storing it away', category: ChecklistCategory.POST_WEDDING },
// ];
