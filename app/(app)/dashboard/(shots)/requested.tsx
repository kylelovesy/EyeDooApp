// # 4.3 Shots Tab
// # 4.3.1 Requested tab
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { shotsSubPages } from './_layout';


export default function RequestedScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'requested') {
      return false;
    }
    return subPage.id !== currentId;
  };

    return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Requested Shots"
        subPages={shotsSubPages}
        currentSubPageId="requested"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
          <HeadlineText size="large">Requested Shots</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Requested Shots content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function RequestedScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Requested Screen</Text>
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