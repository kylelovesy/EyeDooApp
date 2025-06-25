// import React, { useEffect, useState } from 'react';
// import { FlatList, StyleSheet, View } from 'react-native';
// import {
//   Button,
//   Card,
//   Chip,
//   FAB,
//   IconButton,
//   Searchbar,
//   Surface,
//   Text,
// } from 'react-native-paper';
// // import { VendorForm } from '../../../../components/modals/VendorForm';
// import { VendorTypes } from '@/types/enum';
// import { VendorContact } from '../../../../types/vendorSchema';

// // Mock data - replace with your actual data source
// const mockVendors: VendorContact[] = [
//   {
//     id: '1',
//     name: 'John Smith',
//     businessName: 'Smith Photography',
//     email: 'john@smithphoto.com',
//     phone: '+1234567890',
//     website: 'https://smithphoto.com',
//     instagram: '@smithphoto',
//     type: VendorTypes.PHOTOGRAPHER,
//     notes: 'Specializes in outdoor weddings',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '2',
//     name: 'Sarah Johnson',
//     businessName: 'Elegant Flowers',
//     email: 'sarah@elegantflowers.com',
//     phone: '+1987654321',
//     type: VendorTypes.FLORIST,
//     notes: 'Amazing bridal bouquets',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// export const VendorsPage: React.FC = () => {
//   const [vendors, setVendors] = useState<VendorContact[]>(mockVendors);
//   const [filteredVendors, setFilteredVendors] = useState<VendorContact[]>(mockVendors);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [formVisible, setFormVisible] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<VendorContact | null>(null);

//   const categories = [
//     { label: 'Officiant', value: VendorTypes.OFFICIANT },
//     { label: 'Wedding Planner', value: VendorTypes.WEDDING_PLANNER },
//     { label: 'Photographer', value: VendorTypes.PHOTOGRAPHER },
//     { label: 'Videographer', value: VendorTypes.VIDEOGRAPHER },
//     { label: 'DJ', value: VendorTypes.DJ },
//     { label: 'Band', value: VendorTypes.BAND },
//     { label: 'Florist', value: VendorTypes.FLORIST },
//     { label: 'Caterer', value: VendorTypes.CATERER },
//     { label: 'Venue', value: VendorTypes.VENUE },
//     { label: 'Makeup Artist', value: VendorTypes.MAKEUP_ARTIST },
//     { label: 'Hair Stylist', value: VendorTypes.HAIR_STYLIST },
//     { label: 'Transportation', value: VendorTypes.TRANSPORTATION },
//     { label: 'Other', value: VendorTypes.OTHER },
//   ];

//   // Filter vendors based on search and category
//   useEffect(() => {
//     let filtered = vendors;

//     // Filter by search query
//     if (searchQuery) {
//       filtered = filtered.filter(vendor =>
//         vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (selectedCategory) {
//       filtered = filtered.filter(vendor => vendor.type === selectedCategory);
//     }

//     setFilteredVendors(filtered);
//   }, [vendors, searchQuery, selectedCategory]);

//   const handleSaveVendor = async (vendorData: VendorContact) => {
//     try {
//       if (editingVendor) {
//         // Update existing vendor
//         setVendors(prev =>
//           prev.map(vendor =>
//             vendor.id === editingVendor.id
//               ? { ...vendorData, id: editingVendor.id }
//               : vendor
//           )
//         );
//       } else {
//         // Add new vendor
//         const newVendor = {
//           ...vendorData,
//           id: Date.now().toString(), // In real app, use proper ID generation
//         };
//         setVendors(prev => [...prev, newVendor]);
//       }

//       // Close form and reset editing state
//       setFormVisible(false);
//       setEditingVendor(null);
//     } catch (error) {
//       console.error('Error saving vendor:', error);
//       throw error; // Re-throw to let the form handle the error
//     }
//   };

//   const handleEditVendor = (vendor: VendorContact) => {
//     setEditingVendor(vendor);
//     setFormVisible(true);
//   };

//   const handleDeleteVendor = (vendorId: string) => {
//     setVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
//   };

//   const handleAddNew = () => {
//     setEditingVendor(null);
//     setFormVisible(true);
//   };

//   const handleCloseForm = () => {
//     setFormVisible(false);
//     setEditingVendor(null);
//   };

//   const getCategoryColor = (category: string): string => {
//     const colors: Record<string, string> = {
//       photographer: '#e3f2fd',
//       videographer: '#f3e5f5',
//       florist: '#e8f5e8',
//       caterer: '#fff3e0',
//       venue: '#fce4ec',
//       dj: '#e0f2f1',
//       band: '#f1f8e9',
//       planner: '#e8eaf6',
//       other: '#f5f5f5',
//     };
//     return colors[category] || colors.other;
//   };

//   const renderVendorCard = ({ item: vendor }: { item: VendorContact }) => (
//     <Card style={styles.vendorCard}>
//       <Card.Content>
//         <View style={styles.cardHeader}>
//           <View style={styles.vendorInfo}>
//             <Text variant="titleMedium" style={styles.vendorName}>
//               {vendor.name}
//             </Text>
//             {vendor.businessName && (
//               <Text variant="bodyMedium" style={styles.businessName}>
//                 {vendor.businessName}
//               </Text>
//             )}
//             <Chip
//               style={[
//                 styles.categoryChip,
//                 { backgroundColor: getCategoryColor(vendor.type) }
//               ]}
//               compact
//             >
//               {vendor.type}
//             </Chip>
//           </View>
//           <View style={styles.cardActions}>
//             <IconButton
//               icon="pencil"
//               size={20}
//               onPress={() => handleEditVendor(vendor)}
//             />
//             <IconButton
//               icon="delete"
//               size={20}
//               onPress={() => handleDeleteVendor(vendor.id!)}
//             />
//           </View>
//         </View>

