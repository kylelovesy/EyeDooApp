// # 4.4 Other Tab
// # 4.4.0 Notes tab (default)
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';

// Define your subpages for dashboard
const otherSubPages = [
  { id: 'index', title: 'Notes', iconName: 'sticky-note', route: '/(app)/dashboard/(other)' },
  { id: 'tags', title: 'Tags', iconName: 'tag', route: '/(app)/dashboard/(other)/tags' },
  { id: 'vendors', title: 'Vendors', iconName: 'contact-card', route: '/(app)/dashboard/(other)/vendors' },
  { id: 'preparation', title: 'Preparation', iconName: 'bag', route: '/(app)/dashboard/(other)/preparation' },
];

export default function DashboardOtherScreen() {
  const router = useRouter();
  
  // Create navigation object that matches the expected interface
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  const customVisibility = (subPage: SubPage, currentId: string): boolean => {
    if (subPage.id === 'index') {
      return false;
    }
    return subPage.id !== currentId;
  };
    return (
    <Screen contentContainerStyle={{ padding: 0 }}>
      <DashboardAppBar
        navigation={navigation}
        title="Notes"
        subPages={otherSubPages}
        currentSubPageId="index"
        onBackPress={() => router.back()}
        isIconVisible={customVisibility}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Notes</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Notes content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}


// import React, { useState } from 'react';
// import {
//     Alert,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { CustomButton } from '../../../../components/ui/CustomButton';
// import {
//     BodyText,
//     HeadlineText,
//     TitleText,
// } from '../../../../components/ui/Typography';
// import { borderRadius, spacing, useAppTheme } from '../../../../constants/theme';

// export default function NotesScreen() {
//   const theme = useAppTheme();
//   const styles = createThemedStyles(theme);

//   const [notes, setNotes] = useState([
//     { id: 1, title: 'Bride preferences', content: 'Wants natural lighting for portraits. Prefers candid shots over posed.' },
//     { id: 2, title: 'Important shots', content: 'Must get: Ring exchange, first dance, cake cutting, family group photo' },
//     { id: 3, title: 'Venue notes', content: 'Best lighting at 4-6 PM. Backup indoor location: main hall' },
//   ]);
//   const [newNote, setNewNote] = useState({ title: '', content: '' });
//   const [showAddForm, setShowAddForm] = useState(false);

//   const handleAddNote = () => {
//     if (newNote.title.trim() && newNote.content.trim()) {
//       setNotes([...notes, { 
//         id: Date.now(), 
//         title: newNote.title, 
//         content: newNote.content 
//       }]);
//       setNewNote({ title: '', content: '' });
//       setShowAddForm(false);
//     } else {
//       Alert.alert('Error', 'Please fill in both title and content');
//     }
//   };

//   const handleDeleteNote = (id: number) => {
//     Alert.alert(
//       'Delete Note',
//       'Are you sure you want to delete this note?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => {
//           setNotes(notes.filter(note => note.id !== id));
//         }},
//       ]
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <HeadlineText size="medium" style={styles.title}>
//           Notes
//         </HeadlineText>
//         <CustomButton
//           title="+ Add Note"
//           variant="primary"
//           size="small"
//           onPress={() => setShowAddForm(!showAddForm)}
//         />
//       </View>

//       {showAddForm && (
//         <View style={styles.addForm}>
//           <TextInput
//             style={styles.titleInput}
//             placeholder="Note title..."
//             placeholderTextColor={theme.colors.onSurfaceVariant}
//             value={newNote.title}
//             onChangeText={(text) => setNewNote({ ...newNote, title: text })}
//           />
//           <TextInput
//             style={styles.contentInput}
//             placeholder="Note content..."
//             placeholderTextColor={theme.colors.onSurfaceVariant}
//             value={newNote.content}
//             onChangeText={(text) => setNewNote({ ...newNote, content: text })}
//             multiline
//             numberOfLines={4}
//           />
//           <View style={styles.formButtons}>
//             <CustomButton
//               title="Cancel"
//               variant="outline"
//               size="medium"
//               onPress={() => setShowAddForm(false)}
//             />
//             <CustomButton
//               title="Save"
//               variant="primary"
//               size="medium"
//               onPress={handleAddNote}
//             />
//           </View>
//         </View>
//       )}

//       <View style={styles.notesList}>
//         {notes.map((note) => (
//           <View key={note.id} style={styles.noteCard}>
//             <View style={styles.noteHeader}>
//               <TitleText size="medium" style={styles.noteTitle}>
//                 {note.title}
//               </TitleText>
//               <TouchableOpacity
//                 onPress={() => handleDeleteNote(note.id)}
//                 style={styles.deleteButton}
//               >
//                 <Text style={styles.deleteButtonText}>×</Text>
//               </TouchableOpacity>
//             </View>
//             <BodyText size="medium" style={styles.noteContent}>
//               {note.content}
//             </BodyText>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const createThemedStyles = (theme: any) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: spacing.lg,
//       backgroundColor: theme.colors.surface,
//       borderBottomWidth: 1,
//       borderBottomColor: theme.colors.outline,
//     },
//     title: {
//       color: theme.colors.onSurface,
//     },
//     addForm: {
//       backgroundColor: theme.colors.surface,
//       margin: spacing.md,
//       padding: spacing.md,
//       borderRadius: borderRadius.lg,
//       ...theme.elevation.level2,
//       gap: spacing.md,
//     },
//     titleInput: {
//       borderWidth: 1,
//       borderColor: theme.colors.outline,
//       borderRadius: borderRadius.md,
//       padding: spacing.md,
//       fontSize: 16,
//       color: theme.colors.onSurface,
//     },
//     contentInput: {
//       borderWidth: 1,
//       borderColor: theme.colors.outline,
//       borderRadius: borderRadius.md,
//       padding: spacing.md,
//       fontSize: 16,
//       height: 100,
//       textAlignVertical: 'top',
//       color: theme.colors.onSurface,
//     },
//     formButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: spacing.md,
//     },
//     notesList: {
//       padding: spacing.md,
//     },
//     noteCard: {
//       backgroundColor: theme.colors.surface,
//       padding: spacing.md,
//       marginBottom: spacing.sm,
//       borderRadius: borderRadius.lg,
//       ...theme.elevation.level2,
//     },
//     noteHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: spacing.sm,
//     },
//     noteTitle: {
//       color: theme.colors.onSurface,
//       flex: 1,
//     },
//     deleteButton: {
//       width: 28,
//       height: 28,
//       borderRadius: borderRadius.full,
//       backgroundColor: theme.colors.errorContainer,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     deleteButtonText: {
//       color: theme.colors.onErrorContainer,
//       fontSize: 20,
//       fontWeight: 'bold',
//       lineHeight: 22,
//     },
//     noteContent: {
//       color: theme.colors.onSurfaceVariant,
//       lineHeight: 22,
//     },
//   });
