import { Stack } from 'expo-router';
import React from 'react';

export default function QuestionnaireLayout() {
  return (
    <Stack>
      <Stack.Screen name="essential-info" options={{ title: 'Essential Info' }} />
      <Stack.Screen name="timeline-review" options={{ title: 'Timeline Review' }} />
      <Stack.Screen name="key-people" options={{ title: 'Key People' }} />
      <Stack.Screen name="photography-plan" options={{ title: 'Photography Plan' }} />
      {/* Add other questionnaire screens here */}
    </Stack>
  );
}