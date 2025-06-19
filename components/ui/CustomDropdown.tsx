import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Menu, useTheme } from 'react-native-paper';

interface CustomDropdownProps {
  label: string;
  value: string | undefined;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  options,
  onValueChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Find the label of the currently selected option.
  const selectedLabel = options.find(option => option.value === value)?.label || label;

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button
          onPress={openMenu}
          mode="outlined"
          disabled={disabled}
          icon="chevron-down"
          contentStyle={styles.buttonContent}
          style={[styles.button, { borderColor: theme.colors.outline }]}
          labelStyle={styles.buttonLabel}
        >
          {selectedLabel}
        </Button>
      }
      style={styles.menu}
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            onValueChange(option.value);
            closeMenu();
          }}
          title={option.label}
        />
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
    menu: {
        marginTop: 45,
    },
    button: {
        justifyContent: 'center',
        height: 56, // Standard height for text inputs
        marginBottom: 12,
    },
    buttonContent: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonLabel: {
        textAlign: 'left',
        flex: 1,
    }
});


export default CustomDropdown;

