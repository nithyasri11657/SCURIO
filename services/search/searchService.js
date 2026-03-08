import { executeQuery } from "../database/databaseService.js";

/**
 * Search folders
 */
export const searchFolders = async (queryText) => {

  try {

    if (!queryText) {
      throw new Error("Search query required");
    }

    const query = `
      SELECT * FROM folders
      WHERE name LIKE ?
    `;

    const result = await executeQuery(query, [`%${queryText}%`]);

    return result.rows._array;

  } catch (error) {

    console.error("Search folders error:", error);
    throw error;

  }
};


/**
 * Search notes
 */
export const searchNotes = async (queryText) => {

  try {

    if (!queryText) {
      throw new Error("Search query required");
    }

    const query = `
      SELECT * FROM notes
      WHERE title LIKE ?
    `;

    const result = await executeQuery(query, [`%${queryText}%`]);

    return result.rows._array;

  } catch (error) {

    console.error("Search notes error:", error);
    throw error;

  }
};


/**
 * Search files
 */
export const searchFiles = async (queryText) => {

  try {

    if (!queryText) {
      throw new Error("Search query required");
    }

    const query = `
      SELECT * FROM files
      WHERE file_name LIKE ?
    `;

    const result = await executeQuery(query, [`%${queryText}%`]);

    return result.rows._array;

  } catch (error) {

    console.error("Search files error:", error);
    throw error;

  }
};


/**
 * Global search across all resources
 */
export const globalSearch = async (queryText) => {

  try {

    const folders = await searchFolders(queryText);
    const notes = await searchNotes(queryText);
    const files = await searchFiles(queryText);

    return {
      folders,
      notes,
      files
    };

  } catch (error) {

    console.error("Global search error:", error);
    throw error;

  }
};
