import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react-native'; // Added screen
import { Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/authService';
import { User } from '../../types/auth';
import { LanguageOption, SubscriptionPlan, WeatherUnit } from '../../types/user';

// Mock Firebase services at different levels to prevent parsing issues
jest.mock('@firebase/auth', () => ({ /* minimal mock for @firebase/auth if directly or indirectly imported by code being parsed */ }));
jest.mock('firebase/app', () => ({ initializeApp: jest.fn(), getApps: jest.fn(() => []) /* other app functions if needed */ }));
jest.mock('firebase/auth', () => ({ /* minimal mock for firebase/auth wrapper */ }));
jest.mock('firebase/firestore', () => ({ /* minimal mock */ }));
jest.mock('firebase/storage', () => ({ /* minimal mock */ }));

// Mock the local firebase init file to prevent its Firebase imports from being processed
jest.mock('../../services/firebase', () => ({
  auth: { /* mocked auth object if needed by AuthService static init */ },
  db: { /* mocked db object */ },
  storage: { /* mocked storage object */ },
}));

// Mock AuthService itself, as its actual implementation imports problematic services
jest.mock('../../services/authService');
const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

// Mock LoadingState component
jest.mock('@/components/ui/LoadingState', () => {
  const ReactNative = require('react-native');
  return {
    LoadingState: ({ message }: { message: string }) => <ReactNative.Text>Loading: {message}</ReactNative.Text>,
  };
});

const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  preferences: {
    notifications: true,
    darkMode: false,
    language: LanguageOption.ENGLISH,
    weatherUnits: WeatherUnit.METRIC,
    emailMarketing: false,
    weekStartsOn: 1,
  },
  subscription: {
    plan: SubscriptionPlan.FREE,
    expiresAt: null,
    features: [],
    isActive: true,
    autoRenew: false,
  },
  isEmailVerified: false,
  isActive: true,
};

// A simple consumer component to test the context values
const TestConsumer: React.FC<{ action?: (auth: ReturnType<typeof useAuth>) => Promise<void> | void }> = ({ action }) => {
  const auth = useAuth();
  if (action) {
    React.useEffect(() => {
      const performAction = async () => {
        if (action && auth) {
          await action(auth);
        }
      };
      performAction();
    }, [action, auth]);
  }
  return (
    <View>
      <Text testID="user-email">{auth.user ? auth.user.email : 'null'}</Text>
      <Text testID="loading-state">{String(auth.loading)}</Text>
      {/* Add other state values if needed for specific tests */}
    </View>
  );
};

