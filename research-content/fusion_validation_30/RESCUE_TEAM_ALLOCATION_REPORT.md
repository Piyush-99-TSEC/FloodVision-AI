# RESCUE TEAM ALLOCATION MODULE — END-TO-END SPECIFICATION & VALIDATION REPORT

**Project**: ROSP / FloodVision-AI  
**Module**: Rescue Team Allocation (Module 3)  
**Input Tasks**: 303 Validated Building Rescue Tasks (from Module 2)  
**Simulated Fleet**: 18 Multi-Disciplinary Emergency Response Units  
**Allocation Strategy**: Explainable Priority-Based Greedy Allocation  
**QC & Compatibility Status**: PASS (100% Capability Match Verified)  
**Next Module**: Vehicle Routing & Route Path Scheduling  

---

## 1. Executive Summary & Purpose

The **Rescue Team Allocation Module** converts operational rescue tasks into direct responder field assignments. It pairs available, simulated emergency response teams (e.g., Marine Boat Units, Urban Search & Rescue Teams, UAV Recon Squads, Field Medical Units, Structural USAR Engineers, Heavy Clearance Machinery) with validated high-priority building tasks based on **urgency**, **risk score ($R_i$)**, **capability compatibility**, and **spatial proximity**.

### Core Operational Principles:
1. **Explainable Multi-Factor Scoring**: Uses an open, transparent formula rather than a black box.
2. **Strict Capability Compatibility**: A team is **never** assigned to a task unless its operational capabilities match the task's required resources (e.g., a pure structural team will never be assigned to an active deep-water flood evacuation).
3. **1:1 Team Capacity Constraint**: A team is dedicated to at most one active rescue mission at a time.
4. **Deficit Queue Handling**: When tasks exceed available response teams, high-priority tasks are prioritized, and remaining tasks are cataloged in an explainable **Resource Deficit Queue** (`UNASSIGNED / STANDBY`) for incident commanders.

> **CRITICAL ARCHITECTURAL GUARANTEE**: Multimodal fusion, Flood U-Net, damage assessment, temporal SAR analysis, $E_i, S_i, R_i$ risk scores, and the generated 303 rescue tasks remain **100% frozen and read-only**.

---

## 2. Rescue Team Data Model

Each simulated emergency response team contains:

| Field | Type | Description |
| :--- | :--- | :--- |
| `teamId` | String (Unique) | e.g., `TEAM-FLORENCE-BOAT-01`, `TEAM-HARVEY-SAR-02` |
| `teamName` | String | Descriptive unit moniker (e.g., *Coastal Marine SAR Alpha*) |
| `teamType` | Enum | `BOAT_TEAM`, `RESCUE_TEAM`, `DRONE_TEAM`, `MEDICAL_TEAM`, `STRUCTURAL_TEAM`, `HEAVY_EQUIPMENT_TEAM` |
| `currentLocation` | Object | `{ latitude, longitude, areaName }` (Staging post base) |
| `available` | Boolean | Real-time dispatch availability flag |
| `personnelCount` | Number | Active responders attached to the squad (2 to 6) |
| `capabilities` | String Array | Operational proficiencies (e.g., `["Boat", "Rescue Team", "Medical Unit"]`) |
| `status` | Enum | `AVAILABLE`, `ASSIGNED`, `BUSY`, `COMPLETED` |
| `assignedTaskId` | String / Null | Pointer to active target building rescue task |

---

## 3. Simulated Response Fleet Profile (18 Units)

To avoid artificial unlimited capacity, a realistic, finite fleet of 18 emergency response teams is distributed across the major disaster sectors:

