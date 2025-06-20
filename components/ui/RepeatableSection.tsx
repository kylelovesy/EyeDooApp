// src/components/ui/RepeatableSection.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { CustomButton } from './CustomButton';
import { TitleText } from './Typography';

interface RepeatableSectionItem {
  id: string;
  [key: string]: any;
}

interface RepeatableSectionProps<T extends RepeatableSectionItem> {
  title: string;
  items: T[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  addButonText?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  minItems?: number;
}

export const RepeatableSection = <T extends RepeatableSectionItem>({
  title,
  items,
  onAddItem,
  onRemoveItem,
  addButonText = "Add Item",
  renderItem,
  minItems = 1,
}: RepeatableSectionProps<T>) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TitleText size="medium" style={styles.sectionTitle}>
        {title}
      </TitleText>
      
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <TitleText size="small" style={styles.itemTitle}>
              {title.slice(0, -1)} {index + 1}
            </TitleText>
            {items.length > minItems && (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onRemoveItem(item.id)}
                style={styles.deleteButton}
                iconColor={theme.colors.error}
              />
            )}
          </View>
          
          <View style={styles.itemContent}>
            {renderItem(item, index)}
          </View>
        </View>
      ))}
      
      <CustomButton
        title={addButonText}
        variant="outline"
        onPress={onAddItem}
        style={styles.addButton}
        icon="plus"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: spacing.sm,
  },
  itemContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemTitle: {
    opacity: 0.8,
  },
  deleteButton: {
    margin: 0,
  },
  itemContent: {
    gap: spacing.sm,
  },
  addButton: {
    marginTop: spacing.sm,
  },
});

export default RepeatableSection;