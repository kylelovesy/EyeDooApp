// src/components/modal/FormStep1.tsx
import { spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useProjectForm } from '../../contexts/ProjectFormContext';

export const FormStep1 = () => {
  const { formData, setFormData, errors } = useProjectForm();

  const handleChange = (field: keyof typeof formData.form1Data, value: string) => {
    setFormData(prev => ({ ...prev, form1Data: { ...prev.form1Data, [field]: value } }));
  };

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Project Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={formData.form1Data.projectName}
        onChangeText={(text) => handleChange('projectName', text)}
      />
      {errors.projectName && <Text style={styles.errorText}>{errors.projectName[0]}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Project Type (e.g., Mobile App)"
        value={formData.form1Data.projectType}
        onChangeText={(text) => handleChange('projectType', text)}
      />
      {errors.projectType && <Text style={styles.errorText}>{errors.projectType[0]}</Text>}
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