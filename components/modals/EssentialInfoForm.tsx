import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  HelperText,
  IconButton,
  List,
  Text,
  TextInput
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { z } from 'zod';
import { typography } from '../../constants/typography';
import { useForm1 } from '../../contexts/Form1EssentialInfoContext';
import {
  EVENT_STYLES,
  EventStyle,
  LOCATION_TYPES,
  LocationType,
  PROJECT_STATUS,
  PROJECT_TYPES,
  ProjectStatus,
  ProjectType,
  Pronoun,
  PRONOUNS
} from '../../types/enum';
import { LocationInfoSchema, PersonInfoSchema } from '../../types/reusableSchemas';
import CustomDropdown from '../ui/CustomDropdown';
import FormModal from '../ui/FormModal';
import { LabelText } from '../ui/Typography';

type PersonInfo = z.infer<typeof PersonInfoSchema>;
type LocationInfo = z.infer<typeof LocationInfoSchema>;

// This component now uses the standardized BaseFormModal
export const EssentialInfoFormModal: React.FC = () => {
    const context = useForm1();
    const { formData } = context;
    
    if (!formData) return null;

    return (
        <FormModal
            title="Create New Project"
            subtitle="Start by providing the essential details"
            context={context}
            saveLabel="Create Project"
            cancelLabel="Cancel"
        >
            <EssentialInfoFormFields />
        </FormModal>
    );
};

