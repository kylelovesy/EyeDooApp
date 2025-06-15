## Phase 4 Implementation: Questionnaire System - Part 2 (Timeline Review and People & Roles)

This phase extends the questionnaire system by adding two more critical sections: "Timeline Review" and "Key People & Roles". These sections will capture detailed event schedules and information about important individuals involved in the wedding.

### 4.1 Data Structures and Services for Timeline and People

Extend the `src/types/questionnaire.ts` file to include schemas for timeline events and key people.

**File: `src/types/questionnaire.ts` (Additions)**

```typescript
// Timeline Event Schema
export const TimelineEventSchema = z.object({
  id: z.string().optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'), // HH:MM format
  description: z.string().min(1, 'Description is required'),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// Key Person Schema
export const KeyPersonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  contact: z.string().optional(),
  notes: z.string().optional(),
});

export type KeyPerson = z.infer<typeof KeyPersonSchema>;

// Update Main Questionnaire Schema (Additions)
export const QuestionnaireSchema = z.object({
  projectId: z.string(),
  essentialInfo: EssentialInfoSchema.optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  keyPeople: z.array(KeyPersonSchema).optional(),
});

// Ensure the Questionnaire type is re-exported with the new fields
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
```

Update `src/services/questionnaireService.ts` to include methods for saving and retrieving timeline events and key people.

**File: `src/services/questionnaireService.ts` (Additions)**

```typescript
// Add to QuestionnaireService class

  /**
   * Saves or updates timeline events for a project's questionnaire.
   * @param projectId The ID of the project.
   * @param timelineEvents An array of timeline event data.
   */
  static async saveTimelineEvents(projectId: string, timelineEvents: TimelineEvent[]): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await updateDoc(questionnaireRef, { timeline: timelineEvents });
      console.log('Timeline events saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving timeline events:', error);
      throw error;
    }
  }

  /**
   * Retrieves timeline events for a project's questionnaire.
   * @param projectId The ID of the project.
   * @returns An array of timeline event data or an empty array if not found.
   */
  static async getTimelineEvents(projectId: string): Promise<TimelineEvent[]> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return (docSnap.data().timeline || []) as TimelineEvent[];
      }
      return [];
    } catch (error) {
      console.error('Error getting timeline events:', error);
      throw error;
    }
  }

  /**
   * Saves or updates key people for a project's questionnaire.
   * @param projectId The ID of the project.
   * @param keyPeople An array of key person data.
   */
  static async saveKeyPeople(projectId: string, keyPeople: KeyPerson[]): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await updateDoc(questionnaireRef, { keyPeople: keyPeople });
      console.log('Key people saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving key people:', error);
      throw error;
    }
  }

  /**
   * Retrieves key people for a project's questionnaire.
   * @param projectId The ID of the project.
   * @returns An array of key person data or an empty array if not found.
   */
  static async getKeyPeople(projectId: string): Promise<KeyPerson[]> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return (docSnap.data().keyPeople || []) as KeyPerson[];
      }
      return [];
    } catch (error) {
      console.error('Error getting key people:', error);
      throw error;
    }
  }
```

### 4.2 Timeline Review Screen (UI Implementation)

Create a screen for managing the wedding day timeline. This screen should allow users to add, edit, and delete timeline events.

