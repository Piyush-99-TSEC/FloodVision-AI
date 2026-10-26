import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon, FancyArrowPatch
import numpy as np
import os

# Set figure size and resolution
fig = plt.figure(figsize=(22, 13), dpi=300)
ax = fig.add_subplot(111)
ax.set_xlim(0, 22)
ax.set_ylim(0, 13)
ax.axis('off')

# Background color
fig.patch.set_facecolor('#FFFFFF')
ax.set_facecolor('#FFFFFF')

# Color Palette matching user reference:
COLOR_OVAL = '#98E4B0'       # Soft Green
COLOR_OVAL_EDGE = '#1B6A34'
COLOR_PARALLEL = '#D9C8FB'   # Soft Violet/Purple
COLOR_PARALLEL_EDGE = '#5521B5'
COLOR_RECT = '#A5F3FC'       # Soft Cyan/Light Blue
COLOR_RECT_EDGE = '#0891B2'
COLOR_DIAMOND = '#FED7AA'    # Soft Orange/Amber
COLOR_DIAMOND_EDGE = '#C2410C'

def draw_oval(x, y, w, h, title, subtitle="", fs_title=10.5, fs_sub=9.0):
    patch = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle=f"round,pad=0.06,rounding_size={h/2}",
                           facecolor=COLOR_OVAL, edgecolor=COLOR_OVAL_EDGE, linewidth=2.0, zorder=3)
    ax.add_patch(patch)
    if subtitle:
        ax.text(x, y + 0.16, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#064E3B', zorder=4)
        ax.text(x, y - 0.18, subtitle, ha='center', va='center', fontsize=fs_sub, fontweight='bold', color='#0F172A', zorder=4)
    else:
        ax.text(x, y, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#064E3B', zorder=4)

def draw_rect(x, y, w, h, title, desc="", fs_title=10.5, fs_desc=9.0):
    patch = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle="round,pad=0.04,rounding_size=0.18",
                           facecolor=COLOR_RECT, edgecolor=COLOR_RECT_EDGE, linewidth=2.0, zorder=3)
    ax.add_patch(patch)
    ax.text(x, y + 0.32, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#0E7490', zorder=4)
    if desc:
        ax.text(x, y - 0.14, desc, ha='center', va='center', fontsize=fs_desc, fontweight='bold', color='#0F172A', zorder=4, linespacing=1.28)

def draw_parallel(x, y, w, h, title, desc="", fs_title=10.5, fs_desc=9.0, skew=0.35):
    pts = np.array([
        [x - w/2 + skew, y - h/2],
        [x + w/2 + skew, y - h/2],
        [x + w/2 - skew, y + h/2],
        [x - w/2 - skew, y + h/2]
    ])
    poly = Polygon(pts, closed=True, facecolor=COLOR_PARALLEL, edgecolor=COLOR_PARALLEL_EDGE, linewidth=2.0, zorder=3)
    ax.add_patch(poly)
    ax.text(x, y + 0.30, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#4C1D95', zorder=4)
    if desc:
        ax.text(x, y - 0.16, desc, ha='center', va='center', fontsize=fs_desc, fontweight='bold', color='#1E1B4B', zorder=4, linespacing=1.28)

def draw_diamond(x, y, w, h, title, desc="", fs_title=10.0, fs_desc=9.0):
    pts = np.array([
        [x, y - h/2],
        [x + w/2, y],
        [x, y + h/2],
        [x - w/2, y]
    ])
    poly = Polygon(pts, closed=True, facecolor=COLOR_DIAMOND, edgecolor=COLOR_DIAMOND_EDGE, linewidth=2.0, zorder=3)
    ax.add_patch(poly)
    if desc:
        ax.text(x, y + 0.18, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#9A3412', zorder=4)
        ax.text(x, y - 0.18, desc, ha='center', va='center', fontsize=fs_desc, fontweight='bold', color='#431407', zorder=4)
    else:
        ax.text(x, y, title, ha='center', va='center', fontsize=fs_title, fontweight='bold', color='#9A3412', zorder=4)

def draw_arrow(x1, y1, x2, y2, label="", label_pos=(0.5, 0.14), label_fs=8.5, connectionstyle="arc3,rad=0"):
    arrow = FancyArrowPatch((x1, y1), (x2, y2),
                            arrowstyle='-|>',
                            mutation_scale=16,
                            color='#0F172A',
                            linewidth=1.8,
                            connectionstyle=connectionstyle,
                            zorder=2)
    ax.add_patch(arrow)
    if label:
        lx = x1 + (x2 - x1) * label_pos[0]
        ly = y1 + (y2 - y1) * label_pos[0] + label_pos[1]
        ax.text(lx, ly, label, ha='center', va='center', fontsize=label_fs, fontweight='bold',
                color='#0F172A', bbox=dict(boxstyle='round,pad=0.2', facecolor='#FFFFFF', edgecolor='#CBD5E1', alpha=0.95), zorder=5)

# Outer Border
border = FancyBboxPatch((0.2, 0.2), 21.6, 12.6, boxstyle="round,pad=0.1,rounding_size=0.25",
                        facecolor='none', edgecolor='#0F172A', linewidth=2.5, zorder=1)
ax.add_patch(border)

# Title Banner at Top
ax.text(11, 12.35, "Figure 3.1: System Architecture & End-to-End Operational Flowchart",
        ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
ax.text(11, 12.02, "An Explainable Deep Learning Framework for Flood Damage Assessment and Intelligent Rescue Planning",
        ha='center', va='center', fontsize=11.5, fontweight='bold', color='#334155')

# -------------------------------------------------------------
# ROW 1 (y = 10.5): INGESTION & PERCEPTION (LEFT TO RIGHT)
# -------------------------------------------------------------
# 1. Start Node
draw_oval(2.0, 10.5, 2.6, 1.25, "DISASTER EVENT\nTRIGGER", "(Satellite Alert / Pre-Disaster)")

# 2. Input Parallelogram
draw_parallel(5.3, 10.5, 3.2, 1.35, "1. SATELLITE INTAKE", "Sentinel-1 SAR (VV/VH Radar)\nSentinel-2 / xBD Optical")

# 3. Dual-Stream AI Perception (Rectangle)
draw_rect(9.0, 10.5, 3.2, 1.35, "2. DUAL-STREAM AI", "Flood U-Net (Radar Water)\nxBD Damage Ensembles")

# 4. Temporal Change Engine (Rectangle)
draw_rect(12.7, 10.5, 3.2, 1.35, "3. TEMPORAL ANALYSIS", "M_new = M_post \\ M_pre\nFilters Baseline Water")

# 5. Multimodal Risk Engine (Rectangle)
draw_rect(16.4, 10.5, 3.2, 1.35, "4. MULTIMODAL FUSION", "Ri = 0.50·Ei + 0.50·Si\nBuilding Footprint Scoring")

# 6. Decision 1: Hazard Detected? (Diamond)
draw_diamond(19.9, 10.5, 2.4, 1.45, "HAZARD\nDETECTED?", "(Ri > 0 or Flood?)")

# Arrows in Row 1
draw_arrow(3.3, 10.5, 3.7, 10.5)
draw_arrow(6.9, 10.5, 7.4, 10.5, "Raw Tensors", (0.5, 0.20))
draw_arrow(10.6, 10.5, 11.1, 10.5, "Masks", (0.5, 0.20))
draw_arrow(14.3, 10.5, 14.8, 10.5, "M_new", (0.5, 0.20))
draw_arrow(18.0, 10.5, 18.7, 10.5, "Ri Scores", (0.5, 0.20))

# Branch from Decision 1: NO -> No Hazard End Node
draw_oval(19.9, 8.3, 2.5, 1.15, "NO HAZARD REPORT", "(Routine Monitoring / Safe)")
draw_arrow(19.9, 9.775, 19.9, 8.875, "No Risk", label_pos=(0.5, 0.0))

# -------------------------------------------------------------
# ROW 2 (y = 6.2): TRIAGE & RESCUE TASK SYNTHESIS (RIGHT TO LEFT)
# -------------------------------------------------------------
# Decision 2: Urgency Triage (Diamond)
draw_diamond(16.4, 6.2, 2.8, 1.55, "RISK TRIAGE\nLEVEL?", "Check Ri Threshold")
draw_arrow(18.7, 10.5, 16.4, 6.975, "Hazard Verified", label_pos=(0.4, 0.22), connectionstyle="arc3,rad=-0.15")

# Moderate/Low Branch (Parallel)
draw_parallel(16.4, 3.9, 3.4, 1.25, "WELFARE / ROUTINE", "Priority Welfare Check (Ri >= 0.25)\nRoutine Monitoring (Ri < 0.25)")
draw_arrow(16.4, 5.425, 16.4, 4.525, "Ri < 0.50", label_pos=(0.5, 0.0))

# Critical/High Branch (Parallel)
draw_parallel(11.8, 6.2, 3.4, 1.35, "5. RESCUE DIRECTIVE", "Immediate Waterborne Rescue\nStructural Safety Assessment")
draw_arrow(15.0, 6.2, 13.5, 6.2, "Ri >= 0.50\n(High/Critical)", label_pos=(0.5, 0.28))

# Connect Welfare to Task Engine
draw_arrow(14.7, 3.9, 7.5, 5.5, "All 303 Tasks", label_pos=(0.5, 0.20), connectionstyle="arc3,rad=0.15")

# 6. Task Generation & Explainability (Rectangle)
draw_rect(7.4, 6.2, 3.3, 1.35, "6. TASK GENERATION", "303 Building Directives\nPersonnel & Gear Specs")
draw_arrow(10.1, 6.2, 9.05, 6.2, "Task Specs", label_pos=(0.5, 0.20))

# 7. Allocation Engine (Rectangle)
draw_rect(3.0, 6.2, 3.3, 1.35, "7. DISPATCH ENGINE", "Greedy 18-Squad Optimization\nS_alloc = 0.4P + 0.35C + 0.25D")
draw_arrow(5.75, 6.2, 4.65, 6.2, "Pending Tasks", label_pos=(0.5, 0.20))

# -------------------------------------------------------------
# ROW 3 (y = 2.0): DISPATCH, DEFICIT QUEUE & CLOSURE (LEFT TO RIGHT)
# -------------------------------------------------------------
# Decision 3: Squad Available & Matched? (Diamond)
draw_diamond(3.0, 2.2, 2.8, 1.55, "SQUAD MATCH\n& AVAILABLE?", "1:1 Capacity Check")
draw_arrow(3.0, 5.525, 3.0, 2.975)

# Branch: No -> Mutual-Aid Deficit Queue
draw_parallel(7.4, 1.4, 3.1, 1.25, "DEFICIT BACKLOG", "Standby Unassigned Queue\nMutual-Aid Escalation")
draw_arrow(3.8, 1.6, 5.85, 1.4, "Squad Shortage\n(Unmatched)", label_pos=(0.5, -0.32), connectionstyle="arc3,rad=-0.08")

# Branch: Yes -> Command GIS Interface
draw_rect(11.8, 2.2, 3.3, 1.35, "8. GIS COMMAND UI", "React + Leaflet Map Console\nLive Vectors & Triage Dossiers")
draw_arrow(4.4, 2.2, 10.15, 2.2, "Team Assigned & Locked", label_pos=(0.5, 0.22))

# From Deficit to GIS UI
draw_arrow(8.95, 1.4, 10.15, 1.9, "Deficit Logged", label_pos=(0.5, 0.16))

# 9. Assessment & PDF Report (Parallel)
draw_parallel(16.4, 2.2, 3.2, 1.25, "OPERATIONAL REPORT", "Printable Incident Dossier\nPDF Briefing for Responders")
draw_arrow(13.45, 2.2, 14.8, 2.2, "Mission Data", label_pos=(0.5, 0.20))

# 10. End Node
draw_oval(19.9, 2.2, 2.5, 1.15, "MISSION EXECUTED", "(Operations Coordinated)")
draw_arrow(18.0, 2.2, 18.65, 2.2)

# Save figure to research-content/figures/
os.makedirs("research-content/figures", exist_ok=True)
out_path = "research-content/figures/fig_3_1_system_architecture_flowchart.png"
plt.savefig(out_path, bbox_inches='tight', dpi=300)
plt.close()
print(f"Bolder flowchart successfully generated at: {out_path}")
