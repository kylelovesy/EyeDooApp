import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { View } from 'react-native';
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
import BaseFormModal from '../ui/BaseFormModal';
import { CustomDropdown } from '../ui/CustomDropdown';

type PersonInfo = z.infer<typeof PersonInfoSchema>;
type LocationInfo = z.infer<typeof LocationInfoSchema>;

// This component now uses the standardized BaseFormModal
export const EssentialInfoFormModal: React.FC = () => {
    const context = useForm1();
    const { formData } = context;

    if (!formData) return null;

    return (
        <BaseFormModal
            title="Create New Project"
            subtitle="Start by providing the essential details"
            context={context}
            saveLabel="Create Project"
            cancelLabel="Cancel"
        >
            <EssentialInfoFormFields />
        </BaseFormModal>
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
                    label="Location Type"
                    value={location.locationType}
                    options={LOCATION_TYPES.map(o => ({label: o, value: o}))}
                    onValueChange={(value) => onUpdate({ ...location, locationType: value as LocationType })}
                />
                 <TextInput label="Address" value={location.locationAddress || ''} onChangeText={(text) => onUpdate({ ...location, locationAddress: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Postcode" value={location.locationPostcode || ''} onChangeText={(text) => onUpdate({ ...location, locationPostcode: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Arrival Time" value={location.arriveTime || ''} onChangeText={(text) => onUpdate({ ...location, arriveTime: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Departure Time" value={location.leaveTime || ''} onChangeText={(text) => onUpdate({ ...location, leaveTime: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Contact Person" value={location.locationContactPerson || ''} onChangeText={(text) => onUpdate({ ...location, locationContactPerson: text })} mode="outlined" style={styles.input} />
                 <TextInput label="Contact Phone" value={location.locationContactPhone || ''} onChangeText={(text) => onUpdate({ ...location, locationContactPhone: text })} mode="outlined" style={styles.input} keyboardType='phone-pad'/>
            </Card.Content>
        </Card>
    );
};

const PersonForm: React.FC<{person: PersonInfo, title: string, onUpdate: (p: PersonInfo) => void, errors?: z.ZodFormattedError<PersonInfo> | null}> = ({ person, title, onUpdate, errors }) => {
    return (
        <View style={styles.subCardContent}>
            <CustomDropdown
                label="Pronouns"
                value={person.preferredPronouns}
                options={PRONOUNS.map(o => ({ label: o, value: o }))}
                onValueChange={(value) => onUpdate({ ...person, preferredPronouns: value as Pronoun })}
            />
            <TextInput label="First Name *" value={person.firstName} onChangeText={(text) => onUpdate({ ...person, firstName: text })} mode="outlined" style={styles.input} error={!!errors?.firstName} />
            {errors?.firstName && <HelperText type="error">{errors.firstName._errors[0]}</HelperText>}
            <TextInput label="Surname" value={person.surname || ''} onChangeText={(text) => onUpdate({ ...person, surname: text })} mode="outlined" style={styles.input} />
            <TextInput label="Contact Email *" value={person.contactEmail} onChangeText={(text) => onUpdate({ ...person, contactEmail: text })} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" error={!!errors?.contactEmail} />
            {errors?.contactEmail && <HelperText type="error">{errors.contactEmail._errors[0]}</HelperText>}
            <TextInput label="Contact Phone" value={person.contactPhone || ''} onChangeText={(text) => onUpdate({ ...person, contactPhone: text })} mode="outlined" style={styles.input} keyboardType="phone-pad" />
        </View>
    );
};

const EssentialInfoFormFields: React.FC = () => {
  const { formData, setFormData, errors } = useForm1();

  if (!formData) return null;

  const updateFormData = (updates: Partial<typeof formData>) => 
    setFormData((prev) => prev ? { ...prev, ...updates } : null);
  const updatePersonA = (p: PersonInfo) => updateFormData({ personA: p });
  const updatePersonB = (p: PersonInfo) => updateFormData({ personB: p });
  const addLocation = () => updateFormData({ locations: [...(formData.locations || []), { locationType: LocationType.MAIN_VENUE }] });
  const updateLocation = (i: number, l: LocationInfo) => updateFormData({ locations: (formData.locations || []).map((loc, idx) => idx === i ? l : loc) });
  const removeLocation = (i: number) => updateFormData({ locations: (formData.locations || []).filter((_, idx) => idx !== i) });
  const handleDateChange = (d: Date | undefined) => updateFormData({ eventDate: d ? Timestamp.fromDate(d) : undefined });
  const eventDateAsDate = formData.eventDate instanceof Timestamp ? formData.eventDate.toDate() : formData.eventDate;

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
          <List.Accordion title="Additional Details" id="additionalDetails" style={styles.accordion}>
            <View style={styles.accordionContent}>
                <CustomDropdown label="Project Type" value={formData.projectType} options={PROJECT_TYPES.map(o => ({label: o, value: o}))} onValueChange={(v) => updateFormData({ projectType: v as ProjectType })} />
                <CustomDropdown label="Project Status" value={formData.projectStatus} options={PROJECT_STATUS.map(o => ({label: o, value: o}))} onValueChange={(v) => updateFormData({ projectStatus: v as ProjectStatus })} />
                <CustomDropdown label="Event Style" value={formData.eventStyle} options={EVENT_STYLES.map(o => ({label: o, value: o}))} onValueChange={(v) => updateFormData({ eventStyle: v as EventStyle })} />
                <TextInput label="Shared Email" value={formData.sharedEmail || ''} onChangeText={(t) => updateFormData({ sharedEmail: t })} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" error={!!errors?.sharedEmail} />
                {errors?.sharedEmail && <HelperText type="error">{errors.sharedEmail._errors[0]}</HelperText>}
                <TextInput label="Notes" value={formData.notes || ''} onChangeText={(t) => updateFormData({ notes: t })} mode="outlined" multiline numberOfLines={3} style={styles.input} />
            </View>
          </List.Accordion>

          <List.Accordion title="Person A Details" id="personA" style={styles.accordion}>
            <PersonForm title="Person A" person={formData.personA} onUpdate={updatePersonA} errors={errors?.personA} />
          </List.Accordion>

          <List.Accordion title="Person B Details" id="personB" style={styles.accordion}>
            <PersonForm title="Person B" person={formData.personB} onUpdate={updatePersonB} errors={errors?.personB} />
          </List.Accordion>
          
          <List.Accordion title={`Locations (${(formData.locations || []).length})`} id="locations" style={styles.accordion}>
            <View style={styles.accordionContent}>
                <Button mode="contained-tonal" onPress={addLocation} icon="plus" style={{marginBottom: 16}}> Add Location </Button>
                {(formData.locations || []).map((location, index) => (
                  <LocationForm key={index} location={location} index={index} onUpdate={(l) => updateLocation(index, l)} onRemove={() => removeLocation(index)} />
                ))}
            </View>
          </List.Accordion>
        </List.AccordionGroup>
    </>
  );
};

const styles = {
  card: { marginBottom: 16 },
  subCard: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0'},
  subCardContent: { padding: 16 },
  accordion: { backgroundColor: '#ffffff', borderColor: '#e0e0e0', borderWidth: 1, marginBottom: 8, borderRadius: 8 },
  accordionContent: { padding: 16 },
  input: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
};

export default EssentialInfoFormModal;


