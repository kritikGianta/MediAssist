# MediAssist AI 🏥🤖

MediAssist AI is a highly advanced, local-first healthcare guidance chatbot powered by **Generative AI** and **Retrieval-Augmented Generation (RAG)**. It acts as an intelligent assistant to help users understand symptoms, review health reports, find safe over-the-counter (OTC) guidance, and locate nearby medical facilities.

---

## 🌟 What is Used (Tech Stack)

### 🖥️ Frontend
*   **React + Vite**: For a blazing fast, modern user interface.
*   **TailwindCSS**: For rapid, responsive, and beautiful styling using utility classes.
*   **Framer Motion**: For smooth, premium UI animations and transitions.
*   **Browser Web Speech API**: Enables voice-to-text input and text-to-speech output.

### ⚙️ Backend
*   **Python + FastAPI**: A high-performance web framework for building the API endpoints.
*   **LangChain**: Orchestrates the interaction between the LLM and the retrieval database.
*   **FAISS (Facebook AI Similarity Search)**: An extremely fast in-memory vector database used to store and search medical documents.
*   **Sentence-Transformers**: Uses the `all-MiniLM-L6-v2` model to convert text chunks into dense mathematical vectors (embeddings).
*   **Groq API**: Provides ultra-fast LLM inference using Language Processing Units (LPUs). We utilize open-source models like `Llama-3.1-8b-instant` and `Llama-3.1-70b-versatile`.
*   **Overpass API (OpenStreetMap)**: Used to query real-world geographic data for the "Nearby Hospitals" feature.

---

## 🧠 How It Works (The Architecture)

MediAssist AI does not rely on the LLM's raw memory to give medical advice (which can cause dangerous hallucinations). Instead, it uses **Retrieval-Augmented Generation (RAG)**.

### 1. Data Ingestion Phase
1. Authoritative medical articles from **MedlinePlus (NIH)** and local CSV knowledge bases are loaded.
2. The text is split into small "chunks" (e.g., 500 characters).
3. These chunks are converted into embeddings (vectors) using a local HuggingFace model.
4. The vectors are indexed in the **FAISS** database.

### 2. Conversation & Retrieval Phase
1. **User Input:** The user types a symptom (e.g., "I have a severe headache and fever").
2. **Safety Check:** The backend scans the message for emergency keywords (like "chest pain"). If detected, an emergency flag is raised.
3. **Semantic Search:** The user's query is converted into a vector. FAISS searches the database and retrieves the Top-K most mathematically similar medical chunks (e.g., articles on Flu or Migraines).

### 3. Generative Phase
1. **Prompt Engineering:** The backend builds a master prompt containing:
   * The strict System Prompt (medical disclaimers, no prescribing rules).
   * The retrieved MedlinePlus facts.
   * The conversation history.
   * The user's specific question.
2. **LLM Inference:** The Groq API processes this prompt using an open-source model (like Llama 3.1).
3. **Output:** The LLM generates a structured, conversational response grounded *only* in the provided medical facts, which is then sent back to the React frontend.

---

## 🔌 API Structure

The FastAPI backend exposes several key endpoints:

*   `POST /chat`: The core endpoint. Accepts a JSON payload containing the user's `message`, `history`, and `settings` (temperature, chunk size, top-k). Returns the generated response, severity level, detected conditions, and medical citations.
*   `POST /upload`: Handles PDF health report uploads. Extracts the text using `PyMuPDF` and uses the LLM to generate a plain-English summary of the report.
*   `POST /nearby-doctors`: Accepts the user's `latitude` and `longitude`. Queries the Overpass API to find hospitals, clinics, and pharmacies within a 5km radius, calculating exact distances using the Haversine formula.
*   `GET /history` & `GET /settings`: Simple persistence endpoints that read/write local JSON files to save the user's session state and UI preferences across reloads.

---

## 📂 Project Structure

```text
📦 medical chatbot
 ┣ 📂 backend
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 data           # MedlinePlus TXT files & CSV Knowledge Base
 ┃ ┃ ┣ 📂 services       # Chat, RAG, Location, and Upload services
 ┃ ┃ ┣ 📜 config.py      # App configurations
 ┃ ┃ ┣ 📜 main.py        # FastAPI server entry point
 ┃ ┃ ┗ 📜 models.py      # Pydantic data models
 ┃ ┣ 📜 .env.example     # Environment variable template
 ┃ ┗ 📜 fetch_medline.py # Script to scrape new MedlinePlus articles
 ┣ 📂 frontend
 ┃ ┣ 📂 src              # React components, Vite configuration
 ┃ ┗ 📜 package.json     # Node dependencies
 ┗ 📜 README.md          # You are here!
```

---

## ⚙️ How to Run Locally

### 1. Backend Setup (FastAPI)
1. Navigate to the `backend` directory.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables:
   * Copy `backend/.env.example` to `backend/.env`.
   * Open `.env` and add your **Groq API Key**: `GROQ_API_KEY=your_key_here`.
5. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend Setup (React/Vite)
1. Open a new terminal and navigate to the `frontend` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173/`.

---

## 🏥 Medical Disclaimer
This application is designed for educational and informational purposes only. It is **not** a licensed medical professional. Always consult a doctor for accurate diagnoses or emergencies.
