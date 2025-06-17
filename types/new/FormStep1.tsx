import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    HelperText,
    IconButton,
    Text,
    TextInput,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { Dropdown } from 'react-native-paper-dropdown';
import { z } from 'zod';
import { useProjectForm } from './ProjectFormContext';
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
    PRONOUNS,
} from './enum';
import { LocationInfoSchema, PersonInfoSchema } from './reusableSchemas';

// Infer types from Zod schemas for better type safety
type PersonInfo = z.infer<typeof PersonInfoSchema>;
type LocationInfo = z.infer<typeof LocationInfoSchema>;

interface LocationFormProps {
  location: LocationInfo;
  index: number;
  onUpdate: (updatedLocation: LocationInfo) => void;
  onRemove: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, index, onUpdate, onRemove }) => {
  const [showLocationTypeDropdown, setShowLocationTypeDropdown] = useState(false);

  const locationTypeOptions = LOCATION_TYPES.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <Card style={styles.locationCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.locationTitle}>Location {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>
        <Dropdown
          label="Location Type *"
          mode="outlined"
          value={location.locationType}
          onSelect={(value) => onUpdate({ ...location, locationType: value as LocationType })}
          options={locationTypeOptions}
        />
        <TextInput
          label="Address"
          value={location.locationAddress || ''}
          onChangeText={(text) => onUpdate({ ...location, locationAddress: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Postcode"
          value={location.locationPostcode || ''}
          onChangeText={(text) => onUpdate({ ...location, locationPostcode: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Arrival Time (HH:MM)"
          value={location.arriveTime || ''}
          onChangeText={(text) => onUpdate({ ...location, arriveTime: text })}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., 09:00"
        />
        <TextInput
          label="Departure Time (HH:MM)"
          value={location.leaveTime || ''}
          onChangeText={(text) => onUpdate({ ...location, leaveTime: text })}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., 17:00"
        />
        <TextInput
          label="Contact Person"
          value={location.locationContactPerson || ''}
          onChangeText={(text) => onUpdate({ ...location, locationContactPerson: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Contact Phone"
          value={location.locationContactPhone || ''}
          onChangeText={(text) => onUpdate({ ...location, locationContactPhone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />        
      </Card.Content>
    </Card>
  );
};

interface PersonFormProps {
  person: PersonInfo;
  onUpdate: (updatedPerson: PersonInfo) => void;
  title: string;
  errors?: z.ZodFormattedError<PersonInfo>;
}

const PersonForm: React.FC<PersonFormProps> = ({ person, onUpdate, title, errors }) => {
  const [showPronounsDropdown, setShowPronounsDropdown] = useState(false);

  const pronounOptions = PRONOUNS.map((pronoun) => ({
    label: pronoun,
    value: pronoun,
  }));

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text>{title}</Text>
        <Dropdown
          label="Preferred Pronouns"
          mode="outlined"
          value={person.preferredPronouns}
          onSelect={(value) => onUpdate({ ...person, preferredPronouns: value as Pronoun })}
          options={pronounOptions}
        />
        <TextInput
          label="First Name *"
          value={person.firstName}
          onChangeText={(text) => onUpdate({ ...person, firstName: text })}
          mode="outlined"
          style={styles.input}
          error={!!errors?.firstName}
        />
        {errors?.firstName && <HelperText type="error">{errors.firstName._errors[0]}</HelperText>}

        <TextInput
          label="Surname"
          value={person.surname || ''}
          onChangeText={(text) => onUpdate({ ...person, surname: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Contact Email *"
          value={person.contactEmail}
          onChangeText={(text) => onUpdate({ ...person, contactEmail: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors?.contactEmail}
        />
        {errors?.contactEmail && <HelperText type="error">{errors.contactEmail._errors[0]}</HelperText>}

        <TextInput
          label="Contact Phone"
          value={person.contactPhone || ''}
          onChangeText={(text) => onUpdate({ ...person, contactPhone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          error={!!errors?.contactPhone}
        />
        {errors?.contactPhone && <HelperText type="error">{errors.contactPhone._errors[0]}</HelperText>}
      </Card.Content>
    </Card>
  );
};

export const FormStep1: React.FC = () => {
  const { formData, setFormData, errors } = useProjectForm();
  const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);
  const [showProjectStatusDropdown, setShowProjectStatusDropdown] = useState(false);
  const [showEventStyleDropdown, setShowEventStyleDropdown] = useState(false);

  const projectTypeOptions = PROJECT_TYPES.map((type) => ({
    label: type,
    value: type,
  }));

  const projectStatusOptions = PROJECT_STATUS.map((status) => ({
    label: status,
    value: status,
  }));

  const eventStyleOptions = EVENT_STYLES.map((style) => ({
    label: style,
    value: style,
  }));

  const updateForm1Data = (updates: Partial<typeof formData.form1>) => {
    setFormData((prev) => ({
      ...prev,
      form1: {
        ...prev.form1,
        ...updates,
      },
    }));
  };

  const updatePersonA = (updatedPerson: PersonInfo) => {
    updateForm1Data({ personA: updatedPerson });
  };

  const updatePersonB = (updatedPerson: PersonInfo) => {
    updateForm1Data({ personB: updatedPerson });
  };

  const addLocation = () => {
    const newLocation: LocationInfo = {
      locationType: 'Main Venue',
      locationAddress: '',
      locationPostcode: '',
      arriveTime: '',
      leaveTime: '',
      locationContactPerson: '',
      locationContactPhone: ''
    };
    updateForm1Data({ locations: [...(formData.form1.locations || []), newLocation] });
  };

  const updateLocation = (index: number, updatedLocation: LocationInfo) => {
    const updatedLocations = [...(formData.form1.locations || [])];
    updatedLocations[index] = updatedLocation;
    updateForm1Data({ locations: updatedLocations });
  };

  const removeLocation = (index: number) => {
    const updatedLocations = (formData.form1.locations || []).filter((_, i) => i !== index);
    updateForm1Data({ locations: updatedLocations });
  };

  // Convert Firestore Timestamp to Date for DatePickerInput
  const eventDateAsDate = formData.form1.eventDate instanceof Timestamp
    ? formData.form1.eventDate.toDate()
    : formData.form1.eventDate;

  const handleDateChange = (d: Date | undefined) => {
    // Convert Date back to Firestore Timestamp for storage if needed, or keep as Date if context handles conversion
    const newDate = d ? Timestamp.fromDate(d) : undefined;
    updateForm1Data({ eventDate: newDate });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Essential Project Information</Text>
        <Text style={styles.subtitle}>
          Provide the core details for your project.
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text>Project Details</Text>
            <TextInput
              label="Project Name *"
              value={formData.form1.name}
              onChangeText={(text) => updateForm1Data({ name: text })}
              mode="outlined"
              style={styles.input}
              error={!!errors?.form1?.name}
            />
            {errors?.form1?.name && <HelperText type="error">{errors.form1.name._errors[0]}</HelperText>}

            <Dropdown
              label="Project Type"
              mode="outlined"
              value={formData.form1.type}
              onSelect={(value) => updateForm1Data({ type: value as ProjectType })}
              options={projectTypeOptions}
            />

            <Dropdown
              label="Project Status"
              mode="outlined"
              value={formData.form1.status}
              onSelect={(value) => updateForm1Data({ status: value as ProjectStatus })}
              options={projectStatusOptions}
            />

            <Dropdown
              label="Event Style"
              mode="outlined"
              value={formData.form1.style}
              onSelect={(value) => updateForm1Data({ style: value as EventStyle })}
              options={eventStyleOptions}
            />

            <DatePickerInput
              locale="en"
              label="Event Date"
              value={eventDateAsDate}
              onChange={handleDateChange}
              inputMode="start"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Shared Email"
              value={formData.form1.sharedEmail || ''}
              onChangeText={(text) => updateForm1Data({ sharedEmail: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors?.form1?.sharedEmail}
            />
            {errors?.form1?.sharedEmail && <HelperText type="error">{errors.form1.sharedEmail._errors[0]}</HelperText>}

            <TextInput
              label="Notes"
              value={formData.form1.notes || ''}
              onChangeText={(text) => updateForm1Data({ notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <PersonForm
          title="Person A Details"
          person={formData.form1.personA}
          onUpdate={updatePersonA}
          errors={errors?.form1?.personA}
        />

        <PersonForm
          title="Person B Details"
          person={formData.form1.personB}
          onUpdate={updatePersonB}
          errors={errors?.form1?.personB}
        />

        <View style={styles.sectionHeader}>
          <Text>Locations ({(formData.form1.locations || []).length})</Text>
          <Button mode="contained" onPress={addLocation} icon="plus" compact>
            Add Location
          </Button>
        </View>
        {(formData.form1.locations || []).map((location, index) => (
          <LocationForm
            key={index}
            location={location}
            index={index}
            onUpdate={(updatedLocation) => updateLocation(index, updatedLocation)}
            onRemove={() => removeLocation(index)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  locationCard: {
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginBottom: 12,
  },
  dropdown: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});

