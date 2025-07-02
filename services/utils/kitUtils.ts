// utils/kitUtils.ts
import { v4 as uuidv4 } from 'uuid';
import { TKitChecklistItem } from '../../types/kitChecklist';

export function generatePredefinedItems(categories: any[]): TKitChecklistItem[] {
  const items: TKitChecklistItem[] = [];
  
  categories.forEach(category => {
    // This part might look slightly different depending on your constant's structure,
    // but the goal is the same: loop through the default items and format them.
    if (category.items && Array.isArray(category.items)) {
        category.items.forEach((item: any) => {
            items.push({
                id: uuidv4(),
                name: item.name,
                categoryId: category.id,
                quantity: item.quantity || 1,
                notes: item.notes || '',
                isPredefined: true,
                packed: false,
            });
        });
    }
  });
  
  return items;
}