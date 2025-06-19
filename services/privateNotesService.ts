import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { PrivateNote, ProjectNotes } from '../types/notes';
import { db } from './firebase';
import {
  CommonSchemas,
  CreateNoteInputSchema,
  createServiceError,
  OPERATION_NAMES,
  SERVICE_NAMES,
  validateAndParse,
  validateServiceParams
} from './schemas';
import { convertTimestampFields } from './utils/timestampHelpers';

export class PrivateNotesService {
  /**
   * Saves or updates private notes for a project.
   * @param projectId The ID of the project.
   * @param notes An array of private notes.
   */
  static async savePrivateNotes(projectId: string, notes: PrivateNote[]): Promise<void> {
    try {
      // Validate inputs
      validateServiceParams(
        { projectId, notes },
        ['projectId', 'notes'],
        SERVICE_NAMES.NOTES,
        'savePrivateNotes'
      );

      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'savePrivateNotes projectId'
      );

      // Validate each note (basic structure validation)
      if (!Array.isArray(notes)) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          'savePrivateNotes',
          new Error('Notes must be an array')
        );
      }

      const notesRef = doc(db, 'privateNotes', validatedProjectId);
      await setDoc(notesRef, { 
        projectId: validatedProjectId, 
        notes,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('EyeDooApp: Private notes saved successfully for project:', validatedProjectId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        'savePrivateNotes',
        error,
        'Failed to save private notes'
      );
    }
  }

  /**
   * Retrieves private notes for a project.
   * @param projectId The ID of the project.
   * @returns The project notes data or null if not found.
   */
  static async getPrivateNotes(projectId: string): Promise<ProjectNotes | null> {
    try {
      // Validate input
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'getPrivateNotes projectId'
      );

      const notesRef = doc(db, 'privateNotes', validatedProjectId);
      const docSnap = await getDoc(notesRef);
      
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        
        // Convert timestamps for notes that might have them
        const convertedData = convertTimestampFields(rawData, ['updatedAt']);
        
        // Convert timestamps in individual notes if they exist
        if (convertedData.notes) {
          convertedData.notes = convertedData.notes.map((note: any) => 
            convertTimestampFields(note, ['createdAt', 'updatedAt'])
          );
        }
        
        return convertedData as ProjectNotes;
      }
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        'getPrivateNotes',
        error,
        'Failed to retrieve private notes'
      );
    }
  }

  /**
   * Adds a new private note to a project.
   * @param projectId The ID of the project.
   * @param newNoteContent The content of the new note.
   */
  static async addPrivateNote(projectId: string, newNoteContent: string): Promise<void> {
    try {
      // Validate inputs using schema
      const validatedInput = validateAndParse(
        CreateNoteInputSchema.pick({ projectId: true, content: true }),
        { projectId, content: newNoteContent },
        'addPrivateNote input'
      );

      const currentNotes = await this.getPrivateNotes(validatedInput.projectId);
      
      const newNote: PrivateNote = {
        id: `note-${Date.now()}`,
        content: validatedInput.content,
        createdAt: new Date().toISOString(), // Keep ISO string for notes for compatibility
        updatedAt: new Date().toISOString(),
      };
      
      const updatedNotes = currentNotes ? [...currentNotes.notes, newNote] : [newNote];
      await this.savePrivateNotes(validatedInput.projectId, updatedNotes);
      
      console.log('EyeDooApp: Private note added successfully for project:', validatedInput.projectId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        OPERATION_NAMES.CREATE_NOTE,
        error,
        'Failed to add private note'
      );
    }
  }

  /**
   * Updates an existing private note.
   * @param projectId The ID of the project.
   * @param updatedNote The updated note object.
   */
  static async updatePrivateNote(projectId: string, updatedNote: PrivateNote): Promise<void> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'updatePrivateNote projectId'
      );

      // Validate note structure
      validateServiceParams(
        { updatedNote },
        ['updatedNote'],
        SERVICE_NAMES.NOTES,
        OPERATION_NAMES.UPDATE_NOTE
      );

      if (!updatedNote.id) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.UPDATE_NOTE,
          new Error('Note ID is required for update')
        );
      }

      // Validate note content
      if (updatedNote.content) {
        validateAndParse(
          CommonSchemas.noteContent,
          updatedNote.content,
          'updatePrivateNote note content'
        );
      }

      const currentNotes = await this.getPrivateNotes(validatedProjectId);
      if (!currentNotes) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.UPDATE_NOTE,
          new Error('Project notes not found')
        );
      }

      const noteExists = currentNotes.notes.some(note => note.id === updatedNote.id);
      if (!noteExists) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.UPDATE_NOTE,
          new Error(`Note with ID ${updatedNote.id} not found`)
        );
      }

      const notesToSave = currentNotes.notes.map(note =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      );
      
      await this.savePrivateNotes(validatedProjectId, notesToSave);
      console.log('EyeDooApp: Private note updated successfully:', updatedNote.id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        OPERATION_NAMES.UPDATE_NOTE,
        error,
        'Failed to update private note'
      );
    }
  }

  /**
   * Deletes a private note.
   * @param projectId The ID of the project.
   * @param noteId The ID of the note to delete.
   */
  static async deletePrivateNote(projectId: string, noteId: string): Promise<void> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'deletePrivateNote projectId'
      );

      const validatedNoteId = validateAndParse(
        z.string().min(1, 'Note ID cannot be empty'),
        noteId,
        'deletePrivateNote noteId'
      );

      const currentNotes = await this.getPrivateNotes(validatedProjectId);
      if (!currentNotes) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.DELETE_NOTE,
          new Error('Project notes not found')
        );
      }

      const noteExists = currentNotes.notes.some(note => note.id === validatedNoteId);
      if (!noteExists) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.DELETE_NOTE,
          new Error(`Note with ID ${validatedNoteId} not found`)
        );
      }

      const notesToSave = currentNotes.notes.filter(note => note.id !== validatedNoteId);
      await this.savePrivateNotes(validatedProjectId, notesToSave);
      
      console.log('EyeDooApp: Private note deleted successfully:', validatedNoteId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        OPERATION_NAMES.DELETE_NOTE,
        error,
        'Failed to delete private note'
      );
    }
  }

  /**
   * Searches private notes within a project.
   * @param projectId The ID of the project.
   * @param searchTerm The term to search for.
   * @returns Array of matching notes.
   */
  static async searchPrivateNotes(projectId: string, searchTerm: string): Promise<PrivateNote[]> {
    try {
      // Validate inputs
      const validatedProjectId = validateAndParse(
        CommonSchemas.projectId,
        projectId,
        'searchPrivateNotes projectId'
      );

      if (!searchTerm || searchTerm.trim().length < 2) {
        throw createServiceError(
          SERVICE_NAMES.NOTES,
          OPERATION_NAMES.SEARCH,
          new Error('Search term must be at least 2 characters long')
        );
      }

      const projectNotes = await this.getPrivateNotes(validatedProjectId);
      if (!projectNotes) {
        return [];
      }

      const searchTermLower = searchTerm.toLowerCase().trim();
      const matchingNotes = projectNotes.notes.filter(note =>
        note.content.toLowerCase().includes(searchTermLower)
      );

      console.log(`EyeDooApp: Found ${matchingNotes.length} notes matching search term for project:`, validatedProjectId);
      return matchingNotes;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        throw error; // Re-throw validation errors as-is
      }
      throw createServiceError(
        SERVICE_NAMES.NOTES,
        OPERATION_NAMES.SEARCH,
        error,
        'Failed to search private notes'
      );
    }
  }
}