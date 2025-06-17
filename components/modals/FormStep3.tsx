// src/components/modal/FormStep3.tsx
import { spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useProjectForm } from '../../contexts/ProjectFormContext';

export const FormStep3 = () => {
  const { formData, setFormData, errors } = useProjectForm();

  const handleChange = (field: keyof typeof formData.form3Data, value: string) => {
    setFormData(prev => ({ ...prev, form3Data: { ...prev.form3Data, [field]: value } }));
  };

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Project Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Day"
        value={formData.form3Data.eventDay}
        onChangeText={(text) => handleChange('eventDay', text)}
      />
      {errors.eventDay && <Text style={styles.errorText}>{errors.eventDay[0]}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Event Date"
        value={formData.form3Data.eventDate}
        onChangeText={(text) => handleChange('eventDate', text)}
      />
      {errors.eventDate && <Text style={styles.errorText}>{errors.eventDate[0]}</Text>}
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