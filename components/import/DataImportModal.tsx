import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Modal, Text } from 'react-native-paper';
import { useProjects } from '../../contexts/ProjectContext';
import { Project } from '../../types/project';
import { DataImportComponent } from './DataImportComponent';

interface ImportData {
  timeline?: any[];
  groupShots?: any[];
  coupleShots?: any[];
  candidShots?: any[];
  photoRequests?: any[];
  mustHaveMoments?: any[];
  sentimentalMoments?: any[];
}

interface DataImportModalProps {
  visible: boolean;
  onDismiss: () => void;
  project: Project;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  visible,
  onDismiss,
  project,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const { updateProject } = useProjects();

  const handleImportSuccess = async (importedData: ImportData) => {
    try {
      setIsUpdating(true);
      setUpdateStatus('Updating project with imported data...');

      // Prepare the update payload
      const updatePayload: Partial<Project> = {};

      // Update timeline if timeline data was imported
      if (importedData.timeline && importedData.timeline.length > 0) {
        updatePayload.timeline = {
          ...project.timeline,
          events: importedData.timeline,
        };
        setUpdateStatus('Updated timeline events...');
      }

      // Update form4 (photos) if any photo data was imported
      const hasPhotoData = 
        (importedData.groupShots && importedData.groupShots.length > 0) ||
        (importedData.coupleShots && importedData.coupleShots.length > 0) ||
        (importedData.candidShots && importedData.candidShots.length > 0) ||
        (importedData.photoRequests && importedData.photoRequests.length > 0) ||
        (importedData.mustHaveMoments && importedData.mustHaveMoments.length > 0) ||
        (importedData.sentimentalMoments && importedData.sentimentalMoments.length > 0);

      if (hasPhotoData) {
        updatePayload.form4 = {
          ...project.form4,
          groupShots: importedData.groupShots || project.form4.groupShots || [],
          coupleShots: importedData.coupleShots || project.form4.coupleShots || [],
          candidShots: importedData.candidShots || project.form4.candidShots || [],
          photoRequests: importedData.photoRequests || project.form4.photoRequests || [],
          mustHaveMoments: importedData.mustHaveMoments || project.form4.mustHaveMoments || [],
          sentimentalMoments: importedData.sentimentalMoments || project.form4.sentimentalMoments || [],
        };
        setUpdateStatus('Updated photo requirements...');
      }

      // Update the project in Firestore
      await updateProject(project.id, updatePayload);

      setUpdateStatus('Project updated successfully!');
      
      // Close the modal after a brief delay
      setTimeout(() => {
        onDismiss();
        setIsUpdating(false);
        setUpdateStatus('');
      }, 1500);

    } catch (error) {
      console.error('Failed to update project with imported data:', error);
      setUpdateStatus('Failed to update project');
      setIsUpdating(false);
    }
  };

  const handleImportError = (error: string) => {
    console.error('Import error:', error);
    setUpdateStatus(`Import failed: ${error}`);
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Import Data for {project.form1.projectName}
          </Text>
          
          {isUpdating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.statusText}>{updateStatus}</Text>
            </View>
          ) : (
            <DataImportComponent
              projectId={project.id}
              onImportSuccess={handleImportSuccess}
              onImportError={handleImportError}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              disabled={isUpdating}
              style={styles.button}
            >
              {isUpdating ? 'Updating...' : 'Close'}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxHeight: '80%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  statusText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    minWidth: 120,
  },
});

