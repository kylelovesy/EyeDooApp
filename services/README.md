# EyeDooApp Services Documentation 🔧

This directory contains all backend service integrations and data management logic for the EyeDooApp photography project management application.

## ✅ **MAJOR MILESTONE: Service Layer Standardization COMPLETED**

**All service layer components have been successfully standardized!** This represents a critical infrastructure improvement that provides:

- **Comprehensive Input Validation**: All service methods validate inputs using Zod schemas.
- **Standardized Error Handling**: Consistent error creation, logging, and user feedback.
- **Unified Timestamp Management**: Standardized Firebase timestamp conversion across all services.
- **Type Safety**: Full TypeScript integration with schema-generated types.
- **Configuration Management**: Centralized API configuration with validation.
- **Service Organization**: Clean separation of concerns and consistent patterns.

## Service Layer Architecture

### Core Services

#### 🔥 **Firebase Integration**
- **`firebase.ts`** - Core Firebase configuration and initialization for Expo, with platform-specific auth persistence (React Native AsyncStorage) and comprehensive config validation.

#### 👤 **Authentication Service**
- **`authService.ts`** - Manages user authentication, profile creation in Firestore, and profile image uploads with Firebase Storage. Handles errors with user-friendly messages.

#### 📋 **Project Management Service**
- **`projectServices.ts`** - Full CRUD operations for projects, featuring real-time subscriptions with `onSnapshot`, Zod validation, and comprehensive timestamp conversion.

#### 📂 **Data Import Service**
- **`dataImportService.ts`** - Handles importing timeline and photo data into projects from external sources, with options for merging or replacing existing data.

#### 📆 **Timeline Service**
- **`timelineService.ts`** - Manages timeline events for projects, which are stored as a sub-collection in Firestore.

#### 📝 **Private Notes Service**
- **`privateNotesService.ts`** - Manages private project notes with full CRUD operations, search, and standardized validation.

#### 🎬 **Shot Checklist Service**
- **`shotChecklistService.ts`** - Manages shot lists and checklists for projects.

#### 🌤️ **Weather Service**
- **`weatherService.ts`** - Integrates with the OpenWeatherMap API for location-based weather fetching, including configuration management and error handling.

#### 📸 **Local Photo-Tagging Service**
- **`photoTagLinkService.ts`** - Manages links between photos and tags using the local device file system via `expo-file-system`. Includes CRUD and cleanup functions.

---

### Mock & Deprecated Services

- **`tagService.ts` / `vendorService.ts`**: These are **mock services** that simulate an API for managing tags and vendors, respectively. They are intended for development and will be replaced by a full backend implementation.
- **`kitChecklistService.ts`**: This service is **deprecated and inactive**, with all code commented out.

### 📋 **Validation Schemas (`/schemas`)**

A comprehensive validation infrastructure powers all service operations:

- **`index.ts`**: Central export for all validation utilities, service/operation constants.
- **`authSchemas.ts`**: Validation for all authentication operations.
- **`notesSchemas.ts`**: Schemas for note management.
- **`shotChecklistSchemas.ts`**: Validation for shot lists, equipment, and locations.
- **`weatherSchemas.ts`**: Schemas for weather API interactions.

### 🛠️ **Utility Functions (`/utils`)**

- **`validationHelpers.ts`**: Core validation patterns, including `validateAndParse` and standardized error creation.
- **`timestampHelpers.ts`**: Utilities for converting Firestore Timestamps. **Note: These are being deprecated in favor of Zod schema preprocessing.**
- **`errorHelpers.ts`**: Custom `ServiceError` class and a `removeUndefinedValues` utility for cleaning data before Firestore writes.
- **`qrUtils.ts`**: A utility for parsing vendor information from QR codes.
- **`defaultChecklist.ts`**: Provides default checklist items.

## Service Implementation Status

