import faiss
import numpy as np

dimension = 384
index = faiss.IndexFlatL2(dimension)

documents = []

def add_document(text, embedding):

    index.add(np.array([embedding]).astype("float32"))
    documents.append(text)


def search(query_embedding, k=3):

    D, I = index.search(np.array([query_embedding]).astype("float32"), k)

    results = []
    seen = set()

    for idx in I[0]:
        if idx < len(documents):
            doc = documents[idx]

            if doc not in seen:
                results.append(doc)
                seen.add(doc)

    return results