**File: `app/(questionnaire)/timeline-review.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { TimelineEventSchema, TimelineEvent } from '../../src/types/questionnaire';
import { QuestionnaireService } from '../../src/services/questionnaireService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZodError } from 'zod';

const TimelineReviewScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [newEvent, setNewEvent] = useState<TimelineEvent>({
    time: '',
    description: '',
    location: '',
    notes: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      if (projectId) {
        try {
          const events = await QuestionnaireService.getTimelineEvents(projectId as string);
          setTimelineEvents(events);
        } catch (error) {
          console.error('Failed to load timeline events:', error);
          Alert.alert('Error', 'Failed to load timeline events.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadTimeline();
  }, [projectId]);

  const handleChange = (name: keyof TimelineEvent, value: string) => {
    setNewEvent({ ...newEvent, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddOrUpdateEvent = async () => {
    try {
      TimelineEventSchema.parse(newEvent);
      setErrors({});

      let updatedEvents: TimelineEvent[];
      if (editingIndex !== null) {
        updatedEvents = timelineEvents.map((event, index) =>
          index === editingIndex ? { ...newEvent, id: event.id || `event-${Date.now()}` } : event
        );
        setEditingIndex(null);
      } else {
        updatedEvents = [...timelineEvents, { ...newEvent, id: `event-${Date.now()}` }];
      }
      
      setTimelineEvents(updatedEvents);
      setNewEvent({ time: '', description: '', location: '', notes: '' });

      if (projectId) {
        await QuestionnaireService.saveTimelineEvents(projectId as string, updatedEvents);
        Alert.alert('Success', 'Timeline updated successfully!');
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
        console.error('Failed to save timeline event:', error);
        Alert.alert('Error', 'Failed to save timeline event.');
      }
    }
  };

  const handleEditEvent = (index: number) => {
    setNewEvent(timelineEvents[index]);
    setEditingIndex(index);
    setErrors({});
  };

  const handleDeleteEvent = async (index: number) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this timeline event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedEvents = timelineEvents.filter((_, i) => i !== index);
            setTimelineEvents(updatedEvents);
            if (projectId) {
              await QuestionnaireService.saveTimelineEvents(projectId as string, updatedEvents);
              Alert.alert('Success', 'Event deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }: { item: TimelineEvent; index: number }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventDetails}>
        <Typography variant="titleSmall">{item.time} - {item.description}</Typography>
        {item.location && <Typography variant="bodySmall">Location: {item.location}</Typography>}
        {item.notes && <Typography variant="bodySmall">Notes: {item.notes}</Typography>}
      </View>
      <View style={styles.eventActions}>
        <IconButton icon="pencil" onPress={() => handleEditEvent(index)} />
        <IconButton icon="delete" onPress={() => handleDeleteEvent(index)} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading timeline...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Timeline Review</Typography>
      
      <TextInput
        label="Time (HH:MM)"
        value={newEvent.time}
        onChangeText={(text) => handleChange('time', text)}
        style={styles.input}
        error={!!errors.time}
        helperText={errors.time}
        mode="outlined"
        keyboardType="numbers-and-punctuation"
        placeholder="e.g., 09:00"
      />
      <TextInput
        label="Description"
        value={newEvent.description}
        onChangeText={(text) => handleChange('description', text)}
        style={styles.input}
        error={!!errors.description}
        helperText={errors.description}
        mode="outlined"
      />
      <TextInput
        label="Location (Optional)"
        value={newEvent.location}
        onChangeText={(text) => handleChange('location', text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Notes (Optional)"
        value={newEvent.notes}
        onChangeText={(text) => handleChange('notes', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleAddOrUpdateEvent} style={styles.button}>
        {editingIndex !== null ? 'Update Event' : 'Add Event'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Timeline</Typography>
      {timelineEvents.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No timeline events added yet.</Typography>
      ) : (
        <FlatList
          data={timelineEvents}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || `temp-${index}`}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginTop: 10,
    marginBottom: 20,
  },
  listTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  eventDetails: {
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
  },
});

export default TimelineReviewScreen;
```

### 4.3 Key People & Roles Screen (UI Implementation)

Create a screen for managing key people involved in the wedding. This screen should allow users to add, edit, and delete key person entries.

