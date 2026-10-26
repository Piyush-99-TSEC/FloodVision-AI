import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np
import os

# Create figure with high DPI and expanded canvas for larger, bolder typography
fig = plt.figure(figsize=(24, 14.5), dpi=300)
ax = fig.add_subplot(111)
ax.set_xlim(0, 24)
ax.set_ylim(0, 14.5)
ax.axis('off')

# Background
fig.patch.set_facecolor('#F8FAFC')
ax.set_facecolor('#F8FAFC')

# Title & Subtitle Banner
ax.text(12, 13.85, "Entity-Relationship and Database Schema Architecture",
        ha='center', va='center', fontsize=20, fontweight='bold', color='#0F172A')
ax.text(12, 13.40, "Data Schemas and Relational Mappings for SceneCases, BuildingRisks, Tasks, Teams, and Assignments",
        ha='center', va='center', fontsize=12.5, fontweight='bold', color='#475569')

# Color Tokens for Entities
THEMES = {
    'scene': {
        'header_bg': '#1E3A8A',     # Dark Navy Blue
        'header_fg': '#FFFFFF',
        'border': '#2563EB',
        'card_bg': '#FFFFFF'
    },
    'building': {
        'header_bg': '#064E3B',     # Dark Forest Emerald
        'header_fg': '#FFFFFF',
        'border': '#059669',
        'card_bg': '#FFFFFF'
    },
    'task': {
        'header_bg': '#9A3412',     # Deep Rust / Amber
        'header_fg': '#FFFFFF',
        'border': '#EA580C',
        'card_bg': '#FFFFFF'
    },
    'team': {
        'header_bg': '#581C87',     # Deep Indigo / Purple
        'header_fg': '#FFFFFF',
        'border': '#9333EA',
        'card_bg': '#FFFFFF'
    },
    'assignment': {
        'header_bg': '#0F766E',     # Deep Teal
        'header_fg': '#FFFFFF',
        'border': '#0D9488',
        'card_bg': '#FFFFFF'
    }
}

def draw_table_card(ax, x, y, w, h, theme_key, title, collection_name, attributes):
    """
    Draws a relational database table / MongoDB schema card with large, readable fonts.
    (x, y) is top-left corner.
    """
    th = THEMES[theme_key]
    
    # Drop Shadow
    shadow = FancyBboxPatch((x + 0.10, y - h - 0.10), w, h,
                            boxstyle="round,pad=0.04,rounding_size=0.20",
                            facecolor='#94A3B8', edgecolor='none', alpha=0.22, zorder=1)
    ax.add_patch(shadow)
    
    # Outer Card Container
    card = FancyBboxPatch((x, y - h), w, h,
                          boxstyle="round,pad=0.04,rounding_size=0.20",
                          facecolor=th['card_bg'], edgecolor=th['border'], linewidth=2.2, zorder=2)
    ax.add_patch(card)
    
    # Header Banner
    header_h = 0.95
    header_patch = FancyBboxPatch((x, y - header_h), w, header_h,
                                 boxstyle="round,pad=0.02,rounding_size=0.18",
                                 facecolor=th['header_bg'], edgecolor=th['border'], linewidth=1.5, zorder=3)
    ax.add_patch(header_patch)
    
    # Header Text (Significantly Larger)
    ax.text(x + w/2, y - 0.36, title, ha='center', va='center',
            fontsize=14.0, fontweight='bold', color=th['header_fg'], zorder=4)
    ax.text(x + w/2, y - 0.72, f"Collection: {collection_name}", ha='center', va='center',
            fontsize=10.0, fontweight='bold', color='#E2E8F0', style='italic', zorder=4)
    
    # Divider line under header
    ax.plot([x, x + w], [y - header_h, y - header_h], color=th['border'], lw=1.8, zorder=4)
    
    # Row Attributes
    row_y = y - header_h - 0.32
    row_step = (h - header_h - 0.25) / len(attributes)
    
    for i, attr in enumerate(attributes):
        curr_y = row_y - (i * row_step)
        
        # Zebra striping
        if i % 2 == 1:
            bg_row = FancyBboxPatch((x + 0.08, curr_y - row_step/2 + 0.03), w - 0.16, row_step - 0.06,
                                    boxstyle="round,pad=0.01,rounding_size=0.06",
                                    facecolor='#F8FAFC', edgecolor='none', zorder=3)
            ax.add_patch(bg_row)
            
        key_type = attr.get('key', '')
        name = attr.get('name', '')
        dtype = attr.get('type', '')
        
        # Badge for Key (PK / FK) - enlarged
        if key_type == 'PK':
            k_box = FancyBboxPatch((x + 0.22, curr_y - 0.14), 0.62, 0.28,
                                   boxstyle="round,pad=0.02,rounding_size=0.07",
                                   facecolor='#FEF08A', edgecolor='#CA8A04', lw=1.4, zorder=4)
            ax.add_patch(k_box)
            ax.text(x + 0.53, curr_y, "PK", ha='center', va='center',
                    fontsize=8.5, fontweight='bold', color='#854D0E', zorder=5)
        elif key_type == 'FK':
            k_box = FancyBboxPatch((x + 0.22, curr_y - 0.14), 0.62, 0.28,
                                   boxstyle="round,pad=0.02,rounding_size=0.07",
                                   facecolor='#BFDBFE', edgecolor='#2563EB', lw=1.4, zorder=4)
            ax.add_patch(k_box)
            ax.text(x + 0.53, curr_y, "FK", ha='center', va='center',
                    fontsize=8.5, fontweight='bold', color='#1E40AF', zorder=5)
        elif key_type == 'PK/FK':
            k_box = FancyBboxPatch((x + 0.14, curr_y - 0.14), 0.78, 0.28,
                                   boxstyle="round,pad=0.02,rounding_size=0.07",
                                   facecolor='#FED7AA', edgecolor='#EA580C', lw=1.4, zorder=4)
            ax.add_patch(k_box)
            ax.text(x + 0.53, curr_y, "PK/FK", ha='center', va='center',
                    fontsize=8.0, fontweight='bold', color='#9A3412', zorder=5)
        else:
            ax.plot(x + 0.53, curr_y, marker='o', markersize=4.5, color='#94A3B8', zorder=4)
            
        # Field Name (Larger & Bolder)
        col = '#0F172A' if key_type else '#1E293B'
        ax.text(x + 0.98, curr_y, name, ha='left', va='center',
                fontsize=10.2, fontweight='bold', color=col, zorder=4)
        
        # Field Type (Larger Monospace)
        ax.text(x + w - 0.22, curr_y, dtype, ha='right', va='center',
                fontsize=9.6, fontweight='bold', color='#475569', fontfamily='monospace', zorder=4)

