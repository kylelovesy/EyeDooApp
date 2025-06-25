// // # 4.4 Other Tab
// // # 4.4.2 Vendors tab
import React, { useState } from 'react';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { otherSubPages } from './_layout';

import { VendorCard } from '../../../../components/cards/VendorCard';
import { VendorForm } from '../../../../components/modals/VendorForm';
import { useVendors } from '../../../../hooks/useVendors';
import { VendorContact } from '../../../../types/vendors';

import { EmptyState } from '@/components/ui/EmptyState';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList } from 'react-native';
import { FAB, Searchbar, useTheme } from 'react-native-paper';

// TODO: Add vendors to the project form
// Fix phone number input on vendor form
// Fix scanning issue and scan screen size
// Link to real database
// Add export to excel
// Replace loading with actual loading




export default function VendorsScreen() {
  const {
        vendors,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addVendor,
        updateVendor,
        deleteVendor,
      } = useVendors();
  
  const router = useRouter();
  const theme = useTheme();
  // const styles = createScreenStyles(theme);

  // const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  // const { currentProject, setCurrentProjectById } = useProjects();
  
  const [formVisible, setFormVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Partial<VendorContact> | null>(null);

  const handleAddNew = () => {
    setEditingVendor(null);
    setFormVisible(true);
  };

  const handleEdit = (vendor: VendorContact) => {
    setEditingVendor(vendor);
    setFormVisible(true);
  };

  const handleSave = async (vendorData: VendorContact) => {
    if (editingVendor?.id) {
      await updateVendor(editingVendor.id, vendorData);
    } else {
      await addVendor(vendorData);
    }
  };

  const handleDelete = async (vendorId: string) => {
    // Optional: Add a confirmation dialog here
    await deleteVendor(vendorId);
  };

  // useEffect(() => {
  //   if (projectId) {
  //     setCurrentProjectById(projectId);
  //   }
  // }, [projectId, setCurrentProjectById]);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };


  // TODO: Add vendors to the project form
  // const hasVendors = true;
  // const hasVendors = currentProject?.form2?.events && currentProject.form2.events.length > 0;
  // const customVisibility = (subPage: SubPage, currentId: string): boolean => {
  //   if (subPage.id === 'vendors') {
  //     return false;
  //   }
  //   return subPage.id !== currentId;
  // };
  return (
    <Screen
      scrollable={false}
      padding="none"
      safeArea={true}
      paddingTop={0}
      edges={['top']}
      backgroundColor={theme.colors.background}
      statusBarStyle="auto"
      testID="dashboard-vendors-screen-others-full"
    >
      <DashboardAppBar
        navigation={navigation}
        title="Vendors"
        subPages={otherSubPages}
        currentSubPageId="vendors"
        // isIconVisible={customVisibility}
        onBackPress={() => router.back()}
      />
      <Searchbar
        placeholder="Search vendors..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={vendors}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => (
          <VendorCard vendor={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Vendors Found"
            description="Try adjusting your search or add a new vendor."
            onAction={handleAddNew}
          />
        }
      />

      <FAB icon="plus" onPress={handleAddNew} style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }} />

      <VendorForm
        visible={formVisible}
        onDismiss={() => setFormVisible(false)}
        onSave={handleSave}
        initialData={editingVendor || undefined}
      />
      {/* <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Vendors</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Vendors content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView> */}
    </Screen>
  );
}


// import React, { useState } from 'react';
// import { FlatList, View } from 'react-native';
// import { FAB, Searchbar, ActivityIndicator } from 'react-native-paper';
// import { useVendors } from '../hooks/useVendors';
// import { Screen } from '../components/ui/Screen';
// import { EmptyState } from '../components/ui/EmptyState';
// import { VendorCard } from '../components/vendors/VendorCard';
// import { VendorForm } from '../components/modals/VendorForm';
// import { VendorContact } from '../types/vendor';
// // Assume VendorFilter component exists for filter chips
// // import { VendorFilter } from '../components/vendors/VendorFilter'; 

// export default function VendorsScreen() {
//   const {
//     vendors,
//     isLoading,
//     error,
//     searchQuery,
//     setSearchQuery,
//     selectedCategory,
//     setSelectedCategory,
//     addVendor,
//     updateVendor,
//     deleteVendor,
//   } = useVendors();
  
//   const [formVisible, setFormVisible] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<Partial<VendorContact> | null>(null);

//   const handleAddNew = () => {
//     setEditingVendor(null);
//     setFormVisible(true);
//   };

//   const handleEdit = (vendor: VendorContact) => {
//     setEditingVendor(vendor);
//     setFormVisible(true);
//   };

//   const handleSave = async (vendorData: VendorContact) => {
//     if (editingVendor?.id) {
//       await updateVendor(editingVendor.id, vendorData);
//     } else {
//       await addVendor(vendorData);
//     }
//   };

//   const handleDelete = async (vendorId: string) => {
//     // Optional: Add a confirmation dialog here
//     await deleteVendor(vendorId);
//   };
  
//   if (isLoading) {
//     return <ActivityIndicator style={{ flex: 1 }} size="large" />;
//   }

//   return (
//     <Screen>
//       {/* <DashboardAppBar ... /> */}
//       <Searchbar
//         placeholder="Search vendors..."
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       {/* <VendorFilter selected={selectedCategory} onSelect={setSelectedCategory} /> */}
      
//       <FlatList
//         data={vendors}
//         keyExtractor={item => item.id!}
//         renderItem={({ item }) => (
//           <VendorCard vendor={item} onEdit={handleEdit} onDelete={handleDelete} />
//         )}
//         ListEmptyComponent={
//           <EmptyState
//             title="No Vendors Found"
//             description="Try adjusting your search or add a new vendor."
//             onAction={handleAddNew}
//           />
//         }
//       />

//       <FAB icon="plus" onPress={handleAddNew} style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }} />

//       <VendorForm
//         visible={formVisible}
//         onDismiss={() => setFormVisible(false)}
//         onSave={handleSave}
//         initialData={editingVendor || undefined}
//       />
//     </Screen>
//   );
// }
