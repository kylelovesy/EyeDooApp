/*-------------------------------------*/
// constants/groupShotsChecklistTypes.ts
// Status: Completed
// What it does: 
// This is the single source of truth for the shape of your group shot checklist types. 
// It defines the GroupShotCategory enum, along with related types like GroupShotItem, and getGroupShotCategoryDetails.
/*-------------------------------------*/
import { FC, SVGProps } from 'react';


// --- Icon Imports (placeholders for your actual icon assets) ---
import ExtendedFamilyIcon from '../assets/icons/extendedfamily.svg';
import FamilyIcon from '../assets/icons/family.svg';
import FriendsIcon from '../assets/icons/friends.svg';
import FunIcon from '../assets/icons/fun.svg';
import GenericIcon from '../assets/icons/generic.svg';
import OthersIcon from '../assets/icons/others.svg';
import WeddingPartyIcon from '../assets/icons/weddingparty.svg';
// Export the generic icon for use in other files
export { GenericIcon };

// Interface defining a single item to be included in a group shot.
export interface GroupShotItem {
  name: string;
  completed?: boolean;
  notes?: string;
}

// Interface defining a category of group shot. This is now the primary data structure
// for categories, supporting both predefined and user-created ones.
export interface GroupShotCategory {
  id: string;
  displayName: string;
  isPredefined: boolean;
}

// A map to associate predefined category IDs with their specific group shot icons.
export const PREDEFINED_GROUPSHOT_CATEGORY_ICONS: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
    cat_family: FamilyIcon,
    cat_weddingparty: WeddingPartyIcon,
    cat_extendedfamily: ExtendedFamilyIcon,
    cat_friends: FriendsIcon,
    cat_other: OthersIcon,
    cat_fun: FunIcon,
};


// A comprehensive default list of categories and items for seeding a new user's master list.
export const DEFAULT_GROUPSHOT_CATEGORIES: (GroupShotCategory & { shots: GroupShotItem[] })[] = [
  {
    id: 'cat_family',
    displayName: 'Immediate Family',
    isPredefined: true,
    shots: [
        { name: 'Couple with Partner 1s parents', completed: false },
        { name: 'Couple with Partner 2s parents', completed: false },
        { name: 'Couple with both sets of parents', completed: false },
        { name: 'Couple with Partner 1s immediate family (parents & siblings)', completed: false },
        { name: 'Couple with Partner 2s immediate family (parents & siblings)', completed: false },
        { name: 'Couple with all immediate family (both sides)', completed: false },
        { name: 'Couple with siblings (both sides combined)', completed: false },
        { name: 'Couple with grandparents (each side separately)', completed: false },
        { name: 'Generations shot (e.g., couple, parent, grandparent)', completed: false },
    ],
  },
  {
    id: 'cat_weddingparty',
    displayName: 'Wedding Party',
    isPredefined: true,
    shots: [
        { name: 'Couple with full wedding party', completed: false }, 
        { name: 'Partner 1 with their attendants (e.g., Bridesmaids/Groomsmen)', completed: false },
        { name: 'Partner 2 with their attendants (e.g., Bridesmaids/Groomsmen)', completed: false },
        { name: 'Partner 1 with Maid of Honour / Partner 2 with Best Man', completed: false },
        { name: 'All attendants together (e.g., Bridesmaids and Groomsmen)', completed: false },
        { name: 'Couple with flower girls / ring bearers', completed: false },
        { name: 'Couple with ushers', completed: false },
    ],
  }, 
  {
    id: 'cat_extendedfamily',
    displayName: 'Extended Family',
    isPredefined: true,
    shots: [        
        { name: 'Couple with Partner 1s extended family', completed: false },
        { name: 'Couple with Partner 2s extended family', completed: false },
        { name: 'Couple with all aunts & uncles', completed: false },
        { name: 'Couple with all cousins', completed: false }
    ],
  },
  {
    id: 'cat_friends',
    displayName: 'Friends',
    isPredefined: true,
    shots: [
        { name: 'Couple with close friends group', completed: false },
        { name: 'Couple with university friends', completed: false },
        { name: 'Couple with school friends', completed: false },
        { name: 'Couple with work friends', completed: false },
    ],
  }, 
  {
    id: 'cat_others',
    displayName: 'Full Group / Others',
    isPredefined: true,
    shots: [        
        { name: 'Full group shot with all wedding guests', completed: false },
    ],
  },
  {
    id: 'cat_fun',
    displayName: 'Fun & Modern Shots',
    isPredefined: true,
    shots: [
      { name: 'Wedding party lifting the couple', completed: false },
      { name: 'Tunnel or archway created by guests', completed: false },
      { name: 'The "silly face" shot with the wedding party', completed: false },
      { name: 'Confetti toss shot', completed: false },
      { name: 'Couple with guests from a specific hobby/club', completed: false },
    ],
  }
];