**File: `app/(questionnaire)/key-people.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { KeyPersonSchema, KeyPerson } from '../../src/types/questionnaire';
import { QuestionnaireService } from '../../src/services/questionnaireService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZodError } from 'zod';

const KeyPeopleScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
  const [newPerson, setNewPerson] = useState<KeyPerson>({
    name: '',
    role: '',
    contact: '',
    notes: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeyPeople = async () => {
      if (projectId) {
        try {
          const people = await QuestionnaireService.getKeyPeople(projectId as string);
          setKeyPeople(people);
        } catch (error) {
          console.error('Failed to load key people:', error);
          Alert.alert('Error', 'Failed to load key people.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadKeyPeople();
  }, [projectId]);

  const handleChange = (name: keyof KeyPerson, value: string) => {
    setNewPerson({ ...newPerson, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddOrUpdatePerson = async () => {
    try {
      KeyPersonSchema.parse(newPerson);
      setErrors({});

      let updatedPeople: KeyPerson[];
      if (editingIndex !== null) {
        updatedPeople = keyPeople.map((person, index) =>
          index === editingIndex ? { ...newPerson, id: person.id || `person-${Date.now()}` } : person
        );
        setEditingIndex(null);
      } else {
        updatedPeople = [...keyPeople, { ...newPerson, id: `person-${Date.now()}` }];
      }
      
      setKeyPeople(updatedPeople);
      setNewPerson({ name: '', role: '', contact: '', notes: '' });

      if (projectId) {
        await QuestionnaireService.saveKeyPeople(projectId as string, updatedPeople);
        Alert.alert('Success', 'Key people updated successfully!');
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
        console.error('Failed to save key person:', error);
        Alert.alert('Error', 'Failed to save key person.');
      }
    }
  };

  const handleEditPerson = (index: number) => {
    setNewPerson(keyPeople[index]);
    setEditingIndex(index);
    setErrors({});
  };

  const handleDeletePerson = async (index: number) => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to delete this key person?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedPeople = keyPeople.filter((_, i) => i !== index);
            setKeyPeople(updatedPeople);
            if (projectId) {
              await QuestionnaireService.saveKeyPeople(projectId as string, updatedPeople);
              Alert.alert('Success', 'Person deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }: { item: KeyPerson; index: number }) => (
    <View style={styles.personCard}>
      <View style={styles.personDetails}>
        <Typography variant="titleSmall">{item.name} - {item.role}</Typography>
        {item.contact && <Typography variant="bodySmall">Contact: {item.contact}</Typography>}
        {item.notes && <Typography variant="bodySmall">Notes: {item.notes}</Typography>}
      </View>
      <View style={styles.personActions}>
        <IconButton icon="pencil" onPress={() => handleEditPerson(index)} />
        <IconButton icon="delete" onPress={() => handleDeletePerson(index)} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading key people...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Key People & Roles</Typography>
      
      <TextInput
        label="Name"
        value={newPerson.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        error={!!errors.name}
        helperText={errors.name}
        mode="outlined"
      />
      <TextInput
        label="Role"
        value={newPerson.role}
        onChangeText={(text) => handleChange('role', text)}
        style={styles.input}
        error={!!errors.role}
        helperText={errors.role}
        mode="outlined"
      />
      <TextInput
        label="Contact (Optional)"
        value={newPerson.contact}
        onChangeText={(text) => handleChange('contact', text)}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Notes (Optional)"
        value={newPerson.notes}
        onChangeText={(text) => handleChange('notes', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleAddOrUpdatePerson} style={styles.button}>
        {editingIndex !== null ? 'Update Person' : 'Add Person'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Key People</Typography>
      {keyPeople.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No key people added yet.</Typography>
      ) : (
        <FlatList
          data={keyPeople}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || `temp-${index}`}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginTop: 10,
    marginBottom: 20,
  },
  listTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  personCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  personDetails: {
    flex: 1,
  },
  personActions: {
    flexDirection: 'row',
  },
});

export default KeyPeopleScreen;
```

### 4.4 Navigation Integration

Update the `app/(tabs)/questionnaire.tsx` and `app/(questionnaire)/_layout.tsx` files to include navigation to the new "Timeline Review" and "Key People & Roles" screens.

**File: `app/(tabs)/questionnaire.tsx` (Updates)**

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

      <Link href={{ pathname: '/timeline-review', params: { projectId } }} asChild>
        <Button mode="contained" style={styles.button}>
          Timeline Review
        </Button>
      </Link>

      <Link href={{ pathname: '/key-people', params: { projectId } }} asChild>
        <Button mode="contained" style={styles.button}>
          Key People & Roles
        </Button>
      </Link>

      {/* Add links to other questionnaire sections as they are developed */}
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

**File: `app/(questionnaire)/_layout.tsx` (Updates)**

```typescript
import { Stack } from 'expo-router';
import React from 'react';

export default function QuestionnaireLayout() {
  return (
    <Stack>
      <Stack.Screen name="essential-info" options={{ title: 'Essential Info' }} />
      <Stack.Screen name="timeline-review" options={{ title: 'Timeline Review' }} />
      <Stack.Screen name="key-people" options={{ title: 'Key People & Roles' }} />
      {/* Add other questionnaire screens here */}
    </Stack>
  );
}
```

### 4.5 Testing and Verification

Thoroughly test the new timeline and key people screens to ensure data persistence, validation, and proper navigation.

**Unit Tests:**

*   **`src/services/questionnaireService.ts`:**
    *   Test `saveTimelineEvents` and `getTimelineEvents`.
    *   Test `saveKeyPeople` and `getKeyPeople`.

