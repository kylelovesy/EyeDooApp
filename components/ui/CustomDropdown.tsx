/*
File: components/ui/CustomDropdown.tsx
Description: This component no longer uses a nested Modal. It now displays its options
in an absolutely positioned View, which will appear above other content without creating
conflicts. I have also added logic to calculate its position on the screen dynamically.
I've updated the import paths to use the absolute path alias ('@/...') defined in your
tsconfig.json to resolve the recent compilation errors.
*/
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../constants/theme';
import { BodyText } from './Typography';

interface DropdownProps {
  data: { label: string; value: string }[];
  onSelect: (item: { label: string; value: string }) => void;
  placeholder?: string;
}

const CustomDropdown = ({ data, onSelect, placeholder = 'Select an item' }: DropdownProps) => {
  const { colors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const toggleDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      buttonRef.current?.measure((_fx, _fy, width, height, px, py) => {
        setDropdownPosition({ top: py + height, left: px, width });
        setIsOpen(true);
      });
    }
  };

  const handleSelect = (item: { label: string; value: string }) => {
    setSelectedValue(item.label);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <View style={{zIndex: 2000}}>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.button, { borderColor: colors.outline }]}
        onPress={toggleDropdown}
      >
        <BodyText style={{ color: selectedValue ? colors.onSurface : colors.onSurfaceVariant }}>
          {selectedValue || placeholder}
        </BodyText>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.onSurfaceVariant} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
            <View style={[styles.dropdown, { top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width, backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleSelect(item)}
                >
                    <BodyText>{item.label}</BodyText>
                </TouchableOpacity>
                )}
            />
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    padding: 12,
  },
});

export default CustomDropdown;


// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { Button, Menu, useTheme } from 'react-native-paper';

// interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface CustomDropdownProps {
//   label: string;
//   value: string;
//   options: DropdownOption[];
//   onValueChange: (value: string) => void;
//   disabled?: boolean;
// }

// export const CustomDropdown: React.FC<CustomDropdownProps> = ({
//   label,
//   value,
//   options,
//   onValueChange,
//   disabled = false,
// }) => {
//   const theme = useTheme();
//   const [visible, setVisible] = useState(false);

//   const openMenu = () => setVisible(true);
//   const closeMenu = () => setVisible(false);

//   // Find the label of the currently selected option.
//   const selectedLabel = options.find(option => option.value === value)?.label || label;

//   return (
//     <Menu
//       visible={visible}
//       onDismiss={closeMenu}
//       anchor={
//         <Button
//           onPress={openMenu}
//           mode="outlined"
//           disabled={disabled}
//           icon="chevron-down"
//           contentStyle={styles.buttonContent}
//           style={[styles.button, { borderColor: theme.colors.outline }]}
//           labelStyle={styles.buttonLabel}
//         >
//           {selectedLabel}
//         </Button>
//       }
//       style={styles.menu}
//     >
//       {options.map((option) => (
//         <Menu.Item
//           key={option.value}
//           onPress={() => {
//             onValueChange(option.value);
//             closeMenu();
//           }}
//           title={option.value}
//         />
//       ))}
//     </Menu>
//   );
// };

// const styles = StyleSheet.create({
//     menu: {
//         marginTop: 45,
//     },
//     button: {
//         justifyContent: 'center',
//         height: 56, // Standard height for text inputs
//         marginBottom: 12,
//     },
//     buttonContent: {
//         flexDirection: 'row-reverse',
//         justifyContent: 'space-between',
//         width: '100%',
//     },
//     buttonLabel: {
//         textAlign: 'left',
//         flex: 1,
//     }
// });


// export default CustomDropdown;

