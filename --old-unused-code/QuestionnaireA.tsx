// # 3.1.1 Event questionnaire A modal
// ######################################################################
// # FILE: src/components/modals/Questionnaire1Modal.tsx
// ######################################################################


// import React, { useEffect, useState } from 'react';
// import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
// import 'react-native-get-random-values';
// import { SegmentedButtons, TextInput, useTheme } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// // Assume UI components and services are imported from your project
// import { QuestionnaireService } from '../../services/questionnaireService';
// import { EssentialInfo, LocationInfo } from '../../types/questionnaire';
// import { DatePickerInput } from '../forms/DatePickerInput';
// import { CustomButton } from '../ui/CustomButton';
// import { RepeatableSection } from '../ui/RepeatableSection';
// import { Screen } from '../ui/Screen';
// import { BodyText, HeadlineText, TitleText } from '../ui/Typography';

// interface Questionnaire1ModalProps {
//   visible: boolean;
//   onClose: () => void;
//   projectId: string;
//   initialData?: EssentialInfo;
// }

// const emptyLocation: LocationInfo = {
//     id: uuidv4(),
//     locationType: 'Main Venue',
//     locationAddress: '',
//     arriveTime: '',
//     leaveTime: '',
//     locationContactPerson: '',
//     locationContactPhone: '',
//     locationNotes: '',
// };

// const emptyForm: EssentialInfo = {
//   personA: { firstName: '', contactEmail: '', contactPhone: '' },
//   personB: { firstName: '', contactEmail: '', contactPhone: '' },
//   weddingDate: new Date(),
//   locations: [emptyLocation],
// };

// export const Questionnaire1Modal: React.FC<Questionnaire1ModalProps> = ({ visible, onClose, projectId, initialData }) => {
//   const [formData, setFormData] = useState<EssentialInfo>(initialData || emptyForm);
//   const [loading, setLoading] = useState(false);
//   const theme = useTheme();

//   useEffect(() => {
//     if (visible) {
//         const data = initialData ? { ...initialData } : { ...emptyForm };
//         if (!data.locations || data.locations.length === 0) {
//             data.locations = [emptyLocation];
//         }
//         if (data.weddingDate && !(data.weddingDate instanceof Date)) {
//            data.weddingDate = new Date();
//         }
//         setFormData(data);
//     }
//   }, [initialData, visible]);

//   const updatePersonField = (person: 'personA' | 'personB', field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [person]: { ...prev[person], [field]: value } }));
//   };

//   const updateRootField = (field: keyof Omit<EssentialInfo, 'personA' | 'personB' | 'locations'>, value: any) => {
//       setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleLocationChange = (index: number, field: keyof LocationInfo, value: string) => {
//     const newLocations = [...(formData.locations || [])];
//     newLocations[index] = { ...newLocations[index], [field]: value };
//     setFormData(prev => ({...prev, locations: newLocations}));
//   };

//   const addLocation = () => {
//     const newLocations = [...(formData.locations || []), { ...emptyLocation, id: uuidv4() }];
//     setFormData(prev => ({...prev, locations: newLocations}));
//   };

//   const removeLocation = (index: number) => {
//     if ((formData.locations?.length ?? 0) <= 1) {
//         Alert.alert("Cannot Remove", "At least one location is required.");
//         return;
//     }
//     const newLocations = [...(formData.locations || [])];
//     newLocations.splice(index, 1);
//     setFormData(prev => ({...prev, locations: newLocations}));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await QuestionnaireService.saveEssentialInfo(projectId, formData);
//       Alert.alert("Success", "Essential Information saved!");
//       onClose();
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Failed to save data.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const styles = getModalStyles(theme);

//   return (
//     <Modal visible={visible} onRequestClose={onClose} animationType="slide">
//         <Screen>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardAvoidingView}
//             >
//                 <ScrollView contentContainerStyle={styles.container}>
//                     <View style={styles.header}>
//                         <HeadlineText size="medium">Essential Information</HeadlineText>
//                         <BodyText style={{opacity: 0.7}}>Fill in the key details for the wedding day.</BodyText>
//                     </View>

