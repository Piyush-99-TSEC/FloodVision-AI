import { IRescueTeam, TeamType, TeamStatus } from "../models/RescueTeam";
import { ITeamAssignment, AssignmentStatus } from "../models/TeamAssignment";
import { generateRescueTasksFromValidatedData, RescueTaskDTO } from "./rescueTaskService";

export interface RescueTeamDTO {
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

export interface TeamAssignmentDTO {
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

// Initial Simulated/Demo Emergency Response Units across Disaster Sectors
const INITIAL_SIMULATED_TEAMS: RescueTeamDTO[] = [
  // Hurricane Florence / Coastal Carolina Sector
  {
    teamId: "TEAM-FLORENCE-BOAT-01",
    teamName: "Coastal Marine SAR Alpha",
    teamType: "BOAT_TEAM",
    currentLocation: { latitude: 33.612, longitude: -79.048, areaName: "Myrtle Beach Staging Alpha" },
    available: true,
    personnelCount: 6,
    capabilities: ["Boat", "Rescue Team", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-FLORENCE-SAR-02",
    teamName: "Carolina Rapid Response Squad",
    teamType: "RESCUE_TEAM",
    currentLocation: { latitude: 33.601, longitude: -79.059, areaName: "Georgetown Tactical Hub" },
    available: true,
    personnelCount: 5,
    capabilities: ["Rescue Team", "Drone", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-FLORENCE-DRONE-03",
    teamName: "AirRecon Aerial UAV Unit 1",
    teamType: "DRONE_TEAM",
    currentLocation: { latitude: 33.625, longitude: -79.035, areaName: "Horry County Airport Base" },
    available: true,
    personnelCount: 2,
    capabilities: ["Drone", "Rescue Team"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-FLORENCE-STRUCT-04",
    teamName: "USAR Structural Assessment Team 1",
    teamType: "STRUCTURAL_TEAM",
    currentLocation: { latitude: 33.595, longitude: -79.065, areaName: "Florence West Forward Station" },
    available: true,
    personnelCount: 4,
    capabilities: ["Structural Assessment Team", "Rescue Team", "Heavy Equipment"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-FLORENCE-MED-05",
    teamName: "Disaster Emergency Medics Echo",
    teamType: "MEDICAL_TEAM",
    currentLocation: { latitude: 33.618, longitude: -79.042, areaName: "Grand Strand Field Hospital" },
    available: true,
    personnelCount: 4,
    capabilities: ["Medical Unit", "Rescue Team"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },

  // Hurricane Matthew Sector
  {
    teamId: "TEAM-MATTHEW-BOAT-01",
    teamName: "Florida Marine Rescue Taskforce",
    teamType: "BOAT_TEAM",
    currentLocation: { latitude: 29.898, longitude: -81.311, areaName: "St. Augustine Marina Staging" },
    available: true,
    personnelCount: 6,
    capabilities: ["Boat", "Rescue Team", "Drone"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-MATTHEW-SAR-02",
    teamName: "Atlantic Swiftwater Crew 2",
    teamType: "RESCUE_TEAM",
    currentLocation: { latitude: 29.889, longitude: -81.325, areaName: "St. Johns Emergency HQ" },
    available: true,
    personnelCount: 4,
    capabilities: ["Rescue Team", "Boat", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-MATTHEW-HEAVY-03",
    teamName: "Debris Clearance & Heavy Rescue Delta",
    teamType: "HEAVY_EQUIPMENT_TEAM",
    currentLocation: { latitude: 29.905, longitude: -81.302, areaName: "St. Augustine Public Works Depot" },
    available: true,
    personnelCount: 6,
    capabilities: ["Heavy Equipment", "Structural Assessment Team", "Rescue Team"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },

  // Hurricane Harvey Sector
  {
    teamId: "TEAM-HARVEY-BOAT-01",
    teamName: "Houston Floodwater Boat Unit 7",
    teamType: "BOAT_TEAM",
    currentLocation: { latitude: 29.765, longitude: -95.362, areaName: "Buffalo Bayou Response Dock" },
    available: true,
    personnelCount: 5,
    capabilities: ["Boat", "Rescue Team", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-HARVEY-SAR-02",
    teamName: "Harris County Emergency Rescue 4",
    teamType: "RESCUE_TEAM",
    currentLocation: { latitude: 29.752, longitude: -95.378, areaName: "Downtown Houston Heliport Base" },
    available: true,
    personnelCount: 4,
    capabilities: ["Rescue Team", "Medical Unit", "Drone"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-HARVEY-STRUCT-03",
    teamName: "Gulf Coast Structural Safety Team",
    teamType: "STRUCTURAL_TEAM",
    currentLocation: { latitude: 29.774, longitude: -95.351, areaName: "North Houston Engineering Depot" },
    available: true,
    personnelCount: 4,
    capabilities: ["Structural Assessment Team", "Heavy Equipment", "Rescue Team"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },

  // Palu Tsunami & Earthquake Sector
  {
    teamId: "TEAM-PALU-BOAT-01",
    teamName: "Sulawesi Bay Marine Patrol",
    teamType: "BOAT_TEAM",
    currentLocation: { latitude: -0.887, longitude: 119.865, areaName: "Palu Port Disaster Terminal" },
    available: true,
    personnelCount: 6,
    capabilities: ["Boat", "Rescue Team", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-PALU-STRUCT-02",
    teamName: "Palu USAR Heavy Collapse Specialists",
    teamType: "STRUCTURAL_TEAM",
    currentLocation: { latitude: -0.899, longitude: 119.878, areaName: "Central Sulawesi Command Post" },
    available: true,
    personnelCount: 5,
    capabilities: ["Structural Assessment Team", "Heavy Equipment", "Rescue Team", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },

  // Guatemala Volcano Sector
  {
    teamId: "TEAM-GUATEMALA-SAR-01",
    teamName: "Escuintla Volcanic Rescue Team 1",
    teamType: "RESCUE_TEAM",
    currentLocation: { latitude: 14.392, longitude: -90.809, areaName: "Escuintla Regional Station" },
    available: true,
    personnelCount: 4,
    capabilities: ["Rescue Team", "Drone", "Medical Unit"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-GUATEMALA-HEAVY-02",
    teamName: "CONRED Heavy Machinery Unit",
    teamType: "HEAVY_EQUIPMENT_TEAM",
    currentLocation: { latitude: 14.379, longitude: -90.825, areaName: "Antigua South Forward Base" },
    available: true,
    personnelCount: 6,
    capabilities: ["Heavy Equipment", "Structural Assessment Team", "Rescue Team"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },

  // Nepal Flooding / Midwest Sector
  {
    teamId: "TEAM-MIDWEST-BOAT-01",
    teamName: "Platte River Swiftwater Squad",
    teamType: "BOAT_TEAM",
    currentLocation: { latitude: 41.261, longitude: -95.928, areaName: "Omaha Riverfront Command" },
    available: true,
    personnelCount: 5,
    capabilities: ["Boat", "Rescue Team", "Drone"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-NEPAL-SAR-01",
    teamName: "Himalayan Emergency Disaster Rescue",
    teamType: "RESCUE_TEAM",
    currentLocation: { latitude: 27.722, longitude: 85.318, areaName: "Kathmandu Valley Response Base" },
    available: true,
    personnelCount: 5,
    capabilities: ["Rescue Team", "Medical Unit", "Drone"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
  {
    teamId: "TEAM-MEXICO-STRUCT-01",
    teamName: "CENAPRED Earthquake Engineering Team",
    teamType: "STRUCTURAL_TEAM",
    currentLocation: { latitude: 19.438, longitude: -99.128, areaName: "Mexico City Emergency HQ" },
    available: true,
    personnelCount: 5,
    capabilities: ["Structural Assessment Team", "Rescue Team", "Heavy Equipment"],
    status: "AVAILABLE",
    assignedTaskId: null,
  },
];

// In-Memory Storage for Simulated Teams and Dynamic Assignments
let rescueTeams: RescueTeamDTO[] = JSON.parse(JSON.stringify(INITIAL_SIMULATED_TEAMS));
let teamAssignments: TeamAssignmentDTO[] = [];

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Computes capability compatibility overlap between team capabilities and task required resources
 */
export function evaluateCapabilityMatch(
  teamCapabilities: string[],
  taskRequiredResources: string[]
): { isCompatible: boolean; compatibilityScore: number; matchedCapabilities: string[] } {
  const matched = teamCapabilities.filter((c) =>
    taskRequiredResources.some((r) => r.toLowerCase() === c.toLowerCase())
  );

  if (matched.length === 0) {
    return { isCompatible: false, compatibilityScore: 0, matchedCapabilities: [] };
  }

  // Jaccard-style normalized capability match ratio
  const ratio = matched.length / Math.max(1, taskRequiredResources.length);
  // Base scale for any matching primary capability
  const compatibilityScore = parseFloat(Math.min(1.0, 0.5 + ratio * 0.5).toFixed(3));

  return {
    isCompatible: true,
    compatibilityScore,
    matchedCapabilities: matched,
  };
}

/**
 * Computes transparent, explainable allocation score:
 * S_alloc = 0.40 * S_priority + 0.35 * S_capability + 0.25 * S_proximity
 */
export function computeAllocationScore(
  task: RescueTaskDTO,
  team: RescueTeamDTO,
  distanceKm: number,
  capabilityScore: number
): number {
  // 1. Priority Factor S_priority based on Urgency and Risk Score Ri
  let baseUrgency = 0.2;
  if (task.urgency === "Critical") baseUrgency = 0.85;
  else if (task.urgency === "High") baseUrgency = 0.7;
  else if (task.urgency === "Medium") baseUrgency = 0.45;

  const priorityScore = Math.min(1.0, baseUrgency + 0.15 * task.riskScore);

  // 2. Capability Compatibility Factor S_capability
  const capScore = capabilityScore;

  // 3. Proximity Factor S_proximity: decays gracefully with distance
  const proximityScore = 1.0 / (1.0 + 0.05 * distanceKm);

  // Weighted composite allocation score
  const finalScore = 0.4 * priorityScore + 0.35 * capScore + 0.25 * proximityScore;
  return parseFloat(Math.min(0.99, Math.max(0.1, finalScore)).toFixed(4));
}

/**
 * Generates explainable optimal team assignments across pending rescue tasks
 */
export function generateTeamAssignments(): {
  generatedAssignments: TeamAssignmentDTO[];
  totalConsidered: number;
  assignedCount: number;
  unassignedCount: number;
} {
  // Reset previous assignment states
  rescueTeams = JSON.parse(JSON.stringify(INITIAL_SIMULATED_TEAMS));
  teamAssignments = [];

  const tasks = generateRescueTasksFromValidatedData();

  // Priority sorting: Critical urgency & highest Ri first, then High, Medium, Low
  const urgencyWeight: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const uwA = urgencyWeight[a.urgency] || 1;
    const uwB = urgencyWeight[b.urgency] || 1;
    if (uwA !== uwB) return uwB - uwA;
    return b.riskScore - a.riskScore;
  });

  for (const task of sortedTasks) {
    // Find all currently available teams
    const availableTeams = rescueTeams.filter((t) => t.available && t.status === "AVAILABLE");
    if (availableTeams.length === 0) {
      // No more teams available; subsequent tasks remain UNASSIGNED
      continue;
    }

    let bestTeam: RescueTeamDTO | null = null;
    let highestScore = -1;
    let bestDistance = 0;
    let bestMatchedCaps: string[] = [];

    for (const team of availableTeams) {
      const match = evaluateCapabilityMatch(team.capabilities, task.requiredResources);
      if (!match.isCompatible) {
        // Never assign an incompatible team
        continue;
      }

      const distance = calculateHaversineDistanceKm(
        team.currentLocation.latitude,
        team.currentLocation.longitude,
        task.location.latitude,
        task.location.longitude
      );

      const score = computeAllocationScore(task, team, distance, match.compatibilityScore);

      if (score > highestScore) {
        highestScore = score;
        bestTeam = team;
        bestDistance = distance;
        bestMatchedCaps = match.matchedCapabilities;
      }
    }

    if (bestTeam && highestScore > 0) {
      // Create assignment
      const assignmentId = `ASG-${task.taskId}-${bestTeam.teamId}`;
      const compatibilityReason = `Assigned ${bestTeam.teamName} [${bestTeam.teamType}] to ${task.taskId}. Capabilities matched: [${bestMatchedCaps.join(", ")}]. Transit distance: ${bestDistance} km. Composite allocation priority score: ${highestScore.toFixed(3)}.`;

      const assignment: TeamAssignmentDTO = {
        assignmentId,
        taskId: task.taskId,
        teamId: bestTeam.teamId,
        teamName: bestTeam.teamName,
        teamType: bestTeam.teamType,
        sceneId: task.sceneId,
        buildingId: task.buildingId,
        taskType: task.taskType,
        riskScore: task.riskScore,
        urgency: task.urgency,
        compatibilityReason,
        distanceKm: bestDistance,
        allocationScore: highestScore,
        assignmentStatus: "ASSIGNED",
        assignedAt: new Date().toISOString(),
        taskLocation: {
          latitude: task.location.latitude,
          longitude: task.location.longitude,
        },
        teamLocation: {
          latitude: bestTeam.currentLocation.latitude,
          longitude: bestTeam.currentLocation.longitude,
          areaName: bestTeam.currentLocation.areaName,
        },
      };

      teamAssignments.push(assignment);

      // Update team status to ASSIGNED and lock availability
      bestTeam.available = false;
      bestTeam.status = "ASSIGNED";
      bestTeam.assignedTaskId = task.taskId;
    }
  }

  const assignedCount = teamAssignments.length;
  const unassignedCount = Math.max(0, tasks.length - assignedCount);

  return {
    generatedAssignments: teamAssignments,
    totalConsidered: tasks.length,
    assignedCount,
    unassignedCount,
  };
}

/**
 * Retrieves list of simulated rescue teams with optional filtering
 */
export function getRescueTeams(filters: {
  teamType?: TeamType;
  status?: TeamStatus;
  available?: boolean;
  search?: string;
} = {}): RescueTeamDTO[] {
  let list = [...rescueTeams];

  if (filters.teamType) {
    list = list.filter((t) => t.teamType === filters.teamType);
  }

  if (filters.status) {
    list = list.filter((t) => t.status === filters.status);
  }

  if (filters.available !== undefined) {
    list = list.filter((t) => t.available === filters.available);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.teamId.toLowerCase().includes(q) ||
        t.teamName.toLowerCase().includes(q) ||
        t.currentLocation.areaName.toLowerCase().includes(q) ||
        t.capabilities.some((c) => c.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Retrieves a single rescue team by teamId
 */
export function getRescueTeamById(teamId: string): RescueTeamDTO | null {
  return (
    rescueTeams.find((t) => t.teamId.toLowerCase() === teamId.toLowerCase()) || null
  );
}

/**
 * Retrieves existing team assignments with optional filtering
 */
export function getTeamAssignments(filters: {
  teamId?: string;
  taskId?: string;
  status?: AssignmentStatus;
  urgency?: string;
  search?: string;
} = {}): TeamAssignmentDTO[] {
  // If assignments haven't been generated yet, generate them dynamically
  if (teamAssignments.length === 0) {
    generateTeamAssignments();
  }

  let list = [...teamAssignments];

  if (filters.teamId) {
    list = list.filter((a) => a.teamId.toLowerCase() === filters.teamId!.toLowerCase());
  }

  if (filters.taskId) {
    list = list.filter((a) => a.taskId.toLowerCase().includes(filters.taskId!.toLowerCase()));
  }

  if (filters.status) {
    list = list.filter((a) => a.assignmentStatus === filters.status);
  }

  if (filters.urgency) {
    list = list.filter((a) => a.urgency.toLowerCase() === filters.urgency!.toLowerCase());
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.assignmentId.toLowerCase().includes(q) ||
        a.taskId.toLowerCase().includes(q) ||
        a.teamId.toLowerCase().includes(q) ||
        a.teamName.toLowerCase().includes(q) ||
        a.compatibilityReason.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => b.allocationScore - a.allocationScore);
}

/**
 * Retrieves single assignment details by assignmentId
 */
export function getTeamAssignmentById(assignmentId: string): TeamAssignmentDTO | null {
  if (teamAssignments.length === 0) {
    generateTeamAssignments();
  }

  return (
    teamAssignments.find(
      (a) => a.assignmentId.toLowerCase() === assignmentId.toLowerCase()
    ) || null
  );
}

/**
 * Computes allocation summary statistics
 */
export function getAllocationStatistics(): AllocationStatistics {
  if (teamAssignments.length === 0) {
    generateTeamAssignments();
  }

  const tasks = generateRescueTasksFromValidatedData();
  const assignedTaskIds = new Set(teamAssignments.map((a) => a.taskId));

  const urgencyBreakdown = {
    Critical: { total: 0, assigned: 0, unassigned: 0 },
    High: { total: 0, assigned: 0, unassigned: 0 },
    Medium: { total: 0, assigned: 0, unassigned: 0 },
    Low: { total: 0, assigned: 0, unassigned: 0 },
  };

  for (const t of tasks) {
    const u = (t.urgency as "Critical" | "High" | "Medium" | "Low") || "Low";
    urgencyBreakdown[u].total += 1;
    if (assignedTaskIds.has(t.taskId)) {
      urgencyBreakdown[u].assigned += 1;
    } else {
      urgencyBreakdown[u].unassigned += 1;
    }
  }

  const totalDist = teamAssignments.reduce((acc, a) => acc + a.distanceKm, 0);
  const totalScore = teamAssignments.reduce((acc, a) => acc + a.allocationScore, 0);

  return {
    totalTeams: rescueTeams.length,
    availableTeams: rescueTeams.filter((t) => t.available).length,
    assignedTeams: rescueTeams.filter((t) => !t.available).length,
    totalTasksConsidered: tasks.length,
    assignedTasksCount: teamAssignments.length,
    unassignedTasksCount: Math.max(0, tasks.length - teamAssignments.length),
    urgencyAssignmentBreakdown: urgencyBreakdown,
    averageProximityKm:
      teamAssignments.length > 0
        ? parseFloat((totalDist / teamAssignments.length).toFixed(2))
        : 0,
    averageAllocationScore:
      teamAssignments.length > 0
        ? parseFloat((totalScore / teamAssignments.length).toFixed(4))
        : 0,
  };
}