**Component Tests:**

*   **`app/(questionnaire)/timeline-review.tsx`:**
    *   Verify adding, editing, and deleting timeline events.
    *   Test validation for time format and description.
    *   Test loading state and data pre-population.
*   **`app/(questionnaire)/key-people.tsx`:**
    *   Verify adding, editing, and deleting key people.
    *   Test validation for name and role.
    *   Test loading state and data pre-population.

**Integration Tests:**

*   Verify the complete flow for both timeline and key people: navigate to the screen, add/edit/delete entries, save, and verify data in Firestore. Confirm data persistence upon re-opening the screens.

**Verification Steps:**

1.  Run the application and navigate to a project's questionnaire section.
2.  Click the "Timeline Review" button.
3.  Add several timeline events with valid data and click "Add Event".
4.  Verify that the events appear in the list and a success alert is shown.
5.  Edit an existing event and verify the update.
6.  Delete an event and confirm its removal.
7.  Navigate back to the questionnaire index and re-open "Timeline Review" to confirm data persistence.
8.  Repeat steps 2-7 for the "Key People & Roles" screen, adding, editing, and deleting key person entries.
9.  Test with invalid data (e.g., empty required fields, invalid time format) and ensure appropriate error messages are displayed.

## Phase 5 Implementation: Main App Features & Enhancements (Shot Checklist, Private Notes, Weather Integration)

This phase focuses on implementing key features that enhance the core functionality of the EyeDooApp, including a shot checklist, private notes, and weather integration. These features provide valuable tools for photographers to manage their workflow and stay informed.

### 5.1 Shot Checklist System

Implement the shot checklist system to allow photographers to create and manage a list of essential shots for each wedding. This system should support adding, editing, deleting, and marking shots as complete.

**File: `src/types/shotlist.ts`**

```typescript
import { z } from 'zod';

export const ShotItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  isCompleted: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ShotItem = z.infer<typeof ShotItemSchema>;

export const ShotChecklistSchema = z.object({
  projectId: z.string(),
  items: z.array(ShotItemSchema),
});

export type ShotChecklist = z.infer<typeof ShotChecklistSchema>;
```

**File: `src/services/shotChecklistService.ts`**

```typescript
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ShotChecklist, ShotItem } from '../types/shotlist';

export class ShotChecklistService {
  /**
   * Saves or updates the shot checklist for a project.
   * @param projectId The ID of the project.
   * @param items An array of shot items.
   */
  static async saveShotChecklist(projectId: string, items: ShotItem[]): Promise<void> {
    try {
      const checklistRef = doc(db, 'shotChecklists', projectId);
      await setDoc(checklistRef, { projectId, items }, { merge: true });
      console.log('Shot checklist saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving shot checklist:', error);
      throw error;
    }
  }

  /**
   * Retrieves the shot checklist for a project.
   * @param projectId The ID of the project.
   * @returns The shot checklist data or null if not found.
   */
  static async getShotChecklist(projectId: string): Promise<ShotChecklist | null> {
    try {
      const checklistRef = doc(db, 'shotChecklists', projectId);
      const docSnap = await getDoc(checklistRef);
      if (docSnap.exists()) {
        return docSnap.data() as ShotChecklist;
      }
      return null;
    } catch (error) {
      console.error('Error getting shot checklist:', error);
      throw error;
    }
  }

  /**
   * Updates a specific shot item within the checklist.
   * @param projectId The ID of the project.
   * @param shotItem The shot item to update.
   */
  static async updateShotItem(projectId: string, shotItem: ShotItem): Promise<void> {
    try {
      const checklist = await this.getShotChecklist(projectId);
      if (!checklist) {
        throw new Error('Shot checklist not found for project.');
      }
      const updatedItems = checklist.items.map(item =>
        item.id === shotItem.id ? shotItem : item
      );
      await this.saveShotChecklist(projectId, updatedItems);
      console.log('Shot item updated successfully:', shotItem.id);
    } catch (error) {
      console.error('Error updating shot item:', error);
      throw error;
    }
  }

  /**
   * Deletes a shot item from the checklist.
   * @param projectId The ID of the project.
   * @param shotItemId The ID of the shot item to delete.
   */
  static async deleteShotItem(projectId: string, shotItemId: string): Promise<void> {
    try {
      const checklist = await this.getShotChecklist(projectId);
      if (!checklist) {
        throw new Error('Shot checklist not found for project.');
      }
      const updatedItems = checklist.items.filter(item => item.id !== shotItemId);
      await this.saveShotChecklist(projectId, updatedItems);
      console.log('Shot item deleted successfully:', shotItemId);
    } catch (error) {
      console.error('Error deleting shot item:', error);
      throw error;
    }
  }
}
```

