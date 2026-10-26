import pypdf, os, sys

papers_dir = r"C:\Users\Omkar Raut\OneDrive\Desktop\ROSP\Papers"
files = ['1st-paper.pdf', '2nd-paper.pdf', '3rd-paper.pdf', '4th-paper.pdf', '5th-paper.pdf']

with open("research-content/papers_deep_analysis.txt", "w", encoding="utf-8") as out:
    for idx, f in enumerate(files, 1):
        path = os.path.join(papers_dir, f)
        reader = pypdf.PdfReader(path)
        out.write(f"\n{'='*70}\nPAPER [{idx}]: {f} (Total Pages: {len(reader.pages)})\n{'='*70}\n")
        
        # Read first 2 pages
        for p_num in range(min(2, len(reader.pages))):
            text = reader.pages[p_num].extract_text() or ''
            out.write(f"--- PAGE {p_num+1} ---\n{text[:1500]}\n")
            
        # Read conclusion / discussion
        if len(reader.pages) > 2:
            last_text = reader.pages[-1].extract_text() or ''
            penultimate_text = reader.pages[-2].extract_text() or ''
            out.write(f"--- PENULTIMATE / LAST PAGE EXCERPT ---\n{(penultimate_text + '\n' + last_text)[-2000:]}\n")

print("Papers deep analysis written successfully.")
