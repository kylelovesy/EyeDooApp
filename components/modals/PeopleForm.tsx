import React from 'react';
import { View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
// **CHANGED**: Import the new context hook and BaseFormModal
import { usePersonaForm } from '../../contexts/Form3PersonaContext';
import { PersonWithRoleSchema } from '../../types/reusableSchemas';
import BaseFormModal from '../ui/BaseFormModal';

type PersonWithRole = z.infer<typeof PersonWithRoleSchema>;

// This component now uses the standardized BaseFormModal
export const PeopleFormModal: React.FC = () => {
    const context = usePersonaForm();
    const { formData, setFormData } = context;

    if (!formData) return null;

    const updateForm3Data = (updates: Partial<typeof formData>) => {
        setFormData(prev => prev ? { ...prev, ...updates } : null);
    };

    const addPerson = () => {
        const newPerson: PersonWithRole = { name: '', role: ''};
        updateForm3Data({ immediateFamily: [...(formData.immediateFamily || []), newPerson] });
    };

    const updatePerson = (index: number, updatedPerson: PersonWithRole) => {
        const updatedPeople = [...(formData.immediateFamily || [])];
        updatedPeople[index] = updatedPerson;
        updateForm3Data({ immediateFamily: updatedPeople });
    };

    const removePerson = (index: number) => {
        const updatedPeople = (formData.immediateFamily || []).filter((_, i) => i !== index);
        updateForm3Data({ immediateFamily: updatedPeople });
    };

    return (
        <BaseFormModal
            title="Edit People & Persona"
            subtitle="Manage key people for your project"
            context={context}
            saveLabel="Save People"
            cancelLabel="Cancel"
        >
            {/* Add person button */}
            <Button mode="contained" onPress={addPerson} icon="plus" style={{marginBottom: 16}}>
                Add Person
            </Button>
            
            {/* Map through and render people */}
            {(formData.immediateFamily || []).map((person, index) => (
                <PersonForm 
                    key={index} 
                    person={person} 
                    index={index} 
                    onUpdate={updatePerson} 
                    onRemove={removePerson} 
                />
            ))}
        </BaseFormModal>
    );
}

// The sub-form for a single person (remains mostly the same)
const PersonForm: React.FC<{person: PersonWithRole, index: number, onUpdate: (index: number, person: PersonWithRole) => void, onRemove: (index: number) => void}> = ({ person, index, onUpdate, onRemove }) => {
    // ... your existing PersonWithRoleForm implementation ...
     return (
        <Card style={{marginHorizontal: 16, marginBottom: 12}}>
            <Card.Content>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text variant='titleMedium'>Person {index + 1}</Text>
                    <IconButton icon='delete' onPress={() => onRemove(index)} />
                </View>
                <TextInput label="Name" value={person.name} onChangeText={text => onUpdate(index, {...person, name: text})} mode='outlined' style={{marginBottom: 8}}/>
                <TextInput label="Role" value={person.role || ''} onChangeText={text => onUpdate(index, {...person, role: text})} mode='outlined' style={{marginBottom: 8}}/>
            </Card.Content>
        </Card>
    )
};






// import React, { useState } from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import {
//   Button,
//   Card,
//   IconButton,
//   List,
//   Switch,
//   Text,
//   TextInput
// } from 'react-native-paper';
// import { z } from 'zod';
// import { useProjectForm } from '../../contexts/EssentialInfoFormContext';
// import {
//   CONTACT_TYPES,
//   ContactType,
//   RELATIONSHIP_TO_COUPLE,
//   RelationshipToCouple,
// } from '../../types/enum';
// import { OtherKeyPersonSchema, PersonWithRoleSchema } from '../../types/reusableSchemas';
// import CustomDropdown from '../ui/CustomDropdown';

// // Infer types from Zod schemas for better type safety
// type PersonWithRole = z.infer<typeof PersonWithRoleSchema>;
// type OtherKeyPerson = z.infer<typeof OtherKeyPersonSchema>;

// interface PersonWithRoleFormProps {
//   person: PersonWithRole;
//   index: number;
//   onUpdate: (updatedPerson: PersonWithRole) => void;
//   onRemove: () => void;
//   title: string;
// }

// const PersonWithRoleForm: React.FC<PersonWithRoleFormProps> = ({ person, index, onUpdate, onRemove, title }) => {
//   const relationshipOptions = RELATIONSHIP_TO_COUPLE.map(relationship => ({
//     label: relationship,
//     value: relationship,
//   }));

//   return (
//     <Card style={styles.personCard}>
//       <Card.Content>
//         <View style={styles.cardHeader}>
//           <Text style={styles.personTitle}>{title} {index + 1}</Text>
//           <IconButton
//             icon="delete"
//             size={20}
//             onPress={onRemove}
//             iconColor="#f44336"
//           />
//         </View>

//         <TextInput
//           label="Full Name *"
//           value={person.name}
//           onChangeText={(text) => onUpdate({ ...person, name: text })}
//           mode="outlined"
//           style={styles.input}
//           maxLength={100}
//         />

//         <TextInput
//           label="Role"
//           value={person.role || ''}
//           onChangeText={(text) => onUpdate({ ...person, role: text })}
//           mode="outlined"
//           style={styles.input}
//           placeholder="e.g., Mother of Bride, Best Man, Sister"
//           maxLength={100}
//         />

//         <CustomDropdown
//           label="Relationship to Couple"
//           value={person.relationshipToCouple}
//           options={relationshipOptions}
//           onValueChange={(value) => onUpdate({ ...person, relationshipToCouple: value as RelationshipToCouple })}
//         />

//         <TextInput
//           label="Notes"
//           value={person.notes || ''}
//           onChangeText={(text) => onUpdate({ ...person, notes: text })}
//           mode="outlined"
//           multiline
//           numberOfLines={3}
//           style={styles.input}
//           placeholder="Special considerations, dietary restrictions, etc."
//           maxLength={300}
//         />
//       </Card.Content>
//     </Card>
//   );
// };

// interface OtherKeyPersonFormProps {
//   person: OtherKeyPerson;
//   index: number;
//   onUpdate: (updatedPerson: OtherKeyPerson) => void;
//   onRemove: () => void;
// }

// const OtherKeyPersonForm: React.FC<OtherKeyPersonFormProps> = ({ person, index, onUpdate, onRemove }) => {
//   const contactTypeOptions = CONTACT_TYPES.map(type => ({
//     label: type,
//     value: type,
//   }));

//   return (
//     <Card style={styles.personCard}>
//       <Card.Content>
//         <View style={styles.cardHeader}>
//           <Text style={styles.personTitle}>Key Person {index + 1}</Text>
//           <IconButton
//             icon="delete"
//             size={20}
//             onPress={onRemove}
//             iconColor="#f44336"
//           />
//         </View>

//         <CustomDropdown
//           label="Type of Contact *"
//           value={person.typeOfContact}
//           options={contactTypeOptions}
//           onValueChange={(value) => onUpdate({ ...person, typeOfContact: value as ContactType })}
//         />

//         <TextInput
//           label="Name *"
//           value={person.name}
//           onChangeText={(text) => onUpdate({ ...person, name: text })}
//           mode="outlined"
//           style={styles.input}
//           maxLength={100}
//         />

//         <TextInput
//           label="Contact Details"
//           value={person.contactDetails || ''}
//           onChangeText={(text) => onUpdate({ ...person, contactDetails: text })}
//           mode="outlined"
//           multiline
//           numberOfLines={3}
//           style={styles.input}
//           placeholder="Phone, email, or other contact information"
//           maxLength={300}
//         />
//       </Card.Content>
//     </Card>
//   );
// };

// export const FormStep3: React.FC = () => {
//   const { formData, setFormData } = useProjectForm();
//   const [expanded, setExpanded] = useState<string | null>('immediateFamily');

//   const updateForm3Data = (updates: Partial<typeof formData.form3>) => {
//     setFormData((prev) => ({
//       ...prev,
//       form3: {
//         ...prev.form3,
//         ...updates,
//       },
//     }));
//   };

//   // Helper functions for managing person arrays
//   const addPersonWithRole = (type: 'immediateFamily' | 'extendedFamily' | 'weddingParty') => {
//     const newPerson: PersonWithRole = {
//       id: Date.now().toString(),
//       name: '',
//       role: '',
//       relationshipToCouple: undefined,
//       notes: '',
//     };

//     const currentArray = formData.form3[type] || [];
//     updateForm3Data({
//       [type]: [...currentArray, newPerson],
//     });
//   };

//   const updatePersonWithRole = (type: 'immediateFamily' | 'extendedFamily' | 'weddingParty', index: number, person: PersonWithRole) => {
//     const currentArray = formData.form3[type] || [];
//     const updatedArray = [...currentArray];
//     updatedArray[index] = person;
    
//     updateForm3Data({
//       [type]: updatedArray,
//     });
//   };

//   const removePersonWithRole = (type: 'immediateFamily' | 'extendedFamily' | 'weddingParty', index: number) => {
//     const currentArray = formData.form3[type] || [];
//     const updatedArray = currentArray.filter((_, i) => i !== index);
    
//     updateForm3Data({
//       [type]: updatedArray,
//     });
//   };

//   // Other Key People functions
//   const addOtherKeyPerson = () => {
//     const newPerson: OtherKeyPerson = {
//       id: Date.now().toString(),
//       typeOfContact: 'Other',
//       name: '',
//       contactDetails: '',
//     };

//     updateForm3Data({
//       otherKeyPeople: [...(formData.form3.otherKeyPeople || []), newPerson],
//     });
//   };

//   const updateOtherKeyPerson = (index: number, person: OtherKeyPerson) => {
//     const updatedArray = [...(formData.form3.otherKeyPeople || [])];
//     updatedArray[index] = person;
//     updateForm3Data({ otherKeyPeople: updatedArray });
//   };

//   const removeOtherKeyPerson = (index: number) => {
//     const updatedArray = (formData.form3.otherKeyPeople || []).filter((_, i) => i !== index);
//     updateForm3Data({ otherKeyPeople: updatedArray });
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.content}>
//         <Text style={styles.title}>People & Relationships</Text>
//         <Text style={styles.subtitle}>
//           Manage the important people involved in your project
//         </Text>

