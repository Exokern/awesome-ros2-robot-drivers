export const QUALITY_GATE_THRESHOLDS = Object.freeze({
  minimumEntriesPerCategory: 3,
  maximumLicenseFollowUps: 5,
  maximumLastCheckedAgeDays: 180,
  minimumEvidenceLinksPerEntry: 2,
});

export function daysBetween(startDate, endDate) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.NaN;
  return Math.floor((end - start) / 86_400_000);
}

function categoryCounts(data) {
  return Object.fromEntries(
    (data.categories || []).map((category) => [
      category.id,
      (data.entries || []).filter((entry) => entry.category === category.id).length,
    ]),
  );
}

function oldestReviewAgeDaysByCategory(data) {
  return Object.fromEntries(
    (data.categories || []).map((category) => {
      const entries = (data.entries || []).filter((entry) => entry.category === category.id);
      const ages = entries.map((entry) => daysBetween(entry.last_checked, data.reviewed_at));
      const oldest = Math.max(...ages);
      return [category.id, Number.isFinite(oldest) ? oldest : null];
    }),
  );
}

function hasRequiredEvidence(entry) {
  if (!Array.isArray(entry.evidence) || entry.evidence.length < QUALITY_GATE_THRESHOLDS.minimumEvidenceLinksPerEntry) {
    return false;
  }

  return entry.evidence.some((evidence) => evidence.type === "repository" && evidence.url === entry.url)
    && entry.evidence.some((evidence) => evidence.type !== "repository");
}

export function buildQualityMetrics(data) {
  const countsByCategory = categoryCounts(data);
  const licenseFollowUps = (data.entries || []).filter((entry) => entry.license === "NOASSERTION");
  const evidenceFollowUps = (data.entries || []).filter((entry) => !hasRequiredEvidence(entry));
  const staleEntries = (data.entries || []).filter((entry) => (
    daysBetween(entry.last_checked, data.reviewed_at) > QUALITY_GATE_THRESHOLDS.maximumLastCheckedAgeDays
  ));
  const lowCoverageCategories = (data.categories || []).filter((category) => (
    countsByCategory[category.id] < QUALITY_GATE_THRESHOLDS.minimumEntriesPerCategory
  ));

  return {
    counts_by_category: countsByCategory,
    entries_with_visible_license_signal: (data.entries || []).length - licenseFollowUps.length,
    entries_with_required_evidence: (data.entries || []).length - evidenceFollowUps.length,
    license_follow_up_repos: licenseFollowUps.map((entry) => entry.repo).sort((a, b) => a.localeCompare(b)),
    evidence_follow_up_repos: evidenceFollowUps.map((entry) => entry.repo).sort((a, b) => a.localeCompare(b)),
    stale_entry_repos: staleEntries.map((entry) => entry.repo).sort((a, b) => a.localeCompare(b)),
    low_coverage_categories: lowCoverageCategories.map((category) => category.id).sort((a, b) => a.localeCompare(b)),
    oldest_review_age_days_by_category: oldestReviewAgeDaysByCategory(data),
  };
}

export function evaluateQualityGates(data) {
  const metrics = buildQualityMetrics(data);
  const gates = [
    {
      id: "minimum-category-coverage",
      name: "Minimum category coverage",
      threshold: `>= ${QUALITY_GATE_THRESHOLDS.minimumEntriesPerCategory} entries per category`,
      actual: `${metrics.low_coverage_categories.length} categories below threshold`,
      passed: metrics.low_coverage_categories.length === 0,
      failures: metrics.low_coverage_categories,
    },
    {
      id: "license-follow-up-budget",
      name: "License follow-up budget",
      threshold: `<= ${QUALITY_GATE_THRESHOLDS.maximumLicenseFollowUps} NOASSERTION entries`,
      actual: `${metrics.license_follow_up_repos.length} NOASSERTION entries`,
      passed: metrics.license_follow_up_repos.length <= QUALITY_GATE_THRESHOLDS.maximumLicenseFollowUps,
      failures: metrics.license_follow_up_repos,
    },
    {
      id: "review-freshness",
      name: "Review freshness",
      threshold: `<= ${QUALITY_GATE_THRESHOLDS.maximumLastCheckedAgeDays} days since last check`,
      actual: `${metrics.stale_entry_repos.length} stale entries`,
      passed: metrics.stale_entry_repos.length === 0,
      failures: metrics.stale_entry_repos,
    },
    {
      id: "evidence-completeness",
      name: "Evidence completeness",
      threshold: `>= ${QUALITY_GATE_THRESHOLDS.minimumEvidenceLinksPerEntry} evidence links per entry, including repository plus support`,
      actual: `${metrics.evidence_follow_up_repos.length} entries missing required evidence`,
      passed: metrics.evidence_follow_up_repos.length === 0,
      failures: metrics.evidence_follow_up_repos,
    },
  ];

  return {
    passed: gates.every((gate) => gate.passed),
    thresholds: QUALITY_GATE_THRESHOLDS,
    metrics,
    gates,
  };
}