# Entity Attributes
scene_attrs = [
    {'key': 'PK', 'name': 'sceneId / caseId', 'type': 'String (Indexed)'},
    {'key': '', 'name': 'disaster_name', 'type': 'String'},
    {'key': '', 'name': 'disaster_type', 'type': 'Enum (Flood, Hurricane)'},
    {'key': '', 'name': 'location (lat, lon)', 'type': 'GeoJSON Point'},
    {'key': '', 'name': 'eventDate', 'type': 'Timestamp'},
    {'key': '', 'name': 'affectedBuildings', 'type': 'Integer'},
    {'key': '', 'name': 'floodPercentage', 'type': 'Float (0 - 100%)'},
    {'key': '', 'name': 'rasterTilePaths (SAR)', 'type': 'Array<String>'},
    {'key': '', 'name': 'status', 'type': 'Enum (active, reviewed)'},
    {'key': '', 'name': 'createdAt / updatedAt', 'type': 'Timestamp'}
]

building_attrs = [
    {'key': 'PK', 'name': 'building_id', 'type': 'Integer (Scene-Scope)'},
    {'key': 'FK', 'name': 'scene_id', 'type': 'String (Ref: SceneCases)'},
    {'key': '', 'name': 'centroid_x, centroid_y', 'type': 'Float (Pixels)'},
    {'key': '', 'name': 'latitude, longitude', 'type': 'Float (WGS84)'},
    {'key': '', 'name': 'area_pixels', 'type': 'Integer (Footprint)'},
    {'key': '', 'name': 'flood_exposure_Ei', 'type': 'Float (0.00 - 1.00)'},
    {'key': '', 'name': 'damage_severity_Si', 'type': 'Float (0.00 - 1.00)'},
    {'key': '', 'name': 'risk_score_Ri', 'type': 'Float (0.00 - 1.00)'},
    {'key': '', 'name': 'priority_category', 'type': 'Enum (Critical, High..)'},
    {'key': '', 'name': 'footprint_polygon', 'type': 'GeoJSON Polygon'}
]

