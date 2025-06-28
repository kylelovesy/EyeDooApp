# EyeDooApp Hooks Documentation

## Overview

This directory contains all custom React hooks used throughout the EyeDooApp. These hooks encapsulate reusable logic, separating it from the UI components and improving code organization and maintainability.

## Available Hooks

### `useAccordionAnimation.ts`
- **Purpose**: Manages the `Animated.Value` and state logic for creating a smooth accordion (expand/collapse) animation.
- **Returns**:
  - `isExpanded`: A boolean state indicating if the accordion is open.
  - `accordionAnimation`: The `Animated.Value` to be used in `StyleSheet`.
  - `toggleAccordion`: A function to trigger the animation.

### `useCameraPermissions.ts`
- **Purpose**: A hook to request and check for camera permissions. It only requests permission when the feature requiring it is active.
- **Returns**:
  - `hasPermission`: A boolean indicating if camera permission has been granted.

### `usePhotoTagLinks.ts`
- **Purpose**: Manages the full CRUD (Create, Read, Update, Delete) lifecycle for links between photos and tags, which are stored on the local device file system.
- **Returns**:
  - `links`: An array of `PhotoTagLink` objects.
  - `loading`: A boolean indicating the loading state.
  - `addPhotoTagLink`, `updatePhotoTagLink`, `removePhotoTagLink`: Functions to manage the links.
  - `getLinksForProject`: A function to filter links for a specific project.

### `useProcessedTimeline.ts`
- **Purpose**: Takes a raw array of timeline events and processes them for UI display. It sorts events, determines their current status (e.g., `Complete`, `Active`, `Upcoming`), and calculates progress for currently active events.
- **Returns**:
  - `processedEvents`: The array of events with added `status` and `progress` properties.
  - `currentEventIndex`: The index of the currently active event in the array.

### `useProjects.ts`
- **Purpose**: Manages fetching and real-time updates for projects from Firestore. It listens for authentication state changes and subscribes to the user's projects.
- **Returns**:
  - `projects`: An array of the user's `Project` objects.
  - `loading`: A boolean indicating the loading state.
  - `error`: Any error that occurred during fetching.

### `useTags.ts`
- **Purpose**: Manages the master list of tags, handling all CRUD operations with the mock `tagService`.
- **Returns**:
  - `tags`: The array of all available `Tag` objects.
  - `loading`: A boolean loading state.
  - `saveTag`, `removeTag`: Functions to manage the master list of tags.

### `useTimelineForm.ts`
- **Purpose**: Encapsulates all the business logic for the timeline event creation form. It manages form data, validation (using Zod), error states, and submission.
- **Returns**:
  - State variables (`formData`, `errors`, `snackbar`, `isFormComplete`).
  - Handler functions (`handleFieldChange`, `handleTimeChange`, `handleSubmit`, `resetForm`).

### `useVendors.ts`
- **Purpose**: Manages vendor data, including fetching from the mock `vendorService`, searching, and filtering.
- **Returns**:
  - `vendors`: The filtered array of `VendorContact` objects.
  - `isLoading`, `error`: State indicators.
  - `searchQuery`, `setSearchQuery`: State for the search functionality.
  - `addVendor`, `updateVendor`, `deleteVendor`: Functions for CRUD operations.

## Usage Example

Using a hook in a component is straightforward.

```typescript
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useProjects } from '@/hooks/useProjects';

const ProjectListComponent = () => {
  // Destructure the values returned from the hook
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.form1.projectName}</Text>}
    />
  );
}; 