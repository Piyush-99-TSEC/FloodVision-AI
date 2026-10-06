import fs from "fs";
import path from "path";
import { IRescueTask, TaskUrgency, TaskType, TaskStatus } from "../models/RescueTask";

export interface RescueTaskDTO {
  taskId: string;
  sceneId: string;
  buildingId: number;
  location: {
    centroidX: number;
    centroidY: number;
    latitude: number;
    longitude: number;
    areaPixels: number;
  };
  riskScore: number;
  riskCategory: "Critical" | "High" | "Moderate" | "Low";
  floodExposure: number;
  damageSeverity: number;
  taskType: TaskType;
  urgency: TaskUrgency;
  taskReason: string;
  requiredResources: string[];
  estimatedPersonnel: string;
  taskStatus: TaskStatus;
}

export interface TaskFilterOptions {
  sceneId?: string;
  urgency?: TaskUrgency;
  taskType?: TaskType;
  riskCategory?: string;
  status?: TaskStatus;
  search?: string;
}

export interface TaskStatistics {
  totalTasks: number;
  urgencyCounts: Record<TaskUrgency, number>;
  taskTypeCounts: Record<string, number>;
  riskCategoryCounts: Record<string, number>;
  statusCounts: Record<TaskStatus, number>;
  averageRiskScore: number;
}

// In-memory cache for fast, deterministic retrieval of validated tasks
let cachedTasks: RescueTaskDTO[] | null = null;
let sceneGeometries: Record<string, { minLon: number; maxLon: number; minLat: number; maxLat: number; centerLat: number; centerLon: number }> = {};

/**
 * Loads GeoJSON metadata to map pixel centroids (0..128) to real-world GPS coordinates (lat/lng).
 */
function loadSceneGeometries() {
  if (Object.keys(sceneGeometries).length > 0) return;

  const possiblePaths = [
    path.resolve(process.cwd(), "metadata/xbd_s12_metadata.geojson"),
    path.resolve(process.cwd(), "../metadata/xbd_s12_metadata.geojson"),
    path.resolve(__dirname, "../../../metadata/xbd_s12_metadata.geojson"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        const geojson = JSON.parse(raw);
        for (const feat of geojson.features || []) {
          const uid = feat.properties?.xbd_uid;
          const coords = feat.geometry?.coordinates?.[0];
          if (uid && Array.isArray(coords) && coords.length >= 3) {
            const lons = coords.map((c: number[]) => c[0]);
            const lats = coords.map((c: number[]) => c[1]);
            sceneGeometries[uid] = {
              minLon: Math.min(...lons),
              maxLon: Math.max(...lons),
              minLat: Math.min(...lats),
              maxLat: Math.max(...lats),
              centerLon: (Math.min(...lons) + Math.max(...lons)) / 2,
              centerLat: (Math.min(...lats) + Math.max(...lats)) / 2,
            };
          }
        }
        break;
      } catch (err) {
        console.warn("Failed reading GeoJSON at path:", p, err);
      }
    }
  }
}

/**
 * Fallback coordinate resolver for disaster scenarios if GeoJSON bounds are unindexed
 */
function getFallbackCoordinates(sceneId: string, cx: number, cy: number) {
  const normX = (cx - 64) * 0.0001;
  const normY = (cy - 64) * 0.0001;

  if (sceneId.includes("florence")) return { lat: 33.6076 - normY, lng: -79.0521 + normX };
  if (sceneId.includes("matthew")) return { lat: 29.8947 - normY, lng: -81.3145 + normX };
  if (sceneId.includes("harvey")) return { lat: 29.7604 - normY, lng: -95.3698 + normX };
  if (sceneId.includes("michael")) return { lat: 30.1588 - normY, lng: -85.6602 + normX };
  if (sceneId.includes("palu")) return { lat: -0.8917 - normY, lng: 119.8707 + normX };
  if (sceneId.includes("nepal")) return { lat: 27.7172 - normY, lng: 85.3240 + normX };
  if (sceneId.includes("sunda")) return { lat: -6.1021 - normY, lng: 105.4230 + normX };
  if (sceneId.includes("guatemala")) return { lat: 14.3871 - normY, lng: -90.8132 + normX };
  if (sceneId.includes("midwest")) return { lat: 41.2565 - normY, lng: -95.9345 + normX };
  if (sceneId.includes("puna")) return { lat: 19.4674 - normY, lng: -154.9125 + normX };
  if (sceneId.includes("mexico")) return { lat: 19.4326 - normY, lng: -99.1332 + normX };
  if (sceneId.includes("wildfire") || sceneId.includes("fire")) return { lat: 38.4404 - normY, lng: -122.7141 + normX };
  return { lat: 33.6076 - normY, lng: -79.0521 + normX };
}

/**
 * Generates Rescue Tasks deterministically from 30_scene_building_risks.csv
 */