//         <List.AccordionGroup>
//           {/* Immediate Family */}
//           <List.Accordion title={`Immediate Family (${(formData.form3.immediateFamily || []).length})`} id="immediateFamily">
//             <View style={styles.sectionHeader}>
//               <Button
//                 mode="contained"
//                 onPress={() => addPersonWithRole('immediateFamily')}
//                 icon="plus"
//                 compact
//               >
//                 Add
//               </Button>
//             </View>

//             {(formData.form3.immediateFamily || []).map((person, index) => (
//               <PersonWithRoleForm
//                 key={person.id || index}
//                 person={person}
//                 index={index}
//                 title="Immediate Family"
//                 onUpdate={(updatedPerson) => updatePersonWithRole('immediateFamily', index, updatedPerson)}
//                 onRemove={() => removePersonWithRole('immediateFamily', index)}
//               />
//             ))}
//           </List.Accordion>

//           {/* Extended Family */}
//           <List.Accordion title={`Extended Family (${(formData.form3.extendedFamily || []).length})`} id="extendedFamily">
//             <View style={styles.sectionHeader}>
//               <Button
//                 mode="contained"
//                 onPress={() => addPersonWithRole('extendedFamily')}
//                 icon="plus"
//                 compact
//               >
//                 Add
//               </Button>
//             </View>

