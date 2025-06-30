# EyeDooApp Timeline Feature Architecture

This document provides a comprehensive overview of the Timeline feature's architecture, from data modeling and storage to UI components and state management. The goal is to illustrate how various parts of the application interact to deliver a seamless user experience for managing project timelines.

## 1. High-Level Architecture

The timeline feature is built on a modular, context-driven architecture that separates concerns, ensuring maintainability and scalability.

```mermaid
graph TD
    subgraph "UI Layer (React Native)"
        A[Timeline Screen<br/>`app/.../timeline/index.tsx`] --> B{Open Modal};
        B --> C[Timeline Form Modal<br/>`FormModals.tsx`];
        C --> D[Timeline Event Form<br/>`TimelineEventForm.tsx`];
        A --> E[Timeline View<br/>`EnhancedTimelineView.tsx`];
    end

    subgraph "State & Business Logic"
        F(TimelineContext.tsx) -- Manages State --> A;
        F -- Manages State --> C;
        D -- useTimelineForm Hook --> G(useTimelineForm.ts);
        G -- calls --> F;
    end

    subgraph "Data Layer"
        H(TimelineService.ts) -- Firestore Calls --> I[(Firestore<br/>/projects/{id}/timeline)];
    end
    
    subgraph "Global Context"
        J(ProjectContext.tsx) -- Provides currentProject --> F;
    end

    F -- calls --> H;
    
    style C fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#ccf,stroke:#333,stroke-width:2px
    style H fill:#cfc,stroke:#333,stroke-width:2px
```

## 2. Data Flow and State Management

### 2.1. Data Models & Validation (Zod Schemas)

The data structure is strictly defined and validated using Zod, ensuring type safety from the database to the UI.

-   **`types/timeline.ts`**:
    -   `TimelineEventSchema`: Defines the shape of a timeline event as it's stored in Firestore. Crucially, it uses `z.instanceof(Timestamp)` for the `time` field.
    -   `TimelineEventFormSchema`: An extension of the above schema used in forms. It uses `z.date()` for the `time` field, as this is easier to work with in React Native components like date pickers.
    -   `TTimelineEvent` & `TTimelineEventForm`: TypeScript types inferred from the Zod schemas.

-   **`types/projectSchema.ts`**:
    -   `ProjectSchema`: Defines the entire project document. It includes a `timeline` field which is an object containing an array of events, validated by `CombinedEventsTimelineSchema`.

### 2.2. Firestore Structure

Timeline events are stored in a **subcollection** within each project document. This is a scalable approach that avoids making the main project document too large.

-   **Path**: `projects/{projectId}/timeline/{eventId}`
-   Each document in the `timeline` subcollection represents a single event and conforms to the `TimelineEventSchema`.

### 2.3. Services (Data Abstraction Layer)

Services abstract away the direct Firestore API calls, providing a clean interface for the rest of the application.

-   **`services/timelineService.ts`**:
    -   Handles all CRUD (Create, Read, Update, Delete) operations for the `timeline` subcollection.
    -   Contains helper functions to convert data between the application's format (using JS `Date`) and Firestore's format (using `Timestamp`). This is a critical responsibility of the service layer.

-   **`services/projectServices.ts`**:
    -   Manages the parent `projects` collection. While not directly managing timeline events, it's responsible for fetching the project data that the timeline belongs to.

### 2.4. Contexts (State Management)

Context provides a centralized way to manage state and logic, making it accessible to all components within a provider.

-   **`ProjectContext.tsx`**: Manages the list of all user projects and, most importantly, the `currentProject`. The `TimelineContext` relies on this to know which project's timeline to manage.
-   **`TimelineContext.tsx`**:
    -   Manages the state of the timeline for the currently active project.
    -   Holds the array of `events`, loading states, and error states.
    -   Provides functions (`fetchEvents`, `addEvent`, `updateEvent`, `removeEvent`) that call the `TimelineService`.
    -   It is built upon `useBaseFormContext`, a generic hook that provides reusable logic for form modals (visibility, submission, validation feedback).
    -   It wraps the `openModal` function from the base context to also set the `activeProject` and fetch that project's events.

## 3. User Interaction: The Add/Edit Event Flow

This flow demonstrates how the components, hooks, and contexts work together.

1.  **Initiation**: The user is on the `TimelineGeneralScreen` (`app/(app)/dashboard/(timeline)/index.tsx`). They tap the "Add Events Form" button.
2.  **Open Modal**: The `onPress` handler calls `timelineModal.openModal(currentProject)`. `timelineModal` is the return value from the `useTimelineContext()` hook.
3.  **Context Responds**:
    -   The wrapped `openModal` function in `TimelineContext` is executed.
    -   It sets the `activeProject` state and calls `fetchEvents(project.id)`.
    -   It then calls the underlying `openModal` function from `useBaseFormContext`, which sets `isModalVisible` to `true`.
4.  **Modal Renders**:
    -   All modals are centrally rendered within `<FormModals />` in `app/(app)/dashboard/_layout.tsx`.
    -   The `TimelineFormModal` component in `FormModals.tsx` sees that `isModalVisible` is now `true` and renders itself.
    -   It renders a `<BaseFormModal>` and passes the `<TimelineEventForm>` component as a child.
5.  **Form Logic**:
    -   `TimelineEventForm` uses the `useTimelineForm` custom hook to manage the state of the form fields (`formData`), validation errors, and user input handlers.
    -   If a user is *editing* an event, the `editingEvent` prop is passed down, and `useTimelineForm` populates the form fields with the existing event data.
6.  **Submission**:
    -   The user fills the form and clicks a "Save" or "Add" button inside `TimelineEventForm`.
    -   This triggers `handleSubmit` from the `useTimelineForm` hook.
    -   `handleSubmit` first calls `validateForm()`, which uses `TimelineEventFormSchema` to check the data.
    -   If valid, it calls the `onSubmit` (or `onUpdate`) function that was passed as a prop from `TimelineFormModal`.
7.  **Data Persistence**:
    -   The `handleAddEvent` function in `TimelineFormModal` is called.
    -   This function calls `addEvent` from the `TimelineContext`.
    -   `TimelineContext` sets its loading state and calls `TimelineService.addProjectTimelineEvent()`.
    -   `TimelineService` converts the JS `Date` to a Firestore `Timestamp` and saves the new event document to the `projects/{projectId}/timeline` subcollection.
8.  **UI Update**:
    -   After the Firestore call succeeds, the promise resolves back up the chain.
    -   `TimelineContext` updates its local `events` state with the new event and sets loading to false.
    -   The `TimelineGeneralScreen`, which consumes this context, automatically re-renders with the updated list of events. The modal is then closed.

## 4. Displaying the Timeline

-   The `TimelineGeneralScreen` gets the `events` array from `useTimelineContext()`.
-   It passes this array to the `<EnhancedTimelineView />` component.
-   **`EnhancedTimelineView`**:
    -   Takes the raw `events` array.
    -   Uses a `useMemo` hook to process the events: it sorts them by time and assigns a `status` ('Complete', 'Active', 'Upcoming') to each event by comparing its time to the current time.
    -   It then maps over these `processedEvents` and renders a `TimelineItem` for each one.
-   **`TimelineItem`**:
    -   Receives a single processed event.
    -   Uses `getEventTypeDetails` from `constants/eventTypes.ts` to retrieve the correct icon and default display name for the event's type.
    -   Applies different styling to the dot, line, and card based on the event's `status`, providing a clear visual representation of the day's progress. 