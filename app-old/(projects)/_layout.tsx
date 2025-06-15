import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: undefined,
        headerTitleStyle: {
          fontFamily: 'PlusJakartaSans-SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Project',
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen name="[id]" options={{ title: 'Project Details', headerShown: false }} 
      />
    </Stack>
  );
}
