// # 3.1.4 Event questionnaire D modal
// ######################################################################
// # FILE: src/components/modals/Questionnaire4Modal.tsx
// ######################################################################


import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, View } from 'react-native';
import { Switch, TextInput, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
// Assume UI components and services are imported from your project
import { QuestionnaireService } from '../../services/questionnaireService';
import { GroupShot, PhotographyPlan } from '../../types/questionnaire';
import { CustomButton } from '../ui/CustomButton';
import { RepeatableSection } from '../ui/RepeatableSection';
import { Screen } from '../ui/Screen';
import { BodyText, HeadlineText, LabelText, TitleText } from '../ui/Typography';

interface Questionnaire4ModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
  initialData?: PhotographyPlan;
}

const emptyGroupShot: GroupShot = { id: uuidv4(), groupDescription: '' };

const emptyForm: PhotographyPlan = {
    groupShots: [],
    familySituations: false,
    guestsToAvoid: false,
    surprises: false,
};

export const Questionnaire4Modal: React.FC<Questionnaire4ModalProps> = ({ visible, onClose, projectId, initialData }) => {
  const [formData, setFormData] = useState<PhotographyPlan>(emptyForm);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
        const data = initialData ? { ...initialData } : { ...emptyForm };
        if (!data.groupShots || data.groupShots.length === 0) {
            data.groupShots = [emptyGroupShot];
        }
        setFormData(data);
    }
  }, [initialData, visible]);

  const updateField = (field: keyof PhotographyPlan, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGroupShotChange = (index: number, field: keyof GroupShot, value: string) => {
    const newGroups = [...(formData.groupShots || [])];
    newGroups[index] = {...newGroups[index], [field]: value};
    setFormData(prev => ({...prev, groupShots: newGroups}));
  };
  const addGroupShot = () => setFormData(p => ({...p, groupShots: [...(p.groupShots || []), { ...emptyGroupShot, id: uuidv4() }]}));
  const removeGroupShot = (index: number) => {
      if(formData.groupShots && formData.groupShots.length <= 1) {
          Alert.alert("Cannot Remove", "At least one group shot is required.");
          return;
      }
      setFormData(p => ({...p, groupShots: p.groupShots?.filter((_, i) => i !== index)}));
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await QuestionnaireService.savePhotographyPlan(projectId, formData);
      Alert.alert('Success', 'Photography Plan saved!');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save data.');
    } finally {
      setLoading(false);
    }
  };

  const styles = getModalStyles(theme);

  const ToggleSection = ({ title, value, onValueChange, notes, onNotesChange, notesLabel, notesPlaceholder }: any) => (
      <View style={styles.toggleContainer}>
          <View style={styles.toggleRow}>
              <LabelText size="large" style={{flex: 1}}>{title}</LabelText>
              <Switch value={value} onValueChange={onValueChange} />
          </View>
          {value && (
              <TextInput 
                  label={notesLabel}
                  value={notes || ''}
                  onChangeText={onNotesChange}
                  mode="outlined"
                  multiline
                  placeholder={notesPlaceholder}
                  style={{ marginTop: 10 }}
              />
          )}
      </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Screen>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <HeadlineText size="medium">Photography Plan</HeadlineText>
              <BodyText style={{ opacity: 0.7 }}>Define the photographic requirements and preferences.</BodyText>
            </View>

            <TitleText size="large" style={styles.sectionTitle}>Key Moments & Style</TitleText>
            <View style={styles.formSection}>
                <TextInput label="Must-have specific moments" value={formData.mustHaveMoments || ''} onChangeText={v => updateField('mustHaveMoments', v)} mode="outlined" multiline placeholder="e.g., A special family tradition, a specific pose..."/>
                <TextInput label="Sentimental items to photograph" value={formData.sentimentalItems || ''} onChangeText={v => updateField('sentimentalItems', v)} mode="outlined" multiline placeholder="e.g., Grandmother's locket, handwritten vows..."/>
            </View>

            <TitleText size="large" style={styles.sectionTitle}>Shot Lists</TitleText>
             <View style={styles.formSection}>
                <TextInput label="Unique/Specific Shot Requests" value={formData.requestedShots || ''} onChangeText={v => updateField('requestedShots', v)} mode="outlined" multiline placeholder="e.g., Photo with a special pet, recreating an old family photo..."/>
            </View>
            <RepeatableSection
              title="Formal Group Shots"
              items={formData.groupShots || []}
              onAddItem={addGroupShot}
              onRemoveItem={removeGroupShot}
              addButonText="Add Group"
              renderItem={(item, index) => (
                <>
                  <TextInput label="Group Description *" value={item.groupDescription} onChangeText={(v) => handleGroupShotChange(index, 'groupDescription', v)} mode="outlined" placeholder="e.g., Couple with Person A's parents"/>
                  <TextInput label="Optional Notes" value={item.optionalNotes || ''} onChangeText={(v) => handleGroupShotChange(index, 'optionalNotes', v)} mode="outlined" placeholder="e.g., Ensure Aunt Mary is central"/>
                </>
              )}
            />
             <View style={styles.formSection}>
                <TextInput label="Couple Shot Ideas/Inspiration" value={formData.coupleShotIdeas || ''} onChangeText={v => updateField('coupleShotIdeas', v)} mode="outlined" multiline placeholder="e.g., Romantic sunset photos, fun and playful..."/>
                <TextInput label="General Shot Requests (Details/Candids)" value={formData.generalShotRequests || ''} onChangeText={v => updateField('generalShotRequests', v)} mode="outlined" multiline placeholder="e.g., Decor, cake, rings, shoes, stationery..."/>
            </View>


            <TitleText size="large" style={styles.sectionTitle}>Sensitivities & Surprises</TitleText>
            <View style={styles.formSection}>
                <ToggleSection 
                    title="Any family situations to be aware of?"
                    value={formData.familySituations}
                    onValueChange={(v: boolean) => updateField('familySituations', v)}
                    notes={formData.familySituationsNotes}
                    onNotesChange={(v: string) => updateField('familySituationsNotes', v)}
                    notesLabel="Private Notes on Family Situations"
                />
                 <ToggleSection 
                    title="Any guests to avoid photographing?"
                    value={formData.guestsToAvoid}
                    onValueChange={(v: boolean) => updateField('guestsToAvoid', v)}
                    notes={formData.guestsToAvoidNotes}
                    onNotesChange={(v: string) => updateField('guestsToAvoidNotes', v)}
                    notesLabel="Private Notes on Guests"
                />
                 <ToggleSection 
                    title="Any surprises planned?"
                    value={formData.surprises}
                    onValueChange={(v: boolean) => updateField('surprises', v)}
                    notes={formData.surprisesNotes}
                    onNotesChange={(v: string) => updateField('surprisesNotes', v)}
                    notesLabel="Private Notes on Surprises"
                />
            </View>

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

const getModalStylesWithToggles = (theme: any) => ({
    ...getModalStyles(theme),
    toggleContainer: {
        backgroundColor: theme.colors.surfaceVariant + '33',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        marginBottom: 15,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

