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
import { AccordionForm } from '../timeline/AccordionForm';
import { LabelText, TitleText } from '../ui/Typography';

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

// import { Ionicons } from '@expo/vector-icons';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { Card } from 'react-native-paper';
// import { getEventTypeDetails } from '../../constants/eventTypes';
// import { TTimelineEvent } from '../../types/timeline';
// import { BodyText, LabelText, TitleText } from '../ui/Typography';

// interface TimelineListItemProps {
//   item: TTimelineEvent;
//   isFirst: boolean;
//   isLast: boolean;
// }

// const TimelineListItem: React.FC<TimelineListItemProps> = ({ item, isFirst, isLast }) => {
//   const eventDetails = getEventTypeDetails(item.eventType);

//   if (!eventDetails) {
//     return null; // Or a fallback view
//   }

//   const { Icon, displayName } = eventDetails;

//   return (
//     <View style={styles.container}>
//       {/* The vertical line connector */}
//       <View style={styles.lineConnector}>
//         {!isFirst && <View style={styles.line} />}
//         {!isLast && <View style={styles.line} />}
//       </View>

//       {/* The Icon */}
//       <View style={styles.iconContainer}>
//         <Icon width={32} height={32} />
//       </View>

//       {/* The Event Details Card */}
//       <View style={styles.detailsContainer}>
//         <Card style={styles.card}>
//           <Card.Content style={styles.cardContent}>
//           {item.notification !== 'None' && (
//                 <View style={styles.notificationContainer}>
//                     <Ionicons name="notifications" size={16} color="#6200ee" />
//                     {/* <LabelText size="small" style={styles.notificationText}>
//                         {item.notification}
//                     </LabelText> */}
//                 </View>
//             )}
//             <LabelText size="medium" style={styles.timeText}>
//               {item.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </LabelText>
//             <TitleText size="medium" style={styles.displayNameText}>{displayName}</TitleText>
//             {item.description && <BodyText size="small">{item.description}</BodyText>}
//             {item.location && (
//                 <View style={styles.locationContainer}>
//                     {/* Replace with a proper location icon */}
//                     <BodyText size="small" style={styles.locationText}>
//                         <Ionicons name="location" size={16} color="black" />
//                          {item.location}
//                     </BodyText>
//                 </View>
//             )}
//           </Card.Content>
//         </Card>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         paddingHorizontal: 16,
//         minHeight: 100,
//     },
//     lineConnector: {
//         width: 2,
//         backgroundColor: '#e0e0e0',
//         alignItems: 'center',
//     },
//     line: {
//         flex: 1,
//         width: 2,
//         backgroundColor: '#e0e0e0',
//     },
//     iconContainer: {
//         position: 'absolute',
//         left: 6, // (16 padding - 20 icon width / 2) -ish
//         top: 20,
//         backgroundColor: '#fff',
//         padding: 8,
//         borderRadius: 25,
//         borderWidth: 2,
//         borderColor: '#e0e0e0',
//     },
//     detailsContainer: {
//         flex: 1,
//         marginLeft: 40, // Space for the icon and line
//         paddingVertical: 8,
//     },
//     card: {
//         flex: 1,
//     },
//     cardContent: {
//         position: 'relative', // This allows absolute positioning within the card
//     },
//     notificationContainer: {
//         position: 'absolute',
//         top: 8,
//         right: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(98, 0, 238, 0.1)', // Light background for visibility
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 12,
//         zIndex: 1, // Ensure it appears above other content
//     },
//     notificationText: {
//         color: '#6200ee',
//         marginLeft: 4,
//         fontSize: 12,
//     },
//     timeText: {
//         fontWeight: 'bold',
//         color: '#6200ee', // Your theme's primary color
//         marginBottom: 4,
//     },
//     displayNameText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 4,
//     },
//     locationContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 8,
//     },
//     locationText: {
//         color: '#666',
//         marginLeft: 4,
//     },
// });

// export default TimelineListItem;