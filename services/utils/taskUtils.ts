// utils/taskUtils.ts
import { v4 as uuidv4 } from 'uuid';
import { TTaskChecklistItem } from '../../types/taskChecklist';

export function generatePredefinedTasks(categories: any[]): TTaskChecklistItem[] {
  const tasks: TTaskChecklistItem[] = [];
  
  categories.forEach(category => {
    // This part might look slightly different depending on your constant's structure,
    // but the goal is the same: loop through the default items and format them.
    if (category.tasks && Array.isArray(category.tasks)) {
        category.tasks.forEach((task: any) => {
            tasks.push({
                id: uuidv4(),
                name: task.name,
                categoryId: category.id,
                completed: task.completed || false,
                notes: task.notes || '',
                isPredefined: true,
            });
        });
    }
  });
  
  return tasks;
}