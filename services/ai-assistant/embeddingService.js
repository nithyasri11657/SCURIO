/**
 * Simple embedding generator
 * (placeholder for MiniLM model later)
 */
export const generateEmbedding = (text) => {

  try {

    if (!text) {
      throw new Error("Text required for embedding");
    }

    const embedding = text
      .toLowerCase()
      .split(" ")
      .map(word => word.length);

    return embedding;

  } catch (error) {

    console.error("Embedding error:", error);
    throw error;

  }

};