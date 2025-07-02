import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, List, Snackbar, Text, TextInput } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { GenericIcon, PREDEFINED_COUPLESHOT_CATEGORY_ICONS } from '../../constants/coupleShotsChecklistTypes';
import { TCoupleShotsChecklistItem, TMasterCoupleShotsCategory } from '../../types/coupleShotsChecklist';

interface MasterCoupleShotsFormProps {
  initialCoupleShotsList: TCoupleShotsChecklistItem[];
  initialCoupleShotsCategories: TMasterCoupleShotsCategory[];
  onSave: (updatedList: TCoupleShotsChecklistItem[], updatedCategories: TMasterCoupleShotsCategory[]) => void;
  onCancel: () => void;
  isSaving: boolean;
  title?: string;
}

const MasterCoupleShotsForm: React.FC<MasterCoupleShotsFormProps> = ({ 
  initialCoupleShotsList, 
  initialCoupleShotsCategories, 
  onSave, 
  onCancel, 
  isSaving,
  title
}) => {
  // Working copies - these are what get modified during editing
  const [workingCoupleShotsCategories, setWorkingCoupleShotsCategories] = useState<TMasterCoupleShotsCategory[]>([]);
  const [workingCoupleShotsList, setWorkingCoupleShotsList] = useState<TCoupleShotsChecklistItem[]>([]);
  
  
  const [newCoupleShotName, setNewCoupleShotName] = useState<{ [categoryId: string]: string }>({});
  const [newCoupleShotCategoryName, setNewCoupleShotCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('MasterCoupleShotsForm: Initializing with', initialCoupleShotsList.length, 'couple shots and', initialCoupleShotsCategories.length, 'categories');
      // Create deep copies for working data
      setWorkingCoupleShotsList(JSON.parse(JSON.stringify(initialCoupleShotsList)));
      setWorkingCoupleShotsCategories(JSON.parse(JSON.stringify(initialCoupleShotsCategories)));
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error initializing data:', error);
      setError('Failed to load master couple shot data');
    }
  }, [initialCoupleShotsList, initialCoupleShotsCategories]);

  const groupedList = useMemo(() => {
    try {
      const shots: { [categoryId: string]: TCoupleShotsChecklistItem[] } = {};
      workingCoupleShotsList.forEach(shot => {
        if (!shots[shot.categoryId]) {
          shots[shot.categoryId] = [];
        }
        shots[shot.categoryId]?.push(shot);
      });
      return shots;
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error grouping couple shots:', error);
      return {};
    }
  }, [workingCoupleShotsList]);

  // --- Group Shot Handlers ---
  const handleAddCoupleShot = (categoryId: string) => {
    try {
      const name = newCoupleShotName[categoryId]?.trim();
      if (!name) {
        setError('Please enter a group shot name');
        return;
      }
      
      console.log('MasterCoupleShotsForm: Adding couple shot', name, 'to category', categoryId);
      const newCoupleShot: TCoupleShotsChecklistItem = {
        id: uuidv4(),
        name,
        categoryId,
        completed: false,
        isPredefined: false,
        notes: '',
      };
      setWorkingCoupleShotsList(prev => [...prev, newCoupleShot]);
      setNewCoupleShotName(prev => ({ ...prev, [categoryId]: '' }));
      setError(null);
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error adding couple shot:', error);
      setError('Failed to add couple shot');
    }
  };

  const handleDeleteCoupleShot = (id: string) => {
    try {
      console.log('MasterCoupleShotsForm: Deleting couple shot', id);
      setWorkingCoupleShotsList(prev => prev.filter(shot => shot.id !== id));
      setError(null);
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error deleting couple shot:', error);
      setError('Failed to delete couple shot');
    }
  };

