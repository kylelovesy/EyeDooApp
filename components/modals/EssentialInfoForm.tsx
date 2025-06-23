import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  HelperText,
  IconButton,
  List,
  TextInput
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { z } from 'zod';
import { commonStyles, createThemedStyles } from '../../constants/styles';
import { spacing, useAppTheme } from '../../constants/theme';
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
import { LabelText, TitleText } from '../ui/Typography';

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
    const theme = useAppTheme();
    const styles = useStyles(theme);
    
    return(
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <TitleText size="medium" color={theme.colors.onSurface}>
                        Location {index + 1}
                    </TitleText>
                    <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={onRemove}
                        iconColor={theme.colors.onSurfaceVariant}
                    />
                </View>
                <CustomDropdown
                  placeholder={location.locationType || 'Select a Type'}
                  data={LOCATION_TYPES.map(o => ({ label: o, value: o }))}
                  onSelect={(selectedItem) => onUpdate({ ...location, locationType: selectedItem.value as LocationType })}
                />
                
                 <TextInput 
                    label="Address" 
                    value={location.locationAddress || ''} 
                    onChangeText={(text) => onUpdate({ ...location, locationAddress: text })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    theme={theme}
                />
                 <TextInput 
                    label="Postcode" 
                    value={location.locationPostcode || ''} 
                    onChangeText={(text) => onUpdate({ ...location, locationPostcode: text })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    theme={theme}
                />
                 <TextInput 
                    label="Contact Person" 
                    value={location.locationContactPerson || ''} 
                    onChangeText={(text) => onUpdate({ ...location, locationContactPerson: text })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    theme={theme}
                />
                 <TextInput 
                    label="Contact Phone" 
                    value={location.locationContactPhone || ''} 
                    onChangeText={(text) => onUpdate({ ...location, locationContactPhone: text || undefined })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    keyboardType='phone-pad'
                    theme={theme}
                />
            </Card.Content>
        </Card>
    );
};

const PersonForm: React.FC<{person: PersonInfo, title: string, onUpdate: (p: PersonInfo) => void, errors?: z.ZodFormattedError<PersonInfo> | null}> = ({ person, title, onUpdate, errors }) => {
    const theme = useAppTheme();
    const styles = useStyles(theme);
    
    return (
        <View style={styles.accordionContent}>
            <CustomDropdown
                placeholder={person.preferredPronouns || 'Select a Pronoun'}
                data={PRONOUNS.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => onUpdate({ ...person, preferredPronouns: selectedItem.value as Pronoun })}
              />
           
            <TextInput 
                label="First Name *" 
                value={person.firstName} 
                onChangeText={(text) => onUpdate({ ...person, firstName: text })} 
                mode="outlined" 
                style={commonStyles.input}
                error={!!errors?.firstName}
                theme={theme}
            />
            {errors?.firstName && <HelperText type="error">{errors.firstName._errors[0]}</HelperText>}
            <TextInput 
                label="Surname" 
                value={person.surname || ''} 
                onChangeText={(text) => onUpdate({ ...person, surname: text || undefined })} 
                mode="outlined" 
                style={commonStyles.input}
                theme={theme}
            />
            <TextInput 
                label="Contact Email *" 
                value={person.contactEmail} 
                onChangeText={(text) => onUpdate({ ...person, contactEmail: text })} 
                mode="outlined" 
                style={commonStyles.input}
                keyboardType="email-address" 
                autoCapitalize="none" 
                error={!!errors?.contactEmail}
                theme={theme}
            />
            {errors?.contactEmail && <HelperText type="error">{errors.contactEmail._errors[0]}</HelperText>}
            <TextInput 
                label="Contact Phone" 
                value={person.contactPhone || ''} 
                onChangeText={(text) => onUpdate({ ...person, contactPhone: text || undefined })} 
                mode="outlined" 
                style={commonStyles.input}
                keyboardType="phone-pad" 
                error={!!errors?.contactPhone}
                theme={theme}
            />
            {errors?.contactPhone && <HelperText type="error">{errors.contactPhone._errors[0]}</HelperText>}
        </View>
    );
};

const EssentialInfoFormFields: React.FC = () => {
  const { formData, setFormData, errors, isValid } = useForm1();
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  const theme = useAppTheme();
  const styles = useStyles(theme);

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

  // Use theme colors for validation styling
  const getAccordionStyle = (accordionId: string, hasErrors: boolean) => {
    if (hasErrors) {
      return [styles.accordion, styles.accordionInvalid];
    } else {
      return [styles.accordion, styles.accordionValid];
    }
  };

  // Check validation state for each accordion
  const additionalDetailsHasErrors = !!errors?.sharedEmail;
  const personAHasErrors = !!(errors?.personA?.firstName || errors?.personA?.contactEmail || errors?.personA?.contactPhone);
  const personBHasErrors = !!(errors?.personB?.firstName || errors?.personB?.contactEmail || errors?.personB?.contactPhone);
  const locationsHasErrors = !!errors?.locations || (formData.locations || []).length === 0;

  return (
    <>
        <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
                 <TextInput 
                    label="Project Name *" 
                    value={formData.projectName} 
                    onChangeText={(text) => updateFormData({ projectName: text })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    error={!!errors?.projectName}
                    theme={theme}
                />
                {errors?.projectName && <HelperText type="error">{errors.projectName._errors[0]}</HelperText>}
                <DatePickerInput 
                    locale="en" 
                    label="Event Date" 
                    value={eventDateAsDate} 
                    onChange={handleDateChange} 
                    inputMode="start" 
                    mode="outlined" 
                    style={commonStyles.input}
                />
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
              <LabelText size="small" color={theme.colors.onSurfaceVariant} style={{ marginBottom: spacing.xs }}>
                Project Type
              </LabelText>
              <CustomDropdown
                placeholder={formData.projectType || 'Select a Type'}
                data={PROJECT_TYPES.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ projectType: selectedItem.value as ProjectType })}
              />

              {/* --- Project Status Dropdown --- */}
              <LabelText size="small" color={theme.colors.onSurfaceVariant} style={{ marginBottom: spacing.xs }}>
                Project Status
              </LabelText>
              <CustomDropdown
                placeholder={formData.projectStatus || 'Select a Status'}
                data={PROJECT_STATUS.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ projectStatus: selectedItem.value as ProjectStatus })}
              />

              {/* --- Event Style Dropdown --- */}
              <LabelText size="small" color={theme.colors.onSurfaceVariant} style={{ marginBottom: spacing.xs }}>
                Event Style
              </LabelText>
              <CustomDropdown
                placeholder={formData.eventStyle || 'Select a Style'}
                data={EVENT_STYLES.map(o => ({ label: o, value: o }))}
                onSelect={(selectedItem) => updateFormData({ eventStyle: selectedItem.value as EventStyle })}
              />
             
                <TextInput 
                    label="Shared Email" 
                    value={formData.sharedEmail || ''} 
                    onChangeText={(t) => updateFormData({ sharedEmail: t || undefined })} 
                    mode="outlined" 
                    style={commonStyles.input}
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                    error={!!errors?.sharedEmail}
                    theme={theme}
                />
                {errors?.sharedEmail && <HelperText type="error">{errors.sharedEmail._errors[0]}</HelperText>}
                <TextInput 
                    label="Notes" 
                    value={formData.notes || ''} 
                    onChangeText={(t) => updateFormData({ notes: t || undefined })} 
                    mode="outlined" 
                    multiline 
                    numberOfLines={3} 
                    style={commonStyles.input}
                    theme={theme}
                />
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
                <Button 
                    mode="contained-tonal" 
                    onPress={addLocation} 
                    icon="plus" 
                    style={{ marginBottom: spacing.md }}
                    theme={theme}
                > 
                    Add Location 
                </Button>
                {(formData.locations || []).map((location, index) => (
                  <LocationForm key={index} location={location} index={index} onUpdate={(l) => updateLocation(index, l)} onRemove={() => removeLocation(index)} />
                ))}
            </View>
          </List.Accordion>
        </List.AccordionGroup>
    </>
  );
};

const useStyles = (theme: any) => {
  const themedStyles = createThemedStyles(theme);
  return StyleSheet.create({
    ...themedStyles,
    subCard: { 
      backgroundColor: theme.colors.surface, 
      marginBottom: spacing.sm, 
      borderRadius: 8, 
      borderWidth: 1, 
      borderColor: theme.colors.outline,
      elevation: 2,
    },
    accordion: { 
      backgroundColor: theme.colors.surface, 
      borderColor: theme.colors.outline, 
      borderWidth: 1, 
      marginBottom: spacing.xs, 
      borderRadius: 8 
    },
    accordionValid: {
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    accordionInvalid: {
      backgroundColor: theme.colors.errorContainer,
      borderColor: theme.colors.error,
      borderWidth: 2,
    },
    accordionContent: { 
      padding: spacing.sm 
    },
    cardHeader: { 
      flexDirection: 'row' as const, 
      justifyContent: 'space-between' as const, 
      alignItems: 'center' as const,
      marginBottom: spacing.sm,
    },
  });
};

export default EssentialInfoFormModal;


