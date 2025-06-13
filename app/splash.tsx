import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { LoadingState } from '../components/ui/LoadingState';
import { HeadlineText } from '../components/ui/Typography';
import { spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Navigate based on authentication status
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#66C5CC' // EyeDooApp primary color
    }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <HeadlineText 
          size="large" 
          style={{ color: 'white', marginBottom: spacing.md }}
        >
          EyeDooApp
        </HeadlineText>
        <LoadingState 
          message="Loading..." 
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    </View>
  );
}