# EyeDooApp Components Documentation

## Overview

This directory contains all reusable React components for the EyeDooApp photography project management application. The component system has been designed with consistency, accessibility, and type safety in mind, providing a comprehensive design system for the entire application.

## Structure

### UI Components (`/ui`)

- **`BaseFormModal.tsx`** - Standardized modal component with form submission handling
- **`CustomButton.tsx`** - Versatile button component with multiple variants and sizes
- **`CustomDropdown.tsx`** - Dropdown selection component with consistent styling
- **`EmptyState.tsx`** - Empty state display component with action options
- **`LoadingState.tsx`** - Loading indicator component with overlay support
- **`RepeatableSection.tsx`** - Component for dynamic list management with add/remove functionality
- **`Screen.tsx`** - Base screen wrapper with consistent padding and safe area handling
- **`Toast.tsx`** - Toast notification system with multiple types and custom actions
- **`Typography.tsx`** - Comprehensive typography system with standardized text styles

### Card Components (`/cards`)

- **`CustomCard.tsx`** - General-purpose card component with header, content, and action support
- **`ProjectCard.tsx`** - Specialized card for displaying project information with progress indicators

### Form Components (`/forms`)

- **`CheckboxInput.tsx`** - Checkbox input with label and validation support
- **`ControlledTextInput.tsx`** - Text input component with comprehensive validation and styling
- **`DatePickerInput.tsx`** - Date selection component with cross-platform support
- **`DropdownInput.tsx`** - Dropdown selection with search and validation
- **`MultiSelectInput.tsx`** - Multi-selection component with chip display
- **`RadioGroupInput.tsx`** - Radio button group with horizontal/vertical layouts
- **`SwitchInput.tsx`** - Switch toggle component with description support

### Modal Components (`/modals`)

- **`EssentialInfoForm.tsx`** - ✅ **STANDARDIZED** - Project creation and essential information modal using BaseFormModal
- **`PeopleForm.tsx`** - ✅ **STANDARDIZED** - People and persona management modal using BaseFormModal
- **`PhotosForm.tsx`** - ✅ **STANDARDIZED** - Photo requirements and shot list management modal using BaseFormModal
- **`TimelineForm.tsx`** - ✅ **STANDARDIZED** - Timeline events management modal using BaseFormModal

### Navigation Components (`/navigation`)

- **`DeleteProjectModal.tsx`** - Project deletion confirmation modal
- **`ThemedMaterialTopTabs.tsx`** - Themed material design top tab navigation

### Component Organization

- **`FormModals.tsx`** - ✅ **UPDATED** - Centralized modal management with all standardized modals
- **`index.ts`** - Central export hub for all reusable components

### ✅ Recent Updates (BaseFormModal Standardization Complete)

**All modal components have been successfully migrated to use the standardized `BaseFormModal` pattern:**

1. **Consistent Modal Structure**: All modals now use `BaseFormModal` as wrapper
2. **Context-based Visibility**: Modal visibility managed through form contexts, not local state
3. **Standardized Props**: All modals accept `context` prop and use consistent title/subtitle pattern
4. **Unified Error Handling**: All modals use the same snackbar system via `BaseFormModal`
5. **Projects Screen Integration**: Updated to use context-based modal opening instead of manual state

**Migration Details:**
- `EssentialInfoFormModal` now uses `useForm1()` and `BaseFormModal`
- Removed custom modal wrapper and manual snackbar implementation
- Updated projects screen to use `ProjectFormProvider` and context-based modal opening
- All modals now have consistent open/close mechanisms via their respective contexts

## Key Improvements Made

### ✅ Standardized Component Architecture
- Implemented consistent prop interfaces across all components
- Added comprehensive TypeScript typing for all component props
- Established standard naming conventions and file organization
- Created reusable component patterns for common UI elements

### ✅ Form Component System
- Built comprehensive form input library with validation support
- Implemented consistent error handling and helper text patterns
- Added accessibility features (labels, ARIA attributes, screen reader support)
- Created standardized validation patterns using Zod schemas

### ✅ Modal Management System
- **COMPLETED STANDARDIZATION** - All form modals now use `BaseFormModal` pattern
- Centralized all form modals in `FormModals.tsx` for easy management
- Implemented consistent modal behavior and styling across all modals
- Added proper portal usage for modal rendering
- Created standardized modal interface patterns with context-based visibility
- **EssentialInfoForm migration completed** - Now follows same pattern as other modals

### ✅ Typography and Design System
- Established comprehensive typography scale following Material Design 3
- Created consistent spacing and theme usage patterns
- Implemented proper color scheme support (light/dark modes)
- Added standardized component sizing and variants

