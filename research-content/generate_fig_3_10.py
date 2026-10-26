import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon, FancyArrowPatch
import numpy as np
import os

# Set figure size and resolution
fig = plt.figure(figsize=(22, 11.8), dpi=300)
ax = fig.add_subplot(111)
ax.set_xlim(0, 22)
ax.set_ylim(0, 11.8)
ax.axis('off')

# Background color
fig.patch.set_facecolor('#F8FAFC')
ax.set_facecolor('#F8FAFC')

# -------------------------------------------------------------
# 1. MAIN BORDER & BANNER
# -------------------------------------------------------------
outer_frame = FancyBboxPatch((0.25, 0.25), 21.5, 11.3, boxstyle="round,pad=0.05,rounding_size=0.25",
                             facecolor='#FFFFFF', edgecolor='#0F172A', linewidth=2.2, zorder=1)
ax.add_patch(outer_frame)

# Header Title Block
title_block = FancyBboxPatch((0.45, 10.55), 21.1, 0.85, boxstyle="round,pad=0.03,rounding_size=0.15",
                             facecolor='#0F172A', edgecolor='none', zorder=2)
ax.add_patch(title_block)

ax.text(11.0, 11.08, "Figure 3.10: End-to-End Operational Assessment Data Workflow",
        ha='center', va='center', fontsize=14.0, fontweight='bold', color='#FFFFFF', zorder=3)
ax.text(11.0, 10.74, "Systematic Data Progression from Satellite Scene Registration to Autonomous Squad Dispatch and Field PDF Dossier Export",
        ha='center', va='center', fontsize=9.6, color='#94A3B8', zorder=3)

# -------------------------------------------------------------
# 2. COLOR PALETTES (SOFT, LIGHTWEIGHT, PUBLICATION-READY)
# -------------------------------------------------------------
PAL_PARALLEL = {
    'fill': '#F5F3FF',
    'edge': '#7C3AED',
    'title_box_fill': '#EDE9FE',
    'title_box_text': '#6D28D9',
    'heading': '#5B21B6',
    'accent': '#6D28D9',
}

PAL_RECT = {
    'fill': '#F0F9FF',
    'edge': '#0284C7',
    'title_box_fill': '#E0F2FE',
    'title_box_text': '#0369A1',
    'heading': '#0369A1',
    'accent': '#0284C7',
}

PAL_DIAMOND = {
    'fill': '#FFF7ED',
    'edge': '#EA580C',
    'title_box_fill': '#FFEDD5',
    'title_box_text': '#C2410C',
    'heading': '#C2410C',
    'accent': '#EA580C',
}

PAL_OVAL = {
    'fill': '#F0FDF4',
    'edge': '#16A34A',
    'title_box_fill': '#DCFCE7',
    'title_box_text': '#15803D',
    'heading': '#15803D',
    'accent': '#16A34A',
}

# -------------------------------------------------------------
# 3. DRAWING HELPER FUNCTIONS (ONLY ONE TITLE RECTANGLE PER BLOCK)
# -------------------------------------------------------------
def draw_card_contents(x, y, w, h, stage_title, heading, line1, line2, metric, pal, x_offset=0.0):
    """
    Renders ONLY ONE inner rectangle (the title box at the top).
    All other content sits freely on the card with bold, crisp typography.
    """
    # 1. THE ONLY INNER RECTANGLE: Stage Title Box
    title_w = w - 0.75
    title_box = FancyBboxPatch((x + x_offset - title_w/2, y + h/2 - 0.44), title_w, 0.34,
                               boxstyle="round,pad=0.02,rounding_size=0.09",
                               facecolor=pal['title_box_fill'], edgecolor=pal['edge'], linewidth=1.1, zorder=5)
    ax.add_patch(title_box)
    ax.text(x + x_offset, y + h/2 - 0.27, stage_title, ha='center', va='center',
            fontsize=8.4, fontweight='bold', color=pal['title_box_text'], zorder=6)
    
    # 2. Main Heading (Bold, clean text)
    ax.text(x, y + 0.42, heading, ha='center', va='center',
            fontsize=10.0, fontweight='bold', color=pal['heading'], zorder=6)
    
    # 3. Technical Detail Lines (Bold, high contrast, clean fit)
    ax.text(x, y + 0.08, line1, ha='center', va='center',
            fontsize=8.4, fontweight='bold', color='#0F172A', zorder=6)
    ax.text(x, y - 0.22, line2, ha='center', va='center',
            fontsize=8.4, fontweight='bold', color='#334155', zorder=6)
    
    # 4. Metric / Output Line (Bold accent text, NO bottom rectangle)
    if metric:
        ax.text(x, y - 0.58, metric, ha='center', va='center',
                fontsize=8.4, fontweight='bold', color=pal['accent'], zorder=6)

