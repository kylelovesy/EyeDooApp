/*-------------------------------------*/
// components/timeline/TimelineEventForm.tsx
// Status: Complete - Consolidated and cleaned up
// What it does: 
// Main component for the timeline event form that assembles various input fields
// and uses AccordionForm.tsx to structure the layout. Uses custom hooks for
// clean separation of concerns.
/*-------------------------------------*/

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Snackbar } from 'react-native-paper';

// Theme
import { useAppTheme } from '../../constants/theme';

// Custom UI
import { LabelText, TitleText } from '../ui/Typography';
import { AccordionForm } from './AccordionForm';

// Timeline
import { getEventTypeDetails } from '../../constants/eventTypes';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { useAccordionAnimation } from '../../hooks/useAccordionAnimation';
import { useTimelineForm } from '../../hooks/useTimelineForm';
import type { TimelineEventFormProps } from '../../types/timeline';

export const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  projectDate,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  updateEventIcons,
}) => {
  const theme = useAppTheme();
  const { events } = useTimelineContext();
  const { isExpanded, accordionAnimation, toggleAccordion } = useAccordionAnimation();
  
  const {
    formData,
    errors,
    showTimePicker,
    snackbar,
    isFormComplete,
    handleFieldChange,
    handleTimeChange,
    handleSubmit,
    resetForm,
    setShowTimePicker,
    setSnackbar,
  } = useTimelineForm({ 
    projectDate, 
    onSubmit, 
    // FIX: Check if updateEventIcons is provided before calling it.
    updateEventIcons: updateEventIcons ? updateEventIcons : () => {},
  });

  const handleCancel = () => {
    resetForm();
    toggleAccordion();
    onCancel?.();
  };

  const handleConfirm = () => {
    if (handleSubmit()) {
      toggleAccordion();
    }
  };

  const styles = StyleSheet.create({
    container: { 
      padding: 12 
    },
    header: { 
      marginBottom: 12, 
      alignItems: 'center' 
    },
    addEventButton: { 
      marginBottom: 8 
    },
    savedEventsText: { 
      marginTop: 12, 
      marginBottom: 6 
    },
    savedEventsContainer: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      gap: 6 
    },
    eventIcon: { 
      margin: 2 
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TitleText size="large" color={theme.colors.onSurface}>
          Event Timeline
        </TitleText>
      </View>

      {/* FIX: The button text is now consistent. */}
      <Button
        mode="contained"
        onPress={toggleAccordion}
        disabled={isLoading}
        style={styles.addEventButton}
        icon={isExpanded ? "chevron-up" : "plus"}
      >
        {isExpanded ? "Hide Form" : "Add Event"}
      </Button>

      <AccordionForm
        animation={accordionAnimation}
        formData={formData}
        errors={errors}
        showTimePicker={showTimePicker}
        projectDate={projectDate}
        isLoading={isLoading}
        isExpanded={isExpanded}
        isFormComplete={isFormComplete}
        onFieldChange={handleFieldChange}
        onTimePickerToggle={setShowTimePicker}
        onTimeChange={handleTimeChange}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {events.length > 0 && (
        <View>
          <LabelText 
            size="medium" 
            color={theme.colors.onSurface} 
            style={styles.savedEventsText}
          >
            Timeline Events:
          </LabelText>
          <View style={styles.savedEventsContainer}>
            {events.map((event, index) => {
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

export default TimelineEventForm;

// /*-------------------------------------*/
// // components/timeline/TimelineEventForm.tsx
// // Status: Complete - Consolidated and cleaned up
// // What it does: 
// // Main component for the timeline event form that assembles various input fields
// // and uses AccordionForm.tsx to structure the layout. Uses custom hooks for
// // clean separation of concerns.
// /*-------------------------------------*/

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { Button, IconButton, Snackbar } from 'react-native-paper';

// // Theme
// import { useAppTheme } from '../../constants/theme';

// // Custom UI
// import { LabelText, TitleText } from '../ui/Typography';
// import { AccordionForm } from './AccordionForm';

// // Timeline
// import { getEventTypeDetails } from '../../constants/eventTypes';
// import { useTimelineContext } from '../../contexts/TimelineContext';
// import { useAccordionAnimation } from '../../hooks/useAccordionAnimation';
// import { useTimelineForm } from '../../hooks/useTimelineForm';
// import type { TimelineEventFormProps } from '../../types/timeline';

// /**
//  * TimelineEventForm Component
//  * 
//  * Main form component for creating timeline events. Handles the complete workflow
//  * from user input to event creation with proper validation and user feedback.
//  * 
//  * Features:
//  * - Accordion-style expandable form
//  * - Real-time validation with error display
//  * - Integration with TimelineContext for event management
//  * - Visual feedback through snackbars
//  * - Event icon display for created events
//  */
// export const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
//   projectDate,
//   onSubmit,
//   onCancel,
//   initialData,
//   isLoading = false,
//   updateEventIcons,
// }) => {
//   const theme = useAppTheme();
//   const { events } = useTimelineContext();
//   const { isExpanded, accordionAnimation, toggleAccordion } = useAccordionAnimation();
  
//   const {
//     formData,
//     errors,
//     showTimePicker,
//     snackbar,
//     isFormComplete,
//     handleFieldChange,
//     handleTimeChange,
//     handleSubmit,
//     resetForm,
//     setShowTimePicker,
//     setSnackbar,
//   } = useTimelineForm({ 
//     projectDate, 
//     onSubmit, 
//     updateEventIcons 
//   });

//   // ============================================================================
//   // EVENT HANDLERS
//   // ============================================================================

//   /**
//    * Handles form cancellation - resets form and closes accordion
//    */
//   const handleCancel = () => {
//     resetForm();
//     toggleAccordion();
//     onCancel?.(); // Call parent's onCancel if provided
//   };

//   /**
//    * Handles form confirmation - validates and submits if valid
//    */
//   const handleConfirm = () => {
//     if (handleSubmit()) {
//       toggleAccordion();
//     }
//   };

//   // ============================================================================
//   // STYLES
//   // ============================================================================

//   const styles = StyleSheet.create({
//     container: { 
//       padding: 12 
//     },
//     header: { 
//       marginBottom: 12, 
//       alignItems: 'center' 
//     },
//     addEventButton: { 
//       marginBottom: 8 
//     },
//     savedEventsText: { 
//       marginTop: 12, 
//       marginBottom: 6 
//     },
//     savedEventsContainer: { 
//       flexDirection: 'row', 
//       flexWrap: 'wrap', 
//       gap: 6 
//     },
//     eventIcon: { 
//       margin: 2 
//     },
//   });

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TitleText size="large" color={theme.colors.onSurface}>
//           Event Timeline
//         </TitleText>
//       </View>

//       {/* Toggle Button */}
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
//         isFormComplete={isFormComplete}
//         onFieldChange={handleFieldChange}
//         onTimePickerToggle={setShowTimePicker}
//         onTimeChange={handleTimeChange}
//         onCancel={handleCancel}
//         onConfirm={handleConfirm}
//       />

//       {/* Saved Events Display */}
//       {events.length > 0 && (
//         <View>
//           <LabelText 
//             size="medium" 
//             color={theme.colors.onSurface} 
//             style={styles.savedEventsText}
//           >
//             Timeline Events:
//           </LabelText>
//           <View style={styles.savedEventsContainer}>
//             {events.map((event, index) => {
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

//       {/* User Feedback Snackbar */}
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

// export default TimelineEventForm;