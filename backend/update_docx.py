import sys
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

def update_docx(file_path):
    doc = Document(file_path)
    
    # Track state for replacing entire sections if needed
    in_ollama_section = False
    
    for para in doc.paragraphs:
        # Align justify
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        
        text = para.text
        
        # Replace simple keywords
        if "Ollama" in text and "17. Why" not in text:
            para.text = text.replace("Ollama", "Groq API")
            
        if "llama3-8b-8192" in text:
            para.text = text.replace("llama3-8b-8192", "llama-3.1-8b-instant")
            
        # Section 11 updates
        if "local open-source LLM" in para.text:
            para.text = para.text.replace("local open-source LLM", "high-speed open-source LLM via Groq")
            
        if "The local Ollama model" in para.text:
            para.text = para.text.replace("The local Ollama model", "The Groq LLM API")
            
        # Section 13 updates
        if "13. Datasets and Knowledge Sources" in para.text:
            para.text = "13. Datasets and Knowledge Sources"
            # We will insert a paragraph after this later, but let's just modify the next paragraph
            
        if "The current repository includes a compact sample healthcare dataset." in para.text:
            para.text = para.text.replace(
                "The current repository includes a compact sample healthcare dataset.",
                "The current repository includes a sample healthcare dataset along with high-quality, authoritative medical articles directly scraped from MedlinePlus (NIH), covering topics like Asthma, Diabetes, Hypertension, Flu, and Heart Attacks."
            )
            
        # Section 17 updates
        if "17. Why Ollama Was Chosen" in text:
            para.text = "17. Why Groq Was Chosen"
            in_ollama_section = True
            continue
            
        if in_ollama_section:
            if "Current Limitations" in text:
                in_ollama_section = False
            else:
                if "Ollama simplifies local LLM" in text:
                    para.text = "Groq was chosen to power the LLM inference because it offers unparalleled speed using Language Processing Units (LPUs). This allows the application to run state-of-the-art open-source models (like Llama 3.1 70B) instantly without requiring expensive local hardware or GPUs."
                elif "Simple local model serving" in text:
                    para.text = "Blazing fast inference speeds for real-time chat."
                elif "Works well with open-source models" in text:
                    para.text = "Access to the latest open-source models (Llama 3.1, Mixtral, Gemma 2)."
                elif "Integrates easily with LangChain" in text:
                    para.text = "Integrates seamlessly with LangChain via langchain-groq."
                elif "Supports swapping small models" in text:
                    para.text = "No local hardware limitations, enabling access to 70B+ parameter models."
        
        # Section 18 updates
        if "If Ollama is not installed" in text or "If Groq API is not installed" in text:
            para.text = "If the Groq API key is missing or fails, the backend catches the error and gracefully informs the user."
            
        # Section 20 updates
        if "Local Ollama or a self-managed server" in text:
            para.text = para.text.replace("Local Ollama or a self-managed server", "Standard cloud hosting since inference is offloaded to Groq")
            
        if "local open-source LLM" in text:
            para.text = para.text.replace("local open-source LLM", "cloud-hosted open-source LLM")
            
        if "true local-model inference through Ollama" in text:
            para.text = para.text.replace("true local-model inference through Ollama", "high-speed cloud inference via Groq")
            
        # Fix formatting for all runs
        for run in para.runs:
            run.font.name = 'Calibri'
            if run.font.size is None:
                run.font.size = Pt(11)

    doc.save(file_path)
    print("Document successfully updated and aligned.")

if __name__ == "__main__":
    update_docx(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
