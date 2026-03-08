/**
 * Detect user intent from query
 */
export const detectIntent = (query) => {

  try {

    const text = query.toLowerCase();

    if (text.includes("find") || text.includes("show") || text.includes("get")) {
      return "search";
    }

    if (text.includes("delete")) {
      return "delete";
    }

    if (text.includes("add") || text.includes("store")) {
      return "create";
    }

    return "search";

  } catch (error) {

    console.error("Intent detection error:", error);
    throw error;

  }

};