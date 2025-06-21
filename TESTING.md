# Testing Strategy

This document outlines the testing strategies employed in the EyeDooApp project. We adhere to a balanced approach inspired by the testing pyramid, ensuring comprehensive coverage through Unit, Integration, and End-to-End (E2E) tests.

## Overall Testing Approach

The project's testing approach is structured around the testing pyramid:

-   **Unit Tests (Base of the Pyramid):** These form the largest portion of our tests. They are small, fast, and test individual functions, components, or modules in isolation.
-   **Integration Tests (Middle of the Pyramid):** These tests verify the interactions between different parts of the application, such as a screen with its context or a service with its data transformation logic. They are fewer in number than unit tests but cover more complex scenarios.
-   **End-to-End (E2E) Tests (Top of the Pyramid):** These are the fewest in number and test complete user flows through the application, simulating real user behavior. They are the most comprehensive but also the slowest and most resource-intensive.

**Tools and Libraries:**

-   **Unit & Integration Testing:**
    -   **Jest:** A delightful JavaScript Testing Framework with a focus on simplicity.
    -   **React Native Testing Library (`@testing-library/react-native`):** Used for testing React Native components, encouraging good testing practices by focusing on user-facing behavior.
    -   **MSW (Mock Service Worker):** Can be used for mocking API requests if network calls are made directly from components/services not easily testable via service mocking (though primarily, service methods themselves are mocked in unit/integration tests).
-   **E2E Testing:**
    -   **Maestro:** Recommended for its simplicity and speed in testing user flows. (Detox as a more comprehensive alternative).

**Guiding Principles:**

-   Write tests for all new features.
-   Write tests to cover bug fixes to prevent regressions.
-   Aim for clear, readable, and maintainable tests.
-   Regularly review and refactor tests as the codebase evolves.

---

## Unit Tests

Unit tests focus on individual components, functions, or modules in isolation.

-   **Purpose**: To verify that the smallest pieces of the application work correctly on their own. This includes testing component rendering with different props, event handlers, utility functions, and individual methods within services.
-   **Location**: `__tests__` directory, often mirroring the project structure (e.g., `__tests__/components/ui/CustomButton.test.tsx`, `__tests__/services/authService.test.ts`).
-   **Framework**: Jest with `@testing-library/react-native`.
-   **Naming Convention**: Test files should be named `*.test.ts` or `*.test.tsx`.
-   **Execution**:
    -   Run all unit tests: `npm test` or `jest`
    -   Run tests for a specific file: `npm test -- <path_to_file>` or `jest <path_to_file>`
    -   Run tests in watch mode: `npm run test:watch` (if script is defined in `package.json`) or `jest --watch`

### Writing a New Unit Test

1.  **Import necessary libraries**:
    ```typescript
    import React from 'react';
    import { render, screen, fireEvent } from '@testing-library/react-native';
    import YourComponent from '../YourComponent'; // Path to your component
    // Import other necessary modules like themes, contexts (mocked), etc.
    ```

2.  **Mock Dependencies**:
    -   **Services**: If your component/function uses a service, mock it using `jest.mock('../path/to/yourService');`.
        ```typescript
        jest.mock('../../services/authService');
        const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
        // MockedAuthService.someMethod.mockResolvedValue(...);
        ```
    -   **Navigation**: For components using navigation hooks like `useRouter` from `expo-router`, mock the module:
        ```typescript
        const mockRouterReplace = jest.fn();
        jest.mock('expo-router', () => ({
          useRouter: () => ({ replace: mockRouterReplace }),
          router: { replace: mockRouterReplace }, // If direct router object is used
          Link: jest.fn(({ children }) => children) // Mock Link if needed
        }));
        ```
    -   **Contexts**: If testing a component that consumes a context, you might need to wrap it in the actual context provider with a mocked value, or mock the `useContext` hook if the context is complex to provide.
        ```typescript
        // Example: Providing a simplified mock value for a context
        jest.mock('../../contexts/SomeContext', () => ({
          useSomeContext: () => ({
            someValue: 'mocked value',
            someFunction: jest.fn(),
          }),
        }));
        ```

