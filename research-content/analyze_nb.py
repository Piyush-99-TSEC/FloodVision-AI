import json

with open('ROSP_Project.ipynb', encoding='utf-8') as f:
    nb = json.load(f)

print(f"Total cells: {len(nb['cells'])}")

for i, cell in enumerate(nb['cells']):
    src = ''.join(cell.get('source', []))
    lines = [l.strip() for l in src.split('\n') if l.strip() and not l.strip().startswith('#')]
    first_line = lines[0][:80] if lines else ''
    
    triggers = ['class unet', 'class ', 'def ', 'git clone', 'drive.mount', 'train', 'optimizer', 'loss', 'xbd', 'sen1floods11', 'torch.save', 'torch.load', 'checkpoint', 'fusion', 'iou', 'metrics', 'sen1']
    matched = [t for t in triggers if t in src.lower()]
    if matched or cell.get('cell_type') == 'markdown':
        print(f"Cell {i:03d} [{cell.get('cell_type')}]: {matched} -> {first_line}")
