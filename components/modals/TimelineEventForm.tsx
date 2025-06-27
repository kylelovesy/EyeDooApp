/**
 * TimelineEventForm Component
 * 
 * A comprehensive form component for creating and managing timeline events in the wedding app.
 * Features an accordion-style interface that expands to show form fields when adding new events.
 * 
 * Key Features:
 * - Accordion-style expandable form
 * - Event type selection with icons
 * - Time picker for event scheduling
 * - Single details field for event information
 * - Notification type selection with icons
 * - Test data for demonstration
 * - Form validation with conditional save button
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import 'react-native-get-random-values';
import {
    Button,
    HelperText,
    IconButton,
    Menu,
    SegmentedButtons,
    Snackbar,
    TextInput
} from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { EventType, eventTypeDetails, getEventTypeDetails } from '../../constants/eventTypes';
import { useAppTheme } from '../../constants/theme';
import {
    EventNotificationEnum,
    TTimelineEventForm
} from '../../types/timeline';
import { LabelText, TitleText } from '../ui/Typography';

/**
 * Props for the main TimelineEventForm component
 */
interface TimelineEventFormProps {
  projectDate: Date; // Base date for the project/wedding day
  onSubmit: (event: TTimelineEventForm) => void; // Callback when new event is created
  onCancel: () => void; // Callback when form is cancelled
  initialData?: Partial<TTimelineEventForm>; // Pre-populate form data (currently unused)
  isLoading?: boolean; // Loading state for async operations
  updateEventIcons?: () => void; // Optional callback to refresh event icons in parent
}

/**
 * Internal form data structure for new event creation
 * Tracks user input before converting to final TTimelineEventForm
 */
