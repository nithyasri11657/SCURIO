import * as SQLite from "expo-sqlite";

let db = null;

/**
 * Connect to the SQLite database
 */
export const connectDatabase = () => {
  try {

    if (db) {
      return db;
    }

    db = SQLite.openDatabase("scurio.db");

    console.log("✅ Database connected");

    return db;

  } catch (error) {

    console.error("❌ Database connection error:", error);
    throw error;

  }
};

/**
 * Initialize database tables
 */
export const initializeDatabase = () => {

  if (!db) {
    throw new Error("❌ Database not connected. Call connectDatabase() first.");
  }

  db.transaction(

    (tx) => {

      // Enable foreign keys
      tx.executeSql(`PRAGMA foreign_keys = ON;`);

      /**
       * Folders Table
       */
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS folders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          lock_type TEXT,
          password_hash TEXT,
          created_at TEXT
        );`,
        [],
        () => console.log("✅ folders table ready"),
        (_, error) => {
          console.error("❌ folders table error:", error);
          return false;
        }
      );

      /**
       * Notes Table
       */
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          folder_id INTEGER,
          title TEXT,
          content TEXT,
          created_at TEXT,
          FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log("✅ notes table ready"),
        (_, error) => {
          console.error("❌ notes table error:", error);
          return false;
        }
      );

      /**
       * Files Table
       */
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          folder_id INTEGER,
          file_name TEXT,
          file_path TEXT,
          created_at TEXT,
          FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log("✅ files table ready"),
        (_, error) => {
          console.error("❌ files table error:", error);
          return false;
        }
      );

    },

    (error) => {
      console.error("❌ Database transaction error:", error);
    },

    () => {
      console.log("✅ Database initialized successfully");
    }

  );

};

/**
 * Execute SQL query safely
 */
export const executeQuery = (query, params = []) => {

  return new Promise((resolve, reject) => {

    if (!db) {
      reject(new Error("❌ Database not connected"));
      return;
    }

    db.transaction(

      (tx) => {

        tx.executeSql(
          query,
          params,

          (_, result) => {
            resolve(result);
          },

          (_, error) => {
            console.error("❌ Query failed:", error);
            reject(error);
            return false;
          }

        );

      },

      (error) => {
        console.error("❌ Transaction error:", error);
        reject(error);
      }

    );

  });

};

/**
 * Close database connection (optional)
 */
export const closeDatabase = () => {

  if (!db) return;

  try {

    db._db.close();
    db = null;

    console.log("✅ Database closed");

  } catch (error) {

    console.error("❌ Error closing database:", error);

  }

};