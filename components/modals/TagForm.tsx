import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Text, TextInput } from 'react-native-paper';
import { commonStyles } from '../../constants/styles';
import { TAG_COLORS } from '../../constants/tagsTypes';
import { spacing, useAppTheme } from '../../constants/theme';
import { Tag, TagSchema } from '../../types/tag';
import { HeadlineText } from '../ui/Typography';

interface TagFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (tag: Tag) => void;
  initialData?: Tag | null;
  mode: 'create' | 'edit';
}

export const TagForm: React.FC<TagFormProps> = ({
  visible,
  onDismiss,
  onSave,
  initialData,
  mode,
}) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        setName(initialData.text);
        setSelectedColor(initialData.color);
      } else {
        setName('');
        setSelectedColor(TAG_COLORS[0]);
      }
      setError('');
    }
  }, [visible, mode, initialData]);

  const handleSubmit = () => {
    const result = TagSchema.safeParse({
      id: initialData?.id,
      name,
      color: selectedColor,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSave(result.data);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Card>
        <Card.Content>
          <HeadlineText size="medium" style={styles.title}>
            {mode === 'create' ? 'Create Tag' : 'Edit Tag'}
          </HeadlineText>

          <TextInput
            label="Tag Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            error={!!error}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.colorPickerLabel}>Tag Color</Text>
          <FlatList
            data={TAG_COLORS}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorPickerContainer}
            renderItem={({ item: color }) => (
              <Pressable
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Save
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Modal>
  );
};

// Styles remain the same, just ensure imports for theme/spacing are correct
const useStyles = (theme: any) =>
  StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      padding: spacing.lg,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    input: {
      marginBottom: spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: spacing.md,
    },
    colorPickerLabel: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: spacing.sm,
    },
    colorPickerContainer: {
      marginBottom: spacing.lg,
    },
    colorSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: theme.colors.primary,
      transform: [{ scale: 1.1 }],
    },
    buttonContainer: {
      ...commonStyles.row,
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.sm,
    },
  });