def draw_process_box(x, y, w, h, stage_title, heading, line1, line2, metric, pal=PAL_RECT):
    patch = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle="round,pad=0.04,rounding_size=0.20",
                           facecolor=pal['fill'], edgecolor=pal['edge'], linewidth=2.0, zorder=3)
    ax.add_patch(patch)
    draw_card_contents(x, y, w, h, stage_title, heading, line1, line2, metric, pal)

def draw_parallel_box(x, y, w, h, stage_title, heading, line1, line2, metric, pal=PAL_PARALLEL, skew=0.18):
    pts = np.array([
        [x - w/2 + skew, y - h/2],
        [x + w/2 + skew, y - h/2],
        [x + w/2 - skew, y + h/2],
        [x - w/2 - skew, y + h/2]
    ])
    poly = Polygon(pts, closed=True, facecolor=pal['fill'], edgecolor=pal['edge'], linewidth=2.0, zorder=3)
    ax.add_patch(poly)
    draw_card_contents(x, y, w, h, stage_title, heading, line1, line2, metric, pal, x_offset=-skew*0.5)

def draw_oval_box(x, y, w, h, stage_title, heading, line1, line2, metric, pal=PAL_OVAL):
    patch = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle=f"round,pad=0.05,rounding_size={h/2}",
                           facecolor=pal['fill'], edgecolor=pal['edge'], linewidth=2.0, zorder=3)
    ax.add_patch(patch)
    draw_card_contents(x, y, w, h, stage_title, heading, line1, line2, metric, pal)

def draw_decision_diamond(x, y, w, h, stage_title, heading, line1, line2, pal=PAL_DIAMOND):
    pts = np.array([
        [x, y - h/2],
        [x + w/2, y],
        [x, y + h/2],
        [x - w/2, y]
    ])
    poly = Polygon(pts, closed=True, facecolor=pal['fill'], edgecolor=pal['edge'], linewidth=2.2, zorder=3)
    ax.add_patch(poly)
    
    # 1. The ONLY inner title rectangle for Diamond
    title_w = 2.40
    title_box = FancyBboxPatch((x - title_w/2, y + 0.44), title_w, 0.32,
                               boxstyle="round,pad=0.02,rounding_size=0.08",
                               facecolor=pal['title_box_fill'], edgecolor=pal['edge'], linewidth=1.0, zorder=5)
    ax.add_patch(title_box)
    ax.text(x, y + 0.60, stage_title, ha='center', va='center',
            fontsize=8.0, fontweight='bold', color=pal['title_box_text'], zorder=6)

    # 2. Heading and details (Bold text, NO bottom rectangle)
    ax.text(x, y + 0.12, heading, ha='center', va='center',
            fontsize=10.2, fontweight='bold', color=pal['heading'], zorder=6, linespacing=1.15)
    ax.text(x, y - 0.35, line1, ha='center', va='center',
            fontsize=8.6, fontweight='bold', color='#0F172A', zorder=6)
    ax.text(x, y - 0.62, line2, ha='center', va='center',
            fontsize=8.0, fontweight='bold', color='#431407', zorder=6)

def draw_flow_arrow(x1, y1, x2, y2, label="", label_dy=0.34, color='#0284C7', text_color='#0369A1'):
    arrow = FancyArrowPatch((x1, y1), (x2, y2),
                            arrowstyle='-|>',
                            mutation_scale=16,
                            color=color,
                            linewidth=2.0,
                            zorder=10)
    ax.add_patch(arrow)
    if label:
        mx = (x1 + x2) / 2
        my = (y1 + y2) / 2 + label_dy
        ax.text(mx, my, label, ha='center', va='center', fontsize=7.6, fontweight='bold',
                color=text_color, bbox=dict(boxstyle='round,pad=0.18', facecolor='#FFFFFF', edgecolor=color, linewidth=1.0, alpha=1.0), zorder=12)

# -------------------------------------------------------------
# 4. NODE POSITIONS & GEOMETRY (4 NODES PER ROW)
# -------------------------------------------------------------
card_w = 3.80
card_h = 2.45

# X coordinates for columns 1, 2, 3, 4
cx = [3.20, 8.40, 13.60, 18.80]

y_row1 = 7.75
y_row2 = 3.25

# =============================================================
# ROW 1: INGESTION & DEEP PERCEPTION (LEFT TO RIGHT)
# =============================================================

