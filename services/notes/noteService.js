import { executeQuery } from "../database/databaseService.js";
import { encryptData, decryptData } from "../security/encryptionService.js";

/**
 * Send note to AI index
 */
const indexNoteAI = async (text) => {

  try {

    await fetch(
      "http://127.0.0.1:8000/index?text=" + encodeURIComponent(text),
      {
        method: "POST"
      }
    );

  } catch (error) {

    console.warn("⚠️ AI indexing failed:", error);

  }

};


/**
 * Create a new note
 */
export const createNote = async (folderId, title, content) => {

  try {

    if (!folderId) {
      throw new Error("Folder ID is required");
    }

    if (!title || title.trim() === "") {
      throw new Error("Note title is required");
    }

    const encryptedContent = encryptData(content || "");

    const query = `
      INSERT INTO notes (folder_id, title, content, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;

    const result = await executeQuery(query, [
      folderId,
      title.trim(),
      encryptedContent
    ]);

    console.log("✅ Note created:", title);

    // Index note for AI search
    await indexNoteAI(`${title} ${content}`);

    return result;

  } catch (error) {

    console.error("❌ Create note error:", error);
    throw error;

  }

};


/**
 * Get notes inside a folder
 */
export const getNotesByFolder = async (folderId) => {

  try {

    if (!folderId) {
      throw new Error("Folder ID required");
    }

    const query = `
      SELECT * FROM notes
      WHERE folder_id = ?
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(query, [folderId]);

    const notes = result.rows._array.map(note => {

      let decryptedContent = "";

      try {
        decryptedContent = decryptData(note.content);
      } catch {
        decryptedContent = "";
      }

      return {
        ...note,
        content: decryptedContent
      };

    });

    return notes;

  } catch (error) {

    console.error("❌ Get notes error:", error);
    throw error;

  }

};


/**
 * Get single note
 */
export const getNoteById = async (noteId) => {

  try {

    if (!noteId) {
      throw new Error("Note ID required");
    }

    const query = `
      SELECT * FROM notes
      WHERE id = ?
    `;

    const result = await executeQuery(query, [noteId]);

    const note = result.rows._array[0];

    if (!note) return null;

    return {
      ...note,
      content: decryptData(note.content)
    };

  } catch (error) {

    console.error("❌ Get note error:", error);
    throw error;

  }

};


/**
 * Update a note
 */
export const updateNote = async (noteId, title, content) => {

  try {

    if (!noteId) {
      throw new Error("Note ID required");
    }

    const encryptedContent = encryptData(content || "");

    const query = `
      UPDATE notes
      SET title = ?, content = ?
      WHERE id = ?
    `;

    const result = await executeQuery(query, [
      title,
      encryptedContent,
      noteId
    ]);

    console.log("✏️ Note updated:", noteId);

    // Update AI index
    await indexNoteAI(`${title} ${content}`);

    return result;

  } catch (error) {

    console.error("❌ Update note error:", error);
    throw error;

  }

};


/**
 * Delete a note
 */
export const deleteNote = async (noteId) => {

  try {

    if (!noteId) {
      throw new Error("Note ID required");
    }

    const query = `
      DELETE FROM notes
      WHERE id = ?
    `;

    const result = await executeQuery(query, [noteId]);

    console.log("🗑️ Note deleted:", noteId);

    return result;

  } catch (error) {

    console.error("❌ Delete note error:", error);
    throw error;

  }

};