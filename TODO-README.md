# Project TODO List

This document outlines the remaining tasks, features to be implemented, and placeholder content to be replaced in the EyeDooApp project.

---

### High Priority
- **Implement Form Submission Logic:** The various forms (`EssentialInfo`, `Timeline`, `People`, `Photos`) are UI-complete, but the `handleSubmit` logic in their respective contexts needs to be fully implemented to call `projectServices` and save the data to Firestore.
- **Implement Placeholder Screens:** A significant number of dashboard screens contain placeholder content. Each of these needs to be implemented with its actual UI and logic.
    - `dashboard/(home)/directions.tsx`
    - `dashboard/(home)/key-people.tsx`
    - `dashboard/(other)/index.tsx` (Notes)
    - `dashboard/(other)/tags.tsx`
    - `dashboard/(other)/vendors.tsx`
    - `dashboard/(other)/preparation.tsx`
    - `dashboard/(shots)/index.tsx` (Group Shots)
    - `dashboard/(shots)/requested.tsx`
    - `dashboard/(shots)/other.tsx`
    - `dashboard/(timeline)/index.tsx` (General Timeline)
    - `dashboard/(timeline)/notifications.tsx`
    - `dashboard/(timeline)/edit.tsx`
    - `dashboard/(settings)/index.tsx` (Account)
    - `dashboard/(settings)/calendar.tsx`
    - `dashboard/(settings)/edit-project.tsx`
    - `dashboard/(settings)/settings.tsx`

### Medium Priority
- **Implement Settings Functionality:** The `settings` screens are placeholders. Functionality for updating user profiles, changing passwords, managing notifications, and handling subscriptions needs to be built.
- **Dynamic Data for Dashboard Home:** The "Quick Actions" section on the dashboard home screen should be driven by real data from the `currentProject` context, accurately reflecting the state of each section (Timeline, People, Photos).
- **Finalize Delete Project Flow:** The delete functionality in `projects/index.tsx` uses a dialog. The unused `projects/delete.tsx` screen should be officially removed from the project to avoid confusion.

### Low Priority
- **Complete Typography Story:** The `ThemingTestScreen` showcases the available fonts. The next step would be to create a style guide or storybook that demonstrates the usage of each `Typography` component (`DisplayText`, `HeadlineText`, etc.) in a real-world context.
- **Build out the `+not-found.tsx` Screen:** Create a user-friendly "404 Not Found" screen with navigation to guide users back to the main application.
- **Implement `+html.tsx`:** If server-side rendering or advanced web customization is a goal, the `+html.tsx` file should be properly implemented. 