import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  HelperText,
  Menu,
  useTheme
} from 'react-native-paper';
import { Typography } from '../ui/Typography';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  style?: any;
  required?: boolean;
  testID?: string;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error = false,
  helperText,
  disabled = false,
  style,
  required = false,
  testID,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleOptionSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setMenuVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Typography variant="labelMedium" style={styles.label}>
        {label}{required && ' *'}
      </Typography>
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => !disabled && setMenuVisible(true)}
            style={[
              styles.button,
              error && { borderColor: theme.colors.error },
              disabled && { opacity: 0.6 }
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={[
              styles.buttonLabel,
              !selectedOption && { color: theme.colors.onSurfaceVariant }
            ]}
            icon="chevron-down"
            disabled={disabled}
            testID={testID}
          >
            {displayText}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <Menu.Item
              onPress={() => handleOptionSelect(option.value)}
              title={option.label}
              titleStyle={[
                styles.menuItemTitle,
                value === option.value && { 
                  color: theme.colors.primary,
                  fontWeight: 'bold'
                }
              ]}
            />
            {index < options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>

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
  button: {
    justifyContent: 'flex-start',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  buttonLabel: {
    textAlign: 'left',
    flex: 1,
  },
  menuContent: {
    maxHeight: 300,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  helperText: {
    marginTop: 4,
  },
});

