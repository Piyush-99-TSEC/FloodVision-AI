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