//             {(formData.form3.extendedFamily || []).map((person, index) => (
//               <PersonWithRoleForm
//                 key={person.id || index}
//                 person={person}
//                 index={index}
//                 title="Extended Family"
//                 onUpdate={(updatedPerson) => updatePersonWithRole('extendedFamily', index, updatedPerson)}
//                 onRemove={() => removePersonWithRole('extendedFamily', index)}
//               />
//             ))}
//           </List.Accordion>

//           {/* Wedding Party */}
//           <List.Accordion title={`Wedding Party (${(formData.form3.weddingParty || []).length})`} id="weddingParty">
//             <View style={styles.sectionHeader}>
//               <Button
//                 mode="contained"
//                 onPress={() => addPersonWithRole('weddingParty')}
//                 icon="plus"
//                 compact
//               >
//                 Add
//               </Button>
//             </View>

//             {(formData.form3.weddingParty || []).map((person, index) => (
//               <PersonWithRoleForm
//                 key={person.id || index}
//                 person={person}
//                 index={index}
//                 title="Wedding Party"
//                 onUpdate={(updatedPerson) => updatePersonWithRole('weddingParty', index, updatedPerson)}
//                 onRemove={() => removePersonWithRole('weddingParty', index)}
//               />
//             ))}
//           </List.Accordion>

//           {/* Other Key People */}
//           <List.Accordion title={`Other Key People (${(formData.form3.otherKeyPeople || []).length})`} id="otherKeyPeople">
//             <View style={styles.sectionHeader}>
//               <Button
//                 mode="contained"
//                 onPress={addOtherKeyPerson}
//                 icon="plus"
//                 compact
//               >
//                 Add
//               </Button>
//             </View>

//             {(formData.form3.otherKeyPeople || []).map((person, index) => (
//               <OtherKeyPersonForm
//                 key={person.id || index}
//                 person={person}
//                 index={index}
//                 onUpdate={(updatedPerson) => updateOtherKeyPerson(index, updatedPerson)}
//                 onRemove={() => removeOtherKeyPerson(index)}
//               />
//             ))}
//           </List.Accordion>

