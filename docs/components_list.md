# Wedding Photographer's Assistant App - Custom Components List

Based on the analysis of the provided documentation and HTML mockups, here is a comprehensive list of all the custom components needed for the Wedding Photographer's Assistant App:

## Navigation Components
1. **BottomTabNavigator**
   - Custom styled bottom navigation bar with icons and labels
   - Tabs for Home, Checklists, Schedule/Timeline, Settings

2. **HeaderComponent**
   - App header with back button, title, and optional right action
   - Consistent styling across screens

## Form Components
3. **CustomTextInput**
   - Styled text input field with label, placeholder, and validation
   - Support for different input types (text, email, phone)
   - Error message display

4. **CustomTextArea**
   - Multi-line text input for longer form responses
   - Auto-expanding height based on content

5. **CustomDropdown**
   - Dropdown select component with label and options
   - Used for pronouns, location types, etc.

6. **DatePickerInput**
   - Custom date picker with calendar interface
   - Formatted date display

7. **TimePickerInput**
   - Custom time picker with clock interface
   - Formatted time display

8. **AddressInputWithMap**
   - Text input with map lookup functionality
   - Google Places API integration
   - Address validation and formatting

9. **FormSection**
   - Container for grouping related form fields
   - Section title and optional description

10. **FormProgressIndicator**
    - Visual indicator of form completion progress
    - Section-by-section progress tracking

11. **RepeatableFormSection**
    - Container for form sections that can be repeated
    - Add/remove buttons for managing multiple entries
    - Drag-and-drop reordering capability

## Button Components
12. **PrimaryButton**
    - Main call-to-action button with consistent styling
    - Support for different sizes and states

13. **SecondaryButton**
    - Alternative button style for secondary actions
    - Support for different sizes and states

14. **IconButton**
    - Button with icon only or icon with text
    - Various icon options and sizes

15. **FloatingActionButton**
    - Circular button that floats above content
    - Used for adding new items (timeline events, shots, etc.)

## Card Components
16. **ProjectCard**
    - Card displaying wedding project information
    - Couple photo, names, date, and actions

17. **VenueCard**
    - Card displaying venue information
    - Address, name, map preview

18. **WeatherCard**
    - Card displaying weather information
    - Time, condition, temperature, icon

## List Components
19. **ChecklistItem**
    - List item with checkbox and label
    - Support for marking items as completed
    - Optional description or notes

20. **TimelineItem**
    - List item displaying timeline event
    - Time, title, icon, and optional description
    - Visual timeline connector elements

21. **ShotListItem**
    - List item for photography shots
    - Checkbox, description, and optional thumbnail
    - Category indicator

22. **DraggableListItem**
    - List item that can be reordered via drag-and-drop
    - Used for location ordering in questionnaire

23. **ExpandableListItem**
    - List item that can expand to show additional details
    - Collapse/expand functionality

## Modal Components
24. **CustomModal**
    - Base modal component with consistent styling
    - Header, content area, and action buttons

25. **TimelineEntryModal**
    - Modal for adding/editing timeline entries
    - Form fields for time, title, icon, alerts

26. **CustomShotModal**
    - Modal for adding custom shots to checklists
    - Form fields for description, category, notes

27. **AddressLookupModal**
    - Modal with map interface for address selection
    - Search input and results list

## Progress and Status Components
28. **ProgressBar**
    - Visual indicator of completion progress
    - Used for overall questionnaire progress

29. **ProgressRing**
    - Circular progress indicator
    - Used for section completion status

30. **StatusBadge**
    - Small badge indicating status (Not Started, In Progress, Completed)
    - Color-coded for quick recognition

## Map Components
31. **MapPreview**
    - Small map preview showing location
    - Marker for the specific address
    - Tap to open full map

32. **FullScreenMap**
    - Larger map component with interactive features
    - Multiple markers, zoom controls
    - Google Maps integration

## Miscellaneous Components
33. **IconSelector**
    - Grid of icons for selection
    - Used in timeline entry creation/editing

34. **PhotoUploader**
    - Component for selecting and uploading photos
    - Camera access and gallery selection

35. **WeatherForecast**
    - Hourly weather forecast display
    - Weather icons, temperatures, conditions

36. **NotificationAlert**
    - In-app notification component
    - Different styles for different alert types

37. **EmptyState**
    - Component displayed when a list or section is empty
    - Illustration and call-to-action

38. **LoadingSpinner**
    - Loading indicator for async operations
    - Consistent styling with app theme

39. **ErrorMessage**
    - Component for displaying error states
    - Retry action when applicable

40. **Tooltip**
    - Small popup with additional information
    - Triggered on hover or tap

## Authentication Components
41. **GoogleSignInButton**
    - Custom button for Google authentication
    - Google logo and consistent styling

42. **AuthenticationForm**
    - Form container for login/signup
    - Input validation and submission handling

