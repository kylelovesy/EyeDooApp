/*-------------------------------------*/
// app/(app)/dashboard/(other)/preparation.tsx
// Status: Updated
// What it does: 
// Displays the project-specific packing list and provides UI controls to manage
// the master kit list. Replaced the native Alert with a react-native-paper Dialog
// for the reset confirmation.
/*-------------------------------------*/

import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Dialog, FAB, Portal, Text, useTheme } from 'react-native-paper';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { HeadlineText } from '../../../../components/ui/Typography';
import { KitChecklistView } from '../../../../components/views/KitChecklistView';
import { useKitChecklist } from '../../../../hooks/useKitChecklist';
import { otherSubPages } from './_layout';

export default function PreparationScreen() {
  const {
    isLoading,
    projectPackingList,
    openMasterKitModal,
    resetMasterKit,
  } = useKitChecklist();

  const router = useRouter();
  const theme = useTheme();
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => setIsDialogVisible(false);

  const handleConfirmReset = () => {
    resetMasterKit();
    hideDialog();
  };

  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  if (isLoading && projectPackingList.length === 0) {
    return (
      <Screen
      scrollable={false}
        padding="none"
        safeArea={true}
        paddingTop={0}
        edges={['top']}
        backgroundColor={theme.colors.background}
        >
        <DashboardAppBar 
          navigation={navigation} 
          title="Preparation" 
          subPages={otherSubPages} 
          currentSubPageId="preparation" 
          onBackPress={() => router.back()}
          />
        <ActivityIndicator style={styles.centered} size="large" />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        scrollable={false}
        padding="none"
        safeArea={true}
        paddingTop={0}
        edges={['top']}
        backgroundColor={theme.colors.background}
      >
        <DashboardAppBar
          navigation={navigation}
          title="Preparation"
          subPages={otherSubPages}
          currentSubPageId="preparation"
          onBackPress={() => router.back()}
        />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <HeadlineText size="large">Project Packing List</HeadlineText>
            <View style={styles.buttonRow}>
              <Button onPress={showDialog} mode="outlined">Reset Master Kit</Button>
            </View>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              {projectPackingList.length > 0 ? (
                <KitChecklistView />
              ) : (
                <Text style={styles.centered}>Your packing list is empty. Update your master kit to get started.</Text>
              )}
            </Card.Content>
          </Card>
        </ScrollView>

        <FAB
          icon="pencil"
          label="Update Master Kit"
          onPress={openMasterKitModal}
          style={styles.fab}
        />
      </Screen>
      
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.title}>Reset Kit List?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to reset your master kit list to the default? This will also update the list for the current project.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleConfirmReset}>Reset</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  card: {
    flex: 1,
    marginBottom: 80, // Add space for the FAB
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  title: {
    textAlign: 'center',
  },
});

// // # 4.4 Other Tab
// // # 4.4.3 Preparation tab
// import React, { useState } from 'react';
// import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
// import { Screen } from '../../../../components/ui/Screen';
// import { otherSubPages } from './_layout';

// import { KitChecklistView } from '../../../../components/views/KitChecklistView';
// import { useKitChecklist } from '../../../../hooks/useKitChecklist';
// import { EmptyState } from '../../../../components/ui/EmptyState';
// import { useRouter } from 'expo-router';
// import { ActivityIndicator, FlatList } from 'react-native';
// import { FAB, Searchbar, useTheme } from 'react-native-paper';

// import { FlatList, Image, StyleSheet, View } from 'react-native';
// import { ActivityIndicator, Button, Card, Chip, FAB, IconButton, Text, useTheme } from 'react-native-paper';
// import { BodyText } from '../../../../components/ui/Typography';
// import { commonStyles } from '../../../../constants/styles';
// import { useProjects } from '../../../../contexts/ProjectContext';
// import { TKitChecklistItem } from '@/types/kitChecklist';


// export default function PreperationScreen() {

//   const { 
//     masterCategories, 
//     masterKitList, 
//     projectPackingList, 
//     isLoading, 
//     isModalVisible, 
//     openMasterKitModal, 
//     closeMasterKitModal, 
//     updateMasterKit, 
//     resetMasterKit, 
//     togglePackedStatus 
//   } = useKitChecklist();


//   const router = useRouter();
//   const theme = useTheme();

//   const { currentProject } = useProjects();

//   const [formVisible, setFormVisible] = useState(false);
//   const [editingItem, setEditingItem] = useState<Partial<TKitChecklistItem> | null>(null);

//   const handleAddNew = () => {
//     setEditingItem(null);
//     setFormVisible(true);
//   };

//   const handleEdit = (item: TKitChecklistItem) => {
//     setEditingItem(item);
//     setFormVisible(true);
//   };

//   const handleSave = async (itemData: TKitChecklistItem) => {
//     if (editingItem?.id) {
//       await updateMasterKit(masterKitList, masterCategories);
//     } else {
//       await addMasterKitItem(itemData);
//     }
//   };
  
//   if (isLoading) {
//     return <ActivityIndicator style={{ flex: 1 }} size="large" />;
//   }

//   const navigation: NavigationProp = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route as any),
//     push: (route: string) => router.push(route as any),
//     replace: (route: string) => router.replace(route as any),
//   };
  
 
  
//   return (
//     <Screen 
//       scrollable={false}
//       padding="none"
//       safeArea={true}
//       paddingTop={0}
//       edges={['top']}
//       backgroundColor={theme.colors.background}
//       statusBarStyle="auto"
//       testID="dashboard-preparation-screen-others-full"
//       >
//       <DashboardAppBar
//         navigation={navigation}
//         title="Preparation"
//         subPages={otherSubPages}
//         currentSubPageId="preparation"
//         // isIconVisible={customVisibility}
//         onBackPress={() => router.back()}
//       />
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//         <HeadlineText size="large">Preparation</HeadlineText>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//           <KitChecklistView />
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </Screen>
//   );
// }

















//-------------------------------------
// import React from 'react';
// import { ScrollView } from 'react-native';

// import { KitChecklistView } from '@/components/views/KitChecklistView';
// import { useRouter } from 'expo-router';
// import { Card } from 'react-native-paper';
// import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
// import { Screen } from '../../../../components/ui/Screen';
// import { HeadlineText } from '../../../../components/ui/Typography';
// import { otherSubPages } from './_layout';


// export default function PreperationScreen() {
//   const router = useRouter();
  
//   const navigation: NavigationProp = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route as any),
//     push: (route: string) => router.push(route as any),
//     replace: (route: string) => router.replace(route as any),
//   };

//   const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if (subPage.id === 'preparation') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };
//   return (
//     <Screen contentContainerStyle={{ padding: 0 }}>
//       <DashboardAppBar
//         navigation={navigation}
//         title="Preparation"
//         subPages={otherSubPages}
//         currentSubPageId="preparation"
//         isIconVisible={customVisibility}
//         onBackPress={() => router.back()}
//       />
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//         <HeadlineText size="large">Preparation</HeadlineText>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//           <KitChecklistView />
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </Screen>
//   );
// }
// // import React from 'react';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function PreparationScreen() {
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.text}>Preparation Screen</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   text: {
// //     fontSize: 18,
// //   }
// // });