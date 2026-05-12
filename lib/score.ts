export interface ImpactCounts {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

const WEIGHTS = {
  critical: 5,
  serious: 3,
  moderate: 1,
  minor: 0.5,
} as const;

/**
 * Transparent score: start at 100, deduct per issue weighted by severity, floor at 0.
 */
export function calculateScore(byImpact: ImpactCounts): number {
  const deduction =
    byImpact.critical * WEIGHTS.critical +
    byImpact.serious * WEIGHTS.serious +
    byImpact.moderate * WEIGHTS.moderate +
    byImpact.minor * WEIGHTS.minor;
  return Math.max(0, Math.round(100 - deduction));
}

export type ScoreTier = "good" | "ok" | "bad";

export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return "good";
  if (score >= 50) return "ok";
  return "bad";
}
