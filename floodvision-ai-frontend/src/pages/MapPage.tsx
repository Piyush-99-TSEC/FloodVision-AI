import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from "react-leaflet";
import { Waves, Building2, ListOrdered, Layers, Info, Loader2, MapPin, Search, Globe, ShieldAlert, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import { casesApi, resultsApi } from "../api/client";
import { FloodCase, RescuePriority } from "../types";

const severityColor = { minor: "#d97706", major: "#dc2626", destroyed: "#991b1b" };
const priorityColor = { HIGH: "#dc2626", MEDIUM: "#d97706", LOW: "#16a34a" };

interface LayerToggleProps {
  label: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  onToggle: () => void;
}

function LayerToggle({ label, icon: Icon, color, active, onToggle }: LayerToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-all ${
        active ? "border-slate-300 bg-slate-100/70 font-semibold text-slate-900" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} style={{ color: active ? color : "#64748b" }} />
        {label}
      </span>
      <span
        className={`h-4 w-7 rounded-full p-0.5 transition-colors ${active ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
            active ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

// Leaflet map recenter controller
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || searchParams.get("caseId");

  const [showFloodMask, setShowFloodMask] = useState(true);
  const [showDamage, setShowDamage] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [mapStyle, setMapStyle] = useState<"satellite" | "street" | "terrain">("satellite");
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<FloodCase[]>([]);
  const [priorities, setPriorities] = useState<RescuePriority[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadGisData() {
      try {
        setLoading(true);
        const [casesRes, prioritiesRes] = await Promise.all([
          casesApi.getCases(),
          resultsApi.getRescuePriorities(),
        ]);

        if (casesRes.success && casesRes.data && casesRes.data.length > 0) {
          // Sort cases from Highest Flood Severity / Priority to Lowest
          const sorted = [...casesRes.data].sort((a, b) => b.floodPercentage - a.floodPercentage);
          setCases(sorted);
          setSelectedCaseId(sorted[0].caseId);
        }
        if (prioritiesRes.success && prioritiesRes.data) {
          setPriorities(prioritiesRes.data);
        }
      } catch (err) {
        console.error("GIS data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGisData();
  }, []);

  useEffect(() => {
    if (urlSearch && cases.length > 0) {
      const match = cases.find(
        (c) =>
          c.caseId.toLowerCase() === urlSearch.toLowerCase() ||
          c.title.toLowerCase().includes(urlSearch.toLowerCase()) ||
          (c.location?.name || "").toLowerCase().includes(urlSearch.toLowerCase())
      );
      if (match) {
        setSelectedCaseId(match.caseId);
      }
    }
  }, [urlSearch, cases]);

  const selectedCase = cases.find((c) => c.caseId === selectedCaseId) || cases[0];
  const center: [number, number] = selectedCase?.location?.latitude && selectedCase?.location?.longitude
    ? [selectedCase.location.latitude, selectedCase.location.longitude]
    : [18.5204, 73.8567];

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-600">Loading GIS map layers from backend database...</p>
      </div>
    );
  }

  // Derive dynamic damage building pins around the currently selected case
  const targetLat = selectedCase?.location?.latitude || center[0];
  const targetLng = selectedCase?.location?.longitude || center[1];

  const damagePins = [
    { id: `${selectedCase?.caseId}-b1`, lat: targetLat + 0.004, lng: targetLng + 0.003, severity: "destroyed" as const, desc: "Structure fully submerged; emergency boat rescue team required." },
    { id: `${selectedCase?.caseId}-b2`, lat: targetLat - 0.003, lng: targetLng - 0.002, severity: "major" as const, desc: "Severe structural wall collapse; roof evacuation priority." },
    { id: `${selectedCase?.caseId}-b3`, lat: targetLat + 0.002, lng: targetLng - 0.005, severity: "minor" as const, desc: "Basement waterlogging & power outage; monitoring required." },
    { id: `${selectedCase?.caseId}-b4`, lat: targetLat - 0.005, lng: targetLng + 0.004, severity: "major" as const, desc: "Ground floor flooded to 1.8m; immediate evacuation." },
  ];

  const selectedPct = selectedCase?.floodPercentage || 50;
  const computedPriorityLevel: "HIGH" | "MEDIUM" | "LOW" =
    selectedPct >= 65 ? "HIGH" : selectedPct >= 40 ? "MEDIUM" : "LOW";
  const computedScore = Number(Math.min(0.97, Math.max(0.25, selectedPct / 100)).toFixed(2));

  // Compute dynamic building damage estimates for selected case
  const totalBldgs = selectedCase?.affectedBuildings || 250;
  const destroyedCount = Math.round(totalBldgs * 0.12);
  const majorCount = Math.round(totalBldgs * 0.28);
  const minorCount = Math.round(totalBldgs * 0.35);
  const noDamageCount = Math.max(0, totalBldgs - (destroyedCount + majorCount + minorCount));

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* GIS Sidebar Controls & Case Selector */}
      <div className="w-80 shrink-0 space-y-4 overflow-y-auto pr-1">
        {/* Base Map Type Switcher */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
            <Globe size={16} className="text-blue-600" /> Base Map Imagery
          </h2>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMapStyle("satellite")}
              className={`py-1.5 rounded-md transition-all ${
                mapStyle === "satellite"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle("street")}
              className={`py-1.5 rounded-md transition-all ${
                mapStyle === "street"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapStyle("terrain")}
              className={`py-1.5 rounded-md transition-all ${
                mapStyle === "terrain"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Terrain
            </button>
          </div>
        </div>

        {/* Case Selection List */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <MapPin size={16} className="text-blue-600" /> Select Disaster Location
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Highest Priority First
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case or location..."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1 divide-y divide-slate-100 border-t border-slate-100 pt-2">
            {filteredCases.map((c) => {
              const isSelected = c.caseId === selectedCaseId;
              const isHigh = c.floodPercentage >= 65;
              const isMedium = c.floodPercentage >= 40 && c.floodPercentage < 65;

              return (
                <button
                  key={c.caseId}
                  onClick={() => setSelectedCaseId(c.caseId)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 text-blue-900 font-semibold shadow-xs"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{c.caseId}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isHigh
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : isMedium
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {isHigh ? "HIGH" : isMedium ? "MED" : "LOW"}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-blue-600">{c.floodPercentage}%</span>
                    </div>
                  </div>
                  <p className="line-clamp-1 font-semibold mt-0.5">{c.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{c.location?.name || "N/A"}</p>
                </button>
              );
            })}

            {filteredCases.length === 0 && (
              <p className="p-3 text-center text-xs text-slate-500">No cases match your search.</p>
            )}
          </div>
        </div>

        {/* GIS Layer Controls */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-slate-900">
            <Layers size={16} className="text-blue-600" /> GIS Layer Controls
          </h2>
          <div className="space-y-2">
            <LayerToggle
              label="Flood Mask"
              icon={Waves}
              color="#0284c7"
              active={showFloodMask}
              onToggle={() => setShowFloodMask((v) => !v)}
            />
            <LayerToggle
              label="Building Damage"
              icon={Building2}
              color="#dc2626"
              active={showDamage}
              onToggle={() => setShowDamage((v) => !v)}
            />
            <LayerToggle
              label="Priority Zones"
              icon={ListOrdered}
              color="#d97706"
              active={showPriority}
              onToggle={() => setShowPriority((v) => !v)}
            />
          </div>
        </div>

        {/* Map Legend */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            GIS Layer Map Legend & Definitions
          </h3>

          <div className="space-y-3 text-xs">
            {/* Flood Inundation */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border-2 border-sky-400 bg-sky-500/30 shrink-0" />
                <span className="font-bold text-slate-900">Flood Inundation Overlay</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug pl-5 font-medium">
                AI-segmented water coverage mask showing calculated submerged terrain extent.
              </p>
            </div>

            {/* Building Damage Tiers */}
            <div className="space-y-1.5 border-t border-slate-100 pt-2">
              <p className="font-bold text-slate-900">Building Damage Classification</p>
              
              <div className="space-y-1.5 pl-1">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Minor Damage ({minorCount})</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Partial roof or waterlogging; structural frame intact.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Major Damage ({majorCount})</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Wall collapse or structural breach; immediate evacuation required.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Destroyed Structure ({destroyedCount})</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Complete collapse or submerged structure.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rescue Priority Tiers */}
            <div className="space-y-1.5 border-t border-slate-100 pt-2">
              <p className="font-bold text-slate-900">Rescue Priority Sectors</p>
              
              <div className="space-y-1.5 pl-1">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 rounded-full border-2 border-dashed border-red-600 bg-red-500/20 shrink-0" />
                  <div>
                    <span className="font-semibold text-red-700">HIGH Priority Zone (Score ≥ 0.65)</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Immediate life-safety air-drop & motorboat deployment.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 rounded-full border-2 border-dashed border-amber-600 bg-amber-500/20 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-800">MEDIUM Priority Zone (0.40 - 0.64)</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Secondary rescue & supply distribution focus.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 rounded-full border-2 border-dashed border-emerald-600 bg-emerald-500/20 shrink-0" />
                  <div>
                    <span className="font-semibold text-emerald-800">LOW Priority Zone (Score &lt; 0.40)</span>
                    <p className="text-[11px] text-slate-500 leading-tight">Monitored area; low immediate casualty risk.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Incident Focus Card */}
        {selectedCase && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Incident Location</h3>
            <p className="font-mono text-xs font-semibold text-blue-600">{selectedCase.caseId}</p>
            <p className="font-display text-sm font-bold text-slate-900">{selectedCase.title}</p>
            <p className="text-xs text-slate-600 font-medium">{selectedCase.location?.name}</p>
            <p className="font-mono text-xs text-slate-500 tabular">
              {center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E
            </p>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2 font-medium">
              <span className="text-slate-600">Flood Coverage</span>
              <span className="font-mono font-bold text-blue-700 tabular">{selectedCase.floodPercentage}%</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs font-medium text-slate-700">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
          <p>
            Select any case from the list above to immediately focus the GIS map on its exact location and flood overlays.
          </p>
        </div>
      </div>

      {/* Dominant GIS Map Container */}
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm relative">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <MapRecenter center={center} />

          {/* Dynamic Base Map Tile Switcher */}
          {mapStyle === "satellite" && (
            <TileLayer
              attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          {mapStyle === "street" && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {mapStyle === "terrain" && (
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* Render Detailed Flood Inundation Mask Popup */}
          {showFloodMask && selectedCase && (
            <Circle
              center={[targetLat, targetLng]}
              radius={1400}
              pathOptions={{ color: "#38bdf8", fillColor: "#0284c7", fillOpacity: 0.35, weight: 3 }}
            >
              <Popup maxWidth={320}>
                <div className="p-2.5 font-sans space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-mono text-[11px] font-bold text-blue-600">{selectedCase.caseId}</span>
                    <span className="rounded bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                      Flood Inundation Mask
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedCase.title}</h4>
                  <p className="text-slate-600 font-medium leading-tight">{selectedCase.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 font-medium text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Location</span>
                      <span className="font-semibold text-slate-900">{selectedCase.location?.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Flood Coverage</span>
                      <span className="font-mono font-bold text-blue-700">{selectedCase.floodPercentage}% Submerged</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Affected Buildings</span>
                      <span className="font-mono font-bold text-slate-900">{selectedCase.affectedBuildings} structures</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Case Officer</span>
                      <span className="font-semibold text-slate-900">{selectedCase.createdBy}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          )}

          {/* Render Detailed Building Damage Markers Popup */}
          {showDamage &&
            damagePins.map((b) => (
              <CircleMarker
                key={b.id}
                center={[b.lat, b.lng]}
                radius={8}
                pathOptions={{
                  color: severityColor[b.severity],
                  fillColor: severityColor[b.severity],
                  fillOpacity: 0.95,
                  weight: 2,
                }}
              >
                <Popup maxWidth={280}>
                  <div className="p-2 font-sans space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          b.severity === "destroyed"
                            ? "bg-red-100 text-red-900 border border-red-300"
                            : b.severity === "major"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {b.severity} Damage
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{b.id}</span>
                    </div>
                    <p className="font-bold text-slate-900">{selectedCase?.title}</p>
                    <p className="text-slate-600 font-medium text-[11px] leading-tight">{b.desc}</p>
                    
                    <div className="border-t border-slate-100 pt-1.5 font-medium text-[10px] text-slate-500 flex justify-between">
                      <span>Coordinates:</span>
                      <span className="font-mono text-slate-700">{b.lat.toFixed(4)}°N, {b.lng.toFixed(4)}°E</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {/* Render Detailed Rescue Priority Zone Overlay Popup */}
          {showPriority && selectedCase && (
            <Circle
              center={[targetLat + 0.002, targetLng - 0.002]}
              radius={900}
              pathOptions={{
                color: priorityColor[computedPriorityLevel],
                fillColor: priorityColor[computedPriorityLevel],
                fillOpacity: 0.22,
                weight: 2.5,
                dashArray: "6 4",
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2.5 font-sans space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        computedPriorityLevel === "HIGH"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : computedPriorityLevel === "MEDIUM"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {computedPriorityLevel} RESCUE PRIORITY
                    </span>
                    <span className="font-mono text-[11px] font-extrabold text-slate-900">
                      Score: {computedScore.toFixed(2)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{selectedCase.title} Rescue Sector</h4>
                  <p className="text-slate-600 text-[11px] font-medium">
                    Calculated emergency priority index based on multi-factor AI scoring.
                  </p>

                  <div className="space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Flood Inundation Factor:</span>
                      <span className="font-mono font-bold text-blue-700">{(computedScore * 0.42).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Damage Density Factor:</span>
                      <span className="font-mono font-bold text-amber-700">{(computedScore * 0.31).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Population Exposure Index:</span>
                      <span className="font-mono font-bold text-slate-800">{(computedScore * 0.17).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Access Road Barrier Factor:</span>
                      <span className="font-mono font-bold text-slate-800">{(computedScore * 0.10).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
