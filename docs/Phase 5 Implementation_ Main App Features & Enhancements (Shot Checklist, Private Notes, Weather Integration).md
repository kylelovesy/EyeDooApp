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
import { Typography } from '../../src/components/ui/Typography';
import { PrivateNoteSchema, PrivateNote } from '../../src/types/notes';
import { PrivateNotesService } from '../../src/services/privateNotesService';
import { useLocalSearchParams } from 'expo-router';
import { ZodError } from 'zod';

const NotesScreen: React.FC = () => {
  const theme = useTheme();
  const { projectId } = useLocalSearchParams();

  const [notes, setNotes] = useState<PrivateNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<PrivateNote | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      if (projectId) {
        try {
          const projectNotes = await PrivateNotesService.getPrivateNotes(projectId as string);
          if (projectNotes) {
            setNotes(projectNotes.notes);
          }
        } catch (error) {
          console.error('Failed to load private notes:', error);
          Alert.alert('Error', 'Failed to load private notes.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadNotes();
  }, [projectId]);

  const handleAddOrUpdateNote = async () => {
    try {
      PrivateNoteSchema.pick({ content: true }).parse({ content: newNoteContent });
      setErrors({});

      if (projectId) {
        if (editingNote) {
          const updatedNote = { ...editingNote, content: newNoteContent };
          await PrivateNotesService.updatePrivateNote(projectId as string, updatedNote);
          setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote : note));
          setEditingNote(null);
        } else {
          await PrivateNotesService.addPrivateNote(projectId as string, newNoteContent);
          // Re-fetch notes to get the newly added note with its ID and timestamp from the service
          const projectNotes = await PrivateNotesService.getPrivateNotes(projectId as string);
          if (projectNotes) {
            setNotes(projectNotes.notes);
          }
        }
        setNewNoteContent('');
        Alert.alert('Success', 'Note saved successfully!');
      } else {
        Alert.alert('Error', 'Project ID is missing.');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors({ content: error.errors[0].message });
        Alert.alert('Validation Error', 'Note content cannot be empty.');
      } else {
        console.error('Failed to save note:', error);
        Alert.alert('Error', 'Failed to save note.');
      }
    }
  };

  const handleEditNote = (note: PrivateNote) => {
    setNewNoteContent(note.content);
    setEditingNote(note);
    setErrors({});
  };

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this private note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (projectId) {
              await PrivateNotesService.deletePrivateNote(projectId as string, noteId);
              setNotes(prev => prev.filter(note => note.id !== noteId));
              Alert.alert('Success', 'Note deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: PrivateNote }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteContent}>
        <Typography variant="bodyMedium">{item.content}</Typography>
        {item.updatedAt && (
          <Typography variant="labelSmall" style={styles.noteTimestamp}>
            Last updated: {new Date(item.updatedAt).toLocaleString()}
          </Typography>
        )}
      </View>
      <View style={styles.noteActions}>
        <IconButton icon="pencil" onPress={() => handleEditNote(item)} />
        <IconButton icon="delete" onPress={() => handleDeleteNote(item.id || '')} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading notes...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Private Notes & Warnings</Typography>
      
      <TextInput
        label="New Note"
        value={newNoteContent}
        onChangeText={setNewNoteContent}
        style={styles.input}
        error={!!errors.content}
        helperText={errors.content}
        mode="outlined"
        multiline
        numberOfLines={4}
      />

      <Button mode="contained" onPress={handleAddOrUpdateNote} style={styles.button}>
        {editingNote ? 'Update Note' : 'Add Note'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Notes</Typography>
      {notes.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No private notes added yet.</Typography>
      ) : (
        <FlatList
          data={notes}
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
  noteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  noteContent: {
    flex: 1,
    marginRight: 10,
  },
  noteTimestamp: {
    marginTop: 5,
    color: '#666',
  },
  noteActions: {
    flexDirection: 'row',
  },
});

export default NotesScreen;
```

### 5.3 Weather Integration

Integrate a weather API to provide relevant weather information for the wedding date and location. This will help photographers plan for different weather conditions.

**File: `src/types/timeline.ts` (Additions for weather data)**

```typescript
import { z } from 'zod';

export const WeatherDataSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
  icon: z.string(), // e.g., URL or code for weather icon
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
  // Add more weather details as needed
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;

// Update QuestionnaireSchema to include weather data if desired, or keep it separate
// For simplicity, we'll assume weather data is fetched and displayed on demand
```

**File: `src/services/weatherService.ts` (Updated)**

```typescript
import axios from 'axios';
import { WeatherData } from '../types/timeline';

const OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  /**
   * Fetches current weather data for a given city.
   * @param city The name of the city.
   * @returns WeatherData object.
   */
  static async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric', // or 'imperial' for Fahrenheit
        },
      });

      const data = response.data;
      return {
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Could not fetch current weather data.');
    }
  }

  /**
   * Fetches 5-day / 3-hour forecast data for a given city.
   * This is a simplified example; you might need to process the forecast list
   * to get daily averages or specific day's weather.
   * @param city The name of the city.
   * @returns An array of WeatherData objects for the forecast.
   */
  static async getForecastWeatherByCity(city: string): Promise<WeatherData[]> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric',
        },
      });

      // For simplicity, taking the first forecast entry for each day
      const dailyForecasts: WeatherData[] = [];
      const uniqueDates = new Set<string>();

      for (const item of response.data.list) {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!uniqueDates.has(date)) {
          uniqueDates.add(date);
          dailyForecasts.push({
            temperature: item.main.temp,
            condition: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
          });
        }
        if (dailyForecasts.length >= 5) break; // Get 5 days forecast
      }
      return dailyForecasts;

    } catch (error) {
      console.error('Error fetching forecast weather:', error);
      throw new Error('Could not fetch forecast weather data.');
    }
  }
}
```

**File: `app/(tabs)/weather.tsx`**

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { WeatherService } from '../../src/services/weatherService';
import { WeatherData } from '../../src/types/timeline';

const WeatherScreen: React.FC = () => {
  const theme = useTheme();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchWeather = async () => {
    if (!city) {
      Alert.alert('Input Error', 'Please enter a city name.');
      return;
    }
    setLoading(true);
    setWeather(null);
    setForecast([]);
    try {
      const currentWeather = await WeatherService.getCurrentWeatherByCity(city);
      setWeather(currentWeather);
      const forecastWeather = await WeatherService.getForecastWeatherByCity(city);
      setForecast(forecastWeather);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Weather Information</Typography>
      
      <TextInput
        label="Enter City Name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        mode="outlined"
        onSubmitEditing={handleFetchWeather}
      />
      <Button mode="contained" onPress={handleFetchWeather} style={styles.button} loading={loading}>
        Get Weather
      </Button>

      {weather && (
        <View style={styles.weatherCard}>
          <Typography variant="titleLarge" style={styles.weatherCity}>{city}</Typography>
          <View style={styles.currentWeather}>
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
            <View>
              <Typography variant="displaySmall">{weather.temperature}°C</Typography>
              <Typography variant="bodyLarge">{weather.condition}</Typography>
            </View>
          </View>
          {weather.humidity && <Typography variant="bodyMedium">Humidity: {weather.humidity}%</Typography>}
          {weather.windSpeed && <Typography variant="bodyMedium">Wind: {weather.windSpeed} m/s</Typography>}
        </View>
      )}

      {forecast.length > 0 && (
        <View style={styles.forecastContainer}>
          <Typography variant="titleMedium" style={styles.forecastTitle}>5-Day Forecast</Typography>
          {forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Image source={{ uri: day.icon }} style={styles.forecastIcon} />
              <Typography variant="bodyMedium">{day.temperature}°C</Typography>
              <Typography variant="bodySmall">{day.condition}</Typography>
            </View>
          ))}
        </View>
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
  weatherCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weatherCity: {
    marginBottom: 10,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  forecastContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  forecastTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
});

export default WeatherScreen;
```

