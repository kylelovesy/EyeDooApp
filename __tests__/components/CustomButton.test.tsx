import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import CustomButton from '../../components/ui/CustomButton'; // Adjust path as needed
import { lightTheme } from '../../constants/theme'; // Adjust path as needed

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('CustomButton', () => {
  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(
      <CustomButton title="Default Button" testID="default-button" />,
      { wrapper: AllProviders }
    );
    expect(getByText('Default Button')).toBeTruthy();
    expect(getByTestId('default-button')).toBeTruthy();
  });

  it('renders correctly with a specific variant (secondary)', () => {
    const { getByText } = render(
      <CustomButton title="Secondary Button" variant="secondary" />,
      { wrapper: AllProviders }
    );
    expect(getByText('Secondary Button')).toBeTruthy();
    // Add more specific checks for variant styles if possible,
    // though it might be tricky without deeper inspection or snapshot testing.
  });

  it('renders correctly when disabled', () => {
    const { getByText, getByTestId } = render(
      <CustomButton title="Disabled Button" disabled testID="disabled-button" />,
      { wrapper: AllProviders }
    );
    expect(getByText('Disabled Button')).toBeTruthy();
    const button = getByTestId('disabled-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Press Me" onPress={onPressMock} />,
      { wrapper: AllProviders }
    );

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled and pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Disabled Press" onPress={onPressMock} disabled />,
      { wrapper: AllProviders }
    );

    fireEvent.press(getByText('Disabled Press'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with an icon on the left by default', () => {
    const { getByTestId } = render(
      <CustomButton title="Icon Button" icon="camera" testID="icon-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('icon-button');
    // React Native Paper's Button uses a prop `icon` for the left icon
    expect(button.props.icon).toBe('camera');
  });

  it('renders with an icon on the right if specified', () => {
    // Note: React Native Paper's default Button component might not directly support right-aligned icons
    // in the same way. This test assumes CustomButton handles it internally or the check needs adjustment.
    // For now, we'll check if the icon prop is NOT set for the default left position.
    // A more accurate test would require inspecting the component's internal structure or output further.
    const { getByTestId } = render(
      <CustomButton title="Icon Right" icon="camera" iconPosition="right" testID="icon-right-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('icon-right-button');
    // This is a limitation of the underlying RNP button. It doesn't expose a prop for right icon.
    // CustomButton would need to implement this visually, e.g., by reversing content.
    // We can check that the default `icon` prop (for left icon) is not set.
    expect(button.props.icon).toBeUndefined();
    // A more robust test would involve snapshot testing or checking children's layout.
  });

  it('renders as fullWidth when specified', () => {
    const { getByTestId } = render(
      <CustomButton title="Full Width" fullWidth testID="full-width-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('full-width-button');
    // Check for style. This is a bit of an implementation detail test.
    // It's better if `fullWidth` results in an accessibility attribute or a class we can check.
    expect(button.props.style).toEqual(expect.arrayContaining([{ width: '100%' }]));
  });

  // Add tests for different sizes and their corresponding styles
  it('applies small size styles', () => {
    const { getByTestId } = render(
      <CustomButton title="Small Button" size="small" testID="small-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('small-button');
    // These checks are for the `contentStyle` prop of RNP's Button
    expect(button.props.contentStyle).toEqual(
      expect.arrayContaining([
        { paddingVertical: 2, paddingHorizontal: 8, minHeight: 32 }, // Expected values from theme.spacing
      ])
    );
    expect(button.props.labelStyle).toEqual(
      expect.arrayContaining([
        { fontSize: 12, lineHeight: 16 },
      ])
    );
  });

  it('applies large size styles', () => {
    const { getByTestId } = render(
      <CustomButton title="Large Button" size="large" testID="large-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('large-button');
    expect(button.props.contentStyle).toEqual(
      expect.arrayContaining([
        { paddingVertical: 12, paddingHorizontal: 24, minHeight: 56 }, // Expected values from theme.spacing
      ])
    );
     expect(button.props.labelStyle).toEqual(
      expect.arrayContaining([
        { fontSize: 16, lineHeight: 24 },
      ])
    );
  });

  it('applies medium (default) size styles', () => {
    const { getByTestId } = render(
      <CustomButton title="Medium Button" testID="medium-button" />, // size="medium" is default
      { wrapper: AllProviders }
    );
    const button = getByTestId('medium-button');
    expect(button.props.contentStyle).toEqual(
      expect.arrayContaining([
        { paddingVertical: 8, paddingHorizontal: 16, minHeight: 44 }, // Expected values from theme.spacing
      ])
    );
    expect(button.props.labelStyle).toEqual(
      expect.arrayContaining([
        { fontSize: 14, lineHeight: 20 },
      ])
    );
  });

  // Test for danger variant
  it('renders danger variant with correct color', () => {
    const { getByTestId } = render(
      <CustomButton title="Danger Button" variant="danger" testID="danger-button" />,
      { wrapper: AllProviders }
    );
    const button = getByTestId('danger-button');
    // The CustomButton sets `buttonColor` for danger variant
    expect(button.props.buttonColor).toBe(lightTheme.colors.error);
  });
});
