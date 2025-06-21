// # 4.1 Home Tab
// # 4.1.1 Navigation tab
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { homeSubPages } from './_layout';


export default function DirectionsScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Directions"
        subPages={homeSubPages}
        currentSubPageId="directions"
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Directions</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Directions content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}


// export default function NavigationScreen() {
//   const router = useRouter();


//   // Create a navigation-like object for the AppBar
//   const navigation = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route),
//   };

//   // Custom visibility logic: hide cart and wishlist when cart is empty
//   const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if (subPage.id === 'navigation') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };


//   return (
//     <View style={{ flex: 1 }}>
//     <DashboardAppBar
//       navigation={navigation}
//       title="Navigation"
//       subPages={homeSubPages}
//       currentSubPageId="navigation"
//       isIconVisible={customVisibility}
//     />
//       <Text style={styles.text}>Navigation Screen</Text>
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