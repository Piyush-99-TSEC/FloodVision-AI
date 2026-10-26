import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os

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
ax.text(0.9, 9.75, "Problem Statement",
        fontsize=35, fontweight='bold', color='#0F172A', zorder=5)

# Slide Number Badge (02)
num_box = FancyBboxPatch((17.4, 9.55), 0.9, 0.55,
                         boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(num_box)
ax.text(17.85, 9.82, "02", ha='center', va='center',
        fontsize=15.5, fontweight='bold', color='#FFFFFF', zorder=6)

# Horizontal Divider Line
ax.plot([0.9, 18.3], [9.30, 9.30], color='#CBD5E1', lw=1.5, zorder=4)

# Subtitle / Problem Lead-in Statement (Increased to 15pt for strong presentation readability)
ax.text(0.9, 8.84,
        "Flood disaster response demands rapid, reliable intelligence — but critical operational signals remain split across disconnected tools.",
        fontsize=14.8, fontweight='bold', color='#334155', zorder=5)

# ==========================================
# 2. FOUR CHALLENGE CARDS
# ==========================================
def draw_challenge_card(ax, x, y, w, h, badge_num, badge_color, bg_color, border_color, title, desc):
    """
    Draws one of the 4 outer challenge boxes with drop shadow, badge, and formatted text.
    (x, y) is top-left corner.
    """
    # Drop Shadow
    shadow = FancyBboxPatch((x + 0.08, y - h - 0.08), w, h,
                            boxstyle="round,pad=0.03,rounding_size=0.22",
                            facecolor='#94A3B8', edgecolor='none', alpha=0.18, zorder=2)
    ax.add_patch(shadow)
    
    # Outer Card
    card = FancyBboxPatch((x, y - h), w, h,
                          boxstyle="round,pad=0.03,rounding_size=0.22",
                          facecolor=bg_color, edgecolor=border_color, lw=2.0, zorder=3)
    ax.add_patch(card)
    
    # Badge Pill for Number (e.g. 01, 02)
    badge_w, badge_h = 0.90, 0.44
    badge = FancyBboxPatch((x + 0.32, y - 0.22 - badge_h), badge_w, badge_h,
                           boxstyle="round,pad=0.02,rounding_size=0.12",
                           facecolor=badge_color, edgecolor='none', zorder=4)
    ax.add_patch(badge)
    ax.text(x + 0.32 + badge_w/2, y - 0.22 - badge_h/2, badge_num,
            ha='center', va='center', fontsize=12.8, fontweight='bold', color='#FFFFFF', zorder=5)
    
    # Title (Prominent 15.8pt font)
    ax.text(x + 0.32, y - 0.94, title,
            ha='left', va='center', fontsize=15.8, fontweight='bold', color='#0F172A', zorder=4)
    
    # Description (Large 12.8pt font for maximum visibility)
    ax.text(x + 0.32, y - 1.32, desc,
            ha='left', va='top', fontsize=12.6, fontweight='bold', color='#475569',
            linespacing=1.50, zorder=4)

CARD_W = 5.0
CARD_H = 2.45

# Top-Left: Card 01 - Fragmented Tools
draw_challenge_card(ax, 0.9, 8.40, CARD_W, CARD_H,
                    "01", "#2563EB", "#F8FAFC", "#3B82F6",
                    "Fragmented Remote Sensing Tools",
                    "• SAR flood mapping, building damage, and\n  task planning operate in isolated tools.\n• No unified pipeline connects pixels to rescue.")

# Bottom-Left: Card 02 - Slow Assessment
draw_challenge_card(ax, 0.9, 5.60, CARD_W, CARD_H,
                    "02", "#D97706", "#F8FAFC", "#F59E0B",
                    "Latent & Cloud-Impaired Mapping",
                    "• Optical sensors fail under storm clouds/rain.\n• Manual photo-interpretation causes delays\n  during the golden 72-hour window.")

# Top-Right: Card 03 - Opaque AI
draw_challenge_card(ax, 13.3, 8.40, CARD_W, CARD_H,
                    "03", "#7C3AED", "#F8FAFC", "#A855F7",
                    "Opaque Black-Box AI Predictions",
                    "• Deep models lack visual attribution (Grad-CAM),\n  causing operator skepticism in AI decisions.\n• Missing audit trails prevent defensible triage.")

# Bottom-Right: Card 04 - Non-Actionable Priority
draw_challenge_card(ax, 13.3, 5.60, CARD_W, CARD_H,
                    "04", "#E11D48", "#F8FAFC", "#F43F5E",
                    "Non-Actionable Hazard Outputs",
                    "• Raw hazard maps fail to specify rescue tasks.\n• Ignores finite squad counts, equipment limits,\n  and transit constraints across flooded zones.")

# ==========================================
# 3. CENTER BOX: THE RESPONSE GAP
# ==========================================
CENTER_X = 6.40
CENTER_Y = 8.40
CENTER_W = 6.40
CENTER_H = 5.25

# Center Shadow
c_shadow = FancyBboxPatch((CENTER_X + 0.08, CENTER_Y - CENTER_H - 0.08), CENTER_W, CENTER_H,
                          boxstyle="round,pad=0.04,rounding_size=0.28",
                          facecolor='#94A3B8', edgecolor='none', alpha=0.20, zorder=2)
ax.add_patch(c_shadow)

# Center Card Container
center_card = FancyBboxPatch((CENTER_X, CENTER_Y - CENTER_H), CENTER_W, CENTER_H,
                             boxstyle="round,pad=0.04,rounding_size=0.28",
                             facecolor='#FFFFFF', edgecolor='#0F172A', lw=2.4, zorder=3)
ax.add_patch(center_card)

# Exclamation Icon Badge at Top Center
icon_radius = 0.54
icon_circle = Circle((CENTER_X + CENTER_W/2, CENTER_Y - 0.88), icon_radius,
                     facecolor='#0F172A', edgecolor='none', zorder=5)
ax.add_patch(icon_circle)
ax.text(CENTER_X + CENTER_W/2, CENTER_Y - 0.88, "!", ha='center', va='center',
        fontsize=30, fontweight='bold', color='#FFFFFF', zorder=6)

# Center Title (Prominent 18.2pt font)
ax.text(CENTER_X + CENTER_W/2, CENTER_Y - 1.74, "THE OPERATIONAL RESPONSE GAP",
        ha='center', va='center', fontsize=18.0, fontweight='bold', color='#0F172A', zorder=4)

# Gap Equation (Red Accent, 15.0pt font)
ax.text(CENTER_X + CENTER_W/2, CENTER_Y - 2.42,
        "Detection  ≠  Assessment  ≠  Explanation  ≠  Action",
        ha='center', va='center', fontsize=14.8, fontweight='bold', color='#DC2626', zorder=4)

# Thin Separator in Center Box
ax.plot([CENTER_X + 0.7, CENTER_X + CENTER_W - 0.7], [CENTER_Y - 3.02, CENTER_Y - 3.02],
        color='#E2E8F0', lw=1.5, zorder=4)

# Center Description (Enlarged to 14.2pt for readability)
ax.text(CENTER_X + CENTER_W/2, CENTER_Y - 3.75,
        "A first responder requires one continuous,\nexplainable workflow connecting multi-sensor\nsatellite pixels directly to prioritized,\nresource-optimized rescue missions.",
        ha='center', va='center', fontsize=14.0, fontweight='bold', color='#334155',
        linespacing=1.54, zorder=4)

# ==========================================
# 4. CONNECTING LINES (Cards to Center)
# ==========================================
# Card 01 to Center
ax.plot([0.9 + CARD_W, CENTER_X], [8.40 - CARD_H/2, 8.40 - CARD_H/2 + 0.15],
        color='#93C5FD', lw=2.2, linestyle='-', zorder=2)

# Card 02 to Center
ax.plot([0.9 + CARD_W, CENTER_X], [5.60 - CARD_H/2, 5.60 - CARD_H/2 - 0.15],
        color='#FDE68A', lw=2.2, linestyle='-', zorder=2)

# Center to Card 03
ax.plot([CENTER_X + CENTER_W, 13.3], [8.40 - CARD_H/2 + 0.15, 8.40 - CARD_H/2],
        color='#D8B4FE', lw=2.2, linestyle='-', zorder=2)

# Center to Card 04
ax.plot([CENTER_X + CENTER_W, 13.3], [5.60 - CARD_H/2 - 0.15, 5.60 - CARD_H/2],
        color='#FECDD3', lw=2.2, linestyle='-', zorder=2)

# ==========================================
# 5. BOTTOM BAR: INTEGRATED FRAMEWORK CAPABILITIES
# ==========================================
BAR_X = 0.9
BAR_Y = 2.45
BAR_W = 17.4
BAR_H = 1.70

# Bar Shadow
bar_shadow = FancyBboxPatch((BAR_X + 0.08, BAR_Y - BAR_H - 0.08), BAR_W, BAR_H,
                            boxstyle="round,pad=0.03,rounding_size=0.22",
                            facecolor='#94A3B8', edgecolor='none', alpha=0.18, zorder=2)
ax.add_patch(bar_shadow)

# Bar Container
bar_card = FancyBboxPatch((BAR_X, BAR_Y - BAR_H), BAR_W, BAR_H,
                          boxstyle="round,pad=0.03,rounding_size=0.22",
                          facecolor='#FFFFFF', edgecolor='#0D9488', lw=2.2, zorder=3)
ax.add_patch(bar_card)

# Left Tag Badge: INTEGRATED FRAMEWORK (Compacted length for clean spacing)
BADGE_W = 1.85
BADGE_H = 0.88
req_badge = FancyBboxPatch((BAR_X + 0.20, BAR_Y - 1.29), BADGE_W, BADGE_H,
                           boxstyle="round,pad=0.03,rounding_size=0.12",
                           facecolor='#0D9488', edgecolor='none', zorder=4)
ax.add_patch(req_badge)
ax.text(BAR_X + 0.20 + BADGE_W/2, BAR_Y - 0.70, "INTEGRATED",
        ha='center', va='center', fontsize=10.6, fontweight='bold', color='#FFFFFF', zorder=5)
ax.text(BAR_X + 0.20 + BADGE_W/2, BAR_Y - 0.99, "FRAMEWORK",
        ha='center', va='center', fontsize=10.6, fontweight='bold', color='#CCFBF1', zorder=5)

# Step Item Function (Enlarged circles and texts for high visibility)
def draw_capability_step(ax, cx, cy, num_str, circle_color, title, subtitle):
    # Circle
    c = Circle((cx, cy), 0.35, facecolor=circle_color, edgecolor='none', zorder=4)
    ax.add_patch(c)
    ax.text(cx, cy, num_str, ha='center', va='center',
            fontsize=14.0, fontweight='bold', color='#FFFFFF', zorder=5)
    
    # Text (Title 13.0pt, Subtitle 11.0pt)
    ax.text(cx + 0.44, cy + 0.15, title, ha='left', va='center',
            fontsize=12.8, fontweight='bold', color='#0F172A', zorder=4)
    ax.text(cx + 0.44, cy - 0.18, subtitle, ha='left', va='center',
            fontsize=10.8, fontweight='bold', color='#0D9488', zorder=4)

# 4 Steps horizontally across bottom bar with spacious margins and clear directional arrows
draw_capability_step(ax, 3.30, BAR_Y - 0.85, "1", "#0284C7",
                     "Flood Extent Mask", "Where is water? (SAR U-Net)")

ax.text(6.45, BAR_Y - 0.85, "→", ha='center', va='center', fontsize=22, fontweight='bold', color='#94A3B8', zorder=4)

draw_capability_step(ax, 7.05, BAR_Y - 0.85, "2", "#4F46E5",
                     "Damage Severity", "What is affected? (xBD Ensembles)")

ax.text(10.25, BAR_Y - 0.85, "→", ha='center', va='center', fontsize=22, fontweight='bold', color='#94A3B8', zorder=4)

draw_capability_step(ax, 10.85, BAR_Y - 0.85, "3", "#D97706",
                     "Explainable XAI Audit", "Why this prediction? (Grad-CAM)")

ax.text(14.05, BAR_Y - 0.85, "→", ha='center', va='center', fontsize=22, fontweight='bold', color='#94A3B8', zorder=4)

draw_capability_step(ax, 14.65, BAR_Y - 0.85, "4", "#DC2626",
                     "Optimized Rescue Dispatch", "What needs action first? (18-Team)")

plt.tight_layout()

# Save Slide Outputs
out_png = "research-content/figures/problem_statement_slide.png"
out_pdf = "research-content/figures/problem_statement_slide.pdf"

plt.savefig(out_png, bbox_inches='tight', dpi=300)
plt.savefig(out_pdf, bbox_inches='tight', dpi=300)
plt.close()

# Also copy to artifacts directory for direct user preview
import shutil
shutil.copy(out_png, 'C:/Users/Omkar Raut/.gemini/antigravity-ide/brain/1cf7c6f5-77a9-499d-92fd-92e51d1c4eb8/problem_statement_slide.png')

print(f"Generated refined Problem Statement slide successfully at:\n  - {out_png}\n  - {out_pdf}")
