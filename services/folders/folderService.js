import { executeQuery } from "../database/databaseService.js";
import { encryptData } from "../security/encryptionService.js";

/**
 * Create a new folder
 */
export const createFolder = async (name, lockType = "none", password = null) => {

  try {

    if (!name) {
      throw new Error("Folder name is required");
    }

    let passwordHash = null;

    if (password) {
      passwordHash = encryptData(password);
    }

    const query = `
      INSERT INTO folders (name, lock_type, password_hash, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;

    const result = await executeQuery(query, [
      name,
      lockType,
      passwordHash
    ]);

    console.log("Folder created:", name);

    return result;

  } catch (error) {

    console.error("Create folder error:", error);
    throw error;

  }
};

/**
 * Get all folders
 */
export const getFolders = async () => {

  try {

    const query = `
      SELECT * FROM folders
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(query);

    return result.rows._array;

  } catch (error) {

    console.error("Get folders error:", error);
    throw error;

  }
};

/**
 * Delete folder
 */
export const deleteFolder = async (folderId) => {

  try {

    if (!folderId) {
      throw new Error("Folder ID required");
    }

    const query = `
      DELETE FROM folders
      WHERE id = ?
    `;

    const result = await executeQuery(query, [folderId]);

    console.log("Folder deleted:", folderId);

    return result;

  } catch (error) {

    console.error("Delete folder error:", error);
    throw error;

  }
};
