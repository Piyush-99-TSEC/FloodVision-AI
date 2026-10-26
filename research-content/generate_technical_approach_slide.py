import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np
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
ax.text(0.50, 9.78, "Technical Approach",
        fontsize=35, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (05)
num_box = FancyBboxPatch((17.80, 9.58), 0.90, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(18.25, 9.855, "05", ha='center', va='center',
        fontsize=15.5, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.50, 18.70], [9.32, 9.32], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Context Statement
ax.text(0.50, 8.92,
        "System Architecture Flow, Technology Stack, and Open-Source Humanitarian Ecosystem",
        fontsize=13.8, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. PANEL CONTAINERS (A: Technical Approach, B: Open-Source Technologies)
# ==========================================
PANEL_Y = 8.65
PANEL_H = 7.85

PANEL_A_X = 0.50
PANEL_A_W = 8.90

PANEL_B_X = 9.80
PANEL_B_W = 8.90

# Panel A: Outer Shadow & Card
shadow_a = FancyBboxPatch((PANEL_A_X + 0.08, PANEL_Y - PANEL_H - 0.08), PANEL_A_W, PANEL_H,
                          boxstyle="round,pad=0.03,rounding_size=0.22",
                          facecolor='#94A3B8', edgecolor='none', alpha=0.18, zorder=2)
ax.add_patch(shadow_a)

card_a = FancyBboxPatch((PANEL_A_X, PANEL_Y - PANEL_H), PANEL_A_W, PANEL_H,
                        boxstyle="round,pad=0.03,rounding_size=0.22",
                        facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.8, zorder=3)
ax.add_patch(card_a)

# Panel B: Outer Shadow & Card
shadow_b = FancyBboxPatch((PANEL_B_X + 0.08, PANEL_Y - PANEL_H - 0.08), PANEL_B_W, PANEL_H,
                          boxstyle="round,pad=0.03,rounding_size=0.22",
                          facecolor='#94A3B8', edgecolor='none', alpha=0.18, zorder=2)
ax.add_patch(shadow_b)

card_b = FancyBboxPatch((PANEL_B_X, PANEL_Y - PANEL_H), PANEL_B_W, PANEL_H,
                        boxstyle="round,pad=0.03,rounding_size=0.22",
                        facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.8, zorder=3)
ax.add_patch(card_b)

# Section Titles
ax.text(PANEL_A_X + 0.35, PANEL_Y - 0.38, "A. TECHNICAL APPROACH & SYSTEM FLOW",
        fontsize=12.5, fontweight='bold', color='#0284C7', zorder=5)

ax.text(PANEL_B_X + 0.35, PANEL_Y - 0.38, "B. OPEN-SOURCE TECHNOLOGIES & USAGE RATIONALE",
        fontsize=12.5, fontweight='bold', color='#0D9488', zorder=5)

# Separator lines under section titles
ax.plot([PANEL_A_X + 0.35, PANEL_A_X + PANEL_A_W - 0.35], [PANEL_Y - 0.54, PANEL_Y - 0.54],
        color='#E2E8F0', lw=1.2, zorder=4)
ax.plot([PANEL_B_X + 0.35, PANEL_B_X + PANEL_B_W - 0.35], [PANEL_Y - 0.54, PANEL_Y - 0.54],
        color='#E2E8F0', lw=1.2, zorder=4)

# ==========================================
# 3. PANEL A: TECHNICAL APPROACH FLOW (5 TIERS)
# ==========================================
tier_data = [
    {
        "num": "1",
        "title": "Tier 1 • Client & Web GIS Presentation",
        "badge": "APPLICATION LAYER",
        "badge_color": "#1D4ED8", "badge_bg": "#DBEAFE",
        "color": "#2563EB", "border": "#3B82F6", "bg": "#EFF6FF",
        "tech": "React 18  •  TypeScript  •  TailwindCSS  •  Leaflet GIS  •  Vite",
        "role": "Interactive web GIS dashboard delivering live flood polygons, damage pins, and rescue routing."
    },
    {
        "num": "2",
        "title": "Tier 2 • Application Gateway & Task Orchestrator",
        "badge": "ORCHESTRATION",
        "badge_color": "#047857", "badge_bg": "#D1FAE5",
        "color": "#059669", "border": "#10B981", "bg": "#ECFDF5",
        "tech": "Node.js (v20+)  •  Express.js  •  TypeScript  •  JWT Auth  •  Multer",
        "role": "Manages REST APIs, secure user sessions, GeoTIFF ingestion, and rescue squad task dispatching."
    },
    {
        "num": "3",
        "title": "Tier 3 • Geospatial & Document Persistence",
        "badge": "PERSISTENCE",
        "badge_color": "#334155", "badge_bg": "#E2E8F0",
        "color": "#475569", "border": "#64748B", "bg": "#F8FAFC",
        "tech": "MongoDB Community  •  Mongoose ODM  •  GeoJSON 2dsphere",
        "role": "Stores multi-temporal satellite metadata, building polygons, and mission operational logs."
    },
    {
        "num": "4",
        "title": "Tier 4 • High-Throughput AI Microservice",
        "badge": "AI MICROSERVICE",
        "badge_color": "#6D28D9", "badge_bg": "#EDE9FE",
        "color": "#7C3AED", "border": "#8B5CF6", "bg": "#FAF5FF",
        "tech": "Python 3.10+  •  FastAPI (ASGI)  •  Uvicorn  •  Pydantic  •  NumPy",
        "role": "High-speed asynchronous prediction endpoint (/predict) with automated SAR tensor normalization."
    },
    {
        "num": "5",
        "title": "Tier 5 • Deep Learning Perception & XAI Core",
        "badge": "AI CORE & XAI",
        "badge_color": "#B45309", "badge_bg": "#FEF3C7",
        "color": "#D97706", "border": "#F59E0B", "bg": "#FFFBEB",
        "tech": "PyTorch Core  •  Segmentation Models (SMP)  •  Flood U-Net  •  Torch-CAM",
        "role": "Dual-stream Flood U-Net (SAR) + xBD damage assessment with Grad-CAM visual attribution maps."
    }
]

TIER_X = PANEL_A_X + 0.35
TIER_W = PANEL_A_W - 0.70  # 8.20 inches
TIER_H = 0.98
ARROW_GAP = 0.42
TIER_START_Y = PANEL_Y - 0.68

arrow_labels = [
    "HTTPS / REST Requests  •  GeoJSON Vectors & Imagery Ingestion",
    "Mongoose ODM  •  Schema Validation & 2dsphere Spatial Queries",
    "Asynchronous HTTP Dispatch  •  Multispectral Array Streaming",
    "Normalized Tensors  •  CUDA GPU Model Forward Pass"
]

for idx, t in enumerate(tier_data):
    ty = TIER_START_Y - idx * (TIER_H + ARROW_GAP)
    
    # Tier Card
    tcard = FancyBboxPatch((TIER_X, ty - TIER_H), TIER_W, TIER_H,
                           boxstyle="round,pad=0.02,rounding_size=0.12",
                           facecolor=t['bg'], edgecolor=t['border'], lw=1.6, zorder=4)
    ax.add_patch(tcard)
    
    # Left accent indicator bar
    acc = FancyBboxPatch((TIER_X, ty - TIER_H), 0.10, TIER_H,
                         boxstyle="square,pad=0.0",
                         facecolor=t['color'], edgecolor='none', zorder=5)
    ax.add_patch(acc)
    
    # Number Circle
    circ_cx = TIER_X + 0.38
    circ_cy = ty - 0.24
    c_num = Circle((circ_cx, circ_cy), 0.18, facecolor=t['color'], edgecolor='none', zorder=5)
    ax.add_patch(c_num)
    ax.text(circ_cx, circ_cy, t['num'], ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#FFFFFF', zorder=6)
    
    # Tier Title
    ax.text(TIER_X + 0.66, ty - 0.24, t['title'],
            ha='left', va='center', fontsize=10.8, fontweight='bold', color='#0F172A', zorder=5)
    
    # Badge Pill (Right side)
    bw, bh = 1.70, 0.27
    bx = TIER_X + TIER_W - bw - 0.15
    by = ty - 0.10 - bh
    bp = FancyBboxPatch((bx, by), bw, bh,
                        boxstyle="round,pad=0.02,rounding_size=0.08",
                        facecolor=t['badge_bg'], edgecolor=t['border'], lw=1.0, zorder=5)
    ax.add_patch(bp)
    ax.text(bx + bw/2.0, by + bh/2.0, t['badge'],
            ha='center', va='center', fontsize=7.8, fontweight='bold', color=t['badge_color'], zorder=6)
    
    # Technologies Line
    ax.text(TIER_X + 0.66, ty - 0.50, t['tech'],
            ha='left', va='center', fontsize=9.2, fontweight='bold', color=t['color'], zorder=5)
    
    # Single Crisp Role Line (Easy to read, no clutter)
    ax.text(TIER_X + 0.66, ty - 0.76, t['role'],
            ha='left', va='center', fontsize=8.0, fontweight='bold', color='#475569', zorder=5)
    
    # Connecting Arrow to Next Tier with protocol badge chip
    if idx < len(tier_data) - 1:
        ay1 = ty - TIER_H
        ay2 = ty - TIER_H - ARROW_GAP
        ax_mid = TIER_X + TIER_W / 2.0
        
        # Source pin dot
        ax.scatter([ax_mid], [ay1], s=28, color=t['color'], zorder=7)
        
        # Downward Arrow
        arr = FancyArrowPatch((ax_mid, ay1), (ax_mid, ay2),
                              arrowstyle='-|>', mutation_scale=14,
                              color='#64748B', lw=2.0, zorder=5)
        ax.add_patch(arr)
        
        # Protocol Badge Chip centered over arrow
        pw, ph = 4.80, 0.25
        px = ax_mid - pw / 2.0
        py_mid = (ay1 + ay2) / 2.0 - ph / 2.0
        proto_chip = FancyBboxPatch((px, py_mid), pw, ph,
                                   boxstyle="round,pad=0.02,rounding_size=0.08",
                                   facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.2, zorder=6)
        ax.add_patch(proto_chip)
        
        ax.text(ax_mid, (ay1 + ay2)/2.0, arrow_labels[idx],
                ha='center', va='center', fontsize=7.6, fontweight='bold', color='#1E293B', zorder=7)


# ==========================================
# 4. PANEL B: OPEN-SOURCE TECHNOLOGIES & REASONS FOR USAGE
# ==========================================
BOX_X = PANEL_B_X + 0.35
BOX_W = PANEL_B_W - 0.70  # 8.20 inches

os_techs = [
    {
        "name": "PyTorch & Segmentation Models (SMP)",
        "badge": "DL CORE  •  BSD-3 / MIT",
        "badge_color": "#7C3AED", "badge_bg": "#EDE9FE",
        "color": "#7C3AED", "border": "#C4B5FD", "bg": "#FAF5FF",
        "reason_l1": "Provides modular U-Net & ResNet architectures with native CUDA GPU acceleration,",
        "reason_l2": "enabling full algorithmic inspectability without expensive proprietary API fees."
    },
    {
        "name": "FastAPI & Uvicorn ASGI Server",
        "badge": "AI SERVICE  •  MIT",
        "badge_color": "#0D9488", "badge_bg": "#CCFBF1",
        "color": "#0D9488", "border": "#5EEAD4", "bg": "#F0FDFA",
        "reason_l1": "High-throughput asynchronous Python framework providing sub-second inference serving (/predict),",
        "reason_l2": "automated request schema validation, and live OpenAPI documentation."
    },
    {
        "name": "React 18 & TypeScript",
        "badge": "FRONTEND  •  MIT",
        "badge_color": "#1D4ED8", "badge_bg": "#DBEAFE",
        "color": "#2563EB", "border": "#93C5FD", "bg": "#EFF6FF",
        "reason_l1": "Component-driven, strictly typed UI architecture delivering a resilient, zero-crash tactical",
        "reason_l2": "dashboard for first responder incident triage and dispatch operations."
    },
    {
        "name": "Leaflet.js & OpenStreetMap (OSM)",
        "badge": "GIS MAPPING  •  BSD-2 / ODbL",
        "badge_color": "#047857", "badge_bg": "#D1FAE5",
        "color": "#059669", "border": "#6EE7B7", "bg": "#ECFDF5",
        "reason_l1": "Zero-cost, lightweight client-side GIS library replacing expensive enterprise GIS licenses",
        "reason_l2": "(e.g., ArcGIS) with offline tile support during disaster communication outages."
    },
    {
        "name": "MongoDB Community & Mongoose ODM",
        "badge": "DATABASE  •  SSPL / OPEN",
        "badge_color": "#334155", "badge_bg": "#E2E8F0",
        "color": "#475569", "border": "#94A3B8", "bg": "#F8FAFC",
        "reason_l1": "Flexible document store with native GeoJSON 2dsphere spatial indexing, enabling sub-millisecond",
        "reason_l2": "proximity queries across hundreds of disaster-affected building footprints."
    },
    {
        "name": "ESA Copernicus Sentinel-1 & Sentinel-2",
        "badge": "EARTH OBS.  •  CC-BY 4.0",
        "badge_color": "#0284C7", "badge_bg": "#E0F2FE",
        "color": "#0284C7", "border": "#7DD3FC", "bg": "#F0F9FF",
        "reason_l1": "Eliminates prohibitive commercial satellite imagery paywalls ($5,000–$15,000 per scene),",
        "reason_l2": "providing free, continuous, all-weather global satellite data for humanitarian aid."
    }
]

TECH_H = 0.88
TECH_GAP = 0.11
TECH_START_Y = PANEL_Y - 0.68

for idx, t in enumerate(os_techs):
    ty = TECH_START_Y - idx * (TECH_H + TECH_GAP)
    
    # Container Card
    tcard = FancyBboxPatch((BOX_X, ty - TECH_H), BOX_W, TECH_H,
                           boxstyle="round,pad=0.02,rounding_size=0.10",
                           facecolor=t['bg'], edgecolor=t['border'], lw=1.4, zorder=4)
    ax.add_patch(tcard)
    
    # Left accent indicator bar
    acc = FancyBboxPatch((BOX_X, ty - TECH_H), 0.10, TECH_H,
                         boxstyle="square,pad=0.0",
                         facecolor=t['color'], edgecolor='none', zorder=5)
    ax.add_patch(acc)
    
    # Tech Name
    ax.text(BOX_X + 0.26, ty - 0.22, t['name'],
            ha='left', va='center', fontsize=10.2, fontweight='bold', color='#0F172A', zorder=5)
    
    # Badge Pill (Right side)
    bw, bh = 2.15, 0.26
    bx = BOX_X + BOX_W - bw - 0.15
    by = ty - 0.09 - bh
    bp = FancyBboxPatch((bx, by), bw, bh,
                        boxstyle="round,pad=0.02,rounding_size=0.08",
                        facecolor=t['badge_bg'], edgecolor=t['border'], lw=1.0, zorder=5)
    ax.add_patch(bp)
    ax.text(bx + bw/2.0, by + bh/2.0, t['badge'],
            ha='center', va='center', fontsize=7.4, fontweight='bold', color=t['badge_color'], zorder=6)
    
    # Reason Label + 2-line clean wrapped text
    ax.text(BOX_X + 0.26, ty - 0.48, "Why Used: " + t['reason_l1'],
            ha='left', va='center', fontsize=7.7, fontweight='bold', color='#334155', zorder=5)
    ax.text(BOX_X + 0.85, ty - 0.68, t['reason_l2'],
            ha='left', va='center', fontsize=7.7, fontweight='bold', color='#475569', zorder=5)


# --- SECTION B2: CALLOUT BANNER: STRATEGIC MISSION IMPACT ---
BANNER_Y = TECH_START_Y - 6 * (TECH_H + TECH_GAP) - 0.04
BANNER_H = 0.82

# Callout Card (Light Teal Tint Card)
c_card = FancyBboxPatch((BOX_X, BANNER_Y - BANNER_H), BOX_W, BANNER_H,
                        boxstyle="round,pad=0.02,rounding_size=0.12",
                        facecolor='#F0FDFA', edgecolor='#14B8A6', lw=1.6, zorder=4)
ax.add_patch(c_card)

# Left accent indicator bar
c_acc = FancyBboxPatch((BOX_X, BANNER_Y - BANNER_H), 0.10, BANNER_H,
                       boxstyle="square,pad=0.0",
                       facecolor='#0D9488', edgecolor='none', zorder=5)
ax.add_patch(c_acc)

# Banner Title
ax.text(BOX_X + 0.30, BANNER_Y - 0.22,
        "STRATEGIC MISSION IMPACT OF OPEN-SOURCE DISASTER AI",
        ha='left', va='center', fontsize=9.4, fontweight='bold', color='#0F766E', zorder=5)

# 3 Key Light Pills below title
pills = [
    ("Zero Procurement Delays", "#DCFCE7", "#22C55E", "#15803D"),
    ("Life-Critical AI Transparency", "#DBEAFE", "#3B82F6", "#1D4ED8"),
    ("Sovereign Offline Edge Deployment", "#F3E8FF", "#A855F7", "#7E22CE")
]

pw, ph = 2.45, 0.30
p_gap = 0.12
p_start_x = BOX_X + 0.30

for p_idx, (p_text, p_bg, p_brd, p_txt_col) in enumerate(pills):
    px = p_start_x + p_idx * (pw + p_gap)
    py = BANNER_Y - 0.38 - ph
    ppatch = FancyBboxPatch((px, py), pw, ph,
                            boxstyle="round,pad=0.02,rounding_size=0.08",
                            facecolor=p_bg, edgecolor=p_brd, lw=1.2, zorder=5)
    ax.add_patch(ppatch)
    ax.text(px + pw/2.0, py + ph/2.0, p_text,
            ha='center', va='center', fontsize=7.8, fontweight='bold', color=p_txt_col, zorder=6)


# ==========================================
# 5. SAVE OUTPUTS (PNG & PDF)
# ==========================================
out_dir = r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures"
os.makedirs(out_dir, exist_ok=True)
png_path = os.path.join(out_dir, "technical_approach_slide.png")
pdf_path = os.path.join(out_dir, "technical_approach_slide.pdf")

plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.savefig(pdf_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.close()

# Also copy to artifacts directory for direct user preview
artifact_dir = r"C:\Users\Omkar Raut\.gemini\antigravity-ide\brain\1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8"
artifact_png = os.path.join(artifact_dir, "technical_approach_slide.png")
shutil.copy2(png_path, artifact_png)

print("Generated Refactored Technical Approach Slide (Slide 05) successfully:")
print(f"  PNG: {png_path}")
print(f"  PDF: {pdf_path}")
print(f"  Artifact: {artifact_png}")
