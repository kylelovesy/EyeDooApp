// # 3.1.3 Event questionnaire C modal
// ######################################################################
// # FILE: src/components/modals/Questionnaire3Modal.tsx
// ######################################################################


import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, View } from 'react-native';
import { SegmentedButtons, TextInput, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
// Assume UI components and services are imported from your project
 import { QuestionnaireService } from '../../services/questionnaireService';
import { OtherKeyPerson, PeopleAndRoles, WeddingPartyMember } from '../../types/questionnaire';
import { CustomButton } from '../ui/CustomButton';
import { RepeatableSection } from '../ui/RepeatableSection';
import { Screen } from '../ui/Screen';
import { BodyText, HeadlineText, TitleText } from '../ui/Typography';

interface Questionnaire3ModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
  initialData?: PeopleAndRoles;
}

const emptyWeddingPartyMember: WeddingPartyMember = { id: uuidv4(), fullName: '', role: '' };
const emptyKeyPerson: OtherKeyPerson = { id: uuidv4(), typeOfContact: 'Other', name: '' };

const emptyForm: PeopleAndRoles = {
  parentsA: '',
  parentsB: '',
  grandparentsA: '',
  grandparentsB: '',
  weddingParty: [],
  otherKeyPeople: [],
};

export const Questionnaire3Modal: React.FC<Questionnaire3ModalProps> = ({ visible, onClose, projectId, initialData }) => {
  const [formData, setFormData] = useState<PeopleAndRoles>(emptyForm);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      const data = initialData ? { ...initialData } : { ...emptyForm };
      if (!data.weddingParty || data.weddingParty.length === 0) {
        data.weddingParty = [emptyWeddingPartyMember];
      }
      if (!data.otherKeyPeople || data.otherKeyPeople.length === 0) {
        data.otherKeyPeople = [emptyKeyPerson];
      }
      setFormData(data);
    }
  }, [initialData, visible]);

  const updateField = (field: keyof PeopleAndRoles, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleWeddingPartyChange = (index: number, field: keyof WeddingPartyMember, value: string) => {
    const newParty = [...(formData.weddingParty || [])];
    newParty[index] = {...newParty[index], [field]: value};
    setFormData(prev => ({...prev, weddingParty: newParty}));
  };
  const addWeddingPartyMember = () => setFormData(p => ({...p, weddingParty: [...(p.weddingParty || []), { ...emptyWeddingPartyMember, id: uuidv4() }]}));
  const removeWeddingPartyMember = (index: number) => {
      if(formData.weddingParty && formData.weddingParty.length <= 1) {
          Alert.alert("Cannot Remove", "At least one wedding party member is required.");
          return;
      }
      setFormData(p => ({...p, weddingParty: p.weddingParty?.filter((_, i) => i !== index)}));
  }

  const handleKeyPersonChange = (index: number, field: keyof OtherKeyPerson, value: string) => {
    const newPeople = [...(formData.otherKeyPeople || [])];
    newPeople[index] = {...newPeople[index], [field]: value};
    setFormData(prev => ({...prev, otherKeyPeople: newPeople}));
  };
  const addKeyPerson = () => setFormData(p => ({...p, otherKeyPeople: [...(p.otherKeyPeople || []), { ...emptyKeyPerson, id: uuidv4() }]}));
  const removeKeyPerson = (index: number) => {
      if(formData.otherKeyPeople && formData.otherKeyPeople.length <= 1) {
          Alert.alert("Cannot Remove", "At least one key person is required.");
          return;
      }
      setFormData(p => ({...p, otherKeyPeople: p.otherKeyPeople?.filter((_, i) => i !== index)}));
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await QuestionnaireService.savePeopleAndRoles(projectId, formData);
      Alert.alert('Success', 'People & Roles information saved!');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save data.');
    } finally {
      setLoading(false);
    }
  };

  const styles = getModalStyles(theme);

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Screen>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <HeadlineText size="medium">People & Roles</HeadlineText>
              <BodyText style={{ opacity: 0.7 }}>Identify key individuals for the wedding day.</BodyText>
            </View>

            <TitleText size="large" style={styles.sectionTitle}>Family</TitleText>
            <View style={styles.formSection}>
              <TextInput label="Parents of Partner A" value={formData.parentsA || ''} onChangeText={(v) => updateField('parentsA', v)} mode="outlined" multiline placeholder="e.g., Jane Doe (Mother), John Doe (Father)"/>
              <TextInput label="Parents of Partner B" value={formData.parentsB || ''} onChangeText={(v) => updateField('parentsB', v)} mode="outlined" multiline />
              <TextInput label="Grandparents (Partner A's side)" value={formData.grandparentsA || ''} onChangeText={(v) => updateField('grandparentsA', v)} mode="outlined" multiline />
              <TextInput label="Grandparents (Partner B's side)" value={formData.grandparentsB || ''} onChangeText={(v) => updateField('grandparentsB', v)} mode="outlined" multiline />
            </View>

            <RepeatableSection
              title="Wedding Party / Bridal Party"
              items={formData.weddingParty || []}
              onAddItem={addWeddingPartyMember}
              onRemoveItem={removeWeddingPartyMember}
              addButonText="Add Party Member"
              renderItem={(item, index) => (
                <>
                  <TextInput label="Full Name *" value={item.fullName} onChangeText={(v) => handleWeddingPartyChange(index, 'fullName', v)} mode="outlined" />
                  <TextInput label="Role *" value={item.role} onChangeText={(v) => handleWeddingPartyChange(index, 'role', v)} mode="outlined" placeholder="e.g., Maid of Honor, Best Man"/>
                  <TextInput label="Relationship to Couple" value={item.relationshipToCouple || ''} onChangeText={(v) => handleWeddingPartyChange(index, 'relationshipToCouple', v)} mode="outlined" />
                </>
              )}
            />

            <RepeatableSection
              title="Other Key People"
              items={formData.otherKeyPeople || []}
              onAddItem={addKeyPerson}
              onRemoveItem={removeKeyPerson}
              addButonText="Add Key Person"
              renderItem={(item, index) => (
                <>
                  <SegmentedButtons
                    value={item.typeOfContact}
                    onValueChange={(v) => handleKeyPersonChange(index, 'typeOfContact', v)}
                    buttons={[
                        { value: 'Officiant', label: 'Officiant' },
                        { value: 'Wedding Planner', label: 'Planner' },
                        { value: 'Videographer', label: 'Video' },
                        { value: 'DJ/Band', label: 'Music' },
                        { value: 'Other', label: 'Other' },
                    ]}
                  />
                  <TextInput label="Name *" value={item.name} onChangeText={(v) => handleKeyPersonChange(index, 'name', v)} mode="outlined" />
                  <TextInput label="Contact Details (Phone/Email)" value={item.contactDetails || ''} onChangeText={(v) => handleKeyPersonChange(index, 'contactDetails', v)} mode="outlined" />
                </>
              )}
            />

            <View style={styles.buttonContainer}>
              <CustomButton title="Cancel" variant="outline" onPress={onClose} style={{ flex: 1 }} disabled={loading} />
              <CustomButton title="Save" variant="primary" onPress={handleSubmit} style={{ flex: 1 }} loading={loading} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </Modal>
  );
};
