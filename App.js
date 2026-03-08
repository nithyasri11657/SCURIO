import React, { useEffect } from "react";
import { View, Text } from "react-native";

import {
  connectDatabase,
  initializeDatabase
} from "./services/database/databaseService";

import { createFolder, getFolders } from "./services/folders/folderService";
import { createNote, getNotesByFolder } from "./services/notes/notesService";
import { saveFile, getFilesByFolder } from "./services/files/fileService";

export default function App() {

  const runBackendTests = async () => {

    try {

      console.log("🚀 Starting SCURIO backend tests");

      // Test Folder Service
      await createFolder("Test Folder");

      const folders = await getFolders();
      console.log("📁 Folders:", folders);

      // Test Notes Service
      await createNote(1, "Test Note", "My bank card number is 1234");

      const notes = await getNotesByFolder(1);
      console.log("📝 Notes:", notes);

      // Test File Service
      await saveFile(1, "passport.pdf", "/mock/passport.pdf");

      const files = await getFilesByFolder(1);
      console.log("📄 Files:", files);

      console.log("✅ Backend test completed");

    } catch (error) {

      console.error("❌ Backend test failed:", error);

    }

  };

  useEffect(() => {

    try {

      connectDatabase();
      initializeDatabase();

      // Run backend tests
      setTimeout(() => {
        runBackendTests();
      }, 1000);

    } catch (error) {

      console.error("App initialization error:", error);

    }

  }, []);

  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SCURIO Backend Test Running</Text>
    </View>

  );

}