task_attrs = [
    {'key': 'PK', 'name': 'taskId', 'type': 'String (TASK-xxx)'},
    {'key': 'FK', 'name': 'sceneId', 'type': 'String (Ref: SceneCases)'},
    {'key': 'FK', 'name': 'buildingId', 'type': 'Integer (Ref: BuildingRisks)'},
    {'key': '', 'name': 'location (lat, lon, area)', 'type': 'GeoJSON Point'},
    {'key': '', 'name': 'taskType', 'type': 'Enum (Rescue, USAR..)'},
    {'key': '', 'name': 'urgency', 'type': 'Enum (Critical, High..)'},
    {'key': '', 'name': 'riskScore', 'type': 'Float (0.00 - 1.00)'},
    {'key': '', 'name': 'taskReason', 'type': 'Text (Auditable Rationale)'},
    {'key': '', 'name': 'requiredResources', 'type': 'Array<String>'},
    {'key': '', 'name': 'taskStatus', 'type': 'Enum (PENDING, ASSIGNED)'}
]

team_attrs = [
    {'key': 'PK', 'name': 'teamId', 'type': 'String (TEAM-xxx)'},
    {'key': '', 'name': 'teamName', 'type': 'String'},
    {'key': '', 'name': 'teamType', 'type': 'Enum (BOAT, USAR, DRONE)'},
    {'key': '', 'name': 'currentLocation (lat, lon)', 'type': 'GeoJSON Point'},
    {'key': '', 'name': 'available', 'type': 'Boolean'},
    {'key': '', 'name': 'personnelCount', 'type': 'Integer'},
    {'key': '', 'name': 'capabilities', 'type': 'Array<String>'},
    {'key': '', 'name': 'status', 'type': 'Enum (AVAILABLE, BUSY)'},
    {'key': '', 'name': 'speedKmH', 'type': 'Float'},
    {'key': 'FK', 'name': 'assignedTaskId', 'type': 'String (Nullable Ref)'}
]

assignment_attrs = [
    {'key': 'PK', 'name': 'assignmentId', 'type': 'String (ASSIGN-xxx)'},
    {'key': 'FK', 'name': 'taskId', 'type': 'String (Ref: RescueTasks)'},
    {'key': 'FK', 'name': 'teamId', 'type': 'String (Ref: RescueTeams)'},
    {'key': '', 'name': 'taskType', 'type': 'String'},
    {'key': '', 'name': 'distanceKm', 'type': 'Float (Haversine)'},
    {'key': '', 'name': 'allocationScore', 'type': 'Float (S_alloc)'},
    {'key': '', 'name': 'compatibilityReason', 'type': 'Text (Matching Logic)'},
    {'key': '', 'name': 'assignmentStatus', 'type': 'Enum (ASSIGNED..)'},
    {'key': '', 'name': 'assignedAt', 'type': 'Timestamp'}
]

# Layout Positions (Wider Cards & Taller Cards for Bigger Text)
CARD_W = 6.4
CARD_H = 4.8

POS_SCENE = (0.9, 12.6)
POS_BUILDING = (8.8, 12.6)
POS_TEAM = (16.7, 12.6)

POS_TASK = (3.8, 6.7)
POS_ASSIGN = (13.8, 6.7)

# Draw Cards
draw_table_card(ax, POS_SCENE[0], POS_SCENE[1], CARD_W, CARD_H, 'scene',
                'SceneCases', 'flood_cases / xBD-S12', scene_attrs)

draw_table_card(ax, POS_BUILDING[0], POS_BUILDING[1], CARD_W, CARD_H, 'building',
                'BuildingRisks', 'building_risks / geojson', building_attrs)

draw_table_card(ax, POS_TEAM[0], POS_TEAM[1], CARD_W, CARD_H, 'team',
                'RescueTeams', 'rescue_teams', team_attrs)

draw_table_card(ax, POS_TASK[0], POS_TASK[1], CARD_W, CARD_H, 'task',
                'RescueTasks', 'rescue_tasks', task_attrs)

draw_table_card(ax, POS_ASSIGN[0], POS_ASSIGN[1], CARD_W, CARD_H, 'assignment',
                'TeamAssignments', 'team_assignments', assignment_attrs)

# -------------------------------------------------------------
# RELATIONAL CONNECTORS (Clean paths without card overlaps)
# -------------------------------------------------------------

def draw_pill(ax, x, y, text, color="#2563EB", fs=9.5, pad=0.3):
    pill_w = len(text) * 0.12 + pad
    pill = FancyBboxPatch((x - pill_w/2, y - 0.18), pill_w, 0.36,
                          boxstyle="round,pad=0.03,rounding_size=0.12",
                          facecolor='#FFFFFF', edgecolor=color, lw=1.8, zorder=6)
    ax.add_patch(pill)
    ax.text(x, y, text, ha='center', va='center',
            fontsize=fs, fontweight='bold', color=color, zorder=7)

