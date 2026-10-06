export type UserRole = "admin" | "officer" | "analyst" | "viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CaseStatus = "active" | "assessing" | "reviewed" | "closed";

export interface FloodCase {
  caseId: string;
  title: string;
  description: string;
  location: { name: string; latitude: number; longitude: number };
  eventDate: string;
  status: CaseStatus;
  createdBy: string;
  affectedBuildings: number;
  floodPercentage: number;
  createdAt: string;
}

export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface RescuePriority {
  assessmentId: string;
  area: string;
  score: number;
  priorityLevel: PriorityLevel;
  factors: { label: string; weight: number }[];
}

export interface DamageResult {
  assessmentId: string;
  floodPercentage: number;
  affectedBuildings: number;
  damageClasses: { noDamage: number; minor: number; major: number; destroyed: number };
  confidence: number;
}

export interface FloodTrendPoint {
  day: string;
  floodPercentage: number;
}

export interface Report {
  _id?: string;
  reportId: string;
  caseId: string;
  title: string;
  summary: string;
  generatedBy: string;
  fileUrl?: string;
  createdAt?: string;
  caseDetails?: FloodCase;
  priorityDetails?: {
    priorityLevel: PriorityLevel;
    score: number;
    factors: { label: string; weight: number }[];
  };
}

export type TaskUrgency = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskType =
  | "Immediate Rescue / Evacuation Assessment"
  | "Structural Safety / Rescue Assessment"
  | "Priority Welfare Check / Inspection"
  | "Monitoring / Routine Assessment";

export interface RescueTask {
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

export interface TaskStatistics {
  totalTasks: number;
  urgencyCounts: Record<TaskUrgency, number>;
  taskTypeCounts: Record<string, number>;
  riskCategoryCounts: Record<string, number>;
  statusCounts: Record<TaskStatus, number>;
  averageRiskScore: number;
}

export type TeamType =
  | "RESCUE_TEAM"
  | "BOAT_TEAM"
  | "DRONE_TEAM"
  | "MEDICAL_TEAM"
  | "STRUCTURAL_TEAM"
  | "HEAVY_EQUIPMENT_TEAM";

export type TeamStatus = "AVAILABLE" | "ASSIGNED" | "BUSY" | "COMPLETED";

export interface RescueTeam {
  teamId: string;
  teamName: string;
  teamType: TeamType;
  currentLocation: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
  available: boolean;
  personnelCount: number;
  capabilities: string[];
  status: TeamStatus;
  assignedTaskId?: string | null;
}

export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface TeamAssignment {
  assignmentId: string;
  taskId: string;
  teamId: string;
  teamName: string;
  teamType: TeamType;
  sceneId: string;
  buildingId: number;
  taskType: string;
  riskScore: number;
  urgency: string;
  compatibilityReason: string;
  distanceKm: number;
  allocationScore: number;
  assignmentStatus: AssignmentStatus;
  assignedAt: string;
  taskLocation: {
    latitude: number;
    longitude: number;
  };
  teamLocation: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
}

export interface AllocationStatistics {
  totalTeams: number;
  availableTeams: number;
  assignedTeams: number;
  totalTasksConsidered: number;
  assignedTasksCount: number;
  unassignedTasksCount: number;
  urgencyAssignmentBreakdown: {
    Critical: { total: number; assigned: number; unassigned: number };
    High: { total: number; assigned: number; unassigned: number };
    Medium: { total: number; assigned: number; unassigned: number };
    Low: { total: number; assigned: number; unassigned: number };
  };
  averageProximityKm: number;
  averageAllocationScore: number;
}


