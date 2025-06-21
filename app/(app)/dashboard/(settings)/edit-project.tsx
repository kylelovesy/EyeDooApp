// # 4.5 Settings Tab
// # 4.5.2 Edit Project tab
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { settingsSubPages } from './_layout';


export default function EditProjectScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'edit-project') {
      return false;
    }
    return subPage.id !== currentId;
  };
  return (
    <View style={{ flex: 1 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Edit Project"
        subPages={settingsSubPages}
        currentSubPageId="edit-project"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Edit Project</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Edit Project content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function EditProjectScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Edit Project Screen</Text>
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