def draw_card_badge(ax, x, y, text):
    ax.text(x, y, text, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0F172A',
            bbox=dict(boxstyle="circle,pad=0.20", fc="#F1F5F9", ec="#475569", lw=1.3), zorder=7)

# 1. SceneCases -> BuildingRisks (1 : N) "Contains / Assesses"
p_scene_r = (POS_SCENE[0] + CARD_W, POS_SCENE[1] - CARD_H/2)
p_bldg_l = (POS_BUILDING[0], POS_BUILDING[1] - CARD_H/2)
con1 = patches.ConnectionPatch(p_scene_r, p_bldg_l, "data", "data",
                               arrowstyle="-|>", mutation_scale=18, lw=2.4, color="#1E40AF", zorder=5)
ax.add_patch(con1)
draw_pill(ax, (p_scene_r[0] + p_bldg_l[0])/2, p_scene_r[1], "1 : N (Contains)", color="#1E40AF")
draw_card_badge(ax, p_scene_r[0] + 0.35, p_scene_r[1] + 0.30, "1")
draw_card_badge(ax, p_bldg_l[0] - 0.35, p_bldg_l[1] + 0.30, "N")

# 2. BuildingRisks -> RescueTasks (1 : 0..1) "Triggers Mission"
p_bldg_b = (POS_BUILDING[0] + CARD_W * 0.32, POS_BUILDING[1] - CARD_H)
p_task_t = (POS_TASK[0] + CARD_W * 0.78, POS_TASK[1])
con2 = patches.ConnectionPatch(p_bldg_b, p_task_t, "data", "data",
                               arrowstyle="-|>", mutation_scale=18, lw=2.4, color="#EA580C", zorder=5)
ax.add_patch(con2)
draw_pill(ax, (p_bldg_b[0] + p_task_t[0])/2, (p_bldg_b[1] + p_task_t[1])/2, "1 : 0..1 (Triggers)", color="#EA580C")
draw_card_badge(ax, p_bldg_b[0] + 0.28, p_bldg_b[1] - 0.32, "1")
draw_card_badge(ax, p_task_t[0] - 0.28, p_task_t[1] + 0.32, "0..1")

# 3. SceneCases -> RescueTasks (1 : N) "Scopes AOI"
p_scene_b = (POS_SCENE[0] + CARD_W * 0.45, POS_SCENE[1] - CARD_H)
p_task_l = (POS_TASK[0], POS_TASK[1] - CARD_H * 0.45)
corner_x = p_scene_b[0]
corner_y = p_task_l[1]
ax.plot([p_scene_b[0], corner_x], [p_scene_b[1], corner_y], color='#0284C7', lw=2.4, zorder=5)
ax.plot([corner_x, p_task_l[0]], [corner_y, p_task_l[1]], color='#0284C7', lw=2.4, zorder=5)
ax.annotate('', xy=p_task_l, xytext=(corner_x, corner_y),
            arrowprops=dict(arrowstyle="-|>", color='#0284C7', lw=2.4, mutation_scale=18), zorder=5)
draw_pill(ax, corner_x, (p_scene_b[1] + corner_y)/2, "1 : N (Scopes)", color="#0284C7")
draw_card_badge(ax, p_scene_b[0] + 0.35, p_scene_b[1] - 0.32, "1")
draw_card_badge(ax, p_task_l[0] - 0.35, p_task_l[1] + 0.32, "N")

# 4. RescueTasks -> TeamAssignments (1 : 0..1) "Allocated Via"
p_task_r = (POS_TASK[0] + CARD_W, POS_TASK[1] - CARD_H * 0.5)
p_assign_l = (POS_ASSIGN[0], POS_ASSIGN[1] - CARD_H * 0.5)
con4 = patches.ConnectionPatch(p_task_r, p_assign_l, "data", "data",
                               arrowstyle="-|>", mutation_scale=18, lw=2.4, color="#0D9488", zorder=5)
ax.add_patch(con4)
draw_pill(ax, (p_task_r[0] + p_assign_l[0])/2, p_task_r[1], "1 : 0..1 (Allocated Via)", color="#0D9488")
draw_card_badge(ax, p_task_r[0] + 0.35, p_task_r[1] + 0.30, "1")
draw_card_badge(ax, p_assign_l[0] - 0.35, p_assign_l[1] + 0.30, "0..1")

