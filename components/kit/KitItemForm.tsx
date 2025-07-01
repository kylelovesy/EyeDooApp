// /*-------------------------------------*/
// // components/kit/KitItemForm.tsx
// // Status: Complete
// // What it does: 
// // Provides a form for adding a new custom item to the kit checklist.
// // This component will be rendered inside the KitChecklistFormModal.
// /*-------------------------------------*/

// import { zodResolver } from '@hookform/resolvers/zod';
// import React from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { StyleSheet, View } from 'react-native';
// import { Button, HelperText, TextInput } from 'react-native-paper';
// import { z } from 'zod';
// import { KitCategory } from '../../constants/kitChecklistTypes';
// import { TKitChecklistItem } from '../../types/kitChecklist';

// // Schema for form validation. Note it's a subset of the main schema.
// const KitItemFormSchema = z.object({
//   name: z.string().min(3, 'Item name must be at least 3 characters.'),
//   quantity: z.number().optional(),
//   notes: z.string().optional(),
//   category: z.nativeEnum(KitCategory),
// });

// type KitItemFormData = Omit<TKitChecklistItem, 'id' | 'packed'>;

// interface KitItemFormProps {
//   onSubmit: (data: KitItemFormData) => void;
//   onCancel: () => void;
//   isSubmitting: boolean;
// }

// export const KitItemForm: React.FC<KitItemFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
//   const { control, handleSubmit, formState: { errors } } = useForm<KitItemFormData>({
//     resolver: zodResolver(KitItemFormSchema),
//     defaultValues: {
//       category: KitCategory.ESSENTIALS, // Default to a sensible category
//     },
//   });

//   return (
//     <View style={styles.container}>
//       {/* Name Input */}
//       <Controller
//         name="name"
//         control={control}
//         render={({ field: { onChange, onBlur, value } }) => (
//           <TextInput
//             label="Item Name"
//             value={value}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             error={!!errors.name}
//             style={styles.input}
//           />
//         )}
//       />
//       {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}
      
//       {/* TODO: Add a Picker/Select for Category */}
//       {/* For now, it defaults to Essentials. A dropdown would be ideal here. */}

//       {/* Quantity Input */}
//       <Controller
//         name="quantity"
//         control={control}
//         render={({ field: { onChange, onBlur, value } }) => (
//           <TextInput
//             label="Quantity"
//             value={value ? String(value) : ''}
//             onBlur={onBlur}
//             onChangeText={(text) => onChange(parseInt(text, 10) || undefined)}
//             keyboardType="numeric"
//             error={!!errors.quantity}
//             style={styles.input}
//           />
//         )}
//       />
//       {errors.quantity && <HelperText type="error">{errors.quantity.message}</HelperText>}
      
//       {/* Notes Input */}
//       <Controller
//         name="notes"
//         control={control}
//         render={({ field: { onChange, onBlur, value } }) => (
//           <TextInput
//             label="Notes (e.g., model, size)"
//             value={value}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             error={!!errors.notes}
//             style={styles.input}
//           />
//         )}
//       />
//       {errors.notes && <HelperText type="error">{errors.notes.message}</HelperText>}

//       <View style={styles.buttonRow}>
//         <Button onPress={onCancel} disabled={isSubmitting}>Cancel</Button>
//         <Button
//           mode="contained"
//           onPress={handleSubmit(onSubmit)}
//           loading={isSubmitting}
//           disabled={isSubmitting}
//         >
//           Add Item
//         </Button>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   input: {
//     marginBottom: 8,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 16,
//   },
// });
