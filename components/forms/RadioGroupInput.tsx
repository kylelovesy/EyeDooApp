import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, RadioButton, useTheme } from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  style?: any;
  required?: boolean;
  testID?: string;
  direction?: 'vertical' | 'horizontal';
}

export const RadioGroupInput: React.FC<RadioGroupInputProps> = ({
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
  direction = 'vertical',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Typography variant="labelMedium" style={styles.label}>
        {label}{required && ' *'}
      </Typography>
      
      <RadioButton.Group 
        onValueChange={onValueChange} 
        value={value}
      >
        <View style={[
          styles.optionsContainer,
          direction === 'horizontal' && styles.horizontalContainer
        ]}>
          {options.map((option) => (
            <View 
              key={option.value} 
              style={[
                styles.optionContainer,
                direction === 'horizontal' && styles.horizontalOption
              ]}
            >
              <RadioButton
                value={option.value}
                disabled={disabled}
                testID={`${testID}-${option.value}`}
                theme={{
                  colors: {
                    primary: error ? theme.colors.error : theme.colors.primary,
                  },
                }}
              />
              <Typography 
                variant="bodyMedium" 
                style={[
                  styles.optionLabel,
                  disabled && { opacity: 0.6 },
                  error && { color: theme.colors.error }
                ]}
                onPress={() => !disabled && onValueChange(option.value)}
              >
                {option.label}
              </Typography>
            </View>
          ))}
        </View>
      </RadioButton.Group>

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
  optionsContainer: {
    marginLeft: 8,
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  horizontalOption: {
    marginRight: 16,
    marginBottom: 0,
  },
  optionLabel: {
    marginLeft: 8,
    flex: 1,
  },
  helperText: {
    marginTop: 4,
  },
});

