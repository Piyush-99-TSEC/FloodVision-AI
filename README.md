# FloodVision-AI: Research & Model Integration Documentation

This repository contains the architecture, deep learning pipelines, compatibility analyses, and research documentation for the **FloodVision-AI (ROSP)** project — integrating **Sentinel-1 SAR Flood Inundation Mapping** with **Multimodal Sentinel-1/Sentinel-2 Building Damage Assessment (xBD-S12)**.

---

## 1. Project Architecture Overview

```text
xBD-S12 Multimodal Stream
   │
   ├── Sentinel-1 SAR (C-band)
   │      ├── Pre-Disaster (VV, VH)
   │      └── Post-Disaster (VV, VH)
   │             ↓
   │        Flood U-Net (Pretrained on Sen1Floods11)
   │             ↓
   │      Predicted Inundation Map & Temporal Change Analysis
   │
   └── Sentinel-2 Optical (L2A)
          ├── Pre-Disaster (12 Spectral Bands)
          └── Post-Disaster (12 Spectral Bands)
                    ↓
             xBD-S12 Ensembles (UNetWithInputSkip)
                    ↓
          Building Localization & Damage Assessment Maps
                    ↓
   ┌────────────────────────────────────────────────────────┐
   │        Multimodal Output Fusion & Risk Engine          │
   │  (Building Inundation Intersection & Rescue Priority)  │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Flood U-Net ↔ xBD-S12 Compatibility Specification

The Flood U-Net was trained on Sen1Floods11 and adapted to native $128 \times 128$ xBD-S12 Sentinel-1 acquisitions via a lightweight standardization adapter without retraining or architecture modification.

### Input Specifications
* **Input Tensor Shape**: `[B, 2, 128, 128]` (Fully-convolutional, native resolution)
* **Channel Ordering**: 
  * Channel 0: `VV` Polarization (Backscatter in dB)
  * Channel 1: `VH` Polarization (Backscatter in dB)
* **Data Type**: `torch.float32`
* **Z-Score Normalization**:
  $$\text{VV}_{\text{norm}} = \frac{\text{VV} - (-10.37825)}{4.0039396}$$
  $$\text{VH}_{\text{norm}} = \frac{\text{VH} - (-17.223745)}{4.710903}$$
* **Missing Value Imputation**: $\text{NaN}$ pixels replaced with per-band spatial mean ($\text{np.nanmean}$).

---

## 3. Temporal Inundation Dynamics & Mathematical Definitions

To distinguish pre-existing water bodies from disaster-induced flooding, temporal set-theoretic segmentation is performed between pre- and post-disaster acquisitions:

Let $\mathbf{M}_{\text{pre}} \in \{0, 1\}^{H \times W}$ and $\mathbf{M}_{\text{post}} \in \{0, 1\}^{H \times W}$ be the predicted binary masks:

1. **Persistent Predicted Water**: Water detected in both pre- and post-disaster images
   $$\mathbf{M}_{\text{persistent}} = \mathbf{M}_{\text{pre}} \cap \mathbf{M}_{\text{post}} = \mathbf{M}_{\text{pre}} \land \mathbf{M}_{\text{post}}$$
2. **Newly Flooded Extent**: Disaster-induced inundation (dry land turned into water)
   $$\mathbf{M}_{\text{new\_flood}} = \mathbf{M}_{\text{post}} \setminus \mathbf{M}_{\text{pre}} = \mathbf{M}_{\text{post}} \land (\neg \mathbf{M}_{\text{pre}})$$
3. **Receded Predicted Water**: Water present pre-disaster that receded post-disaster
   $$\mathbf{M}_{\text{receded}} = \mathbf{M}_{\text{pre}} \setminus \mathbf{M}_{\text{post}} = \mathbf{M}_{\text{pre}} \land (\neg \mathbf{M}_{\text{post}})$$

### Academic Terminology Rules
* Use **"Predicted Flood/Water"** for single-image model predictions.
* Use **"Newly Flooded"** for temporal difference activations.
* Use **"Persistent Predicted Water"** (avoid "permanent water" as no topological ground truth exists).
* Use **"Receded Predicted Water"** for drying areas.

---

## 4. Research Content Library Structure

Generated research figures (300 DPI PNG + vector PDF) and numerical CSV metrics are structured in Google Drive under `research-content/`:

```text
research-content/
├── figures/                                # Master High-Res Figures (300 DPI PNG + PDF)
│   ├── figure_1_single_tile_flood_unet.png
│   ├── figure_1_single_tile_flood_unet.pdf
│   ├── figure_2_temporal_pre_post_analysis.png
│   ├── figure_2_temporal_pre_post_analysis.pdf
│   ├── figure_3_multi_tile_validation.png
│   ├── figure_3_multi_tile_validation.pdf
│   ├── figure_4_methodology_data_flow.png
│   ├── figure_4_methodology_data_flow.pdf
│   ├── figure_5_dataset_label_availability.png
│   └── figure_5_dataset_label_availability.pdf
├── flood_unet/
│   ├── single_tile/
│   │   ├── hurricane-florence_00000181_single_tile_analysis.png
│   │   └── single_tile_metrics.csv
│   ├── multi_tile/
│   │   ├── multi_tile_representative_samples.png
│   │   └── multi_tile_metrics.csv
│   └── pre_post_analysis/
│       ├── hurricane-florence_00000181_temporal_analysis.png
│       └── pre_post_analysis_metrics.csv
└── xbd_s12_dataset/
    ├── methodology_data_flow_diagram.png
    └── dataset_label_availability_matrix.png
