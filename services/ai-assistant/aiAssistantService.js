import { detectIntent } from "./intentService.js";
import { globalSearch } from "../search/searchService.js";

/**
 * Main AI assistant function
 */
export const askAssistant = async (query) => {

  try {

    if (!query) {
      throw new Error("Query is required");
    }

    const intent = detectIntent(query);

    if (intent === "search") {

      const results = await globalSearch(query);

      return {
        intent,
        results
      };

    }

    return {
      intent,
      message: "Intent not supported yet"
    };

  } catch (error) {

    console.error("AI assistant error:", error);
    throw error;

  }

};