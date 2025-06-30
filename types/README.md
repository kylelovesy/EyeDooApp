# EyeDooApp Types Documentation

## Overview

This directory contains all TypeScript type definitions for the EyeDooApp photography project management application. The type system has been standardized using Zod to ensure consistency and type safety across the entire application.

## Structure

### Core Files

- **`index.ts`**: The central export hub for all types, schemas, and enums.
- **`enum.ts`**: Contains all application-wide enums (e.g., `ProjectStatus`, `ImportanceLevel`).
- **`user.ts`**: Defines the comprehensive `User` schema, including preferences and subscriptions.
- **`auth.ts`**: Contains authentication-related context types and form data interfaces.
- **`reusableSchemas.ts`**: A critical file containing common Zod schemas (`PersonInfoSchema`, `LocationInfoSchema`, `FirestoreTimestampSchema`) used across multiple forms and types.

### Project Types

- **`project.ts`**: Exports the main `Project`, `CreateProjectInput`, and `UpdateProjectInput` types.
- **`projectSchema.ts`**: Defines the master `ProjectSchema` that combines all form data schemas into one unified structure.
- **`project-EssentialInfoSchema.ts`**: Schema for "Form 1: Essential project information".
- **`project-PersonaSchema.ts`**: Schema for "Form 3: People and persona".
- **`project-PhotosSchema.ts`**: Schema for "Form 4: Photo requirements".

### Feature-Specific Types

- **`timeline.ts`**: Defines the Zod schema and types for timeline events.
- **`notes.ts`**: Schema and types for private project notes.
- **`shotlist.ts`**: Schema and types for project shot checklists.
- **`vendors.ts`**: Schema and types for vendor contacts.
- **`tag.ts`**: Schema and type for tags used in photo organization.
- **`photoTagLink.ts`**: Schema for the link between a photo and its tags.

### Utility & Configuration Types

- **`navigation.ts` & `navigation.d.ts`**: Type definitions for React Navigation stacks and parameters.
- **`svg.d.ts`**: TypeScript declaration for importing SVG files as React components.

## Key Improvements Made

### ✅ Standardized Project Schema
- Consolidated all project-related types into a single, consistent schema (`projectSchema.ts`).
- Removed duplicate and conflicting type definitions.
- Added comprehensive validation with Zod schemas.
- Ensured all form data objects have consistent defaults (e.g., empty arrays).

### ✅ Consistent Enum Usage
- Reorganized all enums into `enum.ts` with clear categorization.
- Added missing enums (`ImportanceLevel`, `ContactType`, etc.).
- Standardized naming conventions and exported array versions for dropdowns.

### ✅ Zod-Powered Timestamp Handling
- Implemented a custom Zod preprocessor in `reusableSchemas.ts` (`FirestoreTimestampSchema`) that automatically converts Firestore `Timestamp` objects, Date objects, and ISO strings into consistent JavaScript `Date` objects during validation, eliminating conversion logic from services.

### ✅ Reusable Schemas
- Created a set of reusable schemas in `reusableSchemas.ts` for common data structures like `PersonInfoSchema`, `LocationInfoSchema`, and `PhoneSchema`, ensuring consistency across all forms.

## Usage Examples

### Importing Types

```typescript
// Import from the main index.ts for easy access
import { 
  Project, 
  User, 
  CreateProjectInput,
  ProjectStatus,
  // You can also import schemas for validation
  ProjectSchema,
  UserSchema,
} from '@/types';
```

### Using Project Types

```typescript
// Creating a new project requires the CreateProjectInput type
const newProject: CreateProjectInput = {
  form1: {
    projectName: 'Smith Wedding',
    projectType: ProjectType.WEDDING,
    projectStatus: ProjectStatus.DRAFT,
    personA: { /* ... */ },
    personB: { /* ... */ },
    eventDate: new Date(), // Use a JS Date object
    locations: [/* ... */],
  },
  timeline: { events: [] },
  form3: { /* ... */ },
  form4: { /* ... */ }
};

// Use the master schema to validate the entire project object
const validation = ProjectSchema.safeParse(projectDataFromFirestore);
if (validation.success) {
  // Data is valid, and you get a fully typed Project object
  const project: Project = validation.data;
}
```

### Using User Types

```typescript
// Use the User schema for validation
const validationResult = UserSchema.safeParse(userDataFromFirestore);

if (validationResult.success) {
    const user: User = validationResult.data;
    console.log(user.preferences.language); // Type-safe access
}

// Updating user preferences requires a partial type
const updatedPrefs: Partial<UserPreferences> = {
  darkMode: true,
  language: LanguageOption.SPANISH
};
```

### Using Enums

```typescript
import { PROJECT_STATUS, ProjectStatus, EVENT_STYLES, EventStyle } from '@/types';

// Use the enum for type safety
const status: ProjectStatus = ProjectStatus.ACTIVE;

// Use the exported array for populating UI elements like dropdowns
const validStatuses = PROJECT_STATUS; // ['Draft', 'Active', 'Completed', 'Cancelled']

// Validate user input against the array of enum values
const eventStyle: EventStyle = EVENT_STYLES.includes(userInput) ? userInput : EventStyle.OTHER;
```

## Validation Patterns

All data validation should be performed using the exported Zod schemas.

### Form Validation
```typescript
import { form1EssentialInfoSchema } from '@/types/project-EssentialInfoSchema';
import { ValidationResult } from '@/types';

type Form1Data = z.infer<typeof form1EssentialInfoSchema>;

const validateForm1 = (data: unknown): ValidationResult<Form1Data> => {
  const result = form1EssentialInfoSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(err => err.message)
    };
  }
  
  return {
    success: true,
    data: result.data
  };
};
```

## Migration Guide

If you're updating existing code to use the new type system:

- **Replace Interface Usage**: Swap any legacy TypeScript `interface` definitions with types inferred from Zod schemas (`type MyType = z.infer<typeof MySchema>`).
- **Standardize Imports**: Import all types, enums, and schemas from the central `types/index.ts`.
- **Update Project Structure**: Ensure you are using the new nested project schema (e.g., `project.form1.projectName` instead of `project.projectName`).
- **Remove Manual Timestamp Conversion**: Rely on Zod schema parsing to handle `Timestamp` to `Date` conversions.

## Contributing

When adding new types:

1.  Add any new enums to `enum.ts` with proper categorization.
2.  Create new Zod schemas in the appropriate file (`reusableSchemas.ts` for common types, or a new file for a new feature).
3.  Export the new schemas and their inferred types through `index.ts`.
4.  Update this `README.md` to document the new types.
5.  Ensure consistency with existing patterns, especially for validation messages and default values. 