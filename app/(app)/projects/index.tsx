// # 3.0 Projects
// # 3.1 Select/create project screen

// ######################################################################
// # FILE: src/app/(app)/projects/index.tsx
// ######################################################################


import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, useColorScheme, View } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
// Assume UI components and services are imported from your project
import { ProjectCard } from '../../../components/cards/ProjectCard';
import { Screen } from '../../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../../components/ui/Typography';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { useProjects } from '../../../contexts/ProjectContext';


export default function ProjectsScreen() {
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  
  const { projects, loading, error, loadProjects, searchProjects, searchResults } = useProjects();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleRefresh = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if(query.length > 2) {
        setIsSearching(true);
        searchProjects(query);
    } else {
        setIsSearching(false);
    }
  };

  const handleCreateEvent = () => {
    router.push('/(app)/projects/create');
  };

  const handleEventSelect = (projectId: string) => {
    router.push(`/(app)/projects/${projectId}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <HeadlineText size="small" textAlign="center">No Projects Yet</HeadlineText>
      <BodyText textAlign="center" style={{ opacity: 0.7, marginTop: 10 }}>
        Press the '+' button to create your first project.
      </BodyText>
    </View>
  );

  const renderErrorState = () => (
     <View style={styles.emptyContainer}>
      <HeadlineText size="small" textAlign="center" style={{color: theme.colors.error}}>Error Loading Projects</HeadlineText>
      <BodyText textAlign="center" style={{ opacity: 0.7, marginTop: 10 }}>
        {error}
      </BodyText>
    </View>
  );
  
  const displayedProjects = isSearching ? searchResults : projects;

  if (loading && !projects.length) {
    return (
      <Screen style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={displayedProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleEventSelect(item.id)}
            style={styles.card}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <HeadlineText size="large">Projects</HeadlineText>
            <Searchbar
                placeholder="Search projects..."
                onChangeText={handleSearch}
                value={searchQuery}
                style={styles.searchbar}
            />
          </View>
        }
        ListEmptyComponent={!loading ? (error ? renderErrorState() : renderEmptyState()) : null}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} colors={[theme.colors.primary]}/>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={handleCreateEvent}
        label="New Project"
        color={theme.colors.onPrimary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 15, paddingTop: 15, marginBottom: 10 },
  searchbar: { marginTop: 15 },
  listContent: { paddingBottom: 100 },
  card: { marginHorizontal: 15, marginBottom: 15 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: '30%' },
});



// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// // import QuestionnaireA from '../../../components/modals/QuestionnaireA';
// // import QuestionnaireB from '../../../components/modals/QuestionnaireB';
// // import QuestionnaireC from '../../../components/modals/QuestionnaireC';

// export default function EventsScreen() {
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState<{
//     type: 'A' | 'B' | 'C' | null;
//     visible: boolean;
//   }>({ type: null, visible: false });

//   const events = [
//     { id: '1', name: 'Wedding - Sarah & John', date: '2025-07-15' },
//     { id: '2', name: 'Corporate Event - TechCorp', date: '2025-08-20' },
//     { id: '3', name: 'Birthday Party - Emma', date: '2025-09-10' },
//   ];

//   const handleEventSelect = (eventId: string) => {
//     setSelectedEvent(eventId);
//     router.push('/dashboard');
//   };

//   const handleCreateEvent = () => {
//     Alert.alert(
//       'Create New Event',
//       'Choose questionnaire type:',
//       [
//         { text: 'Wedding (A)', onPress: () => setModalVisible({ type: 'A', visible: true }) },
//         { text: 'Corporate (B)', onPress: () => setModalVisible({ type: 'B', visible: true }) },
//         { text: 'Other (C)', onPress: () => setModalVisible({ type: 'C', visible: true }) },
//         { text: 'Cancel', style: 'cancel' },
//       ]
//     );
//   };

//   const closeModal = () => {
//     setModalVisible({ type: null, visible: false });
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         <Text style={styles.title}>Select an Event</Text>
        
//         {events.map((event) => (
//           <TouchableOpacity
//             key={event.id}
//             style={[
//               styles.eventCard,
//               selectedEvent === event.id && styles.selectedCard,
//             ]}
//             onPress={() => handleEventSelect(event.id)}
//           >
//             <Text style={styles.eventName}>{event.name}</Text>
//             <Text style={styles.eventDate}>{event.date}</Text>
//           </TouchableOpacity>
//         ))}

//         <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
//           <Text style={styles.createButtonText}>+ Create New Event</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Questionnaire Modals */}
//       {/* {modalVisible.type === 'A' && (
//         <QuestionnaireA
//           visible={modalVisible.visible}
//           onClose={closeModal}
//           onSubmit={(data) => {
//             console.log('Questionnaire A data:', data);
//             closeModal();
//           }}
//         />
//       )}
//       {modalVisible.type === 'B' && (
//         <QuestionnaireB
//           visible={modalVisible.visible}
//           onClose={closeModal}
//           onSubmit={(data) => {
//             console.log('Questionnaire B data:', data);
//             closeModal();
//           }}
//         />
//       )}
//       {modalVisible.type === 'C' && (
//         <QuestionnaireC
//           visible={modalVisible.visible}
//           onClose={closeModal}
//           onSubmit={(data) => {
//             console.log('Questionnaire C data:', data);
//             closeModal();
//           }}
//         />
//       )} */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollView: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   eventCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   selectedCard: {
//     borderColor: '#007AFF',
//     backgroundColor: '#f0f8ff',
//   },
//   eventName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   eventDate: {
//     fontSize: 14,
//     color: '#666',
//   },
//   createButton: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
