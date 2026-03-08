import { executeQuery } from "../database/databaseService.js";
import * as FileSystem from "expo-file-system";

/**
 * Send file info to AI index
 */
const indexFileAI = async (text) => {

  try {

    await fetch(
      "http://127.0.0.1:8000/index?text=" + encodeURIComponent(text),
      { method: "POST" }
    );

  } catch (error) {

    console.warn("⚠️ AI indexing failed:", error);

  }

};


/**
 * Save file metadata to database
 */
export const saveFile = async (folderId, fileName, filePath) => {

  try {

    if (!folderId) {
      throw new Error("Folder ID required");
    }

    if (!fileName || fileName.trim() === "") {
      throw new Error("File name required");
    }

    if (!filePath) {
      throw new Error("File path required");
    }

    const query = `
      INSERT INTO files (folder_id, file_name, file_path, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;

    const result = await executeQuery(query, [
      folderId,
      fileName.trim(),
      filePath
    ]);

    console.log("📁 File saved:", fileName);

    // Index file name for AI search
    await indexFileAI(fileName);

    return result;

  } catch (error) {

    console.error("❌ Save file error:", error);
    throw error;

  }

};


/**
 * Get files inside a folder
 */
export const getFilesByFolder = async (folderId) => {

  try {

    if (!folderId) {
      throw new Error("Folder ID required");
    }

    const query = `
      SELECT * FROM files
      WHERE folder_id = ?
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(query, [folderId]);

    return result.rows._array;

  } catch (error) {

    console.error("❌ Get files error:", error);
    throw error;

  }

};


/**
 * Get single file
 */
export const getFileById = async (fileId) => {

  try {

    if (!fileId) {
      throw new Error("File ID required");
    }

    const query = `
      SELECT * FROM files
      WHERE id = ?
    `;

    const result = await executeQuery(query, [fileId]);

    return result.rows._array[0];

  } catch (error) {

    console.error("❌ Get file error:", error);
    throw error;

  }

};


/**
 * Delete file
 */
export const deleteFile = async (fileId, filePath) => {

  try {

    if (!fileId) {
      throw new Error("File ID required");
    }

    const query = `
      DELETE FROM files
      WHERE id = ?
    `;

    const result = await executeQuery(query, [fileId]);

    // Delete actual file from device
    if (filePath) {

      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      }

    }

    console.log("🗑️ File deleted:", fileId);

    return result;

  } catch (error) {

    console.error("❌ Delete file error:", error);
    throw error;

  }

};