# 5. RescueTeams -> TeamAssignments (1 : N) "Dispatched"
p_team_b = (POS_TEAM[0] + CARD_W * 0.38, POS_TEAM[1] - CARD_H)
p_assign_t = (POS_ASSIGN[0] + CARD_W * 0.65, POS_ASSIGN[1])
con5 = patches.ConnectionPatch(p_team_b, p_assign_t, "data", "data",
                               arrowstyle="-|>", mutation_scale=18, lw=2.4, color="#9333EA", zorder=5)
ax.add_patch(con5)
draw_pill(ax, (p_team_b[0] + p_assign_t[0])/2, (p_team_b[1] + p_assign_t[1])/2, "1 : N (Dispatched)", color="#9333EA")
draw_card_badge(ax, p_team_b[0] - 0.28, p_team_b[1] - 0.32, "1")
draw_card_badge(ax, p_assign_t[0] + 0.28, p_assign_t[1] + 0.32, "N")

# -------------------------------------------------------------
# ARCHITECTURAL LEGEND & SPECIFICATION BANNER
# -------------------------------------------------------------
leg_x, leg_y, leg_w, leg_h = 0.9, 1.15, 22.2, 0.78
leg_bg = FancyBboxPatch((leg_x, leg_y - leg_h), leg_w, leg_h,
                        boxstyle="round,pad=0.03,rounding_size=0.14",
                        facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.6, zorder=2)
ax.add_patch(leg_bg)

# Legend labels
ax.text(leg_x + 0.4, leg_y - 0.39, "DATABASE SCHEMA SPECIFICATION:",
        ha='left', va='center', fontsize=10.0, fontweight='bold', color='#0F172A', zorder=4)

# PK box
k_box = FancyBboxPatch((leg_x + 4.8, leg_y - 0.54), 0.60, 0.28,
                       boxstyle="round,pad=0.02,rounding_size=0.07",
                       facecolor='#FEF08A', edgecolor='#CA8A04', lw=1.3, zorder=4)
ax.add_patch(k_box)
ax.text(leg_x + 5.10, leg_y - 0.40, "PK", ha='center', va='center',
        fontsize=8.5, fontweight='bold', color='#854D0E', zorder=5)
ax.text(leg_x + 5.55, leg_y - 0.39, "Primary Key", ha='left', va='center',
        fontsize=9.5, fontweight='bold', color='#334155', zorder=4)

# FK box
k_box = FancyBboxPatch((leg_x + 7.7, leg_y - 0.54), 0.60, 0.28,
                       boxstyle="round,pad=0.02,rounding_size=0.07",
                       facecolor='#BFDBFE', edgecolor='#2563EB', lw=1.3, zorder=4)
ax.add_patch(k_box)
ax.text(leg_x + 8.00, leg_y - 0.40, "FK", ha='center', va='center',
        fontsize=8.5, fontweight='bold', color='#1E40AF', zorder=5)
ax.text(leg_x + 8.45, leg_y - 0.39, "Foreign Key Reference", ha='left', va='center',
        fontsize=9.5, fontweight='bold', color='#334155', zorder=4)

# Cardinality item
ax.text(leg_x + 12.0, leg_y - 0.39, "1 : N  One-to-Many Relation", ha='left', va='center',
        fontsize=9.5, fontweight='bold', color='#334155', zorder=4)
ax.text(leg_x + 15.6, leg_y - 0.39, "1 : 0..1  Conditional Task Trigger", ha='left', va='center',
        fontsize=9.5, fontweight='bold', color='#334155', zorder=4)
ax.text(leg_x + 21.6, leg_y - 0.39, "MongoDB + GeoJSON Models", ha='right', va='center',
        fontsize=9.5, fontweight='bold', color='#0284C7', zorder=4)

plt.tight_layout()

# Save PNG and PDF
out_png = "research-content/figures/figure_3_5_database_schema.png"
out_pdf = "research-content/figures/figure_3_5_database_schema.pdf"

plt.savefig(out_png, bbox_inches='tight', dpi=300)
plt.savefig(out_pdf, bbox_inches='tight', dpi=300)
plt.close()

# Also copy to artifacts directory for direct user preview
import shutil
shutil.copy(out_png, 'C:/Users/Omkar Raut/.gemini/antigravity-ide/brain/1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8/figure_3_5_database_schema.png')

print(f"Generated enlarged Figure 3.5 successfully at:\n  - {out_png}\n  - {out_pdf}")
