# RESCUE TASK GENERATION MODULE — END-TO-END SPECIFICATION & VALIDATION REPORT

**Project**: ROSP / FloodVision-AI  
**Module**: Rescue Task Generation  
**Dataset**: xBD-S12 (30-Scene Multimodal Fusion Validation Set)  
**Input Records**: 303 Building-Level Multimodal Risk Assessments  
**QC Status**: PASS  
**Task Status**: ALL INITIAL TASKS PENDING (Stage 1 Operational Preparation)

---

## 1. Executive Summary & Purpose

The **Rescue Task Generation Module** bridges the gap between AI disaster perception and field emergency operations. It ingests frozen, validated building-level multimodal risk outputs ($E_i$ flood exposure, $S_i$ structural damage severity, and $R_i$ composite risk score) and deterministically maps them into explainable, actionable rescue tasks for incident commanders.

### Key Conceptual Distinctions:
1. **RISK ($R_i \in [0, 1]$)**: Quantitative assessment of physical hazard impact, floodwater immersion, and structural failure severity on a specific building structure.
2. **TASK (Operational Directive)**: Specific operational mission recommended for emergency responders (e.g., *Immediate Waterborne Rescue*, *Structural Safety Assessment*, *Welfare Check*, or *Routine Monitoring*).
3. **URGENCY**: Operational response urgency determining tactical timing without modifying the underlying frozen risk category.
4. **DISPATCH STATUS**: Operational state. In this module, all generated tasks are initialized to `PENDING` awaiting downstream optimal resource/team allocation.

> **CRITICAL ARCHITECTURAL GUARANTEE**: No machine learning weights, SAR preprocessing formulas, flood exposure ($E_i$), damage severity ($S_i$), or composite risk scores ($R_i$) were modified. The input dataset `30_scene_building_risks.csv` is strictly read-only.

---

## 2. Input Data Profile

* **Source File**: `research-content/fusion_validation_30/30_scene_building_risks.csv`
* **Total Scenes Analyzed**: 30 diverse global disaster scenes (floods, hurricanes, tsunamis, earthquakes, wildfires, volcanic events)
* **Total Building Records**: 303 structures
* **Data Fields Ingested**:
  * `scene_id`: Unique disaster event identifier (e.g., `hurricane-florence_00000050`)
  * `building_id`: Integer identifier per scene
  * `centroid_x`, `centroid_y`: SAR/optical pixel coordinate centroids
  * `area_pixels`: Structural footprint area
  * `flood_exposure_Ei`: Calculated SAR temporal inundation metric ($E_i \in [0, 1]$)
  * `damage_severity_Si`: Post-disaster structural degradation metric ($S_i \in [0, 1]$)
  * `risk_score_Ri`: Composite risk index ($R_i = 0.50 \cdot E_i + 0.50 \cdot S_i$)
  * `priority_category`: Frozen risk classification (`Critical`, `High`, `Moderate`, `Low`)

---

## 3. Rescue Task Generation Logic

Operational task types are selected through transparent, explainable decision logic using both composite risk ($R_i$) and the underlying hazard components ($E_i$ and $S_i$):

| Task Type | Trigger Logic | Explainable Rationale Narrative |
| :--- | :--- | :--- |
| **Immediate Rescue / Evacuation Assessment** | $R_i \ge 0.50$ (High/Critical) AND $E_i > 0.05$ (Active Inundation) | *"High composite risk with active flood inundation exposure and structural damage. Immediate waterborne rescue and evacuation required."* |
| **Structural Safety / Rescue Assessment** | $R_i \ge 0.50$ (High/Critical) AND $E_i \le 0.05$ ($S_i \ge 0.50$) | *"High composite risk driven primarily by severe structural damage with limited direct floodwater. Structural stabilization and search assessment required."* |
| **Priority Welfare Check / Inspection** | $0.25 \le R_i < 0.50$ (Moderate Risk) | *"Moderate composite risk with moderate exposure/damage conditions. Priority welfare check and asset inspection advised."* |
| **Monitoring / Routine Assessment** | $R_i < 0.25$ (Low Risk) | *"Low composite risk score. Direct flood inundation and damage minimal. Standard routine monitoring assigned."* |

---

## 4. Operational Urgency Mapping

Urgency is assigned deterministically from the frozen building risk level:
* **Critical Urgency**: $R_i \ge 0.75$ (`Critical` Risk Category)
* **High Urgency**: $0.50 \le R_i < 0.75$ (`High` Risk Category)
* **Medium Urgency**: $0.25 \le R_i < 0.50$ (`Moderate` Risk Category)
* **Low Urgency**: $R_i < 0.25$ (`Low` Risk Category)

---

## 5. Resource Requirements & Personnel Estimation

Resource recommendations reflect the tactical capabilities required to address the hazard conditions:

| Task Condition | Recommended Resource Types | Estimated Personnel (Design Assumption) |
| :--- | :--- | :--- |
| **Critical Urgency + Active Flood** | `["Rescue Team", "Boat", "Drone", "Medical Unit"]` | 6–8 Personnel (Multi-disciplinary squad) |
| **High Urgency + Active Flood** | `["Rescue Team", "Boat", "Drone", "Medical Unit"]` | 4–6 Personnel |
| **High / Critical + Severe Damage ($S_i \ge 0.5$)** | `["Structural Assessment Team", "Heavy Equipment", "Rescue Team", "Medical Unit"]` | 4–6 Personnel |
| **Moderate Urgency (Welfare Check)** | `["Rescue Team", "Boat", "Drone"]` or `["Rescue Team", "Drone", "Medical Unit"]` | 2–4 Personnel |
| **Low Urgency (Monitoring)** | `["Drone", "Rescue Team"]` | 1–2 Personnel |

