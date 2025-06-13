// // __tests__/components/CustomButton.test.tsx
// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import { PaperProvider } from 'react-native-paper';
// import { CustomButton } from '../../components/ui/CustomButton';
// import { lightTheme } from '../../constants/theme';

// const renderWithTheme = (component: React.ReactElement) => {
//   return render(
//     <PaperProvider theme={lightTheme}>
//       {component}
//     </PaperProvider>
//   );
// };

// describe('CustomButton', () => {
//   it('renders correctly with title', () => {
//     const { getByText } = renderWithTheme(
//       <CustomButton title="Test Button" />
//     );

//     expect(getByText('Test Button')).toBeTruthy();
//   });

//   it('handles press events', () => {
//     const mockOnPress = jest.fn();
//     const { getByText } = renderWithTheme(
//       <CustomButton title="Test Button" onPress={mockOnPress} />
//     );

//     fireEvent.press(getByText('Test Button'));
//     expect(mockOnPress).toHaveBeenCalledTimes(1);
//   });

//   it('shows loading state correctly', () => {
//     const { getByTestId } = renderWithTheme(
//       <CustomButton title="Test Button" loading testID="test-button" />
//     );

//     const button = getByTestId('test-button');
//     expect(button.props.accessibilityState.disabled).toBe(true);
//   });

//   it('applies correct variant styles', () => {
//     const { getByTestId } = renderWithTheme(
//       <CustomButton title="Primary Button" variant="primary" testID="primary-button" />
//     );

//     const button = getByTestId('primary-button');
//     expect(button).toBeTruthy();
//   });

//   it('supports full width prop', () => {
//     const { getByTestId } = renderWithTheme(
//       <CustomButton title="Full Width Button" fullWidth testID="full-width-button" />
//     );

//     const button = getByTestId('full-width-button');
//     expect(button).toBeTruthy();
//   });

//   it('handles disabled state correctly', () => {
//     const mockOnPress = jest.fn();
//     const { getByTestId } = renderWithTheme(
//       <CustomButton 
//         title="Disabled Button" 
//         disabled 
//         onPress={mockOnPress}
//         testID="disabled-button" 
//       />
//     );

//     const button = getByTestId('disabled-button');
//     fireEvent.press(button);
    
//     expect(mockOnPress).not.toHaveBeenCalled();
//     expect(button.props.accessibilityState.disabled).toBe(true);
//   });
// });