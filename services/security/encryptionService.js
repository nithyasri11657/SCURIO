import CryptoJS from "crypto-js";

const SECRET_KEY = "SCURIO_SUPER_SECRET_KEY";

/**
 * Encrypt data using AES
 */
export const encryptData = (data) => {
  try {

    if (!data) {
      throw new Error("No data provided for encryption");
    }

    const encrypted = CryptoJS.AES.encrypt(
      data,
      SECRET_KEY
    ).toString();

    return encrypted;

  } catch (error) {
    console.error("Encryption error:", error);
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

    return decrypted;

  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};