from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from pydantic import BaseModel

from services.llm_service import ask_llm

from services.rag_service import (
    create_vector_store,
    search_pdf
)

from pypdf import PdfReader

router = APIRouter(
    prefix="/api",
    tags=["AI Chat"]
)

# REQUEST MODEL


class Prompt(BaseModel):

    message: str

    history: list = []


# CHAT ENDPOINT


@router.post("/chat")
def chat(prompt: Prompt):

    # VECTOR SEARCH CONTEXT

    context = search_pdf(prompt.message)

    # CONVERSATION MEMORY

    conversation_history = ""

    try:

        for msg in prompt.history[-6:]:

            role = msg["role"]

            text = msg["text"]

            conversation_history += f"""
            {role.upper()}:
            {text}
            """

    except:
        pass

    # FINAL PROMPT

    final_prompt = f"""
    You are AI College Companion.

    Answer clearly and professionally.

    Use markdown formatting:
    - headings
    - bullet points
    - code blocks

    If PDF context exists,
    prioritize PDF knowledge.

    =========================
    PDF CONTEXT
    =========================

    {context}

    =========================
    CONVERSATION HISTORY
    =========================

    {conversation_history}

    =========================
    CURRENT QUESTION
    =========================

    {prompt.message}
    """

    result = ask_llm(final_prompt)

    return {
        "response": result
    }


# PDF UPLOAD ENDPOINT


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        pdf = PdfReader(file.file)

        text = ""

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # CREATE VECTOR DATABASE

        create_vector_store(text)

        return {
            "response":
            "PDF uploaded successfully. You can now ask questions about the PDF."
        }

    except Exception as e:

        return {
            "response":
            f"PDF Processing Error: {str(e)}"
        }