//         <View style={styles.contactInfo}>
//           {vendor.email && (
//             <Text variant="bodySmall" style={styles.contactItem}>
//               📧 {vendor.email}
//             </Text>
//           )}
//           {vendor.phone && (
//             <Text variant="bodySmall" style={styles.contactItem}>
//               📞 {vendor.phone}
//             </Text>
//           )}
//           {vendor.website && (
//             <Text variant="bodySmall" style={styles.contactItem}>
//               🌐 {vendor.website}
//             </Text>
//           )}
//           {vendor.instagram && (
//             <Text variant="bodySmall" style={styles.contactItem}>
//               📷 {vendor.instagram}
//             </Text>
//           )}
//         </View>

//         {vendor.notes && (
//           <Text variant="bodySmall" style={styles.notes}>
//             {vendor.notes}
//           </Text>
//         )}
//       </Card.Content>
//     </Card>
//   );

//   const renderEmptyState = () => (
//     <Surface style={styles.emptyState}>
//       <Text variant="headlineSmall" style={styles.emptyTitle}>
//         No Vendors Found
//       </Text>
//       <Text variant="bodyMedium" style={styles.emptySubtitle}>
//         {searchQuery || selectedCategory
//           ? 'Try adjusting your search or filters'
//           : 'Add your first vendor contact to get started'
//         }
//       </Text>
//       <Button
//         mode="contained"
//         onPress={handleAddNew}
//         style={styles.emptyButton}
//         icon="plus"
//       >
//         Add Vendor
//       </Button>
//     </Surface>
//   );

//   return (
    
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <Searchbar
//         placeholder="Search vendors..."
//         onChangeText={setSearchQuery}
//         value={searchQuery}
//         style={styles.searchBar}
//       />

//       {/* Category Filter */}
//       <View style={styles.filterContainer}>
//         <FlatList
//           horizontal
//           data={categories}
//           keyExtractor={(item) => item.value || 'all'}
//           renderItem={({ item }) => (
//             <Chip
//               selected={selectedCategory === item.value}
//               onPress={() => setSelectedCategory(item.value)}
//               style={styles.filterChip}
//             >
//               {item.label}
//             </Chip>
//           )}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterList}
//         />
//       </View>

//       {/* Vendors List */}
//       <FlatList
//         data={filteredVendors}
//         keyExtractor={(item) => item.id!}
//         renderItem={renderVendorCard}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={renderEmptyState}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Add Vendor FAB */}
//       <FAB
//         icon="plus"
//         style={styles.fab}
//         onPress={handleAddNew}
//         label="Add Vendor"
//       />

//       {/* Vendor Form Modal */}
//       {/* <VendorForm
//         visible={formVisible}
//         onDismiss={handleCloseForm}
//         onSave={handleSaveVendor}
//         initialData={editingVendor || undefined}
//         mode={editingVendor ? 'edit' : 'create'}
//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   searchBar: {
//     margin: 16,
//     elevation: 2,
//   },
//   filterContainer: {
//     marginBottom: 16,
//   },
//   filterList: {
//     paddingHorizontal: 16,
//   },
//   filterChip: {
//     marginRight: 8,
//   },
//   listContainer: {
//     padding: 16,
//     paddingBottom: 100, // Space for FAB
//   },
//   vendorCard: {
//     marginBottom: 12,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   vendorInfo: {
//     flex: 1,
//   },
//   vendorName: {
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   businessName: {
//     color: '#666',
//     marginBottom: 8,
//   },
//   categoryChip: {
//     alignSelf: 'flex-start',
//   },
//   cardActions: {
//     flexDirection: 'row',
//   },
//   contactInfo: {
//     marginBottom: 8,
//   },
//   contactItem: {
//     marginBottom: 2,
//     color: '#555',
//   },
//   notes: {
//     fontStyle: 'italic',
//     color: '#666',
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   emptyState: {
//     padding: 32,
//     alignItems: 'center',
//     borderRadius: 12,
//     marginTop: 50,
//   },
//   emptyTitle: {
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     textAlign: 'center',
//     color: '#666',
//     marginBottom: 24,
//   },
//   emptyButton: {
//     paddingHorizontal: 24,
//   },
//   fab: {
//     position: 'absolute',
//     margin: 16,
//     right: 0,
//     bottom: 0,
//   },
// });



// // # 4.4 Other Tab
// // # 4.4.2 Vendors tab
import React from 'react';
import { ScrollView } from 'react-native';

import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
import { otherSubPages } from './_layout';


export default function VendorsScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'vendors') {
      return false;
    }
    return subPage.id !== currentId;
  };
  return (
    <Screen contentContainerStyle={{ padding: 0 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Vendors"
        subPages={otherSubPages}
        currentSubPageId="vendors"
        isIconVisible={customVisibility}
        onBackPress={() => router.back()}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <HeadlineText size="large">Vendors</HeadlineText>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <BodyText>Vendors content goes here...</BodyText>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function VendorsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Vendors Screen</Text>
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