# Node 1: SATELLITE INTAKE (Input Parallelogram)
draw_parallel_box(cx[0], y_row1, card_w, card_h,
                  "STAGE 1 • SATELLITE INTAKE",
                  "Scene Registration",
                  "Sentinel-1 SAR Radar (Dual VV + VH)",
                  "Sentinel-2 Optical (12 L2A Bands)",
                  "Input: Pre & Post-Disaster GeoTIFFs",
                  pal=PAL_PARALLEL)

# Node 2: PREPROCESSING (Process Rectangle)
draw_process_box(cx[1], y_row1, card_w, card_h,
                 "STAGE 2 • TENSOR PREPROCESSING",
                 "Radiometric & Spatial Alignment",
                 "WGS84 EPSG:4326 Co-Registration",
                 "Normalized 128×128 GeoTIFF Tiling",
                 "Tensor Stream: 128 × 128 × C Channels",
                 pal=PAL_RECT)

# Node 3: DUAL-STREAM AI (Process Rectangle)
draw_process_box(cx[2], y_row1, card_w, card_h,
                 "STAGE 3 • DUAL-STREAM PERCEPTION",
                 "Deep Neural Inference",
                 "SAR Flood U-Net (82.4% Val IoU)",
                 "xBD Ensemble: Damage Scores (S_i)",
                 "Explainability: Grad-CAM (<200ms)",
                 pal=PAL_RECT)

# Node 4: DECISION (Diamond)
draw_decision_diamond(cx[3], y_row1, 4.00, 2.55,
                      "STAGE 4 • CRITICAL CHECK",
                      "Flood Inundation\nDetected?",
                      "Threshold tau = 0.50",
                      "Filters Baseline Rivers",
                      pal=PAL_DIAMOND)

# Row 1 Arrows
draw_flow_arrow(cx[0] + card_w/2, y_row1, cx[1] - card_w/2, y_row1, "Raw Imagery", color='#0284C7', text_color='#0369A1')
draw_flow_arrow(cx[1] + card_w/2, y_row1, cx[2] - card_w/2, y_row1, "128×128 Tensors", color='#0284C7', text_color='#0369A1')
draw_flow_arrow(cx[2] + card_w/2, y_row1, cx[3] - 2.00, y_row1, "Model Masks", color='#0284C7', text_color='#0369A1')

# -------------------------------------------------------------
# Decision "NO" Branch: STRAIGHT VERTICAL ARROW (NOT CURVY)
# -------------------------------------------------------------
no_box_w = 3.20
no_box_h = 0.46
no_box_y = 9.85

no_box = FancyBboxPatch((cx[3] - no_box_w/2, no_box_y - no_box_h/2), no_box_w, no_box_h,
                        boxstyle="round,pad=0.03,rounding_size=0.10",
                        facecolor='#F1F5F9', edgecolor='#64748B', linewidth=1.2, zorder=11)
ax.add_patch(no_box)
ax.text(cx[3], no_box_y, "NO: Baseline Archive (Normal Watch)", ha='center', va='center',
        fontsize=7.8, fontweight='bold', color='#475569', zorder=12)

# Straight vertical arrow from top vertex of diamond straight up to the bottom of the no_box
diamond_top_y = y_row1 + 2.55 / 2
no_arrow = FancyArrowPatch((cx[3], diamond_top_y), (cx[3], no_box_y - no_box_h/2),
                           arrowstyle='-|>', mutation_scale=15, color='#64748B', linewidth=1.8, zorder=10)
ax.add_patch(no_arrow)

# Decision "YES" Branch: Straight down connecting Row 1 to Row 2
yes_arrow = FancyArrowPatch((cx[3], y_row1 - 1.275), (cx[3], y_row2 + card_h/2),
                            arrowstyle='-|>', mutation_scale=18, color='#EA580C', linewidth=2.4, zorder=10)
ax.add_patch(yes_arrow)
ax.text(cx[3], (y_row1 + y_row2)/2, "YES: Inundation Confirmed\nM_new = M_post \\ M_pre", ha='center', va='center',
        fontsize=8.0, fontweight='bold', color='#C2410C',
        bbox=dict(boxstyle='round,pad=0.25', facecolor='#FFF7ED', edgecolor='#EA580C', linewidth=1.2, alpha=1.0), zorder=12, linespacing=1.20)

# =============================================================
# ROW 2: FUSION, OPTIMIZATION & EXPORT (RIGHT TO LEFT)
# =============================================================

# Node 5: MULTIMODAL SPATIAL RISK (Process Rectangle)
draw_process_box(cx[3], y_row2, card_w, card_h,
                 "STAGE 5 • SPATIAL RISK FUSION",
                 "Multimodal Risk Engine",
                 "Building Polygon ∩ Flood Water Mask",
                 "Equal 50-50 Exposure (E_i) & Damage (S_i)",
                 "R_i = 0.50·E_i + 0.50·S_i (303 Assets)",
                 pal=PAL_RECT)

