# MediAssist AI 🏥🤖

MediAssist AI is a highly advanced, local-first healthcare guidance chatbot powered by **Generative AI** and **Retrieval-Augmented Generation (RAG)**. It acts as an intelligent assistant to help users understand symptoms, review health reports, find safe over-the-counter (OTC) guidance, and locate nearby medical facilities.

---

## 📸 Screenshots

| Landing Page | Chat Workspace |
|:---:|:---:|
| <img src="imgaes/Screenshot%202026-05-15%20131734.png" width="400"> | <img src="imgaes/Screenshot%202026-05-15%20131951.png" width="400"> |

| Advanced Settings & RAG Tuning | Nearby Hospital Search |
|:---:|:---:|
| <img src="imgaes/Screenshot%202026-05-15%20132003.png" width="400"> | <img src="imgaes/Screenshot%202026-05-15%20132058.png" width="400"> |

*(Note: The above images showcase the React-based frontend UI.)*

---

## 🌟 Key Features

1. **RAG-Powered Medical Knowledge**: Integrates real, authoritative data scraped from **MedlinePlus (NIH)**, including conditions like Asthma, Hypertension, Diabetes, and Flu.
2. **Generative LLM Engine**: Powered by the blazing fast **Groq API** using state-of-the-art open-source models like `Llama 3.1 70B` and `Mixtral`.
3. **Advanced Prompt Engineering**: The chatbot dynamically analyzes chat history, specific medical context, and strict safety guardrails before answering.
4. **Geolocation-based Care Finder**: Integrates with the **OpenStreetMap (Overpass API)** to instantly find nearby hospitals and clinics based on browser coordinates.
5. **Experimentation Panel**: Users can directly manipulate AI parameters such as `Temperature`, `Top-K` retrieval count, and `Chunk Size`.

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
 ┣ 📂 docs               # Project reports and documentation
 ┣ 📂 imgaes             # UI screenshots
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
