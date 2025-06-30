/*-------------------------------------*/
// components/views/KitChecklistView.tsx
// Status: Complete
// What it does: 
// Displays the entire kit checklist, grouped by category in expandable sections.
// It uses the KitChecklistContext to get items and provides functionality to toggle their 'packed' status.
/*-------------------------------------*/

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Checkbox, List, Text } from 'react-native-paper';
import { PHOTOGRAPHY_PACKING_LIST } from '../../constants/kitChecklistTypes';
import { useKitChecklistContext } from '../../contexts/KitChecklistContext';
import { TKitChecklistItem } from '../../types/kitChecklist';

// A helper to group items by category for rendering
const groupItemsByCategory = (items: TKitChecklistItem[]) => {
  return items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, TKitChecklistItem[]>);
};

export const KitChecklistView = () => {
  const { items, loading, error, togglePackedStatus } = useKitChecklistContext();

  // Memoize the grouped items to prevent re-calculation on every render
  const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);

  if (loading && items.length === 0) {
    return <ActivityIndicator animating={true} size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.centered}>Error: {error.message}</Text>;
  }

  if (!items || items.length === 0) {
    return <Text style={styles.centered}>No checklist items found for this project.</Text>;
  }

  return (
    <ScrollView>
      <List.Section>
        {PHOTOGRAPHY_PACKING_LIST.map(({ type, displayName, Icon }) => {
          const categoryItems = groupedItems[type] || [];
          if (categoryItems.length === 0) return null;

          const packedCount = categoryItems.filter(item => item.packed).length;

          return (
            <List.Accordion
              key={type}
              title={`${displayName} (${packedCount}/${categoryItems.length})`}
              left={props => <Icon {...props} width={24} height={24} />}
              style={styles.accordion}
            >
              {categoryItems.map((item) => (
                <Checkbox.Item
                  key={item.id} // Use Firestore document ID as key
                  label={item.name}
                  status={item.packed ? 'checked' : 'unchecked'}
                  onPress={() => togglePackedStatus(item.id, item.packed)}
                  style={styles.checklistItem}
                />
              ))}
            </List.Accordion>
          );
        })}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accordion: {
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checklistItem: {
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
});
