import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch
import textwrap
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
ax.text(0.65, 9.78, "Impact & Benefits",
        fontsize=35, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (07)
num_box = FancyBboxPatch((17.65, 9.58), 0.90, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(18.10, 9.855, "07", ha='center', va='center',
        fontsize=15.5, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.65, 18.55], [9.32, 9.32], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Context Statement
ax.text(0.65, 8.95,
        "Dual-Dimension Evaluation: Multi-Stakeholder Operational Impact & Environmental, Social, and Governance (ESG) Framework Based Benefits",
        fontsize=13.0, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. LEFT SECTION: ROLE-BASED IMPACT (SPOKE & HUB)
# ==========================================
LEFT_X = 0.65
LEFT_Y = 8.65
LEFT_W = 11.85
LEFT_H = 7.75

left_shadow = FancyBboxPatch((LEFT_X + 0.05, LEFT_Y - LEFT_H - 0.05), LEFT_W, LEFT_H,
                             boxstyle="round,pad=0.02,rounding_size=0.16",
                             facecolor='#94A3B8', edgecolor='none', alpha=0.15, zorder=2)
ax.add_patch(left_shadow)

left_card = FancyBboxPatch((LEFT_X, LEFT_Y - LEFT_H), LEFT_W, LEFT_H,
                           boxstyle="round,pad=0.02,rounding_size=0.16",
                           facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.4, zorder=3)
ax.add_patch(left_card)

# Section Header inside Left Container
ax.text(LEFT_X + 0.35, LEFT_Y - 0.36, "MULTI-STAKEHOLDER OPERATIONAL IMPACT",
        ha='left', va='center', fontsize=12.2, fontweight='bold', color='#0F172A', zorder=5)
ax.text(LEFT_X + 0.35, LEFT_Y - 0.62,
        "Targeted operational enhancements delivered across critical disaster relief, command, and community entities",
        ha='left', va='center', fontsize=8.0, fontweight='normal', color='#64748B', zorder=5)

# Coordinates for Central Hub
HUB_X = LEFT_X + LEFT_W / 2.0  # 6.575
HUB_Y = LEFT_Y - 4.15           # 4.50
HUB_R = 1.05

# 6 Roles Data (3 Left, 3 Right)
roles_left = [
    {
        "title": "Tactical Rescue Squads",
        "tag": "NDRF / USAR",
        "badge_bg": "#FEE2E2", "badge_col": "#DC2626", "badge_bdr": "#FCA5A5",
        "bar_col": "#DC2626",
        "bullets": [
            ("Hazard-Aware GPS Routes: ", "Steers inflatable boats & amphibious craft away from fast-moving flash currents and submerged debris."),
            ("Building Entrapment Triage: ", "Replaces blind sweeps with deterministic building risk scores (Ri) to rescue trapped victims first.")
        ]
    },
    {
        "title": "Disaster Command Center",
        "tag": "NDMA / SDMA",
        "badge_bg": "#DBEAFE", "badge_col": "#1D4ED8", "badge_bdr": "#93C5FD",
        "bar_col": "#2563EB",
        "bullets": [
            ("Unified GIS Dashboard: ", "Fuses cloud-penetrating SAR flood extent with optical building footprints in a single live operational pane."),
            ("Automated Squad Tasking: ", "Generates auditable digital rescue tickets with verifiable satellite metrics for multi-agency sync.")
        ]
    },
    {
        "title": "Stranded Communities",
        "tag": "LOCAL CITIZENS",
        "badge_bg": "#CCFBF1", "badge_col": "#0D9488", "badge_bdr": "#5EEAD4",
        "bar_col": "#0D9488",
        "bullets": [
            ("Rapid Enclave Localization: ", "Discovers isolated dwellings obscured by dense cloud cover or night storms within hours."),
            ("Equitable Life Triage: ", "Impartial algorithmic scoring guarantees remote rural and informal settlements receive equal priority.")
        ]
    }
]

roles_right = [
    {
        "title": "Emergency Medical (EMS)",
        "tag": "FIELD HOSPITALS",
        "badge_bg": "#FEF3C7", "badge_col": "#B45309", "badge_bdr": "#FCD34D",
        "bar_col": "#D97706",
        "bullets": [
            ("Predictive Casualty Influx: ", "Estimates emergency surgical and trauma loads directly from structural damage levels (Si)."),
            ("Clinic Inundation Alerts: ", "Monitors rising flood corridors threatening primary healthcare centers, oxygen units, and power grids.")
        ]
    },
    {
        "title": "Municipal Infrastructure",
        "tag": "UTILITIES / PWD",
        "badge_bg": "#D1FAE5", "badge_col": "#047857", "badge_bdr": "#6EE7B7",
        "bar_col": "#059669",
        "bullets": [
            ("Critical Lifeline Monitoring: ", "Detects breached levees, inundated electrical substations, washed causeways, and blocked arterials."),
            ("Secondary Collapse Warning: ", "Flags compromised structures vulnerable to waterlogged foundation failure and imminent collapse.")
        ]
    },
    {
        "title": "Humanitarian Relief NGOs",
        "tag": "RED CROSS / OCHA",
        "badge_bg": "#EDE9FE", "badge_col": "#6D28D9", "badge_bdr": "#C4B5FD",
        "bar_col": "#7C3AED",
        "bullets": [
            ("Targeted Supply Routing: ", "Directs drinking water, food packets, and medical kits straight to verified stranded clusters."),
            ("Transparent Relief Accounting: ", "Prevents aid hoarding and misallocation through tamper-resistant geospatial delivery logs.")
        ]
    }
]

# Card Dimensions
COL_CARD_W = 3.65
COL_CARD_H = 1.95
Y_START = LEFT_Y - 0.85
ROW_GAP = 0.35

# Draw Left Cards
for i, r_data in enumerate(roles_left):
    cx = LEFT_X + 0.35
    cy = Y_START - i * (COL_CARD_H + ROW_GAP)
    
    # Shadow & Card
    s = FancyBboxPatch((cx + 0.03, cy - COL_CARD_H - 0.03), COL_CARD_W, COL_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.10",
                       facecolor='#94A3B8', edgecolor='none', alpha=0.12, zorder=3)
    ax.add_patch(s)
    c = FancyBboxPatch((cx, cy - COL_CARD_H), COL_CARD_W, COL_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.10",
                       facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.1, zorder=4)
    ax.add_patch(c)
    
    # Left vertical accent line
    acc = FancyBboxPatch((cx, cy - COL_CARD_H), 0.08, COL_CARD_H,
                         boxstyle="square,pad=0.0",
                         facecolor=r_data['bar_col'], edgecolor='none', zorder=5)
    ax.add_patch(acc)
    
    # Header Title
    ax.text(cx + 0.18, cy - 0.25, r_data['title'],
            ha='left', va='center', fontsize=9.2, fontweight='bold', color='#0F172A', zorder=6)
    
    # Tag Badge
    tw = 1.25
    th = 0.22
    tx = cx + COL_CARD_W - tw - 0.14
    ty = cy - 0.14 - th
    tp = FancyBboxPatch((tx, ty), tw, th,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=r_data['badge_bg'], edgecolor=r_data['badge_bdr'], lw=0.9, zorder=5)
    ax.add_patch(tp)
    ax.text(tx + tw/2.0, ty + th/2.0, r_data['tag'],
            ha='center', va='center', fontsize=6.2, fontweight='bold', color=r_data['badge_col'], zorder=6)
    
    # Divider line inside card
    ax.plot([cx + 0.18, cx + COL_CARD_W - 0.14], [cy - 0.42, cy - 0.42], color='#E2E8F0', lw=0.8, zorder=5)
    
    # Bullet 1
    b1_lead, b1_body = r_data['bullets'][0]
    ax.plot([cx + 0.20], [cy - 0.58], marker='o', markersize=3.0, color=r_data['bar_col'], zorder=6)
    ax.text(cx + 0.30, cy - 0.58, b1_lead,
            ha='left', va='center', fontsize=7.2, fontweight='bold', color='#0F172A', zorder=6)
    w_b1 = textwrap.fill(b1_body, width=54)
    ax.text(cx + 0.30, cy - 0.76, w_b1,
            ha='left', va='top', fontsize=6.8, fontweight='normal', color='#475569',
            linespacing=1.2, zorder=6)
    
    # Bullet 2
    b2_lead, b2_body = r_data['bullets'][1]
    ax.plot([cx + 0.20], [cy - 1.25], marker='o', markersize=3.0, color=r_data['bar_col'], zorder=6)
    ax.text(cx + 0.30, cy - 1.25, b2_lead,
            ha='left', va='center', fontsize=7.2, fontweight='bold', color='#0F172A', zorder=6)
    w_b2 = textwrap.fill(b2_body, width=54)
    ax.text(cx + 0.30, cy - 1.43, w_b2,
            ha='left', va='top', fontsize=6.8, fontweight='normal', color='#475569',
            linespacing=1.2, zorder=6)

# Draw Right Cards
for i, r_data in enumerate(roles_right):
    cx = LEFT_X + LEFT_W - COL_CARD_W - 0.35
    cy = Y_START - i * (COL_CARD_H + ROW_GAP)
    
    # Shadow & Card
    s = FancyBboxPatch((cx + 0.03, cy - COL_CARD_H - 0.03), COL_CARD_W, COL_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.10",
                       facecolor='#94A3B8', edgecolor='none', alpha=0.12, zorder=3)
    ax.add_patch(s)
    c = FancyBboxPatch((cx, cy - COL_CARD_H), COL_CARD_W, COL_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.10",
                       facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.1, zorder=4)
    ax.add_patch(c)
    
    # Left vertical accent line
    acc = FancyBboxPatch((cx, cy - COL_CARD_H), 0.08, COL_CARD_H,
                         boxstyle="square,pad=0.0",
                         facecolor=r_data['bar_col'], edgecolor='none', zorder=5)
    ax.add_patch(acc)
    
    # Header Title
    ax.text(cx + 0.18, cy - 0.25, r_data['title'],
            ha='left', va='center', fontsize=9.2, fontweight='bold', color='#0F172A', zorder=6)
    
    # Tag Badge
    tw = 1.30
    th = 0.22
    tx = cx + COL_CARD_W - tw - 0.14
    ty = cy - 0.14 - th
    tp = FancyBboxPatch((tx, ty), tw, th,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=r_data['badge_bg'], edgecolor=r_data['badge_bdr'], lw=0.9, zorder=5)
    ax.add_patch(tp)
    ax.text(tx + tw/2.0, ty + th/2.0, r_data['tag'],
            ha='center', va='center', fontsize=6.0, fontweight='bold', color=r_data['badge_col'], zorder=6)
    
    # Divider line inside card
    ax.plot([cx + 0.18, cx + COL_CARD_W - 0.14], [cy - 0.42, cy - 0.42], color='#E2E8F0', lw=0.8, zorder=5)
    
    # Bullet 1
    b1_lead, b1_body = r_data['bullets'][0]
    ax.plot([cx + 0.20], [cy - 0.58], marker='o', markersize=3.0, color=r_data['bar_col'], zorder=6)
    ax.text(cx + 0.30, cy - 0.58, b1_lead,
            ha='left', va='center', fontsize=7.2, fontweight='bold', color='#0F172A', zorder=6)
    w_b1 = textwrap.fill(b1_body, width=54)
    ax.text(cx + 0.30, cy - 0.76, w_b1,
            ha='left', va='top', fontsize=6.8, fontweight='normal', color='#475569',
            linespacing=1.2, zorder=6)
    
    # Bullet 2
    b2_lead, b2_body = r_data['bullets'][1]
    ax.plot([cx + 0.20], [cy - 1.25], marker='o', markersize=3.0, color=r_data['bar_col'], zorder=6)
    ax.text(cx + 0.30, cy - 1.25, b2_lead,
            ha='left', va='center', fontsize=7.2, fontweight='bold', color='#0F172A', zorder=6)
    w_b2 = textwrap.fill(b2_body, width=54)
    ax.text(cx + 0.30, cy - 1.43, w_b2,
            ha='left', va='top', fontsize=6.8, fontweight='normal', color='#475569',
            linespacing=1.2, zorder=6)

# ==========================================
# CENTRAL CIRCULAR BALL (PROPOSED SYSTEM)
# ==========================================
# Outer Glow Halos (Light soft blue)
for r_halo, alpha_h in [(HUB_R + 0.18, 0.25), (HUB_R + 0.08, 0.40)]:
    h_circ = Circle((HUB_X, HUB_Y), r_halo, facecolor='#DBEAFE', edgecolor='none', alpha=alpha_h, zorder=4)
    ax.add_patch(h_circ)

# Main Circle Ball (Light color: soft light blue #EFF6FF)
hub_ball = Circle((HUB_X, HUB_Y), HUB_R, facecolor='#EFF6FF', edgecolor='#2563EB', lw=2.2, zorder=6)
ax.add_patch(hub_ball)

# Inner dashed accent ring
inner_ring = Circle((HUB_X, HUB_Y), HUB_R - 0.10, facecolor='none', edgecolor='#93C5FD', lw=1.2, ls='--', zorder=7)
ax.add_patch(inner_ring)

# Vector Checkmark Icon at top of ball
chk_cx = HUB_X
chk_cy = HUB_Y + 0.38
icon_bg = Circle((chk_cx, chk_cy), 0.22, facecolor='#2563EB', edgecolor='#60A5FA', lw=1.2, zorder=8)
ax.add_patch(icon_bg)

chk_x = [chk_cx - 0.09, chk_cx - 0.02, chk_cx + 0.09]
chk_y = [chk_cy + 0.01, chk_cy - 0.06, chk_cy + 0.07]
ax.plot(chk_x, chk_y, color='#FFFFFF', lw=2.6, solid_capstyle='round', solid_joinstyle='round', zorder=9)

# Ball Text Content: Just PROPOSED SYSTEM
ax.text(HUB_X, HUB_Y - 0.08, "PROPOSED", ha='center', va='center',
        fontsize=14.0, fontweight='bold', color='#0F172A', zorder=8)
ax.text(HUB_X, HUB_Y - 0.34, "SYSTEM", ha='center', va='center',
        fontsize=14.0, fontweight='bold', color='#1D4ED8', zorder=8)

# Connective Directional Arrows (Hub -> 6 Role Cards)
left_card_edge_x = LEFT_X + 0.35 + COL_CARD_W    # 4.65
right_card_edge_x = LEFT_X + LEFT_W - COL_CARD_W - 0.35  # 8.50

arrow_targets_left = [
    (left_card_edge_x, Y_START - 0 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_left[0]['bar_col']),
    (left_card_edge_x, Y_START - 1 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_left[1]['bar_col']),
    (left_card_edge_x, Y_START - 2 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_left[2]['bar_col'])
]

arrow_targets_right = [
    (right_card_edge_x, Y_START - 0 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_right[0]['bar_col']),
    (right_card_edge_x, Y_START - 1 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_right[1]['bar_col']),
    (right_card_edge_x, Y_START - 2 * (COL_CARD_H + ROW_GAP) - COL_CARD_H / 2.0, roles_right[2]['bar_col'])
]

# Draw Arrows to Left Cards
for tx, ty, col_arr in arrow_targets_left:
    dx = tx - HUB_X
    dy = ty - HUB_Y
    dist = np.hypot(dx, dy)
    sx = HUB_X + (dx / dist) * (HUB_R + 0.04)
    sy = HUB_Y + (dy / dist) * (HUB_R + 0.04)
    
    arrow = FancyArrowPatch((sx, sy), (tx, ty),
                            connectionstyle="arc3,rad=0.0",
                            arrowstyle='->,head_width=0.22,head_length=0.28',
                            color=col_arr, lw=2.2, zorder=5)
    ax.add_patch(arrow)

# Draw Arrows to Right Cards
for tx, ty, col_arr in arrow_targets_right:
    dx = tx - HUB_X
    dy = ty - HUB_Y
    dist = np.hypot(dx, dy)
    sx = HUB_X + (dx / dist) * (HUB_R + 0.04)
    sy = HUB_Y + (dy / dist) * (HUB_R + 0.04)
    
    arrow = FancyArrowPatch((sx, sy), (tx, ty),
                            connectionstyle="arc3,rad=0.0",
                            arrowstyle='->,head_width=0.22,head_length=0.28',
                            color=col_arr, lw=2.2, zorder=5)
    ax.add_patch(arrow)

# ==========================================
# 3. RIGHT SECTION: ESG BENEFITS
# ==========================================
RIGHT_X = 12.80
RIGHT_Y = 8.65
RIGHT_W = 5.75
RIGHT_H = 7.75

right_shadow = FancyBboxPatch((RIGHT_X + 0.05, RIGHT_Y - RIGHT_H - 0.05), RIGHT_W, RIGHT_H,
                              boxstyle="round,pad=0.02,rounding_size=0.16",
                              facecolor='#94A3B8', edgecolor='none', alpha=0.15, zorder=2)
ax.add_patch(right_shadow)

right_card = FancyBboxPatch((RIGHT_X, RIGHT_Y - RIGHT_H), RIGHT_W, RIGHT_H,
                            boxstyle="round,pad=0.02,rounding_size=0.16",
                            facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.4, zorder=3)
ax.add_patch(right_card)

# Section Header inside Right Container
ax.text(RIGHT_X + 0.35, RIGHT_Y - 0.36, "ESG BENEFITS",
        ha='left', va='center', fontsize=12.2, fontweight='bold', color='#0F172A', zorder=5)
ax.text(RIGHT_X + 0.35, RIGHT_Y - 0.62,
        "Alignment with Environmental, Social, and Governance global sustainability criteria",
        ha='left', va='center', fontsize=8.0, fontweight='normal', color='#64748B', zorder=5)

esg_cards = [
    {
        "letter": "E",
        "title": "ENVIRONMENT",
        "sub": "Hydrological Dynamics & Eco-Protection",
        "color": "#059669", "bg": "#ECFDF5", "bdr": "#A7F3D0", "circle_bg": "#059669",
        "bullets": [
            ("Dynamic Hydrological Mapping: ", "Delineates standing water vs newly intruded flood expansion across sensitive wetland basins."),
            ("Carbon-Optimized Deployment: ", "Replaces blind search sweeps with direct GPS triage, cutting unnecessary boat & helicopter fuel burn.")
        ]
    },
    {
        "letter": "S",
        "title": "SOCIAL",
        "sub": "Humanitarian Equity & Life Preservation",
        "color": "#7C3AED", "bg": "#F5F3FF", "bdr": "#DDD6FE", "circle_bg": "#7C3AED",
        "bullets": [
            ("Unbiased Life-Saving Priority: ", "Objective algorithmic risk scoring eliminates socioeconomic and demographic favoritism in aid allocation."),
            ("First-Responder Hazard Safety: ", "Warns rescue crews of severely collapsed structures (Class 3) before squads enter dangerous collapse zones.")
        ]
    },
    {
        "letter": "G",
        "title": "GOVERNANCE",
        "sub": "Transparent Explainability & Public Trust",
        "color": "#D97706", "bg": "#FFFBEB", "bdr": "#FDE68A", "circle_bg": "#D97706",
        "bullets": [
            ("100% Explainable AI (Grad-CAM): ", "Saliency heatmaps demystify deep learning inference for civilian commanders and oversight boards."),
            ("Auditable Mathematical Standards: ", "Deterministic formula (Ri = 0.5Ei + 0.5Si) and timestamped GIS incident logs ensure public trust.")
        ]
    }
]

ESG_CARD_W = RIGHT_W - 0.70
ESG_CARD_H = 2.10
ESG_Y_START = RIGHT_Y - 0.85
ESG_GAP = 0.22

for j, esg in enumerate(esg_cards):
    cy = ESG_Y_START - j * (ESG_CARD_H + ESG_GAP)
    cx = RIGHT_X + 0.35
    
    # Shadow & Card
    s = FancyBboxPatch((cx + 0.03, cy - ESG_CARD_H - 0.03), ESG_CARD_W, ESG_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.12",
                       facecolor='#94A3B8', edgecolor='none', alpha=0.12, zorder=3)
    ax.add_patch(s)
    c = FancyBboxPatch((cx, cy - ESG_CARD_H), ESG_CARD_W, ESG_CARD_H,
                       boxstyle="round,pad=0.01,rounding_size=0.12",
                       facecolor=esg['bg'], edgecolor=esg['bdr'], lw=1.2, zorder=4)
    ax.add_patch(c)
    
    # Left Circle with Letter E, S, G
    circle_x = cx + 0.36
    circle_y = cy - 0.36
    c_letter = Circle((circle_x, circle_y), 0.22, facecolor=esg['circle_bg'], edgecolor='none', zorder=5)
    ax.add_patch(c_letter)
    ax.text(circle_x, circle_y, esg['letter'], ha='center', va='center',
            fontsize=12.0, fontweight='bold', color='#FFFFFF', zorder=6)
    
    # Header Title & Sub
    ax.text(cx + 0.68, cy - 0.28, esg['title'],
            ha='left', va='center', fontsize=10.5, fontweight='bold', color=esg['color'], zorder=6)
    ax.text(cx + 0.68, cy - 0.46, esg['sub'],
            ha='left', va='center', fontsize=7.4, fontweight='bold', color='#475569', zorder=6)
    
    # Divider line inside ESG card
    ax.plot([cx + 0.18, cx + ESG_CARD_W - 0.18], [cy - 0.60, cy - 0.60], color=esg['bdr'], lw=0.9, zorder=5)
    
    # 2 High-Impact Bullets inside ESG card (with wrapped text and generous spacing)
    # Bullet 1
    b1_lead, b1_body = esg['bullets'][0]
    ax.plot([cx + 0.22], [cy - 0.80], marker='o', markersize=3.0, color=esg['color'], zorder=6)
    ax.text(cx + 0.32, cy - 0.80, b1_lead,
            ha='left', va='center', fontsize=7.4, fontweight='bold', color='#0F172A', zorder=6)
    w_b1 = textwrap.fill(b1_body, width=64)
    ax.text(cx + 0.32, cy - 0.98, w_b1,
            ha='left', va='top', fontsize=7.0, fontweight='normal', color='#334155',
            linespacing=1.2, zorder=6)
    
    # Bullet 2
    b2_lead, b2_body = esg['bullets'][1]
    ax.plot([cx + 0.22], [cy - 1.45], marker='o', markersize=3.0, color=esg['color'], zorder=6)
    ax.text(cx + 0.32, cy - 1.45, b2_lead,
            ha='left', va='center', fontsize=7.4, fontweight='bold', color='#0F172A', zorder=6)
    w_b2 = textwrap.fill(b2_body, width=64)
    ax.text(cx + 0.32, cy - 1.63, w_b2,
            ha='left', va='top', fontsize=7.0, fontweight='normal', color='#334155',
            linespacing=1.2, zorder=6)

# ==========================================
# 4. SAVE OUTPUTS (PNG & PDF)
# ==========================================
out_dir = r"c:\Users\Omkar Raut\OneDrive\Desktop\ROSP\FloodVision-AI\research-content\figures"
os.makedirs(out_dir, exist_ok=True)
png_path = os.path.join(out_dir, "impact_benefits_slide.png")
pdf_path = os.path.join(out_dir, "impact_benefits_slide.pdf")

plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.savefig(pdf_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), pad_inches=0.1)
plt.close()

# Also copy to artifacts directory for direct user preview
artifact_dir = r"C:\Users\Omkar Raut\.gemini\antigravity-ide\brain\1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8"
artifact_png = os.path.join(artifact_dir, "impact_benefits_slide.png")
shutil.copy2(png_path, artifact_png)

print("Generated Impact & Benefits Slide (Slide 07) successfully:")
print(f"  PNG: {png_path}")
print(f"  PDF: {pdf_path}")
print(f"  Artifact: {artifact_png}")
