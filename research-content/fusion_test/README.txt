ROSP Multi-Modal Output Fusion & Building Risk Scoring
========================================================================

Scene ID: hurricane-florence_00000050
Target Grid: 128 x 128 Native Resolution (EPSG:32617)

1. METHODOLOGY & MODEL INTEGRATION
-----------------------------------
- Flood Segmentation: Dedicated Sen1Floods11-trained U-Net operating on dual-pol (VV/VH) Sentinel-1 SAR.
  Temporal change detection isolates disaster-induced newly flooded inundation.
- Building Localization: Pretrained xBD-S12 ensemble model producing binary building footprints (threshold: 0.5).
- Damage Assessment: Pretrained xBD-S12 ensemble model predicting 3-class logits across intact, minor, and destroyed buildings.
- Instance Extraction: Connected components labeling (8-connectivity) applied to building footprint mask.

2. RISK SCORING FORMULATION (INITIAL DESIGN ASSUMPTION)
-------------------------------------------------------
- Building Flood Exposure (Ei): Proportion of building footprint submerged by newly flooded water [0.0 - 1.0].
- Building Damage Severity (Si): Average normalized damage severity across building footprint:
    * Class 1 (No Damage / Intact) -> 0.0
    * Class 2 (Minor Damage)       -> 0.5
    * Class 3 (Destroyed / Major)  -> 1.0
- Combined Risk Score (Ri):
    Ri = 0.5 * Ei + 0.5 * Si
  *NOTE*: The 50/50 weighting is an initial design assumption for structural testing and has not been clinically or field-validated.

3. PRIORITY CATEGORIZATION
---------------------------
- Low Priority     : Ri < 0.25
- Moderate Priority: 0.25 <= Ri < 0.50
- High Priority    : 0.50 <= Ri < 0.75
- Critical Priority: Ri >= 0.75

4. SCENE SUMMARY STATISTICS
---------------------------
- Total Buildings Detected: 7
- Total Building Footprint Pixels: 292 (1.78% of scene)
- Flood Exposure Range (Ei): [0.0000, 0.2500]
- Damage Severity Range (Si): [0.0000, 1.0000]
- Risk Score Range (Ri): [0.0000, 0.5893]
- Priority Breakdown:
priority_category
High        3
Moderate    2
Low         2

5. DELIVERABLES GENERATED
-------------------------
- building_risk_scores.csv: Complete per-building tabular metrics.
- fusion_risk_visualization.png: High-resolution 4-panel visual validation figure.
- README.txt: This methodology and summary document.
