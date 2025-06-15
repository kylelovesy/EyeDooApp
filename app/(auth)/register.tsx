// # 2.0 Authentication Group
// # 2.2 Sign-up/register screen
// app/(auth)/signup.tsx
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { Toast, useToast } from '../../components/ui/Toast';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { spacing, useAppTheme } from '../../constants/theme';
import { typography } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
  const theme = useAppTheme();
  const { toastProps, showError, showSuccess } = useToast();

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const { displayName, email, password, confirmPassword } = formData;
    
    if (!displayName.trim()) {
      showError('Validation Error', 'Please enter your display name');
      return false;
    }
    
    if (!email.trim()) {
      showError('Validation Error', 'Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      showError('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      showError('Validation Error', 'Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      showError('Validation Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(
        formData.email.trim().toLowerCase(), 
        formData.password, 
        formData.displayName.trim()
      );
      showSuccess('Welcome!', 'Your account has been created successfully.');
      router.replace('/(app)/events');
    } catch (error: any) {
      showError('Sign Up Error', error.userMessage || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    subtitle: {
      ...typography.bodyLarge,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
    form: {
      gap: spacing.md,
    },
    linksContainer: {
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    divider: {
      width: '100%',
      marginVertical: spacing.sm,
      backgroundColor: theme.colors.outline,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
  });

  return (
    <Screen scrollable padding="lg">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <HeadlineText size="large" textAlign="center" style={{ marginBottom: spacing.sm }}>
              Create Account
            </HeadlineText>
            <BodyText size="large" textAlign="center" style={styles.subtitle}>
              Join EyeDooApp to streamline your wedding photography workflow
            </BodyText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Display Name"
              value={formData.displayName}
              onChangeText={(value) => updateFormData('displayName', value)}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              disabled={loading}
              left={<TextInput.Icon icon="account" />}
              testID="signup-name-input"
            />

            <TextInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              disabled={loading}
              left={<TextInput.Icon icon="email" />}
              error={formData.email.length > 0 && !formData.email.includes('@')}
              testID="signup-email-input"
            />
            
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoComplete="password-new"
              textContentType="newPassword"
              disabled={loading}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={formData.password.length > 0 && formData.password.length < 6}
              testID="signup-password-input"
            />

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              textContentType="newPassword"
              disabled={loading}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              error={
                formData.confirmPassword.length > 0 && 
                formData.password !== formData.confirmPassword
              }
              testID="signup-confirm-password-input"
            />

            <CustomButton
              title="Create Account"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              testID="signup-submit-button"
            />
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <Divider style={styles.divider} />
            
            <View style={styles.linkRow}>
              <BodyText size="medium">Already have an account?</BodyText>
              <Link href="/(auth)/login" asChild>
                <CustomButton
                  title="Sign In"
                  variant="text"
                  size="medium"
                  testID="login-link"
                />
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Toast */}
      {toastProps && <Toast {...toastProps} />}
    </Screen>
  );
}