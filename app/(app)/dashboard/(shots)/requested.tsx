// # 4.3 Shots Tab
// # 4.3.1 Requested tab
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RequestedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Requested Screen</Text>
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