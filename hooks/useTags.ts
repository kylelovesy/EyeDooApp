import { useCallback, useEffect, useState } from 'react';
import * as tagService from '../services/tagService';
import { Tag, TagSchema } from '../types/tag';

/**
 * Custom hook for managing the master list of tags.
 * It encapsulates all logic for fetching, adding, updating, and deleting tags.
 */
export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTags = await tagService.getTags();
        setTags(fetchedTags);
      } catch (e) {
        setError('Failed to fetch tags.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const saveTag = useCallback(async (tag: Omit<Tag, 'id' | 'createdAt'> & { id?: string }): Promise<Tag> => {
    try {
      setLoading(true);
      setError(null);
      
      const tagToSave = {
          ...tag,
          createdAt: new Date(), // Add timestamp on save
      };

      if (tag.id) { // This is an update
        const fullTag = TagSchema.parse(tagToSave);
        const updatedTag = await tagService.updateTag(fullTag);
        setTags(prev => prev.map(t => (t.id === updatedTag.id ? updatedTag : t)));
        return updatedTag;
      } else { // This is a creation
        const { id, ...newTagData } = tagToSave;
        const newTag = await tagService.addTag(newTagData);
        setTags(prev => [...prev, newTag]);
        return newTag;
      }
    } catch (e) {
      setError(`Failed to save tag.`);
      console.error(e);
      throw e; // Re-throw to let caller handle the error
    } finally {
        setLoading(false);
    }
  }, []);

  const removeTag = useCallback(async (tagId: string) => {
    try {
        setLoading(true);
        setError(null);
        await tagService.deleteTag(tagId);
        setTags(prev => prev.filter(t => t.id !== tagId));
    } catch(e) {
        setError('Failed to delete tag.');
        console.error(e);
    } finally {
        setLoading(false);
    }
  }, []);

  return { tags, loading, error, saveTag, removeTag };
};
