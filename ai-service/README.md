# FloodVision-AI — Multimodal Deep Learning AI Service

This directory contains the production **FastAPI AI Microservice** and **Live Neural Network Inference Engine** for FloodVision-AI.

---

## 1. Quick Start Guide for College Project Presentation

### Option A: Launch the Interactive FastAPI Web Microservice (Swagger UI)
```bash
cd ai-service
uvicorn main:app --reload --port 8000
```
Then open your browser to:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)** (Interactive Swagger UI)

You can click **"Try it out"** on:
* `POST /demo/quick-run` — Runs live Flood U-Net forward pass + multimodal building risk calculation.
* `POST /predict/sar-flood` — Executes live PyTorch segmentation on Sentinel-1 SAR tiles.
* `POST /predict/scene/{scene_id}` — Evaluates any of the 30 disaster scenes live.
* `GET /models/summary` — Shows full neural network parameter specs.

---

### Option B: Run Live Terminal Inference CLI Demo
```bash
cd ai-service
python demo_cli.py --scene hurricane-florence_00000050
```
To view all available disaster scenes:
```bash
python demo_cli.py --list-scenes
```

---

## 2. Deep Learning Architecture Summary

1. **Flood U-Net**:
   * Architecture: 4-Level Encoder-Decoder with Skip Connections & Transposed Convolutions.
   * Input: `[Batch, 2, 128, 128]` (Sentinel-1 VV & VH SAR polarizations).
   * Checkpoint: `checkpoints/flood_unet_final.pth` (118.4 MB).
   * Standardization: `(VV - VV_MEAN)/VV_STD`, `(VH - VH_MEAN)/VH_STD`.
2. **xBD-S12 Building Localization Ensemble**:
   * Target: Building Footprint Boundary Segmentation.
3. **xBD-S12 Damage Assessment Ensemble**:
   * Target: Structural Damage Severity ($S_i \in [0, 1]$).
4. **Multimodal Risk Fusion**:
   * Formula: $R_i = 0.50 \cdot E_i + 0.50 \cdot S_i$.
