from fastapi import FastAPI
from embeddings import generate_embedding
from vector_store import add_document, search

app = FastAPI()


@app.post("/index")
def index_document(text: str):

    embedding = generate_embedding(text)
    add_document(text, embedding)

    return {"status": "indexed"}


@app.post("/ask")
def ask_ai(query: str):

    embedding = generate_embedding(query)
    results = search(embedding)

    return {
        "query": query,
        "results": results
    }