interface NewEventFormData {
  eventType?: EventType; // Wedding event category (ceremony, reception, etc.)
  time?: Date; // Scheduled time for the event
  details?: string; // Event details (combined location and description)
  notification?: z.infer<typeof EventNotificationEnum>; // Notification preference
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  projectDate,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  updateEventIcons,
}) => {
  const theme = useAppTheme();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Accordion expansion state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Test data: Sample events for demonstration purposes
  const [savedEvents, setSavedEvents] = useState<TTimelineEventForm[]>([
    {
      eventId: uuidv4(),
      eventType: 'CEREMONY' as EventType,
      time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 14, 0),
      details: 'Wedding ceremony with family and friends at St. Mary\'s Church',
      notification: 'Push',
      status: 'Draft',
    },
    {
      eventId: uuidv4(),
      eventType: 'FIRSTDANCE' as EventType,
      time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 19, 30),
      details: 'First dance as married couple in Reception Hall',
      notification: 'None',
      status: 'Draft',
    },
    {
      eventId: uuidv4(),
      eventType: 'CAKECUTTING' as EventType,
      time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 21, 0),
      details: 'Cake cutting ceremony',
      notification: 'Push',
      status: 'Draft',
    },
    {
      eventId: uuidv4(),
      eventType: 'COUPLEPHOTOS' as EventType,
      time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 15, 30),
      details: 'Couple portraits after ceremony in Garden Area',
      notification: 'None',
      status: 'Draft',
    },
    {
      eventId: uuidv4(),
      eventType: 'SPEECHES' as EventType,
      time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 20, 0),
      details: 'Best man and maid of honor speeches',
      notification: 'Push',
      status: 'Draft',
    },
  ]);
  
  // Snackbar for user feedback
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Form data state - tracks current input values
  const [formData, setFormData] = useState<NewEventFormData>({
    time: projectDate, // Default to project date
    notification: 'None', // Default notification setting
  });

  // UI interaction state
  const [showTimePicker, setShowTimePicker] = useState(false); // Date/time picker visibility
  const [errors, setErrors] = useState<Record<string, string>>({}); // Form validation errors

  // Animation state for accordion expand/collapse
  const [accordionAnimation] = useState(new Animated.Value(0));

  // ============================================================================
  // EVENT HANDLERS & BUSINESS LOGIC
  // ============================================================================
  
  /**
   * Toggles the accordion form visibility with smooth animation
   */
  const toggleAccordion = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(accordionAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, accordionAnimation]);

  /**
   * Validates form data before submission
   * @returns true if form is valid, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Checks if all required fields are complete for enabling save button
   */
  const isFormComplete = useCallback((): boolean => {
    return !!(formData.eventType && formData.time);
  }, [formData.eventType, formData.time]);

  /**
   * Updates form field value and clears any existing validation error
   */
  const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  }, [errors]);

  /**
   * Handles time picker selection and updates form data
   */
  const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(projectDate);
      newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      handleFieldChange('time', newDateTime);
    }
  }, [projectDate, handleFieldChange]);

  /**
   * Resets all form state to initial values
   */
  const resetForm = useCallback(() => {
    setFormData({ time: projectDate, notification: 'None' });
    setErrors({});
  }, [projectDate]);

  /**
   * Handles form cancellation - resets form and closes accordion
   */
  const handleCancel = useCallback(() => {
    resetForm();
    toggleAccordion();
  }, [resetForm, toggleAccordion]);

  /**
   * Handles form submission - validates data and creates new event
   */
  const handleConfirm = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const eventData: TTimelineEventForm = {
      eventId: uuidv4(),
      eventType: formData.eventType!,
      time: formData.time!,
      details: formData.details || undefined,
      notification: formData.notification || 'None',
      status: 'Draft',
    };

    setSavedEvents(prev => [...prev, eventData]);
    onSubmit(eventData);
    if (updateEventIcons) {
      updateEventIcons();
    }
    resetForm();
    toggleAccordion();
    setSnackbar({ visible: true, message: 'Event added successfully!' });
  }, [formData, validateForm, onSubmit, updateEventIcons, resetForm, toggleAccordion]);

  // ============================================================================
  // STYLING
  // ============================================================================
  
  const styles = StyleSheet.create({
    container: {
      padding: 12,
    },
    header: {
      marginBottom: 12,
      alignItems: 'center',
    },
    addEventButton: {
      marginBottom: 8,
    },
    savedEventsText: {
      marginTop: 12,
      marginBottom: 6,
    },
    savedEventsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    eventIcon: {
      margin: 2,
    },
  });

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TitleText size="large" color={theme.colors.primary}>
          Event Timeline
        </TitleText>
      </View>

      {/* Add Event Button */}
      <Button
        mode="contained"
        onPress={toggleAccordion}
        disabled={isLoading}
        style={styles.addEventButton}
        icon={isExpanded ? "minus" : "plus"}
      >
        {isExpanded ? "Cancel" : "Add Event"}
      </Button>

      {/* Accordion Form */}
      <AccordionForm
        animation={accordionAnimation}
        formData={formData}
        errors={errors}
        showTimePicker={showTimePicker}
        projectDate={projectDate}
        isLoading={isLoading}
        isExpanded={isExpanded}
        isFormComplete={isFormComplete()}
        onFieldChange={handleFieldChange}
        onTimePickerToggle={setShowTimePicker}
        onTimeChange={handleTimeChange}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {/* Saved Event Icons */}
      {savedEvents.length > 0 && (
        <View>
          <LabelText size="medium" color={theme.colors.onSurface} style={styles.savedEventsText}>
            Timeline Events:
          </LabelText>
          <View style={styles.savedEventsContainer}>
            {savedEvents.map((event, index) => {
              const eventDetail = getEventTypeDetails(event.eventType);
              const IconComponent = eventDetail?.Icon;
              return (
                <IconButton
                  key={`${event.eventId}-${index}`}
                  icon={() => IconComponent ? <IconComponent width={24} height={24} /> : null}
                  size={32}
                  style={styles.eventIcon}
                  mode="contained-tonal"
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

// ============================================================================
// CHILD COMPONENTS
// ============================================================================

/**
 * AccordionForm Component
 * 
 * The expandable form that contains all input fields for creating a new timeline event.
 * Uses animation to smoothly expand/collapse when the main button is pressed.
 */
interface AccordionFormProps {
  animation: Animated.Value;
  formData: NewEventFormData;
  errors: Record<string, string>;
  showTimePicker: boolean;
  projectDate: Date;
  isLoading: boolean;
  isExpanded: boolean;
  isFormComplete: boolean;
  onFieldChange: (key: keyof NewEventFormData, value: any) => void;
  onTimePickerToggle: (show: boolean) => void;
  onTimeChange: (event: any, selectedDate?: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const AccordionForm: React.FC<AccordionFormProps> = ({
  animation,
  formData,
  errors,
  showTimePicker,
  projectDate,
  isLoading,
  isExpanded,
  isFormComplete,
  onFieldChange,
  onTimePickerToggle,
  onTimeChange,
  onCancel,
  onConfirm,
}) => {
  const theme = useAppTheme();

  const accordionStyles = StyleSheet.create({
    animatedContainer: {
      overflow: 'hidden',
      marginBottom: 8,
    },
    content: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    formSection: {
      marginBottom: 12,
    },
    timeButton: {
      marginBottom: 4,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16,
    },
  });

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], // Increased height to accommodate all fields
  });

  if (!isExpanded) {
    return null;
  }

  return (
    <Animated.View style={[accordionStyles.animatedContainer, { height: animatedHeight }]}>
      <View style={accordionStyles.content}>
        {/* Event Type Dropdown */}
        <View style={accordionStyles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 4 }}>
            Event Type *
          </LabelText>
          <EventTypeDropdown
            selectedType={formData.eventType}
            onSelect={(type) => onFieldChange('eventType', type)}
            error={errors.eventType}
            disabled={isLoading}
          />
        </View>

        {/* Time Picker */}
        <View style={accordionStyles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 4 }}>
            Time *
          </LabelText>
          <Button
            mode="outlined"
            icon="clock-outline"
            onPress={() => onTimePickerToggle(true)}
            disabled={isLoading}
            style={[accordionStyles.timeButton, errors.time && { borderColor: theme.colors.error }]}
          >
            {formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Select Time'}
          </Button>
          {errors.time && <HelperText type="error">{errors.time}</HelperText>}
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={formData.time || new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        {/* Details Field */}
        <View style={accordionStyles.formSection}>
          <TextInput
            label="Details"
            value={formData.details || ''}
            onChangeText={(text) => onFieldChange('details', text)}
            mode="outlined"
            disabled={isLoading}
            maxLength={200}
            multiline
            numberOfLines={3}
            style={{ backgroundColor: 'transparent' }}
            placeholder="Enter event details, location, or any special notes..."
          />
        </View>

        {/* Set Notifications */}
        <View style={accordionStyles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 8 }}>
            Set Notifications
          </LabelText>
          <SegmentedButtons
            value={formData.notification || 'None'}
            onValueChange={(value) => onFieldChange('notification', value)}
            buttons={[
              { 
                value: 'None', 
                label: 'None',
                icon: 'bell-off-outline'
              },
              { 
                value: 'Push', 
                label: 'Push',
                icon: 'bell-outline'
              },
              { 
                value: 'Email', 
                label: 'Email',
                icon: 'email-outline'
              },
              { 
                value: 'Text', 
                label: 'Text',
                icon: 'message-text-outline'
              },
              { 
                value: 'Alarm', 
                label: 'Alarm',
                icon: 'alarm'
              },
            ]}
            density="small"
          />
        </View>

        {/* Action Buttons */}
        <View style={accordionStyles.actionButtons}>
          <Button
            mode="text"
            onPress={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            disabled={isLoading || !isFormComplete}
            loading={isLoading}
          >
            Save Event
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * EventTypeDropdown Component
 * 
 * A dropdown menu for selecting wedding event types (ceremony, reception, etc.)
 * Shows event icons next to the display names for better visual recognition.
 */
interface EventTypeDropdownProps {
  selectedType?: EventType;
  onSelect: (type: EventType) => void;
  error?: string;
  disabled?: boolean;
}

const EventTypeDropdown: React.FC<EventTypeDropdownProps> = ({
  selectedType,
  onSelect,
  error,
  disabled,
}) => {
  const theme = useAppTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedDetail = selectedType ? getEventTypeDetails(selectedType) : null;
  const SelectedIcon = selectedDetail?.Icon;

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            disabled={disabled}
            style={[error && { borderColor: theme.colors.error }]}
            contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
            icon={() => SelectedIcon ? <SelectedIcon width={20} height={20} /> : undefined}
          >
            {selectedDetail?.displayName || 'Select Event Type'}
          </Button>
        }
      >
        {eventTypeDetails.map((item) => {
          const IconComponent = item.Icon;
          return (
            <Menu.Item
              key={item.type}
              onPress={() => {
                onSelect(item.type);
                setMenuVisible(false);
              }}
              title={item.displayName}
              leadingIcon={() => <IconComponent width={20} height={20} />}
              disabled={disabled}
            />
          );
        })}
      </Menu>
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

export default TimelineEventForm;
/**
 * TimelineEventForm Component
 * 
 * A comprehensive form component for creating and managing timeline events in the wedding app.
 * Features an accordion-style interface that expands to show form fields when adding new events.
 * 
 * Key Features:
 * - Accordion-style expandable form
 * - Event type selection with icons
 * - Time picker for event scheduling
 * - Optional location and description fields
 * - Notification type selection
 * - Test data for demonstration
 * - Form validation
 */

// import DateTimePicker from '@react-native-community/datetimepicker';
// import React, { useCallback, useState } from 'react';
// import { Animated, Platform, StyleSheet, View } from 'react-native';
// import 'react-native-get-random-values';
// import {
//   Button,
//   Chip,
//   HelperText,
//   IconButton,
//   Menu,
//   SegmentedButtons,
//   Snackbar,
//   TextInput
// } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// import { z } from 'zod';

// import { EventType, eventTypeDetails, getEventTypeDetails } from '../../constants/eventTypes';
// // import { commonStyles, createThemedStyles } from '../../constants/styles'; // Unused - custom styling removed
// import { useAppTheme } from '../../constants/theme';
// import {
//   EventNotificationEnum,
//   TTimelineEventForm
// } from '../../types/timeline';
// import { LabelText, TitleText } from '../ui/Typography';

// /**
//  * Props for the main TimelineEventForm component
//  */
// interface TimelineEventFormProps {
//   projectDate: Date; // Base date for the project/wedding day
//   onSubmit: (event: TTimelineEventForm) => void; // Callback when new event is created
//   onCancel: () => void; // Callback when form is cancelled
//   initialData?: Partial<TTimelineEventForm>; // Pre-populate form data (currently unused)
//   isLoading?: boolean; // Loading state for async operations
//   updateEventIcons?: () => void; // Optional callback to refresh event icons in parent
// }

// /**
//  * Internal form data structure for new event creation
//  * Tracks user input before converting to final TTimelineEventForm
//  */
// interface NewEventFormData {
//   eventType?: EventType; // Wedding event category (ceremony, reception, etc.)
//   time?: Date; // Scheduled time for the event
//   description?: string; // Optional event description
//   location?: string; // Optional event location
//   notification?: z.infer<typeof EventNotificationEnum>; // Notification preference
// }

// /**
//  * Tracks which optional fields are currently enabled/visible in the form
//  */
// interface OptionalFields {
//   location: boolean; // Show/hide location input
//   description: boolean; // Show/hide description input
//   notifications: boolean; // Show/hide notification selector (currently unused - notifications always shown)
// }

// const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
//   projectDate,
//   onSubmit,
//   onCancel, // Currently unused - form handles its own cancellation
//   initialData, // Currently unused - could be used for editing existing events
//   isLoading = false,
//   updateEventIcons,
// }) => {
//   const theme = useAppTheme();
//   // const themedStyles = createThemedStyles(theme); // Unused - custom styling removed

//   // ============================================================================
//   // STATE MANAGEMENT
//   // ============================================================================
  
//   // Accordion expansion state
//   const [isExpanded, setIsExpanded] = useState(false);
  
//   // Test data: Sample events for demonstration purposes
//   // TODO: Replace with real data from backend/context in production
//   const [savedEvents, setSavedEvents] = useState<TTimelineEventForm[]>([
//     {
//       eventId: uuidv4(),
//       eventType: 'CEREMONY' as EventType,
//       time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 14, 0),
//       description: 'Wedding ceremony with family and friends',
//       location: 'St. Mary\'s Church',
//       notification: 'Push',
//       status: 'Draft',
//     },
//     {
//       eventId: uuidv4(),
//       eventType: 'FIRSTDANCE' as EventType,
//       time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 19, 30),
//       description: 'First dance as married couple',
//       location: 'Reception Hall',
//       notification: 'None',
//       status: 'Draft',
//     },
//     {
//       eventId: uuidv4(),
//       eventType: 'CAKECUTTING' as EventType,
//       time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 21, 0),
//       description: 'Cake cutting ceremony',
//       notification: 'Push',
//       status: 'Draft',
//     },
//     {
//       eventId: uuidv4(),
//       eventType: 'COUPLEPHOTOS' as EventType,
//       time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 15, 30),
//       description: 'Couple portraits after ceremony',
//       location: 'Garden Area',
//       notification: 'None',
//       status: 'Draft',
//     },
//     {
//       eventId: uuidv4(),
//       eventType: 'SPEECHES' as EventType,
//       time: new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate(), 20, 0),
//       description: 'Best man and maid of honor speeches',
//       notification: 'Push',
//       status: 'Draft',
//     },
//   ]);
  
//   // Snackbar for user feedback
//   const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

//   // Form data state - tracks current input values
//   const [formData, setFormData] = useState<NewEventFormData>({
//     time: projectDate, // Default to project date
//   });

//   // Sub-accordion state for additional options
//   const [isSubAccordionExpanded, setIsSubAccordionExpanded] = useState(false);
  
//   // Optional fields toggle state - controls which additional fields are shown
//   // const [optionalFields, setOptionalFields] = useState<OptionalFields>({
//   //   location: false,
//   //   description: false,
//   //   notifications: false, // Note: notifications are now always shown, this toggle is unused
//   // });

//   // UI interaction state
//   const [showTimePicker, setShowTimePicker] = useState(false); // Date/time picker visibility
//   const [errors, setErrors] = useState<Record<string, string>>({}); // Form validation errors

//   // Animation state for accordion expand/collapse
//   const [accordionAnimation] = useState(new Animated.Value(0));
  
//   // Animation state for sub-accordion expand/collapse
//   const [subAccordionAnimation] = useState(new Animated.Value(0));

//   // ============================================================================
//   // EVENT HANDLERS & BUSINESS LOGIC
//   // ============================================================================
  
//   /**
//    * Toggles the accordion form visibility with smooth animation
//    */
//   const toggleAccordion = useCallback(() => {
//     const toValue = isExpanded ? 0 : 1;
//     setIsExpanded(!isExpanded);
    
//     Animated.timing(accordionAnimation, {
//       toValue,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [isExpanded, accordionAnimation]);

//   /**
//    * Toggles the sub-accordion for additional options with smooth animation
//    */
//   const toggleSubAccordion = useCallback(() => {
//     const toValue = isSubAccordionExpanded ? 0 : 1;
//     setIsSubAccordionExpanded(!isSubAccordionExpanded);
    
//     Animated.timing(subAccordionAnimation, {
//       toValue,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   }, [isSubAccordionExpanded, subAccordionAnimation]);

//   /**
//    * Validates form data before submission
//    * @returns true if form is valid, false otherwise
//    */
//   const validateForm = useCallback((): boolean => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.eventType) {
//       newErrors.eventType = 'Please select an event type';
//     }
//     if (!formData.time) {
//       newErrors.time = 'Please select a time';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   /**
//    * Updates form field value and clears any existing validation error
//    */
//   const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//     if (errors[key]) {
//       setErrors(prev => ({ ...prev, [key]: '' }));
//     }
//   }, [errors]);

//   /**
//    * Toggles optional field visibility and clears data when hiding
//    * COMMENTED OUT - No longer needed with sub-accordion approach
//    */
//   // const handleOptionalFieldToggle = useCallback((field: keyof OptionalFields) => {
//   //   setOptionalFields(prev => ({
//   //     ...prev,
//   //     [field]: !prev[field],
//   //   }));
//   //   
//   //   // Clear the field data if toggling off
//   //   if (optionalFields[field]) {
//   //     if (field === 'location') setFormData(prev => ({ ...prev, location: undefined }));
//   //     if (field === 'description') setFormData(prev => ({ ...prev, description: undefined }));
//   //     if (field === 'notifications') setFormData(prev => ({ ...prev, notification: undefined }));
//   //   }
//   // }, [optionalFields]);

//   /**
//    * Handles time picker selection and updates form data
//    */
//   const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
//     setShowTimePicker(false);
//     if (selectedDate) {
//       const newDateTime = new Date(projectDate);
//       newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
//       handleFieldChange('time', newDateTime);
//     }
//   }, [projectDate, handleFieldChange]);

//   /**
//    * Resets all form state to initial values
//    */
//   const resetForm = useCallback(() => {
//     setFormData({ time: projectDate });
//     // setOptionalFields({ location: false, description: false, notifications: false }); // No longer used
//     setErrors({});
//     setIsSubAccordionExpanded(false); // Reset sub-accordion state
//   }, [projectDate]);

//   /**
//    * Handles form cancellation - resets form and closes accordion
//    */
//   const handleCancel = useCallback(() => {
//     resetForm();
//     toggleAccordion();
//   }, [resetForm, toggleAccordion]);

//   /**
//    * Handles form submission - validates data and creates new event
//    */
//   const handleConfirm = useCallback(() => {
//     if (!validateForm()) {
//       return;
//     }

//     const eventData: TTimelineEventForm = {
//       eventId: uuidv4(),
//       eventType: formData.eventType!,
//       time: formData.time!,
//       description: formData.description || undefined, // Always include if provided
//       location: formData.location || undefined, // Always include if provided
//       notification: formData.notification || 'None', // Always include, default to 'None'
//       status: 'Draft',
//     };

//     setSavedEvents(prev => [...prev, eventData]);
//     onSubmit(eventData);
//     if (updateEventIcons) {
//       updateEventIcons();
//     }
//     resetForm();
//     toggleAccordion();
//     setSnackbar({ visible: true, message: 'Event added successfully!' });
//   }, [formData, validateForm, onSubmit, updateEventIcons, resetForm, toggleAccordion]);

//   // ============================================================================
//   // STYLING
//   // ============================================================================
  
//   const styles = StyleSheet.create({
//     container: {
//       padding: 12, // Reduced padding
//     },
//     header: {
//       marginBottom: 12, // Reduced margin
//       alignItems: 'center',
//     },
//     addEventButton: {
//       marginBottom: 8, // Reduced margin
//     },
//     savedEventsText: {
//       marginTop: 12, // Reduced margin
//       marginBottom: 6, // Reduced margin
//     },
//     savedEventsContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       gap: 6, // Reduced gap
//     },
//     eventIcon: {
//       margin: 2, // Reduced margin
//     },
//   });

//   // ============================================================================
//   // RENDER
//   // ============================================================================
  
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TitleText size="large" color={theme.colors.primary}>
//           Event Timeline
//         </TitleText>
//       </View>

//       {/* Add Event Button */}
//       <Button
//         mode="contained"
//         onPress={toggleAccordion}
//         disabled={isLoading}
//         style={styles.addEventButton}
//         icon={isExpanded ? "minus" : "plus"}
//       >
//         {isExpanded ? "Cancel" : "Add Event"}
//       </Button>

//       {/* Accordion Form */}
//       <AccordionForm
//         animation={accordionAnimation}
//         formData={formData}
//         errors={errors}
//         showTimePicker={showTimePicker}
//         projectDate={projectDate}
//         isLoading={isLoading}
//         isExpanded={isExpanded}
//         isSubAccordionExpanded={isSubAccordionExpanded}
//         subAccordionAnimation={subAccordionAnimation}
//         onFieldChange={handleFieldChange}
//         onTimePickerToggle={setShowTimePicker}
//         onTimeChange={handleTimeChange}
//         onSubAccordionToggle={toggleSubAccordion}
//         onCancel={handleCancel}
//         onConfirm={handleConfirm}
//       />

//       {/* Saved Event Icons */}
//       {savedEvents.length > 0 && (
//         <View>
//           <LabelText size="medium" color={theme.colors.onSurface} style={styles.savedEventsText}>
//             Timeline Events:
//           </LabelText>
//           <View style={styles.savedEventsContainer}>
//             {savedEvents.map((event, index) => {
//               const eventDetail = getEventTypeDetails(event.eventType);
//               const IconComponent = eventDetail?.Icon;
//               return (
//                 <IconButton
//                   key={`${event.eventId}-${index}`}
//                   icon={() => IconComponent ? <IconComponent width={24} height={24} /> : null}
//                   size={32}
//                   style={styles.eventIcon}
//                   mode="contained-tonal"
//                 />
//               );
//             })}
//           </View>
//         </View>
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         visible={snackbar.visible}
//         onDismiss={() => setSnackbar({ visible: false, message: '' })}
//         duration={3000}
//         style={{ backgroundColor: theme.colors.primary }}
//       >
//         {snackbar.message}
//       </Snackbar>
//     </View>
//   );
// };

// // ============================================================================
// // CHILD COMPONENTS
// // ============================================================================

// /**
//  * AccordionForm Component
//  * 
//  * The expandable form that contains all input fields for creating a new timeline event.
//  * Uses animation to smoothly expand/collapse when the main button is pressed.
//  */
// interface AccordionFormProps {
//   animation: Animated.Value;
//   formData: NewEventFormData;
//   errors: Record<string, string>;
//   showTimePicker: boolean;
//   projectDate: Date;
//   isLoading: boolean;
//   isExpanded: boolean;
//   isSubAccordionExpanded: boolean;
//   subAccordionAnimation: Animated.Value;
//   onFieldChange: (key: keyof NewEventFormData, value: any) => void;
//   onTimePickerToggle: (show: boolean) => void;
//   onTimeChange: (event: any, selectedDate?: Date) => void;
//   onSubAccordionToggle: () => void;
//   onCancel: () => void;
//   onConfirm: () => void;
// }

// const AccordionForm: React.FC<AccordionFormProps> = ({
//   animation,
//   formData,
//   errors,
//   showTimePicker,
//   projectDate,
//   isLoading,
//   isExpanded,
//   isSubAccordionExpanded,
//   subAccordionAnimation,
//   onFieldChange,
//   onTimePickerToggle,
//   onTimeChange,
//   onSubAccordionToggle,
//   onCancel,
//   onConfirm,
// }) => {
//   const theme = useAppTheme();

//   const accordionStyles = StyleSheet.create({
//     animatedContainer: {
//       overflow: 'hidden',
//       marginBottom: 8, // Reduced margin
//     },
//     content: {
//       backgroundColor: theme.colors.surface,
//       borderRadius: 8, // Smaller border radius
//       padding: 12, // Reduced padding
//       borderWidth: 1,
//       borderColor: theme.colors.outline,
//     },
//     formSection: {
//       marginBottom: 8, // Reduced margin
//     },
//     timeButton: {
//       marginBottom: 4, // Reduced margin
//     },
//     actionButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: 8,
//       marginTop: 12, // Significantly reduced margin
//     },
//   });

//   const animatedHeight = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 480], // Drastically reduced height for compact layout
//   });

//   if (!isExpanded) {
//     return null;
//   }

//   return (
//     <Animated.View style={[accordionStyles.animatedContainer, { height: animatedHeight }]}>
//       <View style={accordionStyles.content}>
//         {/* Event Type Dropdown */}
//         <View style={accordionStyles.formSection}>
//           <LabelText size="medium" style={{ marginBottom: 8 }}>
//             Event Type *
//           </LabelText>
//           <EventTypeDropdown
//             selectedType={formData.eventType}
//             onSelect={(type) => onFieldChange('eventType', type)}
//             error={errors.eventType}
//             disabled={isLoading}
//           />
//         </View>

//         {/* Time Picker */}
//         <View style={accordionStyles.formSection}>
//           <LabelText size="medium" style={{ marginBottom: 8 }}>
//             Time *
//           </LabelText>
//           <Button
//             mode="outlined"
//             icon="clock-outline"
//             onPress={() => onTimePickerToggle(true)}
//             disabled={isLoading}
//             style={[accordionStyles.timeButton, errors.time && { borderColor: theme.colors.error }]}
//           >
//             {formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Select Time'}
//           </Button>
//           {errors.time && <HelperText type="error">{errors.time}</HelperText>}
//         </View>

//         {showTimePicker && (
//           <DateTimePicker
//             value={formData.time || new Date()}
//             mode="time"
//             is24Hour={false}
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onTimeChange}
//           />
//         )}

//         {/* Additional Options Sub-Accordion */}
//         <View style={accordionStyles.formSection}>
//           <Button
//             mode="outlined"
//             icon={isSubAccordionExpanded ? "chevron-up" : "chevron-down"}
//             onPress={onSubAccordionToggle}
//             disabled={isLoading}
//             style={{ marginBottom: 8 }}
//           >
//             Additional Options
//           </Button>
          
//           <SubAccordionFields
//             animation={subAccordionAnimation}
//             formData={formData}
//             isExpanded={isSubAccordionExpanded}
//             onFieldChange={onFieldChange}
//             disabled={isLoading}
//           />
//         </View>

//         {/* Action Buttons */}
//         <View style={accordionStyles.actionButtons}>
//           <Button
//             mode="text"
//             onPress={onCancel}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             mode="contained"
//             onPress={onConfirm}
//             disabled={isLoading}
//             loading={isLoading}
//           >
//             Confirm Event
//           </Button>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// /**
//  * EventTypeDropdown Component
//  * 
//  * A dropdown menu for selecting wedding event types (ceremony, reception, etc.)
//  * Shows event icons next to the display names for better visual recognition.
//  */
// interface EventTypeDropdownProps {
//   selectedType?: EventType;
//   onSelect: (type: EventType) => void;
//   error?: string;
//   disabled?: boolean;
// }

// const EventTypeDropdown: React.FC<EventTypeDropdownProps> = ({
//   selectedType,
//   onSelect,
//   error,
//   disabled,
// }) => {
//   const theme = useAppTheme();
//   const [menuVisible, setMenuVisible] = useState(false);

//   const selectedDetail = selectedType ? getEventTypeDetails(selectedType) : null;
//   const SelectedIcon = selectedDetail?.Icon;

//   return (
//     <View>
//       <Menu
//         visible={menuVisible}
//         onDismiss={() => setMenuVisible(false)}
//         anchor={
//           <Button
//             mode="outlined"
//             onPress={() => setMenuVisible(true)}
//             disabled={disabled}
//             style={[error && { borderColor: theme.colors.error }]}
//             contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
//             icon={() => SelectedIcon ? <SelectedIcon width={20} height={20} /> : undefined}
//           >
//             {selectedDetail?.displayName || 'Select Event Type'}
//           </Button>
//         }
//       >
//         {eventTypeDetails.map((item) => {
//           const IconComponent = item.Icon;
//           return (
//             <Menu.Item
//               key={item.type}
//               onPress={() => {
//                 onSelect(item.type);
//                 setMenuVisible(false);
//               }}
//               title={item.displayName}
//               leadingIcon={() => <IconComponent width={20} height={20} />}
//               disabled={disabled}
//             />
//           );
//         })}
//       </Menu>
//       {error && <HelperText type="error">{error}</HelperText>}
//     </View>
//   );
// };

// /**
//  * OptionalFieldsSelector Component
//  * 
//  * Chip-based selector for toggling optional form fields (location, description).
//  * Note: Notifications chip was removed as notifications are now always shown.
//  */
// interface OptionalFieldsSelectorProps {
//   optionalFields: OptionalFields;
//   onToggle: (field: keyof OptionalFields) => void;
//   disabled?: boolean;
// }

// const OptionalFieldsSelector: React.FC<OptionalFieldsSelectorProps> = ({
//   optionalFields,
//   onToggle,
//   disabled,
// }) => {
//   return (
//     <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
//       <Chip
//         selected={optionalFields.location}
//         onPress={() => onToggle('location')}
//         disabled={disabled}
//         style={{ marginBottom: 8 }}
//         icon="map-marker"
//       >
//         Location
//       </Chip>
//       <Chip
//         selected={optionalFields.description}
//         onPress={() => onToggle('description')}
//         disabled={disabled}
//         style={{ marginBottom: 8 }}
//         icon="text"
//       >
//         Description
//       </Chip>
//     </View>
//   );
// };

// /**
//  * ConditionalFields Component
//  * 
//  * Renders optional input fields based on user selection.
//  * Only shows location and description fields when their respective chips are selected.
//  * Notification field was moved to always-visible section.
//  */
// interface ConditionalFieldsProps {
//   optionalFields: OptionalFields;
//   formData: NewEventFormData;
//   onFieldChange: (key: keyof NewEventFormData, value: any) => void;
//   disabled?: boolean;
// }

// const ConditionalFields: React.FC<ConditionalFieldsProps> = ({
//   optionalFields,
//   formData,
//   onFieldChange,
//   disabled,
// }) => {
//   return (
//     <View>
//       {/* Location Field */}
//       {optionalFields.location && (
//         <View style={{ marginBottom: 16 }}>
//           <TextInput
//             label="Location"
//             value={formData.location || ''}
//             onChangeText={(text) => onFieldChange('location', text)}
//             mode="outlined"
//             disabled={disabled}
//             maxLength={100}
//             style={{ backgroundColor: 'transparent' }}
//           />
//         </View>
//       )}

//       {/* Description Field */}
//       {optionalFields.description && (
//         <View style={{ marginBottom: 16 }}>
//           <TextInput
//             label="Description"
//             value={formData.description || ''}
//             onChangeText={(text) => onFieldChange('description', text)}
//             mode="outlined"
//             disabled={disabled}
//             maxLength={100}
//             style={{ backgroundColor: 'transparent' }}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// /**
//  * SubAccordionFields Component
//  * 
//  * Expandable section within the main accordion that contains optional fields:
//  * - Location text input
//  * - Description text input  
//  * - Notification type segmented button
//  */
// interface SubAccordionFieldsProps {
//   animation: Animated.Value;
//   formData: NewEventFormData;
//   isExpanded: boolean;
//   onFieldChange: (key: keyof NewEventFormData, value: any) => void;
//   disabled?: boolean;
// }

// const SubAccordionFields: React.FC<SubAccordionFieldsProps> = ({
//   animation,
//   formData,
//   isExpanded,
//   onFieldChange,
//   disabled,
// }) => {
//   const theme = useAppTheme();

//   const subAccordionStyles = StyleSheet.create({
//     animatedContainer: {
//       overflow: 'hidden',
//     },
//     content: {
//       backgroundColor: theme.colors.surfaceVariant,
//       borderRadius: 6, // Smaller border radius
//       padding: 8, // Reduced padding
//       marginTop: 4, // Reduced margin
//     },
//     fieldSection: {
//       marginBottom: 8, // Compact spacing between fields
//     },
//   });

//   const animatedHeight = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 160], // Compact height for sub-accordion
//   });

//   if (!isExpanded) {
//     return null;
//   }

//   return (
//     <Animated.View style={[subAccordionStyles.animatedContainer, { height: animatedHeight }]}>
//       <View style={subAccordionStyles.content}>
//         {/* Location Field */}
//         <View style={subAccordionStyles.fieldSection}>
//           <TextInput
//             label="Location"
//             value={formData.location || ''}
//             onChangeText={(text) => onFieldChange('location', text)}
//             mode="outlined"
//             disabled={disabled}
//             maxLength={100}
//             style={{ backgroundColor: 'transparent' }}
//           />
//         </View>

//         {/* Description Field */}
//         <View style={subAccordionStyles.fieldSection}>
//           <TextInput
//             label="Description"
//             value={formData.description || ''}
//             onChangeText={(text) => onFieldChange('description', text)}
//             mode="outlined"
//             disabled={disabled}
//             maxLength={100}
//             style={{ backgroundColor: 'transparent' }}
//           />
//         </View>

//         {/* Set Notification */}
//         <View style={subAccordionStyles.fieldSection}>
//           <LabelText size="medium" style={{ marginBottom: 8 }}>
//             Set Notification
//           </LabelText>
//           <SegmentedButtons
//             value={formData.notification || 'None'}
//             onValueChange={(value) => onFieldChange('notification', value)}
//             buttons={[
//               { value: 'None', label: 'None' },
//               { value: 'Push', label: 'Push' },
//               { value: 'Email', label: 'Email' },
//               { value: 'Text', label: 'Text' },
//               { value: 'Alarm', label: 'Alarm' },
//             ]}
//             density="small"
//           />
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// export default TimelineEventForm;

// ============================================================================
// LEGACY CODE - COMMENTED OUT
// ============================================================================
// This is the original simpler implementation of TimelineEventForm before
// the accordion refactor. Kept for reference during development.
// TODO: Remove this commented code once the new implementation is stable

// import DateTimePicker from '@react-native-community/datetimepicker';
// import React, { useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import 'react-native-get-random-values';
// import { Button, Menu, TextInput } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// import { EventType, eventTypeDetails } from '../../constants/eventTypes';
// import { TTimelineEventForm } from '../../types/timeline';

// interface TimelineEventFormProps {
//     projectDate: Date;
//     onSubmit: (event: TTimelineEventForm) => void;    
//     onCancel: () => void;
// }

// const TimelineEventForm: React.FC<TimelineEventFormProps> = ({ projectDate, onSubmit, onCancel }) => {
//     const [formData, setFormData] = useState<Partial<TTimelineEventForm>>({        
//         time: projectDate,
//         eventType: EventType.OTHER,
//     });
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [showTimePicker, setShowTimePicker] = useState(false);

//     const handleValueChange = (key: keyof TTimelineEventForm, value: any) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//       };
    
//       const selectedEventTypeDetail = eventTypeDetails.find(e => e.type === formData.eventType);
    
//       const handleSubmit = () => {
//         // Basic validation before submitting
//         if (formData.time && formData.eventType) {
//             const completeEventData: TTimelineEventForm = {
//                 eventId: uuidv4(),
//                 time: formData.time,
//                 eventType: formData.eventType,
//                 description: formData.description,
//                 location: formData.location,
//                 notification: 'None', // Default or add a form field
//                 status: 'Draft', // Default status
//             };
//             onSubmit(completeEventData);
//         } else {
//             // Handle error - maybe show a snackbar
//             console.error("Time and Event Type are required.");
//         }
//       };

//       return (
//         <View style={styles.container}>
//           {/* Time Picker */}
//           <Button icon="clock-outline" mode="outlined" onPress={() => setShowTimePicker(true)}>
//             {formData.time ? formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
//           </Button>
//           {showTimePicker && (
//             <DateTimePicker
//               value={formData.time || new Date()}
//               mode="time"
//               is24Hour={false}
//               display="default"
//               onChange={(event, selectedDate) => {
//                 setShowTimePicker(false);
//                 if (selectedDate) {
//                   handleValueChange('time', selectedDate);
//                 }
//               }}
//             />
//           )}
    
//           {/* Event Type Picker */}
//           <Menu
//             visible={menuVisible}
//             onDismiss={() => setMenuVisible(false)}
//             anchor={
//               <Button icon="camera-party-mode" mode="outlined" onPress={() => setMenuVisible(true)}>
//                 {selectedEventTypeDetail?.displayName || 'Select Event Type'}
//               </Button>
//             }>
//             {eventTypeDetails.map(item => (
//               <Menu.Item
//                 key={item.type}
//                 onPress={() => {
//                   handleValueChange('eventType', item.type);
//                   setMenuVisible(false);
//                 }}
//                 title={item.displayName}
//               />
//             ))}
//           </Menu>
    
//           <TextInput
//             label="Description (Optional)"
//             value={formData.description}
//             onChangeText={text => handleValueChange('description', text)}
//             mode="outlined"
//             style={styles.input}
//           />
//           <TextInput
//             label="Location (Optional)"
//             value={formData.location}
//             onChangeText={text => handleValueChange('location', text)}
//             mode="outlined"
//             style={styles.input}
//           />
    
//           <View style={styles.buttonRow}>
//             <Button onPress={onCancel} mode="text">Cancel</Button>
//             <Button onPress={handleSubmit} mode="contained">Add Event</Button>
//           </View>
//         </View>
//       );
//     };

//     const styles = StyleSheet.create({
//         container: { padding: 16, gap: 12 },
//         input: { backgroundColor: 'transparent' },
//         buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
//       });
      
//       export default TimelineEventForm;
      
    