| Sector | Team ID | Unit Type | Staging Post | Capabilities | Personnel |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hurricane Florence** | `TEAM-FLORENCE-BOAT-01` | `BOAT_TEAM` | Myrtle Beach Staging Alpha | Boat, Rescue Team, Medical Unit | 6 |
| **Hurricane Florence** | `TEAM-FLORENCE-SAR-02` | `RESCUE_TEAM` | Georgetown Tactical Hub | Rescue Team, Drone, Medical Unit | 5 |
| **Hurricane Florence** | `TEAM-FLORENCE-DRONE-03` | `DRONE_TEAM` | Horry County Airport Base | Drone, Rescue Team | 2 |
| **Hurricane Florence** | `TEAM-FLORENCE-STRUCT-04` | `STRUCTURAL_TEAM` | Florence West Forward Station | Structural Assessment Team, Rescue Team, Heavy Equipment | 4 |
| **Hurricane Florence** | `TEAM-FLORENCE-MED-05` | `MEDICAL_TEAM` | Grand Strand Field Hospital | Medical Unit, Rescue Team | 4 |
| **Hurricane Matthew** | `TEAM-MATTHEW-BOAT-01` | `BOAT_TEAM` | St. Augustine Marina Staging | Boat, Rescue Team, Drone | 6 |
| **Hurricane Matthew** | `TEAM-MATTHEW-SAR-02` | `RESCUE_TEAM` | St. Johns Emergency HQ | Rescue Team, Boat, Medical Unit | 4 |
| **Hurricane Matthew** | `TEAM-MATTHEW-HEAVY-03` | `HEAVY_EQUIPMENT_TEAM` | St. Augustine Public Works Depot | Heavy Equipment, Structural Assessment Team, Rescue Team | 6 |
| **Hurricane Harvey** | `TEAM-HARVEY-BOAT-01` | `BOAT_TEAM` | Buffalo Bayou Response Dock | Boat, Rescue Team, Medical Unit | 5 |
| **Hurricane Harvey** | `TEAM-HARVEY-SAR-02` | `RESCUE_TEAM` | Downtown Houston Heliport Base | Rescue Team, Medical Unit, Drone | 4 |
| **Hurricane Harvey** | `TEAM-HARVEY-STRUCT-03` | `STRUCTURAL_TEAM` | North Houston Engineering Depot | Structural Assessment Team, Heavy Equipment, Rescue Team | 4 |
| **Palu Tsunami** | `TEAM-PALU-BOAT-01` | `BOAT_TEAM` | Palu Port Disaster Terminal | Boat, Rescue Team, Medical Unit | 6 |
| **Palu Tsunami** | `TEAM-PALU-STRUCT-02` | `STRUCTURAL_TEAM` | Central Sulawesi Command Post | Structural Assessment Team, Heavy Equipment, Rescue Team, Medical Unit | 5 |
| **Guatemala Volcano** | `TEAM-GUATEMALA-SAR-01` | `RESCUE_TEAM` | Escuintla Regional Station | Rescue Team, Drone, Medical Unit | 4 |
| **Guatemala Volcano** | `TEAM-GUATEMALA-HEAVY-02` | `HEAVY_EQUIPMENT_TEAM` | Antigua South Forward Base | Heavy Equipment, Structural Assessment Team, Rescue Team | 6 |
| **Midwest Floods** | `TEAM-MIDWEST-BOAT-01` | `BOAT_TEAM` | Omaha Riverfront Command | Boat, Rescue Team, Drone | 5 |
| **Nepal Flooding** | `TEAM-NEPAL-SAR-01` | `RESCUE_TEAM` | Kathmandu Valley Response Base | Rescue Team, Medical Unit, Drone | 5 |
| **Mexico Earthquake** | `TEAM-MEXICO-STRUCT-01` | `STRUCTURAL_TEAM` | Mexico City Emergency HQ | Structural Assessment Team, Rescue Team, Heavy Equipment | 5 |

---

## 4. Allocation Methodology & Scoring Formula

The strategy operates via an **Explainable Priority-Based Greedy Optimization**:

### Step 1: Priority Queue Ordering
Tasks are prioritized in descending order of operational impact:
1. Operational Urgency ($\text{Critical} > \text{High} > \text{Medium} > \text{Low}$)
2. Composite Risk Score ($R_i \in [0, 1]$)
3. Direct Flood Exposure ($E_i$)

### Step 2: Capability Filter (Hard Constraint)
For each available team $j$ and task $i$:
$$\text{Matched Capabilities} = \text{Team Capabilities}_j \cap \text{Task Required Resources}_i$$
If $|\text{Matched Capabilities}| = 0$, team $j$ is **strictly ineligible** ($S_{alloc} = 0$).

### Step 3: Composite Score Computation
For all eligible, available teams:
$$S_{alloc}(i, j) = 0.40 \cdot S_{priority}(i) + 0.35 \cdot S_{capability}(i, j) + 0.25 \cdot S_{proximity}(i, j)$$

Where:
* **$S_{priority}$**: Base urgency weight (Critical: $0.85$, High: $0.70$, Medium: $0.45$, Low: $0.20$) $+ 0.15 \cdot R_i$.
* **$S_{capability}$**: Normalized overlap ratio $\in [0.50, 1.0]$.
* **$S_{proximity}$**: Smooth inverse-distance decay function:
  $$S_{proximity} = \frac{1}{1 + 0.05 \cdot d_{km}}$$
  Where $d_{km}$ is the Haversine distance between team base and building centroid.

