import { FloodCase, RescuePriority, DamageResult, FloodTrendPoint, AuthUser } from "../types";

export const currentUser: AuthUser = {
  id: "u-001",
  name: "Aisha Verma",
  email: "aisha.verma@floodvision.ai",
  role: "viewer", // Options: "admin" | "officer" | "analyst" | "viewer"
};

export const floodCases: FloodCase[] = [
  {
    caseId: "FC-1042",
    title: "Kolar Riverbank Overflow",
    description: "Sustained heavy rainfall caused the Kolar river to breach its western embankment.",
    location: { name: "Kolar District, Karnataka", latitude: 13.1362, longitude: 78.1298 },
    eventDate: "2026-08-18",
    status: "assessing",
    createdBy: "Aisha Verma",
    affectedBuildings: 214,
    floodPercentage: 62.4,
    createdAt: "2026-08-18T06:20:00Z",
  },
  {
    caseId: "FC-1041",
    title: "Godavari Delta Inundation",
    description: "Upstream dam release combined with cyclonic rainfall flooded low-lying delta villages.",
    location: { name: "East Godavari, Andhra Pradesh", latitude: 16.9891, longitude: 82.2475 },
    eventDate: "2026-08-15",
    status: "reviewed",
    createdBy: "Rahul Nair",
    affectedBuildings: 587,
    floodPercentage: 78.1,
    createdAt: "2026-08-15T11:05:00Z",
  },
  {
    caseId: "FC-1039",
    title: "Ambarnath Urban Waterlogging",
    description: "Flash flooding after 190mm rainfall in six hours overwhelmed municipal drains.",
    location: { name: "Ambarnath, Maharashtra", latitude: 19.1996, longitude: 73.1897 },
    eventDate: "2026-08-10",
    status: "active",
    createdBy: "Aisha Verma",
    affectedBuildings: 96,
    floodPercentage: 41.7,
    createdAt: "2026-08-10T09:40:00Z",
  },
  {
    caseId: "FC-1035",
    title: "Brahmaputra Char Area Flooding",
    description: "Seasonal monsoon surge submerged riverine char settlements.",
    location: { name: "Dhemaji, Assam", latitude: 27.4833, longitude: 94.5667 },
    eventDate: "2026-08-04",
    status: "closed",
    createdBy: "Meera Iyer",
    affectedBuildings: 342,
    floodPercentage: 55.9,
    createdAt: "2026-08-04T14:15:00Z",
  },
  {
    caseId: "FC-1031",
    title: "Chennai Coastal Surge",
    description: "Storm surge combined with high tide breached coastal buffer zones.",
    location: { name: "Chennai, Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
    eventDate: "2026-07-29",
    status: "closed",
    createdBy: "Rahul Nair",
    affectedBuildings: 128,
    floodPercentage: 33.2,
    createdAt: "2026-07-29T08:00:00Z",
  },
];

export const floodTrend: FloodTrendPoint[] = [
  { day: "Aug 12", floodPercentage: 22 },
  { day: "Aug 13", floodPercentage: 28 },
  { day: "Aug 14", floodPercentage: 35 },
  { day: "Aug 15", floodPercentage: 51 },
  { day: "Aug 16", floodPercentage: 58 },
  { day: "Aug 17", floodPercentage: 54 },
  { day: "Aug 18", floodPercentage: 62 },
  { day: "Aug 19", floodPercentage: 60 },
];

export const damageDistribution = [
  { class: "No Damage", count: 412 },
  { class: "Minor", count: 268 },
  { class: "Major", count: 151 },
  { class: "Destroyed", count: 63 },
];

export const damageResult: DamageResult = {
  assessmentId: "A-2287",
  floodPercentage: 62.4,
  affectedBuildings: 214,
  damageClasses: { noDamage: 96, minor: 71, major: 34, destroyed: 13 },
  confidence: 0.91,
};

export const rescuePriorities: RescuePriority[] = [
  {
    assessmentId: "A-2287",
    area: "Zone A — Riverside Colony",
    score: 0.89,
    priorityLevel: "HIGH",
    factors: [
      { label: "Flood severity", weight: 0.42 },
      { label: "Building damage density", weight: 0.31 },
      { label: "Population exposure", weight: 0.17 },
      { label: "Access road status", weight: 0.1 },
    ],
  },
  {
    assessmentId: "A-2286",
    area: "Zone B — Market Ward",
    score: 0.64,
    priorityLevel: "MEDIUM",
    factors: [
      { label: "Flood severity", weight: 0.29 },
      { label: "Building damage density", weight: 0.24 },
      { label: "Population exposure", weight: 0.27 },
      { label: "Access road status", weight: 0.2 },
    ],
  },
  {
    assessmentId: "A-2285",
    area: "Zone C — Highland Sector",
    score: 0.31,
    priorityLevel: "LOW",
    factors: [
      { label: "Flood severity", weight: 0.12 },
      { label: "Building damage density", weight: 0.09 },
      { label: "Population exposure", weight: 0.06 },
      { label: "Access road status", weight: 0.04 },
    ],
  },
  {
    assessmentId: "A-2284",
    area: "Zone D — Old Town Embankment",
    score: 0.72,
    priorityLevel: "HIGH",
    factors: [
      { label: "Flood severity", weight: 0.33 },
      { label: "Building damage density", weight: 0.22 },
      { label: "Population exposure", weight: 0.11 },
      { label: "Access road status", weight: 0.06 },
    ],
  },
  {
    assessmentId: "A-2283",
    area: "Zone E — Industrial Belt",
    score: 0.48,
    priorityLevel: "MEDIUM",
    factors: [
      { label: "Flood severity", weight: 0.18 },
      { label: "Building damage density", weight: 0.14 },
      { label: "Population exposure", weight: 0.09 },
      { label: "Access road status", weight: 0.07 },
    ],
  },
];

export const mapZones = {
  floodMask: [
    { id: "fm-1", lat: 13.1362, lng: 78.1298, radius: 1400 },
    { id: "fm-2", lat: 13.128, lng: 78.141, radius: 900 },
  ],
  damagedBuildings: [
    { id: "db-1", lat: 13.139, lng: 78.132, severity: "major" as const },
    { id: "db-2", lat: 13.133, lng: 78.126, severity: "destroyed" as const },
    { id: "db-3", lat: 13.141, lng: 78.135, severity: "minor" as const },
  ],
  priorityZones: [
    { id: "pz-1", lat: 13.1362, lng: 78.1298, level: "HIGH" as const, label: "Zone A" },
    { id: "pz-2", lat: 13.125, lng: 78.145, level: "MEDIUM" as const, label: "Zone B" },
    { id: "pz-3", lat: 13.15, lng: 78.118, level: "LOW" as const, label: "Zone C" },
  ],
};
