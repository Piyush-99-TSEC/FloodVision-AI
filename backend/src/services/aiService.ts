import { DamageResult, IDamageResult } from "../models/DamageResult";
import { RescuePriority, IRescuePriority } from "../models/RescuePriority";

export const runAiAssessment = async (params: {
  assessmentId: string;
  caseId: string;
  imageId: string;
}): Promise<{ damageResult: IDamageResult; rescuePriority: IRescuePriority }> => {
  // Mock AI Deep Learning Inundation & Building Damage Analysis
  const floodPercentage = parseFloat((35 + Math.random() * 45).toFixed(1));
  const affectedBuildings = Math.floor(80 + Math.random() * 400);

  const noDamage = Math.floor(affectedBuildings * 0.35);
  const minor = Math.floor(affectedBuildings * 0.35);
  const major = Math.floor(affectedBuildings * 0.2);
  const destroyed = affectedBuildings - (noDamage + minor + major);

  const damageResult = await DamageResult.create({
    assessmentId: params.assessmentId,
    floodPercentage,
    affectedBuildings,
    damageClasses: {
      noDamage,
      minor,
      major,
      destroyed,
    },
    confidence: parseFloat((0.88 + Math.random() * 0.08).toFixed(2)),
    floodMask: {
      type: "Polygon",
      coordinates: [
        [
          [78.12, 13.13],
          [78.14, 13.13],
          [78.14, 13.15],
          [78.12, 13.15],
          [78.12, 13.13],
        ],
      ],
    },
    damageOverlay: {
      detectionCount: affectedBuildings,
      heatMapUrl: "/static/masks/sample_mask.png",
    },
  });

  const priorityLevel = floodPercentage > 60 ? "HIGH" : floodPercentage > 40 ? "MEDIUM" : "LOW";
  const score = parseFloat((floodPercentage / 100 * 0.9 + 0.05).toFixed(2));

  const rescuePriority = await RescuePriority.create({
    assessmentId: params.assessmentId,
    area: `Zone ${params.caseId} Inundation Sector`,
    score,
    priorityLevel,
    factors: [
      { label: "Flood severity", weight: parseFloat((0.35 + Math.random() * 0.1).toFixed(2)) },
      { label: "Building damage density", weight: parseFloat((0.25 + Math.random() * 0.1).toFixed(2)) },
      { label: "Population exposure", weight: parseFloat((0.15 + Math.random() * 0.1).toFixed(2)) },
      { label: "Access road status", weight: parseFloat((0.10 + Math.random() * 0.05).toFixed(2)) },
    ],
  });

  return { damageResult, rescuePriority };
};
