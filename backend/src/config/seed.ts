import { FloodCase } from "../models/FloodCase";
import { Assessment } from "../models/Assessment";
import { DamageResult } from "../models/DamageResult";
import { RescuePriority } from "../models/RescuePriority";
import { Report } from "../models/Report";
import { User } from "../models/User";

const LOCATIONS = [
  { name: "Kolar District, Karnataka", lat: 13.1362, lng: 78.1298 },
  { name: "East Godavari, Andhra Pradesh", lat: 16.9891, lng: 82.2475 },
  { name: "Ambarnath, Maharashtra", lat: 19.1996, lng: 73.1897 },
  { name: "Dhemaji, Assam", lat: 27.4833, lng: 94.5667 },
  { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Cuttack, Odisha", lat: 20.4625, lng: 85.8828 },
  { name: "New Delhi, Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { name: "Supaul, Bihar", lat: 26.1260, lng: 86.6053 },
  { name: "Aluva, Kerala", lat: 10.1076, lng: 76.3516 },
  { name: "Hoshangabad, Madhya Pradesh", lat: 22.7519, lng: 77.7289 },
  { name: "Srinagar, Jammu & Kashmir", lat: 34.0837, lng: 74.7973 },
  { name: "Chungthang, Sikkim", lat: 27.6039, lng: 88.6465 },
  { name: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Panaji, Goa", lat: 15.4909, lng: 73.8278 },
  { name: "Silchar, Assam", lat: 24.8333, lng: 92.7789 },
  { name: "Wayanad, Kerala", lat: 11.6854, lng: 76.1320 },
  { name: "Uttarkashi, Uttarakhand", lat: 30.7268, lng: 78.4354 },
  { name: "Kolhapur, Maharashtra", lat: 16.7050, lng: 74.2433 },
  { name: "Dibrugarh, Assam", lat: 27.4728, lng: 94.9120 },
  { name: "Vijayawada, Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
  { name: "Patna, Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Gorakhpur, Uttar Pradesh", lat: 26.7606, lng: 83.3732 },
  { name: "Guwahati, Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Kozhikode, Kerala", lat: 11.2588, lng: 75.7804 },
  { name: "Surat, Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Puri, Odisha", lat: 19.8135, lng: 85.8312 },
  { name: "Mangalore, Karnataka", lat: 12.9141, lng: 74.8560 },
  { name: "Sangli, Maharashtra", lat: 16.8524, lng: 74.5815 },
  { name: "Raiganj, West Bengal", lat: 25.6219, lng: 88.1256 },
  { name: "Bhagalpur, Bihar", lat: 25.2425, lng: 86.9842 },
  { name: "Shimla, Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Rishikesh, Uttarakhand", lat: 30.0869, lng: 78.2676 },
  { name: "Nanded, Maharashtra", lat: 19.1383, lng: 77.3210 },
  { name: "Belagavi, Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Nellore, Andhra Pradesh", lat: 14.4426, lng: 79.9865 },
  { name: "Jalpaiguri, West Bengal", lat: 26.5415, lng: 88.7196 },
  { name: "Agartala, Tripura", lat: 23.8315, lng: 91.2868 },
  { name: "Imphal, Manipur", lat: 24.8170, lng: 93.9368 },
  { name: "Latur, Maharashtra", lat: 18.4088, lng: 76.5604 },
  { name: "Warangal, Telangana", lat: 17.9689, lng: 79.5941 },
  { name: "Rajahmundry, Andhra Pradesh", lat: 17.0005, lng: 81.8040 },
  { name: "Moradabad, Uttar Pradesh", lat: 28.8386, lng: 78.7733 },
  { name: "Balasore, Odisha", lat: 21.4934, lng: 86.9135 },
  { name: "Mandi, Himachal Pradesh", lat: 31.5892, lng: 76.9182 },
  { name: "Ujjain, Madhya Pradesh", lat: 23.1765, lng: 75.7885 },
  { name: "Thrissur, Kerala", lat: 10.5276, lng: 76.2144 },
  { name: "Chiplun, Maharashtra", lat: 17.5323, lng: 73.5173 },
  { name: "Lakhimpur, Assam", lat: 27.2346, lng: 94.1042 },
  { name: "Bardhaman, West Bengal", lat: 23.2324, lng: 87.8615 },
  { name: "Canacona, Goa", lat: 15.0069, lng: 74.0435 },
];

const INCIDENT_TYPES = [
  "Embankment Breach Overflow",
  "Deltaic Storm Surge Submersion",
  "Flash Urban Waterlogging Crisis",
  "Riverine Char Settlement Inundation",
  "Coastal Buffer Zone Inundation",
  "Reservoir Spillway Emergency Release",
  "Glacial Meltwater River Migration",
  "Cloudburst Debris & Sediment Surge",
  "Canal Feeder Infrastructure Spill",
  "Spring Tide Estuary Inundation",
];

const DESCRIPTIONS = [
  "Sustained heavy monsoonal rainfall caused river embankment collapse, marooning low-lying agricultural hamlets.",
  "Upstream dam discharge combined with cyclonic sea swell submerged coastal delta villages.",
  "Flash urban flooding after 180mm rainfall over 4 hours overwhelmed municipal drainage trunk lines.",
  "Monsoon surge submerged riverine char settlements, forcing emergency rescue evacuations.",
  "High astronomical tide paired with persistent coastal rain breached protective dune buffers.",
  "Emergency reservoir gate release elevated downstream river basins beyond critical danger markers.",
  "Glacial lake outburst flood sent rapid high-turbidity water down narrow mountain river channels.",
  "Unprecedented cloudburst caused sudden river overflows and extensive road access blockages.",
];

const OFFICERS = [
  "Aisha Verma",
  "Rahul Nair",
  "Meera Iyer",
  "Vikram Rathore",
  "Priya Sharma",
  "Ananya Roy",
  "Devendra Singh",
  "Kavita Patel",
];

const STATUSES: Array<"active" | "assessing" | "reviewed" | "closed"> = [
  "assessing",
  "active",
  "reviewed",
  "closed",
];

export const seedDatabase = async (forceClean: boolean = false) => {
  try {
    if (forceClean) {
      console.log("🧹 Cleaning existing collections in MongoDB Atlas...");
      await FloodCase.deleteMany({});
      await Assessment.deleteMany({});
      await DamageResult.deleteMany({});
      await RescuePriority.deleteMany({});
      await Report.deleteMany({});
      console.log("✅ Existing data cleared successfully.");
    } else {
      const caseCount = await FloodCase.countDocuments();
      if (caseCount > 0) {
        console.log("ℹ️ Database already contains flood cases. Skipping seed.");
        return;
      }
    }

    console.log("🌱 Seeding 50+ diverse, high-variation FloodVisionAI cases into MongoDB Atlas...");

    // 1. Ensure Default Admin / Officer User
    let defaultUser = await User.findOne({ role: "officer" });
    if (!defaultUser) {
      defaultUser = await User.create({
        name: "Aisha Verma",
        email: "aisha.verma@floodvision.ai",
        password: "Password123!",
        role: "officer",
        status: "active",
      });
    }

    // 2. Generate 50 Varied Flood Cases
    const now = new Date("2026-09-01");
    const casesData = LOCATIONS.map((loc, idx) => {
      const caseNumber = 1050 - idx;
      const caseId = `FC-${caseNumber}`;
      const title = `${loc.name.split(",")[0]} ${INCIDENT_TYPES[idx % INCIDENT_TYPES.length]}`;
      const description = DESCRIPTIONS[idx % DESCRIPTIONS.length];
      const daysAgo = idx * 2 + 1;
      const eventDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const status = STATUSES[idx % STATUSES.length];
      const createdBy = OFFICERS[idx % OFFICERS.length];
      const affectedBuildings = Math.floor(60 + (idx * 37) % 850);
      const floodPercentage = Number((18.5 + ((idx * 13.7) % 72)).toFixed(1));

      return {
        caseId,
        title,
        description,
        location: { name: loc.name, latitude: loc.lat, longitude: loc.lng },
        eventDate,
        status,
        createdBy,
        affectedBuildings,
        floodPercentage,
      };
    });

    await FloodCase.insertMany(casesData);

    // 3. Generate 50 Corresponding AI Model Assessments
    const assessmentsData = casesData.map((c, idx) => ({
      assessmentId: `A-${3000 - idx}`,
      caseId: c.caseId,
      imageId: `IMG-${5000 + idx}`,
      status: "completed" as const,
      modelVersion: idx % 3 === 0 ? "v1.2.0" : idx % 2 === 0 ? "v1.1.0" : "v1.0.0",
      completedAt: new Date(c.eventDate.getTime() + 1000 * 60 * 60 * 4),
    }));

    await Assessment.insertMany(assessmentsData);

    // 4. Generate 50 Matching Damage Results
    const damageResultsData = casesData.map((c, idx) => {
      const total = c.affectedBuildings;
      const destroyed = Math.round(total * (0.08 + (idx % 7) * 0.02));
      const major = Math.round(total * (0.20 + (idx % 5) * 0.03));
      const minor = Math.round(total * (0.30 + (idx % 4) * 0.04));
      const noDamage = Math.max(0, total - (destroyed + major + minor));

      return {
        assessmentId: `A-${3000 - idx}`,
        floodPercentage: c.floodPercentage,
        affectedBuildings: c.affectedBuildings,
        damageClasses: {
          noDamage,
          minor,
          major,
          destroyed,
        },
        confidence: Number((0.84 + (idx % 12) * 0.01).toFixed(2)),
      };
    });

    await DamageResult.insertMany(damageResultsData);

    // 5. Generate 50 Rescue Priority Sector Rankings
    const sectorLabels = [
      "Zone A — Riverside Colony",
      "Zone B — Central Market Ward",
      "Zone C — Lowland Settlement",
      "Zone D — Embankment Perimeter",
      "Zone E — Industrial Corridor",
      "Zone F — Estuary Buffer Belt",
      "Zone G — Foothill Drainage Sector",
      "Zone H — Canal Feeder Basin",
      "Zone I — Municipal Outskirt",
      "Zone J — Coastal Delta Sector",
    ];

    const prioritiesData = casesData.map((c, idx) => {
      const rawScore = (c.floodPercentage / 100) * 0.75 + ((idx % 8) / 10) * 0.25;
      const score = Number(Math.min(0.97, Math.max(0.22, rawScore)).toFixed(2));
      const priorityLevel = score >= 0.72 ? ("HIGH" as const) : score >= 0.44 ? ("MEDIUM" as const) : ("LOW" as const);

      return {
        assessmentId: `A-${3000 - idx}`,
        area: `${sectorLabels[idx % sectorLabels.length]} (${c.location.name.split(",")[0]})`,
        score,
        priorityLevel,
        factors: [
          { label: "Inundation ratio factor", weight: Number((score * 0.42).toFixed(2)) },
          { label: "Building damage density", weight: Number((score * 0.31).toFixed(2)) },
          { label: "Population exposure index", weight: Number((score * 0.17).toFixed(2)) },
          { label: "Access road blockage level", weight: Number((score * 0.10).toFixed(2)) },
        ],
      };
    });

    await RescuePriority.insertMany(prioritiesData);

    // 6. Generate 50 Official Disaster Assessment Reports
    const reportsData = casesData.map((c, idx) => ({
      reportId: `RPT-${5000 - idx}`,
      caseId: c.caseId,
      title: `${c.title} — Disaster Assessment Report`,
      summary: `Official disaster assessment report for ${c.title} at ${c.location.name}. Measured flood coverage: ${c.floodPercentage}%, Total affected structures: ${c.affectedBuildings}.`,
      generatedBy: c.createdBy,
      fileUrl: `/reports/download/RPT-${5000 - idx}.pdf`,
    }));

    await Report.insertMany(reportsData);

    console.log("✅ Successfully seeded 50 highly varied flood cases, assessments, damage results, priority sectors, and official reports into MongoDB Atlas!");
  } catch (error) {
    console.error("❌ Database seeding error:", error);
  }
};