//                     <TitleText size="large" style={styles.sectionTitle}>Couple&apos;s Information</TitleText>
//                     <View style={styles.coupleContainer}>
//                         <View style={styles.personContainer}>
//                             <TitleText size='medium'>Partner A</TitleText>
//                             <TextInput label="First Name *" value={formData.personA.firstName} onChangeText={v => updatePersonField('personA', 'firstName', v)} mode="outlined" />
//                             <TextInput label="Surname" value={formData.personA.surname || ''} onChangeText={v => updatePersonField('personA', 'surname', v)} mode="outlined" />
//                             <TextInput label="Contact Email *" value={formData.personA.contactEmail} onChangeText={v => updatePersonField('personA', 'contactEmail', v)} mode="outlined" keyboardType="email-address" />
//                             <TextInput label="Contact Phone *" value={formData.personA.contactPhone} onChangeText={v => updatePersonField('personA', 'contactPhone', v)} mode="outlined" keyboardType="phone-pad" />
//                         </View>
//                         <View style={styles.personContainer}>
//                             <TitleText size='medium'>Partner B</TitleText>
//                             <TextInput label="First Name *" value={formData.personB.firstName} onChangeText={v => updatePersonField('personB', 'firstName', v)} mode="outlined" />
//                             <TextInput label="Surname" value={formData.personB.surname || ''} onChangeText={v => updatePersonField('personB', 'surname', v)} mode="outlined" />
//                             <TextInput label="Contact Email *" value={formData.personB.contactEmail} onChangeText={v => updatePersonField('personB', 'contactEmail', v)} mode="outlined" keyboardType="email-address" />
//                             <TextInput label="Contact Phone *" value={formData.personB.contactPhone} onChangeText={v => updatePersonField('personB', 'contactPhone', v)} mode="outlined" keyboardType="phone-pad" />
//                         </View>
//                     </View>
                    
//                     <TitleText size="large" style={styles.sectionTitle}>Wedding Details</TitleText>
//                      <View style={styles.formSection}>
//                         <TextInput label="Shared/Wedding Email" value={formData.sharedEmail || ''} onChangeText={v => updateRootField('sharedEmail', v)} mode="outlined" keyboardType="email-address" />
//                         <TextInput label="Wedding Vibe/Style" value={formData.weddingVibe || ''} onChangeText={v => updateRootField('weddingVibe', v)} mode="outlined" multiline placeholder='e.g., Romantic, Modern, Traditional...'/>
//                         <DatePickerInput
//                             label="Wedding Date *"
//                             value={formData.weddingDate}
//                             onDateChange={(date) => updateRootField('weddingDate', date)}
//                             mode="outlined"
//                         />
//                     </View>

//                     <RepeatableSection
//                         title="Venue & Location Details"
//                         items={formData.locations || []}
//                         onAddItem={addLocation}
//                         onRemoveItem={removeLocation}
//                         addButonText="Add Another Location"
//                         renderItem={(item, index) => (
//                             <>
//                                 <SegmentedButtons
//                                     value={item.locationType}
//                                     onValueChange={(v) => handleLocationChange(index, 'locationType', v)}
//                                     buttons={[
//                                         { value: 'Main Venue', label: 'Main' },
//                                         { value: 'Ceremony', label: 'Ceremony' },
//                                         { value: 'Reception', label: 'Reception' },
//                                     ]}
//                                 />
//                                 <TextInput label="Location Address *" value={item.locationAddress} onChangeText={v => handleLocationChange(index, 'locationAddress', v)} mode="outlined" />
//                                 <View style={styles.row}>
//                                     <TextInput style={{flex: 1}} label="Arrive Time" value={item.arriveTime || ''} onChangeText={v => handleLocationChange(index, 'arriveTime', v)} mode="outlined" placeholder='e.g. 09:00 AM'/>
//                                     <TextInput style={{flex: 1}} label="Leave Time" value={item.leaveTime || ''} onChangeText={v => handleLocationChange(index, 'leaveTime', v)} mode="outlined" placeholder='e.g. 11:00 PM'/>
//                                 </View>
//                                 <TextInput label="Location Contact Person" value={item.locationContactPerson || ''} onChangeText={v => handleLocationChange(index, 'locationContactPerson', v)} mode="outlined" />
//                                 <TextInput label="Location Notes" value={item.locationNotes || ''} onChangeText={v => handleLocationChange(index, 'locationNotes', v)} mode="outlined" multiline placeholder='e.g. Parking info, room number...'/>
//                             </>
//                         )}
//                     />

//                     <View style={styles.buttonContainer}>
//                         <CustomButton title="Cancel" variant="outline" onPress={onClose} style={{flex: 1}} disabled={loading} />
//                         <CustomButton title="Save" variant="primary" onPress={handleSubmit} style={{flex: 1}} loading={loading} />
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Screen>
//     </Modal>
//   );
// };

// const getModalStyles = (theme: any) => StyleSheet.create({
//     keyboardAvoidingView: { flex: 1 },
//     container: { padding: 15, paddingBottom: 40 },
//     header: { marginBottom: 20, alignItems: 'center' },
//     sectionTitle: { marginTop: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.outline, paddingBottom: 10 },
//     coupleContainer: { flexDirection: 'row', gap: 15 },
//     personContainer: { flex: 1, gap: 10 },
//     formSection: { gap: 15 },
//     row: { flexDirection: 'row', gap: 10 },
//     buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 15 },
// });

