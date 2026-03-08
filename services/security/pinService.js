import * as SecureStore from "expo-secure-store";

/**
 * Save user PIN securely
 */
export const setPin = async (pin) => {
  try {

    if (!pin) {
      throw new Error("PIN cannot be empty");
    }

    await SecureStore.setItemAsync("SCURIO_APP_PIN", pin);

    console.log("PIN stored securely");

  } catch (error) {
    console.error("Error storing PIN:", error);
    throw error;
  }
};

/**
 * Get stored PIN
 */
export const getPin = async () => {
  try {

    const pin = await SecureStore.getItemAsync("SCURIO_APP_PIN");

    return pin;

  } catch (error) {
    console.error("Error retrieving PIN:", error);
    throw error;
  }
};

/**
 * Delete PIN
 */
export const deletePin = async () => {
  try {

    await SecureStore.deleteItemAsync("SCURIO_APP_PIN");

    console.log("PIN deleted");

  } catch (error) {
    console.error("Error deleting PIN:", error);
    throw error;
  }
};