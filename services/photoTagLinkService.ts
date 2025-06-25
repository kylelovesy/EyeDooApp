// File: services/photoTagLinkService.ts
// Desc: Handles reading, writing, updating, and deleting photo-tag links from the local file system.

import * as FileSystem from 'expo-file-system';
import { PhotoTagLink, PhotoTagLinkSchema } from '../types/photoTagLink';

const LINK_DIRECTORY = `${FileSystem.documentDirectory}photoTagLinks/`;

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(LINK_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(LINK_DIRECTORY, { intermediates: true });
  }
};

// --- CLEANUP FUNCTION ---
export const cleanupOldPhotoTagLinks = async (): Promise<{
  removedFiles: number;
  removedPhotos: number;
  errors: string[];
}> => {
  await ensureDirExists();
  const files = await FileSystem.readDirectoryAsync(LINK_DIRECTORY);
  
  let removedFiles = 0;
  let removedPhotos = 0;
  const errors: string[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = `${LINK_DIRECTORY}${file}`;
      try {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        const data = JSON.parse(fileContent);
        
        // Try to validate with the new schema
        const validation = PhotoTagLinkSchema.safeParse({
          ...data,
          createdAt: new Date(data.createdAt)
        });
        
        if (!validation.success) {
          // This file doesn't match the new schema (likely missing projectId)
          console.log(`Removing invalid photo-tag link: ${file}`);
          
          // Try to delete the associated photo file
          if (data.photoUri) {
            try {
              await FileSystem.deleteAsync(data.photoUri, { idempotent: true });
              removedPhotos++;
            } catch (photoError) {
              console.warn(`Could not delete photo ${data.photoUri}:`, photoError);
            }
          }
          
          // Delete the JSON link file
          await FileSystem.deleteAsync(filePath, { idempotent: true });
          removedFiles++;
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        errors.push(`Failed to process ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  console.log(`Cleanup completed: ${removedFiles} link files and ${removedPhotos} photos removed`);
  return { removedFiles, removedPhotos, errors };
};

// --- CREATE ---
export const savePhotoTagLinkLocally = async (photoTagLink: PhotoTagLink) => {
  await ensureDirExists();
  const filePath = `${LINK_DIRECTORY}${photoTagLink.id}.json`;
  const dataToSave = { ...photoTagLink, createdAt: photoTagLink.createdAt.toISOString() };
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(dataToSave));
};

// --- READ ---
export const getPhotoTagLinksLocally = async (): Promise<PhotoTagLink[]> => {
  await ensureDirExists();
  const files = await FileSystem.readDirectoryAsync(LINK_DIRECTORY);
  const links: PhotoTagLink[] = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = `${LINK_DIRECTORY}${file}`;
      try {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        const data = JSON.parse(fileContent);
        const parsedLink = PhotoTagLinkSchema.parse({ ...data, createdAt: new Date(data.createdAt) });
        links.push(parsedLink);
      } catch (error) { 
        console.error('SERVICE: Failed to read or parse link file:', filePath, error);
        // Skip invalid files instead of crashing
      }
    }
  }
  links.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return links;
};

// --- UPDATE ---
export const updatePhotoTagLinkLocally = async (updatedLink: PhotoTagLink) => {
    await ensureDirExists();
    const filePath = `${LINK_DIRECTORY}${updatedLink.id}.json`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
        throw new Error("File to update does not exist.");
    }
    const dataToSave = { ...updatedLink, createdAt: updatedLink.createdAt.toISOString() };
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(dataToSave));
}

// --- DELETE ---
export const deletePhotoTagLinkLocally = async (linkId: string) => {
    await ensureDirExists();
    const filePath = `${LINK_DIRECTORY}${linkId}.json`;
    try {
        // First, get the photo URI from the link file to delete the image
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        const data = JSON.parse(fileContent);
        const photoUri = data.photoUri;

        // Delete the image file
        await FileSystem.deleteAsync(photoUri, { idempotent: true });
        
        // Then delete the JSON link file
        await FileSystem.deleteAsync(filePath, { idempotent: true });

    } catch (error) {
        console.error(`Failed to delete link and photo for ID ${linkId}:`, error);
        // If something fails, still try to delete the JSON file as a fallback
        await FileSystem.deleteAsync(filePath, { idempotent: true });
    }
};

// import * as FileSystem from 'expo-file-system';
// import { PhotoTagLink, PhotoTagLinkSchema } from '../types/photoTagLink';

// const LINK_DIRECTORY = `${FileSystem.documentDirectory}photoTagLinks/`;

// /**
//  * Ensures the directory for storing photo-tag links exists.
//  */
// const ensureDirExists = async () => {
//   const dirInfo = await FileSystem.getInfoAsync(LINK_DIRECTORY);
//   if (!dirInfo.exists) {
//     await FileSystem.makeDirectoryAsync(LINK_DIRECTORY, { intermediates: true });
//   }
// };

// /**
//  * Saves a single PhotoTagLink object to a JSON file on the device.
//  * @param {PhotoTagLink} photoTagLink - The link object to save.
//  */
// export const savePhotoTagLinkLocally = async (photoTagLink: PhotoTagLink) => {
//   await ensureDirExists();
//   const filePath = `${LINK_DIRECTORY}${photoTagLink.id}.json`;
  
//   // Zod dates are converted to ISO strings for JSON serialization
//   const dataToSave = {
//       ...photoTagLink,
//       createdAt: photoTagLink.createdAt.toISOString(),
//   };

//   await FileSystem.writeAsStringAsync(filePath, JSON.stringify(dataToSave));
//   console.log('SERVICE: Saved PhotoTagLink locally:', filePath);
// };

// /**
//  * Retrieves all PhotoTagLink objects from the local file system.
//  * @returns {Promise<PhotoTagLink[]>} A promise that resolves to an array of links.
//  */
// export const getPhotoTagLinksLocally = async (): Promise<PhotoTagLink[]> => {
//   await ensureDirExists();
//   const files = await FileSystem.readDirectoryAsync(LINK_DIRECTORY);
//   const links: PhotoTagLink[] = [];

//   for (const file of files) {
//     if (file.endsWith('.json')) {
//       const filePath = `${LINK_DIRECTORY}${file}`;
//       try {
//         const fileContent = await FileSystem.readAsStringAsync(filePath);
//         const data = JSON.parse(fileContent);
        
//         // Convert ISO string back to Date object and validate with Zod
//         const parsedLink = PhotoTagLinkSchema.parse({
//             ...data,
//             createdAt: new Date(data.createdAt),
//         });
//         links.push(parsedLink);
//       } catch (error) {
//         console.error('SERVICE: Failed to read or parse link file:', filePath, error);
//       }
//     }
//   }
  
//   // Sort by newest first
//   links.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//   console.log(`SERVICE: Loaded ${links.length} PhotoTagLinks from local storage.`);
//   return links;
// };
