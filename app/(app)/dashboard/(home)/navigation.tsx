// # 4.1 Home Tab
// # 4.1.1 Navigation tab
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NavigationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Navigation Screen</Text>
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