### ✅ Accessibility and UX
- Added proper ARIA labels and accessibility attributes
- Implemented keyboard navigation support
- Created consistent focus management
- Added proper loading and error states

## Usage Examples

### Basic UI Components

```typescript
// Typography usage
import { TitleText, BodyText, LabelText } from '@/components/ui/Typography';

const MyScreen = () => (
  <View>
    <TitleText size="large">Project Overview</TitleText>
    <BodyText size="medium">
      This is the main content area with detailed information.
    </BodyText>
    <LabelText size="small">Last updated: {date}</LabelText>
  </View>
);

// Custom Button usage
import { CustomButton } from '@/components/ui/CustomButton';

const ActionButtons = () => (
  <View>
    <CustomButton
      title="Primary Action"
      variant="primary"
      size="large"
      onPress={handlePrimaryAction}
      fullWidth
    />
    <CustomButton
      title="Secondary Action"
      variant="outline"
      icon="chevron-right"
      iconPosition="right"
      onPress={handleSecondaryAction}
    />
  </View>
);
```

### Form Components

```typescript
// Comprehensive form example
import {
  ControlledTextInput,
  DropdownInput,
  MultiSelectInput,
  CheckboxInput,
  DatePickerInput
} from '@/components/forms';

const ProjectForm = () => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  return (
    <ScrollView>
      <ControlledTextInput
        label="Project Name"
        value={formData.name}
        onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      
      <DropdownInput
        label="Project Type"
        value={formData.type}
        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
        options={[
          { label: 'Wedding', value: 'wedding' },
          { label: 'Portrait', value: 'portrait' },
          { label: 'Event', value: 'event' }
        ]}
        required
      />
      
      <MultiSelectInput
        label="Photography Styles"
        value={formData.styles}
        onValueChange={(value) => setFormData(prev => ({ ...prev, styles: value }))}
        options={styleOptions}
        maxSelections={3}
      />
      
      <DatePickerInput
        label="Event Date"
        value={formData.eventDate}
        onDateChange={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
      />
      
      <CheckboxInput
        label="Include engagement session"
        value={formData.includeEngagement}
        onValueChange={(value) => setFormData(prev => ({ ...prev, includeEngagement: value }))}
      />
    </ScrollView>
  );
};
```

### Card Components

```typescript
// Project card usage
import { ProjectCard } from '@/components/cards/ProjectCard';

const ProjectsList = ({ projects, onProjectPress, onProjectDelete }) => (
  <FlatList
    data={projects}
    renderItem={({ item }) => (
      <ProjectCard
        project={item}
        onPress={() => onProjectPress(item)}
        onDelete={() => onProjectDelete(item.id)}
        isActive={item.id === currentProjectId}
      />
    )}
    keyExtractor={(item) => item.id}
  />
);

// Custom card usage
import { CustomCard } from '@/components/cards/CustomCard';

const InfoCard = () => (
  <CustomCard
    title="Weather Information"
    subtitle="Today's forecast for your shoot"
    headerIcon="weather-partly-cloudy"
    showMenu
    onMenuPress={handleMenuPress}
    variant="outlined"
  >
    <WeatherContent />
  </CustomCard>
);
```

### Modal System

```typescript
// Using centralized modal system
import { FormModals, useTimelineModal, usePhotosModal } from '@/components/FormModals';

const DashboardScreen = () => {
  const { openModal: openTimelineModal } = useTimelineModal();
  const { openModal: openPhotosModal } = usePhotosModal();

  return (
    <Screen>
      <CustomButton
        title="Edit Timeline"
        onPress={() => openTimelineModal(currentProject)}
      />
      <CustomButton
        title="Edit Photos"
        onPress={() => openPhotosModal(currentProject)}
      />
      
      {/* All modals are rendered automatically */}
      <FormModals />
    </Screen>
  );
};
```

### Loading and Empty States

```typescript
// Loading state usage
import { LoadingState } from '@/components/ui/LoadingState';

const ProjectsScreen = () => {
  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  return <ProjectsList projects={projects} />;
};

// Empty state usage
import { EmptyState } from '@/components/ui/EmptyState';

const EmptyProjectsList = () => (
  <EmptyState
    icon="camera-plus"
    title="No Projects Yet"
    description="Create your first photography project to get started"
    actionTitle="Create Project"
    onAction={handleCreateProject}
  />
);
```

## Component Patterns

### Consistent Prop Interfaces

All components follow these standard patterns:

```typescript
interface BaseComponentProps {
  // Standard props
  style?: ViewStyle | TextStyle;
  testID?: string;
  disabled?: boolean;
  
  // Form-specific props (when applicable)
  error?: boolean;
  helperText?: string;
  required?: boolean;
  
  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

### Theme Integration

```typescript
// All components use consistent theme integration
import { useAppTheme } from '@/constants/theme';