3.  **Arrange, Act, Assert (AAA Pattern)**:
    -   **Arrange**: Set up the test environment, render the component with necessary props, and prepare mock implementations.
    -   **Act**: Simulate user interactions (e.g., `fireEvent.press`, `fireEvent.changeText`).
    -   **Assert**: Check if the component behaves as expected (e.g., UI changes, functions called, navigation triggered).

    ```typescript
    describe('YourComponent', () => {
      it('should render correctly and handle press', async () => {
        // Arrange
        const onPressMock = jest.fn();
        render(<YourComponent title="Test Button" onPress={onPressMock} testID="my-button" />);

        // Act
        fireEvent.press(screen.getByTestId('my-button'));

        // Assert
        expect(screen.getByText('Test Button')).toBeTruthy();
        expect(onPressMock).toHaveBeenCalledTimes(1);
      });
    });
    ```

4.  **Using `testID`s**: Assign `testID` props to key elements in your components to make them easily selectable in tests, improving test stability.

---

## Integration Tests

Integration tests verify the interaction between different parts of the application, such as screen components interacting with contexts, services, or navigation.

-   **Purpose**: To ensure that different modules or components work together correctly as a group. For example, testing if a screen correctly calls a context method, which in turn calls a service method, and the UI updates accordingly.
-   **Location**: Typically within an `__tests__/integration` folder or alongside feature-specific tests if the integration is very localized.
-   **Framework**: Jest with `@testing-library/react-native`.
-   **Naming Convention**: Similar to unit tests, e.g., `authFlows.test.tsx`.
-   **Execution**: Same commands as unit tests (`npm test`, `jest <path>`, etc.).

### Writing a New Integration Test

1.  **Set Up Providers**: Integration tests often require wrapping the screen/component under test with necessary context providers (e.g., `AuthProvider`, `PaperProvider` for UI themes).
    ```typescript
    // Example: test setup helper
    const renderScreenWithProviders = (ui: React.ReactElement) => {
      return render(
        <PaperProvider theme={testTheme}>
          <AuthProvider> {/* Mocked AuthService will be used by AuthProvider */}
            {ui}
          </AuthProvider>
        </PaperProvider>
      );
    };
    ```

2.  **Simulate User Flows**: Tests should mimic user actions across components.
    ```typescript
    // Example: testing login flow
    it('should log in a user and navigate', async () => {
      // Arrange: Mock service used by AuthContext
      MockedAuthService.signIn.mockResolvedValue(mockUser);
      const { getByTestId } = renderScreenWithProviders(<LoginScreen />);

      // Act
      fireEvent.changeText(getByTestId('login-email-input'), 'test@example.com');
      fireEvent.changeText(getByTestId('login-password-input'), 'password123');
      await act(async () => {
        fireEvent.press(getByTestId('login-submit-button'));
      });

      // Assert
      expect(MockedAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      // ... other assertions for context changes or navigation (mocked)
    });
    ```

3.  **Mock External Dependencies**: Focus on mocking dependencies at the boundaries of the integrated system under test. For example, if testing a screen that uses `AuthContext`, which uses `AuthService`, you would mock `AuthService` methods.
4.  **Verify Outcomes**: Assertions can include:
    -   Context state changes.
    -   Mocked navigation function calls.
    -   UI updates reflecting the outcome of the interaction (e.g., error messages displayed, user information shown).
    -   Service methods being called with correct parameters.

---

## End-to-End (E2E) Testing

E2E tests simulate real user scenarios by interacting with the application as a whole, running on an emulator/simulator or a real device.

### Recommended Framework: Maestro

For this project, **Maestro** is recommended for E2E testing.
- **Why Maestro?**
    - **Simplicity and Speed**: Maestro is known for its simple YAML-based syntax, which makes writing tests quick and easy, even for those not deeply familiar with programming. It focuses on user flows.
    - **Resilience**: Maestro aims to be less flaky than some other E2E frameworks by using a robust method for identifying elements and handling app changes.
    - **Fast Iteration**: It offers features like live development and quick test execution.
    - **Good for Expo/React Native**: While Detox is more comprehensive and powerful for native modules, Maestro provides a good balance of ease-of-use and capability for many React Native apps, especially for flow-based testing.

Alternatively, **Detox** could be considered if very deep native module interaction or more complex test logic is required, but it generally has a steeper learning curve and setup complexity.

### General Setup Steps for Maestro (Conceptual)

1.  **Install Maestro CLI**:
    ```bash
    curl -Ls "https://get.maestro.mobile.dev" | bash
    ```
    Ensure the CLI is in your PATH.

