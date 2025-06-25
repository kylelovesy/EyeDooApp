/**
 * Enum definitions for the EyeDooApp
 * Using TypeScript enums with string values for better type safety and interoperability
 */

// === PROJECT ENUMS ===

/**
 * Project status enum with string values for better interoperability with Firestore
 */
export enum ProjectStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

/**
 * Project type enum
 */
export enum ProjectType {
  WEDDING = 'Wedding',
  ENGAGEMENT = 'Engagement',
  ELOPEMENT = 'Elopement',
  PORTRAIT = 'Portrait',
  COMMERCIAL = 'Commercial',
  EVENT = 'Event',
  OTHER = 'Other',
}

/**
 * Event style enum
 */
export enum EventStyle {
  TRADITIONAL = 'Traditional',
  MODERN = 'Modern',
  BOHEMIAN = 'Bohemian',
  VINTAGE = 'Vintage',
  RUSTIC = 'Rustic',
  GLAMOROUS = 'Glamorous',
  MINIMALIST = 'Minimalist',
  BEACH = 'Beach',
  GARDEN = 'Garden',
  OTHER = 'Other',
}

// === PEOPLE ENUMS ===

/**
 * Pronoun enum
 */
export enum Pronoun {
  SHE_HER = 'She/Her',
  HE_HIM = 'He/Him',
  THEY_THEM = 'They/Them',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

/**
 * Relationship to couple enum
 */
export enum RelationshipToCouple {
  BRIDE = 'Bride',
  GROOM = 'Groom',
  BRIDE_FAMILY = 'Bride\'s Family',
  GROOM_FAMILY = 'Groom\'s Family',
  BRIDE_FRIENDS = 'Bride\'s Friends',
  GROOM_FRIENDS = 'Groom\'s Friends',
  OTHER = 'Other',
}

/**
 * Contact type enum for vendors and key people
 */
export enum ContactType {
  OFFICIANT = 'Officiant',
  WEDDING_PLANNER = 'Wedding Planner',
  VIDEOGRAPHER = 'Videographer',
  DJ_BAND = 'DJ/Band',
  FLORIST = 'Florist',
  CATERER = 'Caterer',
  VENUE_COORDINATOR = 'Venue Coordinator',
  MAKEUP_ARTIST = 'Makeup Artist',
  HAIR_STYLIST = 'Hair Stylist',
  TRANSPORTATION = 'Transportation',
  OTHER = 'Other',
}

// === LOCATION ENUMS ===

/**
 * Location type enum
 */
export enum LocationType {
  MAIN_VENUE = 'Main Venue',
  CEREMONY = 'Ceremony',
  GETTING_READY_A = 'Getting Ready Location A',
  GETTING_READY_B = 'Getting Ready Location B',
  RECEPTION = 'Reception',
  PHOTO_LOCATION = 'Photo Location',
  ACCOMMODATION = 'Accommodation',
  OTHER = 'Other',
}

// === TIMELINE ENUMS ===

/**
 * Timeline event type enum
 */
// export enum TimelineEventType {
//   BRIDAL_PREP = 'Bridal Prep',
//   GROOM_PREP = 'Groom Prep',
//   GUESTS_ARRIVE = 'Guests Arrive',
//   CEREMONY_BEGINS = 'Ceremony Begins',
//   CONFETTI_AND_MINGLING = 'Confetti and Mingling',
//   RECEPTION_DRINKS = 'Reception Drinks',
//   GROUP_PHOTOS = 'Group Photos',
//   COUPLE_PORTRAITS = 'Couple Portraits',
//   WEDDING_BREAKFAST = 'Wedding Breakfast',
//   SPEECHES = 'Speeches',
//   EVENING_GUESTS_ARRIVE = 'Evening Guests Arrive',
//   CAKE_CUTTING = 'Cake Cutting',
//   FIRST_DANCE = 'First Dance',
//   EVENING_ENTERTAINMENT = 'Evening Entertainment',
//   EVENING_BUFFET = 'Evening Buffet',
//   CARRIAGES = 'Carriages',
//   OTHER = 'Other',
// }

/**
 * Timeline event icon enum
 */
// export enum TimelineEventIcon {
//   CHURCH = 'Church',
//   RECEPTION = 'Reception',
//   CALENDAR = 'Calendar',
//   CAMERA = 'Camera',
//   MUSIC = 'Music',
//   HEART = 'Heart',
//   OTHER = 'Other',
// }

// === PHOTO ENUMS ===

/**
 * Photo request type enum
 */
export enum PhotoRequestType {
  GROUP_SHOT = 'Group Shot',
  INDIVIDUAL_SHOT = 'Individual Shot',
  COUPLE_SHOT = 'Couple Shot',
  CANDID_SHOT = 'Candid Shot',
  DETAIL_SHOT = 'Detail Shot',
  OTHER = 'Other',
}

/**
 * Importance level enum
 */
export enum ImportanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Notification type enum
 */
export enum NotificationType {
  NONE = 'None',
  NOTIFICATION = 'Notification',
  VIBRATION = 'Vibration',
  SOUND = 'Sound',
  OTHER = 'Other',
}

// === GROUP SHOT CATEGORIES ===

/**
 * Group shot category enum
 */
export enum GroupShotCategory {
  COUPLE_WITH_EACH_PARENT = 'Couple with each parent individually',
  COUPLE_WITH_BOTH_PARENTS = 'Couple with both sets of parents',
  COUPLE_WITH_SIBLINGS = 'Couple with siblings',
  COUPLE_WITH_IMMEDIATE_FAMILY = 'Couple with immediate family (parents & siblings)',
  COUPLE_WITH_GRANDPARENTS = 'Couple with grandparents',
  COUPLE_WITH_EXTENDED_FAMILY = 'Couple with extended family (aunts/uncles/cousins)',
  COUPLE_WITH_WEDDING_PARTY = 'Couple with full wedding party',
  BRIDE_GROOM_WITH_BRIDESMAIDS_GROOMSMEN = 'Bride/Groom with bridesmaids/groomsmen',
  BRIDE_WITH_MOH_GROOM_WITH_BESTMAN = 'Bride with maid of honour / Groom with best man',
  BRIDE_GROOM_WITH_FLOWER_GIRLS_PAGE_BOYS = 'Bride/Groom with flower girls / page boys',
  COUPLE_WITH_CLOSE_FRIENDS = 'Couple with close friends',
  COUPLE_WITH_SCHOOL_FRIENDS = 'Couple with university or school friends',
  COUPLE_WITH_WORK_FRIENDS = 'Couple with work friends',
  OTHER = 'Other',
}

// === COUPLE SHOT CATEGORIES ===

/**
 * Couple shot category enum
 */
export enum CoupleShotCategory {
  CLASSIC_POSED_PORTRAITS = 'Classic posed portraits',
  CREATIVE_ARTISTIC_PORTRAITS = 'Creative/artistic portraits',
  BACKLIT_GOLDEN_HOUR = 'Backlit golden hour shots',
  CLOSEUPS_RINGS_HANDS = 'Close-ups with rings/hands',
  FIRST_LOOK = 'First look',
  FIRST_KISS = 'First kiss',
  FIRST_DANCE = 'First dance',
  WALKING_HAND_IN_HAND = 'Walking hand-in-hand',
  EMOTIONAL_REACTIONS = 'Emotional reactions',
  ROMANTIC_SUNSET = 'Romantic sunset shots',
  SILHOUETTES = 'Silhouettes',
  OTHER = 'Other',
}

// === CANDID SHOT CATEGORIES ===

/**
 * Candid shot category enum
 */
export enum CandidShotCategory {
  HAIR_AND_MAKEUP = 'Hair and makeup',
  DRESS_SUIT_DETAILS = 'Dress/suit details',
  CANDID_BRIDAL_PARTY = 'Candid moments with bridal party',
  CEREMONY = 'Ceremony',
  WALKING_DOWN_AISLE = 'Walking down the aisle',
  RING_EXCHANGE = 'Ring exchange',
  TEARS_OR_LAUGHS = 'Tears or laughs',
  GUEST_REACTIONS = 'Guest reactions',
  RECEPTION = 'Reception',
  SPEECHES = 'Speeches',
  CAKE_CUTTING = 'Cake cutting',
  GUESTS_DANCING = 'Guests dancing',
  CANDID_TABLE_SHOTS = 'Candid table shots',
  KIDS_PLAYING_GUESTS_MINGLING = 'Kids playing or guests mingling',
  DETAILS = 'Details',
  TABLE_DECOR = 'Table decor',
  FLOWERS = 'Flowers',
  SIGNAGE = 'Signage',
  PLACE_CARDS_MENUS = 'Place cards and menus',
  GUEST_BOOK_FAVOURS = 'Guest book or favours',
  EXTERIOR_WIDE_SHOTS = 'Exterior wide shots',
  ROOM_SETUP_BEFORE_GUESTS = 'Room setup before guests arrive',
  NIGHTTIME_VENUE_LIGHTS = 'Nighttime venue lights',
  OTHER = 'Other',
}

// // === VENDOR ENUMS ===
// export enum VendorTypes {
//   OFFICIANT = 'Officiant',
//   WEDDING_PLANNER = 'Wedding Planner',
//   PHOTOGRAPHER = 'Photographer',
//   VIDEOGRAPHER = 'Videographer',
//   DJ = 'DJ',
//   BAND = 'Band',
//   FLORIST = 'Florist',
//   CATERER = 'Caterer',
//   VENUE = 'Venue',
//   MAKEUP_ARTIST = 'Makeup Artist',
//   HAIR_STYLIST = 'Hair Stylist',
//   TRANSPORTATION = 'Transportation',
//   OTHER = 'Other',
// }

export const PROJECT_STATUS = Object.values(ProjectStatus);
export const PROJECT_TYPES = Object.values(ProjectType);
export const EVENT_STYLES = Object.values(EventStyle);
export const PRONOUNS = Object.values(Pronoun);
export const RELATIONSHIP_TO_COUPLE = Object.values(RelationshipToCouple);
export const CONTACT_TYPES = Object.values(ContactType);
export const LOCATION_TYPES = Object.values(LocationType);
// export const TIMELINE_EVENT_TYPES = Object.values(TimelineEventType);
// export const TIMELINE_EVENT_ICONS = Object.values(TimelineEventIcon);
export const PHOTO_REQUEST_TYPES = Object.values(PhotoRequestType);
export const IMPORTANCE_LEVELS = Object.values(ImportanceLevel);
export const GROUP_SHOT_CATEGORIES = Object.values(GroupShotCategory);
export const COUPLE_SHOT_CATEGORIES = Object.values(CoupleShotCategory);
export const CANDID_SHOT_CATEGORIES = Object.values(CandidShotCategory);
// export const VENDOR_TYPES = Object.values(VendorTypes);
export const NOTIFICATION_TYPE = Object.values(NotificationType);

// TypeScript enums automatically create both the enum and its type, so no additional type aliases needed