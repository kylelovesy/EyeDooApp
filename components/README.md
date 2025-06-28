# EyeDooApp Components Documentation

## Overview

This directory contains all reusable React components for the EyeDooApp photography project management application. The component system has been designed with consistency, accessibility, and type safety in mind, providing a comprehensive design system for the entire application.

## Structure

### UI Components (`/ui`)
- **`BaseFormModal.tsx`**: A foundational, unstyled modal component that uses absolute positioning to avoid stacking context issues with overlays like dropdowns.
- **`CustomButton.tsx`**: A versatile button component with multiple variants (`primary`, `secondary`, `outline`), sizes, and icon support.
- **`CustomDropdown.tsx`**: A dropdown selection component that renders its options in an absolutely positioned view to ensure visibility.
- **`EmptyState.tsx`**: A component for displaying empty states with an icon, title, description, and an optional action button.
- **`FormModal.tsx`**: A standardized, styled modal for forms that wraps `BaseFormModal` and integrates with the `useBaseFormContext` pattern for state and submission handling.
- **`LoadingState.tsx`**: A loading indicator component with an optional overlay for blocking UI interactions.
- **`RepeatableSection.tsx`**: A component for dynamically managing lists of items with "add" and "remove" functionality.
- **`Screen.tsx`**: A base screen wrapper providing consistent padding, safe area handling, and scrollability.
- **`TagInput.tsx`**: A custom input for selecting and creating tags, with suggestions and a chip-based display for selected items.
- **`Toast.tsx`**: A toast notification system with a `useToast` hook for easy implementation of success, error, warning, and info messages.
- **`Typography.tsx`**: A comprehensive typography system with standardized text components (`DisplayText`, `HeadlineText`, `TitleText`, etc.).

### Card Components (`/cards`)
- **`CustomCard.tsx`**: A general-purpose card with support for a header, content, icons, and menu actions.
- **`NextTimelineEventCard.tsx`**: A specialized card to display the current or next upcoming event from a timeline, with a countdown.
- **`ProjectCard.tsx`**: A detailed card for displaying project information, including client names, dates, and progress indicators.
- **`TimelineListItemCard.tsx`**: A component for rendering a single event within a timeline view.
- **`VendorCard.tsx`**: A card for displaying vendor contact information with edit and delete actions.

### Form Components (`/forms`)
A library of controlled input components with consistent styling and validation support.
- **`CheckboxInput.tsx`**, **`ControlledTextInput.tsx`**, **`DatePickerInput.tsx`**, **`DropdownInput.tsx`**, **`MultiSelectInput.tsx`**, **`RadioGroupInput.tsx`**, **`SwitchInput.tsx`**

### Modal Components (`/modals`)
These are the primary, user-facing modal forms. They are built using `FormModal` and integrated with their respective contexts for a standardized user experience.
- **`EssentialInfoForm.tsx`**: Project creation and essential information modal.
- **`PeopleForm.tsx`**: People and persona management modal.
- **`PhotosForm.tsx`**: Photo requirements and shot list management modal.
- **`QRCodeScanner.tsx`**: A full-screen modal that uses the device camera to scan and parse QR codes for vendor information.
- **`TagForm.tsx`**: A modal form for creating or editing tags.
- **`VendorForm.tsx`**: A comprehensive modal for adding or editing vendor details.

### Navigation Components (`/navigation`)
- **`DashboardAppbar.tsx`**: A dynamic `Appbar` for the dashboard screens, featuring a title, back button, and dynamic action icons for sub-page navigation.
- **`DeleteProjectModal.tsx`**: (Currently empty). Intended for project deletion confirmation.
- **`ThemedMaterialTopTabs.tsx`**: A themed Material Design top-tab navigator for creating tabbed layouts.

### Timeline Components (`/timeline`)
- **`AccordionForm.tsx`**: The underlying animated accordion used within the `TimelineEventForm`.
- **`EventTypeDropdown.tsx`**: A specialized dropdown for selecting from predefined event types with icons.
- **`TimelineEventForm.tsx`**: The complete form for adding or editing timeline events, designed to be used within a modal.