const LocationForm: React.FC<{location: LocationInfo, index: number, onUpdate: (l: LocationInfo) => void, onRemove: () => void}> = ({ location, index, onUpdate, onRemove }) => {
    return(
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant='titleMedium'>Location {index + 1}</Text>
                    <IconButton icon="delete" size={20} onPress={onRemove} />
                </View>
                <CustomDropdown
                  placeholder={location.locationType || 'Select a Type'}
                  data={LOCATION_TYPES.map(o => ({ label: o, value: o }))}
                  onSelect={(selectedItem) => onUpdate({ ...location, locationType: selectedItem.value as LocationType })}
                />
                
                 <TextInput label="Address" value={location.locationAddress || ''} onChangeText={(text) => onUpdate({ ...location, locationAddress: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Postcode" value={location.locationPostcode || ''} onChangeText={(text) => onUpdate({ ...location, locationPostcode: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Contact Person" value={location.locationContactPerson || ''} onChangeText={(text) => onUpdate({ ...location, locationContactPerson: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Contact Phone" value={location.locationContactPhone || ''} onChangeText={(text) => onUpdate({ ...location, locationContactPhone: text || undefined })} mode="outlined" style={styles.input} keyboardType='phone-pad'/>
            </Card.Content>
        </Card>
    );
};

const PersonForm: React.FC<{person: PersonInfo, title: string, onUpdate: (p: PersonInfo) => void, errors?: z.ZodFormattedError<PersonInfo> | null}> = ({ person, title, onUpdate, errors }) => {
    return (
        <View style={styles.subCardContent}>
            <CustomDropdown
                placeholder={person.preferredPronouns || 'Select a Pronoun'}
                data={PRONOUNS.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => onUpdate({ ...person, preferredPronouns: selectedItem.value as Pronoun })}
              />
           
            <TextInput label="First Name *" value={person.firstName} onChangeText={(text) => onUpdate({ ...person, firstName: text })} mode="outlined" style={styles.input} error={!!errors?.firstName} />
            {errors?.firstName && <HelperText type="error">{errors.firstName._errors[0]}</HelperText>}
            <TextInput label="Surname" value={person.surname || ''} onChangeText={(text) => onUpdate({ ...person, surname: text || undefined })} mode="outlined" style={styles.input} />
            <TextInput label="Contact Email *" value={person.contactEmail} onChangeText={(text) => onUpdate({ ...person, contactEmail: text })} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" error={!!errors?.contactEmail} />
            {errors?.contactEmail && <HelperText type="error">{errors.contactEmail._errors[0]}</HelperText>}
            <TextInput label="Contact Phone" value={person.contactPhone || ''} onChangeText={(text) => onUpdate({ ...person, contactPhone: text || undefined })} mode="outlined" style={styles.input} keyboardType="phone-pad" error={!!errors?.contactPhone} />
            {errors?.contactPhone && <HelperText type="error">{errors.contactPhone._errors[0]}</HelperText>}
        </View>
    );
};

const EssentialInfoFormFields: React.FC = () => {
  const { formData, setFormData, errors, isValid } = useForm1();
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());

  // Debug logging
  useEffect(() => {
    console.log('Form validation state:', {
      isValid,
      formData: formData ? {
        projectName: formData.projectName,
        eventDate: formData.eventDate,
        personA: {
          firstName: formData.personA.firstName,
          contactEmail: formData.personA.contactEmail,
          contactPhone: formData.personA.contactPhone
        },
        personB: {
          firstName: formData.personB.firstName,
          contactEmail: formData.personB.contactEmail,
          contactPhone: formData.personB.contactPhone
        },
        locations: formData.locations?.length || 0
      } : null,
      errors: errors ? Object.keys(errors).filter(key => key !== '_errors') : []
    });
  }, [isValid, formData, errors]);

  if (!formData) return null;

  const updateFormData = (updates: Partial<typeof formData>) => 
    setFormData((prev) => prev ? { ...prev, ...updates } : null);
  const updatePersonA = (p: PersonInfo) => updateFormData({ personA: p });
  const updatePersonB = (p: PersonInfo) => updateFormData({ personB: p });
  const addLocation = () => updateFormData({ locations: [...(formData.locations || []), { locationType: LocationType.MAIN_VENUE }] });
  const updateLocation = (i: number, l: LocationInfo) => updateFormData({ locations: (formData.locations || []).map((loc, idx) => idx === i ? l : loc) });
  const removeLocation = (i: number) => updateFormData({ locations: (formData.locations || []).filter((_, idx) => idx !== i) });
  const handleDateChange = (d: Date | undefined) => updateFormData({ eventDate: d });
  
  const eventDateAsDate: Date | undefined = formData.eventDate instanceof Date 
    ? formData.eventDate 
    : undefined;

  // Track accordion expansion
  const handleAccordionToggle = (accordionId: string) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accordionId)) {
        newSet.delete(accordionId);
      } else {
        newSet.add(accordionId);
      }
      return newSet;
    });
  };

  // Use Zod validation errors to determine accordion state - now works for both expanded and collapsed
const getAccordionStyle = (accordionId: string, hasErrors: boolean) => {
  const isExpanded = expandedAccordions.has(accordionId);
  
  console.log(`Accordion ${accordionId}:`, { isExpanded, hasErrors });
  
  // Return array of styles directly
  if (hasErrors) {
    return [styles.accordion, styles.accordionInvalid]; // Red tint when has errors
  } else {
    return [styles.accordion, styles.accordionValid]; // Green tint when no errors
  }
};

  // Check validation state for each accordion
  const additionalDetailsHasErrors = !!errors?.sharedEmail;
  const personAHasErrors = !!(errors?.personA?.firstName || errors?.personA?.contactEmail || errors?.personA?.contactPhone);
  const personBHasErrors = !!(errors?.personB?.firstName || errors?.personB?.contactEmail || errors?.personB?.contactPhone);
  const locationsHasErrors = !!errors?.locations || (formData.locations || []).length === 0;

  return (
    <>
        <Card style={styles.card}>
            <Card.Content>
                 <TextInput label="Project Name *" value={formData.projectName} onChangeText={(text) => updateFormData({ projectName: text })} mode="outlined" style={styles.input} error={!!errors?.projectName} />
                {errors?.projectName && <HelperText type="error">{errors.projectName._errors[0]}</HelperText>}
                <DatePickerInput locale="en" label="Event Date" value={eventDateAsDate} onChange={handleDateChange} inputMode="start" mode="outlined" style={styles.input} />
            </Card.Content>
        </Card>
        
        <List.AccordionGroup>
          <List.Accordion 
            title="Additional Details" 
            id="additionalDetails" 
            style={getAccordionStyle('additionalDetails', additionalDetailsHasErrors)}
            onPress={() => handleAccordionToggle('additionalDetails')}
          >
            <View style={styles.accordionContent}>
              {/* --- Project Type Dropdown --- */}
              <LabelText style={typography.labelSmall}>Project Type</LabelText>
              <CustomDropdown
                placeholder={formData.projectType || 'Select a Type'}
                data={PROJECT_TYPES.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ projectType: selectedItem.value as ProjectType })}
              />

              {/* --- Project Status Dropdown --- */}
              <LabelText style={typography.labelSmall}>Project Status</LabelText>
              <CustomDropdown
                placeholder={formData.projectStatus || 'Select a Status'}
                data={PROJECT_STATUS.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ projectStatus: selectedItem.value as ProjectStatus })}
              />

              {/* --- Event Style Dropdown --- */}
              <LabelText style={typography.labelSmall}>Event Style</LabelText>
              <CustomDropdown
                placeholder={formData.eventStyle || 'Select a Style'}
                data={EVENT_STYLES.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ eventStyle: selectedItem.value as EventStyle })}
              />
             
                <TextInput label="Shared Email" value={formData.sharedEmail || ''} onChangeText={(t) => updateFormData({ sharedEmail: t || undefined })} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" error={!!errors?.sharedEmail} />
                {errors?.sharedEmail && <HelperText type="error">{errors.sharedEmail._errors[0]}</HelperText>}
                <TextInput label="Notes" value={formData.notes || ''} onChangeText={(t) => updateFormData({ notes: t || undefined })} mode="outlined" multiline numberOfLines={3} style={styles.input} />
            </View>
          </List.Accordion>

          <List.Accordion 
            title="Person A Details" 
            id="personA" 
            style={getAccordionStyle('personA', personAHasErrors)}
            onPress={() => handleAccordionToggle('personA')}
          >
            <PersonForm title="Person A" person={formData.personA} onUpdate={updatePersonA} errors={errors?.personA} />
          </List.Accordion>

          <List.Accordion 
            title="Person B Details" 
            id="personB" 
            style={getAccordionStyle('personB', personBHasErrors)}
            onPress={() => handleAccordionToggle('personB')}
          >
            <PersonForm title="Person B" person={formData.personB} onUpdate={updatePersonB} errors={errors?.personB} />
          </List.Accordion>
          
          <List.Accordion 
            title={`Locations (${(formData.locations || []).length})`} 
            id="locations" 
            style={getAccordionStyle('locations', locationsHasErrors)}
            onPress={() => handleAccordionToggle('locations')}
          >
            <View style={styles.accordionContent}>
                <Button mode="contained-tonal" onPress={addLocation} icon="plus" style={{marginBottom: 16}}> Add Location </Button>
                {(formData.locations || []).map((location, index) => (
                  <LocationForm key={index} location={location} index={index} onUpdate={(l) => updateLocation(index, l)} onRemove={() => removeLocation(index)} />
                ))}
            </View>
          </List.Accordion>
        </List.AccordionGroup>

        {/* Debug info - remove this after debugging */}
        {/* <Card style={{marginTop: 16, backgroundColor: '#f0f0f0'}}>
          <Card.Content>
            <Text variant="titleSmall">Debug Info:</Text>
            <Text>Form Valid: {isValid ? 'Yes' : 'No'}</Text>
            <Text>Project Name: {formData.projectName || 'Empty'}</Text>
            <Text>Event Date: {eventDateAsDate ? 'Set' : 'Not Set'}</Text>
            <Text>Person A Name: {formData.personA.firstName || 'Empty'}</Text>
            <Text>Person A Email: {formData.personA.contactEmail || 'Empty'}</Text>
            <Text>Person B Name: {formData.personB.firstName || 'Empty'}</Text>
            <Text>Person B Email: {formData.personB.contactEmail || 'Empty'}</Text>
            <Text>Locations: {(formData.locations || []).length}</Text>
            <Text>Errors: {errors ? Object.keys(errors).filter(key => key !== '_errors').join(', ') : 'None'}</Text>
          </Card.Content>
        </Card> */}
    </>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  subCard: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0'},
  subCardContent: { padding: 12 },
  accordion: { 
    backgroundColor: '#ffffff', 
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
    marginBottom: 8, 
    borderRadius: 8 
  },
  accordionValid: {
    backgroundColor: '#f0f9f0', // Light green background
    borderColor: '#4caf50',     // Green border
    borderWidth: 2,
  },
  accordionInvalid: {
    backgroundColor: '#fef8f8', // Light red background
    borderColor: '#f44336',     // Red border
    borderWidth: 2,
  },
  accordionContent: { padding: 12 },
  input: { marginBottom: 8 },
  cardHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
});

export default EssentialInfoFormModal;