**File: `app/(tabs)/checklists.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, useTheme, Checkbox, IconButton } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { ShotItemSchema, ShotItem } from '../../src/types/shotlist';
import { ShotChecklistService } from '../../src/services/shotChecklistService';
import { useLocalSearchParams } from 'expo-router';
import { ZodError } from 'zod';

const ChecklistsScreen: React.FC = () => {
  const theme = useTheme();
  const { projectId } = useLocalSearchParams();

  const [shotItems, setShotItems] = useState<ShotItem[]>([]);
  const [newShot, setNewShot] = useState<ShotItem>({
    description: '',
    isCompleted: false,
    notes: '',
  });
  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChecklist = async () => {
      if (projectId) {
        try {
          const checklist = await ShotChecklistService.getShotChecklist(projectId as string);
          if (checklist) {
            setShotItems(checklist.items);
          }
        } catch (error) {
          console.error('Failed to load shot checklist:', error);
          Alert.alert('Error', 'Failed to load shot checklist.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadChecklist();
  }, [projectId]);

  const handleChange = (name: keyof ShotItem, value: string | boolean) => {
    setNewShot({ ...newShot, [name]: value });
    if (errors[name as string]) {
      setErrors({ ...errors, [name as string]: '' });
    }
  };

  const handleAddOrUpdateShot = async () => {
    try {
      ShotItemSchema.parse(newShot);
      setErrors({});

      let updatedItems: ShotItem[];
      if (editingShotId) {
        updatedItems = shotItems.map(item =>
          item.id === editingShotId ? { ...newShot, id: editingShotId } : item
        );
        setEditingShotId(null);
      } else {
        updatedItems = [...shotItems, { ...newShot, id: `shot-${Date.now()}` }];
      }
      
      setShotItems(updatedItems);
      setNewShot({ description: '', isCompleted: false, notes: '' });

      if (projectId) {
        await ShotChecklistService.saveShotChecklist(projectId as string, updatedItems);
        Alert.alert('Success', 'Shot checklist updated successfully!');
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
        console.error('Failed to save shot item:', error);
        Alert.alert('Error', 'Failed to save shot item.');
      }
    }
  };

  const handleEditShot = (item: ShotItem) => {
    setNewShot(item);
    setEditingShotId(item.id || null);
    setErrors({});
  };

  const handleDeleteShot = async (shotId: string) => {
    Alert.alert(
      'Delete Shot',
      'Are you sure you want to delete this shot item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (projectId) {
              await ShotChecklistService.deleteShotItem(projectId as string, shotId);
              setShotItems(prev => prev.filter(item => item.id !== shotId));
              Alert.alert('Success', 'Shot item deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleComplete = async (item: ShotItem) => {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    if (projectId) {
      await ShotChecklistService.updateShotItem(projectId as string, updatedItem);
      setShotItems(prev => prev.map(shot => shot.id === item.id ? updatedItem : shot));
    }
  };

  const renderItem = ({ item }: { item: ShotItem }) => (
    <View style={styles.shotItemCard}>
      <Checkbox.Android
        status={item.isCompleted ? 'checked' : 'unchecked'}
        onPress={() => handleToggleComplete(item)}
      />
      <View style={styles.shotDetails}>
        <Typography variant="titleSmall" style={item.isCompleted ? styles.completedText : {}}>{item.description}</Typography>
        {item.notes && <Typography variant="bodySmall">Notes: {item.notes}</Typography>}
      </View>
      <View style={styles.shotActions}>
        <IconButton icon="pencil" onPress={() => handleEditShot(item)} />
        <IconButton icon="delete" onPress={() => handleDeleteShot(item.id || '')} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading checklist...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Shot Checklist</Typography>
      
      <TextInput
        label="Shot Description"
        value={newShot.description}
        onChangeText={(text) => handleChange('description', text)}
        style={styles.input}
        error={!!errors.description}
        helperText={errors.description}
        mode="outlined"
      />
      <TextInput
        label="Notes (Optional)"
        value={newShot.notes}
        onChangeText={(text) => handleChange('notes', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleAddOrUpdateShot} style={styles.button}>
        {editingShotId ? 'Update Shot' : 'Add Shot'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Shots</Typography>
      {shotItems.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No shot items added yet.</Typography>
      ) : (
        <FlatList
          data={shotItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || `temp-${Date.now()}`}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginTop: 10,
    marginBottom: 20,
  },
  listTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  shotItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  shotDetails: {
    flex: 1,
    marginLeft: 10,
  },
  shotActions: {
    flexDirection: 'row',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default ChecklistsScreen;
```

