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
        // error,
        searchQuery,
        setSearchQuery,
        // selectedCategory,
        // setSelectedCategory,
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
    </Screen>
  );
}