const MyComponent = () => {
  const theme = useAppTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    }
  });
  
  return <View style={styles.container} />;
};
```

### Validation Patterns

```typescript
// Standard validation pattern for form components
interface FormComponentProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  validation?: z.ZodSchema;
}

const FormComponent: React.FC<FormComponentProps> = ({
  value,
  onValueChange,
  error,
  helperText,
  validation
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    
    if (validation) {
      const result = validation.safeParse(newValue);
      setInternalError(result.success ? null : result.error.errors[0]?.message);
    }
  };
  
  const displayError = error || !!internalError;
  const displayHelperText = helperText || internalError;
  
  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      error={displayError}
      helperText={displayHelperText}
    />
  );
};
```

## Accessibility Guidelines

### Standard Accessibility Features

All components implement:

1. **Proper ARIA labels and roles**
2. **Keyboard navigation support**
3. **Screen reader compatibility**
4. **Focus management**
5. **High contrast support**

### Example Implementation

```typescript
const AccessibleButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  testID,
  accessibilityLabel,
  accessibilityHint
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    testID={testID}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel || title}
    accessibilityHint={accessibilityHint}
    accessibilityState={{ disabled }}
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);
```

## Testing Patterns

### Component Testing Utilities

```typescript
// Test utilities for components
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'react-native-paper';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );
};

// Example test
describe('CustomButton', () => {
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

## Migration Guide

### Updating Legacy Components

#### Before
```typescript
// Old inconsistent component
const OldButton = ({ text, onPress, type }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={type === 'primary' ? primaryStyle : secondaryStyle}
  >
    <Text>{text}</Text>
  </TouchableOpacity>
);
```

#### After
```typescript
// New standardized component
import { CustomButton } from '@/components/ui/CustomButton';

const NewButton = ({ title, onPress, variant = 'primary' }) => (
  <CustomButton
    title={title}
    onPress={onPress}
    variant={variant}
    testID="my-button"
    accessibilityLabel={`${title} button`}
  />
);
```

## Component Guidelines

### 1. Consistent Interface Design
- Use standard prop naming conventions
- Implement proper TypeScript interfaces
- Add comprehensive JSDoc documentation
- Include accessibility props

### 2. Theme Integration
- Always use theme colors and spacing
- Support both light and dark modes
- Use consistent font scales and weights
- Implement proper contrast ratios

### 3. Validation and Error Handling
- Provide clear error messages
- Support field-level validation
- Implement proper loading states
- Handle edge cases gracefully

### 4. Performance Optimization
- Use React.memo for expensive components
- Implement proper prop dependency checking
- Avoid unnecessary re-renders
- Optimize list rendering with proper keys

### 5. Testing Requirements
- Write unit tests for all components
- Test accessibility features
- Include integration tests for complex components
- Maintain high test coverage

## Contributing

When adding new components:

1. **Follow Established Patterns**: Use existing components as templates
2. **TypeScript First**: Implement proper typing and interfaces
3. **Accessibility**: Include ARIA attributes and keyboard support
4. **Testing**: Write comprehensive tests for new components
5. **Documentation**: Update this README and add JSDoc comments
6. **Theme Integration**: Use theme colors, spacing, and typography
7. **Performance**: Consider memoization and optimization needs

## Component Checklist

Before submitting a new component:

- [ ] Proper TypeScript interfaces
- [ ] Theme integration (colors, spacing, typography)
- [ ] Accessibility attributes (ARIA, roles, labels)
- [ ] Error handling and validation support
- [ ] Loading states where applicable
- [ ] Responsive design considerations
- [ ] Unit tests with good coverage
- [ ] JSDoc documentation
- [ ] Example usage in README
- [ ] Cross-platform compatibility (iOS/Android)

## Best Practices

### Component Architecture
```typescript
// Preferred component structure
interface ComponentProps {
  // Props interface with proper types
}

export const Component: React.FC<ComponentProps> = React.memo(({
  // Destructured props with defaults
}) => {
  // Component logic
  
  return (
    // JSX with proper accessibility and styling
  );
});

Component.displayName = 'Component';
```

### Performance Optimization
```typescript
// Use React.memo for components that receive stable props
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);
  
  return <View>{processedData}</View>;
});

// Use proper dependency arrays
const MemoizedCallback = useCallback(() => {
  // callback logic
}, [dependency1, dependency2]);
```

### Error Boundaries
```typescript
// Implement error boundaries for complex components
const ComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};
``` 