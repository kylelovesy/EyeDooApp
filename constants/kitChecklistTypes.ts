/*-------------------------------------*/
// constants/kitChecklistTypes.ts
// Status: Completed
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
// Interface defining a single item to be packed.
export interface KitItem {
  name: string;
  quantity?: number;
  notes?: string;
}

// Interface defining a category of kit. This is now the primary data structure
// for categories, supporting both predefined and user-created ones.
export interface PackingCategory {
  id: string; // A unique ID for the category (e.g., 'cat_lenses' or a UUID)
  displayName: string;
  isPredefined: boolean;
  // The Icon component is now handled dynamically in the UI
}

// A map to associate predefined category IDs with their specific icons.
export const PREDEFINED_KIT_CATEGORY_ICONS: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
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


// A comprehensive default list of categories and items for seeding a new user's master list.
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