| Service                   | Status                      | Validation Level         | Key Features                                         |
|---------------------------|-----------------------------|--------------------------|------------------------------------------------------|
| **`projectServices.ts`**  | ✅ **Standardized**         | Complete Zod validation  | Real-time subscriptions, timestamp conversion        |
| **`privateNotesService.ts`**| ✅ **Standardized**         | Full validation          | Search, CRUD operations, error handling              |
| **`shotChecklistService.ts`**| ✅ **Standardized**         | Full validation          | CRUD operations, status filtering                    |
| **`weatherService.ts`**   | ✅ **Standardized**         | Full validation          | API integration, configuration management            |
| **`dataImportService.ts`**| ✅ **Standardized**         | Full validation          | Merging/replacement strategies, data backup          |
| **`timelineService.ts`**  | ✅ **Standardized**         | Zod validation           | Manages sub-collection, Firestore Timestamps         |
| **`authService.ts`**      | 🟡 **Partially Standardized** | Schemas ready (not fully integrated) | User management, profile uploads                     |
| **`photoTagLinkService.ts`**| ✅ **Standardized (Local)** | Zod validation           | Uses local file system, CRUD, cleanup logic        |
| **`vendorService.ts`**    | 🔵 **Mock Service**         | None (mock data)         | Simulates vendor data API                            |
| **`tagService.ts`**       | 🔵 **Mock Service**         | Zod on creation          | Simulates tag data API                               |
| **`firebase.ts`**         | ✅ **Configured**           | Config validation        | Core Firebase initialization                         |
| **`kitChecklistService.ts`**| 🔴 **Deprecated**           | None                     | Inactive and commented out                           |

## Usage Examples

### Service Method Validation
```typescript
import { PrivateNotesService } from '@/services';

// All inputs are validated automatically inside the service method
try {
  await PrivateNotesService.addPrivateNote(
    projectId,    // Validated as a non-empty string
    noteContent   // Validated for length and content
  );
} catch (error) {
  // Standardized error handling
  console.error('Note creation failed:', error.message);
}
```

### Schema Validation
```typescript
import { CreateNoteInputSchema, validateAndParse } from '@/services/schemas';

// You can also validate data before processing
const validatedData = validateAndParse(
  CreateNoteInputSchema,
  userInput,
  'createNote input'
);
```

### Error Handling
```typescript
import { createServiceError, SERVICE_NAMES } from '@/services/schemas';

// Create standardized service errors for consistent reporting
throw createServiceError(
  SERVICE_NAMES.NOTES,
  'createNote',
  originalError,
  'Failed to create note'
);
```

### Timestamp Conversion
**Note**: Direct conversion is being deprecated. Zod schemas in `types/reusableSchemas.ts` now handle this automatically.

```typescript
// Legacy Way (deprecated)
import { convertTimestampFields } from '@/services/utils/timestampHelpers';
const convertedData = convertTimestampFields(firestoreData, ['createdAt', 'updatedAt']);

// New Way (Zod handles it during parsing)
import { ProjectSchema } from '@/types';
const project = ProjectSchema.parse(firestoreData); // Timestamps are now Date objects
```

## Configuration Setup

### Firebase Configuration
Set the following in your `.env` file:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Weather Service Configuration
The API key must be set before use.
```typescript
import { WeatherService } from '@/services';

// Update API configuration
WeatherService.updateConfig({
  apiKey: 'your_openweathermap_api_key',
  timeout: 15000
});
```

## Best Practices

### Service Implementation
1. **Always validate inputs** at the service boundary using the appropriate Zod schemas.
2. **Use standardized error creation** with `createServiceError()` for consistent logging and error messages.
3. **Log operations** with the "EyeDooApp:" prefix for easy debugging and tracking.
4. **Rely on Zod schemas for timestamp conversion** instead of manual utility functions.
5. **Handle edge cases** gracefully with fallback values and clear error propagation.

### Schema Design
1. **Reuse common schemas** from `CommonSchemas` in `services/schemas/validationHelpers.ts`.
2. **Provide clear error messages** for all validation rules in your Zod schemas.
3. **Use appropriate defaults** for optional fields to ensure consistent object shapes.
4. **Export TypeScript types** inferred from your schemas for use throughout the app.

This service layer provides a robust, type-safe, and maintainable foundation for all backend operations in the EyeDooApp. 