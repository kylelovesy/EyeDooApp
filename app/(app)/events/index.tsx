// # 3.0 Events
// # 3.1 Select/create event screen

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import QuestionnaireA from '../../../components/modals/QuestionnaireA';
// import QuestionnaireB from '../../../components/modals/QuestionnaireB';
// import QuestionnaireC from '../../../components/modals/QuestionnaireC';

export default function EventsScreen() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<{
    type: 'A' | 'B' | 'C' | null;
    visible: boolean;
  }>({ type: null, visible: false });

  const events = [
    { id: '1', name: 'Wedding - Sarah & John', date: '2025-07-15' },
    { id: '2', name: 'Corporate Event - TechCorp', date: '2025-08-20' },
    { id: '3', name: 'Birthday Party - Emma', date: '2025-09-10' },
  ];

  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    router.push('/dashboard');
  };

  const handleCreateEvent = () => {
    Alert.alert(
      'Create New Event',
      'Choose questionnaire type:',
      [
        { text: 'Wedding (A)', onPress: () => setModalVisible({ type: 'A', visible: true }) },
        { text: 'Corporate (B)', onPress: () => setModalVisible({ type: 'B', visible: true }) },
        { text: 'Other (C)', onPress: () => setModalVisible({ type: 'C', visible: true }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible({ type: null, visible: false });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Select an Event</Text>
        
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.eventCard,
              selectedEvent === event.id && styles.selectedCard,
            ]}
            onPress={() => handleEventSelect(event.id)}
          >
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.createButtonText}>+ Create New Event</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Questionnaire Modals */}
      {/* {modalVisible.type === 'A' && (
        <QuestionnaireA
          visible={modalVisible.visible}
          onClose={closeModal}
          onSubmit={(data) => {
            console.log('Questionnaire A data:', data);
            closeModal();
          }}
        />
      )}
      {modalVisible.type === 'B' && (
        <QuestionnaireB
          visible={modalVisible.visible}
          onClose={closeModal}
          onSubmit={(data) => {
            console.log('Questionnaire B data:', data);
            closeModal();
          }}
        />
      )}
      {modalVisible.type === 'C' && (
        <QuestionnaireC
          visible={modalVisible.visible}
          onClose={closeModal}
          onSubmit={(data) => {
            console.log('Questionnaire C data:', data);
            closeModal();
          }}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
