import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Chip,
    IconButton,
    Switch,
    Text,
    TextInput,
} from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { z } from 'zod';
import { useProjectForm } from './ProjectFormContext';
import { TimelineEventSchema } from './reusableSchemas';

// Infer type from Zod schema for better type safety
type TimelineEvent = z.infer<typeof TimelineEventSchema>;

interface TimelineEventFormProps {
  event: TimelineEvent;
  index: number;
  onUpdate: (updatedEvent: TimelineEvent) => void;
  onRemove: () => void;
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({ event, index, onUpdate, onRemove }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
//   const [showColorPicker, setShowColorPicker] = useState(false);

  // Parse time string to hours and minutes for TimePicker
  const parseTime = (timeString: string) => {
    if (!timeString || !timeString.match(/^\d{2}:\d{2}$/)) {
      return { hours: 9, minutes: 0 };
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  // Format time from hours and minutes to string
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const { hours, minutes } = parseTime(event.time);

  const onTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    const timeString = formatTime(hours, minutes);
    onUpdate({ ...event, time: timeString });
    setShowTimePicker(false);
  };

  // Predefined color options
  const colorOptions = [
    '#6200ee', '#03dac6', '#f44336', '#ff9800', '#4caf50',
    '#2196f3', '#9c27b0', '#795548', '#607d8b', '#e91e63'
  ];

  // Icon options for events
  const iconOptions = [
    'calendar', 'clock', 'church', 'glass-cocktail', 'camera',
    'music', 'flower', 'heart', 'ring', 'car', 'home', 'account-group'
  ];

  return (
    <Card style={styles.eventCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.eventTitle}>Event {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>

        {/* Time Picker */}
        <Button
          mode="outlined"
          onPress={() => setShowTimePicker(true)}
          style={styles.input}
          contentStyle={styles.timeButton}
        >
          Time: {event.time || '00:00'}
        </Button>

        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={onTimeConfirm}
          hours={hours}
          minutes={minutes}
          label="Select time"
          cancelLabel="Cancel"
          confirmLabel="OK"
          animationType="fade"
        />

        <TextInput
          label="Description *"
          value={event.description}
          onChangeText={(text) => onUpdate({ ...event, description: text })}
          mode="outlined"
          style={styles.input}
          maxLength={100}
        />

        <TextInput
          label="Location"
          value={event.location || ''}
          onChangeText={(text) => onUpdate({ ...event, location: text })}
          mode="outlined"
          style={styles.input}
          maxLength={100}
        />

        <TextInput
          label="Notes"
          value={event.notes || ''}
          onChangeText={(text) => onUpdate({ ...event, notes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          maxLength={200}
        />

        {/* Priority Slider
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Priority: {event.priority || 1}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={event.priority || 1}
            onValueChange={(value) => onUpdate({ ...event, priority: value })}
            thumbColor="#6200ee"
            minimumTrackTintColor="#6200ee"
            maximumTrackTintColor="#ccc"
          />
        </View> */}

        {/* Duration Input */}
        <TextInput
          label="Duration (minutes)"
          value={event.duration?.toString() || '30'}
          onChangeText={(text) => {
            const duration = parseInt(text) || 30;
            onUpdate({ ...event, duration });
          }}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
        />

        {/* Notification Switch */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable Notification</Text>
          <Switch
            value={event.notification || false}
            onValueChange={(value) => onUpdate({ ...event, notification: value })}
          />
        </View>

        {/* Icon Selection */}
        <Text style={styles.sectionLabel}>Icon</Text>
        <View style={styles.chipContainer}>
          {iconOptions.map((iconName) => (
            <Chip
              key={iconName}
              selected={event.icon === iconName}
              onPress={() => onUpdate({ ...event, icon: iconName })}
              style={styles.chip}
              icon={iconName}
            >
              {iconName}
            </Chip>
          ))}
        </View>

        {/* Color Selection */}
        <Text style={styles.sectionLabel}>Icon Color</Text>
        <View style={styles.colorContainer}>
          {colorOptions.map((color) => (
            <Button
              key={color}
              mode={event.iconColor === color ? 'contained' : 'outlined'}
              onPress={() => onUpdate({ ...event, iconColor: color })}
              style={[styles.colorButton, { backgroundColor: event.iconColor === color ? color : 'transparent' }]}
              contentStyle={styles.colorButtonContent}
            >
              <View style={[styles.colorSwatch, { backgroundColor: color }]} />
            </Button>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export const FormStep2: React.FC = () => {
  const { formData, setFormData } = useProjectForm();

  const updateForm2Data = (updates: Partial<typeof formData.form2>) => {
    setFormData((prev) => ({
      ...prev,
      form2: {
        ...prev.form2,
        ...updates,
      },
    }));
  };

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      time: '09:00',
      description: '',
      location: '',
      notes: '',
      icon: 'calendar',
      iconColor: '#6200ee',
      priority: 5,
      notification: false,
      duration: 30,
    };

    updateForm2Data({
      events: [...(formData.form2.events || []), newEvent],
    });
  };

  const updateTimelineEvent = (index: number, updatedEvent: TimelineEvent) => {
    const updatedEvents = [...(formData.form2.events || [])];
    updatedEvents[index] = updatedEvent;
    
    // Sort events by time
    updatedEvents.sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
    
    updateForm2Data({ events: updatedEvents });
  };

  const removeTimelineEvent = (index: number) => {
    const updatedEvents = (formData.form2.events || []).filter((_, i) => i !== index);
    updateForm2Data({ events: updatedEvents });
  };

  // Sort events by time for display
  const sortedEvents = [...(formData.form2.events || [])].sort((a, b) => {
    const timeA = a.time || '00:00';
    const timeB = b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Timeline Events</Text>
        <Text style={styles.subtitle}>
          Schedule and manage your project timeline
        </Text>

        <View style={styles.sectionHeader}>
          <Text>Events ({(formData.form2.events || []).length})</Text>
          <Button
            mode="contained"
            onPress={addTimelineEvent}
            icon="plus"
            compact
          >
            Add Event
          </Button>
        </View>

        {sortedEvents.map((event, index) => {
          // Find the original index for updating
          const originalIndex = (formData.form2.events || []).findIndex(e => e.id === event.id);
          return (
            <TimelineEventForm
              key={event.id || index}
              event={event}
              index={index}
              onUpdate={(updatedEvent) => updateTimelineEvent(originalIndex, updatedEvent)}
              onRemove={() => removeTimelineEvent(originalIndex)}
            />
          );
        })}

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text>Timeline Summary</Text>
            <Text style={styles.summaryText}>
              Total Events: {(formData.form2.events || []).length}
            </Text>
            <Text style={styles.summaryText}>
              High Priority Events: {(formData.form2.events || []).filter(e => (e.priority || 1) >= 8).length}
            </Text>
            <Text style={styles.summaryText}>
              Events with Notifications: {(formData.form2.events || []).filter(e => e.notification).length}
            </Text>
            {sortedEvents.length > 0 && (
              <>
                <Text style={styles.summaryText}>
                  First Event: {sortedEvents[0].time} - {sortedEvents[0].description}
                </Text>
                <Text style={styles.summaryText}>
                  Last Event: {sortedEvents[sortedEvents.length - 1].time} - {sortedEvents[sortedEvents.length - 1].description}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  eventCard: {
    marginBottom: 12,
    elevation: 1,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#e8f5e8',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginBottom: 12,
  },
  timeButton: {
    justifyContent: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorButton: {
    margin: 4,
    minWidth: 50,
    height: 40,
  },
  colorButtonContent: {
    height: 40,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
});

