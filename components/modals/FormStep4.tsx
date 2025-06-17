// src/components/modal/FormStep4.tsx
import { spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useProjectForm } from '../../contexts/ProjectFormContext';

export const FormStep4 = () => {
  const { formData, setFormData, errors } = useProjectForm();

  const handleChange = (field: keyof typeof formData.form4Data, value: string) => {
    setFormData(prev => ({ ...prev, form4Data: { ...prev.form4Data, [field]: value } }));
  };

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Project Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Style"
        value={formData.form4Data.eventStyle}
        onChangeText={(text) => handleChange('eventStyle', text)}
      />
      {errors.eventStyle && <Text style={styles.errorText}>{errors.eventStyle[0]}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Project Status"
        value={formData.form4Data.projectStatus}
        onChangeText={(text) => handleChange('projectStatus', text)}
      />
      {errors.projectStatus && <Text style={styles.errorText}>{errors.projectStatus[0]}</Text>}
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