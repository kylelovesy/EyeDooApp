import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, List, Snackbar, Text, TextInput } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { GenericIcon, PREDEFINED_CATEGORY_ICONS } from '../../constants/kitChecklistTypes';
import { TKitChecklistItem, TMasterCategory } from '../../types/kitChecklist';

interface MasterKitFormProps {
  initialKitList: TKitChecklistItem[];
  initialCategories: TMasterCategory[];
  onSave: (updatedList: TKitChecklistItem[], updatedCategories: TMasterCategory[]) => void;
  onCancel: () => void;
  isSaving: boolean;
  title?: string;
}

const MasterKitForm: React.FC<MasterKitFormProps> = ({ 
  initialKitList, 
  initialCategories, 
  onSave, 
  onCancel, 
  isSaving,
  title = "Edit Photography Kit"
}) => {
  // Working copies - these are what get modified during editing
  const [workingKitList, setWorkingKitList] = useState<TKitChecklistItem[]>([]);
  const [workingCategories, setWorkingCategories] = useState<TMasterCategory[]>([]);
  
  const [newItemName, setNewItemName] = useState<{ [categoryId: string]: string }>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('MasterKitForm: Initializing with', initialKitList.length, 'items and', initialCategories.length, 'categories');
      // Create deep copies for working data
      setWorkingKitList(JSON.parse(JSON.stringify(initialKitList)));
      setWorkingCategories(JSON.parse(JSON.stringify(initialCategories)));
    } catch (error) {
      console.error('MasterKitForm: Error initializing data:', error);
      setError('Failed to load master kit data');
    }
  }, [initialKitList, initialCategories]);

  const groupedList = useMemo(() => {
    try {
      const groups: { [categoryId: string]: TKitChecklistItem[] } = {};
      workingKitList.forEach(item => {
        if (!groups[item.categoryId]) {
          groups[item.categoryId] = [];
        }
        groups[item.categoryId]?.push(item);
      });
      return groups;
    } catch (error) {
      console.error('MasterKitForm: Error grouping items:', error);
      return {};
    }
  }, [workingKitList]);

  // --- Item Handlers ---
  const handleAddItem = (categoryId: string) => {
    try {
      const name = newItemName[categoryId]?.trim();
      if (!name) {
        setError('Please enter an item name');
        return;
      }
      
      console.log('MasterKitForm: Adding item', name, 'to category', categoryId);
      const newItem: TKitChecklistItem = {
        id: uuidv4(),
        name,
        categoryId,
        quantity: 1,
        isPredefined: false,
        packed: false,
        notes: '',
      };
      setWorkingKitList(prev => [...prev, newItem]);
      setNewItemName(prev => ({ ...prev, [categoryId]: '' }));
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error adding item:', error);
      setError('Failed to add item');
    }
  };

  const handleDeleteItem = (id: string) => {
    try {
      console.log('MasterKitForm: Deleting item', id);
      setWorkingKitList(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error deleting item:', error);
      setError('Failed to delete item');
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    try {
      console.log('MasterKitForm: Changing quantity for item', id, 'to', newQuantity);
      setWorkingKitList(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ));
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error changing quantity:', error);
      setError('Failed to update quantity');
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    try {
      const name = newCategoryName.trim();
      if (!name) {
        setError('Please enter a category name');
        return;
      }
      
      console.log('MasterKitForm: Adding category', name);
      const newCategory: TMasterCategory = {
        id: `cat_${uuidv4()}`,
        displayName: name,
        isPredefined: false,
      };
      setWorkingCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryToDelete: TMasterCategory) => {
    try {
      Alert.alert(
        `Delete "${categoryToDelete.displayName}"?`, 
        "All items in this category will also be deleted.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete", 
            style: "destructive",
            onPress: () => {
              try {
                console.log('MasterKitForm: Deleting category', categoryToDelete.id);
                setWorkingCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
                setWorkingKitList(prev => prev.filter(item => item.categoryId !== categoryToDelete.id));
                setError(null);
              } catch (error) {
                console.error('MasterKitForm: Error deleting category:', error);
                setError('Failed to delete category');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('MasterKitForm: Error showing delete confirmation:', error);
      setError('Failed to delete category');
    }
  };

  const handleSave = () => {
    try {
      console.log('MasterKitForm: Saving master kit with', workingKitList.length, 'items and', workingCategories.length, 'categories');
      // Only now do we actually save the data by calling the parent's onSave
      onSave(workingKitList, workingCategories);
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error saving:', error);
      setError('Failed to save master kit');
    }
  };

  const handleCancel = () => {
    try {
      // Reset working data to original values
      setWorkingKitList(JSON.parse(JSON.stringify(initialKitList)));
      setWorkingCategories(JSON.parse(JSON.stringify(initialCategories)));
      setNewItemName({});
      setNewCategoryName('');
      setError(null);
      onCancel();
    } catch (error) {
      console.error('MasterKitForm: Error cancelling:', error);
      setError('Failed to cancel');
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text variant="headlineSmall" style={styles.title}>{title}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <List.AccordionGroup>
          {workingCategories.map((category) => {
            const itemsInCategory = groupedList[category.id] || [];
            const Icon = PREDEFINED_CATEGORY_ICONS[category.id] || GenericIcon;

            return (
              <List.Accordion 
                key={category.id} 
                title={category.displayName || 'Unnamed Category'} 
                id={String(category.id)}
                left={(props) => (
                  <View style={styles.iconContainer}>
                    <Icon 
                      width={20} 
                      height={20} 
                      color={props.color}
                      style={styles.icon} 
                    />
                  </View>
                )}
              >
                {itemsInCategory.map(item => (
                  <List.Item 
                    key={item.id} 
                    title={item.name} 
                    titleNumberOfLines={1}
                    left={() => (
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleDeleteItem(item.id)} 
                      />
                    )}
                    right={() => (
                      <View style={styles.quantityControl}>
                        <IconButton 
                          icon="minus" 
                          size={16} 
                          onPress={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} 
                        />
                        <Text style={styles.quantityText}>{item.quantity || 0}</Text>
                        <IconButton 
                          icon="plus" 
                          size={16} 
                          onPress={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)} 
                        />
                      </View>
                    )}
                  />
                ))}
                <View style={styles.addItemRow}>
                  <TextInput 
                    style={styles.input} 
                    label={`Add to ${category.displayName}`} 
                    value={newItemName[category.id] || ''} 
                    onChangeText={text => setNewItemName(prev => ({ ...prev, [category.id]: text }))} 
                  />
                  <IconButton 
                    icon="plus-circle" 
                    mode="contained" 
                    size={24} 
                    onPress={() => handleAddItem(category.id)} 
                  />
                </View>
                {!category.isPredefined && (
                  <View style={styles.categoryActions}>
                    <Button 
                      icon="delete-sweep" 
                      onPress={() => handleDeleteCategory(category)}
                    >
                      Remove Category
                    </Button>
                  </View>
                )}
              </List.Accordion>
            );
          })}
        </List.AccordionGroup>
        
        <Divider style={styles.divider} />
        
        <View style={styles.addCategorySection}>
          <Text variant="titleMedium">Add New Category</Text>
          <View style={styles.addItemRow}>
            <TextInput 
              style={styles.input} 
              label="New Category Name" 
              value={newCategoryName} 
              onChangeText={setNewCategoryName} 
            />
            <Button mode="contained" onPress={handleAddCategory}>Add</Button>
          </View>
        </View>
      </ScrollView>
      
      {/* Save and Cancel buttons */}
      <View style={styles.buttonRow}>
        <Button 
          mode="outlined" 
          onPress={handleCancel} 
          disabled={isSaving}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={isSaving} 
          disabled={isSaving}
          style={styles.saveButton}
        >
          Save Kit List
        </Button>
      </View>

      {error && (
        <Snackbar
          visible={!!error}
          onDismiss={() => setError(null)}
          duration={4000}
          action={{
            label: 'Dismiss',
            onPress: () => setError(null),
          }}
        >
          {error}
        </Snackbar>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 16 },
  titleContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa'
  },
  title: { 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  scrollContainer: { flex: 1 },
  iconContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 40,
    height: 40,
  },
  icon: { 
    marginHorizontal: 8, 
    alignSelf: 'center' 
  },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { minWidth: 20, textAlign: 'center', fontSize: 16 },
  addItemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  input: { flex: 1, marginRight: 8 },
  categoryActions: { alignItems: 'flex-start', paddingLeft: 12, paddingBottom: 8 },
  divider: { marginVertical: 24, marginHorizontal: 16 },
  addCategorySection: { paddingHorizontal: 16 },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16, 
    paddingTop: 16, 
    paddingHorizontal: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#eee',
    backgroundColor: '#f8f9fa'
  },
  cancelButton: { 
    flex: 0.45 
  },
  saveButton: { 
    flex: 0.45 
  },
});

export default MasterKitForm;

// /*-------------------------------------*/
// // components/kit/MasterKitForm.tsx
// // Status: Updated
// // What it does: 
// // A fully dynamic form for editing the master kit. It renders categories from state,
// // allows adding/deleting items within each, and includes a new UI for creating
// // and deleting custom categories. Now includes proper error handling.
// /*-------------------------------------*/

// import React, { useEffect, useMemo, useState } from 'react';
// import { Alert, ScrollView, StyleSheet, View } from 'react-native';
// import { BodyText, Button, Divider, IconButton, List, Snackbar, Text, TextInput } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// import { GenericIcon, PREDEFINED_CATEGORY_ICONS } from '../../constants/kitChecklistTypes';
// import { TKitChecklistItem, TMasterCategory } from '../../types/kitChecklist';

// interface MasterKitFormProps {
//   initialKitList: TKitChecklistItem[];
//   initialCategories: TMasterCategory[];
//   onSave: (updatedList: TKitChecklistItem[], updatedCategories: TMasterCategory[]) => void;
//   onCancel: () => void;
//   isSaving: boolean;
// }

// const MasterKitForm: React.FC<MasterKitFormProps> = ({ initialKitList, initialCategories, onSave, onCancel, isSaving }) => {
//   const [kitList, setKitList] = useState<TKitChecklistItem[]>([]);
//   const [categories, setCategories] = useState<TMasterCategory[]>([]);
//   const [newItemName, setNewItemName] = useState<{ [categoryId: string]: string }>({});
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       console.log('MasterKitForm: Initializing with', initialKitList.length, 'items and', initialCategories.length, 'categories');
//       setKitList(JSON.parse(JSON.stringify(initialKitList)));
//       setCategories(JSON.parse(JSON.stringify(initialCategories)));
//     } catch (error) {
//       console.error('MasterKitForm: Error initializing data:', error);
//       setError('Failed to load master kit data');
//     }
//   }, [initialKitList, initialCategories]);

//   const groupedList = useMemo(() => {
//     try {
//       const groups: { [categoryId: string]: TKitChecklistItem[] } = {};
//       kitList.forEach(item => {
//         if (!groups[item.categoryId]) {
//           groups[item.categoryId] = [];
//         }
//         groups[item.categoryId]?.push(item);
//       });
//       return groups;
//     } catch (error) {
//       console.error('MasterKitForm: Error grouping items:', error);
//       return {};
//     }
//   }, [kitList]);

//   // --- Item Handlers ---
//   const handleAddItem = (categoryId: string) => {
//     try {
//       const name = newItemName[categoryId]?.trim();
//       if (!name) {
//         setError('Please enter an item name');
//         return;
//       }
      
//       console.log('MasterKitForm: Adding item', name, 'to category', categoryId);
//       const newItem: TKitChecklistItem = {
//         id: uuidv4(),
//         name,
//         categoryId,
//         quantity: 1,
//         isPredefined: false,
//         packed: false,
//         notes: '',
//       };
//       setKitList(prev => [...prev, newItem]);
//       setNewItemName(prev => ({ ...prev, [categoryId]: '' }));
//       setError(null);
//     } catch (error) {
//       console.error('MasterKitForm: Error adding item:', error);
//       setError('Failed to add item');
//     }
//   };

//   const handleDeleteItem = (id: string) => {
//     try {
//       console.log('MasterKitForm: Deleting item', id);
//       setKitList(prev => prev.filter(item => item.id !== id));
//       setError(null);
//     } catch (error) {
//       console.error('MasterKitForm: Error deleting item:', error);
//       setError('Failed to delete item');
//     }
//   };

//   const handleQuantityChange = (id: string, newQuantity: number) => {
//     try {
//       console.log('MasterKitForm: Changing quantity for item', id, 'to', newQuantity);
//       setKitList(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item));
//       setError(null);
//     } catch (error) {
//       console.error('MasterKitForm: Error changing quantity:', error);
//       setError('Failed to update quantity');
//     }
//   };

//   // --- Category Handlers ---
//   const handleAddCategory = () => {
//     try {
//       const name = newCategoryName.trim();
//       if (!name) {
//         setError('Please enter a category name');
//         return;
//       }
      
//       console.log('MasterKitForm: Adding category', name);
//       const newCategory: TMasterCategory = {
//         id: `cat_${uuidv4()}`,
//         displayName: name,
//         isPredefined: false,
//       };
//       setCategories(prev => [...prev, newCategory]);
//       setNewCategoryName('');
//       setError(null);
//     } catch (error) {
//       console.error('MasterKitForm: Error adding category:', error);
//       setError('Failed to add category');
//     }
//   };

//   const handleDeleteCategory = (categoryToDelete: TMasterCategory) => {
//     try {
//       Alert.alert(
//         `Delete "${categoryToDelete.displayName}"?`, 
//         "All items in this category will also be deleted.",
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Delete", 
//             style: "destructive",
//             onPress: () => {
//               try {
//                 console.log('MasterKitForm: Deleting category', categoryToDelete.id);
//                 setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
//                 setKitList(prev => prev.filter(item => item.categoryId !== categoryToDelete.id));
//                 setError(null);
//               } catch (error) {
//                 console.error('MasterKitForm: Error deleting category:', error);
//                 setError('Failed to delete category');
//               }
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       console.error('MasterKitForm: Error showing delete confirmation:', error);
//       setError('Failed to delete category');
//     }
//   };

//   const handleSave = () => {
//     try {
//       console.log('MasterKitForm: Saving master kit with', kitList.length, 'items and', categories.length, 'categories');
//       onSave(kitList, categories);
//       setError(null);
//     } catch (error) {
//       console.error('MasterKitForm: Error saving:', error);
//       setError('Failed to save master kit');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollContainer}>
//         <List.AccordionGroup>
//           {categories.map((category) => {
//             const itemsInCategory = groupedList[category.id] || [];
//             const Icon = PREDEFINED_CATEGORY_ICONS[category.id] || GenericIcon;

//             return (
//               <List.Accordion 
//                 key={category.id} 
//                 title={category.displayName || 'Unnamed Category'} 
//                 id={String(category.id)}
//                 left={(props) => (
//                   <View style={styles.iconContainer}>
//                     <Icon 
//                       width={20} 
//                       height={20} 
//                       color={props.color}
//                       style={styles.icon} 
//                     />
//                   </View>
//                 )}
//               >
//                 {itemsInCategory.map(item => (
//                   <List.Item 
//                     key={item.id} 
//                     title={item.name} 
//                     titleNumberOfLines={1}
//                     left={() => (
//                       <IconButton 
//                         icon="delete" 
//                         size={18} 
//                         onPress={() => handleDeleteItem(item.id)} 
//                       />
//                     )}
//                     right={() => (
//                       <View style={styles.quantityControl}>
//                         <IconButton 
//                           icon="minus" 
//                           size={16} 
//                           onPress={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} 
//                         />
//                         <Text style={styles.quantityText}>{item.quantity || 0}</Text>
//                         <IconButton 
//                           icon="plus" 
//                           size={16} 
//                           onPress={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)} 
//                         />
//                       </View>
//                     )}
//                   />
//                 ))}
//                 <View style={styles.addItemRow}>
//                   <TextInput 
//                     style={styles.input} 
//                     label={`Add to ${category.displayName}`} 
//                     value={newItemName[category.id] || ''} 
//                     onChangeText={text => setNewItemName(prev => ({ ...prev, [category.id]: text }))} 
//                   />
//                   <IconButton 
//                     icon="plus-circle" 
//                     mode="contained" 
//                     size={20} 
//                     onPress={() => handleAddItem(category.id)} 
//                   />
//                 </View>
//                 {!category.isPredefined && (
//                   <View style={styles.categoryActions}>
//                     <Button 
//                       icon="delete-sweep" 
//                       onPress={() => handleDeleteCategory(category)}
//                     >
//                       Remove Category
//                     </Button>
//                   </View>
//                 )}
//               </List.Accordion>
//             );
//           })}
//         </List.AccordionGroup>
        
//         <Divider style={styles.divider} />
        
//         <View style={styles.addCategorySection}>
//           <BodyText size="medium">Add New Category</BodyText>
//           <View style={styles.addItemRow}>
//             <TextInput 
//               style={styles.input} 
//               label="New Category Name" 
//               value={newCategoryName} 
//               onChangeText={setNewCategoryName} 
//             />
//             <Button mode="contained" onPress={handleAddCategory}>Add</Button>
//           </View>
//         </View>
//       </ScrollView>
      
//       <View style={styles.buttonRow}>
//         <Button onPress={onCancel} disabled={isSaving}>Cancel</Button>
//         <Button 
//           mode="contained" 
//           onPress={handleSave} 
//           loading={isSaving} 
//           disabled={isSaving}
//         >
//           Confirm Kit List
//         </Button>
//       </View>

//       {error && (
//         <Snackbar
//           visible={!!error}
//           onDismiss={() => setError(null)}
//           duration={4000}
//           action={{
//             label: 'Dismiss',
//             onPress: () => setError(null),
//           }}
//         >
//           {error}
//         </Snackbar>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingBottom: 16 },
//   scrollContainer: { flex: 1 },
//   iconContainer: { 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     width: 40,
//     height: 40,
//   },
//   icon: { 
//     marginHorizontal: 8, 
//     alignSelf: 'center' 
//   },
//   quantityControl: { flexDirection: 'row', alignItems: 'center' },
//   quantityText: { minWidth: 20, textAlign: 'center', fontSize: 16 },
//   addItemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
//   input: { flex: 1, marginRight: 8 },
//   categoryActions: { alignItems: 'flex-start', paddingLeft: 12, paddingBottom: 8 },
//   divider: { marginVertical: 24, marginHorizontal: 16 },
//   addCategorySection: { paddingHorizontal: 16 },
//   buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#eee' },
// });

// export default MasterKitForm;
//------------------------------------------------------------------------------
// /*-------------------------------------*/
// // components/kit/MasterKitForm.tsx
// // Status: Updated
// // What it does: 
// // A form for editing the user's Master Kit List, now using accordions to group
// // items by category. It allows for modifying quantities, deleting items, adding new
// // custom items per category, and deleting entire categories.
// /*-------------------------------------*/

// import React, { useEffect, useMemo, useState } from 'react';
// import { Alert, StyleSheet, View } from 'react-native';
// import { Button, IconButton, List, Text, TextInput } from 'react-native-paper';
// import { v4 as uuidv4 } from 'uuid';
// import { KitCategory, PHOTOGRAPHY_PACKING_LIST } from '../../constants/kitChecklistTypes';
// import { TKitChecklistItem } from '../../types/kitChecklist';

// interface MasterKitFormProps {
//   initialKitList: TKitChecklistItem[];
//   onSave: (updatedList: TKitChecklistItem[]) => void;
//   onCancel: () => void;
//   isSaving: boolean;
// }

// const MasterKitForm: React.FC<MasterKitFormProps> = ({ initialKitList, onSave, onCancel, isSaving }) => {
//   const [kitList, setKitList] = useState<TKitChecklistItem[]>([]);
//   const [newItemName, setNewItemName] = useState<{ [key in KitCategory]?: string }>({});

//   useEffect(() => {
//     setKitList(JSON.parse(JSON.stringify(initialKitList)));
//   }, [initialKitList]);

//   const groupedList = useMemo(() => {
//     const groups: { [key in KitCategory]?: TKitChecklistItem[] } = {};
//     kitList.forEach(item => {
//       if (!groups[item.category]) {
//         groups[item.category] = [];
//       }
//       groups[item.category]?.push(item);
//     });
//     return groups;
//   }, [kitList]);

//   const handleQuantityChange = (id: string, newQuantity: number) => {
//     setKitList(prevList =>
//       prevList.map(item =>
//         item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
//       )
//     );
//   };

//   const handleDeleteItem = (id: string) => {
//     setKitList(prevList => prevList.filter(item => item.id !== id));
//   };

//   const handleAddItem = (category: KitCategory) => {
//     const name = newItemName[category]?.trim();
//     if (!name) return;

//     const newItem: TKitChecklistItem = {
//       id: uuidv4(),
//       name: name,
//       category: category,
//       quantity: 1,
//       // Predefined: false,
//       packed: false,
//       notes: '',
//     };
//     setKitList(prevList => [...prevList, newItem]);
//     setNewItemName(prev => ({ ...prev, [category]: '' }));
//   };

//   const handleDeleteCategory = (category: KitCategory) => {
//     Alert.alert(
//       `Delete ${category}?`,
//       "Are you sure you want to remove this entire category and all its items?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive", 
//           onPress: () => setKitList(prevList => prevList.filter(item => item.category !== category))
//         }
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <List.AccordionGroup>
//         {PHOTOGRAPHY_PACKING_LIST.map(({ type, displayName, Icon }) => {
//           const itemsInCategory = groupedList[type] || [];
//           if (itemsInCategory.length === 0) return null; // Don't show empty categories

//           return (
//             <List.Accordion
//               key={type}
//               title={displayName}
//               id={type}
//               left={props => <Icon {...props} style={styles.icon} />}
//             >
//               {itemsInCategory.map(item => (
//                 <List.Item
//                   key={item.id}
//                   title={item.name}
//                   titleNumberOfLines={1}
//                   left={() => <IconButton icon="delete" size={20} onPress={() => handleDeleteItem(item.id)} />}
//                   right={() => (
//                     <View style={styles.quantityControl}>
//                       <IconButton icon="minus" size={16} onPress={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} />
//                       <Text style={styles.quantityText}>{item.quantity || 0}</Text>
//                       <IconButton icon="plus" size={16} onPress={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)} />
//                     </View>
//                   )}
//                 />
//               ))}
//               <View style={styles.addItemRow}>
//                 <TextInput
//                   style={styles.input}
//                   label={`Add to ${displayName}`}
//                   value={newItemName[type] || ''}
//                   onChangeText={text => setNewItemName(prev => ({ ...prev, [type]: text }))}
//                 />
//                 <IconButton icon="plus-circle" mode="contained" size={24} onPress={() => handleAddItem(type)} />
//               </View>
//                <View style={styles.categoryActions}>
//                  <Button icon="delete-sweep" onPress={() => handleDeleteCategory(type)}>
//                    Remove Category
//                  </Button>
//                </View>
//             </List.Accordion>
//           );
//         })}
//       </List.AccordionGroup>
//       <View style={styles.buttonRow}>
//         <Button onPress={onCancel} disabled={isSaving}>Cancel</Button>
//         <Button mode="contained" onPress={() => onSave(kitList)} loading={isSaving} disabled={isSaving}>
//           Confirm Kit List
//         </Button>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 0,
//     paddingBottom: 16,
//   },
//   icon: {
//     marginHorizontal: 8,
//     alignSelf: 'center',
//   },
//   quantityControl: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityText: {
//     minWidth: 20,
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   addItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   input: {
//     flex: 1,
//     marginRight: 8,
//   },
//   categoryActions: {
//     alignItems: 'flex-start',
//     paddingLeft: 12,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 24,
//     paddingTop: 16,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
// });

// export default MasterKitForm;



// /*-------------------------------------*/
// // components/kit/MasterKitForm.tsx
// // Status: New
// // What it does: 
// // A form for editing the user's entire Master Kit List. It allows for modifying
// // quantities, deleting items, and adding new custom items to the list.
// /*-------------------------------------*/

// // import React, { useEffect, useState } from 'react';
// // import { FlatList, StyleSheet, View } from 'react-native';
// // import { Button, IconButton, Text, TextInput } from 'react-native-paper';
// // import { v4 as uuidv4 } from 'uuid';
// // import { KitCategory } from '../../constants/kitChecklistTypes';
// // import { TKitChecklistItem } from '../../types/kitChecklist';

// // interface MasterKitFormProps {
// //   initialKitList: TKitChecklistItem[];
// //   onSave: (updatedList: TKitChecklistItem[]) => void;
// //   onCancel: () => void;
// //   isSaving: boolean;
// // }

// // const MasterKitForm: React.FC<MasterKitFormProps> = ({ initialKitList, onSave, onCancel, isSaving }) => {
// //   const [kitList, setKitList] = useState<TKitChecklistItem[]>([]);
// //   const [newItemName, setNewItemName] = useState('');

// //   useEffect(() => {
// //     // Deep copy the initial list to avoid direct state mutation
// //     setKitList(JSON.parse(JSON.stringify(initialKitList)));
// //   }, [initialKitList]);

// //   const handleQuantityChange = (id: string, newQuantity: number) => {
// //     const updatedList = kitList.map(item =>
// //       item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
// //     );
// //     setKitList(updatedList);
// //   };

// //   const handleDeleteItem = (id: string) => {
// //     const updatedList = kitList.filter(item => item.id !== id);
// //     setKitList(updatedList);
// //   };

// //   const handleAddItem = () => {
// //     if (newItemName.trim() === '') return;
// //     const newItem: TKitChecklistItem = {
// //       id: uuidv4(),
// //       name: newItemName.trim(),
// //       category: KitCategory.ESSENTIALS, // Default category for custom items
// //       quantity: 1,
// //       // isPredefined: false,
// //       packed: false,
// //       notes: '',
// //     };
// //     setKitList([...kitList, newItem]);
// //     setNewItemName('');
// //   };

// //   const renderItem = ({ item }: { item: TKitChecklistItem }) => (
// //     <View style={styles.itemRow}>
// //       <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
// //       <View style={styles.quantityControl}>
// //         <IconButton icon="minus" size={16} onPress={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} />
// //         <Text>{item.quantity || 0}</Text>
// //         <IconButton icon="plus" size={16} onPress={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)} />
// //       </View>
// //       <IconButton icon="delete-outline" size={20} onPress={() => handleDeleteItem(item.id)} />
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={kitList}
// //         renderItem={renderItem}
// //         keyExtractor={(item) => item.id}
// //         style={styles.list}
// //       />
// //       <View style={styles.addItemRow}>
// //         <TextInput
// //           style={styles.input}
// //           label="Add Custom Item"
// //           value={newItemName}
// //           onChangeText={setNewItemName}
// //         />
// //         <Button mode="contained" onPress={handleAddItem} style={styles.addButton}>Add</Button>
// //       </View>
// //       <View style={styles.buttonRow}>
// //         <Button onPress={onCancel} disabled={isSaving}>Cancel</Button>
// //         <Button mode="contained" onPress={() => onSave(kitList)} loading={isSaving} disabled={isSaving}>
// //           Confirm Kit List
// //         </Button>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 16,
// //     height: '80%', // Make the form take up most of the modal height
// //   },
// //   list: {
// //     flex: 1,
// //   },
// //   itemRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingVertical: 4,
// //   },
// //   itemName: {
// //     flex: 1,
// //     fontSize: 16,
// //   },
// //   quantityControl: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   addItemRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 16,
// //   },
// //   input: {
// //     flex: 1,
// //     marginRight: 8,
// //   },
// //   addButton: {
// //     justifyContent: 'center',
// //   },
// //   buttonRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-end',
// //     marginTop: 24,
// //     paddingTop: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: '#eee',
// //   },
// // });

// // export default MasterKitForm;
