// import React, { useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import {
//     Button,
//     Card,
//     IconButton,
//     List,
//     TextInput
// } from 'react-native-paper';
// import { TimePickerModal } from 'react-native-paper-dates';
// import { commonStyles, createThemedStyles } from '../../constants/styles';
// import { spacing, useAppTheme } from '../../constants/theme';
// import { useForm2 } from '../../contexts/Form2TimelineContext';
// import { ImportanceLevel, NotificationType } from '../../types/enum';
// import { EventType, TimelineEvent } from '../../types/timeline';
// import CustomDropdown from '../ui/CustomDropdown';
// import FormModal from '../ui/FormModal';
// import { TitleText } from '../ui/Typography';

// // This component now uses the standardized FormModal
// export const TimelineFormModal: React.FC = () => {
//     const context = useForm2();
//     const { formData, setFormData } = context;
//     const theme = useAppTheme();
//     const styles = useStyles(theme);

//     if (!formData) return null;

//     const updateForm2Data = (updates: Partial<typeof formData>) => {
//         setFormData(prev => prev ? { ...prev, ...updates } : null);
//     };

//     const addTimelineEvent = () => {
//         const newEvent: TimelineEvent = {
//             id: Date.now().toString(), 
//             time: new Date(), 
//             eventType: 'Other', 
//             description: '',
//             location: '',
//             priority: ImportanceLevel.MEDIUM,
//             notification: NotificationType.NONE, 
//             duration: 30,
//         };
//         updateForm2Data({ events: [...(formData.events || []), newEvent] });
//     };

//     const updateTimelineEvent = (index: number, updatedEvent: TimelineEvent) => {
//         const updatedEvents = [...(formData.events || [])];
//         updatedEvents[index] = updatedEvent;
//         updatedEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
//         updateForm2Data({ events: updatedEvents });
//     };

//     const removeTimelineEvent = (index: number) => {
//         const updatedEvents = (formData.events || []).filter((_, i) => i !== index);
//         updateForm2Data({ events: updatedEvents });
//     };

//     return (
//         <FormModal
//             title="Edit Timeline"
//             subtitle="Manage your project timeline events"
//             context={context}
//             saveLabel="Save Timeline"
//             cancelLabel="Cancel"
//         >
//             <Card style={[commonStyles.card, styles.card]}>
//                 <Card.Content style={commonStyles.cardContent}>
//                     <Button 
//                         mode="contained" 
//                         onPress={addTimelineEvent} 
//                         icon="plus" 
//                         style={{ marginBottom: spacing.md }}
//                         theme={theme}
//                     >
//                         Add Event
//                     </Button>
//                 </Card.Content>
//             </Card>
            
//             <List.AccordionGroup>
//                 {(formData.events || []).map((event, index) => (
//                     <TimelineEventAccordion
//                         key={event.id || index}
//                         event={event} 
//                         index={index} 
//                         onUpdate={updateTimelineEvent} 
//                         onRemove={removeTimelineEvent}
//                     />
//                 ))}
//             </List.AccordionGroup>
//         </FormModal>
//     );
// }

// // The accordion component for a single timeline event
// const TimelineEventAccordion: React.FC<{
//     event: TimelineEvent, 
//     index: number, 
//     onUpdate: (index: number, event: TimelineEvent) => void, 
//     onRemove: (index: number) => void
// }> = ({ event, index, onUpdate, onRemove }) => {
//     const [showTimePicker, setShowTimePicker] = useState(false);
//     const theme = useAppTheme();
//     const styles = useStyles(theme);

//     const accordionId = `timeline-event-${index}`;

//     // Create accordion title from event data
//     const getAccordionTitle = () => {
//         const timeStr = event.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//         const eventDescription = event.description || event.eventType;
        
//         if (eventDescription && timeStr) {
//             return `${timeStr} - ${eventDescription}`;
//         } else if (eventDescription) {
//             return eventDescription;
//         } else if (timeStr) {
//             return `${timeStr} - New Event`;
//         } else {
//             return `Event ${index + 1}`;
//         }
//     };

//     // Check if event has validation errors (missing required fields)
//     const hasErrors = !event.eventType || !event.time;

//     // Get accordion style based on validation state
//     const getAccordionStyle = () => {
//         if (hasErrors) {
//             return [styles.accordion, styles.accordionInvalid];
//         } else {
//             return [styles.accordion, styles.accordionValid];
//         }
//     };

//     // Parse Date to hours and minutes for TimePicker
//     const parseTime = (date: Date) => {
//         if (!date || !(date instanceof Date)) {
//             return { hours: 9, minutes: 0 };
//         }
//         return { hours: date.getHours(), minutes: date.getMinutes() };
//     };

//     const { hours, minutes } = parseTime(event.time);

