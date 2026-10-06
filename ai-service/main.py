import os
import sys
from typing import Optional, List
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure local imports work cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.inference_engine import engine

app = FastAPI(
    title="FloodVision-AI Multimodal Perception & Fusion Service",
    description=(
        "Production AI Microservice for live Deep Learning Disaster Perception: "
        "Sentinel-1 SAR Temporal Flood U-Net, Building Localization, Damage Severity Assessment, "
        "and Multimodal Building Risk Fusion."
    ),
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SarInferenceRequest(BaseModel):
    mean_vv_db: Optional[float] = Field(default=-10.88, description="Simulated/real raw mean VV (dB)")
    mean_vh_db: Optional[float] = Field(default=-17.16, description="Simulated/real raw mean VH (dB)")
    grid_size: Optional[int] = Field(default=128, description="SAR Tile Dimension (128x128)")

@app.get("/", tags=["System"])
def root():
    return {
        "service": "FloodVision-AI Multimodal Deep Learning Service",
        "status": "OPERATIONAL",
        "device": str(engine.device),
        "checkpointLoaded": engine.checkpoint_loaded,
        "checkpointPath": engine.checkpoint_path,
        "totalValidatedScenes": len(engine.get_available_scenes()),
        "endpoints": {
            "swaggerDocs": "/docs",
            "modelsSummary": "/models/summary",
            "availableScenes": "/scenes",
            "scenePrediction": "/predict/scene/{scene_id}",
            "sarSegmentation": "/predict/sar-flood",
            "quickDemo": "/demo/quick-run",
        },
    }

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "modelsLoaded": engine.checkpoint_loaded,
        "device": str(engine.device),
    }

@app.get("/models/summary", tags=["Models & Architecture"])
def get_models_summary():
    """
    Returns the deep learning model specifications, parameter counts, and risk formulas.
    """
    return engine.get_models_summary()

@app.get("/scenes", tags=["Dataset & Inference"])
def list_available_scenes():
    """
    Lists all 30 xBD-S12 validation scenes available for live inference and risk assessment.
    """
    scenes = engine.get_available_scenes()
    return {
        "totalScenes": len(scenes),
        "scenes": scenes,
    }

@app.post("/predict/scene/{scene_id}", tags=["Dataset & Inference"])
def predict_scene_fusion(scene_id: str):
    """
    Runs multimodal deep learning perception & fusion prediction on a specific disaster scene.
    Computes building count, flood exposure (Ei), damage severity (Si), and composite risk (Ri).
    """
    available = engine.get_available_scenes()
    if scene_id not in available:
        raise HTTPException(
            status_code=404,
            detail=f"Scene '{scene_id}' not found. Choose from {len(available)} available scenes: {available[:5]}..."
        )
    return engine.predict_scene_fusion(scene_id)

@app.post("/predict/sar-flood", tags=["Live Neural Network Inference"])
def run_sar_flood_inference(req: SarInferenceRequest):
    """
    Executes live PyTorch forward-pass through Flood U-Net on 2-channel Sentinel-1 SAR inputs.
    Standardizes inputs with frozen training statistics and outputs pixel flood segmentation.
    """
    # Generate realistic Sentinel-1 SAR sample tile
    size = req.grid_size or 128
    vv = np.random.normal(req.mean_vv_db, 2.7, size=(size, size)).astype(np.float32)
    vh = np.random.normal(req.mean_vh_db, 3.5, size=(size, size)).astype(np.float32)
    
    # Inject water body low-backscatter simulation in center quadrant
    vv[40:80, 40:80] -= 7.5
    vh[40:80, 40:80] -= 9.0

    result = engine.run_sar_flood_inference(vv, vh)
    return {
        "message": "Flood U-Net live segmentation completed successfully",
        "inputs": {
            "meanVV": req.mean_vv_db,
            "meanVH": req.mean_vh_db,
            "gridSize": f"{size}x{size}",
        },
        "output": result,
    }

@app.post("/demo/quick-run", tags=["Live Neural Network Inference"])
def run_quick_demo(scene_id: Optional[str] = Query(default="hurricane-florence_00000050")):
    """
    Quick live demonstration endpoint for presentations and college evaluators.
    Runs both the Flood U-Net forward-pass and multimodal building risk fusion.
    """
    available = engine.get_available_scenes()
    target_scene = scene_id if scene_id in available else (available[0] if available else "hurricane-florence_00000050")
    
    # 1. SAR Live Forward pass
    vv = np.random.normal(-10.88, 2.7, size=(128, 128)).astype(np.float32)
    vh = np.random.normal(-17.16, 3.5, size=(128, 128)).astype(np.float32)
    sar_out = engine.run_sar_flood_inference(vv, vh)

    # 2. Scene Multimodal Fusion
    fusion_out = engine.predict_scene_fusion(target_scene)

    return {
        "status": "DEMO_EXECUTION_COMPLETE",
        "device": str(engine.device),
        "sarFloodUNetInference": sar_out,
        "multimodalBuildingRiskFusion": fusion_out,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
