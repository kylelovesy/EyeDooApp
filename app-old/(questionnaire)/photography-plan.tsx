import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Chip, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { QuestionnaireService } from '../../services/questionnaireService';
import { PhotographyPlan, PhotographyPlanSchema } from '../../types/questionnaire';

const PhotographyPlanScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [formData, setFormData] = useState<PhotographyPlan>({
    shotListPreferences: '',
    specialMoments: [],
    photographyStyle: '',
    equipmentNeeds: '',
    lightingPreferences: '',
    groupShotsList: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const photographyStyles = [
    'Traditional', 'Photojournalistic', 'Fine Art', 'Vintage', 
    'Modern', 'Glamour', 'Natural', 'Fashion'
  ];

  const specialMomentOptions = [
    'First Look', 'Ceremony', 'Ring Exchange', 'First Kiss', 
    'Walking Down Aisle', 'Reception Entrance', 'First Dance', 
    'Cake Cutting', 'Bouquet Toss', 'Parent Dances'
  ];

  useEffect(() => {
    const loadPhotographyPlan = async () => {
      if (projectId) {
        try {
          const plan = await QuestionnaireService.getPhotographyPlan(projectId as string);
          if (plan) {
            setFormData(plan);
          }
        } catch (error) {
          console.error('Failed to load photography plan:', error);
          Alert.alert('Error', 'Failed to load photography plan.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadPhotographyPlan();
  }, [projectId]);

  const handleChange = (name: keyof PhotographyPlan, value: string | string[]) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleStyleToggle = (style: string) => {
    setFormData({ ...formData, photographyStyle: style });
  };

  const handleSpecialMomentToggle = (moment: string) => {
    const currentMoments = formData.specialMoments || [];
    const updatedMoments = currentMoments.includes(moment)
      ? currentMoments.filter(m => m !== moment)
      : [...currentMoments, moment];
    handleChange('specialMoments', updatedMoments);
  };

  const handleSubmit = async () => {
    try {
      PhotographyPlanSchema.parse(formData);
      setErrors({});
      if (projectId) {
        await QuestionnaireService.savePhotographyPlan(projectId as string, formData);
        Alert.alert('Success', 'Photography plan saved successfully!');
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
        console.error('Failed to save photography plan:', error);
        Alert.alert('Error', 'Failed to save photography plan.');
      }
    }
  };

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Typography variant="headlineMedium" style={styles.title}>
          Photography Plan
        </Typography>
        
        {/* Photography Style */}
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Preferred Photography Style
        </Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {photographyStyles.map((style) => (
            <Chip
              key={style}
              selected={formData.photographyStyle === style}
              onPress={() => handleStyleToggle(style)}
              style={styles.chip}
            >
              {style}
            </Chip>
          ))}
        </ScrollView>

        {/* Special Moments */}
        <Typography variant="titleMedium" style={styles.sectionTitle}>
          Special Moments to Capture
        </Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {specialMomentOptions.map((moment) => (
            <Chip
              key={moment}
              selected={formData.specialMoments?.includes(moment) || false}
              onPress={() => handleSpecialMomentToggle(moment)}
              style={styles.chip}
            >
              {moment}
            </Chip>
          ))}
        </ScrollView>

        {/* Shot List Preferences */}
        <TextInput
          label="Shot List Preferences"
          value={formData.shotListPreferences}
          onChangeText={(text) => handleChange('shotListPreferences', text)}
          style={styles.input}
          error={!!errors.shotListPreferences}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="Describe any specific shots you want captured..."
        />

        {/* Group Shots List */}
        <TextInput
          label="Group Shots List"
          value={formData.groupShotsList}
          onChangeText={(text) => handleChange('groupShotsList', text)}
          style={styles.input}
          error={!!errors.groupShotsList}
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="List family combinations and group photos needed..."
        />

        {/* Equipment Needs */}
        <TextInput
          label="Special Equipment Needs"
          value={formData.equipmentNeeds}
          onChangeText={(text) => handleChange('equipmentNeeds', text)}
          style={styles.input}
          error={!!errors.equipmentNeeds}
          mode="outlined"
          multiline
          numberOfLines={2}
          placeholder="Any special equipment requirements..."
        />

        {/* Lighting Preferences */}
        <TextInput
          label="Lighting Preferences"
          value={formData.lightingPreferences}
          onChangeText={(text) => handleChange('lightingPreferences', text)}
          style={styles.input}
          error={!!errors.lightingPreferences}
          mode="outlined"
          multiline
          numberOfLines={2}
          placeholder="Natural light, flash, specific lighting setups..."
        />

        {/* Special Requests */}
        <TextInput
          label="Special Requests"
          value={formData.specialRequests}
          onChangeText={(text) => handleChange('specialRequests', text)}
          style={styles.input}
          error={!!errors.specialRequests}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="Any other specific requests or requirements..."
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save Photography Plan
        </Button>
      </ScrollView>
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
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
  chipContainer: {
    marginBottom: 20,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default PhotographyPlanScreen;
