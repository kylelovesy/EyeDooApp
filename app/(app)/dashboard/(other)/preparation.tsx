// # 4.4 Other Tab
// # 4.4.3 Preparation tab
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PreparationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Preparation Screen</Text>
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