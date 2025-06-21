// # 4.4 Other Tab  
// # 4.4.1 Tags tab
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { otherSubPages } from './_layout';


export default function TagsScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'tags') {
      return false;
    }
    return subPage.id !== currentId;
  };
  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Tags"
        subPages={otherSubPages}
        currentSubPageId="tags"
        isIconVisible={customVisibility}
        onBackPress={() => router.back()}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Tags</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Tags content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function TagsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Tags Screen</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//   }
// });