2.  **Install Maestro Studio (Optional but Recommended for test development)**:
    Maestro Studio helps in identifying elements and recording test flows. Instructions are usually available on the Maestro website.

3.  **Project Configuration**:
    - Maestro tests are typically written in YAML files (e.g., `*.yaml` or `*.yml`) within a designated directory in your project (e.g., `.maestro/`).
    - No complex build configurations are usually needed within the app itself specifically for Maestro, as it interacts with the app binary.

4.  **Write Tests**:
    - Create YAML files for your flows. For example, `login_flow.yaml`.
    - Use Maestro commands like `tapOn`, `inputText`, `assertVisible`, etc.

5.  **Run Tests**:
    - **Build your app**: Create a development build of your Expo app.
      ```bash
      eas build -p android --profile development # or ios
      # Or use local expo prebuild if not using EAS
      # npx expo prebuild
      # npx expo run:android / run:ios
      ```
    - **Install the app** on an emulator/simulator or a physical device.
    - **Execute Maestro tests**:
      ```bash
      maestro test .maestro/your_flow.yaml
      ```
      Maestro will connect to the running app instance or launch it.

6.  **Emulators/Simulators/Devices**:
    - Ensure you have Android Studio (for Android emulators) and/or Xcode (for iOS simulators) set up.
    - Maestro can target specific devices or run on any connected device/emulator.

7.  **CI/CD Integration (Further Step)**:
    - Maestro tests can be integrated into CI/CD pipelines. This typically involves:
        - Building the app.
        - Launching an emulator/simulator in the CI environment.
        - Running Maestro tests against the app.
        - Cloud-based device farms (like Maestro Cloud, BrowserStack, Sauce Labs) can also be used for broader device coverage.

### Key Considerations for E2E Testing

-   **Test Flakiness**:
    - **Mitigation**: Use stable and unique identifiers for elements where possible (e.g., `testID`s that Maestro can pick up). Be mindful of animations or transitions; Maestro has ways to wait for elements or idleness. For network requests, consider mocking server responses at the network level if dynamic data makes assertions hard, though E2E often aims to test against a real or staging backend.
-   **Test Data Management**:
    - Plan how to manage test user accounts and data. Avoid relying on existing data that might change. Consider dedicated test accounts or APIs to seed data before test runs.
-   **Execution Time and Cost**:
    - E2E tests are slower than unit or integration tests. Prioritize testing critical user flows.
    - Running on cloud device farms can incur costs, so optimize test suites and frequency.

### Conceptual E2E Test Case Example

The following test case describes a user logging in and viewing the project list. It's written in a Gherkin-like, descriptive style. Actual Maestro syntax would be YAML.

```gherkin
Feature: User Authentication and Project Viewing

  Scenario: Successful Login and Navigation to Projects
    Given the app is launched
    And the user is on the Login Screen
    When the user enters "test@example.com" into the email field with testID "login-email-input"
    And the user enters "password123" into the password field with testID "login-password-input"
    And the user taps the button with testID "login-submit-button"
    Then the app should navigate to the Projects Screen (e.g., assert "Projects" title is visible or a known project list element is present)
    And the Projects Screen should display a list of projects or an empty state message (e.g., assert a project item with testID "project-item-0" or text "No projects yet" is visible).
```

**Explanation for Implementation (using Maestro-like concepts):**

-   `Given the app is launched`: Maestro command `launchApp` or implied by starting the test.
-   `And the user is on the Login Screen`: Assert visibility of a unique element on the Login Screen (e.g., `assertVisible: "Welcome Back"`).
-   `When the user enters "test@example.com" into the email field with testID "login-email-input"`: Maestro command `tapOn: { testID: "login-email-input" }` then `inputText: "test@example.com"`.
-   `And the user taps the button with testID "login-submit-button"`: Maestro command `tapOn: { testID: "login-submit-button" }`.
-   `Then the app should navigate to the Projects Screen...`: Maestro command `assertVisible: "Projects"` (if there's a title with that text) or `assertVisible: { testID: "project-list" }`.
-   `And the Projects Screen should display...`: Maestro command `assertVisible: { testID: "project-item-0" }` or `assertVisible: "No projects yet"`.

### Current Scope

Setting up and executing a full E2E testing framework like Maestro, including CI/CD integration, is a significant task that goes beyond the scope of the current work. The outline and example above provide a starting point and recommendation for the development team to implement a robust E2E testing strategy.
