from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path
from typing import List

from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from ..config import DATA_DIR
from ..models import ChatSettings


def _load_csv_documents(csv_path: Path) -> List[Document]:
    docs: List[Document] = []
    with csv_path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            content = row["content"].strip()
            metadata = {
                "title": row["title"].strip(),
                "source": row["source"].strip(),
                "category": row["category"].strip(),
            }
            docs.append(Document(page_content=content, metadata=metadata))
    return docs


def load_documents() -> List[Document]:
    documents = _load_csv_documents(DATA_DIR / "healthcare_knowledge.csv")
    for extra_file in DATA_DIR.glob("*.txt"):
        documents.append(
            Document(
                page_content=extra_file.read_text(encoding="utf-8"),
                metadata={"title": extra_file.stem, "source": extra_file.name},
            )
        )
    return documents


@lru_cache(maxsize=4)
def build_vector_store(chunk_size: int, chunk_overlap: int, embedding_model: str) -> FAISS:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    documents = splitter.split_documents(load_documents())
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
    return FAISS.from_documents(documents, embeddings)


def retrieve_context(query: str, settings: ChatSettings) -> List[Document]:
    store = build_vector_store(
        settings.chunk_size,
        settings.chunk_overlap,
        settings.embedding_model,
    )
    return store.similarity_search(query, k=settings.top_k)