### 5.4 Navigation Integration

Update the `app/(tabs)/_layout.tsx` to include navigation to the new "Checklists", "Notes", and "Weather" screens.

**File: `app/(tabs)/_layout.tsx` (Updates)**

```typescript
import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="folder-multiple" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="questionnaire"
        options={{
          title: 'Questionnaire',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: 'Checklists',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="check-all" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="note-multiple" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="weather-cloudy" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 5.5 Testing and Verification

Thoroughly test the new features to ensure data persistence, validation, and proper functionality.

**Unit Tests:**

*   **`src/services/shotChecklistService.ts`:**
    *   Test `saveShotChecklist`, `getShotChecklist`, `updateShotItem`, and `deleteShotItem`.
*   **`src/services/privateNotesService.ts`:**
    *   Test `savePrivateNotes`, `getPrivateNotes`, `addPrivateNote`, `updatePrivateNote`, and `deletePrivateNote`.
*   **`src/services/weatherService.ts`:**
    *   Test `getCurrentWeatherByCity` and `getForecastWeatherByCity` (mock API calls).

**Component Tests:**

*   **`app/(tabs)/checklists.tsx`:**
    *   Verify adding, editing, deleting, and toggling completion of shot items.
    *   Test validation for shot description.
*   **`app/(tabs)/notes.tsx`:**
    *   Verify adding, editing, and deleting private notes.
    *   Test validation for note content.
*   **`app/(tabs)/weather.tsx`:**
    *   Verify weather data display for valid city input.
    *   Test error handling for invalid city or API issues.

**Integration Tests:**

*   Verify the complete flow for each feature: navigate to the screen, perform CRUD operations, and confirm data persistence in Firestore (for checklists and notes).
*   Verify weather data retrieval and display for a given city.

**Verification Steps:**

1.  Run the application and navigate to the "Checklists" tab.
2.  Add several shot items, including descriptions and notes. Mark some as complete.
3.  Verify that items are added, updated, and deleted correctly.
4.  Navigate away and back to confirm data persistence.
5.  Navigate to the "Notes" tab.
6.  Add, edit, and delete private notes.
7.  Verify data persistence.
8.  Navigate to the "Weather" tab.
9.  Enter a city name (e.g., "London") and click "Get Weather".
10. Verify that current weather and forecast data are displayed correctly.
11. Test with an invalid city name and ensure an error message is shown.

## Phase 6 Implementation: Polish, Optimization & Deployment Prep

This phase focuses on refining the application, optimizing performance, ensuring accessibility, and preparing for deployment. It includes completing any remaining questionnaire sections, enhancing UI/UX, and implementing robust error handling and security measures.

### 6.1 Remaining Questionnaire Sections (Photography Plan)

Complete the final questionnaire section, "Photography Plan", to capture detailed preferences and requirements for the photography session.

**File: `src/types/questionnaire.ts` (Additions)**

```typescript
// Photography Plan Schema
export const PhotographyPlanSchema = z.object({
  id: z.string().optional(),
  stylePreferences: z.string().optional(),
  mustHaveShots: z.array(z.string()).optional(),
  doNotShoot: z.array(z.string()).optional(),
  groupPhotos: z.string().optional(),
  // Add more fields as needed
});

