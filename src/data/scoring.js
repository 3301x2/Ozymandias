import { PREFLIGHT_QUESTIONS } from "./questions";

const BUDGET_THRESHOLDS = { lean: 2, growth: 4, scale: 6 };

export function computeFitScore(option, answers) {
  let score = 100;
  const checks = ["volume", "latency", "skills", "strategy"];

  for (const key of checks) {
    const answer = answers[key];
    const allowed = option[key];
    if (!answer || !allowed) continue;
    if (allowed.includes("all")) continue;
    if (!allowed.includes(answer)) score -= 20;
  }

  // Cloud match — if user picked clouds, check compatibility
  const selectedClouds = answers._clouds;
  if (selectedClouds && selectedClouds.length > 0 && option.cloud) {
    if (!option.cloud.includes("all")) {
      const hasMatch = option.cloud.some((c) => selectedClouds.includes(c));
      if (!hasMatch) score -= 25;
    }
  }

  // Budget penalty — expensive tools penalized under lean budget
  const budget = answers.budget;
  if (budget && option.cost) {
    const threshold = BUDGET_THRESHOLDS[budget] || 6;
    if (option.cost > threshold) {
      score -= (option.cost - threshold) * 10;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function getFitBadge(score) {
  if (score >= 75) return { label: "\u2726 MATCH", style: "match" };
  if (score >= 45) return { label: "~ OK", style: "ok" };
  return { label: "LOW FIT", style: "low" };
}

export function sortByFit(options, answers) {
  return [...options].sort((a, b) => {
    const scoreA = computeFitScore(a, answers);
    const scoreB = computeFitScore(b, answers);
    return scoreB - scoreA;
  });
}

export function getPreflightSummary(answers) {
  const summary = [];
  for (const q of PREFLIGHT_QUESTIONS) {
    const picked = q.options.find((o) => o.id === answers[q.id]);
    if (picked) {
      summary.push({ title: q.title, icon: q.icon, value: picked.label });
    }
  }
  return summary;
}
