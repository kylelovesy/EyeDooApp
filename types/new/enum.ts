export const PROJECT_STATUS = ['Draft', 'Active', 'Completed', 'Cancelled'] as const;
export type ProjectStatus = typeof PROJECT_STATUS[number];

export const PROJECT_TYPES = ['Wedding', 'Engagement', 'Elopement', 'Other'] as const;
export type ProjectType = typeof PROJECT_TYPES[number];

export const EVENT_STYLES = ['Traditional', 'Modern', 'Bohemian', 'Vintage', 'Other'] as const;
export type EventStyle = typeof EVENT_STYLES[number];

export const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Other', 'Prefer not to say'] as const;
export type Pronoun = typeof PRONOUNS[number];

export const LOCATION_TYPES = [
  'Main Venue',
  'Ceremony',
  'Getting Ready Location A',
  'Getting Ready Location B',
  'Reception',
  'Other',
] as const;
export type LocationType = typeof LOCATION_TYPES[number];

export const CONTACT_TYPES = ['Officiant', 'Wedding Planner', 'Videographer', 'DJ/Band', 'Other'] as const;
export type ContactType = typeof CONTACT_TYPES[number];

export const RELATIONSHIP_TO_COUPLE = ['Bride', 'Groom', 'Bride\'s Family', 'Groom\'s Family', 'Bride\'s Friends', 'Groom\'s Friends', 'Other'] as const;
export type RelationshipToCouple = typeof RELATIONSHIP_TO_COUPLE[number];

//PHOTOS
//GROUP SHOTS
export const GROUP_SHOT_CATEGORIES = [
    'Couple with each parent individually',
    'Couple with both sets of parents',
    'Couple with siblings',
    'Couple with immediate family (parents & siblings)',
    'Couple with grandparents',
    'Couple with extended family (aunts/uncles/cousins)',
    'Couple with full wedding party',
    'Bride/Groom with bridesmaids/groomsmen',
    'Bride with maid of honour / Groom with best man',
    'Bride/Groom with flower girls / page boys',
    'Couple with close friends',
    'Couple with university or school friends',
    'Couple with work friends',
    'Other'
 ] as const;  
 export type GroupShotCategory = typeof GROUP_SHOT_CATEGORIES[number];


//COUPLE SHOTS
export const COUPLE_SHOT_CATEGORIES = [
    'Classic posed portraits',
    'Creative/artistic portraits',
    'Backlit golden hour shots',
    'Close-ups with rings/hands',
    'First look',
    'First kiss',
    'First dance',
    'Walking hand-in-hand',
    'Emotional reactions',
    'Other'
] as const;
export type CoupleShotCategory = typeof COUPLE_SHOT_CATEGORIES[number];

  
//CANDID SHOTS
export const CANDID_SHOT_CATEGORIES = [
    'Hair and makeup',
    'Dress/suit details',
    'Candid moments with bridal party',
    'Ceremony',
    'Walking down the aisle',
    'Ring exchange',
    'Tears or laughs',
    'Guest reactions',
    'Reception',
    'Speeches',
    'Cake cutting',
    'Guests dancing',
    'Candid table shots',
    'Kids playing or guests mingling',
    'Details',
    'Table decor',
    'Flowers',
    'Signage',
    'Place cards and menus',
    'Guest book or favours',
    'Exterior wide shots',
    'Room setup before guests arrive',
    'Nighttime venue lights',
    'Other'
] as const;
export type CandidShotCategory = typeof CANDID_SHOT_CATEGORIES[number];



export const PHOTO_REQUEST_TYPES = ['Group Shot', 'Individual Shot', 'Other'] as const;
export type PhotoRequestType = typeof PHOTO_REQUEST_TYPES[number];

export const TIMELINE_EVENT_TYPES = ['Ceremony', 'Reception', 'Other'] as const;
export type TimelineEventType = typeof TIMELINE_EVENT_TYPES[number];

export const TIMELINE_EVENT_ICONS = ['Church', 'Reception', 'Other'] as const;