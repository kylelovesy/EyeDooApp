# EyeDooApp - Photography Project Management 📸

This is a React Native photography project management application built with [Expo](https://expo.dev) and designed for professional photographers to manage their wedding and event photography projects.

## ✅ **MAJOR MILESTONE: Context & Modal Standardization COMPLETED**

**All form contexts and modal components have been successfully standardized!** This represents a major architecture improvement that provides:

- **Consistent Modal Behavior** - All modals now use the standardized `BaseFormModal` pattern
- **Unified Context System** - All 4 form contexts use the `useBaseFormContext` pattern
- **Context-based Visibility** - No more manual modal state management
- **Centralized Error Handling** - Consistent snackbar system across all forms
- **Type Safety** - Full TypeScript integration with proper generics

## Project Features

- **Project Management** - Create, edit, and manage photography projects
- **Timeline Management** - Plan and track project milestones and events
- **People & Persona Management** - Manage client information and key people
- **Photo Requirements** - Define and track shot lists and photo requirements
- **Responsive Design** - Works on both iOS and Android devices

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

- **`/components`** - Reusable UI components with standardized BaseFormModal system
- **`/contexts`** - React Context providers with unified useBaseFormContext pattern
- **`/types`** - TypeScript type definitions and Zod schemas
- **`/services`** - Firebase integration and external API services
- **`/constants`** - Theme, styling, and configuration constants

## Architecture Highlights

### ✅ Standardized Form System
All form modals now follow the same pattern:
- Use `BaseFormModal` for consistent UI and behavior
- Context-based state management with `useBaseFormContext`
- Unified validation using Zod schemas
- Consistent error handling and snackbar notifications

### ✅ Context Standardization
- **Form1EssentialInfoContext** - Project creation and essential info
- **Form2TimelineContext** - Timeline events management
- **Form3PersonaContext** - People and persona management
- **Form4PhotosContext** - Photo requirements and shot lists

### ✅ Provider Composition
Clean provider wrapper system for different app sections:
```typescript
<FormProviders.All>        // All form providers
<FormProviders.Dashboard>  // Dashboard-specific providers
<FormProviders.Essential>  // Essential form only
```

## Documentation

For detailed documentation on specific systems:

- **[Components Documentation](./components/README.md)** - UI components and form system
- **[Contexts Documentation](./contexts/README.md)** - Context providers and state management
- **[Types Documentation](./types/README.md)** - TypeScript types and schemas

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
