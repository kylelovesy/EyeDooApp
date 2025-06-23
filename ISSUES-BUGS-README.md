# Project Issues & Bugs

This document tracks known issues, bugs, and inconsistencies within the EyeDooApp codebase.

---

### 1. **Nested VirtualizedLists Warning**
- **Issue:** The application warns about nesting `VirtualizedLists` (like `FlatList`) inside plain `ScrollView`s. This is an anti-pattern in React Native that can lead to performance degradation and unexpected scrolling behavior.
- **Location:** This primarily occurs in screens that use `<Screen scrollable={true}>` and then render a `FlatList` as a direct child. The `projects/index.tsx` screen is a key example.
- **Cause:** The `<Screen>` component renders a `ScrollView` when `scrollable={true}`. Placing a `FlatList` inside this `ScrollView` triggers the warning.
- **Suggested Fix:** Refactor the screen to use the `FlatList` as the primary scrolling container. Any components that should scroll with the list (like a header) should be moved into the `ListHeaderComponent` prop of the `FlatList`.

### 2. **Inconsistent StyleSheet Implementation**
- **Issue:** There are multiple instances of hardcoded colors and styles, which bypasses the centralized theming system. This leads to visual inconsistencies, especially when switching between light and dark modes.
- **Locations:**
    - `app/(app)/projects/index.tsx`: Styles for `safeArea`, `footer`, and `header` use hardcoded colors like `'#fcfcff'` and `'#e0e0e0'`.
    - `app/(app)/dashboard/(home)/index.tsx`: A `styles` object is partially defined outside the `StyleSheet.create` call, which is a syntax error and will cause runtime failures.
    - Other dashboard screens have similar hardcoded values in their stylesheets.
- **Suggested Fix:** All styles should be created using the `createThemedStyles` helper or by consuming the theme from the `useAppTheme` hook. Replace all hardcoded color values with their corresponding theme variables (e.g., `theme.colors.background`, `theme.colors.outline`).

### 3. **StatusBar BackgroundColor Warning**
- **Issue:** A warning is thrown that `StatusBar backgroundColor` is not supported when edge-to-edge mode is enabled.
- **Location:** `components/ui/Screen.tsx`.
- **Cause:** Modern React Native handles the status bar as a translucent layer. The background color should be controlled by the view *behind* the status bar, not the bar itself.
- **Suggested Fix:** Remove the `backgroundColor` prop from the `<StatusBar />` component inside `Screen.tsx`. The `SafeAreaView` already has its background color set by the theme, which will correctly render behind the status bar.

### 4. **Unused `projectId` Prop in Dashboard**
- **Issue:** The `projects/index.tsx` screen correctly passes the `projectId` as a route parameter to the dashboard. However, the `app/(app)/dashboard/(home)/index.tsx` screen does not use this parameter to set the project in context.
- **Cause:** The `useLocalSearchParams` hook is not used in the dashboard home screen to retrieve the `projectId` and call `setCurrentProjectById`. It relies on the project already being set.
- **Suggested Fix:** In `app/(app)/dashboard/(home)/index.tsx`, use the `useLocalSearchParams` hook to get the `projectId` and call `setCurrentProjectById` within a `useEffect` hook to ensure the selected project is loaded when the screen is navigated to. 