# CampusGPT
AI smart college students assistant
CampusGPT is an AI-powered academic assistant developed to address the limitations of traditional learning support systems that lack contextual understanding, intelligent document retrieval, and personalized student interaction. Existing chatbots often fail to retain conversational context, provide accurate answers from academic materials, or support semantic understanding of uploaded documents. To solve this, the project implements a modern Retrieval-Augmented Generation (RAG) 

UI References 
ChatGPT Style 
<img width="539" height="383" alt="image" src="https://github.com/user-attachments/assets/fd007548-6cf6-4d6b-ac10-c7febe4461f8" />

Clean
Professional
Easy to build
 

Features:
•	sidebar chats 
•	smooth bubbles 
•	typing effect
ARCHITECTURE: 
<img width="1193" height="707" alt="image" src="https://github.com/user-attachments/assets/8b16cbd0-5a4c-4c66-a3ac-5564c574e607" />

PIPELINE:
PDF
 ↓
Text Extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
FAISS Vector Store
 ↓
Similarity Search
 ↓
Relevant Chunks Retrieved
 ↓
LLM Prompt
 ↓
Answer

# AI College Companion 

AI-powered academic assistant built using React, FastAPI, OpenRouter, LangChain, and FAISS Vector DB.

---

## ✨ Core Features

- 🤖 AI Chatbot
- 📄 PDF Upload & Analysis
- 🔍 Vector DB RAG Pipeline
- 🧠 Conversation Memory
- 💬 Persistent Chat History
- 🧾 Markdown + Code Rendering
- ⚡ Semantic Search
- 🎨 ChatGPT-like UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Markdown

### Backend
- FastAPI
- Python
- Uvicorn
- Pydantic

### AI / ML
- OpenRouter API
- LangChain
- FAISS
- Sentence Transformers
- HuggingFace Embeddings

---

## 🧠 RAG Workflow

PDF Upload
→ Text Extraction
→ Chunking
→ Embeddings
→ FAISS Vector Storage
→ Semantic Retrieval
→ LLM Response

---
BACKEND SETUP:
pip install fastapi uvicorn requests python-dotenv
pip install pypdf python-multipart
pip install langchain-community
pip install langchain-text-splitters
pip install sentence-transformers
pip install faiss-cpu
 RUN BACKEND:
 uvicorn main:app --reload

RUN FRONTEND:
npm install
npm install axios react-markdown react-syntax-highlighter
npm start

ENVIRONMENT VARIABLE
API_KEY=your_openrouter_api_key


## 📁 Project Structure

```text
ai-college-companion/
│
├── frontend/
│   ├── src/
│   ├── public/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── main.py
│   ├── .env
│
├── README.md














👨‍💻 Author

Surya Prabha




