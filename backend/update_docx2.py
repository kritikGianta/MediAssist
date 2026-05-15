import sys
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

def update_genai_focus(file_path):
    doc = Document(file_path)
    
    for para in doc.paragraphs:
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        text = para.text
        
        if "11. RAG Pipeline: How It Works" in text:
            para.text = "11. Generative AI & RAG Pipeline Architecture"
            
        if "The prompt includes the user message, recent history, severity hints" in text:
            para.text = "Advanced Prompt Engineering: The system dynamically constructs a rich context prompt injecting retrieved medical documents, conversational memory (history), and safety guardrails. This ensures the Generative AI model remains context-aware and hallucination-free."
            
        if "The local Groq API model generates a grounded response." in text:
            para.text = "Generative LLM Inference: The Groq API executes state-of-the-art open-source LLMs (like Llama 3.1 8B or 70B) to perform natural language generation (NLG), synthesizing complex medical context into highly conversational, human-like responses."

        if "In summary, this project is not just a chatbot." in text:
            para.text = "In summary, this project is a sophisticated Generative AI application. It demonstrates the powerful synergy of Large Language Models (LLMs), semantic embeddings, and Retrieval-Augmented Generation (RAG) to solve real-world problems in the healthcare domain, proving that advanced GenAI capabilities can be harnessed safely and effectively."

        # Make sure font is consistent
        for run in para.runs:
            run.font.name = 'Calibri'
            if run.font.size is None:
                run.font.size = Pt(11)

    doc.save(file_path)
    print("Document successfully updated with GenAI focus.")

if __name__ == "__main__":
    update_genai_focus(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
