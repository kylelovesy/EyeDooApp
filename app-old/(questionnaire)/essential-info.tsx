import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { DatePickerInput } from '../../components/forms/DatePickerInput';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { QuestionnaireService } from '../../services/questionnaireService';
import { EssentialInfo, EssentialInfoSchema } from '../../types/questionnaire';

const EssentialInfoScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [formData, setFormData] = useState<EssentialInfo>({
    weddingDate: '',
    venue: '',
    coupleNames: '',
    contactNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEssentialInfo = async () => {
      if (projectId) {
        try {
          const info = await QuestionnaireService.getEssentialInfo(projectId as string);
          if (info) {
            setFormData(info);
          }
        } catch (error) {
          console.error('Failed to load essential info:', error);
          Alert.alert('Error', 'Failed to load essential information.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadEssentialInfo();
  }, [projectId]);

  const handleChange = (name: keyof EssentialInfo, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    handleChange('weddingDate', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = async () => {
    try {
      EssentialInfoSchema.parse(formData);
      setErrors({});
      if (projectId) {
        await QuestionnaireService.saveEssentialInfo(projectId as string, formData);
        Alert.alert('Success', 'Essential information saved successfully!');
        // Navigate back or to the next questionnaire section
        router.back(); 
      } else {
        Alert.alert('Error', 'Project ID is missing.');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      } else {
        console.error('Failed to save essential info:', error);
        Alert.alert('Error', 'Failed to save essential information.');
      }
    }
  };

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Essential Wedding Information</Typography>
      
      <TextInput
        label="Couple Names"
        value={formData.coupleNames}
        onChangeText={(text) => handleChange('coupleNames', text)}
        style={styles.input}
        error={!!errors.coupleNames}
        mode="outlined"
      />
      <TextInput
        label="Venue"
        value={formData.venue}
        onChangeText={(text) => handleChange('venue', text)}
        style={styles.input}
        error={!!errors.venue}
        mode="outlined"
      />
      <DatePickerInput
        label="Wedding Date"
        value={formData.weddingDate ? new Date(formData.weddingDate) : undefined}
        onDateChange={handleDateChange}
        style={styles.input}
        error={!!errors.weddingDate}
        helperText={errors.weddingDate}
      />
      <TextInput
        label="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => handleChange('contactNumber', text)}
        style={styles.input}
        error={!!errors.contactNumber}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
        error={!!errors.email}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Save Essential Info
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});

export default EssentialInfoScreen;