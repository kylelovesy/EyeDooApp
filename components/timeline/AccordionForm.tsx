/*-------------------------------------*/
// components/timeline/AccordionForm.tsx
// Status: Complete
// What it does: 
// A reusable presentational component that renders a single section of the accordion form, 
// including a title, icon, and animated content area. 
// It uses the useAccordionAnimation hook.
/*-------------------------------------*/
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Animated, LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, IconButton, SegmentedButtons, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useAppTheme } from '../../constants/theme';
import type { AccordionFormProps } from '../../types/timeline';
import { LabelText } from '../ui/Typography';
import { EventTypeDropdown } from './EventTypeDropdown';

export const AccordionForm: React.FC<AccordionFormProps> = ({
  animation,
  formData,
  errors,
  showTimePicker,
  projectDate,
  isLoading,
  isExpanded,
  isFormComplete,
  onFieldChange,
  onTimePickerToggle,
  onTimeChange,
  onCancel,
  onConfirm,
  isEditMode = false,
  editingEvent,
  title = 'Add Event',
  onDelete,
}) => {
  const theme = useAppTheme();
  const [contentHeight, setContentHeight] = useState(0);

  // FIX: Improved delete handler with proper error handling
  const handleDelete = async () => {
    if (!onDelete || !editingEvent) {
      console.warn('AccordionForm: Delete handler or editing event not available');
      return false;
    }

    console.log('AccordionForm: Delete event:', editingEvent.eventId);
    
    try {
      // Call the delete handler passed from parent
      const result = await onDelete(editingEvent);
      
      // Handle both boolean and void returns
      const success = result !== false;
      
      if (success) {
        console.log('AccordionForm: Event deleted successfully');
      } else {
        console.log('AccordionForm: Failed to delete event');
      }
      
      return success;
    } catch (error) {
      console.error('AccordionForm: Error deleting event:', error);
      return false;
    }
  };

  const styles = StyleSheet.create({
    animatedContainer: {
      overflow: 'hidden',
      marginBottom: 8,
    },
    content: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      position: 'absolute',
      width: '100%',
    },
    formSection: {
      marginBottom: 12,
    },
    timeButton: {
      marginBottom: 4,
    },
    actionButtons: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    rightButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    touchable: {
      borderRadius: theme.roundness,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: errors.time ? theme.colors.error : theme.colors.outline,
      borderRadius: theme.roundness,
      paddingLeft: 16,
      height: 56, // Standard height for Paper inputs
      backgroundColor: theme.colors.surface,
    },
    timeText: {
      flex: 1,
      fontSize: 16,
      color: formData.time ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
    },
    placeholderText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.onSurfaceDisabled,
    },
  });

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== contentHeight) {
        setContentHeight(height);
    }
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <Animated.View style={[styles.animatedContainer, { height: animatedHeight }]}>
      <View style={styles.content} onLayout={onLayout}>
        <View style={styles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 4 }}>
            Event Type *
          </LabelText>
          <EventTypeDropdown
            selectedType={formData.eventType}
            onSelect={(type) => onFieldChange('eventType', type)}
            error={errors.eventType}
            disabled={isLoading}
          />
        </View>

        <View style={styles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 4 }}>
            Start Time *
          </LabelText>
          <TouchableRipple
            onPress={() => onTimePickerToggle(true)}
            style={styles.touchable}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={`Selected time: ${formData.time ? formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not set'}. Press to change.`}
          >
            <View style={styles.inputContainer}>
              {formData.time ? (
                <Text style={styles.timeText}>
                  {formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Select Time'}
                </Text>
              ) : (
                <Text style={styles.placeholderText}>Select a time</Text>
              )}

              <IconButton
                  icon="clock-outline"
                  onPress={() => onTimePickerToggle(true)}
                  disabled={isLoading}
                  iconColor={theme.colors.onSurfaceVariant}
              />
            </View>
          </TouchableRipple>
          {errors.time && <HelperText type="error">{errors.time}</HelperText>}
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={formData.time || new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        <View style={styles.formSection}>
          <TextInput
            label="Description / Location"
            value={formData.description || ''}
            onChangeText={(text) => onFieldChange('description', text)}
            mode="outlined"
            disabled={isLoading}
            maxLength={80}
            numberOfLines={1}
            style={{ backgroundColor: 'transparent' }}
            placeholder="Details / Location"
          />
        </View>

        <View style={styles.formSection}>
          <LabelText size="medium" style={{ marginBottom: 8 }}>
            Set Notifications
          </LabelText>
          <SegmentedButtons
            value={formData.notification || 'None'}
            onValueChange={(value) => onFieldChange('notification', value)}
            buttons={[
              { value: 'None', icon: 'bell-off-outline' },
              { value: 'Push', icon: 'bell-outline' },
              { value: 'Email', icon: 'email-outline' },
              { value: 'Text', icon: 'message-text-outline' }
            ]}
            density="small"
          />
        </View>

        <View style={styles.actionButtons}>
          {isEditMode && editingEvent && (
            <IconButton 
              icon="trash-can-outline"
              onPress={handleDelete} 
              disabled={isLoading}
              iconColor={theme.colors.error}
            />
          )}
          
          {/* FIX: Empty view to maintain spacing when not in edit mode */}
          {!isEditMode && <View />}
          
          <View style={styles.rightButtons}>
            <Button mode="text" onPress={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              disabled={isLoading || !isFormComplete}
              loading={isLoading}
            >
              {isEditMode ? 'Update Event' : 'Save Event'}
            </Button>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
