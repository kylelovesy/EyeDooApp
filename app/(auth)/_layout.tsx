import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';


export default function AuthLayout() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null; // The AuthProvider handles loading state
  }

  // Redirect to main app if user is authenticated
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}