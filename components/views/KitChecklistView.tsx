/*-------------------------------------*/
// components/views/KitChecklistView.tsx
// Status: Updated
// What it does: 
// Displays the project-specific packing list, now dynamically grouped by the
// user's master categories. It uses accordions for a clean, organized view.
/*-------------------------------------*/

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, List, Snackbar, Text } from 'react-native-paper';
import { GenericIcon, PREDEFINED_CATEGORY_ICONS } from '../../constants/kitChecklistTypes';
import { useKitChecklist } from '../../hooks/useKitChecklist';
import { TKitChecklistItemWithFirestoreId } from '../../services/kitChecklistService';

export const KitChecklistView = () => {
  const { projectPackingList, masterCategories, togglePackedStatus, error, clearError } = useKitChecklist();

  // Group the project-specific items by their category ID for quick lookup
  const groupedItems = useMemo(() => {
    try {
      return projectPackingList.reduce((acc, item) => {
        if (!acc[item.categoryId]) {
          acc[item.categoryId] = [];
        }
        acc[item.categoryId].push(item);
        return acc;
      }, {} as Record<string, TKitChecklistItemWithFirestoreId[]>);
    } catch (error) {
      console.error('KitChecklistView: Error grouping items:', error);
      return {};
    }
  }, [projectPackingList]);

  const handleTogglePackedStatus = async (item: TKitChecklistItemWithFirestoreId) => {
    try {
      console.log('KitChecklistView: Toggling item:', item.name, 'firestoreDocId:', item.firestoreDocId);
      await togglePackedStatus(item.firestoreDocId, item.packed);
    } catch (error) {
      console.error('KitChecklistView: Error toggling packed status:', error);
    }
  };

  if (!projectPackingList || projectPackingList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium">No items in your packing list. Update your master kit to add items.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <List.Section>
        <List.AccordionGroup>
          {masterCategories.map((category) => {
            const itemsInCategory = groupedItems[category.id] || [];
            // Don't render a category section if there are no items for it in this project
            if (itemsInCategory.length === 0) return null;

            const packedCount = itemsInCategory.filter(item => item.packed).length;
            const totalCount = itemsInCategory.length;

            // Dynamically select the icon
            const Icon = PREDEFINED_CATEGORY_ICONS[category.id] || GenericIcon;

            return (
              <List.Accordion
                key={category.id}
                title={`${category.displayName} (${packedCount}/${totalCount})`}
                id={category.id}
                left={props => (
                <View style={styles.iconContainer}>
                  <Icon width={20} height={20} color={props.color} style={styles.icon} />
                </View>
              )}
              >
                {itemsInCategory.map((item) => (
                  <Checkbox.Item
                    key={item.firestoreDocId} // Use Firestore document ID as key
                    label={`${item.name} (Qty: ${item.quantity || 1})`}
                    status={item.packed ? 'checked' : 'unchecked'}
                    onPress={() => handleTogglePackedStatus(item)}
                    style={styles.checklistItem}
                  />
                ))}
              </List.Accordion>
            );
          })}
        </List.AccordionGroup>
      </List.Section>
      
      {error && (
        <Snackbar
          visible={!!error}
          onDismiss={clearError}
          duration={4000}
          action={{
            label: 'Dismiss',
            onPress: clearError,
          }}
        >
          {error}
        </Snackbar>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 40,
    height: 40,
  },
  icon: {
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  checklistItem: {
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
});


/*-------------------------------------*/
// components/views/KitChecklistView.tsx
// Status: Updated
// What it does: 
// Displays the project-specific packing list, now grouped by category in expandable
// accordions for a cleaner and more organized user experience.
/*-------------------------------------*/

// import React, { useMemo } from 'react';
// import { StyleSheet } from 'react-native';
// import { Checkbox, List } from 'react-native-paper';
// import { KitCategory, PHOTOGRAPHY_PACKING_LIST } from '../../constants/kitChecklistTypes';
// import { useKitChecklist } from '../../hooks/useKitChecklist';
// import { TKitChecklistItem } from '../../types/kitChecklist';

// export const KitChecklistView = () => {
//   const { projectPackingList, togglePackedStatus } = useKitChecklist();

//   const groupedItems = useMemo(() => {
//     return projectPackingList.reduce((acc, item) => {
//       const category = item.category;
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(item);
//       return acc;
//     }, {} as Record<KitCategory, TKitChecklistItem[]>);
//   }, [projectPackingList]);

//   return (
//     <List.AccordionGroup>
//       {PHOTOGRAPHY_PACKING_LIST.map(({ type, displayName, Icon }) => {
//         const categoryItems = groupedItems[type] || [];
//         if (categoryItems.length === 0) return null;

//         const packedCount = categoryItems.filter(item => item.packed).length;
//         const totalCount = categoryItems.length;

//         return (
//           <List.Accordion
//             key={type}
//             title={`${displayName} (${packedCount}/${totalCount})`}
//             id={type}
//             left={props => <Icon {...props} style={styles.icon} />}
//           >
//             {categoryItems.map((item) => (
//               <Checkbox.Item
//                 key={item.id}
//                 label={`${item.name} (Qty: ${item.quantity || 1})`}
//                 status={item.packed ? 'checked' : 'unchecked'}
//                 onPress={() => togglePackedStatus(item.id, item.packed)}
//                 style={styles.checklistItem}
//               />
//             ))}
//           </List.Accordion>
//         );
//       })}
//     </List.AccordionGroup>
//   );
// };

// const styles = StyleSheet.create({
//   icon: {
//     marginHorizontal: 8,
//     alignSelf: 'center',
//   },
//   checklistItem: {
//     paddingLeft: 20,
//     backgroundColor: '#fff',
//   },
// });

// /*-------------------------------------*/
// // components/views/KitChecklistView.tsx
// // Status: Complete
// // What it does: 
// // Displays the entire kit checklist, grouped by category in expandable sections.
// // It uses the KitChecklistContext to get items and provides functionality to toggle their 'packed' status.
// /*-------------------------------------*/

// import React, { useMemo } from 'react';
// import { ScrollView, StyleSheet } from 'react-native';
// import { ActivityIndicator, Checkbox, List, Text } from 'react-native-paper';
// import { PHOTOGRAPHY_PACKING_LIST } from '../../constants/kitChecklistTypes';
// import { useKitChecklistContext } from '../../contexts/KitChecklistContext';
// import { TKitChecklistItem } from '../../types/kitChecklist';

// // A helper to group items by category for rendering
// const groupItemsByCategory = (items: TKitChecklistItem[]) => {
//   return items.reduce((acc, item) => {
//     const category = item.category;
//     if (!acc[category]) {
//       acc[category] = [];
//     }
//     acc[category].push(item);
//     return acc;
//   }, {} as Record<string, TKitChecklistItem[]>);
// };

// export const KitChecklistView = () => {
//   const { items, loading, error, togglePackedStatus } = useKitChecklistContext();

//   // Memoize the grouped items to prevent re-calculation on every render
//   const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);

//   if (loading && items.length === 0) {
//     return <ActivityIndicator animating={true} size="large" style={styles.centered} />;
//   }

//   if (error) {
//     return <Text style={styles.centered}>Error: {error.message}</Text>;
//   }

//   if (!items || items.length === 0) {
//     return <Text style={styles.centered}>No checklist items found for this project.</Text>;
//   }

//   return (
//     <ScrollView>
//       <List.Section>
//         {PHOTOGRAPHY_PACKING_LIST.map(({ type, displayName, Icon }) => {
//           const categoryItems = groupedItems[type] || [];
//           if (categoryItems.length === 0) return null;

//           const packedCount = categoryItems.filter(item => item.packed).length;

//           return (
//             <List.Accordion
//               key={type}
//               title={`${displayName} (${packedCount}/${categoryItems.length})`}
//               left={props => <Icon {...props} width={24} height={24} />}
//               style={styles.accordion}
//             >
//               {categoryItems.map((item) => (
//                 <Checkbox.Item
//                   key={item.id} // Use Firestore document ID as key
//                   label={item.name}
//                   status={item.packed ? 'checked' : 'unchecked'}
//                   onPress={() => togglePackedStatus(item.id, item.packed)}
//                   style={styles.checklistItem}
//                 />
//               ))}
//             </List.Accordion>
//           );
//         })}
//       </List.Section>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   accordion: {
//     backgroundColor: '#f7f7f7',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   checklistItem: {
//     paddingLeft: 20,
//     backgroundColor: '#fff',
//   },
// });
