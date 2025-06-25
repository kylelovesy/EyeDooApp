import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TAG_COLORS } from '../constants/tags';
import { Tag, TagSchema } from '../types/tag';

// Mock data simulating a database source
const mockTags: Tag[] = [
  { id: uuidv4(), text: 'Wedding', color: TAG_COLORS[0], createdAt: new Date() },
  { id: uuidv4(), text: 'Portrait', color: TAG_COLORS[1], createdAt: new Date() },
  { id: uuidv4(), text: 'Commercial', color: TAG_COLORS[2], createdAt: new Date() },
  { id: uuidv4(), text: 'Family', color: TAG_COLORS[3], createdAt: new Date() },
];

const API_DELAY = 500;

export const getTags = (): Promise<Tag[]> => {
  console.log('SERVICE: Fetching tags...');
  return new Promise(resolve => setTimeout(() => resolve([...mockTags]), API_DELAY));
};

export const addTag = (tagData: Pick<Tag, 'text' | 'color'>): Promise<Tag> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Create the full tag object with all required fields
            const fullTagData = {
                id: uuidv4(),
                text: tagData.text,
                color: tagData.color,
                createdAt: new Date()
            };
            
            // Validate the complete tag object
            const newTag = TagSchema.parse(fullTagData);
            mockTags.push(newTag);
            console.log('SERVICE: Created new tag:', newTag);
            resolve(newTag);
        }, API_DELAY);
    });
};

export const updateTag = (updatedTag: Tag): Promise<Tag> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockTags.findIndex(t => t.id === updatedTag.id);
            if (index !== -1) {
                mockTags[index] = updatedTag;
                resolve(updatedTag);
            } else {
                reject(new Error('Tag not found'));
            }
        }, API_DELAY);
    });
};

export const deleteTag = (tagId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockTags.findIndex(t => t.id === tagId);
            if (index !== -1) {
                mockTags.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Tag not found'));
            }
        }, API_DELAY);
    });
};