//   const handleCompletedChange = (id: string, newCompleted: boolean) => {
//     try {
//       console.log('MasterTaskForm: Changing completed status for task', id, 'to', newCompleted);
//       setWorkingTaskList(prev => prev.map(task => 
//         task.id === id ? { ...task, completed: newCompleted } : task
//       ));
//       setError(null);
//     } catch (error) {
//       console.error('MasterTaskForm: Error changing completed status:', error);
//       setError('Failed to update completed status');
//     }
//   };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    try {
      const name = newCoupleShotCategoryName.trim();
      if (!name) {
        setError('Please enter a category name');
        return;
      }
      
      console.log('MasterCoupleShotsForm: Adding category', name);
      const newCategory: TMasterCoupleShotsCategory = {
        id: `cat_${uuidv4()}`,
        displayName: name,
        isPredefined: false,
      };
      setWorkingCoupleShotsCategories(prev => [...prev, newCategory]);
      setNewCoupleShotCategoryName('');
      setError(null);
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryToDelete: TMasterCoupleShotsCategory) => {
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
                console.log('MasterCoupleShotsForm: Deleting category', categoryToDelete.id);
                setWorkingCoupleShotsCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
                setWorkingCoupleShotsList(prev => prev.filter(shot => shot.categoryId !== categoryToDelete.id));
                setError(null);
              } catch (error) {
                console.error('MasterCoupleShotsForm: Error deleting category:', error);
                setError('Failed to delete category');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error showing delete confirmation:', error);
      setError('Failed to delete category');
    }
  };

  const handleSave = () => {
    try {
      console.log('MasterCoupleShotsForm: Saving master couple shot list with', workingCoupleShotsList.length, 'couple shots and', workingCoupleShotsCategories.length, 'categories');
      // Only now do we actually save the data by calling the parent's onSave
      onSave(workingCoupleShotsList, workingCoupleShotsCategories);
      setError(null);
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error saving:', error);
      setError('Failed to save master couple shot list');
    }
  };

  const handleCancel = () => {
    try {
      // Reset working data to original values
      setWorkingCoupleShotsList(JSON.parse(JSON.stringify(initialCoupleShotsList)));
      setWorkingCoupleShotsCategories(JSON.parse(JSON.stringify(initialCoupleShotsCategories)));
      setNewCoupleShotName({});
      setNewCoupleShotCategoryName('');
      setError(null);
      onCancel();
    } catch (error) {
      console.error('MasterCoupleShotsForm: Error cancelling:', error);
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
          {workingCoupleShotsCategories.map((coupleShotCategory) => {
            const coupleShotsInCategory = groupedList[coupleShotCategory.id] || [];
            const Icon = PREDEFINED_COUPLESHOT_CATEGORY_ICONS[coupleShotCategory.id] || GenericIcon;
            {console.log('MasterCoupleShotsForm: Working categories:', workingCoupleShotsCategories)}
            return (
              <List.Accordion 
                key={coupleShotCategory.id} 
                title={coupleShotCategory.displayName || 'Unnamed Category'} 
                id={String(coupleShotCategory.id)}
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
                {coupleShotsInCategory.map(coupleShot => (
                  <List.Item 
                    key={coupleShot.id} 
                    title={coupleShot.name} 
                    titleNumberOfLines={1}
                    left={() => (
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleDeleteCoupleShot(coupleShot.id)} 
                      />
                    )}                    
                  />
                ))}
                <View style={styles.addItemRow}>
                  <TextInput 
                    style={styles.input} 
                    label={`Add to ${coupleShotCategory.displayName}`} 
                    value={newCoupleShotName[coupleShotCategory.id] || ''} 
                    onChangeText={text => setNewCoupleShotName(prev => ({ ...prev, [coupleShotCategory.id]: text }))} 
                  />
                  <IconButton 
                    icon="plus-circle" 
                    mode="contained" 
                    size={24} 
                    onPress={() => handleAddCoupleShot(coupleShotCategory.id)} 
                  />
                </View>
                {!coupleShotCategory.isPredefined && (
                  <View style={styles.categoryActions}>
                    <Button 
                      icon="delete-sweep" 
                      onPress={() => handleDeleteCategory(coupleShotCategory)}
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
              value={newCoupleShotCategoryName} 
              onChangeText={setNewCoupleShotCategoryName} 
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
          Save Task List
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

export default MasterCoupleShotsForm;