//     const onTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
//         const newDate = new Date();
//         newDate.setHours(hours, minutes, 0, 0);
//         onUpdate(index, { ...event, time: newDate });
//         setShowTimePicker(false);
//     };

//     return (
//         <List.Accordion 
//             title={getAccordionTitle()}
//             id={accordionId}
//             style={getAccordionStyle()}
//         >
//             <View style={styles.accordionContent}>
//                 <View style={styles.cardHeader}>
//                     <TitleText size="medium" color={theme.colors.onSurface}>
//                         Event {index + 1}
//                     </TitleText>
//                     <IconButton 
//                         icon="delete" 
//                         size={20} 
//                         onPress={() => onRemove(index)}
//                         iconColor={theme.colors.error}
//                     />
//                 </View>
                
//                 {/* Time Picker */}
//                 <Button
//                     mode="outlined"
//                     onPress={() => setShowTimePicker(true)}
//                     style={commonStyles.input}
//                     contentStyle={styles.timeButton}
//                 >
//                     Time: {event.time ? event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '00:00'}
//                 </Button>

//                 <TimePickerModal
//                     visible={showTimePicker}
//                     onDismiss={() => setShowTimePicker(false)}
//                     onConfirm={onTimeConfirm}
//                     hours={hours}
//                     minutes={minutes}
//                     label="Select time"
//                     cancelLabel="Cancel"
//                     confirmLabel="OK"
//                     animationType="fade"
//                 />
                
//                 {/* Event Type Dropdown */}
//                 <CustomDropdown
//                     placeholder={event.eventType || 'Select Event Type'}
//                     data={[
//                         { label: 'Bridal Prep', value: 'BridalPrep' },
//                         { label: 'Groom Prep', value: 'GroomPrep' },
//                         { label: 'Guests Arrive', value: 'GuestsArrive' },
//                         { label: 'Ceremony Begins', value: 'CeremonyBegins' },
//                         { label: 'Confetti and Mingling', value: 'ConfettiAndMingling' },
//                         { label: 'Reception Drinks', value: 'ReceptionDrinks' },
//                         { label: 'Group Photos', value: 'GroupPhotos' },
//                         { label: 'Couple Portraits', value: 'CouplePortraits' },
//                         { label: 'Wedding Breakfast', value: 'WeddingBreakfast' },
//                         { label: 'Speeches', value: 'Speeches' },
//                         { label: 'Evening Guests Arrive', value: 'EveningGuestsArrive' },
//                         { label: 'Cake Cutting', value: 'CakeCutting' },
//                         { label: 'First Dance', value: 'FirstDance' },
//                         { label: 'Evening Entertainment', value: 'EveningEntertainment' },
//                         { label: 'Evening Buffet', value: 'EveningBuffet' },
//                         { label: 'Carriages', value: 'Carriages' },
//                         { label: 'Other', value: 'Other' }
//                     ]}
//                     onSelect={(selectedItem) => onUpdate(index, { ...event, eventType: selectedItem.value as EventType })}
//                 />
                
//                 {/* Description Input */}
//                 <TextInput 
//                     label="Description (Optional)" 
//                     value={event.description || ''} 
//                     onChangeText={text => onUpdate(index, {...event, description: text})} 
//                     mode="outlined" 
//                     style={commonStyles.input}
//                     theme={theme}
//                 />
                
//                 <TextInput 
//                     label="Location" 
//                     value={event.location || ''} 
//                     onChangeText={text => onUpdate(index, {...event, location: text})} 
//                     mode="outlined" 
//                     style={commonStyles.input}
//                     theme={theme}
//                 />
//             </View>
//         </List.Accordion>
//     );
// };

// const useStyles = (theme: any) => {
//     const themedStyles = createThemedStyles(theme);
//     return StyleSheet.create({
//         ...themedStyles,
//         accordion: { 
//             backgroundColor: theme.colors.surface, 
//             borderColor: theme.colors.outline, 
//             borderWidth: 1, 
//             marginBottom: spacing.xs, 
//             borderRadius: 8 
//         },
//         accordionValid: {
//             backgroundColor: theme.colors.surfaceVariant,
//             borderColor: theme.colors.primary,
//             borderWidth: 2,
//         },
//         accordionInvalid: {
//             backgroundColor: theme.colors.errorContainer,
//             borderColor: theme.colors.error,
//             borderWidth: 2,
//         },
//         accordionContent: { 
//             padding: spacing.sm 
//         },
//         cardHeader: { 
//             flexDirection: 'row' as const, 
//             justifyContent: 'space-between' as const, 
//             alignItems: 'center' as const,
//             marginBottom: spacing.sm,
//         },
//         timeButton: {
//             padding: spacing.sm,
//         },
//     });
// };

// export default TimelineFormModal;

