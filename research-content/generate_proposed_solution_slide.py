import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Polygon, FancyArrowPatch
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
ax.text(0.50, 9.78, "Proposed Solution",
        fontsize=35, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (04)
num_box = FancyBboxPatch((17.80, 9.58), 0.90, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(18.25, 9.855, "04", ha='center', va='center',
        fontsize=15.5, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.50, 18.70], [9.32, 9.32], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Context Statement
ax.text(0.50, 8.92,
        "System Architecture & Operational Pipeline: Dual-Stream Remote Sensing, Multimodal Risk Triage, and Automated USAR Fleet Dispatch",
        fontsize=13.8, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. PANEL CONTAINERS (A: Flowchart, B: Process)
# ==========================================
PANEL_Y = 8.65
PANEL_H = 7.85

PANEL_A_X = 0.50
PANEL_A_W = 12.20

PANEL_B_X = 12.95
PANEL_B_W = 5.75

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
ax.text(PANEL_A_X + 0.35, PANEL_Y - 0.40, "A. OPERATIONAL LOGIC & SYSTEM DATA FLOWCHART",
        fontsize=12.5, fontweight='bold', color='#0284C7', zorder=5)

ax.text(PANEL_B_X + 0.35, PANEL_Y - 0.40, "B. SEQUENTIAL IMPLEMENTATION PROCESS",
        fontsize=12.5, fontweight='bold', color='#0D9488', zorder=5)

# Separator lines under section titles
ax.plot([PANEL_A_X + 0.35, PANEL_A_X + PANEL_A_W - 0.35], [PANEL_Y - 0.58, PANEL_Y - 0.58],
        color='#E2E8F0', lw=1.2, zorder=4)
ax.plot([PANEL_B_X + 0.35, PANEL_B_X + PANEL_B_W - 0.35], [PANEL_Y - 0.58, PANEL_Y - 0.58],
        color='#E2E8F0', lw=1.2, zorder=4)

# ==========================================
# 3. HELPER FUNCTIONS FOR FLOWCHART NODES & ARROWS
# ==========================================

def draw_stadium(ax, cx, cy, w, h, bg_color, border_color, title, subtitle, title_color='#14532D', sub_color='#15803D'):
    """Draws a pill/stadium terminal shape with centered text."""
    box = FancyBboxPatch((cx - w/2.0, cy - h/2.0), w, h,
                         boxstyle=f"round,pad=0.02,rounding_size={h/2.0}",
                         facecolor=bg_color, edgecolor=border_color, lw=2.0, zorder=4)
    ax.add_patch(box)
    ax.text(cx, cy + 0.11, title, ha='center', va='center',
            fontsize=7.4, fontweight='bold', color=title_color, zorder=5)
    ax.text(cx, cy - 0.13, subtitle, ha='center', va='center',
            fontsize=6.2, fontweight='bold', color=sub_color, zorder=5)

def draw_parallelogram(ax, cx, cy, w, h, slant, bg_color, border_color, title, subtitle, title_color='#581C87', sub_color='#6B21A8', t_fs=7.0):
    """Draws a flowchart parallelogram (data/input/output)."""
    pts = [
        [cx - w/2.0 - slant/2.0, cy - h/2.0],
        [cx + w/2.0 - slant/2.0, cy - h/2.0],
        [cx + w/2.0 + slant/2.0, cy + h/2.0],
        [cx - w/2.0 + slant/2.0, cy + h/2.0]
    ]
    poly = Polygon(pts, closed=True, facecolor=bg_color, edgecolor=border_color, lw=2.0, zorder=4)
    ax.add_patch(poly)
    ax.text(cx, cy + 0.12, title, ha='center', va='center',
            fontsize=t_fs, fontweight='bold', color=title_color, zorder=5)
    ax.text(cx, cy - 0.13, subtitle, ha='center', va='center',
            fontsize=6.2, fontweight='bold', color=sub_color, linespacing=1.2, zorder=5)

def draw_process_box(ax, cx, cy, w, h, bg_color, border_color, title, subtitle, title_color='#0369A1', sub_color='#0284C7', t_fs=7.0):
    """Draws a standard rounded process box."""
    box = FancyBboxPatch((cx - w/2.0, cy - h/2.0), w, h,
                         boxstyle="round,pad=0.02,rounding_size=0.12",
                         facecolor=bg_color, edgecolor=border_color, lw=2.0, zorder=4)
    ax.add_patch(box)
    ax.text(cx, cy + 0.13, title, ha='center', va='center',
            fontsize=t_fs, fontweight='bold', color=title_color, zorder=5)
    ax.text(cx, cy - 0.13, subtitle, ha='center', va='center',
            fontsize=6.2, fontweight='bold', color=sub_color, linespacing=1.2, zorder=5)

def draw_decision_diamond(ax, cx, cy, w, h, bg_color, border_color, title_lines, subtitle, title_color='#9A3412', sub_color='#C2410C'):
    """Draws a decision diamond with 4 vertices and perfectly fitted multi-line text."""
    pts = [
        [cx, cy + h/2.0],      # Top
        [cx + w/2.0, cy],      # Right
        [cx, cy - h/2.0],      # Bottom
        [cx - w/2.0, cy]       # Left
    ]
    poly = Polygon(pts, closed=True, facecolor=bg_color, edgecolor=border_color, lw=2.0, zorder=4)
    ax.add_patch(poly)
    
    # 2-line title centered slightly above middle
    ax.text(cx, cy + 0.11, title_lines, ha='center', va='center',
            fontsize=7.2, fontweight='bold', color=title_color, linespacing=1.05, zorder=5)
    # subtitle below middle
    ax.text(cx, cy - 0.16, subtitle, ha='center', va='center',
            fontsize=6.2, fontweight='bold', color=sub_color, zorder=5)

def draw_flow_link(ax, x1, y1, x2, y2, color, label_text=None, label_side='top', label_offset=0.10, rad=0.0):
    """Draws a crisp connection with visible source pin dot, bold arrow, and clean stroked label."""
    # 1. Distinct Source Pin Dot at origin
    ax.scatter([x1], [y1], s=28, color=color, zorder=7)
    
    # 2. Connection line & head
    conn = f"arc3,rad={rad}" if rad != 0.0 else "arc3,rad=0.0"
    arrow = FancyArrowPatch((x1, y1), (x2, y2),
                            connectionstyle=conn,
                            arrowstyle='-|>', mutation_scale=15,
                            color=color, lw=2.2, zorder=6)
    ax.add_patch(arrow)
    
    # 3. Clean halo text label (never obscures boxes)
    if label_text:
        mx, my = (x1 + x2)/2.0, (y1 + y2)/2.0
        if rad != 0.0:
            my += rad * 0.40
        
        if label_side == 'top':
            tx = ax.text(mx, my + label_offset, label_text,
                         ha='center', va='bottom', fontsize=6.4, fontweight='bold',
                         color=color, linespacing=1.05, zorder=9)
        elif label_side == 'bottom':
            tx = ax.text(mx, my - label_offset, label_text,
                         ha='center', va='top', fontsize=6.4, fontweight='bold',
                         color=color, linespacing=1.05, zorder=9)
        elif label_side == 'right':
            tx = ax.text(mx + label_offset, my, label_text,
                         ha='left', va='center', fontsize=6.4, fontweight='bold',
                         color=color, linespacing=1.05, zorder=9)
        elif label_side == 'left':
            tx = ax.text(mx - label_offset, my, label_text,
                         ha='right', va='center', fontsize=6.4, fontweight='bold',
                         color=color, linespacing=1.05, zorder=9)
        else:
            tx = ax.text(mx, my, label_text,
                         ha='center', va='center', fontsize=6.4, fontweight='bold',
                         color=color, linespacing=1.05, zorder=9)
            
        tx.set_path_effects([pe.withStroke(linewidth=3.0, foreground='#FFFFFF')])

# ==========================================
# 4. PANEL A: FLOWCHART GEOMETRY & RENDERING
# ==========================================

# ----------------- BAND 1: ROW 1 (Left to Right) -----------------
Y1 = 7.20
H1 = 0.72

# 1. Disaster Event Trigger (Stadium)
CX1, W1 = 1.45, 1.30
draw_stadium(ax, CX1, Y1, W1, H1,
             bg_color='#DCFCE7', border_color='#16A34A',
             title="DISASTER TRIGGER", subtitle="(Satellite Alert / Event)",
             title_color='#14532D', sub_color='#15803D')

# 2. Satellite Intake (Parallelogram)
CX2, W2 = 3.50, 1.40
draw_parallelogram(ax, CX2, Y1, W2, H1, slant=0.10,
                   bg_color='#F3E8FF', border_color='#9333EA',
                   title="1. SATELLITE INTAKE", subtitle="Sentinel-1 SAR (VV/VH)\nSentinel-2 / xBD Optical",
                   title_color='#581C87', sub_color='#6B21A8', t_fs=7.0)

# Link 1 -> 2
draw_flow_link(ax, CX1 + W1/2.0, Y1, CX2 - W2/2.0 - 0.04, Y1, color='#16A34A')

# 3. Dual-Stream AI (Process Box)
CX3, W3 = 5.65, 1.40
draw_process_box(ax, CX3, Y1, W3, H1,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="2. DUAL-STREAM AI", subtitle="Flood U-Net (Radar Water)\nxBD Damage Ensembles",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=7.1)

# Link 2 -> 3 (Label: Raw Tensors)
draw_flow_link(ax, CX2 + W2/2.0 + 0.04, Y1, CX3 - W3/2.0, Y1, color='#9333EA',
               label_text="Raw Tensors", label_side='top', label_offset=0.10)

# 4. Temporal Analysis (Process Box)
CX4, W4 = 7.80, 1.40
draw_process_box(ax, CX4, Y1, W4, H1,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="3. TEMPORAL ANALYSIS", subtitle="M_new = M_post \\ M_pre\nFilters Baseline Water",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=6.7)

# Link 3 -> 4 (Label: Masks)
draw_flow_link(ax, CX3 + W3/2.0, Y1, CX4 - W4/2.0, Y1, color='#0284C7',
               label_text="Masks", label_side='top', label_offset=0.10)

# 5. Multimodal Fusion (Process Box)
CX5, W5 = 9.95, 1.40
draw_process_box(ax, CX5, Y1, W5, H1,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="4. MULTIMODAL FUSION", subtitle="Ri = 0.50·Ei + 0.50·Si\nBuilding Footprint Scoring",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=6.7)

# Link 4 -> 5 (Label: M_new)
draw_flow_link(ax, CX4 + W4/2.0, Y1, CX5 - W5/2.0, Y1, color='#0284C7',
               label_text="M_new", label_side='top', label_offset=0.10)

# 6. Hazard Detected Diamond
CX6, W6, H6 = 11.95, 1.35, 0.90
draw_decision_diamond(ax, CX6, Y1, W6, H6,
                      bg_color='#FFEDD5', border_color='#EA580C',
                      title_lines="HAZARD\nDETECTED?", subtitle="(Ri > 0 or Flood?)",
                      title_color='#9A3412', sub_color='#C2410C')

# Link 5 -> 6 (Label: Ri Scores)
draw_flow_link(ax, CX5 + W5/2.0, Y1, CX6 - W6/2.0, Y1, color='#0284C7',
               label_text="Ri Scores", label_side='top', label_offset=0.10)

# Safe Exit: No Hazard Report (Below Diamond 6)
CY_NH = 5.65
draw_stadium(ax, CX6, CY_NH, 1.30, 0.65,
             bg_color='#DCFCE7', border_color='#16A34A',
             title="NO HAZARD REPORT", subtitle="(Routine Monitoring / Safe)",
             title_color='#14532D', sub_color='#15803D')

# Link 6 -> No Hazard (Branch: No Risk)
draw_flow_link(ax, CX6, Y1 - H6/2.0, CX6, CY_NH + 0.65/2.0, color='#16A34A',
               label_text="No Risk", label_side='right', label_offset=0.10)


# ----------------- BAND 2: ROW 2 (Right to Left) -----------------
# Risk Triage Level Diamond
CX7, CY7, W7, H7 = 9.95, 4.65, 1.35, 0.90
draw_decision_diamond(ax, CX7, CY7, W7, H7,
                      bg_color='#FFEDD5', border_color='#EA580C',
                      title_lines="RISK TRIAGE\nLEVEL?", subtitle="Check Ri Threshold",
                      title_color='#9A3412', sub_color='#C2410C')

# Link 6 -> 7 (Hazard Verified: curves down-left from diamond 6 into diamond 7)
draw_flow_link(ax, CX6 - W6/2.0 + 0.10, Y1 - 0.28, CX7 + 0.20, CY7 + H7/2.0,
               color='#EA580C', label_text="Hazard Verified", label_side='top', label_offset=0.10, rad=-0.22)

# Two Directives to the Left of Diamond 7:
# 5A. Rescue Directive (Top: Ri >= 0.50)
CX_RD, CY_RD, W_RD, H_RD = 7.35, 5.25, 1.85, 0.64
draw_parallelogram(ax, CX_RD, CY_RD, W_RD, H_RD, slant=0.12,
                   bg_color='#F3E8FF', border_color='#9333EA',
                   title="5. RESCUE DIRECTIVE", subtitle="Immediate Waterborne Rescue\nStructural Safety Assessment",
                   title_color='#581C87', sub_color='#6B21A8', t_fs=7.2)

# Link 7 -> Rescue Directive (Branch: Ri >= 0.50)
draw_flow_link(ax, CX7 - W7/2.0, CY7 + 0.15, CX_RD + W_RD/2.0 + 0.04, CY_RD,
               color='#9333EA', label_text="Ri >= 0.50\n(High/Critical)", label_side='top', label_offset=0.10)

# 5B. Welfare / Routine (Bottom: Ri < 0.50)
CX_WF, CY_WF, W_WF, H_WF = 7.35, 4.05, 1.85, 0.64
draw_parallelogram(ax, CX_WF, CY_WF, W_WF, H_WF, slant=0.12,
                   bg_color='#F3E8FF', border_color='#9333EA',
                   title="WELFARE / ROUTINE", subtitle="Priority Welfare Check (Ri >= 0.25)\nRoutine Monitoring (Ri < 0.25)",
                   title_color='#581C87', sub_color='#6B21A8', t_fs=7.2)

# Link 7 -> Welfare / Routine (Branch: Ri < 0.50)
draw_flow_link(ax, CX7 - W7/2.0, CY7 - 0.15, CX_WF + W_WF/2.0 + 0.04, CY_WF,
               color='#9333EA', label_text="Ri < 0.50", label_side='bottom', label_offset=0.09)

# 6. Task Generation (Left of Directives)
CX8, CY8, W8, H8 = 4.45, 4.65, 1.85, 0.85
draw_process_box(ax, CX8, CY8, W8, H8,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="6. TASK GENERATION", subtitle="303 Building Directives\nPersonnel & Gear Specs",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=7.6)

# Links from Directives into Task Generation
draw_flow_link(ax, CX_RD - W_RD/2.0 - 0.04, CY_RD, CX8 + W8/2.0, CY8 + 0.18,
               color='#9333EA', label_text="Task Specs", label_side='top', label_offset=0.09)

draw_flow_link(ax, CX_WF - W_WF/2.0 - 0.04, CY_WF, CX8 + W8/2.0, CY8 - 0.18,
               color='#9333EA', label_text="All 303 Tasks", label_side='bottom', label_offset=0.09)

# 7. Dispatch Engine (Far Left of Row 2)
CX9, CY9, W9, H9 = 1.65, 4.65, 1.90, 0.85
draw_process_box(ax, CX9, CY9, W9, H9,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="7. DISPATCH ENGINE", subtitle="Greedy 18-Squad Optimization\nS_alloc = 0.4P + 0.35C + 0.25D",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=7.6)

# Link 6 -> 7 (Flowing left)
draw_flow_link(ax, CX8 - W8/2.0, CY8, CX9 + W9/2.0, CY9, color='#0284C7',
               label_text="Pending Tasks", label_side='top', label_offset=0.09)


# ----------------- BAND 3: ROW 3 (Left to Right) -----------------
# Squad Match & Available Diamond (Directly below Dispatch Engine)
CX10, CY10, W10, H10 = 1.65, 2.55, 1.40, 0.90
draw_decision_diamond(ax, CX10, CY10, W10, H10,
                      bg_color='#FFEDD5', border_color='#EA580C',
                      title_lines="SQUAD MATCH\n& AVAILABLE?", subtitle="1:1 Capacity Check",
                      title_color='#9A3412', sub_color='#C2410C')

# Link 7 -> 10 (Straight down)
draw_flow_link(ax, CX9, CY9 - H9/2.0, CX10, CY10 + H10/2.0, color='#EA580C')

# Deficit Backlog (Below main track at bottom)
CX_DB, CY_DB, W_DB, H_DB = 3.55, 1.35, 1.85, 0.65
draw_parallelogram(ax, CX_DB, CY_DB, W_DB, H_DB, slant=0.12,
                   bg_color='#F3E8FF', border_color='#9333EA',
                   title="DEFICIT BACKLOG", subtitle="Standby Unassigned Queue\nMutual-Aid Escalation",
                   title_color='#581C87', sub_color='#6B21A8', t_fs=7.2)

# Link 10 -> Deficit Backlog (Branch: Squad Shortage)
draw_flow_link(ax, CX10 + 0.25, CY10 - H10/2.0 + 0.10, CX_DB - W_DB/2.0 - 0.04, CY_DB,
               color='#EA580C', label_text="Squad Shortage\n(Unmatched)", label_side='top', label_offset=0.09, rad=-0.14)

# 8. GIS Command UI
CX11, CY11, W11, H11 = 5.60, 2.55, 1.90, 0.85
draw_process_box(ax, CX11, CY11, W11, H11,
                 bg_color='#E0F2FE', border_color='#0284C7',
                 title="8. GIS COMMAND UI", subtitle="React + Leaflet Map Console\nLive Vectors & Triage Dossiers",
                 title_color='#0369A1', sub_color='#0284C7', t_fs=7.6)

# Link 10 -> 11 (Branch: Team Assigned & Locked - Straight right)
draw_flow_link(ax, CX10 + W10/2.0, CY10, CX11 - W11/2.0, CY11,
               color='#16A34A', label_text="Team Assigned & Locked", label_side='top', label_offset=0.09)

# Link Deficit Backlog -> 11 (Deficit Logged: curves up-right into GIS UI)
draw_flow_link(ax, CX_DB + W_DB/2.0 + 0.04, CY_DB, CX11 - 0.25, CY11 - H11/2.0,
               color='#9333EA', label_text="Deficit Logged", label_side='right', label_offset=0.08, rad=-0.18)

# Operational Report (Parallelogram)
CX12, CY12, W12, H12 = 8.65, 2.55, 1.85, 0.75
draw_parallelogram(ax, CX12, CY12, W12, H12, slant=0.14,
                   bg_color='#F3E8FF', border_color='#9333EA',
                   title="OPERATIONAL REPORT", subtitle="Printable Incident Dossier\nPDF Briefing for Responders",
                   title_color='#581C87', sub_color='#6B21A8', t_fs=7.4)

# Link 11 -> 12
draw_flow_link(ax, CX11 + W11/2.0, CY11, CX12 - W12/2.0 - 0.04, CY11, color='#0284C7',
               label_text="Mission Data", label_side='top', label_offset=0.09)

# Mission Executed (Green Stadium)
CX13, CY13, W13, H13 = 11.45, 2.55, 1.50, 0.72
draw_stadium(ax, CX13, CY13, W13, H13,
             bg_color='#DCFCE7', border_color='#16A34A',
             title="MISSION EXECUTED", subtitle="(Operations Coordinated)",
             title_color='#14532D', sub_color='#15803D')

# Link 12 -> 13
draw_flow_link(ax, CX12 + W12/2.0 + 0.04, CY12, CX13 - W13/2.0, CY13, color='#16A34A')


# ==========================================
# 5. PANEL B: SEQUENTIAL IMPLEMENTATION PROCESS (8 Steps)
# ==========================================
# 2-line descriptions guarantees 100% fit within cards with > 1.5 inches of safety margin
process_steps = [
    {
        "num": "1",
        "title": "1. Ingestion & Pre-Disaster Trigger",
        "actor": "Sensor Ingest",
        "color": "#2563EB", "border": "#3B82F6", "bg": "#EFF6FF",
        "actor_color": "#1D4ED8", "actor_bg": "#DBEAFE",
        "desc": "Automated intake of Sentinel-1 SAR (VV/VH)\nand Sentinel-2 optical multi-band GeoTIFFs."
    },
    {
        "num": "2",
        "title": "2. Dual-Stream AI Perception",
        "actor": "FastAPI AI",
        "color": "#7C3AED", "border": "#8B5CF6", "bg": "#FAF5FF",
        "actor_color": "#6D28D9", "actor_bg": "#EDE9FE",
        "desc": "Dual inference via Flood U-Net (radar inundation)\nand xBD building damage classification ensembles."
    },
    {
        "num": "3",
        "title": "3. Temporal Baseline Analysis",
        "actor": "Spatial Core",
        "color": "#0D9488", "border": "#14B8A6", "bg": "#F0FDFA",
        "actor_color": "#0F766E", "actor_bg": "#CCFBF1",
        "desc": "Differential spatial analysis M_new = M_post \\ M_pre\neliminates permanent water to isolate flood zones."
    },
    {
        "num": "4",
        "title": "4. Multimodal Risk Fusion (Ri)",
        "actor": "Risk Engine",
        "color": "#EA580C", "border": "#F97316", "bg": "#FFF7ED",
        "actor_color": "#C2410C", "actor_bg": "#FFEDD5",
        "desc": "Calculates building risk score Ri = 0.50·Ei + 0.50·Si\nfusing flood depth with structural destruction."
    },
    {
        "num": "5",
        "title": "5. Risk Triage & Directive Rules",
        "actor": "Triage Core",
        "color": "#DC2626", "border": "#EF4444", "bg": "#FEF2F2",
        "actor_color": "#B91C1C", "actor_bg": "#FEE2E2",
        "desc": "Threshold triage separates critical waterborne rescues\n(Ri >= 0.50) from routine monitoring sectors."
    },
    {
        "num": "6",
        "title": "6. 303 Building Task Directives",
        "actor": "Task Planner",
        "color": "#059669", "border": "#10B981", "bg": "#ECFDF5",
        "actor_color": "#047857", "actor_bg": "#D1FAE5",
        "desc": "Synthesizes 303 localized structural directives\nspecifying required boat, crew, and gear specs."
    },
    {
        "num": "7",
        "title": "7. 18-Squad Fleet Optimization",
        "actor": "Dispatch Core",
        "color": "#D97706", "border": "#F59E0B", "bg": "#FFFBEB",
        "actor_color": "#B45309", "actor_bg": "#FEF3C7",
        "desc": "Greedy 18-squad allocation (S_alloc = 0.4P + 0.35C + 0.25D);\nunmatched cases route to deficit escalation backlog."
    },
    {
        "num": "8",
        "title": "8. GIS Tracking & Mission Close",
        "actor": "Rescue Teams",
        "color": "#0F172A", "border": "#475569", "bg": "#F8FAFC",
        "actor_color": "#0F172A", "actor_bg": "#E2E8F0",
        "desc": "React Leaflet console tracks operations live,\nexports PDF briefing dossiers, and logs resolution."
    }
]

STEP_X = PANEL_B_X + 0.25
STEP_W = PANEL_B_W - 0.50  # 5.25 inches
STEP_H = 0.76
STEP_GAP = 0.11
STEP_START_Y = PANEL_Y - 0.74

for idx, s in enumerate(process_steps):
    sy = STEP_START_Y - idx * (STEP_H + STEP_GAP)
    
    # Step Card Container
    scard = FancyBboxPatch((STEP_X, sy - STEP_H), STEP_W, STEP_H,
                           boxstyle="round,pad=0.02,rounding_size=0.12",
                           facecolor=s['bg'], edgecolor=s['border'], lw=1.6, zorder=4)
    ax.add_patch(scard)
    
    # Left accent bar
    acc_bar = FancyBboxPatch((STEP_X, sy - STEP_H), 0.10, STEP_H,
                             boxstyle="square,pad=0.0",
                             facecolor=s['color'], edgecolor='none', zorder=5)
    ax.add_patch(acc_bar)
    
    # Number Circle
    circ_cx = STEP_X + 0.38
    circ_cy = sy - STEP_H / 2.0
    c_num = Circle((circ_cx, circ_cy), 0.20, facecolor=s['color'], edgecolor='none', zorder=5)
    ax.add_patch(c_num)
    ax.text(circ_cx, circ_cy, s['num'], ha='center', va='center',
            fontsize=10.0, fontweight='bold', color='#FFFFFF', zorder=6)
    
    # Step Title
    ax.text(STEP_X + 0.68, sy - 0.20, s['title'],
            ha='left', va='center', fontsize=9.8, fontweight='bold', color='#0F172A', zorder=5)
    
    # Actor Badge on Right Side
    act_w, act_h = 1.20, 0.25
    act_x = STEP_X + STEP_W - act_w - 0.12
    act_y = sy - 0.08 - act_h
    act_patch = FancyBboxPatch((act_x, act_y), act_w, act_h,
                               boxstyle="round,pad=0.02,rounding_size=0.08",
                               facecolor=s['actor_bg'], edgecolor=s['border'], lw=1.0, zorder=5)
    ax.add_patch(act_patch)
    ax.text(act_x + act_w/2.0, act_y + act_h/2.0, s['actor'],
            ha='center', va='center', fontsize=7.6, fontweight='bold', color=s['actor_color'], zorder=6)
    
    # Step Description (Clean 2-line layout centered in bottom half)
    ax.text(STEP_X + 0.68, sy - 0.50, s['desc'],
            ha='left', va='center', fontsize=7.6, fontweight='bold', color='#475569',
            linespacing=1.2, zorder=5)

# ==========================================
# 6. SAVE OUTPUTS (PNG & PDF)
# ==========================================
out_dir = r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures"
os.makedirs(out_dir, exist_ok=True)
png_path = os.path.join(out_dir, "proposed_solution_slide.png")
pdf_path = os.path.join(out_dir, "proposed_solution_slide.pdf")

plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.savefig(pdf_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.close()

# Also copy to artifacts directory for direct user preview
artifact_dir = r"C:\Users\Omkar Raut\.gemini\antigravity-ide\brain\1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8"
artifact_png = os.path.join(artifact_dir, "proposed_solution_slide.png")
shutil.copy2(png_path, artifact_png)

print("Generated Proposed Solution Slide (Slide 04) successfully:")
print(f"  PNG: {png_path}")
print(f"  PDF: {pdf_path}")
print(f"  Artifact: {artifact_png}")
