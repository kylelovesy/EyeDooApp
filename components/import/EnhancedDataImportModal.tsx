import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Modal, RadioButton, Switch, Text } from 'react-native-paper';
import { DataImportService } from '../../services/dataImportService';
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

interface EnhancedDataImportModalProps {
  visible: boolean;
  onDismiss: () => void;
  project: Project;
}

export const EnhancedDataImportModal: React.FC<EnhancedDataImportModalProps> = ({
  visible,
  onDismiss,
  project,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [mergeStrategy, setMergeStrategy] = useState<'replace' | 'merge'>('replace');
  const [createBackup, setCreateBackup] = useState(true);
  const [importStats, setImportStats] = useState<any>(null);

  const handleImportSuccess = async (importedData: ImportData) => {
    try {
      setIsUpdating(true);
      setUpdateStatus('Preparing import...');

      // Validate the imported data first
      const validation = DataImportService.validateImportData(importedData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Create backup if requested
      if (createBackup) {
        setUpdateStatus('Creating backup...');
        await DataImportService.backupProjectData(project.id);
      }

      // Get current stats for comparison
      const beforeStats = await DataImportService.getProjectImportStats(project.id);

      // Import the data
      setUpdateStatus('Importing data to Firestore...');
      await DataImportService.importDataToProject(project.id, importedData, mergeStrategy);

      // Get updated stats
      const afterStats = await DataImportService.getProjectImportStats(project.id);
      setImportStats({
        before: beforeStats,
        after: afterStats,
        imported: {
          timelineEvents: importedData.timeline?.length || 0,
          groupShots: importedData.groupShots?.length || 0,
          coupleShots: importedData.coupleShots?.length || 0,
          candidShots: importedData.candidShots?.length || 0,
          photoRequests: importedData.photoRequests?.length || 0,
          mustHaveMoments: importedData.mustHaveMoments?.length || 0,
          sentimentalMoments: importedData.sentimentalMoments?.length || 0,
        }
      });

      setUpdateStatus('Data imported successfully!');

      setUpdateStatus('Import completed successfully!');
      
      // Close the modal after showing success message
      setTimeout(() => {
        onDismiss();
        setIsUpdating(false);
        setUpdateStatus('');
        setImportStats(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to import data:', error);
      setUpdateStatus(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUpdating(false);
    }
  };

  const handleImportError = (error: string) => {
    console.error('Import error:', error);
    setUpdateStatus(`Import failed: ${error}`);
    setIsUpdating(false);
  };

  const renderImportStats = () => {
    if (!importStats) return null;

    const { before, after, imported } = importStats;

    return (
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.statsTitle}>Import Summary</Text>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Timeline Events:</Text>
            <Text variant="bodyMedium">{before.timelineEvents} → {after.timelineEvents} (+{imported.timelineEvents})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Group Shots:</Text>
            <Text variant="bodyMedium">{before.groupShots} → {after.groupShots} (+{imported.groupShots})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Couple Shots:</Text>
            <Text variant="bodyMedium">{before.coupleShots} → {after.coupleShots} (+{imported.coupleShots})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Candid Shots:</Text>
            <Text variant="bodyMedium">{before.candidShots} → {after.candidShots} (+{imported.candidShots})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Photo Requests:</Text>
            <Text variant="bodyMedium">{before.photoRequests} → {after.photoRequests} (+{imported.photoRequests})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Must-Have Moments:</Text>
            <Text variant="bodyMedium">{before.mustHaveMoments} → {after.mustHaveMoments} (+{imported.mustHaveMoments})</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">Sentimental Moments:</Text>
            <Text variant="bodyMedium">{before.sentimentalMoments} → {after.sentimentalMoments} (+{imported.sentimentalMoments})</Text>
          </View>
          
          <View style={[styles.statsRow, styles.totalRow]}>
            <Text variant="titleMedium">Total Items:</Text>
            <Text variant="titleMedium">{before.totalItems} → {after.totalItems}</Text>
          </View>
        </Card.Content>
      </Card>
    );
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
              {renderImportStats()}
            </View>
          ) : (
            <>
              {/* Import Options */}
              <Card style={styles.optionsCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.optionsTitle}>Import Options</Text>
                  
                  {/* Merge Strategy */}
                  <View style={styles.optionSection}>
                    <Text variant="bodyMedium" style={styles.optionLabel}>Data Handling:</Text>
                    <RadioButton.Group
                      onValueChange={(value) => setMergeStrategy(value as 'replace' | 'merge')}
                      value={mergeStrategy}
                    >
                      <View style={styles.radioOption}>
                        <RadioButton value="replace" />
                        <Text variant="bodyMedium">Replace existing data</Text>
                      </View>
                      <View style={styles.radioOption}>
                        <RadioButton value="merge" />
                        <Text variant="bodyMedium">Merge with existing data</Text>
                      </View>
                    </RadioButton.Group>
                  </View>

                  {/* Backup Option */}
                  <View style={styles.optionSection}>
                    <View style={styles.switchOption}>
                      <Text variant="bodyMedium">Create backup before import</Text>
                      <Switch
                        value={createBackup}
                        onValueChange={setCreateBackup}
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Import Component */}
              <DataImportComponent
                projectId={project.id}
                onImportSuccess={handleImportSuccess}
                onImportError={handleImportError}
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              disabled={isUpdating}
              style={styles.button}
            >
              {isUpdating ? 'Importing...' : 'Close'}
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
    maxHeight: '90%',
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
  optionsCard: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  optionsTitle: {
    marginBottom: 12,
  },
  optionSection: {
    marginBottom: 16,
  },
  optionLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  switchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsCard: {
    marginTop: 16,
    backgroundColor: '#e8f5e8',
  },
  statsTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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