```

---

## 5. Master Figure Descriptions & Paper/PPT Mapping

| Figure # | Title | Contents | Recommended Paper / PPT Section |
| :--- | :--- | :--- | :--- |
| **Figure 1** | **Single-Tile Flood U-Net Inference** | S1 VV (dB), S1 VH (dB), Predicted Flood Mask, Inundation Overlay | **Results / Model Validation** |
| **Figure 2** | **Temporal Differential Analysis** | Pre VV, Post VV, Pre Mask, Post Mask, Color-Coded Change Map | **Results / Disaster Inundation Dynamics** |
| **Figure 3** | **Multi-Disaster Validation Grid** | Comparative evaluation across hurricanes, floods, wildfires, volcanoes | **Results / Generalization & Robustness** |
| **Figure 4** | **System Architecture & Data Flow** | IEEE-style end-to-end data pipeline schematic | **Methodology / System Overview** |
| **Figure 5** | **Dataset Component Matrix** | Matrix classifying available satellite inputs vs. ground truth | **Dataset / Limitations Section** |

---

## 6. Dataset Component & Ground-Truth Boundaries

| Component | Sensor / Source | Available in xBD-S12? | Ground-Truth Status |
| :--- | :--- | :---: | :--- |
| **Sentinel-1 SAR** | C-band (VV & VH) | **YES** | Input Feature Only |
| **Sentinel-2 Multispectral** | L2A (12 Bands) | **YES** | Input Feature Only |
| **Building Footprints** | xBD Polygons | **YES** | Supervised Ground-Truth Label |
| **Building Damage Severity** | xBD 4-Level Damage Scale | **YES** | Supervised Ground-Truth Label |
| **Flood / Water Mask** | SAR / Hydrological | **NO** | **NOT PROVIDED (Limitation)** |

> **Important Peer-Review Note:**
> The xBD-S12 benchmark is designed specifically for **building damage assessment**. It does not contain ground-truth water or flood annotations. Flood inundation maps are generated via zero-shot domain adaptation of the Flood U-Net on Sentinel-1 SAR imagery.

---

## 7. Numerical Telemetry Persisted

* `single_tile_metrics.csv`: Original SAR distributions ($\text{dB}$), normalized values, and predicted flood percentage.
* `pre_post_analysis_metrics.csv`: Pixel breakdown of persistent water, newly inundated extent, and receded pixels.
* `multi_tile_metrics.csv`: Cross-disaster flood percentage statistics.

---

## 8. Next Pipeline Milestone

1. **Multimodal Output Fusion**: Intersecting predicted Flood Inundation Masks ($M_{\\text{flood}}$) with Building Damage Maps ($M_{\\text{damage}}$).
2. **Flooded Building Risk Index**: Classifying affected structures into High, Medium, and Low rescue priorities based on flood-damage conjunction.
3. **Automated Rescue Task Allocation**: Clustering high-risk coordinates for field response deployment.
