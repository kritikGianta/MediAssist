import sys
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def apply_formatting(file_path):
    doc = Document(file_path)
    
    # Define styles based on standard academic/executive report formats
    for para in doc.paragraphs:
        # Set alignment to Justify
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        
        # Set paragraph spacing
        para.paragraph_format.space_after = Pt(12)
        para.paragraph_format.line_spacing = 1.5
        
        # Check if paragraph is a heading
        is_heading = para.style.name.startswith('Heading')
        
        for run in para.runs:
            run.font.name = 'Times New Roman'
            if is_heading:
                # Heading format
                run.font.bold = True
                if para.style.name == 'Heading 1':
                    run.font.size = Pt(16)
                    run.font.color.rgb = None # default black
                elif para.style.name == 'Heading 2':
                    run.font.size = Pt(14)
            else:
                # Body text format
                if run.font.size is None or run.font.size != Pt(12):
                    run.font.size = Pt(12)
    
    # Update lists indentation to look clean
    for para in doc.paragraphs:
        if para.style.name in ['List Bullet', 'List Number']:
            para.paragraph_format.left_indent = Inches(0.5)
            para.paragraph_format.space_after = Pt(6)
            para.paragraph_format.line_spacing = 1.15
            
    doc.save(file_path)
    print("Document formatting applied successfully.")

if __name__ == "__main__":
    apply_formatting(r"c:\Users\kriti\Downloads\projects_final\medical chatbot\docs\MediAssist_AI_Project_Report.docx")
