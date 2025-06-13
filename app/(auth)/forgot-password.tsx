import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
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
      Alert.alert(
        'Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Reset Error', error.userMessage || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable padding="lg">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', maxWidth: 400, alignSelf: 'center', width: '100%' }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
            <HeadlineText size="large" textAlign="center" style={{ marginBottom: spacing.sm }}>
              Reset Password
            </HeadlineText>
            <BodyText size="large" textAlign="center" style={{ opacity: 0.7 }}>
              Enter your email address and we&apos;ll send you instructions to reset your password
            </BodyText>
          </View>

          {/* Form */}
          <View style={{ gap: spacing.md }}>
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
          <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
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
    </Screen>
  );
}