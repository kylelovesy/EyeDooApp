import { useCallback, useEffect, useState } from 'react';
import * as photoTagLinkService from '../services/photoTagLinkService';
import { PhotoTagLink, PhotoTagLinkSchema } from '../types/photoTagLink';

/**
 * Custom hook for managing photo-tag link data.
 * It handles loading, creating, updating, and deleting links from local storage.
 */
export const usePhotoTagLinks = () => {
  const [links, setLinks] = useState<PhotoTagLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial links from local storage
  useEffect(() => {
    const loadLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedLinks = await photoTagLinkService.getPhotoTagLinksLocally();
        setLinks(fetchedLinks);
      } catch (e) {
        setError('Failed to load tagged photos.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, []);

  /**
   * Creates and saves a new photo-tag link.
   * @param {string} photoUri - The local URI of the photo.
   * @param {string[]} tagIds - An array of IDs of the tags to link.
   * @param {string} projectId - The ID of the project this photo belongs to.
   */
  const addPhotoTagLink = useCallback(async (photoUri: string, tagIds: string[], projectId: string) => {
    try {
        // The schema will automatically generate the uuid and createdAt date
        const newLink = PhotoTagLinkSchema.parse({ photoUri, tagIds, projectId });
        await photoTagLinkService.savePhotoTagLinkLocally(newLink);
        // Add the new link to the top of the list
        setLinks(prev => [newLink, ...prev]);
    } catch (e) {
        setError('Failed to save tag for the photo.');
        console.error(e);
    }
  }, []);

  /**
   * Updates the tags for an existing photo-tag link.
   * @param {string} linkId - The ID of the link to update.
   * @param {string[]} newTagIds - The new array of tag IDs.
   */
  const updatePhotoTagLink = useCallback(async (linkId: string, newTagIds: string[]) => {
    try {
        const linkToUpdate = links.find(l => l.id === linkId);
        if (!linkToUpdate) throw new Error("Link not found in state.");

        const updatedLink = { ...linkToUpdate, tagIds: newTagIds };
        await photoTagLinkService.updatePhotoTagLinkLocally(updatedLink);
        setLinks(prev => prev.map(l => l.id === linkId ? updatedLink : l));
    } catch (e) {
        setError('Failed to update photo tags.');
        console.error(e);
    }
  }, [links]);

  /**
   * Deletes a photo-tag link and the associated photo file.
   * @param {string} linkId - The ID of the link to delete.
   */
  const removePhotoTagLink = useCallback(async (linkId: string) => {
    try {
        await photoTagLinkService.deletePhotoTagLinkLocally(linkId);
        setLinks(prev => prev.filter(l => l.id !== linkId));
    } catch (e) {
        setError('Failed to delete photo.');
        console.error(e);
    }
  }, []);

  /**
   * Get photo-tag links filtered by project ID.
   * @param {string} projectId - The project ID to filter by.
   * @returns {PhotoTagLink[]} - Links for the specified project.
   */
  const getLinksForProject = useCallback((projectId: string): PhotoTagLink[] => {
    return links.filter(link => link.projectId === projectId);
  }, [links]);

  return { links, loading, error, addPhotoTagLink, updatePhotoTagLink, removePhotoTagLink, getLinksForProject };
};

// import { useCallback, useEffect, useState } from 'react';
// import * as photoTagLinkService from '../services/photoTagLinkService';
// import { PhotoTagLink, PhotoTagLinkSchema } from '../types/photoTagLink';

// export const usePhotoTagLinks = () => {
//   const [links, setLinks] = useState<PhotoTagLink[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadLinks = async () => {
//       try {
//         setLoading(true);
//         const fetchedLinks = await photoTagLinkService.getPhotoTagLinksLocally();
//         setLinks(fetchedLinks);
//       } catch (e) {
//         setError('Failed to load tagged photos.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadLinks();
//   }, []);

//   const addPhotoTagLink = useCallback(async (photoUri: string, tagIds: string[]) => {
//     try {
//         const newLink = PhotoTagLinkSchema.parse({ photoUri, tagIds });
//         await photoTagLinkService.savePhotoTagLinkLocally(newLink);
//         setLinks(prev => [newLink, ...prev]);
//     } catch (e) {
//         setError('Failed to save tag for the photo.');
//         console.error(e);
//     }
//   }, []);

//   return { links, loading, error, addPhotoTagLink };
// };