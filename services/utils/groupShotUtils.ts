// utils/kitUtils.ts
import { v4 as uuidv4 } from 'uuid';
import { TGroupShotsChecklistItem } from '../../types/groupShotsChecklist';

export function generatePredefinedGroupShots(categories: any[]): TGroupShotsChecklistItem[] {
  const shots: TGroupShotsChecklistItem[] = [];
  
  categories.forEach(category => {
    // This part might look slightly different depending on your constant's structure,
    // but the goal is the same: loop through the default items and format them.
    if (category.shots && Array.isArray(category.shots)) {
        category.shots.forEach((shot: any) => {
            shots.push({
                id: uuidv4(),
                name: shot.name,
                categoryId: category.id,
                completed: shot.completed || false,
                notes: shot.notes || '',
                isPredefined: true,
            });
        });
    }
  });
  
  return shots;
}