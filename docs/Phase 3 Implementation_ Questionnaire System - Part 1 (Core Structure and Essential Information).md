## Phase 3 Implementation: Questionnaire System - Part 1 (Core Structure and Essential Information)

This phase focuses on building the foundational elements of the questionnaire system, including its core data structures, services, and the initial UI for collecting essential event information. The goal is to establish a robust and extensible system that can be expanded with more complex questionnaire sections in subsequent phases.

### 3.1 Data Structures and Services for Questionnaire

To manage questionnaire data effectively, define the TypeScript types and Zod schemas for the questionnaire, its sections, and individual questions. This ensures type safety and provides robust validation for data integrity.

**File: `src/types/questionnaire.ts`**

```typescript
import { z } from 'zod';

// Define Zod schemas for questionnaire data

// Essential Information Schema
export const EssentialInfoSchema = z.object({
  weddingDate: z.string().min(1, 'Wedding date is required'),
  venue: z.string().min(1, 'Venue is required'),
  coupleNames: z.string().min(1, 'Couple names are required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  // Add other essential fields as needed
});

export type EssentialInfo = z.infer<typeof EssentialInfoSchema>;

// Main Questionnaire Schema (can be expanded later)
export const QuestionnaireSchema = z.object({
  projectId: z.string(),
  essentialInfo: EssentialInfoSchema.optional(),
  // Add other sections as they are developed
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// Example of a question type (can be expanded)
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});

export type Question = z.infer<typeof QuestionSchema>;

// Example of a section type (can be expanded)
export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(QuestionSchema),
});

export type Section = z.infer<typeof SectionSchema>;
```

Implement the `questionnaireService.ts` to handle CRUD operations for questionnaire data with Firestore. This service will interact directly with your Firebase database to save, retrieve, and update questionnaire responses.

**File: `src/services/questionnaireService.ts`**

```typescript
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Questionnaire, EssentialInfo } from '../types/questionnaire';

export class QuestionnaireService {
  /**
   * Saves or updates the essential information for a project's questionnaire.
   * @param projectId The ID of the project.
   * @param essentialInfo The essential information data.
   */
  static async saveEssentialInfo(projectId: string, essentialInfo: EssentialInfo): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await setDoc(questionnaireRef, { essentialInfo }, { merge: true });
      console.log('Essential info saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving essential info:', error);
      throw error;
    }
  }

  /**
   * Retrieves the essential information for a project's questionnaire.
   * @param projectId The ID of the project.
   * @returns The essential information data or null if not found.
   */
  static async getEssentialInfo(projectId: string): Promise<EssentialInfo | null> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return docSnap.data().essentialInfo as EssentialInfo;
      }
      return null;
    } catch (error) {
      console.error('Error getting essential info:', error);
      throw error;
    }
  }

  /**
   * Retrieves the full questionnaire for a project.
   * @param projectId The ID of the project.
   * @returns The questionnaire data or null if not found.
   */
  static async getQuestionnaire(projectId: string): Promise<Questionnaire | null> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Questionnaire;
      }
      return null;
    } catch (error) {
      console.error('Error getting questionnaire:', error);
      throw error;
    }
  }

  /**
   * Updates a specific field within the questionnaire.
   * @param projectId The ID of the project.
   * @param fieldPath The dot-separated path to the field to update (e.g., 'essentialInfo.weddingDate').
   * @param value The new value for the field.
   */
  static async updateQuestionnaireField(projectId: string, fieldPath: string, value: any): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await updateDoc(questionnaireRef, { [fieldPath]: value });
      console.log(`Field ${fieldPath} updated successfully for project:`, projectId);
    } catch (error) {
      console.error(`Error updating field ${fieldPath}:`, error);
      throw error;
    }
  }
}
```

### 3.2 Essential Information Screen (UI Implementation)

Design and implement the UI for the essential information section of the questionnaire. This screen will allow users to input key details about the wedding event.

