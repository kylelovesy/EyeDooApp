import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="create-project" 
        options={{ 
          title: 'Create Project',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