export function generateRescueTasksFromValidatedData(): RescueTaskDTO[] {
  if (cachedTasks && cachedTasks.length > 0) {
    return cachedTasks;
  }

  loadSceneGeometries();

  const possibleCsvPaths = [
    path.resolve(process.cwd(), "research-content/fusion_validation_30/30_scene_building_risks.csv"),
    path.resolve(process.cwd(), "../research-content/fusion_validation_30/30_scene_building_risks.csv"),
    path.resolve(__dirname, "../../../research-content/fusion_validation_30/30_scene_building_risks.csv"),
  ];

  let csvContent = "";
  for (const p of possibleCsvPaths) {
    if (fs.existsSync(p)) {
      csvContent = fs.readFileSync(p, "utf-8");
      break;
    }
  }

  if (!csvContent) {
    throw new Error("Could not find validated building risks file: 30_scene_building_risks.csv");
  }

  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].split(",").map((h) => h.trim());
  const sceneIdx = header.indexOf("scene_id");
  const bldgIdx = header.indexOf("building_id");
  const cxIdx = header.indexOf("centroid_x");
  const cyIdx = header.indexOf("centroid_y");
  const areaIdx = header.indexOf("area_pixels");
  const eiIdx = header.indexOf("flood_exposure_Ei");
  const siIdx = header.indexOf("damage_severity_Si");
  const riIdx = header.indexOf("risk_score_Ri");
  const catIdx = header.indexOf("priority_category");

  const tasks: RescueTaskDTO[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length < 9) continue;

    const sceneId = cols[sceneIdx];
    const buildingId = parseInt(cols[bldgIdx], 10);
    const centroidX = parseFloat(cols[cxIdx]);
    const centroidY = parseFloat(cols[cyIdx]);
    const areaPixels = parseFloat(cols[areaIdx]);
    const floodExposure = parseFloat(cols[eiIdx]);
    const damageSeverity = parseFloat(cols[siIdx]);
    const riskScore = parseFloat(cols[riIdx]);
    const rawCategory = cols[catIdx];

    // Normalize Risk Category
    let riskCategory: "Critical" | "High" | "Moderate" | "Low" = "Low";
    if (rawCategory === "Critical" || riskScore >= 0.75) riskCategory = "Critical";
    else if (rawCategory === "High" || riskScore >= 0.50) riskCategory = "High";
    else if (rawCategory === "Moderate" || riskScore >= 0.25) riskCategory = "Moderate";
    else riskCategory = "Low";

    // Operational Urgency Determination (Frozen Ri -> Deterministic Urgency)
    let urgency: TaskUrgency = "Low";
    if (riskCategory === "Critical") urgency = "Critical";
    else if (riskCategory === "High") urgency = "High";
    else if (riskCategory === "Moderate") urgency = "Medium";
    else urgency = "Low";

    // Task Type & Reasoning Logic (Using Ei and Si as explainable operational evidence)
    let taskType: TaskType = "Monitoring / Routine Assessment";
    let taskReason = "";
    let requiredResources: string[] = [];
    let estimatedPersonnel = "1-2 personnel";

    if (riskCategory === "Critical" || riskCategory === "High") {
      if (floodExposure > 0.05) {
        // High composite risk with active flood exposure
        taskType = "Immediate Rescue / Evacuation Assessment";
        taskReason = `High composite risk (Ri=${riskScore.toFixed(3)}) with active flood inundation exposure (Ei=${floodExposure.toFixed(2)}) and structural damage (Si=${damageSeverity.toFixed(2)}). Immediate waterborne rescue/evacuation required.`;
        requiredResources = ["Rescue Team", "Boat", "Drone", "Medical Unit"];
        estimatedPersonnel = riskCategory === "Critical" ? "6-8 personnel (Multi-disciplinary squad)" : "4-6 personnel";
      } else {
        // High composite risk with minimal flood but high structural damage
        taskType = "Structural Safety / Rescue Assessment";
        taskReason = `High composite risk (Ri=${riskScore.toFixed(3)}) driven primarily by severe structural damage (Si=${damageSeverity.toFixed(2)}) with limited direct floodwater (Ei=${floodExposure.toFixed(2)}). Structural stabilization and search assessment required.`;
        requiredResources = ["Structural Assessment Team", "Heavy Equipment", "Rescue Team", "Medical Unit"];
        estimatedPersonnel = riskCategory === "Critical" ? "6-8 personnel (Multi-disciplinary squad)" : "4-6 personnel";
      }
    } else if (riskCategory === "Moderate") {
      taskType = "Priority Welfare Check / Inspection";
      taskReason = `Moderate composite risk (Ri=${riskScore.toFixed(3)}) with moderate exposure/damage conditions (Ei=${floodExposure.toFixed(2)}, Si=${damageSeverity.toFixed(2)}). Priority welfare check and asset inspection advised.`;
      requiredResources = floodExposure > 0.1 ? ["Rescue Team", "Boat", "Drone"] : ["Rescue Team", "Drone", "Medical Unit"];
      estimatedPersonnel = "2-4 personnel";
    } else {
      taskType = "Monitoring / Routine Assessment";
      taskReason = `Low composite risk score (Ri=${riskScore.toFixed(3)}). Direct flood inundation (Ei=${floodExposure.toFixed(2)}) and damage (Si=${damageSeverity.toFixed(2)}) minimal. Standard routine monitoring assigned.`;
      requiredResources = ["Drone", "Rescue Team"];
      estimatedPersonnel = "1-2 personnel";
    }

    // Precise Lat / Lng Coordinate Projection from GeoJSON bounds
    let lat: number;
    let lng: number;
    const geom = sceneGeometries[sceneId];
    if (geom) {
      // 128x128 SAR/optical grid projection
      lng = geom.minLon + (centroidX / 128.0) * (geom.maxLon - geom.minLon);
      lat = geom.maxLat - (centroidY / 128.0) * (geom.maxLat - geom.minLat);
    } else {
      const fb = getFallbackCoordinates(sceneId, centroidX, centroidY);
      lat = fb.lat;
      lng = fb.lng;
    }

    // Format consistent unique task ID: TASK-<SCENE_ID>-B<BUILDING_ID>
    const cleanSceneTag = sceneId.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const taskId = `TASK-${cleanSceneTag}-B${String(buildingId).padStart(3, "0")}`;

    tasks.push({
      taskId,
      sceneId,
      buildingId,
      location: {
        centroidX,
        centroidY,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        areaPixels,
      },
      riskScore,
      riskCategory,
      floodExposure,
      damageSeverity,
      taskType,
      urgency,
      taskReason,
      requiredResources,
      estimatedPersonnel,
      taskStatus: "PENDING",
    });
  }

  cachedTasks = tasks;
  return tasks;
}

