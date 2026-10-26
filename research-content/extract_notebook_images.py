import json
import base64
import os

with open("ROSP_Project.ipynb", encoding="utf-8") as f:
    nb = json.load(f)

extracted = 0
for idx, c in enumerate(nb["cells"]):
    outputs = c.get("outputs", [])
    for o_idx, o in enumerate(outputs):
        data = o.get("data", {})
        if "image/png" in data:
            img_b64 = data["image/png"]
            # remove line breaks
            img_bytes = base64.b64decode(img_b64)
            out_name = f"research-content/figures/notebook_cell_{idx}_output_{o_idx}.png"
            with open(out_name, "wb") as img_f:
                img_f.write(img_bytes)
            print(f"Extracted Cell {idx} output {o_idx} -> {out_name} ({len(img_bytes)} bytes)")
            extracted += 1

print(f"Total extracted PNG images: {extracted}")
