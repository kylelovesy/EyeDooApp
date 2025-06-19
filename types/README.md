# EyeDooApp Types Documentation

## Overview

This directory contains all TypeScript type definitions for the EyeDooApp photography project management application. The type system has been standardized to ensure consistency and type safety across the entire application.

## Structure

### Core Files

- **`index.ts`** - Central export hub for all types
- **`enum.ts`** - All application enums with consistent naming
- **`user.ts`** - Complete user type definitions with Zod schemas
- **`auth.ts`** - Authentication-related types and interfaces
- **`reusableSchemas.ts`** - Zod validation schemas used across forms

### Project Types

- **`project.ts`** - Main project type exports
- **`projectSchema.ts`** - Combined project schema with validation
- **`project-EssentialInfoSchema.ts`** - Form 1: Essential project information
- **`project-TimelineSchema.ts`** - Form 2: Timeline events
- **`project-PersonaSchema.ts`** - Form 3: People involved in projects
- **`project-PhotosSchema.ts`** - Form 4: Photo requirements

### Utility Types

- **`notes.ts`** - Private notes schema
- **`shotlist.ts`** - Shot checklist types

## Key Improvements Made

### ✅ Standardized Project Schema
- Consolidated all project-related types into a single, consistent schema
- Removed duplicate and conflicting type definitions
- Added comprehensive validation with Zod schemas
- Ensured all form data has consistent defaults

### ✅ Consistent Enum Usage
- Reorganized enums with clear categorization
- Added missing enums (IMPORTANCE_LEVELS, CONTACT_TYPES, etc.)
- Improved documentation and type safety
- Standardized naming conventions

### ✅ Updated User Object Type Definition
- Created comprehensive user schema with preferences and subscription management
- Added user preferences and settings
- Included subscription management types
- Removed duplicate definitions between auth.ts and user.ts

### ✅ Removed Legacy Code
- Deleted `reusableInterfaces.ts` (replaced with Zod schemas)
- Cleaned up commented-out legacy implementations
- Consolidated duplicate type definitions

## Usage Examples

### Importing Types

```typescript
// Import from the main index
import { 
  Project, 
  User, 
  CreateProjectInput,
  ProjectStatus 
} from '@/types';

// Import specific schemas for validation
import { 
  ProjectSchema,
  UserSchema,
  form1EssentialInfoSchema 
} from '@/types';
```

### Using Project Types

```typescript
// Creating a new project
const newProject: CreateProjectInput = {
  userId: 'user123',
  form1: {
    name: 'Smith Wedding',
    type: ProjectType.WEDDING,
    status: ProjectStatus.DRAFT,
    personA: { /* ... */ },
    personB: { /* ... */ },
    eventDate: timestamp,
    locations: [/* ... */],
    // ...
  },
  form2: { events: [] },
  form3: { /* ... */ },
  form4: { /* ... */ }
};

// Validating project data
const validation = ProjectSchema.safeParse(projectData);
if (validation.success) {
  // Data is valid
  const project: Project = validation.data;
}
```

### Using User Types

```typescript
// Creating a user profile
const userProfile: CreateUser = {
  email: 'photographer@example.com',
  displayName: 'John Smith',
  phone: '+1234567890',
  preferences: {
    notifications: true,
    darkMode: false,
    language: LanguageOption.ENGLISH,
    weatherUnits: WeatherUnit.METRIC
  },
  subscription: {
    plan: SubscriptionPlan.FREE,
    isActive: true
  }
};

// Updating user preferences
const updatePreferences: Partial<UserPreferences> = {
  darkMode: true,
  language: LanguageOption.SPANISH
};
```

### Using Enums

```typescript
import { PROJECT_STATUS, ProjectStatus, EVENT_STYLES, EventStyle } from '@/types';

// Type-safe enum usage with TypeScript enums
const status: ProjectStatus = ProjectStatus.ACTIVE;
const validStatuses = PROJECT_STATUS; // ['Draft', 'Active', 'Completed', 'Cancelled']

// Form validation
const eventStyle: EventStyle = EVENT_STYLES.includes(userInput) ? userInput : EventStyle.OTHER;
```

## Validation Patterns

### Form Validation

```typescript
import { form1EssentialInfoSchema } from '@/types';

const validateForm1 = (data: unknown) => {
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

### API Response Validation

```typescript
import { ApiResponse, ValidationResult } from '@/types';

const validateApiResponse = <T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): ValidationResult<T> => {
  const result = schema.safeParse(data);
  
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error.errors.map(e => e.message)
  };
};
```

## Migration Guide

If you're updating existing code to use the new type system:

### Before
```typescript
// Old inconsistent imports
import { User } from '@/types/auth';
import { PersonInfo } from '@/types/reusableInterfaces';
import { PROJECT_STATUS } from '@/types/enum';
```

### After
```typescript
// New standardized imports
import { User, PersonInfoSchema, PROJECT_STATUS } from '@/types';
```

### Schema Updates

1. Replace interface usage with Zod schemas for validation
2. Update enum imports to use the standardized exports
3. Use the new project schema structure with nested form data
4. Update user types to use the comprehensive user schema

## Type Safety Guidelines

1. **Always use Zod schemas for API validation**
2. **Prefer enums over string literals**
3. **Use the centralized index.ts for imports**
4. **Validate external data before using it**
5. **Use TypeScript strict mode**

## Contributing

When adding new types:

1. Add enums to `enum.ts` with proper categorization
2. Create Zod schemas for validation
3. Export types through `index.ts`
4. Add documentation and examples
5. Ensure consistency with existing patterns 