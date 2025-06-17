// src/components/ui/RepeatableSection.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { CustomButton } from './CustomButton';
import { TitleText } from './Typography';

interface RepeatableSectionProps {
  title: string;
  items: any[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  addButonText?: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  minItems?: number;
}

export const RepeatableSection: React.FC<RepeatableSectionProps> = ({
  title,
  items,
  onAddItem,
  onRemoveItem,
  addButonText = "Add Item",
  renderItem,
  minItems = 1,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TitleText size="medium" style={styles.sectionTitle}>
        {title}
      </TitleText>
      
      {items.map((item, index) => (
        <View key={item.id || index} style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <TitleText size="small" style={styles.itemTitle}>
              {title.slice(0, -1)} {index + 1}
            </TitleText>
            {items.length > minItems && (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onRemoveItem(index)}
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



// // ######################################################################
// // # FILE: src/components/ui/RepeatableSection.tsx
// // ######################################################################

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { IconButton, useTheme } from 'react-native-paper';
// import { CustomButton } from './CustomButton';
// import { TitleText } from './Typography';

// interface RepeatableSectionProps<T> {
//   title: string;
//   items: T[];
//   onAddItem: () => void;
//   onRemoveItem: (index: number) => void;
//   renderItem: (item: T, index: number) => React.ReactNode;
//   addButonText?: string;
// }


// export const RepeatableSection = <T extends { id?: string | number }>({
//   title,
//   items,
//   onAddItem,
//   onRemoveItem,
//   renderItem,
//   addButonText = 'Add Item'
// }: RepeatableSectionProps<T>) => {
//   const theme = useTheme();
//   const styles = getStyles(theme);

//   return (
//     <View style={styles.container}>
//       <TitleText size="large" style={styles.title}>
//         {title}
//       </TitleText>
//       {items.map((item, index) => (
//         <View key={item.id || index} style={styles.itemContainer}>
//           <View style={styles.itemContent}>
//             {renderItem(item, index)}
//           </View>
//           <IconButton
//             icon="delete-outline"
//             size={24}
//             onPress={() => onRemoveItem(index)}
//             style={styles.deleteButton}
//             iconColor={theme.colors.error}
//           />
//         </View>
//       ))}
//       <CustomButton
//         title={addButonText}
//         variant="outline"
//         onPress={onAddItem}
//         icon="plus"
//         style={styles.addButton}
//       />
//     </View>
//   );
// };

// const getStyles = (theme: any) => StyleSheet.create({
//   container: {
//     marginBottom: 20,
//   },
//   title: {
//     marginTop: 20,
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.outline,
//     paddingBottom: 10,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: theme.colors.outline,
//     borderRadius: 8,
//     padding: 15,
//     backgroundColor: theme.colors.surface,
//   },
//   itemContent: {
//     flex: 1,
//     gap: 10,
//   },
//   deleteButton: {
//     marginLeft: 10,
//     marginTop: -5,
//     backgroundColor: theme.colors.errorContainer,
//   },
//   addButton: {
//     marginTop: 10,
//   },
// });
