# Theme & UI Component Testing Guide

This document provides an overview of the temporary testing setup created to verify theme consistency, font rendering, and component styling within the EyeDooApp. It includes instructions on how to switch between the test environment and the main application, as well as a guide for cleaning up the test-related files once verification is complete.

## Summary of Changes

To facilitate UI testing, the following changes were made:

1.  **Theme Context (`contexts/ThemeContext.tsx`)**:
    A new `ThemeContext` was created to provide a mechanism for dynamically switching between light and dark themes. It wraps `react-native-paper`'s `PaperProvider` and includes logic to manage the theme state and update the `StatusBar` style automatically.

2.  **Test Screen (`app/(app)/theming/`)**:
    A new route and screen were added at `app/(app)/theming/`. This screen serves as a sandbox for UI components and includes:
    *   A light/dark mode switch.
    *   A comprehensive display of all typography styles used in the app.
    *   A wide variety of `react-native-paper` components, showcasing their appearance in both themes with different properties (e.g., colors, states).

3.  **Root Layout (`app/_layout.tsx`)**:
    *   The original `PaperProvider` was replaced with the new `ThemeProvider` to enable global theme switching.
    *   Font loading logic (`useFonts`) was added to ensure the "Plus Jakarta Sans" font is loaded before the app renders, preventing the splash screen from hiding prematurely.

4.  **App Layout (`app/(app)/_layout.tsx`)**:
    *   The navigation stack was modified to set the new `/theming` screen as the initial route for the `(app)` group, directing users straight to the test screen upon launch.

## Switching Between Test and Normal Versions

You can easily toggle between the theme test screen and the normal application flow by changing the initial route in the main app layout.

### To View the Normal App:

1.  Open `app/(app)/_layout.tsx`.
2.  Comment out or remove the `theming` screen from the `Stack` navigator and ensure `projects` is the first entry.

    ```tsx
    // file: app/(app)/_layout.tsx

    export default function AppLayout() {
      return (
        <FormProviders.All>
          <Stack screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="theming" /> */}
            <Stack.Screen name="projects" />
            <Stack.Screen name="dashboard" />
          </Stack>
        </FormProviders.All>
      );
    }
    ```

### To View the Theme Test Screen:

1.  Open `app/(app)/_layout.tsx`.
2.  Ensure the `theming` screen is the first entry in the `Stack` navigator.

    ```tsx
    // file: app/(app)/_layout.tsx

    export default function AppLayout() {
      return (
        <FormProviders.All>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="theming" />
            <Stack.Screen name="projects" />
            <Stack.Screen name="dashboard" />
          </Stack>
        </FormProviders.All>
      );
    }
    ```

## Cleanup Guide

Once you have completed your testing and are satisfied with the theme and component styling, you can remove the temporary files and configurations.

### Files and Directories to Remove:

1.  **Test Screen Directory**:
    *   Delete the entire `app/(app)/theming/` directory.

2.  **Theme Context**:
    *   Delete `contexts/ThemeContext.tsx`.

3.  **This README File**:
    *   Delete `THEME-TEST-README.md`.

### Code Changes to Revert:

1.  **App Layout (`app/(app)/_layout.tsx`)**:
    *   Remove the `theming` screen entry from the `Stack` navigator.

    ```tsx
    // Before
    <Stack.Screen name="theming" />

    // After
    // (Line removed)
    ```

2.  **Root Layout (`app/_layout.tsx`)**:
    *   Replace `ThemeProvider` with the original `PaperProvider`.
    *   You will need to decide if you want to keep a static dark/light theme based on the user's system preference or implement a different theme-switching logic. For a simple setup that respects the system theme, you can use the `useColorScheme` hook.

    ```tsx
    // file: app/_layout.tsx

    // Before:
    import { ThemeProvider } from '../contexts/ThemeContext';
    // ...
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>

    // After:
    import { useColorScheme } from 'react-native';
    import { PaperProvider } from 'react-native-paper';
    import { darkTheme, lightTheme } from '../constants/theme';
    // ...
    const RootLayout = () => {
      const colorScheme = useColorScheme();
      const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
      // ... (keep font loading logic)
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <InitialLayout />
            </AuthProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      );
    }
    ```

</rewritten_file> 