import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, HelperText, useTheme } from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectInputProps {
  label: string;
  value: string[];
  onValueChange: (values: string[]) => void;
  options: MultiSelectOption[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  style?: any;
  required?: boolean;
  testID?: string;
  maxSelections?: number;
  chipMode?: 'flat' | 'outlined';
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
  error = false,
  helperText,
  style,
  required = false,
  testID,
  maxSelections,
  chipMode = 'outlined',
}) => {
  const theme = useTheme();

  const handleOptionToggle = (optionValue: string) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);
    
    if (isSelected) {
      // Remove from selection
      onValueChange(value.filter(v => v !== optionValue));
    } else {
      // Add to selection (if not at max limit)
      if (!maxSelections || value.length < maxSelections) {
        onValueChange([...value, optionValue]);
      }
    }
  };

  const isOptionSelected = (optionValue: string) => value.includes(optionValue);
  
  const isOptionDisabled = (optionValue: string): boolean => {
    if (disabled === true) return true;
  
    const maxReached = maxSelections && value.length >= maxSelections;
    const notSelected = !isOptionSelected(optionValue);
  
    return Boolean(maxReached && notSelected);
  };

  return (
    <View style={[styles.container, style]}>
      <Typography variant="labelMedium" style={styles.label}>
        {label}{required && ' *'}
        {maxSelections && (
          <Typography variant="bodySmall" style={styles.maxText}>
            {' '}(Max {maxSelections})
          </Typography>
        )}
      </Typography>
      
      <View style={styles.chipsContainer}>
        {options.map((option) => {
          const selected = isOptionSelected(option.value);
          const optionDisabled = isOptionDisabled(option.value);
          
          return (
            <Chip
              key={option.value}
              mode={selected ? 'flat' : chipMode}
              selected={selected}
              onPress={() => handleOptionToggle(option.value)}
              disabled={optionDisabled}
              style={[
                styles.chip,
                selected && { 
                  backgroundColor: error ? theme.colors.errorContainer : theme.colors.primaryContainer 
                },
                optionDisabled && { opacity: 0.6 }
              ]}
              textStyle={[
                selected && { 
                  color: error ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer 
                }
              ]}
              testID={`${testID}-${option.value}`}
            >
              {option.label}
            </Chip>
          );
        })}
      </View>

      {value.length > 0 && (
        <View style={styles.selectedContainer}>
          <Typography variant="bodySmall" style={styles.selectedText}>
            Selected: {value.length} item{value.length !== 1 ? 's' : ''}
          </Typography>
        </View>
      )}

      {helperText && (
        <HelperText 
          type={error ? 'error' : 'info'} 
          visible={!!helperText}
          style={styles.helperText}
        >
          {helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  maxText: {
    opacity: 0.7,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  selectedContainer: {
    marginTop: 8,
  },
  selectedText: {
    opacity: 0.7,
  },
  helperText: {
    marginTop: 4,
  },
});

