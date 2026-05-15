import sys
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def align_title_page(file_path):
    doc = Document(file_path)
    
    for para in doc.paragraphs:
        if para.style.name.startswith('Heading'):
            break
            
        # Center align the title page paragraphs
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        para.paragraph_format.space_before = Pt(12)
        para.paragraph_format.space_after = Pt(12)
        
        for run in para.runs:
            if "MediAssist AI" in run.text:
                run.font.bold = True
                run.font.size = Pt(28)
            elif "Intelligent Healthcare Guidance Chatbot" in run.text:
                run.font.bold = True
                run.font.size = Pt(18)
            elif "Comprehensive Project Documentation Report" in run.text:
                run.font.italic = True
                run.font.size = Pt(14)
            elif "Medical Disclaimer" in run.text:
                run.font.italic = True
                
    # Add page break before the first heading to ensure title is on its own page
    # Actually, we can just insert a page break at the end of the title section if it's not there.
    # But for now, just centering and sizing is enough as the user asked for alignment.
                
    doc.save(file_path)
    print("Title page aligned successfully.")

if __name__ == "__main__":
    align_title_page(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
