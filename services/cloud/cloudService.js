import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  getFirestore,
  setDoc,
  getDoc,
  doc
} from "firebase/firestore";

import { executeQuery } from "../database/databaseService.js";

/**
 * Firebase configuration
 * Replace with your Firebase credentials
 */
const firebaseConfig = {

  apiKey: "AIzaSyDuyfLjTWg2NBHCwHvrGc6lFRoLGp1A4rs",
  authDomain: "scurio-a4cef.firebaseapp.com",
  projectId: "scurio-a4cef",
  storageBucket: "scurio-a4cef.firebasestorage.app",
  messagingSenderId: "1063098122799",
  appId: "1:1063098122799:web:1037e53860e69841463cda",
  measurementId: "G-0VLH60LK32"

};

const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Login user
 */
export const loginUser = async (email, password) => {

  try {

    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("✅ User logged in");

    return userCredential.user;

  } catch (error) {

    console.error("❌ Login error:", error);
    throw error;

  }

};

export const registerUser = async (email, password) => {

  try {

    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("User registered");

    return userCredential.user;

  } catch (error) {

    console.error("Register error:", error);
    throw error;

  }

};


/**
 * Backup all local SQLite data to Firebase
 */
export const backupData = async (userId) => {

  try {

    if (!userId) {
      throw new Error("User ID required");
    }

    const folders = await executeQuery("SELECT * FROM folders");
    const notes = await executeQuery("SELECT * FROM notes");
    const files = await executeQuery("SELECT * FROM files");

    const backup = {
      folders: folders.rows._array,
      notes: notes.rows._array,
      files: files.rows._array,
      backupTime: new Date().toISOString()
    };

    await setDoc(
      doc(db, "scurio_backups", userId),
      backup
    );

    console.log("☁️ Backup successful");

    return true;

  } catch (error) {

    console.error("❌ Backup error:", error);
    throw error;

  }

};


/**
 * Restore data from Firebase to SQLite
 */
export const restoreData = async (userId) => {

  try {

    if (!userId) {
      throw new Error("User ID required");
    }

    const snapshot = await getDoc(
      doc(db, "scurio_backups", userId)
    );

    if (!snapshot.exists()) {
      throw new Error("No backup found");
    }

    const data = snapshot.data();

    console.log("☁️ Backup found, restoring...");

    // Restore folders
    for (const folder of data.folders || []) {

      await executeQuery(
        `INSERT INTO folders (id, name, lock_type, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          folder.id,
          folder.name,
          folder.lock_type,
          folder.password_hash,
          folder.created_at
        ]
      );

    }

    // Restore notes
    for (const note of data.notes || []) {

      await executeQuery(
        `INSERT INTO notes (id, folder_id, title, content, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          note.id,
          note.folder_id,
          note.title,
          note.content,
          note.created_at
        ]
      );

    }

    // Restore files
    for (const file of data.files || []) {

      await executeQuery(
        `INSERT INTO files (id, folder_id, file_name, file_path, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          file.id,
          file.folder_id,
          file.file_name,
          file.file_path,
          file.created_at
        ]
      );

    }

    console.log("✅ Restore completed");

    return data;

  } catch (error) {

    console.error("❌ Restore error:", error);
    throw error;

  }

};