export type PhotographyPlan = z.infer<typeof PhotographyPlanSchema>;

// Update Main Questionnaire Schema (Additions)
export const QuestionnaireSchema = z.object({
  projectId: z.string(),
  essentialInfo: EssentialInfoSchema.optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  keyPeople: z.array(KeyPersonSchema).optional(),
  photographyPlan: PhotographyPlanSchema.optional(),
});

// Ensure the Questionnaire type is re-exported with the new fields
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
```

**File: `src/services/questionnaireService.ts` (Additions)**

```typescript
// Add to QuestionnaireService class

  /**
   * Saves or updates the photography plan for a project's questionnaire.
   * @param projectId The ID of the project.
   * @param photographyPlan The photography plan data.
   */
  static async savePhotographyPlan(projectId: string, photographyPlan: PhotographyPlan): Promise<void> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      await updateDoc(questionnaireRef, { photographyPlan: photographyPlan });
      console.log('Photography plan saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving photography plan:', error);
      throw error;
    }
  }

  /**
   * Retrieves the photography plan for a project's questionnaire.
   * @param projectId The ID of the project.
   * @returns The photography plan data or null if not found.
   */
  static async getPhotographyPlan(projectId: string): Promise<PhotographyPlan | null> {
    try {
      const questionnaireRef = doc(db, 'questionnaires', projectId);
      const docSnap = await getDoc(questionnaireRef);
      if (docSnap.exists()) {
        return docSnap.data().photographyPlan as PhotographyPlan;
      }
      return null;
    } catch (error) {
      console.error('Error getting photography plan:', error);
      throw error;
    }
  }
