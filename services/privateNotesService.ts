import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PrivateNote, ProjectNotes } from '../types/notes';
import { db } from './firebase';

export class PrivateNotesService {
  /**
   * Saves or updates private notes for a project.
   * @param projectId The ID of the project.
   * @param notes An array of private notes.
   */
  static async savePrivateNotes(projectId: string, notes: PrivateNote[]): Promise<void> {
    try {
      const notesRef = doc(db, 'privateNotes', projectId);
      await setDoc(notesRef, { projectId, notes }, { merge: true });
      console.log('Private notes saved successfully for project:', projectId);
    } catch (error) {
      console.error('Error saving private notes:', error);
      throw error;
    }
  }

  /**
   * Retrieves private notes for a project.
   * @param projectId The ID of the project.
   * @returns The project notes data or null if not found.
   */
  static async getPrivateNotes(projectId: string): Promise<ProjectNotes | null> {
    try {
      const notesRef = doc(db, 'privateNotes', projectId);
      const docSnap = await getDoc(notesRef);
      if (docSnap.exists()) {
        return docSnap.data() as ProjectNotes;
      }
      return null;
    } catch (error) {
      console.error('Error getting private notes:', error);
      throw error;
    }
  }

  /**
   * Adds a new private note to a project.
   * @param projectId The ID of the project.
   * @param newNoteContent The content of the new note.
   */
  static async addPrivateNote(projectId: string, newNoteContent: string): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      const newNote: PrivateNote = {
        id: `note-${Date.now()}`,
        content: newNoteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedNotes = currentNotes ? [...currentNotes.notes, newNote] : [newNote];
      await this.savePrivateNotes(projectId, updatedNotes);
      console.log('Private note added successfully for project:', projectId);
    } catch (error) {
      console.error('Error adding private note:', error);
      throw error;
    }
  }

  /**
   * Updates an existing private note.
   * @param projectId The ID of the project.
   * @param updatedNote The updated note object.
   */
  static async updatePrivateNote(projectId: string, updatedNote: PrivateNote): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      if (!currentNotes) {
        throw new Error('Project notes not found.');
      }
      const notesToSave = currentNotes.notes.map(note =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      );
      await this.savePrivateNotes(projectId, notesToSave);
      console.log('Private note updated successfully:', updatedNote.id);
    } catch (error) {
      console.error('Error updating private note:', error);
      throw error;
    }
  }

  /**
   * Deletes a private note.
   * @param projectId The ID of the project.
   * @param noteId The ID of the note to delete.
   */
  static async deletePrivateNote(projectId: string, noteId: string): Promise<void> {
    try {
      const currentNotes = await this.getPrivateNotes(projectId);
      if (!currentNotes) {
        throw new Error('Project notes not found.');
      }
      const notesToSave = currentNotes.notes.filter(note => note.id !== noteId);
      await this.savePrivateNotes(projectId, notesToSave);
      console.log('Private note deleted successfully:', noteId);
    } catch (error) {
      console.error('Error deleting private note:', error);
      throw error;
    }
  }
}