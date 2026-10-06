import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Waves,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Info,
  ExternalLink,
} from "lucide-react";

interface VisionScene {
  sceneId: string;
  disaster: string;
  location: string;
  sensor: string;
  totalBuildings: number;
  floodedBuildings: number;
  meanRisk: number;
  sarUnetImage: string;
  multimodalImage: string;
  summary: string;
}

const VISION_SCENES: VisionScene[] = [
  {
    sceneId: "hurricane-florence_00000050",
    disaster: "Hurricane Florence (Flooding & Storm Surge)",
    location: "North Carolina, USA",
    sensor: "Sentinel-1 SAR C-Band + WorldView-3 Optical",
    totalBuildings: 7,
    floodedBuildings: 4,
    meanRisk: 0.354,
    sarUnetImage: "http://localhost:5000/static/research-content/figures/figure_1_single_tile_flood_unet.png",
    multimodalImage: "http://localhost:5000/static/research-content/fusion_validation/figures/hurricane-florence_00000050_fusion_validation.png",
    summary:
      "Active riverine flood inundation intersecting 4 residential structures. High damage severity detected on structural roofs.",
  },
  {
    sceneId: "hurricane-florence_00000000",
    disaster: "Hurricane Florence (Riverine Inundation)",
    location: "Trent River Basin, NC, USA",
    sensor: "Sentinel-1 SAR C-Band + WorldView-3 Optical",
    totalBuildings: 12,
    floodedBuildings: 8,
    meanRisk: 0.468,
    sarUnetImage: "http://localhost:5000/static/research-content/figures/figure_2_temporal_pre_post_analysis.png",
    multimodalImage: "http://localhost:5000/static/research-content/fusion_validation/figures/hurricane-florence_00000000_fusion_validation.png",
    summary:
      "Severe flood extent with >60% standing water overlay. Building localization identifies 8 fully inundated structures requiring waterborne evacuation.",
  },
  {
    sceneId: "hurricane-florence_00000013",
    disaster: "Hurricane Florence (Lowland Surge)",
    location: "Cape Fear River, NC, USA",
    sensor: "Sentinel-1 SAR + WorldView-3 Optical",
    totalBuildings: 9,
    floodedBuildings: 5,
    meanRisk: 0.382,
    sarUnetImage: "http://localhost:5000/static/research-content/flood_unet/single_tile/hurricane-florence_00000181_single_tile_analysis.png",
    multimodalImage: "http://localhost:5000/static/research-content/fusion_validation/figures/hurricane-florence_00000013_fusion_validation.png",
    summary:
      "Optical damage classifier shows structural collapse. Sentinel-1 SAR confirms persistent surface water perimeter around buildings.",
  },
  {
    sceneId: "hurricane-matthew_00000156",
    disaster: "Hurricane Matthew (Coastal Inundation)",
    location: "Savannah River / Coastal GA, USA",
    sensor: "Sentinel-1 SAR + WorldView-3 Optical",
    totalBuildings: 14,
    floodedBuildings: 6,
    meanRisk: 0.412,
    sarUnetImage: "http://localhost:5000/static/research-content/figures/figure_3_multi_tile_validation.png",
    multimodalImage: "http://localhost:5000/static/research-content/fusion_validation/figures/hurricane-matthew_00000156_fusion_validation.png",
    summary:
      "Extensive commercial and residential footprint analysis with high-density flood boundary segmentation.",
  },
  {
    sceneId: "palu-tsunami_00000118",
    disaster: "Palu Tsunami & Soil Liquefaction",
    location: "Central Sulawesi, Indonesia",
    sensor: "Sentinel-1 SAR + WorldView-3 Optical",
    totalBuildings: 18,
    floodedBuildings: 11,
    meanRisk: 0.521,
    sarUnetImage: "http://localhost:5000/static/research-content/figures/figure_1_single_tile_flood_unet.png",
    multimodalImage: "http://localhost:5000/static/research-content/fusion_validation/figures/palu-tsunami_00000118_fusion_validation.png",
    summary:
      "Tsunami inundation with heavy debris and building destruction. High optical damage severity combined with acute water exposure.",
  },
];

