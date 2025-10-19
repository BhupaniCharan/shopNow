// Simple heuristic-based AI utilities for category and duration suggestions

const CATEGORY_KEYWORDS = [
  { key: "ac", category: "HVAC" },
  { key: "air conditioner", category: "HVAC" },
  { key: "fridge", category: "Appliance" },
  { key: "refrigerator", category: "Appliance" },
  { key: "washing machine", category: "Appliance" },
  { key: "tv", category: "Electronics" },
  { key: "television", category: "Electronics" },
  { key: "laptop", category: "Computer" },
  { key: "pc", category: "Computer" },
  { key: "desktop", category: "Computer" },
  { key: "phone", category: "Mobile" },
  { key: "mobile", category: "Mobile" },
  { key: "pipe", category: "Plumbing" },
  { key: "leak", category: "Plumbing" },
  { key: "tap", category: "Plumbing" },
  { key: "switch", category: "Electrical" },
  { key: "socket", category: "Electrical" },
  { key: "wiring", category: "Electrical" },
  { key: "light", category: "Electrical" },
];

const DURATION_BASE = {
  HVAC: 120,
  Appliance: 90,
  Electronics: 75,
  Computer: 60,
  Mobile: 45,
  Plumbing: 60,
  Electrical: 60,
  Other: 60,
};

const DURATION_MODIFIERS = [
  { key: "install", delta: 45 },
  { key: "replace", delta: 30 },
  { key: "broken", delta: 20 },
  { key: "not working", delta: 20 },
  { key: "no power", delta: 20 },
  { key: "diagnose", delta: 15 },
  { key: "clean", delta: -10 },
  { key: "tune", delta: -5 },
  { key: "urgent", delta: 15 },
];

export function suggestCategory(description = "", deviceType = "") {
  const text = `${deviceType} ${description}`.toLowerCase();
  for (const { key, category } of CATEGORY_KEYWORDS) {
    if (text.includes(key)) return category;
  }
  if (/ac|aircon/.test(text)) return "HVAC";
  if (/fan/.test(text)) return "Electrical";
  return "Other";
}

export function estimateDurationMinutes(
  description = "",
  category = "Other"
) {
  const text = description.toLowerCase();
  let estimate = DURATION_BASE[category] ?? DURATION_BASE.Other;
  for (const { key, delta } of DURATION_MODIFIERS) {
    if (text.includes(key)) estimate += delta;
  }
  // clamp to [30, 240]
  if (estimate < 30) estimate = 30;
  if (estimate > 240) estimate = 240;
  return Math.round(estimate);
}

export function suggestCategoryAndDuration({ description, deviceType }) {
  const category = suggestCategory(description, deviceType);
  const estimatedDurationMinutes = estimateDurationMinutes(description, category);
  return { category, estimatedDurationMinutes };
}
