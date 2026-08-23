import { useState } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from "react-leaflet";
import { Waves, Building2, ListOrdered, Layers } from "lucide-react";
import { mapZones, floodCases } from "../data/mockData";

const severityColor = { minor: "#F5A524", major: "#F0465A", destroyed: "#7A1B27" };
const priorityColor = { HIGH: "#F0465A", MEDIUM: "#F5A524", LOW: "#2BC48A" };

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
      className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
        active ? "border-ink-600 bg-ink-700/40 text-slate-100" : "border-ink-700 text-slate-500"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: active ? color : "#6B7690" }} />
        {label}
      </span>
      <span
        className={`h-4 w-7 rounded-full p-0.5 transition-colors ${active ? "bg-flood-500" : "bg-ink-600"}`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-ink-950 transition-transform ${
            active ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default function MapPage() {
  const [showFloodMask, setShowFloodMask] = useState(true);
  const [showDamage, setShowDamage] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const center: [number, number] = [13.1362, 78.1298];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-72 shrink-0 space-y-4">
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-4 shadow-panel">
          <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-slate-100">
            <Layers size={15} className="text-flood-400" /> Map Layers
          </h2>
          <div className="space-y-2">
            <LayerToggle
              label="Flood Mask"
              icon={Waves}
              color="#3DD6E3"
              active={showFloodMask}
              onToggle={() => setShowFloodMask((v) => !v)}
            />
            <LayerToggle
              label="Building Damage"
              icon={Building2}
              color="#F0465A"
              active={showDamage}
              onToggle={() => setShowDamage((v) => !v)}
            />
            <LayerToggle
              label="Priority Zones"
              icon={ListOrdered}
              color="#F5A524"
              active={showPriority}
              onToggle={() => setShowPriority((v) => !v)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-4 shadow-panel">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Active Case</h3>
          <p className="font-display text-sm font-semibold text-slate-100">{floodCases[0].title}</p>
          <p className="mt-1 font-mono text-xs text-slate-500 tabular">
            {center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Flood coverage</span>
            <span className="font-mono text-flood-400 tabular">{floodCases[0].floodPercentage}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-4 shadow-panel text-xs text-slate-500">
          Layers are designed to accept live AI-generated GeoJSON and segmentation masks once the
          Deep Learning service replaces mock data.
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-ink-700 shadow-panel">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {showFloodMask &&
            mapZones.floodMask.map((z) => (
              <Circle
                key={z.id}
                center={[z.lat, z.lng]}
                radius={z.radius}
                pathOptions={{ color: "#3DD6E3", fillColor: "#3DD6E3", fillOpacity: 0.18, weight: 1.5 }}
              >
                <Popup>Flood mask segment — model-generated boundary</Popup>
              </Circle>
            ))}

          {showDamage &&
            mapZones.damagedBuildings.map((b) => (
              <CircleMarker
                key={b.id}
                center={[b.lat, b.lng]}
                radius={7}
                pathOptions={{
                  color: severityColor[b.severity],
                  fillColor: severityColor[b.severity],
                  fillOpacity: 0.9,
                  weight: 1,
                }}
              >
                <Popup>Building damage: {b.severity}</Popup>
              </CircleMarker>
            ))}

          {showPriority &&
            mapZones.priorityZones.map((p) => (
              <Circle
                key={p.id}
                center={[p.lat, p.lng]}
                radius={600}
                pathOptions={{
                  color: priorityColor[p.level],
                  fillColor: priorityColor[p.level],
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: "6 4",
                }}
              >
                <Popup>
                  {p.label} — Priority {p.level}
                </Popup>
              </Circle>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
