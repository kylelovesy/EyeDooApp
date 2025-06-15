SRS
Software Requirements Specification: Wedding Photographer's Assistant App
System Design
● Client: Cross-platform mobile application built using React Native with Expo.
● Backend: Primarily serverless using Firebase services.
○ Database: Cloud Firestore for structured data storage.
○ Authentication: Firebase Authentication for user management.
○ Cloud Functions (Optional): Firebase Functions for specific backend logic (e.g., complex data transformations, or securely calling third-party APIs like weather if client-side keys are undesirable).
● External Services Integration:
○ Google Maps API (via Google Places API or similar) for address lookup and validation within the questionnaire.
○ A weather API for hourly forecasts.
Architecture pattern
● Client (React Native): Component-based architecture.
○ Emphasis on reusable components for form elements, list items, and navigation elements.
● Backend (Firebase): Service-oriented, leveraging Firebase SDKs for direct client-to-service interaction.
State management
● Client-Side:
○ React Context API or a lightweight global state manager (e.g., Zustand, Jotai) for:
■ User authentication status.
■ Overall questionnaire completion status and individual section progress.
■ Active wedding project data being viewed or edited.
○ Component-level state (React Hooks) for local UI interactions, form inputs within questionnaire sections, and modal states.
Data flow
● Questionnaire Data Entry: User inputs data into specific questionnaire sections. Form data is validated client-side.
● Local State Update: Input data updates local component state and potentially a temporary draft state for the current questionnaire section.
● Saving/Progress Update: On section completion or explicit save, data is prepared and sent to Cloud Firestore. Questionnaire progress on the root screen is updated.
● Data Retrieval: Wedding project data, including all questionnaire answers, timeline events, and shot lists, is fetched from Firestore when a project is opened.
● Timeline Population: Location and timing data from Questionnaire 1 directly populates the initial state of the Timeline (Questionnaire 2), which is then further editable.
● Shot List Population: User inputs from Questionnaire 4 (Photography Plan & Shot Lists) inform the initial content of the respective four shot list categories.
● Real-time Updates (Optional): Firebase real-time listeners can be used for specific features if needed, though not a primary requirement for core questionnaire/planning.
Technical Stack
● Frontend Framework: React Native (using Expo SDK)
● Programming Language: JavaScript (ES6+) or TypeScript (recommended for type safety and improved AI tool compatibility)
● Backend Services:
○ Firebase Authentication
○ Cloud Firestore (NoSQL Database)
○ Firebase Functions (Node.js - JavaScript/TypeScript) - if needed
● Navigation: React Navigation
● Form Handling: Standard React Native components, potentially enhanced with a form management library (e.g., React Hook Form) for complex validation and state handling in questionnaires.
● Map Integration: A library like react-native-maps along with direct API calls to Google Places API for address lookup.
● Drag-and-Drop: A library for React Native drag-and-drop functionality (for ordering locations).
● API Clients:
○ Firebase SDK for JavaScript
○ Standard fetch API or Axios for third-party API calls (Weather API, Google Places API).
● Development Tools:
○ Cursor, Firebase Studio (as preferred by the developer)
○ Expo CLI, npm/Yarn, Git
Authentication Process
● Method: Firebase Authentication (Email/Password, Google Sign-In, or other OAuth providers).
● Flow: Standard Firebase authentication flow. User sessions are managed by the SDK, and Firestore security rules protect user-specific data.
Route Design
● Managed by React Navigation.
● Core Routes:
○ /auth (Stack for login, signup, etc.)
○ /dashboard (Main app dashboard, potentially listing wedding projects)
○ /wedding/:weddingId/questionnaire (Questionnaire Root Screen)
○ /wedding/:weddingId/questionnaire/essentials (Questionnaire 1: Essential Information)
○ /wedding/:weddingId/questionnaire/timeline-review (Questionnaire 2: Timeline editing interface)
○ /wedding/:weddingId/questionnaire/people (Questionnaire 3: People & Roles)
○ /wedding/:weddingId/questionnaire/shotplan (Questionnaire 4: Shot Lists & Photography Plan)
○ /wedding/:weddingId/questionnaire/finaltouches (Questionnaire 5: Final Touches & Vendor Info)
○ /wedding/:weddingId/main-dashboard (Specific wedding project overview dashboard)
○ /wedding/:weddingId/timeline (Interactive Wedding Day Timeline screen)
○ /wedding/:weddingId/checklists/requested
○ /wedding/:weddingId/checklists/group
○ /wedding/:weddingId/checklists/couple
○ /wedding/:weddingId/checklists/general
○ /wedding/:weddingId/packinglist
○ /wedding/:weddingId/warnings
○ /settings
API Design
● Backend APIs (Firebase):
○ Interaction via Firebase SDKs for Firestore (CRUD operations on collections like weddings, locations, timelineEvents, people, shots, etc.) and Authentication.
● Third-Party APIs:
○ Google Places API (for address lookup in Questionnaire 1):
■ GET https://maps.googleapis.com/maps/api/place/autocomplete/json?input={searchText}&key={apiKey}&types=address
■ GET https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={apiKey}&fields=address_components,formatted_address,geometry
○ Weather API (Example):
■ GET /weather?lat={latitude}&lon={longitude}&appid={apiKey}&units=metric (or similar, based on chosen provider)
Database Design ERD (Cloud Firestore - NoSQL Document Model)
● users Collection:
○ Document ID: userId (from Firebase Auth)
○ Fields:
■ email: String
■ createdAt: Timestamp
● weddings Collection:
○ Document ID: Auto-generated weddingId
○ Fields:
■ userId: String (Foreign Key to users.userId)
■ Questionnaire 1 - Couple Info:
● personA_pronouns: String (from Dropdown)
● personA_firstName: String * [cite: 1]
● personA_surname: String [cite: 1]
● personA_email: String (validated) * (conditionally required) [cite: 1]
● personA_phone: String (validated) * (conditionally required) [cite: 1]
● personB_pronouns: String (from Dropdown)
● personB_firstName: String * [cite: 1]
● personB_surname: String [cite: 2]
● personB_email: String (validated) * (conditionally required) [cite: 2]
● personB_phone: String (validated) * (conditionally required) [cite: 2]
● sharedWeddingEmail: String (validated) [cite: 2]
● weddingVibeStyle: String [cite: 2]
■ Questionnaire 1 - Wedding Essentials:
● weddingDate: Timestamp * [cite: 2]
■ Questionnaire Progress Tracking:
● questionnaireProgress: Object (e.g., { q1_essentials_complete: Boolean, q2_timeline_reviewed: Boolean, ... })
■ Questionnaire 4 - Photography Plan (General):
● mustHaveMoments: String [cite: 6]
● sentimentalItemsToPhotograph: String [cite: 6]
■ Questionnaire 4 - Sensitivities & Surprises (links to Warnings):
● sensitiveFamilySituations: String (private note if Yes) [cite: 15]
● guestsNotToBePhotographed: String (private note if Yes) [cite: 16]
● plannedSurprises: String (private note if Yes) [cite: 17]
■ Questionnaire 5 - Final Touches & Vendor Info:
● otherVendors: Array of Objects (e.g., { type: String, name: String, contact: String }) [cite: 18]
● clientAdditionalNotes: String [cite: 18]
● referralSource: String [cite: 19]
■ createdAt: Timestamp
■ updatedAt: Timestamp
● locations Sub-collection (under each wedding document): (Handles repeatable, orderable locations from Questionnaire 1) [cite: 2]
○ Document ID: Auto-generated locationId
○ Fields:
■ locationType: String (from Dropdown, e.g., "Main Venue", "Ceremony", "Getting Ready Location A") * [cite: 2]
■ locationAddress_formatted: String (from map lookup) * [cite: 2]
■ locationAddress_details: Object (components from map lookup)
■ arriveTime: Timestamp (or String) [cite: 3]
■ leaveTime: Timestamp (or String) [cite: 3]
■ locationContactPerson: String [cite: 3]
■ locationContactPhone: String [cite: 3]
■ locationNotes: String [cite: 3]
■ orderIndex: Number (for drag-and-drop ordering) [cite: 2]
● timelineEvents Sub-collection (under each wedding document): (Populated from locations, then editable via Questionnaire 2 UI) [cite: 4]
○ Document ID: Auto-generated eventId
○ Fields:
■ title: String [cite: 5]
■ startTime: Timestamp [cite: 5]
■ endTime: Timestamp (optional) [cite: 5]
■ icon: String (name/reference to an icon, auto-set based on type or user-selected) [cite: 4, 5]
■ locationId: String (Optional FK to locations if needed for cross-reference)
■ alertSettings: Object (e.g., { enabled: Boolean, minutesBefore: Number, type: ['vibrate', 'sound'] }) [cite: 5]
● people Sub-collection (under each wedding document): (From Questionnaire 3)
○ Document ID: Auto-generated personId
○ Fields:
■ category: String (e.g., "Parent", "Grandparent", "WeddingParty", "OtherKeyContact")
■ name: String
■ roleOrRelationship: String (e.g., "Mother of Bride", "Best Man", "Officiant")
■ contactInfo: String (optional)
● shotListInputs Object (within wedding document or own sub-collection): (Stores direct input from Questionnaire 4)
○ requestedShots_promptResponse: String [cite: 8]
○ groupShots_promptResponse: Array of Objects (e.g., { description: String, notes: String }) [cite: 9]
○ coupleShots_inspirationResponse: String [cite: 11]
○ generalShots_detailsResponse: String [cite: 13]
● shots Sub-collection (under each wedding document): (This is the interactive checklist data, informed by shotListInputs and pre-defined/custom additions)
○ Document ID: Auto-generated shotId
○ Fields:
■ description: String
■ category: String ("requested", "group", "couple", "general")
■ isCompleted: Boolean
■ notes: String (optional)
■ imageUrl: String (optional, for thumbnail if pre-defined)
■ priority: Number (optional, for sorting, esp. group shots)
■ source: String (e.g., "questionnaire_requested", "questionnaire_group_idea", "predefined_couple", "custom_general")
● packingListItems Sub-collection (under each wedding document, or global per user):
○ Document ID: Auto-generated itemId
○ Fields:
■ itemName: String
■ isChecked: Boolean
■ category: String (optional)
● warningNotes Sub-collection (under each wedding document): (For data from Questionnaire 4 Sensitivities/Surprises, or manually added)
○ Document ID: Auto-generated noteId
○ Fields:
■ noteText: String
■ source: String (e.g., "questionnaire_family_situation", "manual")
■ createdAt: Timestamp
PRD
Product Requirements Document: Wedding Photographer's Assistant App
1. Elevator Pitch
This app takes the stress out of photographing a wedding by providing wedding photographers with robust tools for comprehensive organisation through a structured multi-section questionnaire, meticulous planning with an auto-populated and editable timeline, detailed shot list management across four key categories, and discreet alerts for sensitive situations, ensuring they can focus on capturing beautiful memories.
2. Who is this app for?
Wedding photographers.
3. Functional Requirements
● Wedding Project Management:
○ Users can create new wedding projects or open existing/saved ones.
● Questionnaire Root Screen:
○ A dedicated screen for each wedding project that provides access to distinct questionnaire sections.
○ Displays each questionnaire section as a clearly defined button or tappable area.
○ Shows a visual progress indicator for each section (e.g., "Not Started," "In Progress," "Completed," or progress bar/ring).
○ Displays an overall progress summary for the entire questionnaire.
● Multi-Section Questionnaire: (Accessible from the Questionnaire Root Screen)
○ Questionnaire 1: Essential Information [cite: 1]
■ Section A - Couple's Information: [cite: 1]
● Person A: Preferred Pronouns (Dropdown), First Name (text entry, required)[cite: 1], Surname (text entry)[cite: 1], Contact Email (text entry, required if phone not provided, email validation)[cite: 1], Contact Phone (text numeric entry, required if email not provided, phone validation)[cite: 1].
● Person B: Preferred Pronouns (Dropdown)[cite: 1], First Name (text entry, required)[cite: 1, 2], Surname (text entry)[cite: 2], Contact Email (text entry, required if phone not provided, email validation)[cite: 2], Contact Phone (text numeric entry, required if email not provided, phone validation)[cite: 2].
● Shared/Wedding Email Address (text entry, email validation)[cite: 2].
● Client's description of wedding vibe/style (text entry)[cite: 2].
■ Section B - Wedding Essentials: [cite: 2]
● Wedding Date (Date Picker, required)[cite: 2].
● Location Information (Repeatable section for each location, drag and drop to set order, required)[cite: 2].
○ Location Type (Dropdown, required, e.g., Main Venue, Ceremony, Getting Ready Location A, Getting Ready Location B, Reception)[cite: 2].
○ Location Address (text entry, with map lookup, required)[cite: 2, 3].
○ Arrive Time (time picker)[cite: 3].
○ Leave Time (time picker)[cite: 3].
○ Location Contact Person (text entry)[cite: 3].
○ Location Contact Phone (text numeric entry)[cite: 3].
○ Location Notes (text entry, e.g., parking, room number)[cite: 3].
○ Questionnaire 2: Timeline Input & Review
■ The system will auto-populate an initial wedding day timeline based on the Arrive Time, Leave Time, and Location Type data entered in "Questionnaire 1: Essential Information > Section B - Wedding Essentials"[cite: 4]. Icons will be auto-set based on location type[cite: 4].
■ Users can view and edit this timeline.
■ Ability to add new timeline entries via a modal, specifying start time, end time, icon, and title[cite: 4, 5].
■ Ability to click an existing timeline entry to open a modal allowing removal of the entry or setting of audible/vibrate alerts before the entry[cite: 5].
○ Questionnaire 3: People & Roles [cite: 5]
■ Parents: Names (Specify relationship)[cite: 5].
■ Grandparents: Names (Specify side/relationship - Optional)[cite: 5].
■ Wedding Party / Bridal Party: (Repeatable section for each member) Full Name, Role, Relationship to Couple (Optional)[cite: 5].
■ Other Key People: Officiant, Wedding Planner, Videographer, DJ/Band (Names & Contacts - Optional)[cite: 5].
○ Questionnaire 4: Shot Lists & Photography Plan [cite: 5]
■ Must-have specific moments (beyond standard ones - Free text)[cite: 6].
■ Specific items of sentimental value to photograph (Free text)[cite: 6].
■ Shot List Inputs (to populate the app's checklists):
● Requested Shots: Prompt to describe unique shots[cite: 6, 7]. Input via free text area[cite: 8].
● Group Shots: Prompt to list formal group combinations[cite: 8]. Input via repeatable fields for each group description, with optional notes per group[cite: 9].
● Couple Shots (Ideas/Inspiration): Prompt for styles, locations, poses for couple's session[cite: 10]. Input via free text area[cite: 11].
● General Shots (Key Details/Candids): Prompt for specific details, decor, or candid moments[cite: 12]. Input via free text area[cite: 13, 14].
■ Sensitivities & Surprises (for photographer's private notes/Warnings screen):
● Family situations or relationships to be aware of? (Yes/No + private notes field)[cite: 15, 16].
● Guests not to be photographed or with privacy concerns? (Yes/No + private notes field)[cite: 16, 17].
● Surprises planned photographer should know about? (Yes/No + private notes field)[cite: 17, 18].
○ Questionnaire 5: Final Touches & Vendor Info [cite: 13]
■ Other Vendors: Florist, Cake Maker, Hair Stylist, Makeup Artist (Names/Contacts - Optional)[cite: 18].
■ Client's Additional Notes (Free text)[cite: 18, 19].
■ Referral source (Optional)[cite: 19].
● Main Dashboard Screen:
○ Displays key wedding information at a glance (populated from questionnaire): Couple's names, key venue details with Google Maps link, hourly weather forecast.
● Wedding Day Timeline (Interactive):
○ Displays a chronological timeline of wedding day events, initially populated from Questionnaire 1 [cite: 4] and editable as per Questionnaire 2 functional requirements[cite: 4, 5].
○ Customizable events, timings, titles, and icons[cite: 5].
○ Optional alerts (audible and/or vibrate) settable for each entry[cite: 5].
● Shot Checklists (Four Categories):
○ Separate checklists for "Requested Shots," "Group Shots," "Couple Shots," and "General Shots."
○ Shot lists are informed by inputs from "Questionnaire 4: Shot Lists & Photography Plan"[cite: 6, 7, 8, 9, 10, 11, 12, 13, 14].
○ Ability to add custom shots to each list (e.g., via a modal after clicking "Add Custom Shot")[cite: 6].
○ Option to select shots from pre-prepared lists (similar to UI mockup provided)[cite: 6].
○ Ability to mark shots as completed (e.g., checkbox on the right, visually greyed out).
○ Group Shots can be sorted by priority (if this requirement is maintained).
○ Optional expandable view for more details if applicable.
● Preparation/Kit Packing Checklist:
○ A dedicated screen for a preparation or kit packing checklist. Users can create/manage items.
● Warnings Screen:
○ A dedicated private screen for the photographer to add/review notes about potential conflict areas or sensitive situations, populated from "Questionnaire 4" inputs [cite: 15, 16, 17, 18] or manual entry.
4. User Stories
● Questionnaire & Setup:
○ As a photographer, I want to access a main questionnaire screen for each wedding, so I can see all questionnaire sections and their completion status at a glance.
○ As a photographer, I want to be able to navigate to any individual questionnaire section (e.g., Essential Info, Locations, People, Shot Lists, Final Touches) from the root screen, so I or my client can fill them out in any order.
○ As a photographer, when filling out location information in the questionnaire, I want to be able to add multiple locations, specify their type, address (with map lookup), timings, and notes, and be able to reorder these locations via drag and drop[cite: 2].
○ As a photographer, after inputting initial location and timing information in Questionnaire 1, I want the app to auto-populate a baseline wedding day timeline in Questionnaire 2[cite: 4], which I can then review and customize.
● Timeline Management:
○ As a photographer, on the wedding day (and during planning), I want to easily view the timeline of events so I know what is happening next and when.
○ As a photographer, I want to be able to add, edit, or delete timeline entries, and set reminders for them, through an intuitive interface[cite: 5].
● Shot List Management:
○ As a photographer, I want to input specific client shot requests, group shot lists, ideas for couple photos, and notes on general shots through the questionnaire[cite: 6, 7, 8, 9, 10, 11, 12, 13, 14], so this information automatically informs my main shot checklists.
○ As a photographer, for each of the four categories (Requested, Group, Couple, General), I want a dedicated checklist where I can see items from the questionnaire, add more custom shots, or select from pre-defined company standard shots[cite: 6].
○ As a photographer, during the wedding, I want to quickly mark shots as completed on their respective checklists.
● Accessing Information & Preparation:
○ As a photographer, I want to easily access key wedding details (couple names, venue, weather) on a main dashboard.
○ As a photographer, I want a private "Warnings" screen to review sensitive information gathered from the questionnaire or my own notes, so I can manage delicate situations effectively.
○ As a photographer, before the wedding day, I want to access a kit packing checklist.
5. User Interface
● Overall Look and Feel: Minimalistic and highly functional, with a calm, modern professional aesthetic.
● Navigation: Main navigation primarily via a bottom navigation bar. Navigation within the questionnaire will be via a root screen with clear buttons to each section.
● Visual Cues: Progress indicators for questionnaire completion. Completed checklist items visually distinct. Clear alerts. Modals for focused tasks like timeline editing or adding custom shots[cite: 5, 6].
UIDD
User Interface Design Document: Wedding Photographer's Assistant App
Layout Structure
● Questionnaire Root Screen:
○ A dedicated screen for each wedding project, providing an overview and entry points to the questionnaire.
○ Features a clear title (e.g., "Wedding Questionnaire for [Couple's Names]").
○ Lists distinct questionnaire sections (e.g., "Essential Information," "Schedule & Locations," "People & Roles," "Photography Plan & Shot Lists," "Final Touches & Vendor Info"). Each section will be presented as a large, easily tappable button or card.
○ Each section button will display its title and a visual progress indicator (e.g., a small progress bar, a status icon/text like "Not Started," "In Progress [X%]," "Completed").
○ An overall questionnaire completion status (e.g., "Total Progress: X/5 sections completed") will be prominently displayed.
● Individual Questionnaire Sections:
○ Each section will open as a new screen or a clearly demarcated area.
○ Content will be organized in a single-column, scrollable layout, optimized for mobile.
○ Clear headings will be used for sub-sections within each questionnaire (e.g., "Section A - Couple's Information," "Section B - Wedding Essentials")[cite: 1].
○ Repeatable sections (e.g., "Location Information"[cite: 1], "Wedding Party / Bridal Party" [cite: 3]) will have clear "Add Another" buttons and intuitive controls (e.g., "X" icon) to remove entries.
○ For orderable items like "Location Information"[cite: 1], drag handles or up/down arrows will be provided for reordering.
● Main Application Screens:
○ Dashboard: Card-based layout for key information.
○ Timeline: Vertical, chronological list with icons and time slots, as depicted in the uploaded file[cite: 3, 4].
○ Shot Checklists: Vertical lists, potentially with thumbnail previews for shots as shown in the "Requested Shots" mockup[cite: 5]. Each of the four categories (Requested, Group, Couple, General) will have its own accessible list.
○ Other screens (Packing List, Warnings) will maintain a clean, list-based or form-based structure as appropriate.
Core Components
● Questionnaire Root Screen Components:
○ Section Buttons: Tappable elements with section title and progress indicator.
○ Overall Progress Bar/Indicator.
● Form Input Fields (for Questionnaires):
○ Text Entry: Standard input field with clear labels (e.g., "[First Name]," "[Surname]")[cite: 1], placeholders where appropriate (e.g., "# # contains field placeholder text" [cite: 1]), and tooltips/aria descriptions for clarity ("% % contains field tooltip text / aria description" [cite: 1]). For multi-line input like "Client's description of wedding vibe/style" [cite: 1] or shot list prompts[cite: 7, 8, 9, 10, 11, 12, 13], a text area will be used.
○ Dropdown Select: For fields like "Preferred Pronouns" [cite: 1] and "Location Type"[cite: 1].
○ Date Picker: Native OS styled date picker for "Wedding Date"[cite: 1].
○ Time Picker: Native OS styled time picker for "Arrive Time" and "Leave Time"[cite: 1].
○ Address Input with Map Lookup: A text field for address input, coupled with a button/icon to trigger a map interface (e.g., Google Places Autocomplete) to search and confirm the address[cite: 1].
○ Numeric Input: Optimized keyboard for fields like "Contact Phone"[cite: 1].
○ Checkbox / Yes/No Toggle: For questions like "Are there any family situations..."[cite: 15, 16].
● Repeatable Section Controls:
○ "Add [Item]" buttons (e.g., {Add Location}, {Add Wedding Party Member}).
○ Delete icon/button per repeatable item.
● Drag-and-Drop Handles: Visual cues (e.g., drag icon) for items that can be reordered[cite: 1].
● Modals:
○ For adding/editing Timeline entries: Input fields for start time, end time, icon, title, and alert settings[cite: 4, 5].
○ For adding custom shots to checklists (as suggested by "modal popup shown upon clicking add custom shot")[cite: 6].
● Checklist Components:
○ Standard items: Label text with a checkbox on the right.
○ Shot List items: May include a small thumbnail image preview next to the shot description and checkbox, as depicted in the uploaded "Wedding Day Checklist" image[cite: 5]. "Add Custom Shot" button prominently displayed[cite: 5].
● Timeline Display Components:
○ Vertical list items, each with an icon representing the event type, start/end times, and event title[cite: 3, 4].
○ A clear "+" button to add new timeline entries[cite: 3].
● Bottom Navigation Bar: Consistent across main app sections (Dashboard, Checklists, Timeline/Schedule, Warnings, Settings) with icons and text labels.
● Buttons: Clear call-to-action buttons (e.g., "Save Progress," "Next Section," "Submit") with rounded corners.
● Progress Indicators: Linear progress bars or circular progress indicators for questionnaire sections and overall completion.
Interaction Patterns
● Questionnaire Navigation:
○ Tap a section button on the Questionnaire Root Screen to navigate to that section.
○ Clear "Back" or "Save and Return to Overview" options within each section.
○ Automatic saving of input when moving between fields or sections, or a clear "Save" button per section.
● Form Input & Validation:
○ Real-time or on-blur validation for fields like email and phone, providing immediate feedback[cite: 1]. Required fields clearly marked[cite: 1].
○ Map lookup for addresses will open a search interface, and selecting a result will populate the address field.
● Repeatable & Orderable Sections:
○ Tapping "Add" creates a new blank item in the list.
○ Tapping "Delete" on an item prompts for confirmation before removal.
○ Long-press and drag (or dedicated handles) to reorder items in a list[cite: 1].
● Timeline Interaction:
○ Tapping the "+" button opens a modal to add a new timeline entry[cite: 3, 4, 5].
○ Tapping an existing entry opens a modal to edit or delete it, or set alerts[cite: 5].
● Shot List Interaction:
○ Tapping a checkbox marks a shot as complete/incomplete[cite: 5].
○ Tapping "Add Custom Shot" opens a modal or form to define a new shot[cite: 5, 6].
○ Interaction with pre-prepared lists will involve Browse and selecting shots to add to the current wedding's checklist[cite: 6].
● Data Synchronization: Data entered in Questionnaire 1 (Locations/Times) will automatically populate the initial Timeline[cite: 4]. Data from Questionnaire 4 (Shot List inputs) will inform the content of the respective shot checklists[cite: 6, 7, 8, 9, 10, 11, 12, 13, 14].
Visual Design Elements & Color Scheme
● Overall Feel: Minimalistic, modern, clean, calm, approachable, and highly functional, as previously established.
● Color Scheme: Sophisticated, muted primary color palette (e.g., off-whites, light greys, soft cool tones) with one primary calming but clear accent color (e.g., a soft, desaturated blue or gentle teal) for interactive elements, calls to action, active states, and progress indicators. Icons and text will have strong contrast against backgrounds.
● Iconography: High-quality, slightly stylized but universally understandable icons. Specific icons for timeline event types (getting ready, ceremony, reception, first dance, cake cutting as shown in the uploaded file)[cite: 3]. Icons also for navigation, add, delete, reorder, map lookup, etc.
● Thumbnails: Small image previews for shots in the shot lists where applicable[cite: 5].
● Depth: Subtle shadows or layering for cards, modals, and key interactive elements to provide hierarchy without clutter.
Mobile, Web App, Desktop considerations
The application remains mobile-first, designed for optimal use on smartphones by photographers in various environments. The questionnaire, timeline, and checklists are all designed with touch interaction in mind.
Typography
A friendly, highly readable, modern sans-serif typeface will be used. Clear typographic hierarchy (size, weight, color) will guide the user through questionnaire forms, dashboards, and lists. Labels for form fields will be clear and positioned for easy association with their respective inputs[cite: 1].
Accessibility
● Color Contrast: Adherence to WCAG AA guidelines for text, icons, and interactive elements.
● Touch Targets: All interactive elements, including form fields, buttons, checklist items, and navigation icons, will meet or exceed minimum touch target sizes.
● Form Field Labeling: All form fields will have clear, descriptive labels associated with them, as indicated in the questionnaire file[cite: 1]. Tooltips or helper text ("% %" [cite: 1]) will be used for complex fields if needed.
● Keyboard Navigation (for potential future web/desktop): Ensure logical tab order and focus indicators if a web version is ever developed.
● Screen Reader Compatibility: Use of semantic HTML (for React Native, appropriate accessibility props) to ensure content is understandable by screen readers.
Questionaaire
Wedding App Questionnaire Details
This document outlines the structure and content of the multi-section questionnaire within the Wedding Photographer's Assistant App. The questionnaire is accessed via a Questionnaire Root Screen, which displays each section below, along with its completion progress. Users can navigate to any section independently.
Questionnaire 1: Essential Information
Section A - Couple's Information
● Person A
○ [Preferred Pronouns]
■ (Dropdown)
■ Options: She/Her, He/Him, They/Them, Other, Prefer not to say
○ [First Name] *
■ (text entry)
○ [Surname]
■ (text entry)
○ [Contact Email] *
■ (text entry)
■ *$ either Email or Phone is required, email validation $ [cite: 1]
○ [Contact Phone] *
■ (text numeric entry)
■ *$ either Email or Phone is required, phone validation $ [cite: 1]
● Person B
○ [Preferred Pronouns]
■ (Dropdown)
■ Options: She/Her, He/Him, They/Them, Other, Prefer not to say
○ [First Name] * [cite: 2]
■ (text entry) [cite: 1]
○ [Surname] [cite: 2]
■ (text entry) [cite: 1]
○ [Contact Email] * [cite: 2]
■ (text entry) [cite: 1]
■ *$ either Email or Phone is required, email validation $ [cite: 2]
○ [Contact Phone] * [cite: 2]
■ (text numeric entry) [cite: 1]
■ *$ either Email or Phone is required, phone validation $ [cite: 2]
● [Shared/Wedding Email Address]
○ (text entry) [cite: 2]
○ *$ email validation $ [cite: 2]
● [Client's description of wedding vibe/style]
○ (text entry, multi-line) [cite: 2]
○ # # e.g., Romantic, Modern, Traditional, Fun, Relaxed, Formal # #
Section B - Wedding Essentials
● [Wedding Date] * [cite: 2]
○ (Date Picker) [cite: 2]
● [Location Information] *
○ *$ Repeatable section for each location and drag drop to set order $ [cite: 2]
○ Each location entry includes:
■ [Location Type] *
● (Dropdown) [cite: 2]
● *$ Options: Main Venue, Ceremony, Getting Ready Location A, Getting Ready Location B, Reception $ [cite: 2]
■ [Location Address] *
● (text entry) [cite: 3]
● *$ with map lookup $ [cite: 2]
■ [Arrive Time]
● (time picker) [cite: 3]
■ [Leave Time]
● (time picker) [cite: 3]
■ [Location Contact Person]
● (text entry) [cite: 3]
■ [Location Contact Phone]
● (text numeric entry) [cite: 3]
■ [Location Notes]
● (text entry, multi-line) [cite: 3]
● # # e.g., parking, room number # # [cite: 3]
Questionnaire 2: Timeline Configuration
● *$ This section is primarily an interactive screen for reviewing and editing the wedding day timeline. $ [cite: 4]
● *$ Initially populated with times and data from: Questionnaire 1: Essential Information > Section B - Wedding Essentials (Location Information: Location Type, Arrive Time, Leave Time). Icons are auto-set based on type. $ [cite: 4]
● Interactions:
○ {Plus button}: *$ Shows modal with option to add new timeline entry. $ [cite: 4]
■ *Modal options for setting start time / end time / icon / title. $ [cite: 5]
○ {Clicking timeline entry}: *$ Shows modal which allow removal of entry or setting of audible / vibrate alert before entry. $ [cite: 5]
Questionnaire 3: People & Roles
*$ (Focus: Identifying key individuals) $ [cite: 5]
● Parents
○ [Names of Person A's Parent(s)]
■ (text entry, repeatable for multiple parents/relationships)
■ # # e.g., Jane Doe (Mother), John Doe (Father) # #
○ [Names of Person B's Parent(s)]
■ (text entry, repeatable for multiple parents/relationships)
■ # # e.g., Mary Smith (Mother) # #
● Grandparents (Optional)
○ [Names of Grandparent(s) - Person A's side]
■ (text entry, repeatable)
○ [Names of Grandparent(s) - Person B's side]
■ (text entry, repeatable)
● Wedding Party / Bridal Party
○ *$ Repeatable section for each member $ [cite: 5]
○ Each member entry includes:
■ [Full Name] (text entry) [cite: 5]
■ [Role] (text entry or dropdown, e.g., Maid of Honor, Best Man, Bridesmaid, Groomsman, Flower Girl, Ring Bearer) [cite: 5]
■ [Relationship to Couple] (text entry, Optional) [cite: 5]
● Other Key People (Optional)
○ Each key person entry includes:
■ [Type of Contact] (Dropdown, e.g., Officiant, Wedding Planner, Videographer, DJ/Band)
■ [Name] (text entry) [cite: 5]
■ [Contact Details (Phone/Email)] (text entry) [cite: 5]
Questionnaire 4: Photography Plan & Shot Lists
*$ (Focus: Specific photographic requirements and client preferences) $ [cite: 5]
Key Moments & Style Preferences [cite: 5]
● [Must-have specific moments (beyond standard ones)]
○ (text entry, multi-line) [cite: 6]
○ # # e.g., A special family tradition, a specific pose with a pet # #
● [Specific items of sentimental value to photograph]
○ (text entry, multi-line) [cite: 6]
○ # # e.g., Grandmother's locket, handwritten vows display # #
Shot List Inputs (to populate the app's checklists)
● Requested Shots
○ [Prompt] "Are there any absolutely unique, specific shots you've envisioned or seen that don't fit into typical categories? (e.g., a photo with a special pet, recreating an old family photo, a specific artistic composition)." [cite: 7]
○ [Input] (text entry, multi-line) [cite: 8]
● Group Shots
○ [Prompt] "Please list all formal group combinations you require. (e.g., Couple with Person A's parents & siblings; Couple with full wedding party; Person B with their university friends)." [cite: 9]
○ [Input] (Repeatable fields to add each group description. Each group includes:) [cite: 9]
■ [Group Description] (text entry)
■ [Optional Notes] (text entry) # # e.g., Ensure Aunt Mary is central # #
● Couple Shots (Ideas/Inspiration)
○ [Prompt] "For your dedicated couple portrait session, are there any particular styles, locations on-site, or poses you like? (e.g., romantic sunset photos, fun and playful, dramatic architectural backdrop)." [cite: 10]
○ [Input] (text entry, multi-line) [cite: 11]
● General Shots (Key Details/Candids)
○ [Prompt] "Are there any specific details (e.g., decor, cake, rings, shoes, stationery) or types of candid moments you particularly want us to focus on capturing throughout the day?" [cite: 12]
○ [Input] (text entry, multi-line) [cite: 13]
Sensitivities & Surprises *$ (for photographer's private notes -> links to "Warnings" feature) $ [cite: 15]
● [Are there any family situations or relationships the photographer should be aware of?]
○ (Yes/No Toggle or Dropdown) [cite: 16]
○ [Private Notes] (text entry, multi-line, conditional on "Yes") [cite: 16]
● [Are there any guests who should not be photographed or have privacy concerns?]
○ (Yes/No Toggle or Dropdown) [cite: 17]
○ [Private Notes] (text entry, multi-line, conditional on "Yes") [cite: 17]
● [Are there any surprises planned that the photographer should know about to capture them effectively?]
○ (Yes/No Toggle or Dropdown) [cite: 18]
○ [Private Notes] (text entry, multi-line, conditional on "Yes") [cite: 18]
Questionnaire 5: Final Touches & Vendor Info
● Other Vendors (Optional) [cite: 18]
○ *$ Repeatable section for each vendor $
○ Each vendor entry includes:
■ [Vendor Type] (Dropdown, e.g., Florist, Cake Maker, Hair Stylist, Makeup Artist) [cite: 18]
■ [Name] (text entry)
■ [Contact Details (Phone/Email/Website)] (text entry)
● [Client's Additional Notes]
○ [Prompt] "Is there anything else important for the day that the photographer should know?" [cite: 18]
○ [Input] (text entry, multi-line) [cite: 19]
● [Referral] (Optional) [cite: 19]
○ [Prompt] "How did you hear about us?" [cite: 19]
○ [Input] (text entry)
Branding Content
Content and Branding Document: Wedding Photographer's Assistant App
1. Introduction
This document provides comprehensive guidelines for the content and branding of the Wedding Photographer's Assistant App. Its purpose is to ensure consistency in communication, visual identity, and user experience, reflecting all current design and feature specifications.
2. Brand Identity & Essence
2.1. App Name / Descriptor
● Working Title: Wedding Photographer's Assistant App [cite: 11]
● Descriptor: A mobile application designed to help wedding photographers organize, plan, and execute wedding day photography with ease and professionalism.
2.2. Brand Essence
● Organized, Calm, Focused, Supportive, Professional. [cite: 19]
● The app is a reliable assistant that empowers wedding photographers to manage their day seamlessly, ensuring they can focus on creativity and capturing memories. [cite: 19]
2.3. Core Value Proposition / Elevator Pitch
● "Take the stress out of photographing a wedding. Robust tools for organisation, meticulous planning, on-the-day guidance, and discreet alerts ensure you focus on capturing beautiful memories." [cite: 82] (This aligns with the app's comprehensive features, including the detailed questionnaire and alerts).
2.4. Target Audience
● Primary: Wedding photographers (professional, semi-professional).
● Characteristics: Busy, value efficiency, need reliable tools, appreciate clarity and ease of use, often working under pressure.
2.5. Brand Personality / Tone of Voice
● Professional & Reliable: The app is a dependable tool for critical tasks.
● Calm & Reassuring: Language and interactions should reduce stress. This is key for guiding users through the comprehensive questionnaire.
● Clear & Concise: Instructions, labels, and prompts should be easy to understand.
● Helpful & Supportive: The app acts as an assistant.
● Approachable & Modern: Contemporary and user-friendly feel.
3. Visual Branding
3.1. Logo Concept
● Core Idea: The logo aims to be simple, memorable, and evocative of the app's core functions: weddings, photography, and organized assistance. [cite: 1]
● It will blend elements of a camera aperture, a subtle checkmark, and a sense of completeness or embrace. [cite: 2]
● Visual Description:
○ Shape & Form: A stylized, minimalist camera aperture with fewer, softer, slightly rounded "blades." [cite: 3, 4]
○ Central Element: The negative space or two "blades" subtly form a checkmark (✓), representing task completion and organization. [cite: 5, 6]
○ Enclosure (Optional): A thin, elegant, incomplete ring may partially encircle the aperture/checkmark, hinting at a wedding band, modernity, and openness. [cite: 6, 7]
○ Simplicity: Clean lines and simple geometric forms for easy vector/SVG translation and scalability. [cite: 8, 9]
○ Memorability: Aims for easy recall through a unique combination of familiar elements. [cite: 10]
● Responsiveness:
○ Full Logo/Logotype: Icon accompanied by the app name "Wedding Photo Assistant" or "Photo Assist" in the brand font. [cite: 11] Text positioned to the right or below. [cite: 12]
○ Icon/Logomark: Standalone aperture/checkmark symbol for small applications like app icons or UI elements. [cite: 12, 13, 14]
○ Monochrome Version: Must work effectively in a single color. [cite: 15]
● Example (Textual Representation of Core Icon): Imagine a circle of 3-4 softly curved segments, with two slightly more prominent or angled to create a subtle "V" (checkmark) at the center. [cite: 16, 17]
3.2. Color Palette
● Designed to be sophisticated and calming, promoting focus and ease of use, with clear accents for interactivity. [cite: 21]
● Primary Backgrounds & Cards:
○ Off-White: #F8F9FA (For main backgrounds, providing a bright, clean base) [cite: 22]
○ Light Grey: #E9ECEF (For card backgrounds or subtle sectioning) [cite: 22]
○ Desaturated Cool Tone (Light Blue-Grey): #DDE2E7 (Alternative for cards or cooler accents) [cite: 22]
● Primary Accent Color:
○ Gentle Teal: #66C5CC (Used for interactive elements, calls to action, active states, important highlights, and potentially the logo) [cite: 22]
● Secondary Accent Color (for critical alerts/highlights):
○ Bolder Teal: #4AAEA5 (A slightly bolder, more saturated version of Gentle Teal) [cite: 22, 23]
○ Alternatively, a muted complementary color like a soft coral could be tested. [cite: 23]
● Text Colors:
○ Dark Grey (Primary Text): #343A40 (For excellent readability) [cite: 24]
○ Medium Grey (Secondary Text/Labels): #6C757D (For less emphasized text, captions, disabled states) [cite: 24]
● Utility Colors:
○ Success Green (Optional, for confirmation messages): #28A745 (Use sparingly) [cite: 24]
○ Warning Orange/Yellow (For non-critical warnings): #FFC107 (Use sparingly) [cite: 24]
● Color Usage Notes:
○ Emphasis on generous white space. [cite: 24]
○ Sufficient color contrast between text and backgrounds should meet WCAG AA guidelines. [cite: 25, 26]
3.3. Typography
● A friendly, highly readable, modern sans-serif typeface will be used. [cite: 27]
● Primary Typeface: Nunito Sans [cite: 28]
○ Rationale: Well-balanced, modern, rounded terminals for a friendly feel, wide range of weights, excellent legibility on digital screens. [cite: 28, 29]
○ Weights to be used:
■ Regular (400): For body text, descriptions. [cite: 30]
■ SemiBold (600): For sub-headers, emphasis, button text. [cite: 31]
■ Bold (700): For main headers (H1, H2). [cite: 31]
■ Light (300) (Optional): For delicate text elements, ensuring readability. [cite: 32]
● Typographic Hierarchy: (Point sizes are illustrative and should be adapted) [cite: 33, 34]
○ H1 (Screen Titles): Nunito Sans Bold, e.g., 24pt [cite: 34]
○ H2 (Major Section Titles): Nunito Sans Bold, e.g., 20pt [cite: 34]
○ H3 (Sub-Section Titles/Card Titles): Nunito Sans SemiBold, e.g., 18pt [cite: 34]
○ Body Text: Nunito Sans Regular, e.g., 16pt [cite: 34]
○ Labels & Captions: Nunito Sans Regular or SemiBold, e.g., 14pt [cite: 34]
○ Button Text: Nunito Sans SemiBold, e.g., 16pt [cite: 34]
3.4. Iconography Style
● Style: High-quality, slightly stylized but universally understandable. [cite: 35]
● Appearance: Clean lines, consistent stroke weight, easily recognizable, aligning with minimalist aesthetic. [cite: 36] Consider primarily outline icons, potentially with filled versions for active/selected states. [cite: 37]
● Source: Use a cohesive icon library (e.g., Material Icons, Feather Icons, or custom). [cite: 38]
● Color: Typically use Primary Accent Color (#66C5CC) or Text Colors (#343A40, #6C757D). [cite: 39]
● Touch Targets: Minimum 44x44dp/pt for interactive icons. [cite: 40] Bottom navigation icons accompanied by text labels. [cite: 41]
3.5. UI Element Styling (Based on UIDD & WeddingPhotoAssistBranding)
● Buttons: Clear CTAs, rounded corners, primary accent color. [cite: 42, 43] Subtle shadows/gradients used minimally. [cite: 43]
● Cards: Rounded corners, softer feel, subtle background colors (e.g., Light Grey #E9ECEF), minimal shadows. [cite: 44, 45, 46]
● Checklists: Clear checkbox, completed items visually differentiated (greyed out/strikethrough with accent). [cite: 47, 48] Expandable items use clear visual cues (e.g., chevron). [cite: 49]
● Input Fields: Clearly labeled, friendly readable text, simple clean borders. [cite: 50, 51]
● Modals: Unobtrusive, consistent with overall UI. [cite: 52, 53]
● Navigation: Bottom navigation bar for main sections. [cite: 54]
● Overall Feel: Generous white space, clear visual hierarchy, focus on functionality and calmness. [cite: 55] Subtle dividers or background variations to structure information. [cite: 56]
4. Content: In-App Text & Communication
4.1. General App Text
● App Name Idea (if not set): "WedLock Flow", "Momentum Weddings", "ShootSync Weddings", "FocusFrame Day" [cite: 81]
● Splash Screen Text (after app name/logo): "Capturing Your Vision, Seamlessly." or "Your Wedding Day, Organized." [cite: 81, 82]
4.2. Questionnaire Content & Structure
● Questionnaire Root Screen:
○ Title: "Wedding Questionnaire: [Couple's Names]"
○ Helper Text: "Complete each section to build a comprehensive plan for the wedding day. Your progress is saved as you go."
○ Displays distinct, tappable sections with progress indicators.
● Questionnaire 1: Essential Information
○ Section Title: "Essential Information"
○ Subsection A - Couple's Information:
■ Field Label: [Person A Preferred Pronouns] (Dropdown: She/Her, He/Him, They/Them, Other, Prefer not to say)
■ Field Label: [Person A First Name] * (text entry)
■ Field Label: [Person A Surname] (text entry)
■ Field Label: [Person A Contact Email] * (text entry, email validation, note: "$ either Email or Phone is required")
■ Field Label: [Person A Contact Phone] * (text numeric entry, phone validation, note: "$ either Email or Phone is required")
■ (Repeat for Person B)
■ Field Label: [Shared/Wedding Email Address] (text entry, email validation)
■ Field Label: [Client's description of wedding vibe/style] (text entry, multi-line, placeholder: "# # e.g., Romantic, Modern, Traditional, Fun, Relaxed, Formal # #")
○ Subsection B - Wedding Essentials:
■ Field Label: [Wedding Date] * (Date Picker)
■ Group Label: [Location Information] * (Repeatable section, drag-and-drop to order)
● Field Label: [Location Type] * (Dropdown: Main Venue, Ceremony, Getting Ready Location A, Getting Ready Location B, Reception)
● Field Label: [Location Address] * (text entry, with map lookup)
● Field Label: [Arrive Time] (time picker)
● Field Label: [Leave Time] (time picker)
● Field Label: [Location Contact Person] (text entry)
● Field Label: [Location Contact Phone] (text numeric entry)
● Field Label: [Location Notes] (text entry, multi-line, placeholder: "# # e.g., parking, room number # #")
● Questionnaire 2: Timeline Configuration
○ Screen Title: "Review & Build Timeline"
○ Helper Text: "This timeline is initially populated from your 'Location Information'. Add, edit, or remove events as needed."
○ (Interactions as described in UIDD/SRS: view auto-populated timeline, add/edit/delete entries via modal, set alerts).
● Questionnaire 3: People & Roles
○ Section Title: "People & Roles"
○ Group Label: [Parents] (Repeatable text entry for names and relationship, e.g., "Jane Doe - Mother of Bride")
○ Group Label: [Grandparents] (Optional, repeatable text entry)
○ Group Label: [Wedding Party / Bridal Party] (Repeatable section: Full Name, Role, Relationship)
○ Group Label: [Other Key People] (Optional, repeatable: Type of Contact, Name, Contact Details)
● Questionnaire 4: Photography Plan & Shot Lists
○ Section Title: "Photography Plan & Shot Lists"
○ Field Label: [Must-have specific moments (beyond standard ones)] (text entry, multi-line) [cite: 112]
○ Field Label: [Specific items of sentimental value to photograph] (text entry, multi-line) [cite: 112]
○ Requested Shots Input:
■ Prompt: "Are there any absolutely unique, specific shots you've envisioned...?" [cite: 112, 113]
■ Input: (text entry, multi-line) [cite: 114]
○ Group Shots Input:
■ Prompt: "Please list all formal group combinations you require..." [cite: 114]
■ Input: (Repeatable fields: Group Description, Optional Notes) [cite: 115]
○ Couple Shots (Ideas/Inspiration) Input:
■ Prompt: "For your dedicated couple portrait session, are there any particular styles...?" [cite: 116]
■ Input: (text entry, multi-line) [cite: 117]
○ General Shots (Key Details/Candids) Input:
■ Prompt: "Are there any specific details (e.g., decor, cake, rings...)?" [cite: 118]
■ Input: (text entry, multi-line) [cite: 119]
○ Sensitivities & Surprises: (Yes/No toggles with conditional private notes fields) [cite: 121, 122, 123]
● Questionnaire 5: Final Touches & Vendor Info
○ Section Title: "Final Touches & Vendor Info"
○ Group Label: [Other Vendors] (Optional, repeatable: Vendor Type, Name, Contact Details) [cite: 124]
○ Field Label: [Client's Additional Notes] (text entry, multi-line, prompt: "Is there anything else important...") [cite: 124]
○ Field Label: [Referral] (Optional, text entry, prompt: "How did you hear about us?") [cite: 125]
● Buttons (within questionnaire sections): "Save Progress," "Next Section," "Previous Section," "Mark as Complete."
4.3. Main Application Screen Text (Selected Examples from WeddingPhotoAssist content)
● Initial Screen (after splash):
○ Button: "+ Create New Wedding" [cite: 83]
○ Button: "Open Existing Wedding" [cite: 83]
● Main Dashboard Screen:
○ Title: Couple's Names (e.g., "Alex & Jamie's Wedding") or "Dashboard" [cite: 87]
○ Venue Card Button/Link: "View on Google Maps" (with map icon) [cite: 88]
○ Weather Card Helper: "Fetching weather..." or "Weather data unavailable." [cite: 88]
● Wedding Day Timeline Screen:
○ Title: "Wedding Day Timeline" [cite: 89]
○ Event Display: "[Time] - [Event Description]" [cite: 89]
○ Button: "+ Add Event" [cite: 89]
○ Alert Notification: "[Event Name] in [X] minutes!" [cite: 90] (e.g., "First Dance in 30 mins") [cite: 91]
● Shot Checklists:
○ Titles: "Group Shot Checklist", "General Shot Checklist", "Client Requested Shots", "Couple Shot Checklist" [cite: 91, 92, 93] (adapting to 4 categories)
○ Button: "+ Add Custom [Category] Shot" [cite: 91, 92]
○ Empty State Text: "No shots added yet. Tap '+' to add one!" [cite: 95] or "Your pre-defined list will appear here. You can customize it anytime." [cite: 96]
● Kit Packing Checklist Screen:
○ Title: "Kit Packing Checklist" or "Prep & Pack" [cite: 97]
○ Helper Text: "Tap an item to mark it as packed/completed." [cite: 99]
● Warnings Screen:
○ Title: "Private Notes & Warnings" [cite: 100]
○ Disclaimer: "Discreet Zone. Notes here are for your eyes only..." [cite: 100] or "Add private notes about potential sensitivities..." [cite: 101]
● Buttons & Calls to Action (General):
○ Standard: "Save", "Cancel", "Done", "Edit", "Delete", "Add", "Next", "Back" [cite: 104]
● Confirmation Modals:
○ Title: "Are you sure?" [cite: 104]
○ Text: "Do you want to delete this item? This action cannot be undone." [cite: 105]
○ Buttons: "Confirm Delete", "Cancel" [cite: 106]
● Settings Screen: (Examples) [cite: 106]
○ Title: "Settings" [cite: 106]
○ Options: "Manage Default Shot Lists", "Alert Preferences (Sound/Vibrate)", "Account", "About [App Name]", etc. [cite: 106]
4.4. Error Messages & Alerts
● Constructive & Polite: Explain the issue and solution clearly.
● Timeline Alerts: Clear, noticeable but not jarring.
4.5. Empty States
● Provide brief, friendly messages with a clear call to action where applicable (e.g., for empty shot lists [cite: 95]).
5. Pre-defined App Lists (Examples from WeddingPhotoAssist content)
These lists serve as comprehensive starting points within the app, intended for user customization.
5.1. Group Shots Examples [cite: 60, 61]
1. Couple with Officiant
2. Couple with Full Bridal Party
3. Couple with Bridesmaids/Bride's Side Attendants
4. Couple with Groomsmen/Groom's Side Attendants ... (includes 20 examples as per source [cite: 61])
5. Full Guest Group Shot (if feasible/requested)
5.2. Couple Shots Examples [cite: 62, 63]
1. First Look (if applicable)
2. Walking Towards/Away from Camera (holding hands)
3. Forehead Kiss (Close-up & Wide) ... (includes 20 examples as per source [cite: 63, 64])
4. "Just Married" Joyful Exit from Ceremony
5.3. General On-the-Day Shots Examples [cite: 64, 65, 66, 67, 68, 69]
1. Getting Ready - Bride/Partner 1: Dress/Outfit Hanging, Shoes, Jewellery, etc. [cite: 65]
2. Getting Ready - Groom/Partner 2: Suit/Outfit Details, Tying Tie, etc. [cite: 65]
3. Ceremony Details: Venue Exterior & Interior (empty), Decorations, etc. [cite: 65, 66]
4. Ceremony Moments: Bridal Party Processional, Vows, First Kiss, etc. [cite: 66]
5. Reception Details: Venue Setup, Table Settings, Cake, etc. [cite: 66, 67]
6. Reception Moments: Grand Entrance, Speeches, Cake Cutting, First Dance, etc. [cite: 67, 68]
7. Details & Decor: Bouquets, Stationery, Favours, etc. [cite: 68] ... (includes 20 main categories/examples with sub-points as per source [cite: 65, 66, 67, 68, 69])
8. Final Exit/Send-off (e.g., sparklers) [cite: 69]
5.4. Requested Shots Examples (Often client-specific) [cite: 69, 70, 71, 72]
1. Photo with a specific elderly relative
2. Recreation of a parent's wedding photo
3. Shot with a beloved pet if present ... (includes 20 examples as per source [cite: 70, 71, 72])
4. Couple toasting with champagne flutes
5.5. Kit Preparation Checklist Examples [cite: 72, 73, 74, 75, 76, 77]
1. Camera Bodies: Primary, Backup [cite: 73]
2. Lenses: Wide-angle, Prime, Telephoto, Macro [cite: 73]
3. Memory & Storage: Cards, Reader, Portable HDD [cite: 73, 74]
4. Batteries & Power: Camera batteries, Chargers, Power bank [cite: 74]
5. Lighting: Speedlights, Triggers, Stands, Modifiers, Spare batteries, Video light [cite: 74, 75] ... (includes 20 categories with sub-points as per source [cite: 73, 74, 75, 76, 77])
6. List of vendor contact details [cite: 77]
5.6. Wedding Day Timeline (Example Key Events) [cite: 77, 78, 79, 80]
1. Photographer Arrives: Bride/Partner 1 Prep [cite: 78]
2. Detail Shots (Dress, Rings, Flowers) - Bride/Partner 1 Prep [cite: 78] ... (includes 35 example events as per source [cite: 78, 79, 80])
3. Photographer Departure [cite: 80]
This document should provide a solid foundation for the app's content creation and brand representation, ensuring consistency with the detailed features and user experience defined.