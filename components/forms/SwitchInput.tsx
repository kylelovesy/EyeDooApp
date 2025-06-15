import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, Switch, useTheme } from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface SwitchInputProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  style?: any;
  testID?: string;
  labelStyle?: any;
  description?: string;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  error = false,
  helperText,
  style,
  testID,
  labelStyle,
  description,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.switchContainer}>
        <View style={styles.labelContainer}>
          <Typography 
            variant="bodyMedium" 
            style={[
              styles.label,
              disabled && { opacity: 0.6 },
              error && { color: theme.colors.error },
              labelStyle
            ]}
          >
            {label}
          </Typography>
          {description && (
            <Typography 
              variant="bodySmall" 
              style={[
                styles.description,
                disabled && { opacity: 0.6 }
              ]}
            >
              {description}
            </Typography>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          testID={testID}
          theme={{
            colors: {
              primary: error ? theme.colors.error : theme.colors.primary,
            },
          }}
        />
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontWeight: '500',
  },
  description: {
    marginTop: 4,
    opacity: 0.7,
  },
  helperText: {
    marginTop: 4,
  },
});