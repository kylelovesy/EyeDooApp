import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Checkbox, IconButton, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { ShotChecklistService } from '../../services/shotChecklistService';
import { ShotItem, ShotItemSchema } from '../../types/shotlist';

const ChecklistsScreen: React.FC = () => {
  const theme = useTheme();
  const { projectId } = useLocalSearchParams();

  const [shotItems, setShotItems] = useState<ShotItem[]>([]);
  const [newShot, setNewShot] = useState<ShotItem>({
    description: '',
    isCompleted: false,
    notes: '',
  });
  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChecklist = async () => {
      if (projectId) {
        try {
          const checklist = await ShotChecklistService.getShotChecklist(projectId as string);
          if (checklist) {
            setShotItems(checklist.items);
          }
        } catch (error) {
          console.error('Failed to load shot checklist:', error);
          Alert.alert('Error', 'Failed to load shot checklist.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadChecklist();
  }, [projectId]);

  const handleChange = (name: keyof ShotItem, value: string | boolean) => {
    setNewShot({ ...newShot, [name]: value });
    if (errors[name as string]) {
      setErrors({ ...errors, [name as string]: '' });
    }
  };

  const handleAddOrUpdateShot = async () => {
    try {
      ShotItemSchema.parse(newShot);
      setErrors({});

      let updatedItems: ShotItem[];
      if (editingShotId) {
        updatedItems = shotItems.map(item =>
          item.id === editingShotId ? { ...newShot, id: editingShotId } : item
        );
        setEditingShotId(null);
      } else {
        updatedItems = [...shotItems, { ...newShot, id: `shot-${Date.now()}` }];
      }
      
      setShotItems(updatedItems);
      setNewShot({ description: '', isCompleted: false, notes: '' });

      if (projectId) {
        await ShotChecklistService.saveShotChecklist(projectId as string, updatedItems);
        Alert.alert('Success', 'Shot checklist updated successfully!');
      } else {
        Alert.alert('Error', 'Project ID is missing.');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      } else {
        console.error('Failed to save shot item:', error);
        Alert.alert('Error', 'Failed to save shot item.');
      }
    }
  };

  const handleEditShot = (item: ShotItem) => {
    setNewShot(item);
    setEditingShotId(item.id || null);
    setErrors({});
  };

  const handleDeleteShot = async (shotId: string) => {
    Alert.alert(
      'Delete Shot',
      'Are you sure you want to delete this shot item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (projectId) {
              await ShotChecklistService.deleteShotItem(projectId as string, shotId);
              setShotItems(prev => prev.filter(item => item.id !== shotId));
              Alert.alert('Success', 'Shot item deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleComplete = async (item: ShotItem) => {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    if (projectId) {
      await ShotChecklistService.updateShotItem(projectId as string, updatedItem);
      setShotItems(prev => prev.map(shot => shot.id === item.id ? updatedItem : shot));
    }
  };

  const renderItem = ({ item }: { item: ShotItem }) => (
    <View style={styles.shotItemCard}>
      <Checkbox.Android
        status={item.isCompleted ? 'checked' : 'unchecked'}
        onPress={() => handleToggleComplete(item)}
      />
      <View style={styles.shotDetails}>
        <Typography variant="titleSmall" style={item.isCompleted ? styles.completedText : {}}>{item.description}</Typography>
        {item.notes && <Typography variant="bodySmall">Notes: {item.notes}</Typography>}
      </View>
      <View style={styles.shotActions}>
        <IconButton icon="pencil" onPress={() => handleEditShot(item)} />
        <IconButton icon="delete" onPress={() => handleDeleteShot(item.id || '')} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading checklist...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Shot Checklist</Typography>
      
      <TextInput
        label="Shot Description"
        value={newShot.description}
        onChangeText={(text) => handleChange('description', text)}
        style={styles.input}
        error={!!errors.description}
        helperText={errors.description}
        mode="outlined"
      />
      <TextInput
        label="Notes (Optional)"
        value={newShot.notes}
        onChangeText={(text) => handleChange('notes', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleAddOrUpdateShot} style={styles.button}>
        {editingShotId ? 'Update Shot' : 'Add Shot'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Shots</Typography>
      {shotItems.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No shot items added yet.</Typography>
      ) : (
        <FlatList
          data={shotItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || `temp-${Date.now()}`}
          contentContainerStyle={styles.listContent}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  listTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  shotItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  shotDetails: {
    flex: 1,
    marginLeft: 10,
  },
  shotActions: {
    flexDirection: 'row',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default ChecklistsScreen;