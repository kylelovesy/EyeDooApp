// # 2.0 Authentication Group
// # 2.3 Password reset screen

// app-updating/(auth)/forgot-password.tsx
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { Toast, useToast } from '../../components/ui/Toast';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { spacing, useAppTheme } from '../../constants/theme';
import { typography } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const theme = useAppTheme();
  const { toastProps, showError, showSuccess } = useToast();

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      showError('Validation Error', 'Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      showError('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      setEmailSent(true);
      showSuccess(
        'Reset Email Sent',
        'Check your email for instructions to reset your password.',
        {
          duration: 6000,
          onDismiss: () => router.back(),
        }
      );
    } catch (error: any) {
      showError('Reset Error', error.userMessage || 'Failed to send reset email. Please try again.');
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
    backLinkContainer: {
      alignItems: 'center',
      marginTop: spacing.lg,
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
              Reset Password
            </HeadlineText>
            <BodyText size="large" textAlign="center" style={styles.subtitle}>
              Enter your email address and we&apos;ll send you instructions to reset your password
            </BodyText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              disabled={loading || emailSent}
              left={<TextInput.Icon icon="email" />}
              error={email.length > 0 && !email.includes('@')}
              testID="forgot-password-email-input"
            />

            <CustomButton
              title={emailSent ? "Email Sent" : "Send Reset Email"}
              variant="primary"
              size="large"
              fullWidth
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading || emailSent}
              testID="forgot-password-submit-button"
            />
          </View>

          {/* Back Link */}
          <View style={styles.backLinkContainer}>
            <Link href="/(auth)/login" asChild>
              <CustomButton
                title="Back to Sign In"
                variant="text"
                size="medium"
                testID="back-to-login-link"
              />
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Toast */}
      {toastProps && <Toast {...toastProps} />}
    </Screen>
  );
}