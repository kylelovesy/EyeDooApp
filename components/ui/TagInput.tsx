import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, Text, TextInput, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { Tag } from '../../types/tag';
import { BodyText } from './Typography';

interface TagInputProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onSelectionChange: (tags: Tag[]) => void;
  // Callback to create a new tag in the master list
  onTagCreate: (text: string) => Promise<Tag | undefined>;
  label?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  availableTags,
  selectedTags,
  onSelectionChange,
  onTagCreate,
  label = 'Tags',
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [inputText, setInputText] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const suggestionPool = availableTags.filter(
    at => !selectedTags.some(st => st.id === at.id)
  );

  const filteredSuggestions = inputText
    ? suggestionPool.filter(tag =>
        tag.text.toLowerCase().includes(inputText.toLowerCase())
      )
    : suggestionPool;

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onSelectionChange([...selectedTags, tag]);
    }
    setInputText('');
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    onSelectionChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };
  
  const handleCreateAndAddTag = async () => {
    const text = inputText.trim();
    if (text.length === 0 || isCreating) return;

    try {
      setIsCreating(true);

      // Check if a tag with the same text already exists
      const existingTag = availableTags.find(t => t.text.toLowerCase() === text.toLowerCase());
      if (existingTag) {
          handleAddTag(existingTag);
          return;
      }

      // Create the new tag via the callback
      const newTag = await onTagCreate(text);
      if (newTag) {
          // Add the newly created tag to the selection
          handleAddTag(newTag);
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View>
      <TextInput
        label={label}
        value={inputText}
        onChangeText={setInputText}
        mode="outlined"
        style={styles.input}
        disabled={isCreating}
        right={
            <TextInput.Icon 
                icon={isCreating ? "loading" : "plus-circle"}
                onPress={handleCreateAndAddTag}
                disabled={inputText.trim().length === 0 || isCreating}
            />
        }
      />
      <View style={styles.chipContainer}>
        {selectedTags.map(tag => (
          <Chip
            key={tag.id}
            onClose={() => handleRemoveTag(tag)}
            style={[styles.chip, { backgroundColor: tag.color }]}
            textStyle={styles.chipText}
          >
            {tag.text}
          </Chip>
        ))}
      </View>

      <View style={styles.suggestionsContainer}>
        <BodyText style={styles.suggestionTitle}>
          {inputText ? 'Suggestions' : 'Available Tags'}
        </BodyText>
        <FlatList
          horizontal
          data={filteredSuggestions}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              onPress={() => handleAddTag(item)}
              style={[styles.chip, { backgroundColor: item.color }]}
              textStyle={styles.chipText}
            >
              {item.text}
            </Chip>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No suggestions</Text>
          }
        />
      </View>
    </View>
  );
};

const useStyles = (theme: any) =>
  StyleSheet.create({
    input: {
      marginBottom: spacing.sm,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
      minHeight: 40,
    },
    chip: {
      height: 32,
      justifyContent: 'center',
    },
    chipText: {
      color: theme.colors.onPrimary,
    },
    suggestionsContainer: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
    },
    suggestionTitle: {
      marginBottom: spacing.sm,
      color: theme.colors.onSurfaceVariant,
    },
    emptyText: {
        padding: spacing.md,
        color: theme.colors.onSurfaceVariant,
        fontStyle: 'italic',
    }
  });


// import React, { useState } from 'react';
// import { FlatList, StyleSheet, View } from 'react-native';
// import { Chip, Text, TextInput, useTheme } from 'react-native-paper';
// import { spacing } from '../../constants/theme';
// import { Tag } from '../../types/tag';
// import { BodyText } from './Typography';

// interface TagInputProps {
//   // All available tags for suggestions
//   availableTags: Tag[];
//   // Currently selected tags
//   selectedTags: Tag[];
//   // Callback when the selection changes
//   onSelectionChange: (tags: Tag[]) => void;
//   // Label for the input
//   label?: string;
// }

// export const TagInput: React.FC<TagInputProps> = ({
//   availableTags,
//   selectedTags,
//   onSelectionChange,
//   label = 'Tags',
// }) => {
//   const theme = useTheme();
//   const styles = useStyles(theme);
//   const [inputText, setInputText] = useState('');

//   // Filter out already selected tags from the suggestion list
//   const suggestionPool = availableTags.filter(
//     at => !selectedTags.some(st => st.id === at.id)
//   );

//   // Filter suggestions based on input text
//   const filteredSuggestions = inputText
//     ? suggestionPool.filter(tag =>
//         tag.text.toLowerCase().includes(inputText.toLowerCase())
//       )
//     : suggestionPool;

//   const handleAddTag = (tag: Tag) => {
//     if (!selectedTags.some(t => t.id === tag.id)) {
//       onSelectionChange([...selectedTags, tag]);
//     }
//     setInputText('');
//   };

//   const handleRemoveTag = (tagToRemove: Tag) => {
//     onSelectionChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
//   };

//   return (
//     <View>
//       <TextInput
//         label={label}
//         value={inputText}
//         onChangeText={setInputText}
//         mode="outlined"
//         style={styles.input}
//       />
//       {/* Container for selected tags */}
//       <View style={styles.chipContainer}>
//         {selectedTags.map(tag => (
//           <Chip
//             key={tag.id}
//             onClose={() => handleRemoveTag(tag)}
//             style={[styles.chip, { backgroundColor: tag.color }]}
//             textStyle={styles.chipText}
//           >
//             {tag.text}
//           </Chip>
//         ))}
//       </View>

//       {/* Suggestions List */}
//       <View style={styles.suggestionsContainer}>
//         <BodyText style={styles.suggestionTitle}>
//           {inputText ? 'Suggestions' : 'Available Tags'}
//         </BodyText>
//         <FlatList
//           horizontal
//           data={filteredSuggestions}
//           keyExtractor={item => item.id}
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <Chip
//               onPress={() => handleAddTag(item)}
//               style={[styles.chip, { backgroundColor: item.color }]}
//               textStyle={styles.chipText}
//             >
//               {item.text}
//             </Chip>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No more tags available</Text>
//           }
//         />
//       </View>
//     </View>
//   );
// };

// const useStyles = (theme: any) =>
//   StyleSheet.create({
//     input: {
//       marginBottom: spacing.sm,
//     },
//     chipContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       gap: spacing.sm,
//       marginBottom: spacing.md,
//       minHeight: 40,
//     },
//     chip: {
//       height: 32,
//       justifyContent: 'center',
//     },
//     chipText: {
//       color: theme.colors.onPrimary,
//     },
//     suggestionsContainer: {
//         marginTop: spacing.md,
//         paddingTop: spacing.md,
//         borderTopWidth: 1,
//         borderTopColor: theme.colors.outlineVariant,
//     },
//     suggestionTitle: {
//       marginBottom: spacing.sm,
//       color: theme.colors.onSurfaceVariant,
//     },
//     emptyText: {
//         padding: spacing.md,
//         color: theme.colors.onSurfaceVariant,
//         fontStyle: 'italic',
//     }
//   });