//           {/* Special Situations */}
//           <List.Accordion title="Special Situations" id="specialSituations">
//             <Card style={styles.card}>
//               <Card.Content>
//                 {/* Family Situations */}
//                 <View style={styles.switchContainer}>
//                   <Text style={styles.switchLabel}>Family Situations to Consider</Text>
//                   <Switch
//                     value={formData.form3.familySituations || false}
//                     onValueChange={(value) => updateForm3Data({ familySituations: value })}
//                   />
//                 </View>

//                 {formData.form3.familySituations && (
//                   <TextInput
//                     label="Family Situations Notes"
//                     value={formData.form3.familySituationsNotes || ''}
//                     onChangeText={(text) => updateForm3Data({ familySituationsNotes: text })}
//                     mode="outlined"
//                     multiline
//                     numberOfLines={3}
//                     style={styles.input}
//                     placeholder="Describe any family dynamics or situations to be aware of"
//                     maxLength={300}
//                   />
//                 )}

//                 {/* Guests to Avoid */}
//                 <View style={styles.switchContainer}>
//                   <Text style={styles.switchLabel}>Guests to Avoid</Text>
//                   <Switch
//                     value={formData.form3.guestsToAvoid || false}
//                     onValueChange={(value) => updateForm3Data({ guestsToAvoid: value })}
//                   />
//                 </View>

//                 {formData.form3.guestsToAvoid && (
//                   <TextInput
//                     label="Guests to Avoid Notes"
//                     value={formData.form3.guestsToAvoidNotes || ''}
//                     onChangeText={(text) => updateForm3Data({ guestsToAvoidNotes: text })}
//                     mode="outlined"
//                     multiline
//                     numberOfLines={3}
//                     style={styles.input}
//                     placeholder="List people who should be kept separate or avoided"
//                     maxLength={300}
//                   />
//                 )}

//                 {/* Surprises */}
//                 <View style={styles.switchContainer}>
//                   <Text style={styles.switchLabel}>Surprises Planned</Text>
//                   <Switch
//                     value={formData.form3.surprises || false}
//                     onValueChange={(value) => updateForm3Data({ surprises: value })}
//                   />
//                 </View>

//                 {formData.form3.surprises && (
//                   <TextInput
//                     label="Surprises Notes"
//                     value={formData.form3.surprisesNotes || ''}
//                     onChangeText={(text) => updateForm3Data({ surprisesNotes: text })}
//                     mode="outlined"
//                     multiline
//                     numberOfLines={3}
//                     style={styles.input}
//                     placeholder="Describe any planned surprises or special moments"
//                     maxLength={300}
//                   />
//                 )}
//               </Card.Content>
//             </Card>
//           </List.Accordion>

//           {/* Summary */}
//           <List.Accordion title="People Summary" id="summary">
//             <Card style={styles.summaryCard}>
//               <Card.Content>
//                 <Text style={styles.summaryText}>
//                   Immediate Family: {(formData.form3.immediateFamily || []).length}
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Extended Family: {(formData.form3.extendedFamily || []).length}
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Wedding Party: {(formData.form3.weddingParty || []).length}
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Other Key People: {(formData.form3.otherKeyPeople || []).length}
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Total People: {
//                     (formData.form3.immediateFamily || []).length +
//                     (formData.form3.extendedFamily || []).length +
//                     (formData.form3.weddingParty || []).length +
//                     (formData.form3.otherKeyPeople || []).length
//                   }
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Special Considerations: {
//                     [
//                       formData.form3.familySituations && 'Family Situations',
//                       formData.form3.guestsToAvoid && 'Guests to Avoid',
//                       formData.form3.surprises && 'Surprises'
//                     ].filter(Boolean).join(', ') || 'None'
//                   }
//                 </Text>
//               </Card.Content>
//             </Card>
//           </List.Accordion>
//         </List.AccordionGroup>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 24,
//     color: '#666',
//   },
//   card: {
//     marginBottom: 16,
//     elevation: 2,
//   },
//   summaryCard: {
//     marginTop: 16,
//     backgroundColor: '#e8f5e8',
//     elevation: 2,
//   },
//   personCard: {
//     marginBottom: 12,
//     elevation: 1,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   personTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   input: {
//     marginBottom: 12,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 8,
//   },
//   switchLabel: {
//     fontSize: 16,
//     flex: 1,
//   },
//   summaryText: {
//     fontSize: 14,
//     marginBottom: 4,
//     color: '#333',
//   },
// });

