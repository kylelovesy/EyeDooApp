import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SegmentedButtons, TextInput } from 'react-native-paper';
import { DatePickerInput } from '../../components/forms/DatePickerInput';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { spacing } from '../../constants/theme';
import { useProjects } from '../../contexts/ProjectContext';
import { CreateProjectInput, ProjectStatus, ProjectType } from '../../types/project';

export default function CreateProjectScreen() {
  const { createProject, loading } = useProjects();
  const [formData, setFormData] = useState<Partial<CreateProjectInput>>({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    type: ProjectType.WEDDING,
    status: ProjectStatus.DRAFT,
    eventDate: new Date(),
    venue: '',
    venueAddress: '',
    description: '',
    numberOfGuests: undefined,
    budget: undefined,
  });

  const updateFormData = (field: keyof CreateProjectInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      Alert.alert('Validation Error', 'Please enter a project title');
      return false;
    }
    
    if (!formData.clientName?.trim()) {
      Alert.alert('Validation Error', 'Please enter the client name');
      return false;
    }
    
    if (formData.clientEmail && !formData.clientEmail.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!formData.eventDate) {
      Alert.alert('Validation Error', 'Please select an event date');
      return false;
    }
    
    return true;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) return;

    try {
      const projectData: CreateProjectInput = {
        title: formData.title!.trim(),
        clientName: formData.clientName!.trim(),
        clientEmail: formData.clientEmail?.trim() || '',
        clientPhone: formData.clientPhone?.trim() || '',
        type: formData.type!,
        status: formData.status!,
        eventDate: formData.eventDate!,
        venue: formData.venue?.trim() || '',
        venueAddress: formData.venueAddress?.trim() || '',
        description: formData.description?.trim() || '',
        numberOfGuests: formData.numberOfGuests,
        budget: formData.budget,
      };

      const newProject = await createProject(projectData);
      
      Alert.alert(
        'Project Created',
        'Your project has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.dismiss();
              router.push(`/(projects)/${newProject.id}`);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const projectTypeOptions = [
    { value: ProjectType.WEDDING, label: 'Wedding' },
    { value: ProjectType.ENGAGEMENT, label: 'Engagement' },
    { value: ProjectType.ELOPEMENT, label: 'Elopement' },
    { value: ProjectType.OTHER, label: 'Other' },
  ];

  return (
    <Screen>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ marginBottom: spacing.lg }}>
            <HeadlineText size="medium" style={{ marginBottom: spacing.sm }}>
              Create New Project
            </HeadlineText>
            <BodyText size="medium" style={{ opacity: 0.7 }}>
              Set up a new wedding photography project
            </BodyText>
          </View>

          {/* Form */}
          <View style={{ gap: spacing.md }}>
            {/* Basic Information */}
            <TextInput
              label="Project Title *"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              mode="outlined"
              placeholder="e.g., Sarah & John's Wedding"
              disabled={loading}
            />

            <TextInput
              label="Client Name *"
              value={formData.clientName}
              onChangeText={(value) => updateFormData('clientName', value)}
              mode="outlined"
              placeholder="e.g., Sarah Johnson"
              disabled={loading}
            />

            <TextInput
              label="Client Email"
              value={formData.clientEmail}
              onChangeText={(value) => updateFormData('clientEmail', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="client@example.com"
              disabled={loading}
            />

            <TextInput
              label="Client Phone"
              value={formData.clientPhone}
              onChangeText={(value) => updateFormData('clientPhone', value)}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />

            {/* Project Type */}
            <View>
              <BodyText size="medium" style={{ marginBottom: spacing.sm }}>
                Project Type
              </BodyText>
              <SegmentedButtons
                value={formData.type || ProjectType.WEDDING}
                onValueChange={(value) => updateFormData('type', value as ProjectType)}
                buttons={projectTypeOptions}
                disabled={loading}
              />
            </View>

            {/* Event Details */}
            <DatePickerInput
              label="Event Date *"
              value={formData.eventDate}
              onDateChange={(date) => updateFormData('eventDate', date)}
              mode="outlined"
              disabled={loading}
            />

            <TextInput
              label="Venue Name"
              value={formData.venue}
              onChangeText={(value) => updateFormData('venue', value)}
              mode="outlined"
              placeholder="e.g., Grand Ballroom"
              disabled={loading}
            />

            <TextInput
              label="Venue Address"
              value={formData.venueAddress}
              onChangeText={(value) => updateFormData('venueAddress', value)}
              mode="outlined"
              placeholder="123 Main St, City, State"
              multiline
              numberOfLines={2}
              disabled={loading}
            />

            {/* Additional Details */}
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TextInput
                label="Number of Guests"
                value={formData.numberOfGuests?.toString() || ''}
                onChangeText={(value) => updateFormData('numberOfGuests', value ? parseInt(value) : undefined)}
                mode="outlined"
                keyboardType="numeric"
                placeholder="150"
                style={{ flex: 1 }}
                disabled={loading}
              />

              <TextInput
                label="Budget ($)"
                value={formData.budget?.toString() || ''}
                onChangeText={(value) => updateFormData('budget', value ? parseFloat(value) : undefined)}
                mode="outlined"
                keyboardType="numeric"
                placeholder="5000"
                style={{ flex: 1 }}
                disabled={loading}
              />
            </View>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              mode="outlined"
              placeholder="Additional notes about the project..."
              multiline
              numberOfLines={3}
              disabled={loading}
            />
          </View>

          {/* Actions */}
          <View style={{ 
            flexDirection: 'row', 
            gap: spacing.sm, 
            marginTop: spacing.lg,
            marginBottom: spacing.xl 
          }}>
            <CustomButton
              title="Cancel"
              variant="outline"
              size="large"
              style={{ flex: 1 }}
              onPress={() => router.dismiss()}
              disabled={loading}
            />
            
            <CustomButton
              title="Create Project"
              variant="primary"
              size="large"
              style={{ flex: 1 }}
              onPress={handleCreateProject}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

