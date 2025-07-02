/*-------------------------------------*/
// constants/coupleShotsChecklistTypes.ts
// Status: Completed
// What it does:
// This is the single source of truth for the shape of your couple shot checklist types.
// It defines the CoupleShotCategory, CoupleShotItem, and default categories.
/*-------------------------------------*/
import { FC, SVGProps } from 'react';

// --- Icon Imports (placeholders for your new icon assets) ---
import CeremonyIcon from '../assets/icons/ceremonycat.svg';
import DetailsIcon from '../assets/icons/detailscat.svg';
import FirstLookIcon from '../assets/icons/firstlookcat.svg';
import GenericIcon from '../assets/icons/generic.svg';
import GettingReadyIcon from '../assets/icons/gettingreadycat.svg';
import GoldenHourIcon from '../assets/icons/goldenhourcat.svg';
import PortraitsIcon from '../assets/icons/portraitscat.svg';
import ReceptionIcon from '../assets/icons/receptioncat.svg';

// Export the generic icon for use in other files
export { GenericIcon };

// Interface defining a single item to be included in a couple shot.
export interface CoupleShotItem {
  name: string;
  completed?: boolean;
  notes?: string;
}

// Interface defining a category of couple shot.
export interface CoupleShotCategory {
  id: string;
  displayName: string;
  isPredefined: boolean;
}

// A map to associate predefined category IDs with their specific couple shot icons.
export const PREDEFINED_COUPLESHOT_CATEGORY_ICONS: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
    cat_getting_ready: GettingReadyIcon,
    cat_first_look: FirstLookIcon,
    cat_portraits: PortraitsIcon,
    cat_ceremony: CeremonyIcon,
    cat_golden_hour: GoldenHourIcon,
    cat_reception: ReceptionIcon,
    cat_details: DetailsIcon,
};

// A comprehensive default list of categories and items for a new user's couple shot list.
export const DEFAULT_COUPLESHOT_CATEGORIES: (CoupleShotCategory & { shots: CoupleShotItem[] })[] = [
  {
    id: 'cat_getting_ready',
    displayName: 'Getting Ready',
    isPredefined: true,
    shots: [
        { name: 'Partner 1 reading a letter from Partner 2', completed: false },
        { name: 'Partner 2 reading a letter from Partner 1', completed: false },
        { name: 'Individual portraits of each partner, fully dressed', completed: false },
        { name: 'Detail shot of the rings, vows, or special items', completed: false },
    ],
  },
  {
    id: 'cat_first_look',
    displayName: 'First Look',
    isPredefined: true,
    shots: [
        { name: 'The approach from behind', completed: false },
        { name: 'The shoulder tap', completed: false },
        { name: 'The emotional reaction (both partners)', completed: false },
        { name: 'Hugging and embracing post-reveal', completed: false },
        { name: 'A quiet, intimate moment right after', completed: false },
    ],
  },
  {
    id: 'cat_portraits',
    displayName: 'Couple Portraits',
    isPredefined: true,
    shots: [
        { name: 'Classic portrait, looking at the camera', completed: false },
        { name: 'Romantic portrait, looking at each other', completed: false },
        { name: 'Walking hand-in-hand (towards and away)', completed: false },
        { name: 'The "almost kiss" shot', completed: false },
        { name: 'Forehead kiss', completed: false },
        { name: 'Laughing together candidly', completed: false },
        { name: 'Lifting or dipping shot', completed: false },
        { name: 'Close-up on intertwined hands with rings', completed: false },
        { name: 'Wide scenic shot with couple small in frame', completed: false },
    ],
  },
  {
    id: 'cat_ceremony',
    displayName: 'Ceremony Moments',
    isPredefined: true,
    shots: [
        { name: 'The "giving away" moment', completed: false },
        { name: 'Exchanging vows', completed: false },
        { name: 'Exchanging rings', completed: false },
        { name: 'The first kiss as a married couple', completed: false },
        { name: 'Signing the register', completed: false },
        { name: 'Recessional (walking back down the aisle)', completed: false },
        { name: 'Confetti toss', completed: false },
    ],
  },
  {
    id: 'cat_golden_hour',
    displayName: 'Golden Hour / Sunset',
    isPredefined: true,
    shots: [
        { name: 'Silhouette against the sunset', completed: false },
        { name: 'Warm, backlit "halo" effect shot', completed: false },
        { name: 'Walking into the sunset', completed: false },
        { name: 'Intimate embrace in the warm light', completed: false },
    ],
  },
  {
    id: 'cat_reception',
    displayName: 'Reception Moments',
    isPredefined: true,
    shots: [
        { name: 'Grand entrance into the reception', completed: false },
        { name: 'Cutting the cake', completed: false },
        { name: 'The first dance', completed: false },
        { name: 'Candid shots during speeches', completed: false },
        { name: 'Quiet moment away from the crowd', completed: false },
        { name: 'End-of-night shot (e.g., with sparklers)', completed: false },
    ],
  }
];