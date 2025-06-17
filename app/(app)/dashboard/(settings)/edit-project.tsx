// # 4.5 Settings Tab
// # 4.5.2 Edit Project tab
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EditProjectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Project Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  }
});