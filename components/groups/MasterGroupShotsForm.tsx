import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, List, Snackbar, Text, TextInput } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { GenericIcon, PREDEFINED_GROUPSHOT_CATEGORY_ICONS } from '../../constants/groupShotsChecklistTypes';
import { TGroupShotsChecklistItem, TMasterGroupShotsCategory } from '../../types/groupShotsChecklist';

interface MasterGroupShotsFormProps {
  initialGroupShotsList: TGroupShotsChecklistItem[];
  initialGroupShotsCategories: TMasterGroupShotsCategory[];
  onSave: (updatedList: TGroupShotsChecklistItem[], updatedCategories: TMasterGroupShotsCategory[]) => void;
  onCancel: () => void;
  isSaving: boolean;
  title?: string;
}

const MasterGroupShotsForm: React.FC<MasterGroupShotsFormProps> = ({ 
  initialGroupShotsList, 
  initialGroupShotsCategories, 
  onSave, 
  onCancel, 
  isSaving,
  title
}) => {
  // Working copies - these are what get modified during editing
  const [workingGroupShotsCategories, setWorkingGroupShotsCategories] = useState<TMasterGroupShotsCategory[]>([]);
  const [workingGroupShotsList, setWorkingGroupShotsList] = useState<TGroupShotsChecklistItem[]>([]);
  
  
  const [newGroupShotName, setNewGroupShotName] = useState<{ [categoryId: string]: string }>({});
  const [newGroupShotCategoryName, setNewGroupShotCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('MasterGroupShotsForm: Initializing with', initialGroupShotsList.length, 'group shots and', initialGroupShotsCategories.length, 'categories');
      // Create deep copies for working data
      setWorkingGroupShotsList(JSON.parse(JSON.stringify(initialGroupShotsList)));
      setWorkingGroupShotsCategories(JSON.parse(JSON.stringify(initialGroupShotsCategories)));
    } catch (error) {
      console.error('MasterGroupShotsForm: Error initializing data:', error);
      setError('Failed to load master group shot data');
    }
  }, [initialGroupShotsList, initialGroupShotsCategories]);

  const groupedList = useMemo(() => {
    try {
      const shots: { [categoryId: string]: TGroupShotsChecklistItem[] } = {};
      workingGroupShotsList.forEach(shot => {
        if (!shots[shot.categoryId]) {
          shots[shot.categoryId] = [];
        }
        shots[shot.categoryId]?.push(shot);
      });
      return shots;
    } catch (error) {
      console.error('MasterGroupShotsForm: Error grouping group shots:', error);
      return {};
    }
  }, [workingGroupShotsList]);

  // --- Group Shot Handlers ---
  const handleAddGroupShot = (categoryId: string) => {
    try {
      const name = newGroupShotName[categoryId]?.trim();
      if (!name) {
        setError('Please enter a group shot name');
        return;
      }
      
      console.log('MasterGroupShotsForm: Adding group shot', name, 'to category', categoryId);
      const newGroupShot: TGroupShotsChecklistItem = {
        id: uuidv4(),
        name,
        categoryId,
        completed: false,
        isPredefined: false,
        notes: '',
      };
      setWorkingGroupShotsList(prev => [...prev, newGroupShot]);
      setNewGroupShotName(prev => ({ ...prev, [categoryId]: '' }));
      setError(null);
    } catch (error) {
      console.error('MasterGroupShotsForm: Error adding group shot:', error);
      setError('Failed to add group shot');
    }
  };

  const handleDeleteGroupShot = (id: string) => {
    try {
      console.log('MasterGroupShotsForm: Deleting group shot', id);
      setWorkingGroupShotsList(prev => prev.filter(shot => shot.id !== id));
      setError(null);
    } catch (error) {
      console.error('MasterGroupShotsForm: Error deleting group shot:', error);
      setError('Failed to delete group shot');
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
      const name = newGroupShotCategoryName.trim();
      if (!name) {
        setError('Please enter a category name');
        return;
      }
      
      console.log('MasterGroupShotsForm: Adding category', name);
      const newCategory: TMasterGroupShotsCategory = {
        id: `cat_${uuidv4()}`,
        displayName: name,
        isPredefined: false,
      };
      setWorkingGroupShotsCategories(prev => [...prev, newCategory]);
      setNewGroupShotCategoryName('');
      setError(null);
    } catch (error) {
      console.error('MasterGroupShotsForm: Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryToDelete: TMasterGroupShotsCategory) => {
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
                console.log('MasterGroupShotsForm: Deleting category', categoryToDelete.id);
                setWorkingGroupShotsCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
                setWorkingGroupShotsList(prev => prev.filter(shot => shot.categoryId !== categoryToDelete.id));
                setError(null);
              } catch (error) {
                console.error('MasterGroupShotsForm: Error deleting category:', error);
                setError('Failed to delete category');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('MasterGroupShotsForm: Error showing delete confirmation:', error);
      setError('Failed to delete category');
    }
  };

  const handleSave = () => {
    try {
      console.log('MasterGroupShotsForm: Saving master group shot list with', workingGroupShotsList.length, 'group shots and', workingGroupShotsCategories.length, 'categories');
      // Only now do we actually save the data by calling the parent's onSave
      onSave(workingGroupShotsList, workingGroupShotsCategories);
      setError(null);
    } catch (error) {
      console.error('MasterGroupShotsForm: Error saving:', error);
      setError('Failed to save master group shot list');
    }
  };

  const handleCancel = () => {
    try {
      // Reset working data to original values
      setWorkingGroupShotsList(JSON.parse(JSON.stringify(initialGroupShotsList)));
      setWorkingGroupShotsCategories(JSON.parse(JSON.stringify(initialGroupShotsCategories)));
      setNewGroupShotName({});
      setNewGroupShotCategoryName('');
      setError(null);
      onCancel();
    } catch (error) {
      console.error('MasterGroupShotsForm: Error cancelling:', error);
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
          {workingGroupShotsCategories.map((groupShotCategory) => {
            const groupShotsInCategory = groupedList[groupShotCategory.id] || [];
            const Icon = PREDEFINED_GROUPSHOT_CATEGORY_ICONS[groupShotCategory.id] || GenericIcon;
            {console.log('MasterGroupShotsForm: Working categories:', workingGroupShotsCategories)}
            return (
              <List.Accordion 
                key={groupShotCategory.id} 
                title={groupShotCategory.displayName || 'Unnamed Category'} 
                id={String(groupShotCategory.id)}
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
                {groupShotsInCategory.map(groupShot => (
                  <List.Item 
                    key={groupShot.id} 
                    title={groupShot.name} 
                    titleNumberOfLines={1}
                    left={() => (
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleDeleteGroupShot(groupShot.id)} 
                      />
                    )}                    
                  />
                ))}
                <View style={styles.addItemRow}>
                  <TextInput 
                    style={styles.input} 
                    label={`Add to ${groupShotCategory.displayName}`} 
                    value={newGroupShotName[groupShotCategory.id] || ''} 
                    onChangeText={text => setNewGroupShotName(prev => ({ ...prev, [groupShotCategory.id]: text }))} 
                  />
                  <IconButton 
                    icon="plus-circle" 
                    mode="contained" 
                    size={24} 
                    onPress={() => handleAddGroupShot(groupShotCategory.id)} 
                  />
                </View>
                {!groupShotCategory.isPredefined && (
                  <View style={styles.categoryActions}>
                    <Button 
                      icon="delete-sweep" 
                      onPress={() => handleDeleteCategory(groupShotCategory)}
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
              value={newGroupShotCategoryName} 
              onChangeText={setNewGroupShotCategoryName} 
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

export default MasterGroupShotsForm;

