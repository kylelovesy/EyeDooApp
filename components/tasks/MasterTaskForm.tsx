import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, List, Snackbar, Text, TextInput } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { GenericIcon, PREDEFINED_TASK_CATEGORY_ICONS } from '../../constants/taskChecklistTypes';
import { TMasterTaskCategory, TTaskChecklistItem } from '../../types/taskChecklist';

interface MasterTaskFormProps {
  initialTaskList: TTaskChecklistItem[];
  initialTaskCategories: TMasterTaskCategory[];
  onSave: (updatedList: TTaskChecklistItem[], updatedCategories: TMasterTaskCategory[]) => void;
  onCancel: () => void;
  isSaving: boolean;
  title?: string;
}

const MasterTaskForm: React.FC<MasterTaskFormProps> = ({ 
  initialTaskList, 
  initialTaskCategories, 
  onSave, 
  onCancel, 
  isSaving,
  title
}) => {
  // Working copies - these are what get modified during editing
  const [workingTaskCategories, setWorkingTaskCategories] = useState<TMasterTaskCategory[]>([]);
  const [workingTaskList, setWorkingTaskList] = useState<TTaskChecklistItem[]>([]);
  
  
  const [newTaskName, setNewTaskName] = useState<{ [categoryId: string]: string }>({});
  const [newTaskCategoryName, setNewTaskCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('MasterTaskForm: Initializing with', initialTaskList.length, 'tasks and', initialTaskCategories.length, 'categories');
      // Create deep copies for working data
      setWorkingTaskList(JSON.parse(JSON.stringify(initialTaskList)));
      setWorkingTaskCategories(JSON.parse(JSON.stringify(initialTaskCategories)));
    } catch (error) {
      console.error('MasterTaskForm: Error initializing data:', error);
      setError('Failed to load master task data');
    }
  }, [initialTaskList, initialTaskCategories]);

  const groupedList = useMemo(() => {
    try {
      const groups: { [categoryId: string]: TTaskChecklistItem[] } = {};
      workingTaskList.forEach(task => {
        if (!groups[task.categoryId]) {
          groups[task.categoryId] = [];
        }
        groups[task.categoryId]?.push(task);
      });
      return groups;
    } catch (error) {
      console.error('MasterTaskForm: Error grouping tasks:', error);
      return {};
    }
  }, [workingTaskList]);

  // --- Task Handlers ---
  const handleAddTask = (categoryId: string) => {
    try {
      const name = newTaskName[categoryId]?.trim();
      if (!name) {
        setError('Please enter a task name');
        return;
      }
      
      console.log('MasterTaskForm: Adding task', name, 'to category', categoryId);
      const newTask: TTaskChecklistItem = {
        id: uuidv4(),
        name,
        categoryId,
        completed: false,
        isPredefined: false,
        notes: '',
      };
      setWorkingTaskList(prev => [...prev, newTask]);
      setNewTaskName(prev => ({ ...prev, [categoryId]: '' }));
      setError(null);
    } catch (error) {
      console.error('MasterTaskForm: Error adding task:', error);
      setError('Failed to add task');
    }
  };

  const handleDeleteItem = (id: string) => {
    try {
      console.log('MasterTaskForm: Deleting task', id);
      setWorkingTaskList(prev => prev.filter(task => task.id !== id));
      setError(null);
    } catch (error) {
      console.error('MasterTaskForm: Error deleting task:', error);
      setError('Failed to delete task');
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
      const name = newTaskCategoryName.trim();
      if (!name) {
        setError('Please enter a category name');
        return;
      }
      
      console.log('MasterTaskForm: Adding category', name);
      const newCategory: TMasterTaskCategory = {
        id: `cat_${uuidv4()}`,
        displayName: name,
        isPredefined: false,
      };
      setWorkingTaskCategories(prev => [...prev, newCategory]);
      setNewTaskCategoryName('');
      setError(null);
    } catch (error) {
      console.error('MasterKitForm: Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryToDelete: TMasterTaskCategory) => {
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
                console.log('MasterTaskForm: Deleting category', categoryToDelete.id);
                setWorkingTaskCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
                setWorkingTaskList(prev => prev.filter(task => task.categoryId !== categoryToDelete.id));
                setError(null);
              } catch (error) {
                console.error('MasterTaskForm: Error deleting category:', error);
                setError('Failed to delete category');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('MasterTaskForm: Error showing delete confirmation:', error);
      setError('Failed to delete category');
    }
  };

  const handleSave = () => {
    try {
      console.log('MasterTaskForm: Saving master task list with', workingTaskList.length, 'tasks and', workingTaskCategories.length, 'categories');
      // Only now do we actually save the data by calling the parent's onSave
      onSave(workingTaskList, workingTaskCategories);
      setError(null);
    } catch (error) {
      console.error('MasterTaskForm: Error saving:', error);
      setError('Failed to save master task list');
    }
  };

  const handleCancel = () => {
    try {
      // Reset working data to original values
      setWorkingTaskList(JSON.parse(JSON.stringify(initialTaskList)));
      setWorkingTaskCategories(JSON.parse(JSON.stringify(initialTaskCategories)));
      setNewTaskName({});
      setNewTaskCategoryName('');
      setError(null);
      onCancel();
    } catch (error) {
      console.error('MasterTaskForm: Error cancelling:', error);
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
          {workingTaskCategories.map((taskCategory) => {
            const tasksInCategory = groupedList[taskCategory.id] || [];
            const Icon = PREDEFINED_TASK_CATEGORY_ICONS[taskCategory.id] || GenericIcon;
            {console.log('MasterTaskForm: Working categories:', workingTaskCategories)}
            return (
              <List.Accordion 
                key={taskCategory.id} 
                title={taskCategory.displayName || 'Unnamed Category'} 
                id={String(taskCategory.id)}
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
                {tasksInCategory.map(task => (
                  <List.Item 
                    key={task.id} 
                    title={task.name} 
                    titleNumberOfLines={1}
                    left={() => (
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleDeleteItem(task.id)} 
                      />
                    )}                    
                  />
                ))}
                <View style={styles.addItemRow}>
                  <TextInput 
                    style={styles.input} 
                    label={`Add to ${taskCategory.displayName}`} 
                    value={newTaskName[taskCategory.id] || ''} 
                    onChangeText={text => setNewTaskName(prev => ({ ...prev, [taskCategory.id]: text }))} 
                  />
                  <IconButton 
                    icon="plus-circle" 
                    mode="contained" 
                    size={24} 
                    onPress={() => handleAddTask(taskCategory.id)} 
                  />
                </View>
                {!taskCategory.isPredefined && (
                  <View style={styles.categoryActions}>
                    <Button 
                      icon="delete-sweep" 
                      onPress={() => handleDeleteCategory(taskCategory)}
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
              value={newTaskCategoryName} 
              onChangeText={setNewTaskCategoryName} 
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

export default MasterTaskForm;

