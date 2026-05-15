import sys
from docx import Document

def read_first_page(file_path):
    doc = Document(file_path)
    print("--- FIRST 20 PARAGRAPHS ---")
    for i, para in enumerate(doc.paragraphs[:20]):
        if para.text.strip():
            print(f"{i}: [{para.style.name}] {para.text}")

if __name__ == "__main__":
    read_first_page(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
