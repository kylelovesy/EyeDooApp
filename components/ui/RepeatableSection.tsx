// ######################################################################
// # FILE: src/components/ui/RepeatableSection.tsx
// ######################################################################

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { CustomButton } from './CustomButton';
import { TitleText } from './Typography';

interface RepeatableSectionProps<T> {
  title: string;
  items: T[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addButonText?: string;
}


export const RepeatableSection = <T extends { id?: string | number }>({
  title,
  items,
  onAddItem,
  onRemoveItem,
  renderItem,
  addButonText = 'Add Item'
}: RepeatableSectionProps<T>) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <TitleText size="large" style={styles.title}>
        {title}
      </TitleText>
      {items.map((item, index) => (
        <View key={item.id || index} style={styles.itemContainer}>
          <View style={styles.itemContent}>
            {renderItem(item, index)}
          </View>
          <IconButton
            icon="delete-outline"
            size={24}
            onPress={() => onRemoveItem(index)}
            style={styles.deleteButton}
            iconColor={theme.colors.error}
          />
        </View>
      ))}
      <CustomButton
        title={addButonText}
        variant="outline"
        onPress={onAddItem}
        icon="plus"
        style={styles.addButton}
      />
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    padding: 15,
    backgroundColor: theme.colors.surface,
  },
  itemContent: {
    flex: 1,
    gap: 10,
  },
  deleteButton: {
    marginLeft: 10,
    marginTop: -5,
    backgroundColor: theme.colors.errorContainer,
  },
  addButton: {
    marginTop: 10,
  },
});