/**
 * Queries tasks with filtering, search, and pagination
 */
export function getRescueTasks(options: TaskFilterOptions = {}): RescueTaskDTO[] {
  let list = generateRescueTasksFromValidatedData();

  if (options.sceneId) {
    list = list.filter((t) => t.sceneId.toLowerCase() === options.sceneId!.toLowerCase());
  }

  if (options.urgency) {
    list = list.filter((t) => t.urgency.toLowerCase() === options.urgency!.toLowerCase());
  }

  if (options.taskType) {
    list = list.filter((t) => t.taskType.toLowerCase() === options.taskType!.toLowerCase());
  }

  if (options.riskCategory) {
    list = list.filter((t) => t.riskCategory.toLowerCase() === options.riskCategory!.toLowerCase());
  }

  if (options.status) {
    list = list.filter((t) => t.taskStatus.toLowerCase() === options.status!.toLowerCase());
  }

  if (options.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.taskId.toLowerCase().includes(q) ||
        t.sceneId.toLowerCase().includes(q) ||
        t.taskType.toLowerCase().includes(q) ||
        t.taskReason.toLowerCase().includes(q) ||
        t.requiredResources.some((r) => r.toLowerCase().includes(q))
    );
  }

  // Default sorting: Highest Risk Score and Urgency first
  return list.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Retrieves a single task by taskId or buildingId+sceneId
 */
export function getRescueTaskById(taskId: string): RescueTaskDTO | null {
  const all = generateRescueTasksFromValidatedData();
  const directMatch = all.find((t) => t.taskId.toLowerCase() === taskId.toLowerCase());
  if (directMatch) return directMatch;

  // Partial match by task ID or scene
  return all.find((t) => t.taskId.toLowerCase().includes(taskId.toLowerCase())) || null;
}

/**
 * Computes comprehensive task generation summary statistics
 */
export function getRescueTaskStatistics(): TaskStatistics {
  const tasks = generateRescueTasksFromValidatedData();

  const urgencyCounts: Record<TaskUrgency, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  const taskTypeCounts: Record<string, number> = {
    "Immediate Rescue / Evacuation Assessment": 0,
    "Structural Safety / Rescue Assessment": 0,
    "Priority Welfare Check / Inspection": 0,
    "Monitoring / Routine Assessment": 0,
  };

  const riskCategoryCounts: Record<string, number> = {
    Critical: 0,
    High: 0,
    Moderate: 0,
    Low: 0,
  };

  const statusCounts: Record<TaskStatus, number> = {
    PENDING: 0,
    ASSIGNED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  let sumRisk = 0;

  for (const t of tasks) {
    urgencyCounts[t.urgency] = (urgencyCounts[t.urgency] || 0) + 1;
    taskTypeCounts[t.taskType] = (taskTypeCounts[t.taskType] || 0) + 1;
    riskCategoryCounts[t.riskCategory] = (riskCategoryCounts[t.riskCategory] || 0) + 1;
    statusCounts[t.taskStatus] = (statusCounts[t.taskStatus] || 0) + 1;
    sumRisk += t.riskScore;
  }

  const total = tasks.length;
  return {
    totalTasks: total,
    urgencyCounts,
    taskTypeCounts,
    riskCategoryCounts,
    statusCounts,
    averageRiskScore: total > 0 ? parseFloat((sumRisk / total).toFixed(4)) : 0,
  };
}