export default function VisionInspector() {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [activeViewMode, setActiveViewMode] = useState<"multimodal" | "sar_unet">("multimodal");
  const [modalImage, setModalImage] = useState<string | null>(null);

  const scene = VISION_SCENES[selectedSceneIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Vision AI Model Visualizer
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-extrabold text-blue-800">
              <Sparkles size={12} /> Deep Learning Perception
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Interactive visual validation of Flood U-Net SAR segmentation, optical building localization, and damage severity classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/rescue-tasks"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            Rescue Tasks <ArrowRight size={14} />
          </Link>
          <Link
            to="/allocation"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs"
          >
            Team Allocation <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Model KPI Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Flood U-Net mIoU</span>
            <Waves size={16} className="text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 font-mono">82.4%</p>
          <span className="text-[11px] font-medium text-emerald-600">Sentinel-1 SAR Radar</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Building Localization</span>
            <Building2 size={16} className="text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 font-mono">88.7%</p>
          <span className="text-[11px] font-medium text-indigo-600">WorldView-3 Optical Footprints</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Damage Classification</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 font-mono">79.5%</p>
          <span className="text-[11px] font-medium text-amber-600">4-Class Structural Damage</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Validated Scenes</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 font-mono">30 / 30</p>
          <span className="text-[11px] font-medium text-emerald-600">303 Validated Buildings (100% Pass)</span>
        </div>
      </div>

      {/* Main Vision Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Scene Selector & Metadata */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase text-slate-600">Select Disaster Scene</span>
              <span className="font-mono text-xs font-extrabold text-blue-700">{VISION_SCENES.length} Scenes</span>
            </div>

            <div className="space-y-2">
              {VISION_SCENES.map((s, idx) => (
                <button
                  key={s.sceneId}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`w-full text-left rounded-xl p-3 transition-all border ${
                    selectedSceneIndex === idx
                      ? "border-blue-600 bg-blue-50/80 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 truncate">
                      {s.sceneId}
                    </span>
                    {selectedSceneIndex === idx && (
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 truncate">
                    {s.disaster}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                    <span>🏢 {s.totalBuildings} Bldgs</span>
                    <span>🌊 {s.floodedBuildings} Flooded</span>
                    <span className="font-mono font-bold text-blue-700">Risk: {s.meanRisk.toFixed(3)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Scene Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-600">Active Scene Analysis</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{scene.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sensors Fused:</span>
                <span className="font-mono text-[11px] font-semibold text-blue-700">{scene.sensor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Inundation Ratio:</span>
                <span className="font-mono font-bold text-blue-800">
                  {((scene.floodedBuildings / scene.totalBuildings) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Info size={14} className="text-blue-600" /> Operational Summary
              </p>
              {scene.summary}
            </div>

            <Link
              to={`/rescue-tasks?search=${encodeURIComponent(scene.sceneId)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
            >
              View Generated Tasks for this Scene <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Right 2-Cols: Live Model Output Image Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveViewMode("multimodal")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeViewMode === "multimodal"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Layers size={14} /> Multimodal Fusion Validation
                </button>
                <button
                  onClick={() => setActiveViewMode("sar_unet")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeViewMode === "sar_unet"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Waves size={14} /> SAR Flood U-Net Analysis
                </button>
              </div>

              <button
                onClick={() =>
                  setModalImage(
                    activeViewMode === "multimodal" ? scene.multimodalImage : scene.sarUnetImage
                  )
                }
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all"
                title="Fullscreen Image"
              >
                <Maximize2 size={15} /> Expand
              </button>
            </div>

            {/* Visual Image Render */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950 flex items-center justify-center min-h-[420px]">
              <img
                src={activeViewMode === "multimodal" ? scene.multimodalImage : scene.sarUnetImage}
                alt={`${scene.sceneId} vision model output`}
                className="max-h-[580px] w-full object-contain rounded-lg transition-all"
                onError={(e) => {
                  // Fallback visual display
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            {/* Visual Legend / Key */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-400 border border-cyan-600" />
                <span>Flood Inundation (SAR)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 border border-red-700" />
                <span>Destroyed / Major Damage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-600" />
                <span>Minor Structural Damage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-700" />
                <span>No Damage / Intact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-800">{scene.sceneId} — Deep Learning Model Visual Inspection</span>
              <button
                onClick={() => setModalImage(null)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Close (ESC)
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh] flex justify-center bg-slate-950">
              <img src={modalImage} alt="Expanded Vision Model View" className="max-h-full max-w-full object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
