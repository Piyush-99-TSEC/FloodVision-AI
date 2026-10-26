import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os
import shutil

# Set Times New Roman font globally
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
ax.text(0.9, 9.80, "Literature Survey",
        fontsize=32, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (03)
num_box = FancyBboxPatch((17.4, 9.58), 0.9, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(17.85, 9.85, "03", ha='center', va='center',
        fontsize=14, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.9, 18.3], [9.32, 9.32], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Context Statement
ax.text(0.9, 8.98,
        "Systematic review of foundational disaster datasets, remote sensing models, and operational triage frameworks from literature.",
        fontsize=12.2, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. THREE-COLUMN TABLE DEFINITION
# ==========================================
TABLE_X = 0.9
TABLE_W = 17.4
HEADER_Y = 8.65
HEADER_H = 0.46

# Column Widths:
# Col 1: Paper Name with Citation (Width = 4.10)
# Col 2: Key Findings (Width = 6.65)
# Col 3: Limitations (Width = 6.65)
COL1_W = 4.10
COL2_W = 6.65
COL3_W = 6.65

X_COL1 = TABLE_X
X_COL2 = TABLE_X + COL1_W
X_COL3 = X_COL2 + COL2_W

# Draw 3 Styled Column Headers (Col 1 Light Slate, Col 2 Light Green, Col 3 Light Red)
h_pad = 0.04

# Col 1 Header: Paper & Citation (Light Slate)
h1_patch = FancyBboxPatch((X_COL1, HEADER_Y - HEADER_H), COL1_W - h_pad, HEADER_H,
                          boxstyle="round,pad=0.01,rounding_size=0.10",
                          facecolor='#E2E8F0', edgecolor='#CBD5E1', lw=1.4, zorder=4)
ax.add_patch(h1_patch)

# Col 2 Header: Key Findings & Contributions (Light Green)
h2_patch = FancyBboxPatch((X_COL2 + h_pad/2, HEADER_Y - HEADER_H), COL2_W - h_pad, HEADER_H,
                          boxstyle="round,pad=0.01,rounding_size=0.10",
                          facecolor='#DCFCE7', edgecolor='#86EFAC', lw=1.4, zorder=4)
ax.add_patch(h2_patch)

# Col 3 Header: Limitations & Unmet Challenges (Light Red)
h3_patch = FancyBboxPatch((X_COL3 + h_pad/2, HEADER_Y - HEADER_H), COL3_W - h_pad/2, HEADER_H,
                          boxstyle="round,pad=0.01,rounding_size=0.10",
                          facecolor='#FEE2E2', edgecolor='#FCA5A5', lw=1.4, zorder=4)
ax.add_patch(h3_patch)

# Header Column Labels (High-Contrast Academic Text in Times New Roman)
ax.text(X_COL1 + 0.28, HEADER_Y - HEADER_H/2, "PAPER & CITATION IN SEQUENCE",
        ha='left', va='center', fontsize=11, fontweight='bold', color='#0F172A', zorder=5)

ax.text(X_COL2 + 0.28, HEADER_Y - HEADER_H/2, "KEY FINDINGS & CONTRIBUTIONS",
        ha='left', va='center', fontsize=11, fontweight='bold', color='#065F46', zorder=5)

ax.text(X_COL3 + 0.28, HEADER_Y - HEADER_H/2, "LIMITATIONS & UNMET CHALLENGES",
        ha='left', va='center', fontsize=11, fontweight='bold', color='#991B1B', zorder=5)

# ==========================================
# 3. FIVE LITERATURE SURVEY ROWS (MAX 2-LINERS)
# ==========================================
ROW_H = 1.15
Y_START = HEADER_Y - HEADER_H

papers_data = [
    {
        "cite_num": "[1]",
        "pill_color": "#2563EB",
        "author": "Bonafilia et al. (2020)",
        "subtitle": "Sen1Floods11 • IEEE CVPRW 2020",
        "finding_l1": "Global SAR dataset (4,831 chips, 11 flood events);",
        "finding_l2": "benchmarks all-weather U-Net flood segmentation.",
        "limit_l1": "2D water extents only; lacks building damage labels",
        "limit_l2": "and operational rescue task dispatch mechanism."
    },
    {
        "cite_num": "[2]",
        "pill_color": "#0D9488",
        "author": "Gupta et al. (2019)",
        "subtitle": "Creating xBD • IEEE CVPRW 2019",
        "finding_l1": "Standardizes 850k+ buildings across 19 disasters;",
        "finding_l2": "defines joint localization and 4-tier damage scale.",
        "limit_l1": "Optical imagery obscured by storm clouds and rain;",
        "limit_l2": "omits flood inundation and emergency squad triage."
    },
    {
        "cite_num": "[3]",
        "pill_color": "#D97706",
        "author": "Rahnemoonfar et al. (2021)",
        "subtitle": "FloodNet • IEEE Access / CVPRW",
        "finding_l1": "Sub-meter post-hurricane UAV aerial imagery;",
        "finding_l2": "combines semantic segmentation with scene VQA.",
        "limit_l1": "UAV flights limited by storm winds and battery life;",
        "limit_l2": "lacks macro regional satellite view and Grad-CAM."
    },
    {
        "cite_num": "[4]",
        "pill_color": "#7C3AED",
        "author": "Selvakumaran et al. (2025)",
        "subtitle": "Operational USAR • Elsevier PDISAS 2025",
        "finding_l1": "Bridges satellite data with field USAR operations;",
        "finding_l2": "uses graph belief-propagation for damage triage.",
        "limit_l1": "Lacks dynamic flood change and SAR radar modeling;",
        "limit_l2": "no visual explainability (XAI) or automated routing."
    },
    {
        "cite_num": "[5]",
        "pill_color": "#DB2777",
        "author": "Shakya et al. (2025)",
        "subtitle": "Pixels to Semantics • Applied AI 2025",
        "finding_l1": "Combines VRT super-resolution (4x) with YOLOv11",
        "finding_l2": "and Vision-Language Models (VLM) for damage rating.",
        "limit_l1": "Heavy VLM compute latency hinders field deployment;",
        "limit_l2": "omits all-weather SAR radar and GIS task allocation."
    }
]

for idx, p in enumerate(papers_data):
    row_top = Y_START - idx * ROW_H
    row_bot = row_top - ROW_H
    y_mid = row_top - ROW_H / 2.0
    
    # Alternating row background
    bg_color = "#FFFFFF" if idx % 2 == 0 else "#F8FAFC"
    row_bg = FancyBboxPatch((TABLE_X, row_bot), TABLE_W, ROW_H,
                            boxstyle="square,pad=0.0",
                            facecolor=bg_color, edgecolor='#E2E8F0', lw=1.0, zorder=2)
    ax.add_patch(row_bg)
    
    # Accent indicator bar on the left
    acc_bar = FancyBboxPatch((TABLE_X, row_bot), 0.08, ROW_H,
                             boxstyle="square,pad=0.0",
                             facecolor=p['pill_color'], edgecolor='none', zorder=3)
    ax.add_patch(acc_bar)
    
    # Vertical grid dividers
    ax.plot([X_COL2, X_COL2], [row_top, row_bot], color='#E2E8F0', lw=1.0, zorder=3)
    ax.plot([X_COL3, X_COL3], [row_top, row_bot], color='#E2E8F0', lw=1.0, zorder=3)
    
    # --- Column 1: Paper & Citation ---
    # Citation Badge Pill
    pill_w, pill_h = 0.54, 0.32
    pill = FancyBboxPatch((X_COL1 + 0.22, y_mid + 0.14 - pill_h/2), pill_w, pill_h,
                          boxstyle="round,pad=0.02,rounding_size=0.10",
                          facecolor=p['pill_color'], edgecolor='none', zorder=4)
    ax.add_patch(pill)
    ax.text(X_COL1 + 0.22 + pill_w/2, y_mid + 0.14, p['cite_num'],
            ha='center', va='center', fontsize=11.0, fontweight='bold', color='#FFFFFF', zorder=5)
    
    # Author & Year
    ax.text(X_COL1 + 0.88, y_mid + 0.14, p['author'],
            ha='left', va='center', fontsize=11.8, fontweight='bold', color='#0F172A', zorder=4)
    
    # Title / Venue Subtitle
    ax.text(X_COL1 + 0.24, y_mid - 0.20, p['subtitle'],
            ha='left', va='center', fontsize=9.8, fontstyle='italic', fontweight='bold',
            color='#475569', zorder=4)
    
    # --- Column 2: Key Findings (Strict 2-Liner) ---
    ax.plot(X_COL2 + 0.26, y_mid + 0.14, marker='o', markersize=5.2, color='#0284C7', zorder=4)
    ax.text(X_COL2 + 0.48, y_mid + 0.14, p['finding_l1'],
            ha='left', va='center', fontsize=10.4, fontweight='bold', color='#1E293B', zorder=4)
    ax.text(X_COL2 + 0.48, y_mid - 0.18, p['finding_l2'],
            ha='left', va='center', fontsize=10.0, fontweight='bold', color='#475569', zorder=4)
    
    # --- Column 3: Identified Limitations (Strict 2-Liner) ---
    ax.plot(X_COL3 + 0.26, y_mid + 0.14, marker='s', markersize=5.0, color='#DC2626', zorder=4)
    ax.text(X_COL3 + 0.48, y_mid + 0.14, p['limit_l1'],
            ha='left', va='center', fontsize=10.4, fontweight='bold', color='#1E293B', zorder=4)
    ax.text(X_COL3 + 0.48, y_mid - 0.18, p['limit_l2'],
            ha='left', va='center', fontsize=10.0, fontweight='bold', color='#64748B', zorder=4)

# Table Outer Border Box
table_border = FancyBboxPatch((TABLE_X, Y_START - 5 * ROW_H), TABLE_W, 5 * ROW_H,
                              boxstyle="square,pad=0.0",
                              facecolor='none', edgecolor='#CBD5E1', lw=1.5, zorder=5)
ax.add_patch(table_border)

# ==========================================
# 4. BOTTOM RESEARCH GAP SECTION (CONCISE 2-LINER)
# ==========================================
GAP_Y = Y_START - 5 * ROW_H - 0.18
GAP_H = 1.35

# Drop Shadow for Gap Box
gap_shadow = FancyBboxPatch((TABLE_X + 0.06, GAP_Y - GAP_H - 0.06), TABLE_W, GAP_H,
                            boxstyle="round,pad=0.03,rounding_size=0.18",
                            facecolor='#94A3B8', edgecolor='none', alpha=0.18, zorder=2)
ax.add_patch(gap_shadow)

# Research Gap Box
gap_box = FancyBboxPatch((TABLE_X, GAP_Y - GAP_H), TABLE_W, GAP_H,
                         boxstyle="round,pad=0.03,rounding_size=0.18",
                         facecolor='#F0F9FF', edgecolor='#0284C7', lw=2.0, zorder=3)
ax.add_patch(gap_box)

# Header Tag Badge inside Gap Box
gap_tag_w, gap_tag_h = 2.85, 0.36
gap_tag = FancyBboxPatch((TABLE_X + 0.30, GAP_Y - 0.14 - gap_tag_h), gap_tag_w, gap_tag_h,
                         boxstyle="round,pad=0.02,rounding_size=0.12",
                         facecolor='#0284C7', edgecolor='none', zorder=4)
ax.add_patch(gap_tag)
ax.text(TABLE_X + 0.30 + gap_tag_w/2, GAP_Y - 0.14 - gap_tag_h/2, "IDENTIFIED RESEARCH GAP",
        ha='center', va='center', fontsize=10.5, fontweight='bold', color='#FFFFFF', zorder=5)

# Subheading / Gap Title
ax.text(TABLE_X + 3.35, GAP_Y - 0.32, "The Missing Bridge: Isolated Remote Sensing vs. Actionable Rescue Dispatch",
        ha='left', va='center', fontsize=12.5, fontweight='bold', color='#0F172A', zorder=5)

# Concise 2-Liner Research Gap Summary
gap_line1 = "• Workflow Silos: Existing methods treat SAR flood mapping [1], building damage [2, 5], UAV parsing [3], and USAR triage [4] in isolation."
gap_line2 = "• Operational Gap: No unified system links all-weather SAR flood masks, building damage, Grad-CAM XAI, and rescue squad dispatch in real time."

ax.text(TABLE_X + 0.35, GAP_Y - 0.68, gap_line1,
        ha='left', va='center', fontsize=10.6, fontweight='bold', color='#334155', zorder=5)
ax.text(TABLE_X + 0.35, GAP_Y - 1.02, gap_line2,
        ha='left', va='center', fontsize=10.6, fontweight='bold', color='#1E293B', zorder=5)

# ==========================================
# 5. SAVE OUTPUTS (PNG & PDF)
# ==========================================
out_dir = r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures"
os.makedirs(out_dir, exist_ok=True)
png_path = os.path.join(out_dir, "literature_survey_slide.png")
pdf_path = os.path.join(out_dir, "literature_survey_slide.pdf")

plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.savefig(pdf_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.close()

# Also copy to artifacts directory for direct inspection
artifact_dir = r"C:\Users\Omkar Raut\.gemini\antigravity-ide\brain\1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8"
artifact_png = os.path.join(artifact_dir, "literature_survey_slide.png")
shutil.copy2(png_path, artifact_png)

print("Generated Literature Survey Slide (Concise 1-2 Liners):")
print(f"  PNG: {png_path}")
print(f"  PDF: {pdf_path}")
print(f"  Artifact: {artifact_png}")
