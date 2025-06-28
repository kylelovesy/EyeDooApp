# EyeDooApp App Directory Documentation

## Overview

This directory contains all the screens and navigation logic for the EyeDooApp, built using **Expo Router's file-based routing system**. Each file and directory within `/app` automatically becomes a route in the application.

## Directory Structure & Routing

### Root Layout (`_layout.tsx`)
- **Location**: `app/_layout.tsx`
- **Purpose**: This is the root layout for the entire application. It wraps all other screens and layouts.
- **Key Functions**:
  - Initializes global providers like `AuthProvider`, `PaperProvider`, and `GestureHandlerRootView`.
  - Manages splash screen visibility.
  - Contains the core authentication logic that redirects users based on their login state (`user` vs. `!user`).

### Route Groups
The app is divided into two main route groups, which are directories starting with `(...)`. These groups do not affect the URL but allow for organizing screens under different layouts.

#### 1. Auth Group (`(auth)`)
- **Location**: `app/(auth)/`
- **Purpose**: Contains all screens related to user authentication (login, registration, password reset). These screens are only accessible when the user is **not** logged in.
- **Layout**: `app/(auth)/_layout.tsx` defines the `Stack` navigator for the authentication flow.
- **Screens**:
  - `login.tsx`: The main sign-in screen.
  - `register.tsx`: The user registration screen.
  - `reset-password.tsx`: The screen for handling forgotten passwords.

#### 2. Main App Group (`(app)`)
- **Location**: `app/(app)/`
- **Purpose**: Contains all the core application screens and features that are accessible only **after** a user has logged in.
- **Layout**: `app/(app)/_layout.tsx` defines the `Stack` navigator for the main app and wraps all screens in the necessary `FormProviders`.
- **Screens & Sub-directories**:
  - **`projects/`**: Manages the list of user projects.
    - `index.tsx`: Displays the main project selection screen.
    - `_layout.tsx`: The `Stack` layout for the projects section.
  - **`dashboard/`**: The main dashboard for a selected project, featuring a bottom tab navigator.
    - `_layout.tsx`: Defines the `Tabs` navigator for the five main dashboard sections.
    - **`(home)/`**: The primary dashboard overview. Uses a nested `Stack` navigator for its sub-pages.
      - `index.tsx`: The main "Home" screen with quick actions.
      - `directions.tsx`: Directions sub-page.
      - `key-people.tsx`: Key People sub-page.
    - **`(timeline)/`**: Manages the project timeline.
      - `index.tsx`: Displays the visual timeline.
      - `notifications.tsx`, `edit.tsx`: Sub-pages for timeline settings.
    - **`(shots)/`**: Manages photo shot lists.
      - `index.tsx`: "Group Shots" screen.
      - `requested.tsx`, `other.tsx`: Sub-pages for other shot types.
    - **`(other)/`**: Contains miscellaneous features like notes, tags, and vendors.
      - `index.tsx`: "Notes" screen.
      - `tags.tsx`, `vendors.tsx`, `preparation.tsx`: Sub-pages.
    - **`(settings)/`**: Manages project and app settings.
      - `index.tsx`: "Account" settings screen.
      - `calendar.tsx`, `edit-project.tsx`, `settings.tsx`: Sub-pages.
  - **`camera.tsx`**: The screen for taking photos with the device camera.
  - **`tagPhoto.tsx`**: The screen for applying tags to a recently captured photo.
  - **`theming/`**: A development screen for testing and visualizing UI components and themes.

### Global Files
- **`+html.tsx`**: (Optional) A file to customize the `<html>` element for web builds.
- **`+not-found.tsx`**: A file that automatically handles any routes that are not matched, acting as a 404 page.

## Navigation Flow
1.  **App Start**: The `app/_layout.tsx` is loaded. It sets up providers and checks the auth state.
2.  **Authentication Check**:
    - If a `user` object exists, the router redirects to `/(app)/projects`.
    - If no `user` exists, the router redirects to `/(auth)/login`.
3.  **App Navigation**:
    - From the projects screen (`/(app)/projects/index.tsx`), selecting a project navigates the user to the dashboard (`/(app)/dashboard/(home)`), passing the `projectId` as a parameter.
    - The dashboard uses a `Tabs` navigator for the main sections and nested `Stack` navigators for sub-pages within each section.
    - The custom `DashboardAppBar` component is used within each section to provide consistent header navigation. 