# EyeDooApp Contexts Documentation

## Overview

This directory contains all React Context implementations for the EyeDooApp photography project management application. The context system has been standardized to ensure consistency, type safety, and maintainability across all form and data management providers.

## Structure

### Core Context Files

- **`AuthContext.tsx`** - User authentication and profile management.
- **`ProjectContext.tsx`** - Main project data management with CRUD operations.
- **`ThemeContext.tsx`** - Manages the application's light and dark themes.
- **`useBaseFormContext.ts`** - Standardized base context hook for all form contexts.

### Form Context Files

- **`Form1EssentialInfoContext.tsx`** - ✅ **STANDARDIZED** - Essential project information form management.
- **`TimelineContext.tsx`** - ✅ **STANDARDIZED** - Timeline events form management.
- **`Form3PersonaContext.tsx`** - ✅ **STANDARDIZED** - People and persona form management.  
- **`Form4PhotosContext.tsx`** - ✅ **STANDARDIZED** - Photo requirements form management.

### Provider Management

- **`ProviderWrappers.tsx`** - HOCs and compound components for clean provider composition.

## Key Improvements Made

### ✅ Standardized Base Context Pattern
- Created `useBaseFormContext` hook with a consistent interface for all form contexts.
- Unified modal management, form validation, and error handling patterns.
- Added proper TypeScript generics for type safety across all form types.
- Implemented a consistent snackbar notification system.

### ✅ Provider Wrapper System
- Created HOCs for flexible provider composition (`withProjectProvider`, `withAllFormProviders`, etc.).
- Added compound components pattern (`FormProviders.All`, `FormProviders.Dashboard`, etc.).
- Simplified app layout from 35+ lines of nested providers to just a few lines.
- Enabled targeted provider usage for specific screen requirements.

### ✅ Consistent Modal Integration
- Standardized modal visibility management across all form contexts.
- Added proper form submission and validation patterns.
- Implemented consistent error handling and success messaging.
- Created a unified interface for modal operations.

### ✅ Form Context Standardization - **COMPLETED**
- **ALL FORM CONTEXTS MIGRATED** - All 4 form contexts now use `useBaseFormContext`.
- Added consistent validation using Zod schemas across all forms.
- Implemented proper project update functionality in all contexts.
- Added backward compatibility with legacy naming conventions.
- **EssentialInfo Context Integration** - Form1 now fully integrated with the BaseFormModal pattern.

## ✅ **STANDARDIZATION COMPLETED - ALL CONTEXTS UNIFIED**

**As of the latest update, all form contexts have been successfully standardized:**

### Context Standardization Status:
- ✅ **Form1EssentialInfoContext** - COMPLETED - Now uses `useBaseFormContext` and `BaseFormModal`.
- ✅ **TimelineContext** - COMPLETED - Standardized pattern with modal integration and custom event handling.
- ✅ **Form3PersonaContext** - COMPLETED - Unified with base context pattern.
- ✅ **Form4PhotosContext** - COMPLETED - Full standardization with custom shot management functions.

### Modal Integration Status:
- ✅ **All modals use BaseFormModal** - Consistent UI and behavior across all forms.
- ✅ **Context-based visibility** - No more manual modal state management.
- ✅ **Unified error handling** - Consistent snackbar system across all modals.
- ✅ **Centralized modal management** - All modals managed through `FormModals.tsx`.

### Provider Integration Status:
- ✅ **Projects screen updated** - Now uses context-based modal opening.
- ✅ **Provider wrappers enhanced** - Support for all standardized contexts.
- ✅ **App layout simplified** - Clean provider composition patterns.

**This marks the completion of the major context and modal standardization effort!**

## Usage Examples

### Basic Form Context Usage

```typescript
// Using a standardized form context
import { useTimelineContext } from '@/contexts/TimelineContext';

const TimelineScreen = () => {
  const {
    formData,
    setFormData,
    isModalVisible,
    openModal,
    closeModal,
    handleSubmit,
    isValid,
    errors,
    // Custom functions from TimelineContext
    addEvent,
    removeEvent,
  } = useTimelineContext();
  
  const handleEditTimeline = (project: Project) => {
    openModal(project); // Opens modal with project data pre-filled
  };
  
  return (
    <View>
      <Button onPress={() => openModal()}>Add Timeline</Button>
      <Button onPress={() => handleEditTimeline(currentProject)}>Edit Timeline</Button>
    </View>
  );
};
```

### Provider Wrapper Usage

```typescript
// App layout with all form providers
import { FormProviders } from '@/contexts/ProviderWrappers';

export default function AppLayout() {
  return (
    <FormProviders.All>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="projects" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </FormProviders.All>
  );
}

// Screen that only needs specific providers
import { withTimelineProvider } from '@/contexts/ProviderWrappers';

const TimelineScreen = withTimelineProvider(() => {
  const { openModal } = useTimelineContext();
  return <TimelineContent />;
});
```

### Project Context Usage

```typescript
import { useProjects } from '@/contexts/ProjectContext';

const ProjectsScreen = () => {
  const { 
    projects, 
    currentProject, 
    createProject, 
    updateProject, 
    deleteProject,
    isLoading 
  } = useProjects();
  
  const handleCreateProject = async (projectData: CreateProjectInput) => {
    try {
      const newProject = await createProject(projectData);
      console.log('Project created:', newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };
  
  return (
    <ProjectList 
      projects={projects}
      onCreateProject={handleCreateProject}
      loading={isLoading}
    />
  );
};
```

### Custom Context Extension