### Step 4: Assignment & Lock
The eligible team with the highest $S_{alloc}$ is assigned to task $i$. The team's status transitions to `ASSIGNED`, availability is locked (`available = false`), and the assignment record is logged.

---

## 5. Team Assignment Data Model

Each generated assignment record contains:

* `assignmentId`: `ASG-<taskId>-<teamId>`
* `taskId`: Target building rescue task
* `teamId` & `teamName`: Assigned responder squad
* `teamType`: Operational classification
* `sceneId` & `buildingId`: Target building identifiers
* `taskType`: Action classification
* `riskScore` ($R_i$) & `urgency`
* `compatibilityReason`: Human-readable explainable rationale
* `distanceKm`: Direct spatial transit distance in kilometers
* `allocationScore`: Computed composite score ($S_{alloc} \in [0, 1]$)
* `assignmentStatus`: `ASSIGNED`
* `assignedAt`: ISO timestamp

---

## 6. Allocation Results & Deficit Analysis

* **Total Tasks Evaluated**: **303**
* **Total Teams Available**: **18**
* **Active Assignments Generated**: **18**
* **Tasks in Resource Deficit Queue**: **285**
* **Capacity Constraint Respected**: 100% (No team double-booked)
* **Capability Match Rate**: 100% (Zero incompatible assignments)

### Urgency Allocation Summary:
* **Critical Urgency Tasks**: Highest preference received across regional squads.
* **High Urgency Tasks**: Matched with dedicated marine, USAR, and heavy machinery units.
* **Resource Deficit Queue**: 285 remaining tasks cataloged clearly as `STANDBY (Resource Deficit)` awaiting secondary waves or additional regional unit deployments.

---

## 7. Backend API Specification

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/rescue-teams` | `GET` | Lists simulated responder teams. Query filters: `?teamType=...&status=...&available=true&search=...` |
| `/api/v1/rescue-teams/:teamId` | `GET` | Returns single team profile and active assignment. |
| `/api/v1/assignments` | `GET` | Lists generated assignments. Query filters: `?teamId=...&taskId=...&urgency=...&search=...` |
| `/api/v1/assignments/generate` | `POST` | Re-runs the priority allocation engine across all pending tasks. |
| `/api/v1/assignments/stats` | `GET` | Returns fleet metrics, assigned/unassigned counts, urgency breakdowns, and average proximity. |
| `/api/v1/assignments/:assignmentId` | `GET` | Returns individual assignment details and explainable reason. |

---

## 8. Frontend Integration Summary

1. **Team Allocation Dashboard (`/allocation`)**:
   * Multi-metric KPI strip (Total Fleet, Active Missions, Standby Units, Deficit Backlog, Avg Proximity, Avg Score).
   * One-click "Run Optimal Allocation" button.
   * **Active Assignments Tab**: Interactive table with Task ID $\leftrightarrow$ Team Name, distance, score, capabilities, and explainable reason.
   * **Responder Fleet Status Tab**: Real-time card view of all 18 simulated squads with capabilities, personnel count, and active target links.
   * **Resource Deficit Queue Tab**: Standby backlog list showing resource requirements for unassigned structures.
2. **Interactive GIS Map (`/map`)**:
   * New **Rescue Teams & Staging Bases** toggle layer.
   * Staging base markers plotted at exact geographic coordinates.
   * Task markers enhanced with live **Assigned Team** info banner, transit distance, and allocation priority score.
3. **Rescue Tasks Page (`/rescue-tasks`)**:
   * Expanded task panes display assigned response units and transit distance with direct links to `/allocation`.

---

## 9. Verification & Quality Assurance

- ✅ **Compatibility Verification**: 100% of assigned teams possess matching capabilities for their target task.
- ✅ **Capacity Verification**: Exactly 18 teams assigned to 18 distinct tasks; 0 double allocations.
- ✅ **Proximity Sensitivity**: Teams selected from closest geographic bases within compatible capability classes.
- ✅ **Zero ML/Fusion Modifications**: All frozen weights, checkpoints, SAR temporal math, and risk formulas remain untouched.
- ✅ **No Premature Routing**: Route paths and street turn-by-turn navigation are deferred to Module 4 as required.
