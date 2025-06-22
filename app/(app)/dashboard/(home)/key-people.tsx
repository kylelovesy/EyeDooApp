// # 4.1 Home Tab
// # 4.1.2 Key People tab
import React from 'react';
// import { ScrollView } from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { homeSubPages } from './_layout';


export default function KeyPeopleScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
  };

  return (
    <Screen style={styles.safeArea} edges={['top', 'left', 'right']} padding="sm" statusBarStyle="auto" scrollable={true}>
    <Stack.Screen options={{ headerShown: false }} />

      <DashboardAppBar
        navigation={navigation}
        title="Key People"
        subPages={homeSubPages}
        currentSubPageId="key-people"
      />
      {/* <ScrollView style={{ flex: 1, padding: 16 }}> */}
        <HeadlineText size="large">Key People</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Key People content goes here...</BodyText>
          </Card.Content>
        </Card>
      {/* </ScrollView> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcfcff',
  },
});


//   const router = useRouter();
//   const [keyPeople] = React.useState(3); // Example people count
  
  
//   const navigation = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route),
//   };

//   // Custom visibility logic: hide cart and wishlist when cart is empty
//   const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if (keyPeople === 0 || subPage.id === 'key-people') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };
//   return (
//     <View style={{ flex: 1 }}>
//     <DashboardAppBar
//       navigation={navigation}
//       title="Key People"
//       subPages={homeSubPages}
//       currentSubPageId="key-people"
//       isIconVisible={customVisibility}
//     />
//        <ScrollView style={{ flex: 1, padding: 16 }}>
//         <HeadlineText size="large">Key People</HeadlineText>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//             <BodyText>Key People content goes here...</BodyText>
//           </Card.Content>
//         </Card>
//       </ScrollView>
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