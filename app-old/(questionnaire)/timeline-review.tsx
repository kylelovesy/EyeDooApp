import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { QuestionnaireService } from '../../services/questionnaireService';
import { TimelineEvent, TimelineEventSchema } from '../../types/questionnaire';

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
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  eventDetails: {
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
  },
});
export default TimelineReviewScreen;