// # 4.4 Other Tab  
// # 4.4.1 Tags tab
import React from 'react';
import DashboardAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';
import { Screen } from '../../../../components/ui/Screen';
import { otherSubPages } from './_layout';

import { EmptyState } from '@/components/ui/EmptyState';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, FAB, IconButton, Text, useTheme } from 'react-native-paper';

import { BodyText } from '../../../../components/ui/Typography';
import { commonStyles } from '../../../../constants/styles';
import { useProjects } from '../../../../contexts/ProjectContext';
import { usePhotoTagLinks } from '../../../../hooks/usePhotoTagLinks';
import { useTags } from '../../../../hooks/useTags';
import { cleanupOldPhotoTagLinks } from '../../../../services/photoTagLinkService';
import { PhotoTagLink } from '../../../../types/photoTagLink';

// TODO: Add tag-form to the project forms
// Add custom text input for tag name
// Add custom color picker for tag color
// Make tagged photos show and be smaller on page



export default function SocialFeedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const styles = useStyles(theme);
  
  const { currentProject } = useProjects();
  const { 
    // links, 
    loading: linksLoading, 
    removePhotoTagLink, 
    getLinksForProject 
  } = usePhotoTagLinks();
  const { tags, loading: tagsLoading } = useTags();
  const [cleanupLoading, setCleanupLoading] = React.useState(false);

  // Filter links for current project only
  const projectLinks = currentProject ? getLinksForProject(currentProject.id) : [];

  const handleTakePhoto = () => {
    router.push('/(app)/camera');
  };

  const handleEditPhoto = (photoTagLink: PhotoTagLink) => {
    router.push({
      pathname: '/(app)/tagPhoto',
      params: {
        photoUri: photoTagLink.photoUri,
        photoTagLinkId: photoTagLink.id,
        projectId: photoTagLink.projectId
      }
    });
  };

  const handleDeletePhoto = async (photoTagLink: PhotoTagLink) => {
    try {
      await removePhotoTagLink(photoTagLink.id);
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleCleanupOldLinks = async () => {
    setCleanupLoading(true);
    try {
      const result = await cleanupOldPhotoTagLinks();
      alert(`Cleanup completed!\nRemoved ${result.removedFiles} link files and ${result.removedPhotos} photos.${result.errors.length > 0 ? `\n\nErrors: ${result.errors.join(', ')}` : ''}`);
    } catch (error) {
      console.error('Cleanup failed:', error);
      alert(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCleanupLoading(false);
    }
  };

  const renderItem = ({ item }: { item: PhotoTagLink }) => {
    const linkedTags = tags.filter(t => item.tagIds.includes(t.id));
    return (
      <Card style={commonStyles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.photoUri }} style={styles.photo} />
          <View style={styles.overlay}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              onPress={() => handleEditPhoto(item)}
              style={styles.overlayButton}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.onError}
              containerColor={theme.colors.error}
              onPress={() => handleDeletePhoto(item)}
              style={styles.overlayButton}
            />
          </View>
        </View>
        <Card.Content>
          <View style={styles.chipContainer}>
            {linkedTags.map(tag => (
              <Chip key={tag.id} style={{ backgroundColor: tag.color }} textStyle={{color: theme.colors.onPrimary}}>
                {tag.text}
              </Chip>
            ))}
          </View>
          <Text style={styles.dateText}>
            Tagged on: {item.createdAt.toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const isLoading = linksLoading || tagsLoading;

  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  if (!currentProject) {
    return (
      <Screen
        scrollable={false}
        padding="none"
        safeArea={true}
        paddingTop={0}
        edges={['top']}
        backgroundColor={theme.colors.background}
        statusBarStyle="auto"
        testID="dashboard-tags-screen-others-full"
      >
        <DashboardAppBar
          navigation={navigation}
          title="Tags"
          subPages={otherSubPages}
          currentSubPageId="tags"
          onBackPress={() => router.back()}
        />
        <View style={styles.header}>
          <BodyText>Please select a project to view tagged photos.</BodyText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scrollable={false}
      padding="none"
      safeArea={true}
      paddingTop={0}
      edges={['top']}
      backgroundColor={theme.colors.background}
      statusBarStyle="auto"
      testID="dashboard-tags-screen-others-full"
    >
      <DashboardAppBar
        navigation={navigation}
        title="Tags"
        subPages={otherSubPages}
        currentSubPageId="tags"
        // isIconVisible={customVisibility}
        onBackPress={() => router.back()}
      />

      <View style={styles.header}>
        <BodyText>Tagged photos for {currentProject.form1.projectName}.</BodyText>
        <Button 
          mode="outlined" 
          onPress={handleCleanupOldLinks}
          loading={cleanupLoading}
          disabled={cleanupLoading}
          style={styles.cleanupButton}
          icon="delete-sweep"
        >
          Clean Up Old Photos
        </Button>
      </View>
      
      {isLoading && projectLinks.length === 0 ? (
        <ActivityIndicator style={commonStyles.loadingContainer} />
      ) : (
        <FlatList
          data={projectLinks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={!isLoading ? (
            <EmptyState
              title="No Photos Tagged Yet"
              description="Tap the camera button to take and tag your first photo!"
              icon="camera-outline"
              actionTitle="Take Photo"
              onAction={handleTakePhoto}
            />
          ) : null}
        />
      )}

      <FAB
        icon="camera"
        style={styles.fab}
        label="Tag Photo"
        onPress={handleTakePhoto}
      />
    </Screen>
  );
}

const useStyles = (theme: any) => StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  cleanupButton: {
    marginTop: 12,
  },
  listContainer: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  overlayButton: {
    margin: 0,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  dateText: {
    marginTop: 12,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

// import React from 'react';
// import { ScrollView } from 'react-native';

// import { useRouter } from 'expo-router';
// import { Card } from 'react-native-paper';
// import DashboardAppBar, { NavigationProp, SubPage } from '../../../../components/navigation/DashboardAppbar';
// import { Screen } from '../../../../components/ui/Screen';
// import { BodyText, HeadlineText } from '../../../../components/ui/Typography';
// import { otherSubPages } from './_layout';


// export default function TagsScreen() {
//   const router = useRouter();
  
//   const navigation: NavigationProp = {
//     goBack: () => router.back(),
//     navigate: (route: string) => router.push(route as any),
//     push: (route: string) => router.push(route as any),
//     replace: (route: string) => router.replace(route as any),
//   };

//   const customVisibility = (subPage: SubPage, currentId: string): boolean => {
//     if (subPage.id === 'tags') {
//       return false;
//     }
//     return subPage.id !== currentId;
//   };
//   return (
//     <Screen contentContainerStyle={{ padding: 0 }}>
//       <DashboardAppBar
//         navigation={navigation}
//         title="Tags"
//         subPages={otherSubPages}
//         currentSubPageId="tags"
//         isIconVisible={customVisibility}
//         onBackPress={() => router.back()}
//       />
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//         <HeadlineText size="large">Tags</HeadlineText>
//         <Card style={{ marginTop: 16 }}>
//           <Card.Content>
//             <BodyText>Tags content goes here...</BodyText>
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </Screen>
//   );
// }
