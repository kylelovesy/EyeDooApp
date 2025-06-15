import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { PrivateNotesService } from '../../services/privateNotesService';
import { PrivateNote, PrivateNoteSchema } from '../../types/notes';

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
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
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