### Data Import Components (`/import`)
- **`DataImportComponent.tsx`**: A component that handles the logic for picking and parsing JSON files for data import.
- **`DataImportModal.tsx`**: A basic modal that wraps the `DataImportComponent` to update project data.
- **`EnhancedDataImportModal.tsx`**: An advanced version of the import modal with features like merge strategies and data backup.

### View Components (`/views`)
- **`EnhancedTimelineView.tsx`**: A component that visualizes a series of timeline events in a vertical, chronological list with status indicators.

### Component Organization
- **`FormModals.tsx`**: Centralizes the rendering of all primary form modals and exports their respective context hooks for easy access (`useTimelineModal`, `usePhotosModal`, etc.).
- **`index.ts`**: The central export hub for all reusable components, simplifying imports across the application.

## ✅ **MAJOR MILESTONE: Component Standardization Complete**

**All primary form modals have been successfully migrated to use the standardized `FormModal` and `BaseFormContext` patterns.**

- **Consistent Modal Structure**: All modals share a consistent look and feel.
- **Context-based Visibility**: Modal visibility is now managed through form contexts, eliminating local state management for modals.
- **Standardized Props**: All modals accept a `context` prop and use a consistent interface.
- **Unified Error Handling**: All modals use the same snackbar system via their context.

## Key Improvements Made

- **✅ Standardized Component Architecture**: Consistent prop interfaces, TypeScript typing, and naming conventions.
- **✅ Robust Form Component System**: A comprehensive library of form inputs with built-in validation support and accessibility features.
- **✅ Standardized Modal Management**: All form modals are now centralized, standardized, and controlled via context.
- **✅ Unified Design System**: A complete typography scale and consistent theme usage for colors and spacing.
- **✅ Accessibility and UX**: All components are designed with ARIA labels, keyboard navigation, and clear loading/error states in mind.

## Usage Examples

### Basic UI Components

```typescript
// Typography usage
import { TitleText, BodyText } from '@/components/ui/Typography';

const MyScreen = () => (
  <View>
    <TitleText size="large">Project Overview</TitleText>
    <BodyText>This is the main content area.</BodyText>
  </View>
);
```

### Form Components

```typescript
// Form example
import { ControlledTextInput, DatePickerInput } from '@/components/forms';

const ProjectForm = ({ formData, setFormData, errors }) => (
  <View>
    <ControlledTextInput
      label="Project Name"
      value={formData.name}
      onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
      error={!!errors.name}
      helperText={errors.name}
      required
    />
    <DatePickerInput
      label="Event Date"
      value={formData.eventDate}
      onDateChange={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
    />
  </View>
);
```

### Modal System

The modal system is designed for simplicity. All modals are rendered centrally, and you only need to call the appropriate context hook to open one.

```typescript
// Using the centralized modal system from any screen within the context's provider
import { useTimelineModal } from '@/components/FormModals';

const DashboardScreen = () => {
  const { openModal: openTimelineModal } = useTimelineModal();
  const { currentProject } = useProjects(); // Assuming you get the project from here

  return (
    <Screen>
      <CustomButton
        title="Edit Timeline"
        onPress={() => openTimelineModal(currentProject)}
      />
      {/* 
        You DO NOT need to render the modal component here.
        <FormModals /> is rendered once in the main layout (e.g., app/(app)/dashboard/_layout.tsx).
      */}
    </Screen>
  );
};
```

## Component Guidelines

- **Consistency**: Use standard prop naming conventions and TypeScript interfaces.
- **Theming**: Always use theme colors, spacing, and typography. Support light and dark modes.
- **Validation**: Provide clear error states and messages for form components.
- **Performance**: Use `React.memo` for expensive components and optimize list rendering.
- **Testing**: Write unit tests for all components, especially for user interactions and accessibility.
- **Accessibility**: Include ARIA attributes, keyboard support, and proper focus management.

## Contributing

When adding new components:
1.  **Follow Patterns**: Use existing components as a template.
2.  **TypeScript First**: Implement proper typing and interfaces.
3.  **Document**: Update this README and add JSDoc comments.
4.  **Theme**: Integrate with the existing theme for colors, spacing, and typography.
5.  **Test**: Write comprehensive tests.