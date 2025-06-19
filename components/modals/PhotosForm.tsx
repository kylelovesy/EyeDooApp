import React from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values'; // Needed for uuid
import {
  Button,
  Card,
  IconButton,
  List,
  Text,
  TextInput,
} from 'react-native-paper';
import { useForm4Photos } from '../../contexts/Form4PhotosContext';
import { COUPLE_SHOT_CATEGORIES, GROUP_SHOT_CATEGORIES } from '../../types/enum';
import BaseFormModal from '../ui/BaseFormModal';
import { CustomDropdown } from '../ui/CustomDropdown';

// --- Main Modal Component ---
export const PhotosFormModal: React.FC = () => {
  const context = useForm4Photos();
  const { formData } = context;

  if (!formData) {
    return null;
  }

  return (
    <BaseFormModal
        title="Photo Requirements"
        subtitle="Specify the photos you want for your project"
        context={context}
        saveLabel="Save Photos"
        cancelLabel="Cancel"
    >
        <PhotosFormFields />
    </BaseFormModal>
  );
};


// --- Form Fields Component ---
const PhotosFormFields: React.FC = () => {
    const { formData, addShot, removeShot, updateShot } = useForm4Photos();

    if (!formData) return null;

    return (
        <List.AccordionGroup>
            <List.Accordion title={`Group Shots (${formData.groupShots?.length || 0})`} id="groupShots" style={styles.accordion}>
                <Button onPress={() => addShot('groupShots')} mode='contained-tonal' style={styles.addButton}>Add Group Shot</Button>
                {/* **FIX**: Filter the array to ensure shot and shot.id exist before mapping. */}
                {formData.groupShots?.filter(shot => !!shot?.id).map((shot, index) => (
                    // **FIX**: Use the non-null assertion operator (!) to tell TypeScript that shot.id is not undefined here.
                    <ShotCard key={shot.id!} title={`Group Shot ${index + 1}`} onRemove={() => removeShot('groupShots', shot.id!)}>
                        <CustomDropdown
                            label="Category"
                            value={shot.groupShotType}
                            options={GROUP_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
                            onValueChange={(value) => updateShot('groupShots', shot.id!, { groupShotType: value })}
                        />
                        <TextInput label="Description" value={shot.groupDescription || ''} onChangeText={text => updateShot('groupShots', shot.id!, { groupDescription: text })} mode="outlined" style={styles.input}/>
                    </ShotCard>
                ))}
            </List.Accordion>

            <List.Accordion title={`Couple Shots (${formData.coupleShots?.length || 0})`} id="coupleShots" style={styles.accordion}>
                <Button onPress={() => addShot('coupleShots')} mode='contained-tonal' style={styles.addButton}>Add Couple Shot</Button>
                {/* **FIX**: Apply the same filter and non-null assertion pattern here. */}
                {formData.coupleShots?.filter(shot => !!shot?.id).map((shot, index) => (
                    <ShotCard key={shot.id!} title={`Couple Shot ${index + 1}`} onRemove={() => removeShot('coupleShots', shot.id!)}>
                         <CustomDropdown
                            label="Category"
                            value={shot.coupleShotType}
                            options={COUPLE_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
                            onValueChange={(value) => updateShot('coupleShots', shot.id!, { coupleShotType: value })}
                        />
                        <TextInput label="Notes" value={shot.notes || ''} onChangeText={text => updateShot('coupleShots', shot.id!, { notes: text })} mode="outlined" style={styles.input}/>
                    </ShotCard>
                ))}
            </List.Accordion>
             {/* Add other accordion sections for candidShots, photoRequests etc. following the same pattern */}
        </List.AccordionGroup>
    );
};


// --- Reusable Shot Form Component ---
const ShotCard = ({ title, onRemove, children }: { title: string, onRemove: () => void, children: React.ReactNode }) => (
    <Card style={styles.shotCard}>
        <Card.Content>
            <View style={styles.cardHeader}>
                <Text variant="titleMedium">{title}</Text>
                <IconButton icon="delete" size={20} onPress={onRemove} />
            </View>
            {children}
        </Card.Content>
    </Card>
);


// --- Styles ---
const styles = {
  accordion: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8
  },
  shotCard: {
    backgroundColor: '#fff',
    marginVertical: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  input: {
    marginVertical: 8,
  },
  addButton: {
      margin: 10,
  }
};

export default PhotosFormModal;