describe('AuthContext', () => {
  let mockOnAuthStateChangedCallback: (user: User | null) => void = () => {};

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock for onAuthStateChanged to capture its callback
    MockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
      mockOnAuthStateChangedCallback = callback;
      return jest.fn(); // Return a mock unsubscribe function
    });

    // Default mock implementations for other service methods
    MockedAuthService.signIn.mockResolvedValue(mockUser);
    MockedAuthService.signUp.mockResolvedValue(mockUser);
    MockedAuthService.signOut.mockResolvedValue(undefined);
    MockedAuthService.updateUserProfile.mockResolvedValue(undefined);
    MockedAuthService.resetPassword.mockResolvedValue(undefined);
  });

  test('initial state: user is null, loading is true (then false after init), and renders LoadingState initially', async () => {
    const { findByText, queryByText } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Initially, shows LoadingState because not initialized
    expect(queryByText('Loading: Initializing...')).toBeTruthy();

    // Simulate onAuthStateChanged providing null (initial load, no user)
    await act(async () => {
      mockOnAuthStateChangedCallback(null);
    });

    // Now initialized, LoadingState should be gone
    expect(queryByText('Loading: Initializing...')).toBeNull();

    // Use waitFor to ensure state update and re-render complete
    // screen.getByTestId will now find elements from the updated render tree
    await waitFor(() => {
      expect(screen.getByTestId('user-email').props.children).toBe('null');
      expect(screen.getByTestId('loading-state').props.children).toBe('false');
    });
  });

  test('loads persisted user from onAuthStateChanged when provider mounts', async () => {
    const { queryByText } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(queryByText('Loading: Initializing...')).toBeTruthy();


    await act(async () => {
      mockOnAuthStateChangedCallback(mockUser);
    });

    expect(queryByText('Loading: Initializing...')).toBeNull();
    await waitFor(() => {
      expect(screen.getByTestId('user-email').props.children).toBe(mockUser.email);
      expect(screen.getByTestId('loading-state').props.children).toBe('false');
    });
  });

  describe('signIn (login)', () => {
    it('calls AuthService.signIn and updates user on successful login', async () => {
      MockedAuthService.signIn.mockResolvedValueOnce(mockUser);
      let authContext: ReturnType<typeof useAuth>;

      const TestComponent = () => {
        authContext = useAuth();
        return <Text testID="user-email">{authContext.user?.email || 'null'}</Text>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initialize first
      await act(async () => {
        mockOnAuthStateChangedCallback(null);
      });

      await act(async () => {
        await authContext!.signIn('test@example.com', 'password');
      });

      expect(MockedAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
      // User state is set by onAuthStateChanged, but signIn also dispatches SET_USER directly.
      // The onAuthStateChanged callback might also be triggered by Firebase after signIn.
      // For this test, we primarily care that AuthService.signIn was called and context *could* update.
      // The state update check might be redundant if onAuthStateChanged is robustly mocked to reflect signIn.
      // However, the signIn function itself dispatches SET_USER.
      expect(screen.getByTestId('user-email').props.children).toBe(mockUser.email);
    });

    it('handles error during login', async () => {
      const loginError = { code: 'auth/wrong-password', userMessage: 'Invalid credentials' };
      MockedAuthService.signIn.mockRejectedValueOnce(loginError);
      let authContext: ReturnType<typeof useAuth>;
      let capturedError: any = null;

      const TestComponent = () => {
        authContext = useAuth();
        return <Text testID="error-message">{authContext.error || 'null'}</Text>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
       // Initialize first
       await act(async () => {
        mockOnAuthStateChangedCallback(null);
      });

      await act(async () => {
        try {
          await authContext!.signIn('test@example.com', 'wrongpassword');
        } catch (e) {
          capturedError = e;
        }
      });

      expect(MockedAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(capturedError).toEqual(loginError);
      // Check if error is set in state (this requires TestConsumer to expose auth.error)
      // For now, this test mainly checks if error is thrown and service was called.
      // The AuthProvider itself sets the error state.
      // To test error state: use a consumer that displays state.error
    });
  });

  describe('signUp (register)', () => {
    it('calls AuthService.signUp and updates user on successful registration', async () => {
      MockedAuthService.signUp.mockResolvedValueOnce(mockUser);
      let authContext: ReturnType<typeof useAuth>;

      const TestComponent = () => {
        authContext = useAuth();
        return <Text testID="user-email">{authContext.user?.email || 'null'}</Text>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => { mockOnAuthStateChangedCallback(null); });


      await act(async () => {
        await authContext!.signUp('new@example.com', 'newpassword', 'New User');
      });

      expect(MockedAuthService.signUp).toHaveBeenCalledWith('new@example.com', 'newpassword', 'New User');
       // As with signIn, direct state check can be tricky due to onAuthStateChanged.
       // We rely on the fact that signUp dispatches SET_USER.
      expect(screen.getByTestId('user-email').props.children).toBe(mockUser.email);
    });

    it('handles error during registration', async () => {
      const registerError = { code: 'auth/email-already-in-use', userMessage: 'Email taken' };
      MockedAuthService.signUp.mockRejectedValueOnce(registerError);
      let authContext: ReturnType<typeof useAuth>;
      let capturedError: any = null;

      const TestComponent = () => {
        authContext = useAuth();
        return null; // Not testing UI state here
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => { mockOnAuthStateChangedCallback(null); });


      await act(async () => {
        try {
          await authContext!.signUp('test@example.com', 'password');
        } catch (e) {
          capturedError = e;
        }
      });
      expect(MockedAuthService.signUp).toHaveBeenCalledWith('test@example.com', 'password', undefined);
      expect(capturedError).toEqual(registerError);
    });
  });

  describe('signOut (logout)', () => {
    it('calls AuthService.signOut and clears user state', async () => {
      let authContext: ReturnType<typeof useAuth>;
      const TestComponent = () => {
        authContext = useAuth();
        return <Text testID="user-email">{authContext.user?.email || 'null'}</Text>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initial login
      await act(async () => { mockOnAuthStateChangedCallback(mockUser); });
      expect(screen.getByTestId('user-email').props.children).toBe(mockUser.email);


      await act(async () => {
        await authContext!.signOut();
      });

      expect(MockedAuthService.signOut).toHaveBeenCalled();
      // signOut dispatches SET_USER(null)
      expect(screen.getByTestId('user-email').props.children).toBe('null');
    });
  });

  describe('updateProfile (updateUser)', () => {
    it('updates user state in context after successful profile update', async () => {
      const updatedUserDetails: Partial<User> = { displayName: 'Updated Name' };
      const finalUser = { ...mockUser, ...updatedUserDetails };
      MockedAuthService.updateUserProfile.mockResolvedValueOnce(); // Service call is successful

      let authContext: ReturnType<typeof useAuth>;
      const TestComponent = () => {
        authContext = useAuth();
        return <Text testID="user-name">{authContext.user?.displayName || 'null'}</Text>;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initial login
      await act(async () => { mockOnAuthStateChangedCallback(mockUser); });
      expect(screen.getByTestId('user-name').props.children).toBe(mockUser.displayName);

      await act(async () => {
        await authContext!.updateProfile(updatedUserDetails);
      });

      expect(MockedAuthService.updateUserProfile).toHaveBeenCalledWith(mockUser.id, updatedUserDetails);
      expect(screen.getByTestId('user-name').props.children).toBe(finalUser.displayName);
    });

    it('throws error if trying to updateProfile when no user is logged in', async () => {
        let authContext: ReturnType<typeof useAuth>;
        let capturedError: any = null;
        const TestComponent = () => {
          authContext = useAuth();
          return null;
        };
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
        // Ensure no user is logged in initially
        await act(async () => { mockOnAuthStateChangedCallback(null); });

        await act(async () => {
          try {
            await authContext!.updateProfile({ displayName: "test" });
          } catch (e) {
            capturedError = e;
          }
        });
        expect(MockedAuthService.updateUserProfile).not.toHaveBeenCalled();
        expect(capturedError?.message).toBe('No user logged in');
      });
  });
});
