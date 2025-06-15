import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, HelperText, useTheme } from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface CheckboxInputProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  style?: any;
  testID?: string;
  labelStyle?: any;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  error = false,
  helperText,
  style,
  testID,
  labelStyle,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={value ? 'checked' : 'unchecked'}
          onPress={handlePress}
          disabled={disabled}
          testID={testID}
          theme={{
            colors: {
              primary: error ? theme.colors.error : theme.colors.primary,
            },
          }}
        />
        <Typography 
          variant="bodyMedium" 
          style={[
            styles.label,
            disabled && { opacity: 0.6 },
            error && { color: theme.colors.error },
            labelStyle
          ]}
          onPress={handlePress}
        >
          {label}
        </Typography>
      </View>

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 40, // Align with checkbox content
  },
});
