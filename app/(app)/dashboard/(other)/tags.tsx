// # 4.4 Other Tab  
// # 4.4.1 Tags tab
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TagsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tags Screen</Text>
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