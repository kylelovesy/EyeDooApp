import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Divider,
  IconButton,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { z } from 'zod';
import { useProjectForm } from './ProjectFormContext';
import {
  CANDID_SHOT_CATEGORIES,
  CandidShotCategory,
  COUPLE_SHOT_CATEGORIES,
  CoupleShotCategory,
  GROUP_SHOT_CATEGORIES,
  GroupShotCategory,
  PHOTO_REQUEST_TYPES,
  PhotoRequestType,
} from './enum';
import { CandidShotSchema, CoupleShotSchema, GroupShotSchema, PhotoRequestSchema } from './reusableSchemas';

// Infer types from Zod schemas for better type safety
type GroupShot = z.infer<typeof GroupShotSchema>;
type CoupleShot = z.infer<typeof CoupleShotSchema>;
type CandidShot = z.infer<typeof CandidShotSchema>;
type PhotoRequest = z.infer<typeof PhotoRequestSchema>;

interface GroupShotFormProps {
  shot: GroupShot;
  index: number;
  onUpdate: (updatedShot: GroupShot) => void;
  onRemove: () => void;
}

const GroupShotForm: React.FC<GroupShotFormProps> = ({ shot, index, onUpdate, onRemove }) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showImportanceDropdown, setShowImportanceDropdown] = useState(false);

  const typeOptions = GROUP_SHOT_CATEGORIES.map(type => ({
    label: type,
    value: type,
  }));

  const importanceOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  return (
    <Card style={styles.shotCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.shotTitle}>Group Shot {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>

        <Dropdown
          label="Group Shot Type *"
          mode="outlined"
          value={shot.groupShotType}
          onSelect={(value) => onUpdate({ ...shot, groupShotType: value as GroupShotCategory })}
          options={typeOptions}
        />

        <TextInput
          label="Group Name"
          value={shot.groupName || ''}
          onChangeText={(text) => onUpdate({ ...shot, groupName: text })}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Smith Family, College Friends"
          maxLength={60}
        />

        <TextInput
          label="Group Description"
          value={shot.groupDescription || ''}
          onChangeText={(text) => onUpdate({ ...shot, groupDescription: text })}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
          placeholder="Brief description of the group"
          maxLength={100}
        />

        <Dropdown
          label="Importance"
          mode="outlined"
          value={shot.importance}
          onSelect={(value) => onUpdate({ ...shot, importance: value as 'low' | 'medium' | 'high' })}
          options={importanceOptions}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Always Include</Text>
          <Switch
            value={shot.alwaysInclude || false}
            onValueChange={(value) => onUpdate({ ...shot, alwaysInclude: value })}
          />
        </View>

        <TextInput
          label="Optional Notes"
          value={shot.optionalNotes || ''}
          onChangeText={(text) => onUpdate({ ...shot, optionalNotes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Special instructions or considerations"
          maxLength={200}
        />
      </Card.Content>
    </Card>
  );
};

interface CoupleShotFormProps {
  shot: CoupleShot;
  index: number;
  onUpdate: (updatedShot: CoupleShot) => void;
  onRemove: () => void;
}

const CoupleShotForm: React.FC<CoupleShotFormProps> = ({ shot, index, onUpdate, onRemove }) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showImportanceDropdown, setShowImportanceDropdown] = useState(false);

  const typeOptions = COUPLE_SHOT_CATEGORIES.map(type => ({
    label: type,
    value: type,
  }));

  const importanceOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  return (
    <Card style={styles.shotCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.shotTitle}>Couple Shot {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>

        <Dropdown
          label="Couple Shot Type *"
          mode="outlined"
          value={shot.coupleShotType}
          onSelect={(value) => onUpdate({ ...shot, coupleShotType: value as CoupleShotCategory })}
          options={typeOptions}
        />

        <TextInput
          label="Title"
          value={shot.title || ''}
          onChangeText={(text) => onUpdate({ ...shot, title: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Custom title for this shot"
          maxLength={60}
        />

        <TextInput
          label="Location"
          value={shot.location || ''}
          onChangeText={(text) => onUpdate({ ...shot, location: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Specific location for this shot"
          maxLength={100}
        />

        <Dropdown
          label="Importance"
          mode="outlined"
          value={shot.importance}
          onSelect={(value) => onUpdate({ ...shot, importance: value as 'low' | 'medium' | 'high' })}
          options={importanceOptions}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Always Include</Text>
          <Switch
            value={shot.alwaysInclude || false}
            onValueChange={(value) => onUpdate({ ...shot, alwaysInclude: value })}
          />
        </View>

        <TextInput
          label="Notes"
          value={shot.notes || ''}
          onChangeText={(text) => onUpdate({ ...shot, notes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Special instructions or considerations"
          maxLength={200}
        />
      </Card.Content>
    </Card>
  );
};

interface CandidShotFormProps {
  shot: CandidShot;
  index: number;
  onUpdate: (updatedShot: CandidShot) => void;
  onRemove: () => void;
}

const CandidShotForm: React.FC<CandidShotFormProps> = ({ shot, index, onUpdate, onRemove }) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showImportanceDropdown, setShowImportanceDropdown] = useState(false);

  const typeOptions = CANDID_SHOT_CATEGORIES.map(type => ({
    label: type,
    value: type,
  }));

  const importanceOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  return (
    <Card style={styles.shotCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.shotTitle}>Candid Shot {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>

        <Dropdown
          label="Candid Shot Type *"
          mode="outlined"
          value={shot.candidShotType}
          onSelect={(value) => onUpdate({ ...shot, candidShotType: value as CandidShotCategory })}
          options={typeOptions}
        />

        <TextInput
          label="Title"
          value={shot.title || ''}
          onChangeText={(text) => onUpdate({ ...shot, title: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Custom title for this shot"
          maxLength={60}
        />

        <TextInput
          label="Location"
          value={shot.location || ''}
          onChangeText={(text) => onUpdate({ ...shot, location: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Specific location for this shot"
          maxLength={100}
        />

        <Dropdown
          label="Importance"
          mode="outlined"
          value={shot.importance}
          onSelect={(value) => onUpdate({ ...shot, importance: value as 'low' | 'medium' | 'high' })}
          options={importanceOptions}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Always Include</Text>
          <Switch
            value={shot.alwaysInclude || false}
            onValueChange={(value) => onUpdate({ ...shot, alwaysInclude: value })}
          />
        </View>

        <TextInput
          label="Notes"
          value={shot.notes || ''}
          onChangeText={(text) => onUpdate({ ...shot, notes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Special instructions or considerations"
          maxLength={200}
        />
      </Card.Content>
    </Card>
  );
};

interface PhotoRequestFormProps {
  request: PhotoRequest;
  index: number;
  onUpdate: (updatedRequest: PhotoRequest) => void;
  onRemove: () => void;
  title: string;
}

const PhotoRequestForm: React.FC<PhotoRequestFormProps> = ({ request, index, onUpdate, onRemove, title }) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showImportanceDropdown, setShowImportanceDropdown] = useState(false);

  const typeOptions = PHOTO_REQUEST_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const importanceOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  return (
    <Card style={styles.shotCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.shotTitle}>{title} {index + 1}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={onRemove}
            iconColor="#f44336"
          />
        </View>

        <Dropdown
          label="Photo Request Type *"
          mode="outlined"
          value={request.photoRequestType}
          onSelect={(value) => onUpdate({ ...request, photoRequestType: value as PhotoRequestType })}
          options={typeOptions}
        />

        <TextInput
          label="Title"
          value={request.title || ''}
          onChangeText={(text) => onUpdate({ ...request, title: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Title for this photo request"
          maxLength={60}
        />

        <TextInput
          label="Location"
          value={request.location || ''}
          onChangeText={(text) => onUpdate({ ...request, location: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Specific location for this photo"
          maxLength={100}
        />

        <Dropdown
          label="Importance *"
          mode="outlined"
          value={request.importance}
          onSelect={(value) => onUpdate({ ...request, importance: value as 'low' | 'medium' | 'high' })}
          options={importanceOptions}
        />

        <TextInput
          label="Notes"
          value={request.notes || ''}
          onChangeText={(text) => onUpdate({ ...request, notes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Special instructions or considerations"
          maxLength={200}
        />
      </Card.Content>
    </Card>
  );
};

export const FormStep4: React.FC = () => {
  const { formData, setFormData } = useProjectForm();

  const updateForm4Data = (updates: Partial<typeof formData.form4>) => {
    setFormData((prev) => ({
      ...prev,
      form4: {
        ...prev.form4,
        ...updates,
      },
    }));
  };

  // Group Shots
  const addGroupShot = () => {
    const newShot: GroupShot = {
      id: Date.now().toString(),
      groupShotType: 'Other',
      groupName: '',
      groupDescription: '',
      optionalNotes: '',
      importance: 'medium',
      alwaysInclude: false,
    };

    updateForm4Data({
      groupShots: [...(formData.form4.groupShots || []), newShot],
    });
  };

  const updateGroupShot = (index: number, shot: GroupShot) => {
    const updatedArray = [...(formData.form4.groupShots || [])];
    updatedArray[index] = shot;
    updateForm4Data({ groupShots: updatedArray });
  };

  const removeGroupShot = (index: number) => {
    const updatedArray = (formData.form4.groupShots || []).filter((_, i) => i !== index);
    updateForm4Data({ groupShots: updatedArray });
  };

  // Couple Shots
  const addCoupleShot = () => {
    const newShot: CoupleShot = {
      id: Date.now().toString(),
      coupleShotType: 'Other',
      title: '',
      location: '',
      notes: '',
      importance: 'medium',
      alwaysInclude: false,
    };

    updateForm4Data({
      coupleShots: [...(formData.form4.coupleShots || []), newShot],
    });
  };

  const updateCoupleShot = (index: number, shot: CoupleShot) => {
    const updatedArray = [...(formData.form4.coupleShots || [])];
    updatedArray[index] = shot;
    updateForm4Data({ coupleShots: updatedArray });
  };

  const removeCoupleShot = (index: number) => {
    const updatedArray = (formData.form4.coupleShots || []).filter((_, i) => i !== index);
    updateForm4Data({ coupleShots: updatedArray });
  };

  // Candid Shots
  const addCandidShot = () => {
    const newShot: CandidShot = {
      id: Date.now().toString(),
      candidShotType: 'Other',
      title: '',
      location: '',
      notes: '',
      importance: 'medium',
      alwaysInclude: false,
    };

    updateForm4Data({
      candidShots: [...(formData.form4.candidShots || []), newShot],
    });
  };

  const updateCandidShot = (index: number, shot: CandidShot) => {
    const updatedArray = [...(formData.form4.candidShots || [])];
    updatedArray[index] = shot;
    updateForm4Data({ candidShots: updatedArray });
  };

  const removeCandidShot = (index: number) => {
    const updatedArray = (formData.form4.candidShots || []).filter((_, i) => i !== index);
    updateForm4Data({ candidShots: updatedArray });
  };

  // Photo Requests
  const addPhotoRequest = (type: 'photoRequests' | 'mustHaveMoments' | 'sentimentalMoments') => {
    const newRequest: PhotoRequest = {
      id: Date.now().toString(),
      photoRequestType: 'Other',
      title: '',
      location: '',
      notes: '',
      importance: 'medium',
    };

    const currentArray = formData.form4[type] || [];
    updateForm4Data({
      [type]: [...currentArray, newRequest],
    });
  };

  const updatePhotoRequest = (type: 'photoRequests' | 'mustHaveMoments' | 'sentimentalMoments', index: number, request: PhotoRequest) => {
    const updatedArray = [...(formData.form4[type] || [])];
    updatedArray[index] = request;
    updateForm4Data({ [type]: updatedArray });
  };

  const removePhotoRequest = (type: 'photoRequests' | 'mustHaveMoments' | 'sentimentalMoments', index: number) => {
    const updatedArray = (formData.form4[type] || []).filter((_, i) => i !== index);
    updateForm4Data({ [type]: updatedArray });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Photo Requirements</Text>
        <Text style={styles.subtitle}>
          Specify the types of photos you want for your project
        </Text>

        {/* Group Shots */}
        <View style={styles.sectionHeader}>
          <Text>Group Shots ({(formData.form4.groupShots || []).length})</Text>
          <Button
            mode="contained"
            onPress={addGroupShot}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.groupShots || []).map((shot, index) => (
          <GroupShotForm
            key={shot.id || index}
            shot={shot}
            index={index}
            onUpdate={(updatedShot) => updateGroupShot(index, updatedShot)}
            onRemove={() => removeGroupShot(index)}
          />
        ))}

        <Divider style={styles.divider} />

        {/* Couple Shots */}
        <View style={styles.sectionHeader}>
          <Text>Couple Shots ({(formData.form4.coupleShots || []).length})</Text>
          <Button
            mode="contained"
            onPress={addCoupleShot}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.coupleShots || []).map((shot, index) => (
          <CoupleShotForm
            key={shot.id || index}
            shot={shot}
            index={index}
            onUpdate={(updatedShot) => updateCoupleShot(index, updatedShot)}
            onRemove={() => removeCoupleShot(index)}
          />
        ))}

        <Divider style={styles.divider} />

        {/* Candid Shots */}
        <View style={styles.sectionHeader}>
          <Text>Candid Shots ({(formData.form4.candidShots || []).length})</Text>
          <Button
            mode="contained"
            onPress={addCandidShot}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.candidShots || []).map((shot, index) => (
          <CandidShotForm
            key={shot.id || index}
            shot={shot}
            index={index}
            onUpdate={(updatedShot) => updateCandidShot(index, updatedShot)}
            onRemove={() => removeCandidShot(index)}
          />
        ))}

        <Divider style={styles.divider} />

        {/* Photo Requests */}
        <View style={styles.sectionHeader}>
          <Text>Photo Requests ({(formData.form4.photoRequests || []).length})</Text>
          <Button
            mode="contained"
            onPress={() => addPhotoRequest('photoRequests')}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.photoRequests || []).map((request, index) => (
          <PhotoRequestForm
            key={request.id || index}
            request={request}
            index={index}
            title="Photo Request"
            onUpdate={(updatedRequest) => updatePhotoRequest('photoRequests', index, updatedRequest)}
            onRemove={() => removePhotoRequest('photoRequests', index)}
          />
        ))}

        <Divider style={styles.divider} />

        {/* Must Have Moments */}
        <View style={styles.sectionHeader}>
          <Text>Must Have Moments ({(formData.form4.mustHaveMoments || []).length})</Text>
          <Button
            mode="contained"
            onPress={() => addPhotoRequest('mustHaveMoments')}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.mustHaveMoments || []).map((request, index) => (
          <PhotoRequestForm
            key={request.id || index}
            request={request}
            index={index}
            title="Must Have Moment"
            onUpdate={(updatedRequest) => updatePhotoRequest('mustHaveMoments', index, updatedRequest)}
            onRemove={() => removePhotoRequest('mustHaveMoments', index)}
          />
        ))}

        <Divider style={styles.divider} />

        {/* Sentimental Moments */}
        <View style={styles.sectionHeader}>
          <Text>Sentimental Moments ({(formData.form4.sentimentalMoments || []).length})</Text>
          <Button
            mode="contained"
            onPress={() => addPhotoRequest('sentimentalMoments')}
            icon="plus"
            compact
          >
            Add
          </Button>
        </View>

        {(formData.form4.sentimentalMoments || []).map((request, index) => (
          <PhotoRequestForm
            key={request.id || index}
            request={request}
            index={index}
            title="Sentimental Moment"
            onUpdate={(updatedRequest) => updatePhotoRequest('sentimentalMoments', index, updatedRequest)}
            onRemove={() => removePhotoRequest('sentimentalMoments', index)}
          />
        ))}

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text>Photo Requirements Summary</Text>
            <Text style={styles.summaryText}>
              Group Shots: {(formData.form4.groupShots || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Couple Shots: {(formData.form4.coupleShots || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Candid Shots: {(formData.form4.candidShots || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Photo Requests: {(formData.form4.photoRequests || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Must Have Moments: {(formData.form4.mustHaveMoments || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Sentimental Moments: {(formData.form4.sentimentalMoments || []).length}
            </Text>
            <Text style={styles.summaryText}>
              Total Photo Requirements: {
                (formData.form4.groupShots || []).length +
                (formData.form4.coupleShots || []).length +
                (formData.form4.candidShots || []).length +
                (formData.form4.photoRequests || []).length +
                (formData.form4.mustHaveMoments || []).length +
                (formData.form4.sentimentalMoments || []).length
              }
            </Text>
            <Text style={styles.summaryText}>
              High Priority Items: {
                [
                  ...(formData.form4.groupShots || []),
                  ...(formData.form4.coupleShots || []),
                  ...(formData.form4.candidShots || []),
                  ...(formData.form4.photoRequests || []),
                  ...(formData.form4.mustHaveMoments || []),
                  ...(formData.form4.sentimentalMoments || [])
                ].filter(item => item.importance === 'high').length
              }
            </Text>
            <Text style={styles.summaryText}>
              Always Include Items: {
                [
                  ...(formData.form4.groupShots || []),
                  ...(formData.form4.coupleShots || []),
                  ...(formData.form4.candidShots || [])
                ].filter(item => 'alwaysInclude' in item && item.alwaysInclude).length
              }
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  shotCard: {
    marginBottom: 12,
    elevation: 1,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#e8f5e8',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shotTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginBottom: 12,
  },
  dropdown: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
});

