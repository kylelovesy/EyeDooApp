// src/components/forms/DatePickerInput.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { darkTheme, lightTheme } from '../../constants/theme';

interface DatePickerInputProps {
  label: string;
  value: Date;
  onDateChange: (date: Date) => void;
  mode?: 'outlined' | 'flat';
  style?: any;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onDateChange,
  mode = 'outlined',
  style,
  placeholder,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={formatDate(value)}
        mode={mode}
        editable={false}
        onPressIn={showDatePicker}
        placeholder={placeholder}
        disabled={disabled}
        right={
          <TextInput.Icon 
            icon="calendar" 
            onPress={showDatePicker}
            disabled={disabled}
          />
        }
        style={styles.textInput}
      />
      
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date(2100, 11, 31)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  textInput: {
    backgroundColor: 'transparent',
  },
});

export default DatePickerInput;



// import DateTimePicker from '@react-native-community/datetimepicker';
// import { format } from 'date-fns';
// import React, { useState } from 'react';
// import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { TextInput, useTheme } from 'react-native-paper';

// interface DatePickerInputProps {
//   label: string;
//   value: Date | undefined;
//   onDateChange: (date: Date | undefined) => void;
//   mode?: 'outlined' | 'flat';
//   disabled?: boolean;
//   style?: any;
// }

// export const DatePickerInput: React.FC<DatePickerInputProps> = ({
//   label,
//   value,
//   onDateChange,
//   mode = 'outlined',
//   disabled = false,
//   style,
// }) => {
//   const theme = useTheme();
//   const [showPicker, setShowPicker] = useState(false);

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowPicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
//     if (selectedDate) {
//       onDateChange(selectedDate);
//     } else {
//       onDateChange(undefined);
//     }
//   };

//   const displayDate = value ? format(value, 'PPP') : '';

//   return (
//     <View style={style}>
//       <TouchableOpacity onPress={() => !disabled && setShowPicker(true)} disabled={disabled}>
//         <TextInput
//           label={label}
//           value={displayDate}
//           mode={mode}
//           editable={false} // Make it non-editable to force date picker usage
//           right={<TextInput.Icon icon="calendar" onPress={() => !disabled && setShowPicker(true)} />}
//           disabled={disabled}
//           pointerEvents="none" // Ensures touch event goes to TouchableOpacity
//         />
//       </TouchableOpacity>

//       {showPicker && (
//         <DateTimePicker
//           value={value || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange}
//           maximumDate={new Date(2050, 11, 31)}
//           minimumDate={new Date(1900, 0, 1)}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // Add any specific styles if needed
// });


