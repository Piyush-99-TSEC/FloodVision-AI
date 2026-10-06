import os
import sys
import argparse
import numpy as np

# Ensure local imports work cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.inference_engine import engine

def main():
    parser = argparse.ArgumentParser(description="Live Multimodal AI Perception & Fusion Demonstration CLI")
    parser.add_argument("--scene", type=str, default="hurricane-florence_00000050", help="Scene ID to evaluate")
    parser.add_argument("--list-scenes", action="store_true", help="List all 30 available scenes")
    args = parser.parse_args()

    print("=" * 80)
    print(" FLOODVISION-AI — LIVE MULTIMODAL DEEP LEARNING DEMONSTRATION")
    print("=" * 80)
    print(f"[*] PyTorch Device            : {engine.device}")
    print(f"[*] Checkpoint Loaded         : {engine.checkpoint_loaded}")
    print(f"[*] Checkpoint Path           : {engine.checkpoint_path}")
    print(f"[*] Total Validated Scenes    : {len(engine.get_available_scenes())}")
    print("=" * 80)

    if args.list_scenes:
        print("\nAvailable Disaster Scenes:")
        for idx, s in enumerate(engine.get_available_scenes(), 1):
            print(f"  {idx:2d}. {s}")
        print("=" * 80)
        return

    # Step 1: Live SAR Flood U-Net Forward Pass
    print("\n[STEP 1] Running Live Sentinel-1 SAR Flood U-Net Forward Pass...")
    vv = np.random.normal(-10.88, 2.7, size=(128, 128)).astype(np.float32)
    vh = np.random.normal(-17.16, 3.5, size=(128, 128)).astype(np.float32)
    vv[40:80, 40:80] -= 7.5
    vh[40:80, 40:80] -= 9.0

    sar_res = engine.run_sar_flood_inference(vv, vh)
    print(f"   -> Input Shape               : [1, 2, 128, 128] (Channels: VV, VH)")
    print(f"   -> Standardization           : (VV - VV_MEAN)/VV_STD, (VH - VH_MEAN)/VH_STD")
    print(f"   -> Flood U-Net Output Pixels : {sar_res['floodPixels']} / {sar_res['totalPixels']} flooded ({sar_res['floodPercentage']}%)")

    # Step 2: Live Multimodal Building Risk Fusion
    scene_id = args.scene
    print(f"\n[STEP 2] Running Multimodal Perception & Risk Fusion on Scene: {scene_id}...")
    try:
        fusion_res = engine.predict_scene_fusion(scene_id)
        print(f"   -> Detected Structures       : {fusion_res['totalBuildingsDetected']} buildings")
        print(f"   -> Mean Flood Exposure (Ei)  : {fusion_res['meanFloodExposureEi']:.4f}")
        print(f"   -> Mean Damage Severity (Si) : {fusion_res['meanDamageSeveritySi']:.4f}")
        print(f"   -> Mean Composite Risk (Ri)  : {fusion_res['meanRiskScoreRi']:.4f}")
        print(f"   -> Risk Categories           : {fusion_res['riskCategoryDistribution']}")

        print("\n[STEP 3] Detailed Building Perception Records (First 5):")
        print(f"   {'Bldg ID':<10} {'Area (px)':<12} {'Ei (Flood)':<12} {'Si (Damage)':<14} {'Ri (Risk)':<12} {'Category':<10}")
        print("   " + "-" * 70)
        for b in fusion_res['buildingRisks'][:5]:
            print(f"   #{b['buildingId']:<9} {b['areaPixels']:<12.0f} {b['floodExposureEi']:<12.4f} {b['damageSeveritySi']:<14.4f} {b['riskScoreRi']:<12.4f} {b['priorityCategory']:<10}")

        print("=" * 80)
        print(" [SUCCESS] LIVE DEEP LEARNING MODEL DEMO COMPLETED")
        print("=" * 80)
    except Exception as e:
        print(f"   [Error] Could not process scene: {e}")

if __name__ == "__main__":
    main()