```typescript
// Extending base form context for specific functionality (example from Form4PhotosContext)
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';
import { v4 as uuidv4 } from 'uuid';

interface ExtendedContextType extends BaseFormContextType<MyFormData> {
  addShot: (shotType: keyof MyFormData) => void;
}

export const useExtendedForm = (): ExtendedContextType => {
  const baseContext = useBaseFormContext(
    myFormSchema,
    'formKey',
    initialData,
    { successMessage: 'Success!' }
  );
  
  const addShot = (shotType: keyof MyFormData) => {
    const newShot = { id: uuidv4(), /* ... other properties */ };
    baseContext.setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [shotType]: [...(prev[shotType] as any[] || []), newShot]
      };
    });
  };
  
  return {
    ...baseContext,
    addShot,
  };
};
```

## Provider Composition Patterns

### Available Provider Combinations

```typescript
// All form providers (for screens that need full editing capabilities)
<FormProviders.All>
  {children}
</FormProviders.All>

// Dashboard providers (for screens that need editing but not creation)
<FormProviders.Dashboard>
  {children}
</FormProviders.Dashboard>

// Essential only (for screens that only need project creation)
<FormProviders.Essential>
  {children}
</FormProviders.Essential>

// Project only (for screens that only need project data)
<FormProviders.Project>
  {children}
</FormProviders.Project>
```

### Custom Provider Composition

```typescript
import { composeProviders } from '@/contexts/ProviderWrappers';
import { TimelineProvider } from '@/contexts/TimelineContext';
import { Form4PhotosProvider } from '@/contexts/Form4PhotosContext';
import { ProjectProvider } from '@/contexts/ProjectContext';

const CustomProviders = composeProviders(
  ProjectProvider,
  TimelineProvider,
  Form4PhotosProvider
);

// Usage
<CustomProviders>
  <MyScreen />
</CustomProviders>
```

## Context Interface Standards

### Base Form Context Interface

All form contexts implement this standardized interface from `useBaseFormContext`:

```typescript
interface BaseFormContextType<T> {
  // Modal Management
  isModalVisible: boolean;
  openModal: (project?: Project) => void;
  closeModal: () => void;
  
  // Form Data
  formData: T | null;
  setFormData: React.Dispatch<React.SetStateAction<T | null>>;
  
  // Submission
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  
  // Error & Success Handling
  errors: z.ZodFormattedError<T> | null;
  snackbar: { visible: boolean; message: string; type: 'success' | 'error' };
  hideSnackbar: () => void;
  showSnackbar: (message: string, type: 'success' | 'error') => void;
  
  // Validation
  isValid: boolean;
}
```

## Migration Guide

### Migrating Legacy Context to New Pattern

#### Before
```typescript
// Old inconsistent pattern
const LegacyFormContext = createContext<LegacyFormContextType | undefined>(undefined);

export const LegacyFormProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Custom validation logic...
  // Custom error handling...
  
  return (
    <LegacyFormContext.Provider value={value}>
      {children}
    </LegacyFormContext.Provider>
  );
};
```

#### After
```typescript
// New standardized pattern
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type FormContextType = BaseFormContextType<FormData>;

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const context = useBaseFormContext(
    formSchema,
    'formKey',
    initialData,
    {
      successMessage: 'Updated successfully!',
      errorMessage: 'Failed to update. Please try again.'
    }
  );

  return (
    <FormContext.Provider value={context}>
      {children}
    </FormContext.Provider>
  );
};
```

## Context Guidelines

### 1. Always Use Base Context for Forms
- Extend `useBaseFormContext` for all form-related contexts.
- Maintain a consistent interface across all form contexts.
- Add custom functionality through composition, not by replacing base functionality.

### 2. Provider Organization
- Use the appropriate provider wrappers (`FormProviders.All`, `FormProviders.Dashboard`) for different screen needs.
- Prefer compound components over HOCs for app-level providers.
- Keep provider nesting as shallow as possible.

### 3. Type Safety
- Always provide proper TypeScript types for context values.
- Use Zod schemas for form validation.
- Consider implementing error boundaries for context providers.

### 4. Error Handling
- Use the standardized snackbar for user notifications.
- Implement consistent error messaging.
- Provide fallback states for loading and error conditions.

### 5. Performance Considerations
- Use `useMemo` and `useCallback` for expensive operations.
- Implement proper dependency arrays in hooks.
- Consider context splitting for large-scale applications if performance becomes an issue.

## Contributing

When adding new contexts:

1. **Form Contexts**: Extend `useBaseFormContext` and follow the established patterns seen in `Form3PersonaContext.tsx` or `Form4PhotosContext.tsx`.
2. **Provider Wrappers**: Add new combinations to `ProviderWrappers.tsx` if needed.
3. **Documentation**: Update this README with new patterns and examples.
4. **Type Safety**: Ensure all contexts have proper TypeScript interfaces and use Zod for validation.
5. **Testing**: Add unit tests for any custom context logic.
6. **Backward Compatibility**: Maintain legacy export names where appropriate for a smoother transition.

## Best Practices

### Context Performance
- Split contexts by concern (auth, projects, forms).
- Use multiple smaller contexts instead of one large monolithic context.
- Implement proper memoization for context values using `useMemo` and `useCallback`.

### Error Boundaries
```typescript
// Implement error boundaries for critical context providers
import ErrorBoundary from 'your-error-boundary-library';

const ContextErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};
```

### Testing Contexts
```typescript
// Create test utilities for context testing
import { render } from '@testing-library/react-native';
import { FormProviders } from '@/contexts/ProviderWrappers';

export const renderWithContexts = (ui: React.ReactElement) => {
  return render(
    <FormProviders.All>
      {ui}
    </FormProviders.All>
  );
};
``` 