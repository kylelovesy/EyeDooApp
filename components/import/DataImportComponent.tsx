import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Snackbar } from 'react-native-paper';
import { z } from 'zod';
import { CandidShotSchema, CoupleShotSchema, GroupShotSchema, PhotoRequestSchema } from '../../types/reusableSchemas';
import { TimelineEventSchema } from '../../types/timeline';
import { BodyText, HeadlineText } from '../ui/Typography';

// Define the import data structure
interface ImportData {
  timeline?: z.infer<typeof TimelineEventSchema>[];
  groupShots?: z.infer<typeof GroupShotSchema>[];
  coupleShots?: z.infer<typeof CoupleShotSchema>[];
  candidShots?: z.infer<typeof CandidShotSchema>[];
  photoRequests?: z.infer<typeof PhotoRequestSchema>[];
  mustHaveMoments?: z.infer<typeof PhotoRequestSchema>[];
  sentimentalMoments?: z.infer<typeof PhotoRequestSchema>[];
}

interface DataImportComponentProps {
  projectId: string;
  onImportSuccess: (importedData: ImportData) => void;
  onImportError: (error: string) => void;
}

export const DataImportComponent: React.FC<DataImportComponentProps> = ({
  projectId,
  onImportSuccess,
  onImportError,
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validateTimelineData = (data: any[]): z.infer<typeof TimelineEventSchema>[] => {
    const validatedEvents: z.infer<typeof TimelineEventSchema>[] = [];
    
    for (const item of data) {
      try {
        const validatedEvent = TimelineEventSchema.parse(item);
        validatedEvents.push(validatedEvent);
      } catch (error) {
        console.warn('Invalid timeline event:', item, error);
        // Skip invalid events but continue processing
      }
    }
    
    return validatedEvents;
  };

  const validateGroupShotsData = (data: any[]): z.infer<typeof GroupShotSchema>[] => {
    const validatedShots: z.infer<typeof GroupShotSchema>[] = [];
    
    for (const item of data) {
      try {
        const validatedShot = GroupShotSchema.parse(item);
        validatedShots.push(validatedShot);
      } catch (error) {
        console.warn('Invalid group shot:', item, error);
      }
    }
    
    return validatedShots;
  };

  const validateCoupleShotsData = (data: any[]): z.infer<typeof CoupleShotSchema>[] => {
    const validatedShots: z.infer<typeof CoupleShotSchema>[] = [];
    
    for (const item of data) {
      try {
        const validatedShot = CoupleShotSchema.parse(item);
        validatedShots.push(validatedShot);
      } catch (error) {
        console.warn('Invalid couple shot:', item, error);
      }
    }
    
    return validatedShots;
  };

  const validateCandidShotsData = (data: any[]): z.infer<typeof CandidShotSchema>[] => {
    const validatedShots: z.infer<typeof CandidShotSchema>[] = [];
    
    for (const item of data) {
      try {
        const validatedShot = CandidShotSchema.parse(item);
        validatedShots.push(validatedShot);
      } catch (error) {
        console.warn('Invalid candid shot:', item, error);
      }
    }
    
    return validatedShots;
  };

  const validatePhotoRequestsData = (data: any[]): z.infer<typeof PhotoRequestSchema>[] => {
    const validatedRequests: z.infer<typeof PhotoRequestSchema>[] = [];
    
    for (const item of data) {
      try {
        const validatedRequest = PhotoRequestSchema.parse(item);
        validatedRequests.push(validatedRequest);
      } catch (error) {
        console.warn('Invalid photo request:', item, error);
      }
    }
    
    return validatedRequests;
  };

  const processJsonFile = async (uri: string, fileName: string): Promise<any[]> => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri);
      const jsonData = JSON.parse(fileContent);
      
      // Ensure the data is an array
      if (!Array.isArray(jsonData)) {
        throw new Error(`File ${fileName} does not contain an array of data`);
      }
      
      return jsonData;
    } catch (error) {
      throw new Error(`Failed to process ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const determineDataType = (fileName: string): keyof ImportData | null => {
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('timeline')) return 'timeline';
    if (lowerFileName.includes('group')) return 'groupShots';
    if (lowerFileName.includes('couple')) return 'coupleShots';
    if (lowerFileName.includes('candid')) return 'candidShots';
    if (lowerFileName.includes('must_have') || lowerFileName.includes('musthave')) return 'mustHaveMoments';
    if (lowerFileName.includes('sentimental')) return 'sentimentalMoments';
    if (lowerFileName.includes('photo') || lowerFileName.includes('request')) return 'photoRequests';
    
    return null;
  };

  const handleFileImport = async () => {
    try {
      setIsImporting(true);
      setImportStatus('Selecting files...');

      // Allow multiple file selection
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const files = Array.isArray(result.assets) ? result.assets : [result.assets];
      const importedData: ImportData = {};
      let processedFiles = 0;
      let totalValidItems = 0;

      setImportStatus('Processing files...');

      for (const file of files) {
        try {
          const dataType = determineDataType(file.name);
          
          if (!dataType) {
            console.warn(`Could not determine data type for file: ${file.name}`);
            continue;
          }

          const rawData = await processJsonFile(file.uri, file.name);
          let validatedData: any[] = [];

          // Validate data based on type
          switch (dataType) {
            case 'timeline':
              validatedData = validateTimelineData(rawData);
              break;
            case 'groupShots':
              validatedData = validateGroupShotsData(rawData);
              break;
            case 'coupleShots':
              validatedData = validateCoupleShotsData(rawData);
              break;
            case 'candidShots':
              validatedData = validateCandidShotsData(rawData);
              break;
            case 'photoRequests':
            case 'mustHaveMoments':
            case 'sentimentalMoments':
              validatedData = validatePhotoRequestsData(rawData);
              break;
          }

          if (validatedData.length > 0) {
            importedData[dataType] = validatedData;
            totalValidItems += validatedData.length;
            processedFiles++;
          }

          setImportStatus(`Processed ${processedFiles} files...`);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          showSnackbar(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (totalValidItems === 0) {
        throw new Error('No valid data found in any of the selected files');
      }

      setImportStatus('Import completed successfully!');
      showSnackbar(`Successfully imported ${totalValidItems} items from ${processedFiles} files`);
      
      // Call the success callback with the imported data
      onImportSuccess(importedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Import error:', error);
      setImportStatus('Import failed');
      showSnackbar(`Import failed: ${errorMessage}`);
      onImportError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkImport = async () => {
    Alert.alert(
      'Bulk Import',
      'This will import data from multiple JSON files. Make sure your files are named appropriately (e.g., timeline_events.json, group_shots.json, etc.)',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: handleFileImport },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <HeadlineText size="medium" style={styles.title}>
            Import Client Data
          </HeadlineText>
          <BodyText size="medium" style={styles.description}>
            Import timeline events and photo requirements from JSON files generated by the data transformation script.
          </BodyText>

          {isImporting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <BodyText size="medium" style={styles.statusText}>{importStatus}</BodyText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleBulkImport}
              disabled={isImporting}
              icon="upload"
              style={styles.importButton}
            >
              Import JSON Files
            </Button>
          </View>

          <View style={styles.infoContainer}>
            <BodyText size="small" style={styles.infoText}>
              Supported file types: JSON files containing timeline events, group shots, couple shots, candid shots, photo requests, must-have moments, and sentimental moments.
            </BodyText>
            <BodyText size="small" style={styles.infoText}>
              File naming convention: Include keywords like timeline, group, couple, candid, must_have, sentimental, or photo in your file names for automatic detection.
            </BodyText>
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  importButton: {
    paddingVertical: 8,
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoText: {
    marginBottom: 8,
    color: '#666',
    lineHeight: 18,
  },
  snackbar: {
    marginBottom: 16,
  },
});