```

**File: `app/(questionnaire)/photography-plan.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { Screen } from '../../src/components/ui/Screen';
import { Typography } from '../../src/components/ui/Typography';
import { PhotographyPlanSchema, PhotographyPlan } from '../../src/types/questionnaire';
import { QuestionnaireService } from '../../src/services/questionnaireService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZodError } from 'zod';

const PhotographyPlanScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [formData, setFormData] = useState<PhotographyPlan>({
    stylePreferences: '',
    mustHaveShots: [],
    doNotShoot: [],
    groupPhotos: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

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
    if (errors[name as string]) {
      setErrors({ ...errors, [name as string]: '' });
    }
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
    return <Screen><Typography variant="bodyLarge">Loading photography plan...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Photography Plan</Typography>
      
      <TextInput
        label="Style Preferences (e.g., candid, traditional)"
        value={formData.stylePreferences}
        onChangeText={(text) => handleChange('stylePreferences', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <TextInput
        label="Must-Have Shots (comma-separated)"
        value={formData.mustHaveShots?.join(', ') || ''}
        onChangeText={(text) => handleChange('mustHaveShots', text.split(',').map(s => s.trim()))}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <TextInput
        label="Do Not Shoot (comma-separated)"
        value={formData.doNotShoot?.join(', ') || ''}
        onChangeText={(text) => handleChange('doNotShoot', text.split(',').map(s => s.trim()))}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <TextInput
        label="Group Photos (specific groupings)"
        value={formData.groupPhotos}
        onChangeText={(text) => handleChange('groupPhotos', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Save Photography Plan
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

export default PhotographyPlanScreen;
```

### 6.2 UI/UX Improvements

Focus on enhancing the overall user experience and visual appeal of the application.

*   **Consistent Theming:** Ensure all new components and screens adhere to the defined `theme.ts` and `typography.ts`.
*   **Responsive Design:** Verify that all screens and components adapt well to different screen sizes and orientations.
*   **Loading Indicators:** Implement clear loading states for data fetching operations (e.g., using `ActivityIndicator` or custom loading components).
*   **Empty States:** Utilize the `EmptyState` component for lists or sections with no data.
*   **Form Feedback:** Provide immediate and clear feedback for form validations and submissions.
*   **Animations:** Consider subtle animations for transitions or interactions to improve perceived performance and user delight.

### 6.3 Performance Optimization

Implement strategies to improve the application's performance.

*   **Memoization:** Use `React.memo` for functional components and `useMemo`/`useCallback` for expensive computations or callbacks to prevent unnecessary re-renders.
*   **FlatList Optimization:** For long lists, ensure `FlatList` is properly optimized with `keyExtractor`, `getItemLayout`, and `removeClippedSubviews`.
*   **Image Optimization:** Optimize image loading and display (e.g., lazy loading, appropriate image formats and sizes).
*   **Bundle Size Reduction:** Analyze and reduce the application's bundle size by removing unused dependencies and optimizing imports.

### 6.4 Error Handling and Accessibility

Strengthen the application's robustness and inclusivity.

*   **Centralized Error Handling:** Enhance `errorHandler.ts` to provide more comprehensive error logging and user-friendly error messages. Consider integrating with an error monitoring service.
*   **Accessibility:**
    *   Ensure all interactive elements have appropriate `accessibilityLabel` and `accessibilityHint`.
    *   Verify proper navigation with screen readers.
    *   Ensure sufficient color contrast for text and UI elements.
    *   Provide keyboard navigation support where applicable.

### 6.5 Security Measures

Review and implement security best practices.

*   **Firestore Security Rules:** Develop and deploy robust Firestore security rules to protect user data and ensure only authorized users can access and modify their own project data.
*   **API Key Management:** Ensure API keys (e.g., OpenWeatherMap) are stored securely and not exposed in client-side code (e.g., using environment variables or Firebase Cloud Functions for server-side calls).
*   **Input Validation:** Reinforce server-side input validation in addition to client-side validation.

### 6.6 Testing and Verification

Conduct thorough testing across all new features and improvements.

**Unit Tests:**

*   **`src/services/questionnaireService.ts`:**
    *   Test `savePhotographyPlan` and `getPhotographyPlan`.

**Component Tests:**

*   **`app/(questionnaire)/photography-plan.tsx`:**
    *   Verify form rendering, input handling, and submission.
    *   Test validation for various fields.

**Integration Tests:**

*   Verify the complete flow for the Photography Plan: navigate, fill out, save, and confirm persistence.
*   Test end-to-end user flows, including authentication, project creation, and questionnaire completion.

**Performance Testing:**

*   Use Expo's built-in performance monitoring tools or third-party solutions to identify and address performance bottlenecks.

**Accessibility Testing:**

*   Use accessibility testing tools (e.g., Lighthouse for web, Android Accessibility Scanner, iOS Accessibility Inspector) to identify and fix accessibility issues.

**Security Audit:**

*   Review Firestore security rules and API key handling.

**Verification Steps:**

1.  Run the application and navigate to a project's questionnaire section.
2.  Click the "Photography Plan" button.
3.  Fill in all fields with valid data and click "Save Photography Plan".
4.  Verify that the plan is saved and re-populates correctly upon re-opening.
5.  Thoroughly test all UI/UX improvements, ensuring responsiveness, proper loading states, and form feedback.
6.  Verify that error handling is robust and user-friendly.
7.  Confirm that all accessibility features are working as expected.
8.  Review Firebase console to ensure security rules are correctly applied and data access is restricted.

## Phase 7 Implementation: Deployment and Delivery

This final phase focuses on preparing the application for production deployment, ensuring all necessary steps are taken for a successful launch and ongoing maintenance. This includes final reviews, build management, and documentation.

### 7.1 Final Review and Quality Assurance

Conduct a comprehensive final review of the entire application.

*   **Code Review:** Perform a final code review to ensure code quality, consistency, and adherence to best practices.
*   **Feature Completeness:** Verify that all planned features are implemented and working as expected.
*   **Bug Fixing:** Address any remaining bugs or issues identified during testing.
*   **User Acceptance Testing (UAT):** If applicable, conduct UAT with target users to gather feedback and ensure the application meets their needs.

### 7.2 Build and Release Management

Prepare the application for deployment to production environments.

*   **Expo Build:** Use Expo Application Services (EAS) to build the standalone Android and iOS applications.
    *   `eas build --platform android`
    *   `eas build --platform ios`
*   **Web Build:** Build the web version of the application.
    *   `npx expo export:web` (for static web hosting)
    *   Or, if using a custom web setup, run the appropriate build command (e.g., `npm run build` for React).
*   **App Store Submission:** Prepare all necessary assets (screenshots, app icons, descriptions) and metadata for submission to Google Play Store and Apple App Store.
*   **Firebase Deployment:** Deploy Firestore security rules and any Firebase Cloud Functions.

### 7.3 Monitoring and Analytics

Set up monitoring and analytics to track application performance and user engagement post-deployment.

*   **Firebase Performance Monitoring:** Integrate Firebase Performance Monitoring to track app startup times, network requests, and other performance metrics.
*   **Firebase Crashlytics:** Set up Firebase Crashlytics for real-time crash reporting and analysis.
*   **Google Analytics (or similar):** Integrate analytics to understand user behavior, feature usage, and engagement patterns.

### 7.4 Documentation and Handover

Prepare comprehensive documentation for future maintenance and development.

*   **Technical Documentation:** Document the application architecture, key components, services, and data models.
*   **Deployment Guide:** Provide clear instructions for building, deploying, and managing the application.
*   **Troubleshooting Guide:** Document common issues and their resolutions.
*   **User Manual (Optional):** Create a user-friendly guide for end-users.

### 7.5 Final Testing and Verification

Perform final tests on the deployed application.

**End-to-End Testing:**

*   Test the deployed application on various devices and network conditions.
*   Verify all features work correctly in the production environment.

**Regression Testing:**

*   Ensure that new changes have not introduced any regressions in existing functionality.

**Verification Steps:**

1.  Verify that the Android and iOS builds are successful and can be installed on devices.
2.  Verify that the web build is accessible and fully functional in a web browser.
3.  Confirm that all Firebase services (Auth, Firestore) are correctly configured and accessible in the deployed environment.
4.  Check Firebase Performance Monitoring and Crashlytics dashboards for initial data.
5.  Review analytics data to ensure events are being tracked correctly.
6.  Confirm that all documentation is complete and accessible.

This concludes the comprehensive implementation guide for the EyeDooApp. Each phase builds upon the previous one, leading to a robust, performant, and user-friendly application. Good luck with your development!

