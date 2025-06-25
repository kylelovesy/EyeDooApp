// File: app/(app)/tagPhoto.tsx
// Desc: Screen to apply tags. Now supports create and edit modes, and on-the-fly tag creation.

import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { Screen } from '../../components/ui/Screen';
import { TagInput } from '../../components/ui/TagInput';
import { HeadlineText } from '../../components/ui/Typography';
import { commonStyles } from '../../constants/styles';
import { TAG_COLORS } from '../../constants/tags';
import { useProjects } from '../../contexts/ProjectContext';
import { usePhotoTagLinks } from '../../hooks/usePhotoTagLinks';
import { useTags } from '../../hooks/useTags';
import { Tag } from '../../types/tag';

export default function TagPhotoScreen() {
    const { photoUri, photoTagLinkId, projectId } = useLocalSearchParams<{ 
        photoUri: string; 
        photoTagLinkId?: string;
        projectId?: string;
    }>();
    const router = useRouter();
    const theme = useTheme();
    const styles = useStyles(theme);

    const { currentProject } = useProjects();
    const { tags, saveTag } = useTags();
    const { links, addPhotoTagLink, updatePhotoTagLink } = usePhotoTagLinks();
    
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Get the active project ID (from params or current project)
    const activeProjectId = projectId || currentProject?.id;

    useEffect(() => {
        if (photoTagLinkId) {
            setIsEditMode(true);
            const existingLink = links.find(l => l.id === photoTagLinkId);
            if (existingLink) {
                const preselectedTags = tags.filter(t => existingLink.tagIds.includes(t.id));
                setSelectedTags(preselectedTags);
            }
        }
    }, [photoTagLinkId, links, tags]);

    if (!photoUri) { 
        return (
            <Screen>
                <Text>Error: No photo URI provided.</Text>
            </Screen>
        ); 
    }

    if (!activeProjectId) {
        return (
            <Screen>
                <Text>Error: No project selected. Please select a project first.</Text>
                <Button mode="outlined" onPress={() => router.back()}>
                    Go Back
                </Button>
            </Screen>
        );
    }

    const handleCreateTag = async (text: string): Promise<Tag | undefined> => {
        try {
            setIsLoading(true);
            const randomColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
            const newTagData = { 
                text: text.trim(), 
                color: randomColor 
            };
            
            console.log('Creating tag with data:', newTagData);
            
            // Save the tag to the service
            const createdTag = await saveTag(newTagData);
            console.log('Tag created successfully:', createdTag);
            
            return createdTag;
        } catch (error) {
            console.error("Failed to create tag:", error);
            Alert.alert("Error", `Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = async () => {
        if(selectedTags.length === 0) {
            Alert.alert("No Tags Selected", "Please select at least one tag to save.");
            return;
        }
        
        setIsLoading(true);
        const tagIds = selectedTags.map(t => t.id);

        try {
            if (isEditMode && photoTagLinkId) {
                // --- EDIT LOGIC ---
                await updatePhotoTagLink(photoTagLinkId, tagIds);
                router.back();
            } else {
                // --- CREATE LOGIC ---
                // Check if the photo file exists
                const fileInfo = await FileSystem.getInfoAsync(photoUri);
                if (!fileInfo.exists) {
                    throw new Error("Photo file not found. Please try taking the photo again.");
                }
                
                // Create the photo-tag link with project association
                await addPhotoTagLink(photoUri, tagIds, activeProjectId);
                
                // Navigate back to dashboard tags page instead of projects
                router.replace('/(app)/dashboard/(other)/tags');
            }
        } catch (error) {
            console.error("Failed to save photo and tags:", error);
            Alert.alert("Save Failed", `Could not save the photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container}>
                <HeadlineText style={commonStyles.textCenter}>
                    {isEditMode ? "Edit Tags" : "Tag Your Photo"}
                </HeadlineText>
                
                {activeProjectId && currentProject && (
                    <Text style={styles.projectName}>
                        Project: {currentProject.form1.projectName}
                    </Text>
                )}
                
                <Image source={{ uri: photoUri }} style={styles.photo} />

                <View style={styles.tagInputContainer}>
                    <TagInput 
                        availableTags={tags}
                        selectedTags={selectedTags}
                        onSelectionChange={setSelectedTags}
                        onTagCreate={handleCreateTag}
                    />
                </View>

                <View style={commonStyles.buttonContainer}>
                    <Button 
                        mode="text" 
                        onPress={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={handleSave} 
                        disabled={selectedTags.length === 0 || isLoading}
                        loading={isLoading}
                    >
                        {isEditMode ? "Update Tags" : "Save Tags"}
                    </Button>
                </View>
            </ScrollView>
        </Screen>
    );
}

const useStyles = (theme: any) => StyleSheet.create({
    container: { padding: 16 },
    photo: { width: '100%', height: 350, borderRadius: 12, marginVertical: 16 },
    tagInputContainer: { marginBottom: 24 },
    projectName: { 
        textAlign: 'center', 
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },
});

// // File: app/tagPhoto.tsx
// // Desc: Screen to apply tags to a captured photo.

// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
// import { Button, Text, useTheme } from 'react-native-paper';
// import { Screen } from '../components/ui/Screen';
// import { TagInput } from '../components/ui/TagInput';
// import { HeadlineText } from '../components/ui/Typography';
// import { commonStyles } from '../constants/styles';
// import { usePhotoTagLinks } from '../hooks/usePhotoTagLinks';
// import { useTags } from '../hooks/useTags';
// import { Tag } from '../types/tag';

// export default function TagPhotoScreen() {
//     const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
//     const router = useRouter();
//     const theme = useTheme();
//     const styles = useStyles(theme);

//     const { tags, loading: tagsLoading } = useTags();
//     const { addPhotoTagLink } = usePhotoTagLinks();
    
//     const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

//     if (!photoUri) {
//         // Should not happen if navigation is correct
//         return (
//             <Screen>
//                 <Text>Error: No photo URI provided.</Text>
//             </Screen>
//         )
//     }

//     const handleSave = async () => {
//         if(selectedTags.length === 0) {
//             // Using Alert for simplicity, but a Modal or Snackbar would be better
//             Alert.alert("No Tags Selected", "Please select at least one tag to save.");
//             return;
//         }
//         const tagIds = selectedTags.map(t => t.id);
//         await addPhotoTagLink(photoUri, tagIds);
//         router.back(); // Go back to the previous screen (camera)
//         router.back(); // Go back again to close camera and return to feed
//     };

//     return (
//         <Screen>
//             <ScrollView contentContainerStyle={styles.container}>
//                 <HeadlineText style={commonStyles.textCenter}>Tag Your Photo</HeadlineText>
//                 <Image source={{ uri: photoUri }} style={styles.photo} />

//                 <View style={styles.tagInputContainer}>
//                     <TagInput 
//                         availableTags={tags}
//                         selectedTags={selectedTags}
//                         onSelectionChange={setSelectedTags}
//                     />
//                 </View>

//                 <View style={commonStyles.buttonContainer}>
//                     <Button 
//                         mode="text" 
//                         onPress={() => router.back()}
//                     >
//                         Cancel
//                     </Button>
//                     <Button 
//                         mode="contained" 
//                         onPress={handleSave}
//                         disabled={selectedTags.length === 0}
//                     >
//                         Save Tags
//                     </Button>
//                 </View>
//             </ScrollView>
//         </Screen>
//     );
// }

// const useStyles = (theme: any) => StyleSheet.create({
//     container: {
//         padding: 16,
//     },
//     photo: {
//         width: '100%',
//         height: 350,
//         borderRadius: 12,
//         marginVertical: 16,
//     },
//     tagInputContainer: {
//         marginBottom: 24,
//     }
// });
