import CryptoJS from "crypto-js";

const SECRET_KEY = "SCURIO_SUPER_SECRET_KEY";

/**
 * Encrypt data using AES
 */
export const encryptData = (data) => {
  try {

    if (data === undefined || data === null) {
      throw new Error("No data provided for encryption");
    }

    // Convert objects to string
    const text = typeof data === "string" ? data : JSON.stringify(data);

    const encrypted = CryptoJS.AES.encrypt(
      text,
      SECRET_KEY
    ).toString();

    return encrypted;

  } catch (error) {

    console.error("❌ Encryption error:", error);
    throw error;

  }
};

/**
 * Decrypt data
 */
export const decryptData = (cipherText) => {
  try {

    if (!cipherText) {
      throw new Error("No cipher text provided");
    }

    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      SECRET_KEY
    );

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Failed to decrypt data");
    }

    // Try parsing JSON automatically
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }

  } catch (error) {

    console.error("❌ Decryption error:", error);
    throw error;

  }
};

/**
 * Hash password for folder locking
 */
export const hashPassword = (password) => {
  try {

    if (!password) {
      throw new Error("Password required");
    }

    return CryptoJS.SHA256(password).toString();

  } catch (error) {

    console.error("❌ Password hashing error:", error);
    throw error;

  }
};

/**
 * Verify password
 */
export const verifyPassword = (password, hash) => {
  try {

    const hashedInput = CryptoJS.SHA256(password).toString();

    return hashedInput === hash;

  } catch (error) {

    console.error("❌ Password verification error:", error);
    return false;

  }
};