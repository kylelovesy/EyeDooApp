// app/(auth)/login.tsx
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { CustomButton } from '../../components/ui/CustomButton';
import { Screen } from '../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../components/ui/Typography';
import { spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Error', error.userMessage || 'Failed to sign in. Please try again.');
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
              Welcome Back
            </HeadlineText>
            <BodyText size="large" textAlign="center" style={{ opacity: 0.7 }}>
              Sign in to your EyeDooApp account
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
              disabled={loading}
              left={<TextInput.Icon icon="email" />}
              error={email.length > 0 && !email.includes('@')}
              testID="login-email-input"
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

          {/* Links */}
          <View style={{ alignItems: 'center', marginTop: spacing.lg, gap: spacing.md }}>
            <Link href="/(auth)/forgot-password" asChild>
              <CustomButton
                title="Forgot Password?"
                variant="text"
                size="medium"
                testID="forgot-password-link"
              />
            </Link>
            
            <Divider style={{ width: '100%', marginVertical: spacing.sm }} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <BodyText size="medium">Don&apos;t have an account?</BodyText>
              <Link href="/(auth)/signup" asChild>
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
    </Screen>
  );
}