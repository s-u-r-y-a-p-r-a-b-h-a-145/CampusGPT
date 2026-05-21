import os

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_community.vectorstores import FAISS

from langchain_community.embeddings import (
    HuggingFaceEmbeddings
)

from langchain_core.documents import Document

# =========================
# CONFIG
# =========================

DB_PATH = "faiss_index"

# =========================
# EMBEDDING MODEL
# =========================

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# =========================
# GLOBAL VECTOR DB
# =========================

vector_db = None

# =========================
# LOAD EXISTING DB
# =========================

def load_vector_store():

    global vector_db

    if os.path.exists(DB_PATH):

        vector_db = FAISS.load_local(
            DB_PATH,
            embedding_model,
            allow_dangerous_deserialization=True
        )

        print("✅ DB Loaded")

# LOAD AUTOMATICALLY

load_vector_store()

# =========================
# CREATE VECTOR STORE
# =========================

def create_vector_store(text):

    global vector_db

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_text(text)

    docs = [

        Document(page_content=chunk)

        for chunk in chunks
    ]

    # CREATE DB

    vector_db = FAISS.from_documents(
        docs,
        embedding_model
    )

    # SAVE DB TO DISK

    vector_db.save_local(DB_PATH)

    print("✅  DB Saved")

# =========================
# SEARCH PDF
# =========================

def search_pdf(query):

    global vector_db

    if vector_db is None:

        return "No PDF uploaded."

    docs = vector_db.similarity_search(
        query,
        k=4
    )

    context = "\n\n".join([

        doc.page_content

        for doc in docs
    ])

    return context