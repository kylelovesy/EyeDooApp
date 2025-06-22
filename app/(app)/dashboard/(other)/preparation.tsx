// # 4.4 Other Tab
// # 4.4.3 Preparation tab
import React from 'react';
import { ScrollView } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { otherSubPages } from './_layout';


export default function PreperationScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'preparation') {
      return false;
    }
    return subPage.id !== currentId;
  };
  return (
    <Screen contentContainerStyle={{ padding: 0 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Preparation"
        subPages={otherSubPages}
        currentSubPageId="preparation"
        isIconVisible={customVisibility}
        onBackPress={() => router.back()}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Preparation</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Preparation content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function PreparationScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Preparation Screen</Text>
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