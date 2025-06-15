import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { Toast, useToast } from '../../components/ui/Toast';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { commonStyles, createThemedStyles } from '../../constants/styles';
import { useAppTheme } from '../../constants/theme';
import { typography } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const theme = useAppTheme();
  const themedStyles = createThemedStyles(theme);
  const { signIn } = useAuth();
  const { toastProps, showError, showSuccess } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validates the login form inputs
   * Shows toast notifications for validation errors
   * @returns {boolean} - True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    if (!email.trim()) {
      showError('Validation Error', 'Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      showError('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      showError('Validation Error', 'Please enter your password');
      return false;
    }
    
    if (password.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  /**
   * Handles the login process
   * Shows appropriate toast notifications for success/error states
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      
      // Show success toast
      showSuccess(
        'Welcome Back!', 
        'You have been successfully signed in.',
        { duration: 2000 }
      );
      
      // Navigate after a brief moment to show the success toast
      setTimeout(() => {
        router.replace('/(app)/events');
      }, 1000);
      
    } catch (error: any) {
      // Show error toast instead of Alert
      showError(
        'Login Failed',
        error.userMessage || 'Failed to sign in. Please check your credentials and try again.',
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen 
      scrollable 
      padding="lg"
      style={themedStyles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.container}
      >
        <View style={commonStyles.authContainer}>
          {/* Header Section */}
          <View style={commonStyles.authHeader}>
            <HeadlineText 
              size="large" 
              style={[
                commonStyles.textCenter,
                { 
                  ...typography.headlineLarge,
                  color: theme.colors.onBackground,
                  marginBottom: 8,
                }
              ]}
            >
              Welcome Back
            </HeadlineText>
            <BodyText 
              size="large" 
              style={[
                commonStyles.textCenter,
                {
                  ...typography.bodyLarge,
                  color: theme.colors.onSurfaceVariant,
                  opacity: 0.8,
                }
              ]}
            >
              Sign in to your EyeDooApp account
            </BodyText>
          </View>

          {/* Form Section */}
          <View style={commonStyles.form}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              disabled={loading}
              left={<TextInput.Icon icon="email" />}
              error={email.length > 0 && !email.includes('@')}
              testID="login-email-input"
              style={{
                backgroundColor: theme.colors.surface,
              }}
              theme={theme}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              disabled={loading}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={password.length > 0 && password.length < 6}
              testID="login-password-input"
              style={{
                backgroundColor: theme.colors.surface,
              }}
              theme={theme}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />

            <CustomButton
              title="Sign In"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              testID="login-submit-button"
            />
          </View>

          {/* Links Section */}
          <View style={commonStyles.authLinks}>
            <Link href="/(auth)/reset-password" asChild>
              <CustomButton
                title="Forgot Password?"
                variant="text"
                size="medium"
                testID="forgot-password-link"
              />
            </Link>
            
            <Divider style={themedStyles.authDivider} />
            
            <View style={commonStyles.authSignupRow}>
              <Text style={{
                ...typography.bodyMedium,
                color: theme.colors.onSurfaceVariant,
              }}>
                Don&apos;t have an account?
              </Text>
              <Link href="/(auth)/register" asChild>
                <CustomButton
                  title="Sign Up"
                  variant="text"
                  size="medium"
                  testID="signup-link"
                />
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Toast Notification */}
      {toastProps && <Toast {...toastProps} />}
    </Screen>
  );
}