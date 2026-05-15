import sys
from docx import Document

def read_docx(file_path):
    doc = Document(file_path)
    for para in doc.paragraphs:
        if para.text.strip():
            print(para.style.name, "||", para.text)

if __name__ == "__main__":
    read_docx(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
