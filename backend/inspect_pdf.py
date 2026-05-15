from pypdf import PdfReader

def inspect_pdf(file_path):
    reader = PdfReader(file_path)
    print(f"Total pages: {len(reader.pages)}")
    # Read page 2 (index 1) since user said "except for first page"
    if len(reader.pages) > 1:
        page = reader.pages[1]
        text = page.extract_text()
        print("--- PAGE 2 TEXT ---")
        print(text[:1000]) # Print first 1000 chars

if __name__ == "__main__":
    inspect_pdf(r"C:\Users\kriti\Downloads\projects_final\medical chatbot\docs\ManasK1_merged.pdf")
