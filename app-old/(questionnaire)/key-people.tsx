import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import { ZodError } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';
import { QuestionnaireService } from '../../services/questionnaireService';
import { KeyPerson, KeyPersonSchema } from '../../types/questionnaire';

const KeyPeopleScreen: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
  const [newPerson, setNewPerson] = useState<KeyPerson>({
    name: '',
    role: '',
    contact: '',
    notes: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeyPeople = async () => {
      if (projectId) {
        try {
          const people = await QuestionnaireService.getKeyPeople(projectId as string);
          setKeyPeople(people);
        } catch (error) {
          console.error('Failed to load key people:', error);
          Alert.alert('Error', 'Failed to load key people.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadKeyPeople();
  }, [projectId]);

  const handleChange = (name: keyof KeyPerson, value: string) => {
    setNewPerson({ ...newPerson, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddOrUpdatePerson = async () => {
    try {
      KeyPersonSchema.parse(newPerson);
      setErrors({});

      let updatedPeople: KeyPerson[];
      if (editingIndex !== null) {
        updatedPeople = keyPeople.map((person, index) =>
          index === editingIndex ? { ...newPerson, id: person.id || `person-${Date.now()}` } : person
        );
        setEditingIndex(null);
      } else {
        updatedPeople = [...keyPeople, { ...newPerson, id: `person-${Date.now()}` }];
      }
      
      setKeyPeople(updatedPeople);
      setNewPerson({ name: '', role: '', contact: '', notes: '' });

      if (projectId) {
        await QuestionnaireService.saveKeyPeople(projectId as string, updatedPeople);
        Alert.alert('Success', 'Key people updated successfully!');
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
        console.error('Failed to save key person:', error);
        Alert.alert('Error', 'Failed to save key person.');
      }
    }
  };

  const handleEditPerson = (index: number) => {
    setNewPerson(keyPeople[index]);
    setEditingIndex(index);
    setErrors({});
  };

  const handleDeletePerson = async (index: number) => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to delete this key person?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedPeople = keyPeople.filter((_, i) => i !== index);
            setKeyPeople(updatedPeople);
            if (projectId) {
              await QuestionnaireService.saveKeyPeople(projectId as string, updatedPeople);
              Alert.alert('Success', 'Person deleted successfully!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }: { item: KeyPerson; index: number }) => (
    <View style={styles.personCard}>
      <View style={styles.personDetails}>
        <Typography variant="titleSmall">{item.name} - {item.role}</Typography>
        {item.contact && <Typography variant="bodySmall">Contact: {item.contact}</Typography>}
        {item.notes && <Typography variant="bodySmall">Notes: {item.notes}</Typography>}
      </View>
      <View style={styles.personActions}>
        <IconButton icon="pencil" onPress={() => handleEditPerson(index)} />
        <IconButton icon="delete" onPress={() => handleDeletePerson(index)} />
      </View>
    </View>
  );

  if (loading) {
    return <Screen><Typography variant="bodyLarge">Loading key people...</Typography></Screen>;
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Key People & Roles</Typography>
      
      <TextInput
        label="Name"
        value={newPerson.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        error={!!errors.name}
        mode="outlined"
      />
      <TextInput
        label="Role"
        value={newPerson.role}
        onChangeText={(text) => handleChange('role', text)}
        style={styles.input}
        error={!!errors.role}
        mode="outlined"
      />
      <TextInput
        label="Contact (Optional)"
        value={newPerson.contact}
        onChangeText={(text) => handleChange('contact', text)}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Notes (Optional)"
        value={newPerson.notes}
        onChangeText={(text) => handleChange('notes', text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleAddOrUpdatePerson} style={styles.button}>
        {editingIndex !== null ? 'Update Person' : 'Add Person'}
      </Button>

      <Typography variant="titleLarge" style={styles.listTitle}>Current Key People</Typography>
      {keyPeople.length === 0 ? (
        <Typography variant="bodyMedium" style={styles.emptyText}>No key people added yet.</Typography>
      ) : (
        <FlatList
          data={keyPeople}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || `temp-${index}`}
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
  personCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  personDetails: {
    flex: 1,
  },
  personActions: {
    flexDirection: 'row',
  },
});

export default KeyPeopleScreen;