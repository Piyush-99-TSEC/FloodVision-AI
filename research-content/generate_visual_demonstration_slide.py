import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
from PIL import Image
import os
import shutil

# Set Times New Roman globally
plt.rcParams['font.family'] = 'Times New Roman'

# Create 16:9 Presentation Slide Figure (19.2 x 10.8 inches, 300 DPI)
fig = plt.figure(figsize=(19.2, 10.8), dpi=300)
ax = fig.add_subplot(111)
ax.set_xlim(0, 19.2)
ax.set_ylim(0, 10.8)
ax.axis('off')

# Background
fig.patch.set_facecolor('#F8FAFC')
ax.set_facecolor('#F8FAFC')

# ==========================================
# 1. TOP HEADER & NAVIGATION
# ==========================================
# Main Title
ax.text(0.65, 9.78, "Visual Demonstration",
        fontsize=35, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (06)
num_box = FancyBboxPatch((17.65, 9.58), 0.90, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(18.10, 9.855, "06", ha='center', va='center',
        fontsize=15.5, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.65, 18.55], [9.32, 9.32], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Context Statement
ax.text(0.65, 8.92,
        "End-to-End Multi-Modal AI Pipeline Execution on Validation Scene: Hurricane Florence (Tile ID: 00000050)",
        fontsize=13.5, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. LOAD & CROP PURE 1:1 SQUARE PIPELINE TILES
# ==========================================
img_fval = Image.open(r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\fusion_validation\figures\hurricane-florence_00000050_fusion_validation.png")
img_frisk = Image.open(r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\fusion_test\fusion_risk_visualization.png")
img_gcam = Image.open(r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures\notebook_cell_132_output_0.png")

# 1. SAR VV Radar Input (exact 1220x1220 square)
p1_sar = img_fval.crop((30, 278, 1250, 1498)).convert('RGB')

# 2. Flood U-Net Inundation Mask (exact 1115x1115 square, clean of titles & colorbar)
p2_flood = img_fval.crop((1555, 331, 2670, 1446)).convert('RGB')

# 3. Optical RGB + Building Localization Footprints (exact 1454x1454 square)
p3_opt = img_frisk.crop((30, 326, 1484, 1780)).convert('RGB')

# 4. Building Damage Severity Classification (exact 1329x1328 square, clean of titles & colorbar)
p4_dmg = img_frisk.crop((3697, 389, 5026, 1717)).convert('RGB')

# 5. Grad-CAM Saliency Heatmap (exact 496x495 square, clean of titles & colorbar)
p5_gcam = img_gcam.crop((10, 75, 506, 570)).convert('RGB')

# 6. Multi-Modal Fused Risk Priority Map (exact 1329x1328 square, clean of titles & colorbar)
p6_risk = img_frisk.crop((5531, 389, 6860, 1717)).convert('RGB')

demo_stages = [
    {
        "num": "1",
        "title": "Stage 1 • SAR Radar Ingestion",
        "badge": "SENTINEL-1 C-BAND",
        "badge_color": "#334155", "badge_bg": "#E2E8F0",
        "color": "#475569", "border": "#64748B",
        "img": p1_sar,
        "annot_label": "AI Annotation: ",
        "annot_body": "Radiometrically calibrated C-band SAR backscatter (mean: -9.66 dB).",
        "mean_label": "Field Meaning: ",
        "mean_body": "All-weather sensing penetrates rain & storm clouds where optical sensors fail."
    },
    {
        "num": "2",
        "title": "Stage 2 • Flood Inundation Mask",
        "badge": "FLOOD U-NET (SAR)",
        "badge_color": "#1D4ED8", "badge_bg": "#DBEAFE",
        "color": "#2563EB", "border": "#3B82F6",
        "img": p2_flood,
        "annot_label": "AI Annotation: ",
        "annot_body": "Segmented 407 flooded pixels (2.48% tile area) from specular radar reflection.",
        "mean_label": "Field Meaning: ",
        "mean_body": "Maps exact open floodwater boundaries and active water intrusion corridors."
    },
    {
        "num": "3",
        "title": "Stage 3 • Building Localization",
        "badge": "xBD U-NET (OPTICAL)",
        "badge_color": "#047857", "badge_bg": "#D1FAE5",
        "color": "#059669", "border": "#10B981",
        "img": p3_opt,
        "annot_label": "AI Annotation: ",
        "annot_body": "Segmented 7 residential structures with polygonal footprint boundaries.",
        "mean_label": "Field Meaning: ",
        "mean_body": "Isolates inhabited structures to establish baseline targets for tactical rescue."
    },
    {
        "num": "4",
        "title": "Stage 4 • Damage Classification",
        "badge": "xBD DAMAGE CLASSIFIER",
        "badge_color": "#B45309", "badge_bg": "#FEF3C7",
        "color": "#D97706", "border": "#F59E0B",
        "img": p4_dmg,
        "annot_label": "AI Annotation: ",
        "annot_body": "Classified structural state: 1 Intact (green), 3 Minor (orange), 3 Destroyed (red).",
        "mean_label": "Field Meaning: ",
        "mean_body": "Identifies roof/wall collapse independent of surrounding standing flood depth."
    },
    {
        "num": "5",
        "title": "Stage 5 • Explainable AI (XAI)",
        "badge": "TORCH-CAM (GRAD-CAM)",
        "badge_color": "#6D28D9", "badge_bg": "#EDE9FE",
        "color": "#7C3AED", "border": "#8B5CF6",
        "img": p5_gcam,
        "annot_label": "AI Annotation: ",
        "annot_body": "Visualizes convolutional activations focusing on debris piles & fractured edges.",
        "mean_label": "Field Meaning: ",
        "mean_body": "Provides explainable audits for commanders before deploying tactical squads."
    },
    {
        "num": "6",
        "title": "Stage 6 • Multi-Modal Risk Fusion",
        "badge": "FUSION CORE (Ri = 0.5Ei+0.5Si)",
        "badge_color": "#991B1B", "badge_bg": "#FEE2E2",
        "color": "#DC2626", "border": "#EF4444",
        "img": p6_risk,
        "annot_label": "AI Annotation: ",
        "annot_body": "Fused flood exposure (Ei) + damage severity (Si) into score Ri (Peak: 0.589).",
        "mean_label": "Field Meaning: ",
        "mean_body": "Generates priority triage dispatch: 3 High Risk (Ri > 0.50), 2 Moderate, 2 Low."
    }
]

# ==========================================
# 3. 2x3 GRID COORDINATES & RENDERING
# ==========================================
CARD_W = 5.70
CARD_H = 3.82
ROW_GAP = 0.36
COL_GAP = 0.40

START_X = 0.65
START_Y = 8.60

IMG_SIZE = 2.15

for idx, stage in enumerate(demo_stages):
    row = idx // 3
    col = idx % 3
    
    cx = START_X + col * (CARD_W + COL_GAP)
    cy = START_Y - row * (CARD_H + ROW_GAP)
    
    # Outer Card Shadow
    shadow = FancyBboxPatch((cx + 0.05, cy - CARD_H - 0.05), CARD_W, CARD_H,
                            boxstyle="round,pad=0.02,rounding_size=0.14",
                            facecolor='#94A3B8', edgecolor='none', alpha=0.16, zorder=2)
    ax.add_patch(shadow)
    
    # Outer Card
    card = FancyBboxPatch((cx, cy - CARD_H), CARD_W, CARD_H,
                          boxstyle="round,pad=0.02,rounding_size=0.14",
                          facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.4, zorder=3)
    ax.add_patch(card)
    
    # Top Accent Indicator Bar
    top_bar = FancyBboxPatch((cx, cy - 0.08), CARD_W, 0.08,
                             boxstyle="round,pad=0.0,rounding_size=0.04",
                             facecolor=stage['color'], edgecolor='none', zorder=4)
    ax.add_patch(top_bar)
    
    # Number Circle
    circ_cx = cx + 0.30
    circ_cy = cy - 0.32
    c_num = Circle((circ_cx, circ_cy), 0.15, facecolor=stage['color'], edgecolor='none', zorder=5)
    ax.add_patch(c_num)
    ax.text(circ_cx, circ_cy, stage['num'], ha='center', va='center',
            fontsize=10.0, fontweight='bold', color='#FFFFFF', zorder=6)
    
    # Stage Title
    ax.text(cx + 0.53, cy - 0.32, stage['title'],
            ha='left', va='center', fontsize=9.8, fontweight='bold', color='#0F172A', zorder=5)
    
    # Badge Pill on the right
    bw = 2.05 if idx == 5 or idx == 3 else 1.82
    bh = 0.25
    bx = cx + CARD_W - bw - 0.16
    by = cy - 0.195 - bh
    bp = FancyBboxPatch((bx, by), bw, bh,
                        boxstyle="round,pad=0.02,rounding_size=0.08",
                        facecolor=stage['badge_bg'], edgecolor=stage['border'], lw=1.0, zorder=5)
    ax.add_patch(bp)
    ax.text(bx + bw/2.0, by + bh/2.0, stage['badge'],
            ha='center', va='center', fontsize=6.8 if bw > 1.9 else 7.2,
            fontweight='bold', color=stage['badge_color'], zorder=6)
    
    # Image Display (Centered horizontally)
    img_x = cx + (CARD_W - IMG_SIZE) / 2.0
    img_y = cy - 0.54 - IMG_SIZE
    
    # Image Border Frame
    frame = FancyBboxPatch((img_x - 0.03, img_y - 0.03), IMG_SIZE + 0.06, IMG_SIZE + 0.06,
                           boxstyle="square,pad=0.0",
                           facecolor='#F1F5F9', edgecolor='#CBD5E1', lw=1.2, zorder=4)
    ax.add_patch(frame)
    
    # Plot image
    ax.imshow(np.array(stage['img']), extent=[img_x, img_x + IMG_SIZE, img_y, img_y + IMG_SIZE],
              aspect='auto', zorder=5)
    
    # Description Container Box (Below Image)
    desc_w = CARD_W - 0.32
    desc_h = 0.86
    desc_x = cx + 0.16
    desc_y = cy - CARD_H + 0.13
    
    desc_box = FancyBboxPatch((desc_x, desc_y), desc_w, desc_h,
                             boxstyle="round,pad=0.02,rounding_size=0.06",
                             facecolor='#F8FAFC', edgecolor='#E2E8F0', lw=1.0, zorder=4)
    ax.add_patch(desc_box)
    
    # Left accent indicator bar inside description box
    desc_acc = FancyBboxPatch((desc_x, desc_y), 0.06, desc_h,
                              boxstyle="square,pad=0.0",
                              facecolor=stage['color'], edgecolor='none', zorder=5)
    ax.add_patch(desc_acc)
    
    # Text Rendering inside Description Box (2 Clean Lines)
    text_x = desc_x + 0.14
    line1_y = desc_y + desc_h - 0.25
    line2_y = desc_y + 0.25
    body_offset = 0.96
    
    # Line 1: AI Annotation
    ax.text(text_x, line1_y, stage['annot_label'],
            ha='left', va='center', fontsize=7.6, fontweight='bold', color=stage['color'], zorder=6)
    ax.text(text_x + body_offset, line1_y, stage['annot_body'],
            ha='left', va='center', fontsize=7.4, fontweight='normal', color='#1E293B', zorder=6)
    
    # Line 2: Field Meaning
    ax.text(text_x, line2_y, stage['mean_label'],
            ha='left', va='center', fontsize=7.5, fontweight='bold', color='#0F172A', zorder=6)
    ax.text(text_x + body_offset, line2_y, stage['mean_body'],
            ha='left', va='center', fontsize=7.3, fontweight='normal', color='#475569', zorder=6)

# ==========================================
# 4. SAVE OUTPUTS (PNG & PDF)
# ==========================================
out_dir = r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures"
os.makedirs(out_dir, exist_ok=True)
png_path = os.path.join(out_dir, "visual_demonstration_slide.png")
pdf_path = os.path.join(out_dir, "visual_demonstration_slide.pdf")

plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.savefig(pdf_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.close()

# Also copy to artifacts directory for direct user preview
artifact_dir = r"C:\Users\Omkar Raut\.gemini\antigravity-ide\brain\1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8"
artifact_png = os.path.join(artifact_dir, "visual_demonstration_slide.png")
shutil.copy2(png_path, artifact_png)

print("Generated Visual Demonstration Slide (Slide 06) successfully:")
print(f"  PNG: {png_path}")
print(f"  PDF: {pdf_path}")
print(f"  Artifact: {artifact_png}")