> **Note**: These are recommended resource requirements. The system does not claim these resources are presently dispatched or available; allocation occurs in Module 3.

---

## 6. End-to-End System Architecture

```
[ 30_scene_building_risks.csv ] (303 Validated Buildings)
            │
            ▼
[ backend/src/services/rescueTaskService.ts ] 
  ├── Loads & parses CSV + metadata/xbd_s12_metadata.geojson
  ├── Computes exact GPS lat/lng for building centroids
  ├── Applies deterministic task generation rules (Ei, Si, Ri)
  └── Computes operational stats & resource recommendations
            │
            ▼
[ backend/src/controllers/rescueTaskController.ts ]
  ├── GET /api/v1/rescue-tasks (Supports query filters: sceneId, urgency, taskType, search, pagination)
  ├── GET /api/v1/rescue-tasks/stats (Aggregated metrics)
  └── GET /api/v1/rescue-tasks/:taskId (Single record inspection)
            │
            ▼
[ floodvision-ai-frontend ]
  ├── api/client.ts (rescueTasksApi client)
  ├── pages/RescueTasks.tsx (Dedicated tasks dashboard, KPI badges, filters, expandable evidence cards)
  ├── pages/MapPage.tsx (Interactive Leaflet GIS map with 303 building markers color-coded by urgency)
  └── pages/Priority.tsx (Unified cross-link between priority clusters and building tasks)
```

---

## 7. Backend API Specification

### 1. `GET /api/v1/rescue-tasks`
* **Query Parameters**:
  * `sceneId` (optional): Filter by scene (e.g. `hurricane-florence_00000050`)
  * `urgency` (optional): `Critical`, `High`, `Medium`, `Low`
  * `taskType` (optional): Filter by operational mission
  * `riskCategory` (optional): `Critical`, `High`, `Moderate`, `Low`
  * `status` (optional): `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`
  * `search` (optional): Free-text search matching task ID, scene, resources, or reason
  * `page`, `limit` (optional): Pagination controls
* **Response**:
```json
{
  "success": true,
  "message": "Retrieved 303 rescue tasks successfully",
  "data": {
    "total": 303,
    "page": 1,
    "limit": 303,
    "tasks": [
      {
        "taskId": "TASK-HURRICANE-FLORENCE_00000050-B003",
        "sceneId": "hurricane-florence_00000050",
        "buildingId": 3,
        "location": {
          "centroidX": 48.05,
          "centroidY": 22.11,
          "latitude": 33.606912,
          "longitude": -79.054019,
          "areaPixels": 64
        },
        "riskScore": 0.5156,
        "riskCategory": "High",
        "floodExposure": 0.25,
        "damageSeverity": 0.7812,
        "taskType": "Immediate Rescue / Evacuation Assessment",
        "urgency": "High",
        "taskReason": "High composite risk (Ri=0.516) with active flood inundation exposure (Ei=0.25) and structural damage (Si=0.78). Immediate waterborne rescue/evacuation required.",
        "requiredResources": ["Rescue Team", "Boat", "Drone", "Medical Unit"],
        "estimatedPersonnel": "4-6 personnel",
        "taskStatus": "PENDING"
      }
    ]
  }
}
```

### 2. `GET /api/v1/rescue-tasks/stats`
* **Response**: Aggregated count distributions by urgency, task type, risk category, and average risk score.

### 3. `GET /api/v1/rescue-tasks/:taskId`
* **Response**: Detailed single task object.

---

## 8. Summary of Validation & Verification

1. **Building & Task Completeness**:
   * Total validated buildings: **303**
   * Total generated tasks: **303**
   * Missing task IDs / building IDs: **0**
2. **Deterministic Consistency**:
   * 100% of tasks have valid, explainable task reasons.
   * All task urgencies strictly match risk categories ($R_i$).
   * Initial task status is consistently set to `PENDING`.
3. **Frontend ↔ Backend Connectivity**:
   * Frontend `rescueTasksApi` connects seamlessly to Express backend at `/api/v1/rescue-tasks`.
   * Interactive GIS map displays building markers with real GPS coordinates mapped from `xbd_s12_metadata.geojson`.
   * Popups display complete operational details ($R_i, E_i, S_i$, resources, personnel, reason).
4. **Existing Systems Intact**:
   * Multimodal fusion models and frozen risk calculations untouched.
   * Existing cases, reports, assessments, and authentication preserved.

---

## 9. Next Stage: Module 3 Preview

The generated tasks are fully prepared for ingestion by **Module 3: Rescue Team Allocation & Optimal Dispatch**, which will implement:
* Incident Commander Resource Registry (Rescue boats, SAR squads, UAV drones, Medical units)
* Constrained Multi-Objective Optimization for team-to-task assignment
* Vehicle Routing / Priority Scheduling minimizing response latency to Critical & High urgency structures.
