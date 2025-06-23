import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    IconButton,
    List,
    TextInput
} from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { z } from 'zod';
import { commonStyles, createThemedStyles } from '../../constants/styles';
import { spacing, useAppTheme } from '../../constants/theme';
import { useForm2 } from '../../contexts/Form2TimelineContext';
import { TimelineEventType } from '../../types/enum';
import { TimelineEventSchema } from '../../types/reusableSchemas';
import CustomDropdown from '../ui/CustomDropdown';
import FormModal from '../ui/FormModal';
import { TitleText } from '../ui/Typography';

type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// This component now uses the standardized FormModal
export const TimelineFormModal: React.FC = () => {
    const context = useForm2();
    const { formData, setFormData } = context;
    const theme = useAppTheme();
    const styles = useStyles(theme);

    if (!formData) return null;

    const updateForm2Data = (updates: Partial<typeof formData>) => {
        setFormData(prev => prev ? { ...prev, ...updates } : null);
    };

    const addTimelineEvent = () => {
        const newEvent: TimelineEvent = {
            id: Date.now().toString(), 
            time: '09:00', 
            description: '', 
            location: '',
            notes: '', 
            icon: 'calendar', 
            iconColor: theme.colors.primary, 
            priority: 5,
            notification: false, 
            duration: 30,
        };
        updateForm2Data({ events: [...(formData.events || []), newEvent] });
    };

    const updateTimelineEvent = (index: number, updatedEvent: TimelineEvent) => {
        const updatedEvents = [...(formData.events || [])];
        updatedEvents[index] = updatedEvent;
        updatedEvents.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
        updateForm2Data({ events: updatedEvents });
    };

    const removeTimelineEvent = (index: number) => {
        const updatedEvents = (formData.events || []).filter((_, i) => i !== index);
        updateForm2Data({ events: updatedEvents });
    };

    return (
        <FormModal
            title="Edit Timeline"
            subtitle="Manage your project timeline events"
            context={context}
            saveLabel="Save Timeline"
            cancelLabel="Cancel"
        >
            <Card style={[commonStyles.card, styles.card]}>
                <Card.Content style={commonStyles.cardContent}>
                    <Button 
                        mode="contained" 
                        onPress={addTimelineEvent} 
                        icon="plus" 
                        style={{ marginBottom: spacing.md }}
                        theme={theme}
                    >
                        Add Event
                    </Button>
                </Card.Content>
            </Card>
            
            <List.AccordionGroup>
                {(formData.events || []).map((event, index) => (
                    <TimelineEventAccordion
                        key={event.id || index}
                        event={event} 
                        index={index} 
                        onUpdate={updateTimelineEvent} 
                        onRemove={removeTimelineEvent}
                    />
                ))}
            </List.AccordionGroup>
        </FormModal>
    );
}

// The accordion component for a single timeline event
const TimelineEventAccordion: React.FC<{
    event: TimelineEvent, 
    index: number, 
    onUpdate: (index: number, event: TimelineEvent) => void, 
    onRemove: (index: number) => void
}> = ({ event, index, onUpdate, onRemove }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const theme = useAppTheme();
    const styles = useStyles(theme);

    const accordionId = `timeline-event-${index}`;

    // Create accordion title from event data
    const getAccordionTitle = () => {
        if (event.description && event.time) {
            return `${event.time} - ${event.description}`;
        } else if (event.description) {
            return event.description;
        } else if (event.time) {
            return `${event.time} - New Event`;
        } else {
            return `Event ${index + 1}`;
        }
    };

    // Check if event has validation errors (missing required fields)
    const hasErrors = !event.description || !event.time;

    // Get accordion style based on validation state
    const getAccordionStyle = () => {
        if (hasErrors) {
            return [styles.accordion, styles.accordionInvalid];
        } else {
            return [styles.accordion, styles.accordionValid];
        }
    };

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
        onUpdate(index, { ...event, time: timeString });
        setShowTimePicker(false);
    };

    return (
        <List.Accordion 
            title={getAccordionTitle()}
            id={accordionId}
            style={getAccordionStyle()}
        >
            <View style={styles.accordionContent}>
                <View style={styles.cardHeader}>
                    <TitleText size="medium" color={theme.colors.onSurface}>
                        Event {index + 1}
                    </TitleText>
                    <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => onRemove(index)}
                        iconColor={theme.colors.error}
                    />
                </View>
                
                {/* Time Picker */}
                <Button
                    mode="outlined"
                    onPress={() => setShowTimePicker(true)}
                    style={commonStyles.input}
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
                
                {/* Event Type Dropdown */}
                <CustomDropdown
                    placeholder={event.description || 'Select Event Type'}
                    data={Object.values(TimelineEventType).map(type => ({ label: type as string, value: type as string }))}
                    onSelect={(selectedItem) => onUpdate(index, { ...event, description: selectedItem.value })}
                />
                
                <TextInput 
                    label="Location" 
                    value={event.location || ''} 
                    onChangeText={text => onUpdate(index, {...event, location: text})} 
                    mode="outlined" 
                    style={commonStyles.input}
                    theme={theme}
                />
                
                <TextInput 
                    label="Notes" 
                    value={event.notes || ''} 
                    onChangeText={text => onUpdate(index, {...event, notes: text})} 
                    mode="outlined" 
                    style={commonStyles.input}
                    multiline
                    numberOfLines={2}
                    theme={theme}
                />
            </View>
        </List.Accordion>
    );
};

const useStyles = (theme: any) => {
    const themedStyles = createThemedStyles(theme);
    return StyleSheet.create({
        ...themedStyles,
        accordion: { 
            backgroundColor: theme.colors.surface, 
            borderColor: theme.colors.outline, 
            borderWidth: 1, 
            marginBottom: spacing.xs, 
            borderRadius: 8 
        },
        accordionValid: {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        accordionInvalid: {
            backgroundColor: theme.colors.errorContainer,
            borderColor: theme.colors.error,
            borderWidth: 2,
        },
        accordionContent: { 
            padding: spacing.sm 
        },
        cardHeader: { 
            flexDirection: 'row' as const, 
            justifyContent: 'space-between' as const, 
            alignItems: 'center' as const,
            marginBottom: spacing.sm,
        },
        timeButton: {
            padding: spacing.sm,
        },
    });
};

export default TimelineFormModal;

