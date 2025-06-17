// # 2.0 Authentication Group
// # 2.3 Password reset screen

// app-updating/(auth)/forgot-password.tsx
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { Toast, useToast } from '../../components/ui/Toast';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { commonStyles, createThemedStyles } from '../../constants/styles';
import { spacing, useAppTheme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const theme = useAppTheme();
  const styles = useStyles(theme);
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
        }
      );
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (error: any) {
      showError('Reset Error', error.userMessage || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable padding="lg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={commonStyles.authHeader}>
            <HeadlineText
              size="large"
              textAlign="center"
              style={{ color: theme.colors.onBackground, marginBottom: spacing.sm }}
            >
              Reset Password
            </HeadlineText>
            <BodyText
              size="large"
              textAlign="center"
              style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}
            >
              Enter your email address and we&apos;ll send you instructions to
              reset your password
            </BodyText>
          </View>

          {/* Form */}
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
              disabled={loading || emailSent}
              left={<TextInput.Icon icon="email" />}
              error={email.length > 0 && !email.includes('@')}
              testID="forgot-password-email-input"
              theme={theme}
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
          <View style={commonStyles.authLinks}>
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

const useStyles = (theme: any) => {
  const themedStyles = createThemedStyles(theme);
  return {
    ...themedStyles,
    contentContainer: {
      ...commonStyles.authContainer,
    },
  };
};