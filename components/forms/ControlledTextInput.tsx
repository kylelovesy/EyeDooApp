import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface ControlledTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  maxLength?: number;
  style?: any;
  required?: boolean;
  testID?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  autoComplete?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

export const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = false,
  helperText,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  maxLength,
  style,
  required = false,
  testID,
  left,
  right,
  onFocus,
  onBlur,
  autoComplete,
  returnKeyType = 'done',
  onSubmitEditing,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Typography variant="labelMedium" style={styles.label}>
        {label}{required && ' *'}
      </Typography>
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        mode="outlined"
        error={error}
        disabled={disabled}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        testID={testID}
        left={left}
        right={right}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        style={styles.textInput}
        contentStyle={multiline ? styles.multilineContent : undefined}
      />

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
  textInput: {
    backgroundColor: 'transparent',
  },
  multilineContent: {
    paddingTop: 12,
  },
  helperText: {
    marginTop: 4,
  },
});
