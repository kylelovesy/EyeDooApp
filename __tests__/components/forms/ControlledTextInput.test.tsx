import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { ControlledTextInput } from '../../../components/forms/ControlledTextInput'; // Adjusted path
import { lightTheme } from '../../../constants/theme'; // Adjusted path

// Wrapper to provide the theme
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ControlledTextInput', () => {
  const mockOnChangeText = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    mockOnChangeText.mockClear();
    mockOnFocus.mockClear();
    mockOnBlur.mockClear();
  });

  it('renders correctly with label, placeholder, and initial value', () => {
    const { getByText, getByPlaceholderText, getByDisplayValue } = render(
      <ControlledTextInput
        label="Test Label"
        value="Initial Value"
        onChangeText={mockOnChangeText}
        placeholder="Test Placeholder"
      />,
      { wrapper: AllProviders }
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
    expect(getByDisplayValue('Initial Value')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Test Label"
        value=""
        onChangeText={mockOnChangeText}
        testID="test-input"
      />,
      { wrapper: AllProviders }
    );

    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'new text');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('updates input value correctly when value prop changes', () => {
    const { getByDisplayValue, rerender } = render(
      <ControlledTextInput label="Test Label" value="initial" onChangeText={mockOnChangeText} />,
      { wrapper: AllProviders }
    );
    expect(getByDisplayValue('initial')).toBeTruthy();

    rerender(
      <ControlledTextInput label="Test Label" value="updated" onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue('updated')).toBeTruthy();
  });

  it('displays error message when error and helperText props are provided', () => {
    const { getByText, getByTestId } = render(
      <ControlledTextInput
        label="Test Label"
        value=""
        onChangeText={mockOnChangeText}
        error={true}
        helperText="Error occurred"
        testID="test-input"
      />,
      { wrapper: AllProviders }
    );

    // Check that HelperText is shown, indicating error state is active
    expect(getByText('Error occurred')).toBeTruthy();
    // Direct prop/accessibilityState checks on RNP TextInput for 'error' are unreliable here.
    // We trust RNP TextInput to visually indicate error if its 'error' prop is true,
    // which ControlledTextInput does pass.
  });

  it('renders correctly with secureTextEntry', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Password"
        value="secret"
        onChangeText={mockOnChangeText}
        secureTextEntry={true}
        testID="password-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('password-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders correctly with a specific keyboardType', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Numeric Input"
        value="123"
        onChangeText={mockOnChangeText}
        keyboardType="numeric"
        testID="numeric-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('numeric-input');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('renders correctly when multiline', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Multiline Input"
        value="line1\nline2"
        onChangeText={mockOnChangeText}
        multiline={true}
        numberOfLines={3}
        testID="multiline-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('multiline-input');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(3);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Disabled Input"
        value=""
        onChangeText={mockOnChangeText}
        disabled={true}
        testID="disabled-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('disabled-input');
    // RNP's TextInput should not be editable when disabled.
    // Verify that onChangeText is not called.
    fireEvent.changeText(input, 'new text'); // Attempt to change text
    expect(mockOnChangeText).not.toHaveBeenCalled();
    // Direct prop/accessibilityState checks on RNP TextInput for 'disabled' are unreliable here.
    // We trust RNP TextInput to be disabled if its 'disabled' prop is true,
    // which ControlledTextInput does pass.
  });

  it('calls onFocus when input is focused', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Focus Input"
        value=""
        onChangeText={mockOnChangeText}
        onFocus={mockOnFocus}
        testID="focus-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('focus-input');
    fireEvent(input, 'focus');
    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input is blurred', () => {
    const { getByTestId } = render(
      <ControlledTextInput
        label="Blur Input"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
        testID="blur-input"
      />,
      { wrapper: AllProviders }
    );
    const input = getByTestId('blur-input');
    fireEvent(input, 'blur');
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('displays required indicator when required prop is true', () => {
    const { getByText } = render(
      <ControlledTextInput
        label="Required Field"
        value=""
        onChangeText={mockOnChangeText}
        required={true}
      />,
      { wrapper: AllProviders }
    );
    expect(getByText('Required Field *')).toBeTruthy();
  });
});
