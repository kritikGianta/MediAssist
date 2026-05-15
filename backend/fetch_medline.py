import sys
from pathlib import Path
import requests
from bs4 import BeautifulSoup

def fetch_medline_topic(url: str):
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # MedlinePlus main content usually lives in <div id="m-c"> or <article>
        main_content = soup.find(id="m-c") or soup.find("article") or soup.find("body")
        
        if not main_content:
            print("Could not find main content area.")
            return

        # Extract text, removing excessive newlines
        text = main_content.get_text(separator="\n")
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        clean_text = "\n\n".join(lines)
        
        # Determine filename
        topic_name = url.strip("/").split("/")[-1].replace(".html", "")
        file_path = Path(__file__).parent / "app" / "data" / f"medlineplus_{topic_name}.txt"
        
        file_path.write_text(clean_text, encoding="utf-8")
        print(f"Successfully saved {len(clean_text)} characters to {file_path}")
        print("Note: You need to restart the backend for the RAG engine to load this new file.")
        
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_medline.py <medlineplus_url>")
        print("Example: python fetch_medline.py https://medlineplus.gov/commoncold.html")
    else:
        fetch_medline_topic(sys.argv[1])