# Node 6: RESCUE SQUAD ALLOCATION (Process Rectangle)
draw_process_box(cx[2], y_row2, card_w, card_h,
                 "STAGE 6 • RESCUE OPTIMIZATION",
                 "Intelligent Squad Dispatch",
                 "Greedy Solver across 18 Squads",
                 "1:1 Capacity Locks & Deficit Backlog",
                 "S_alloc = 0.40P + 0.35C + 0.25D",
                 pal=PAL_RECT)

# Node 7: COMMAND CONSOLE & PDF EXPORT (Output Parallelogram)
draw_parallel_box(cx[1], y_row2, card_w, card_h,
                  "STAGE 7 • OPERATIONAL OUTPUT",
                  "Command Console & Dossier",
                  "Interactive Leaflet GIS Web Map",
                  "Automated Field PDF Operations Briefing",
                  "Output: Mission Directives & PDF Dossier",
                  pal=PAL_PARALLEL)

# Node 8: FIELD RESCUE DEPLOYMENT (Terminal Oval)
draw_oval_box(cx[0], y_row2, card_w, card_h,
              "STAGE 8 • FIELD DEPLOYMENT",
              "Tactical Rescue Operations",
              "4 Waterborne • 18 USAR Structural Squads",
              "123 Welfare Checks • 158 Monitoring",
              "Completed: 303 Mission Tasks Dispatched",
              pal=PAL_OVAL)

# Row 2 Arrows (Right to Left)
draw_flow_arrow(cx[3] - card_w/2, y_row2, cx[2] + card_w/2, y_row2, "303 Risk Records", color='#7C3AED', text_color='#5B21B6')
draw_flow_arrow(cx[2] - card_w/2, y_row2, cx[1] + card_w/2, y_row2, "Squad Manifests", color='#7C3AED', text_color='#5B21B6')
draw_flow_arrow(cx[1] - card_w/2, y_row2, cx[0] + card_w/2, y_row2, "Field Directives", color='#16A34A', text_color='#15803D')

# -------------------------------------------------------------
# 5. SLEEK BOTTOM BENCHMARK BAR (CLEAN, NO NESTED RECTANGLES)
# -------------------------------------------------------------
footer_bar = FancyBboxPatch((0.60, 0.45), 20.8, 0.70, boxstyle="round,pad=0.03,rounding_size=0.12",
                            facecolor='#FFFBEB', edgecolor='#F59E0B', linewidth=1.5, zorder=3)
ax.add_patch(footer_bar)

# Clean bold benchmark text separated by subtle vertical dividers
ax.text(4.00, 0.80, "Perception: Sen1Floods11 (82.4% IoU) & xBD Damage Ensembles", ha='center', va='center',
        fontsize=8.2, fontweight='bold', color='#92400E', zorder=5)

ax.text(7.40, 0.80, "•", ha='center', va='center', fontsize=12, fontweight='bold', color='#D97706', zorder=5)

ax.text(10.80, 0.80, "Fusion: Equal-Weight R_i = 0.50·E_i + 0.50·S_i with Grad-CAM Audit Trail", ha='center', va='center',
        fontsize=8.2, fontweight='bold', color='#92400E', zorder=5)

ax.text(14.50, 0.80, "•", ha='center', va='center', fontsize=12, fontweight='bold', color='#D97706', zorder=5)

ax.text(17.80, 0.80, "Dispatch: S_alloc Optimization Solver, Leaflet GIS & Automated PDF Dossier", ha='center', va='center',
        fontsize=8.2, fontweight='bold', color='#92400E', zorder=5)

# -------------------------------------------------------------
# 6. SAVE HIGH RESOLUTION PNG & PDF
# -------------------------------------------------------------
os.makedirs("research-content/figures", exist_ok=True)
png_path = "research-content/figures/figure_4_methodology_data_flow.png"
pdf_path = "research-content/figures/figure_4_methodology_data_flow.pdf"

plt.savefig(png_path, bbox_inches='tight', dpi=300)
plt.savefig(pdf_path, bbox_inches='tight', dpi=300)

dataset_copy = "research-content/xbd_s12_dataset/methodology_data_flow_diagram.png"
if os.path.exists(os.path.dirname(dataset_copy)):
    plt.savefig(dataset_copy, bbox_inches='tight', dpi=300)

plt.close()
print(f"Polished Figure 3.10 with straight gray arrow successfully saved to:\n- {png_path}\n- {pdf_path}")
