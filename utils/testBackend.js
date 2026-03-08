import { createFolder, getFolders } from "../services/folders/folderService";
import { createNote, getNotesByFolder } from "../services/notes/notesService";
import { saveFile, getFilesByFolder } from "../services/files/fileService";

export const testFolders = async () => {

  try {

    await createFolder("Test Folder");

    const folders = await getFolders();

    console.log("Folders:", folders);

  } catch (error) {

    console.error("Folder test failed:", error);

  }

};



export const testNotes = async () => {

  await createNote(1, "Test Note", "My bank card number is 1234");

  const notes = await getNotesByFolder(1);

  console.log("Notes:", notes);

};




export const testFiles = async () => {

  await saveFile(
    1,
    "passport.pdf",
    "/storage/emulated/0/passport.pdf"
  );

  const files = await getFilesByFolder(1);

  console.log("Files:", files);

};