### 5.2 Private Notes/Warnings System

Implement a system for private notes or warnings associated with each project. These notes should only be visible to the photographer.

**File: `src/types/notes.ts`**

```typescript
import { z } from 'zod';

export const PrivateNoteSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'Note content cannot be empty'),
  createdAt: z.string().optional(), // Store as ISO string
  updatedAt: z.string().optional(), // Store as ISO string
});

export type PrivateNote = z.infer<typeof PrivateNoteSchema>;

export const ProjectNotesSchema = z.object({
  projectId: z.string(),
  notes: z.array(PrivateNoteSchema),
});

export type ProjectNotes = z.infer<typeof ProjectNotesSchema>;
```

**File: `src/services/privateNotesService.ts`**

```typescript
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ProjectNotes, PrivateNote } from '../types/notes';

export class PrivateNotesService {
  /**
   * Saves or updates private notes for a project.
   * @param projectId The ID of the project.
   * @param notes An array of private notes.
   */
  static async savePrivateNotes(projectId: string, notes: PrivateNote[]): Promise<void> {
    try {
      const notesRef = doc(db, 'privateNotes', projectId);
      await setDoc(notesRef, { projectId, notes }, { merge: true });
      console.log('Private notes saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving private notes:', error);
      throw error;
    }
  }

  /**
   * Retrieves private notes for a project.
   * @param projectId The ID of the project.
   * @returns The project notes data or null if not found.
   */
  static async getPrivateNotes(projectId: string): Promise<ProjectNotes | null> {
    try {
      const notesRef = doc(db, 'privateNotes', projectId);
      const docSnap = await getDoc(notesRef);
      if (docSnap.exists()) {
        return docSnap.data() as ProjectNotes;
      }
      return null;
    } catch (error) {
      console.error('Error getting private notes:', error);
      throw error;
    }
  }

  /**
   * Adds a new private note to a project.
   * @param projectId The ID of the project.
   * @param newNoteContent The content of the new note.
   */
  static async addPrivateNote(projectId: string, newNoteContent: string): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      const newNote: PrivateNote = {
        id: `note-${Date.now()}`,
        content: newNoteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedNotes = currentNotes ? [...currentNotes.notes, newNote] : [newNote];
      await this.savePrivateNotes(projectId, updatedNotes);
      console.log('Private note added successfully for project:', projectId);
    } catch (error) {
      console.error('Error adding private note:', error);
      throw error;
    }
  }

  /**
   * Updates an existing private note.
   * @param projectId The ID of the project.
   * @param updatedNote The updated note object.
   */
  static async updatePrivateNote(projectId: string, updatedNote: PrivateNote): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      if (!currentNotes) {
        throw new Error('Project notes not found.');
      }
      const notesToSave = currentNotes.notes.map(note =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      );
      await this.savePrivateNotes(projectId, notesToSave);
      console.log('Private note updated successfully:', updatedNote.id);
    } catch (error) {
      console.error('Error updating private note:', error);
      throw error;
    }
  }

  /**
   * Deletes a private note.
   * @param projectId The ID of the project.
   * @param noteId The ID of the note to delete.
   */
  static async deletePrivateNote(projectId: string, noteId: string): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      if (!currentNotes) {
        throw new Error('Project notes not found.');
      }
      const notesToSave = currentNotes.notes.filter(note => note.id !== noteId);
      await this.savePrivateNotes(projectId, notesToSave);
      console.log('Private note deleted successfully:', noteId);
    } catch (error) {
      console.error('Error deleting private note:', error);
      throw error;
    }
  }
}
```

**File: `app/(tabs)/notes.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography }n(Content truncated due to size limit. Use line ranges to read in chunks)

