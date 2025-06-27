// import DateTimePicker from '@react-native-community/datetimepicker';
// import React, { useCallback, useState } from 'react';
// import { Animated, Platform, StyleSheet, View } from 'react-native';
// import 'react-native-get-random-values';
// import {
//     Button,
//     Card,
//     Chip,
//     HelperText,
//     IconButton,
//     SegmentedButtons,
//     TextInput
// } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// import { z } from 'zod';

// import { EventType, getEventTypeDetails } from '../../constants/eventTypes';
// import { commonStyles } from '../../constants/styles';
// import { useAppTheme } from '../../constants/theme';
// import {
//     EventNotificationEnum,
//     TTimelineEventForm
// } from '../../types/timeline';
// import EventTypeDropdown from '../ui/EventTypeDropdown';
// import { LabelText } from '../ui/Typography';

// // Internal interfaces for the card
// interface NewEventFormData {
//   eventType?: EventType;
//   time?: Date;
//   description?: string;
//   location?: string;
//   notification?: z.infer<typeof EventNotificationEnum>;
// }

// interface OptionalFields {
//   location: boolean;
//   description: boolean;
//   notifications: boolean;
// }

// // Main NewEventCard component interface
// interface NewEventCardProps {
//   projectDate: Date;
//   animation: Animated.Value;
//   onConfirm: (event: TTimelineEventForm) => void;
//   onClose: () => void;
//   isLoading: boolean;
// }

// const NewEventCard: React.FC<NewEventCardProps> = ({
//   projectDate,
//   animation,
//   onConfirm,
//   onClose,
//   isLoading,
// }) => {
//   const theme = useAppTheme();

//   // Form state
//   const [formData, setFormData] = useState<NewEventFormData>({
//     time: projectDate,
//   });

//   // Optional fields state
//   const [optionalFields, setOptionalFields] = useState<OptionalFields>({
//     location: false,
//     description: false,
//     notifications: false,
//   });

//   // UI state
//   const [showEventTypeMenu, setShowEventTypeMenu] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Validation
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

//   // Handlers
//   const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//     if (errors[key]) {
//       setErrors(prev => ({ ...prev, [key]: '' }));
//     }
//   }, [errors]);

//   const handleOptionalFieldToggle = useCallback((field: keyof OptionalFields) => {
//     setOptionalFields(prev => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
    
//     // Clear the field data if toggling off
//     if (optionalFields[field]) {
//       if (field === 'location') setFormData(prev => ({ ...prev, location: undefined }));
//       if (field === 'description') setFormData(prev => ({ ...prev, description: undefined }));
//       if (field === 'notifications') setFormData(prev => ({ ...prev, notification: undefined }));
//     }
//   }, [optionalFields]);

//   const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
//     setShowTimePicker(false);
//     if (selectedDate) {
//       const newDateTime = new Date(projectDate);
//       newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
//       handleFieldChange('time', newDateTime);
//     }
//   }, [projectDate, handleFieldChange]);

//   const handleConfirm = useCallback(() => {
//     if (!validateForm()) {
//       return;
//     }

//     const eventData: TTimelineEventForm = {
//       eventId: uuidv4(),
//       eventType: formData.eventType!,
//       time: formData.time!,
//       description: optionalFields.description ? formData.description : undefined,
//       location: optionalFields.location ? formData.location : undefined,
//       notification: optionalFields.notifications ? (formData.notification || 'None') : 'None',
//       status: 'Draft',
//     };

//     onConfirm(eventData);
//   }, [formData, optionalFields, validateForm, onConfirm]);

//   const handleReset = useCallback(() => {
//     setFormData({ time: projectDate });
//     setOptionalFields({ location: false, description: false, notifications: false });
//     setErrors({});
//     onClose();
//   }, [projectDate, onClose]);

//   const selectedEventDetail = formData.eventType ? getEventTypeDetails(formData.eventType) : null;

//   const cardStyles = StyleSheet.create({
//     animatedContainer: {
//       overflow: 'hidden',
//     },
//     card: {
//       ...commonStyles.cardLarge,
//       ...commonStyles.marginBottomMd,
//     },
//     cardHeader: {
//       ...commonStyles.rowBetween,
//       ...commonStyles.marginBottomMd,
//     },
//     formSection: {
//       ...commonStyles.marginBottomMd,
//     },
//     dropdown: {
//       ...commonStyles.marginBottomSm,
//     },
//     timeButton: {
//       ...commonStyles.marginBottomSm,
//     },
//     segmentedButton: {
//       ...commonStyles.marginBottomMd,
//     },
//     optionalInput: {
//       ...commonStyles.marginBottomSm,
//       backgroundColor: 'transparent',
//     },
//     actionButtons: {
//       ...commonStyles.buttonContainer,
//       ...commonStyles.marginTopMd,
//     },
//   });

