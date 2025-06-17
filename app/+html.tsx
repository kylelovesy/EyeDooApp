// # Custom HTML document (optional)
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HTMLDocument() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HTML Document</Text>
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