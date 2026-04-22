// ============================================================
// FILE: src/lib/analytics.js
// PURPOSE: Derive analytics from real user data only.
//          Never invents data. Returns null/empty on missing input.
// MODULE: Analytics (isolated)
// ============================================================

// ── Token trend: derive from session history ─────────────────
// sessions: array of { tokensEarned, createdAt } from Firestore
export function deriveTokenTrend(sessions = []) {
  if (!sessions.length) return [];

  // Group tokens earned by date (last 7 days)
  const byDate = {};
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    byDate[key] = 0;
  }

  sessions.forEach(s => {
    if (!s.createdAt) return;
    const date = s.createdAt.toDate
      ? s.createdAt.toDate()
      : new Date(s.createdAt);
    const key = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (key in byDate) {
      byDate[key] += s.tokensEarned || 0;
    }
  });

  return Object.entries(byDate).map(([day, tokens]) => ({ day, tokens }));
}

// ── Session activity: how many AI sessions per day ───────────
export function deriveActivitySummary(sessions = []) {
  if (!sessions.length) return { totalSessions: 0, avgPerDay: 0, mostActiveDay: null };

  const dayCounts = {};
  sessions.forEach(s => {
    if (!s.createdAt) return;
    const date = s.createdAt.toDate
      ? s.createdAt.toDate()
      : new Date(s.createdAt);
    const key = date.toLocaleDateString('en-US', { weekday: 'long' });
    dayCounts[key] = (dayCounts[key] || 0) + 1;
  });

  const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const avgPerDay = sessions.length > 0
    ? (sessions.length / Math.max(Object.keys(dayCounts).length, 1)).toFixed(1)
    : 0;

  return {
    totalSessions: sessions.length,
    avgPerDay: parseFloat(avgPerDay),
    mostActiveDay,
    dayCounts,
  };
}

// ── Academic overview: derive from scores history ────────────
// scoreHistory: array of { scores: {academic, finance, stress}, createdAt }
export function deriveAcademicOverview(currentScores, sessions = []) {
  if (!currentScores) return null;

  // Find best/worst from session score deltas
  let academicDeltaTotal = 0;
  let financeDeltaTotal  = 0;
  let stressDeltaTotal   = 0;
  let counted = 0;

  sessions.forEach(s => {
    const r = s.response;
    if (!r) return;
    academicDeltaTotal += r.academicImpact?.score_delta  || 0;
    financeDeltaTotal  += r.financialImpact?.score_delta || 0;
    stressDeltaTotal   += r.stressImpact?.score_delta    || 0;
    counted++;
  });

  return {
    current: currentScores,
    trend: counted > 0 ? {
      academic: academicDeltaTotal,
      finance:  financeDeltaTotal,
      stress:   stressDeltaTotal,
    } : null,
    sessionsCounted: counted,
  };
}

// ── Score label helper ────────────────────────────────────────
export function scoreLabel(value, type = 'default') {
  if (type === 'stress') {
    if (value <= 30) return 'Low';
    if (value <= 60) return 'Medium';
    return 'High';
  }
  if (value >= 80) return 'Excellent';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Needs Work';
  return 'Critical';
}

// ── Token velocity: tokens earned in last 7 days ─────────────
export function tokenVelocity(sessions = []) {
  if (!sessions.length) return 0;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  return sessions.reduce((sum, s) => {
    if (!s.createdAt) return sum;
    const date = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    return date >= cutoff ? sum + (s.tokensEarned || 0) : sum;
  }, 0);
}
