// src/components/modal/FormStep2.tsx
import { spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useProjectForm } from '../../contexts/ProjectFormContext';

export const FormStep2 = () => {
  const { formData, setFormData, errors } = useProjectForm();

  const handleChange = (field: keyof typeof formData.form2Data, value: string) => {
    setFormData(prev => ({ ...prev, form2Data: { ...prev.form2Data, [field]: value } }));
  };

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Project Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Client Name"
        value={formData.form2Data.clientName}
        onChangeText={(text) => handleChange('clientName', text)}
      />
      {errors.clientName && <Text style={styles.errorText}>{errors.clientName[0]}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Venue"
        value={formData.form2Data.venue}
        onChangeText={(text) => handleChange('venue', text)}
      />
      {errors.venue && <Text style={styles.errorText}>{errors.venue[0]}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
      input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: spacing.sm,
      },
      title: {
        marginBottom: spacing.sm,
      },      
      errorText: {
        color: 'red',
        marginBottom: spacing.sm,
      },
    });