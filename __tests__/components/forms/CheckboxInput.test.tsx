import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { CheckboxInput } from '../../../components/forms/CheckboxInput'; // Adjusted path
import { lightTheme } from '../../../constants/theme'; // Adjusted path
import { StyleSheet } from 'react-native'; // Moved to top

// Wrapper to provide the theme
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('CheckboxInput', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders correctly with a label', () => {
    const { getByText, getByTestId } = render(
      <CheckboxInput
        label="Test Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        testID="test-checkbox"
      />,
      { wrapper: AllProviders }
    );

    expect(getByText('Test Checkbox')).toBeTruthy();
    expect(getByTestId('test-checkbox')).toBeTruthy();
  });

  it('calls onValueChange with the new value when checkbox is pressed', () => {
    const { getByTestId } = render(
      <CheckboxInput
        label="Test Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        testID="test-checkbox"
      />,
      { wrapper: AllProviders }
    );

    const checkbox = getByTestId('test-checkbox');
    fireEvent.press(checkbox);
    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange with the new value when label is pressed', () => {
    const { getByText } = render(
      <CheckboxInput
        label="Test Checkbox Label Press"
        value={false}
        onValueChange={mockOnValueChange}
      />,
      { wrapper: AllProviders }
    );

    const label = getByText('Test Checkbox Label Press');
    fireEvent.press(label);
    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('updates checkbox state correctly (checked/unchecked)', () => {
    const { getByTestId, rerender } = render(
      <CheckboxInput
        label="Test Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        testID="test-checkbox"
      />,
      { wrapper: AllProviders }
    );

    const checkbox = getByTestId('test-checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(false);

    // Simulate prop update to checked
    rerender(
      <CheckboxInput
        label="Test Checkbox"
        value={true}
        onValueChange={mockOnValueChange}
        testID="test-checkbox"
      />
    );
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('does not call onValueChange when disabled and checkbox is pressed', () => {
    const { getByTestId } = render(
      <CheckboxInput
        label="Test Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        disabled={true}
        testID="test-checkbox"
      />,
      { wrapper: AllProviders }
    );

    const checkbox = getByTestId('test-checkbox');
    fireEvent.press(checkbox);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('does not call onValueChange when disabled and label is pressed', () => {
    const { getByText } = render(
      <CheckboxInput
        label="Test Checkbox Disabled Label"
        value={false}
        onValueChange={mockOnValueChange}
        disabled={true}
      />,
      { wrapper: AllProviders }
    );

    const label = getByText('Test Checkbox Disabled Label');
    fireEvent.press(label);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('renders helper text when provided', () => {
    const { getByText } = render(
      <CheckboxInput
        label="Test Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        helperText="This is a helper text"
      />,
      { wrapper: AllProviders }
    );
    expect(getByText('This is a helper text')).toBeTruthy();
  });

  it('renders error styles when error prop is true', () => {
    const { getByTestId, getByText } = render(
      <CheckboxInput
        label="Error Checkbox"
        value={false}
        onValueChange={mockOnValueChange}
        error={true}
        helperText="Error message"
        testID="error-checkbox"
      />,
      { wrapper: AllProviders }
    );

    const label = getByText('Error Checkbox');
    // Check that the conditional error style object was part of the style input
    // The final style is flattened, so we check the object under the expected key.
    // Key "2" corresponds to `error && { color: theme.colors.error }`
    // because styles.label is "0", disabled is "1" (false in this case).
    expect(label.props.style["2"]).toEqual({ color: lightTheme.colors.error });

    const helperTextComponent = getByText('Error message');
    // Check if HelperText is visible
    expect(helperTextComponent).toBeTruthy();
    // Check HelperText color (it should use theme.colors.error when type='error')
    // This assumes HelperText applies the color directly to the Text element returned by getByText
    const helperTextStyle = StyleSheet.flatten(helperTextComponent.props.style);
    expect(helperTextStyle.color).toBe(lightTheme.colors.error);

    // Due to the difficulty of reliably testing theme overrides on the Checkbox itself
    // without deeper component mocking or visual regression, we'll skip direct checkbox color check here.
    // The label and helper text checks provide good confidence for the error state.
  });

  it('label has reduced opacity when disabled', () => {
     const { getByText } = render(
      <CheckboxInput
        label="Disabled Label Opacity"
        value={false}
        onValueChange={mockOnValueChange}
        disabled={true}
      />,
      { wrapper: AllProviders }
    );
    const label = getByText('Disabled Label Opacity');
    // Check that the conditional disabled style object was part of the style input
    // Key "1" corresponds to `disabled && { opacity: 0.6 }`
    // because styles.label is "0".
    expect(label.props.style["1"]).toEqual({ opacity: 0.6 });
  });
});
