import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, FAB, Portal, Snackbar, Text } from 'react-native-paper';
import { z } from 'zod';
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog';
import { EnhancedTimelineForm } from '../components/EnhancedTimelineForm';
import { EnhancedTimelineView } from '../components/EnhancedTimelineView';
import { FormImportDialog } from '../components/FormImportDialog';
import { TimelineProvider, useTimeline } from '../contexts/TimelineContext';
import { TimelineEventSchema } from '../types/reusableSchemas';

type TimelineEvent = z.infer<typeof TimelineEventSchema>;

interface UpdatedTimelineScreenContentProps {
  projectId: string;
}

// Main timeline screen content (wrapped with context)
const UpdatedTimelineScreenContent: React.FC = () => {
  const {
    events,
    isLoading,
    isModalVisible,
    editingEvent,
    openModal,
    closeModal,
    openEditModal,
    addEvent,
    updateEvent,
    deleteEvent,
    snackbar,
    hideSnackbar,
    error,
    clearError
  } = useTimeline();

  const [deleteDialog, setDeleteDialog] = useState<{
    visible: boolean;
    event: TimelineEvent | null;
    eventId: string | null;
  }>({
    visible: false,
    event: null,
    eventId: null
  });

  const [importDialog, setImportDialog] = useState(false);
  const [currentTime] = useState(new Date()); // In real app, update this periodically

  // Handle edit event
  const handleEditEvent = (event: TimelineEvent, index: number) => {
    openEditModal(event, index);
  };

  // Handle delete event (show confirmation)
  const handleDeleteEvent = (index: number) => {
    const event = events[index];
    if (event && event.id) {
      setDeleteDialog({
        visible: true,
        event,
        eventId: event.id
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deleteDialog.eventId) {
      try {
        await deleteEvent(deleteDialog.eventId);
        setDeleteDialog({ visible: false, event: null, eventId: null });
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialog({ visible: false, event: null, eventId: null });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading timeline...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Wedding Day Timeline
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Plan your perfect day • {events.length} events
        </Text>
        
        <View style={styles.headerButtons}>
          <Button
            mode="outlined"
            onPress={() => setImportDialog(true)}
            icon="import"
            style={styles.headerButton}
          >
            Import
          </Button>
          <Button
            mode="contained"
            onPress={openModal}
            icon="plus"
            style={styles.headerButton}
          >
            Add Event
          </Button>
        </View>
      </View>

      {/* Enhanced Timeline Display with Visual Cues */}
      <EnhancedTimelineView
        events={events}
        currentTime={currentTime}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        editable={true}
        autoScrollToCurrent={true}
      />

      {/* Floating Action Button */}
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={openModal}
          label="Add Event"
        />
      </Portal>

      {/* Timeline Form Modal */}
      <EnhancedTimelineForm
        editingEvent={editingEvent}
        onEventSaved={() => {
          closeModal();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        visible={deleteDialog.visible}
        event={deleteDialog.event}
        onConfirm={confirmDelete}
        onDismiss={cancelDelete}
      />

      {/* Import Dialog */}
      <FormImportDialog
        visible={importDialog}
        onDismiss={() => setImportDialog(false)}
      />

      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={!!snackbar}
          onDismiss={hideSnackbar}
          duration={3000}
          style={styles.snackbar}
          action={{
            label: 'Dismiss',
            onPress: hideSnackbar,
          }}
        >
          {snackbar}
        </Snackbar>
      </Portal>

      {/* Error Snackbar */}
      <Portal>
        <Snackbar
          visible={!!error}
          onDismiss={clearError}
          duration={5000}
          style={[styles.snackbar, styles.errorSnackbar]}
          action={{
            label: 'Dismiss',
            onPress: clearError,
          }}
        >
          {error}
        </Snackbar>
      </Portal>
    </View>
  );
};

// Main timeline screen component with provider
export const UpdatedTimelineScreen: React.FC<UpdatedTimelineScreenContentProps> = ({ projectId }) => {
  return (
    <TimelineProvider projectId={projectId}>
      <UpdatedTimelineScreenContent />
    </TimelineProvider>
  );
};

// Alternative export for use in navigation
export const createUpdatedTimelineScreen = (projectId: string) => {
  return () => <UpdatedTimelineScreen projectId={projectId} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  snackbar: {
    backgroundColor: '#323232',
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
  },
});

export default UpdatedTimelineScreen;