**File: `app/(questionnaire)/essential-info.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { DatePickerInput } from '../../src/components/forms/DatePickerInput';
import { EssentialInfoSchema, EssentialInfo } from '../../src/types/questionnaire';
import { QuestionnaireService } from '../../src/services/questionnaireService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZodError } from 'zod';

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
        helperText={errors.coupleNames}
        mode="outlined"
      />
      <TextInput
        label="Venue"
        value={formData.venue}
        onChangeText={(text) => handleChange('venue', text)}
        style={styles.input}
        error={!!errors.venue}
        helperText={errors.venue}
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
        helperText={errors.contactNumber}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
        error={!!errors.email}
        helperText={errors.email}
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
```

### 3.3 Navigation Integration

Integrate the essential information screen into the application's navigation flow. This typically involves adding a route to your Expo Router configuration.

**File: `app/(tabs)/questionnaire.tsx` (Example of how to link to it)**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { Link, useLocalSearchParams } from 'expo-router';

const QuestionnaireIndexScreen: React.FC = () => {
  const theme = useTheme();
  const { projectId } = useLocalSearchParams();

  if (!projectId) {
    return (
      <Screen style={styles.container}>
        <Typography variant="headlineSmall">No Project Selected</Typography>
        <Typography variant="bodyMedium">Please select a project to view its questionnaire.</Typography>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Questionnaire for Project {projectId}</Typography>
      
      <Link href={{ pathname: '/essential-info', params: { projectId } }} asChild>
        <Button mode="contained" style={styles.button}>
          Essential Information
        </Button>
      </Link>

      {/* Add links to other questionnaire sections as they are developed */}
      <Button mode="outlined" style={styles.button} disabled>
        Timeline Review (Coming Soon)
      </Button>
      <Button mode="outlined" style={styles.button} disabled>
        Key People & Roles (Coming Soon)
      </Button>
      <Button mode="outlined" style={styles.button} disabled>
        Photography Plan (Coming Soon)
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    marginBottom: 15,
  },
});

export default QuestionnaireIndexScreen;
```

**File: `app/(questionnaire)/_layout.tsx`**

```typescript
import { Stack } from 'expo-router';
import React from 'react';

export default function QuestionnaireLayout() {
  return (
    <Stack>
      <Stack.Screen name="essential-info" options={{ title: 'Essential Info' }} />
      {/* Add other questionnaire screens here */}
    </Stack>
  );
}
```

### 3.4 Testing and Verification

Thoroughly test the essential information screen to ensure data persistence, validation, and proper navigation.

**Unit Tests:**

*   **`src/services/questionnaireService.ts`:**
    *   Test `saveEssentialInfo` to ensure data is correctly written to Firestore.
    *   Test `getEssentialInfo` to ensure data is correctly retrieved.
    *   Test `updateQuestionnaireField` for partial updates.

**Component Tests:**

*   **`app/(questionnaire)/essential-info.tsx`:**
    *   Verify that all input fields render correctly.
    *   Test input change handling and state updates.
    *   Test form submission with valid and invalid data.
    *   Verify error messages are displayed for invalid input.
    *   Test loading state and data pre-population.

**Integration Tests:**

*   Verify the complete flow: navigate to the essential info screen, fill out the form, save, and verify data in Firestore. Then, navigate back to the questionnaire index and re-open the essential info to confirm data persistence.

**Verification Steps:**

1.  Run the application and navigate to a project's questionnaire section.
2.  Click the "Essential Information" button.
3.  Fill in all fields with valid data and click "Save Essential Info".
4.  Verify that an "Essential information saved successfully!" alert appears.
5.  Navigate back to the questionnaire index.
6.  Re-open the "Essential Information" screen for the same project.
7.  Verify that the previously saved data is pre-populated in the fields.
8.  Test with invalid data (e.g., empty required fields, invalid email) and ensure appropriate error messages are displayed.