//   const animatedHeight = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 400], // Adjust based on content
//   });

//   return (
//     <Animated.View style={[cardStyles.animatedContainer, { height: animatedHeight }]}>
//       <Card style={commonStyles.cardLarge}>
//         <Card.Content>
//           {/* Card Header */}
//           <View style={cardStyles.cardHeader}>
//             {/* <TitleText size="medium" color={theme.colors.onSurface}>
//               New Event
//             </TitleText> */}
//             <IconButton
//               icon="close"
//               size={20}
//               onPress={handleReset}
//               disabled={isLoading}
//             />
//           </View>

//           {/* Event Type Dropdown */}
//           <View style={cardStyles.formSection}>
//             <LabelText size="medium" style={commonStyles.marginBottomSm}>
//               Event Type *
//             </LabelText>
//             <EventTypeDropdown
//               selectedType={formData.eventType}
//               onSelect={(type) => handleFieldChange('eventType', type)}
//               error={errors.eventType}
//               disabled={isLoading}
//             />
//           </View>

//           {/* Time Picker */}
//           <View style={cardStyles.formSection}>
//             <LabelText size="medium" style={commonStyles.marginBottomSm}>
//               Time *
//             </LabelText>
//             <Button
//               mode="outlined"
//               icon="clock-outline"
//               onPress={() => setShowTimePicker(true)}
//               disabled={isLoading}
//               style={[cardStyles.timeButton, errors.time && { borderColor: theme.colors.error }]}
//             >
//               {formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Select Time'}
//             </Button>
//             {errors.time && <HelperText type="error">{errors.time}</HelperText>}
//           </View>

//           {showTimePicker && (
//             <DateTimePicker
//               value={formData.time || new Date()}
//               mode="time"
//               is24Hour={false}
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={handleTimeChange}
//             />
//           )}

//           {/* Optional Fields Segmented Button */}
//           <View style={cardStyles.formSection}>
//             <LabelText size="medium" style={commonStyles.marginBottomSm}>
//               Additional Options
//             </LabelText>
//             <OptionalFieldsSelector
//               optionalFields={optionalFields}
//               onToggle={handleOptionalFieldToggle}
//               disabled={isLoading}
//             />
//           </View>

//           {/* Conditional Optional Fields */}
//           <ConditionalFields
//             optionalFields={optionalFields}
//             formData={formData}
//             onFieldChange={handleFieldChange}
//             disabled={isLoading}
//           />

//           {/* Action Buttons */}
//           <View style={cardStyles.actionButtons}>
//             <Button
//               mode="text"
//               onPress={handleReset}
//               disabled={isLoading}
//               style={commonStyles.button}
//             >
//               Cancel
//             </Button>
//             <Button
//               mode="contained"
//               onPress={handleConfirm}
//               disabled={isLoading}
//               loading={isLoading}
//               style={commonStyles.button}
//             >
//               Confirm Event
//             </Button>
//           </View>
//         </Card.Content>
//       </Card>
//     </Animated.View>
//   );
// };

// // Supporting Components
// // OptionalFieldsSelector Component
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
//     <View style={commonStyles.row}>
//       <Chip
//         selected={optionalFields.location}
//         onPress={() => onToggle('location')}
//         disabled={disabled}
//         // style={commonStyles.marginBottomSm}
//         icon="map-marker"
//       >
//         Location
//       </Chip>
//       <Chip
//         selected={optionalFields.description}
//         onPress={() => onToggle('description')}
//         disabled={disabled}
//         // style={commonStyles.marginBottomSm}
//         icon="text"
//       >
//         Description
//       </Chip>
//       <Chip
//         selected={optionalFields.notifications}
//         onPress={() => onToggle('notifications')}
//         disabled={disabled}
//         // style={commonStyles.marginBottomSm}
//         icon="bell"
//       >
//         Notifications
//       </Chip>
//     </View>
//   );
// };

// // ConditionalFields Component
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
//   const notificationOptions = ['None', 'Push', 'Email', 'Text', 'Alarm'] as const;

//   return (
//     <View>
//       {/* Location Field */}
//       {optionalFields.location && (
//         <View style={commonStyles.marginBottomMd}>
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
//         <View style={commonStyles.marginBottomMd}>
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

//       {/* Notifications Field */}
//       {optionalFields.notifications && (
//         <View style={commonStyles.marginBottomMd}>
//           <LabelText size="medium" style={commonStyles.marginBottomSm}>
//             Notification Type
//           </LabelText>
//           <SegmentedButtons
//             value={formData.notification || 'None'}
//             onValueChange={(value) => onFieldChange('notification', value)}
//             buttons={notificationOptions.map(option => ({
//               value: option,
//               label: option,
//             }))}
//             // disabled={disabled}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default NewEventCard;
