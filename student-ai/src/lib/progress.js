// ============================================================
// FILE: src/lib/progress.js
// PURPOSE: Weekly progress report logic.
//          All values derived from real data only.
//          Returns null fields when data is unavailable.
// MODULE: Weekly Progress Report (isolated)
// ============================================================

// ── Get ISO week number ───────────────────────────────────────
export function getISOWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// ── Filter sessions to current calendar week ─────────────────
export function sessionsThisWeek(sessions = []) {
  const now  = new Date();
  const day  = now.getDay(); // 0=Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Mon
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  return sessions.filter(s => {
    if (!s.createdAt) return false;
    const d = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    return d >= monday;
  });
}

// ── Token summary for the week ────────────────────────────────
export function weeklyTokenSummary(sessions = []) {
  const thisWeek = sessionsThisWeek(sessions);
  if (!thisWeek.length) return { earned: 0, sessions: 0, avg: 0 };

  const earned = thisWeek.reduce((s, x) => s + (x.tokensEarned || 0), 0);
  return {
    earned,
    sessions: thisWeek.length,
    avg: thisWeek.length ? Math.round(earned / thisWeek.length) : 0,
  };
}

// ── Study consistency score (0–100) ──────────────────────────
// Based on how many of the last 7 days had at least one session
export function studyConsistency(sessions = []) {
  if (!sessions.length) return { score: 0, activeDays: 0, label: 'No data' };

  const daysActive = new Set();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  sessions.forEach(s => {
    if (!s.createdAt) return;
    const d = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    if (d >= cutoff) daysActive.add(d.toDateString());
  });

  const active = daysActive.size;
  const score  = Math.round((active / 7) * 100);
  const label  = score >= 85 ? 'Excellent' : score >= 57 ? 'Consistent' : score >= 28 ? 'Irregular' : 'Just starting';

  return { score, activeDays: active, label };
}

// ── Academic progress snapshot ────────────────────────────────
// Only compares scores if we have before/after data
export function academicSnapshot(currentScores, sessions = []) {
  if (!currentScores) return null;

  // Accumulate deltas from session responses this week
  const thisWeek = sessionsThisWeek(sessions);
  let deltas = { academic: 0, finance: 0, stress: 0 };

  thisWeek.forEach(s => {
    const r = s.response;
    if (!r) return;
    deltas.academic += r.academicImpact?.score_delta  || 0;
    deltas.finance  += r.financialImpact?.score_delta || 0;
    deltas.stress   += r.stressImpact?.score_delta    || 0;
  });

  return {
    current: currentScores,
    weeklyDeltas: thisWeek.length > 0 ? deltas : null,
    hasSessions: thisWeek.length > 0,
  };
}

// ── Generate a non-repeated summary narrative ─────────────────
// Varies based on actual data — no hardcoded filler sentences
export function buildWeeklySummary({ tokenSummary, consistency, snapshot, streak }) {
  const parts = [];

  // Opening — varies by consistency
  if (consistency.score === 0) {
    parts.push("This is your first week report — no activity recorded yet.");
  } else if (consistency.score >= 85) {
    parts.push(`You stayed active ${consistency.activeDays} out of 7 days — that's elite consistency.`);
  } else if (consistency.score >= 57) {
    parts.push(`You were active on ${consistency.activeDays} days this week — solid but room to grow.`);
  } else {
    parts.push(`You showed up on ${consistency.activeDays} day${consistency.activeDays !== 1 ? 's' : ''} this week — every session counts.`);
  }

  // Tokens
  if (tokenSummary.earned > 0) {
    parts.push(`Earned ${tokenSummary.earned} tokens across ${tokenSummary.sessions} session${tokenSummary.sessions !== 1 ? 's' : ''}, averaging ${tokenSummary.avg} per session.`);
  } else {
    parts.push("No tokens earned this week — use the AI Copilot to start earning.");
  }

  // Streak
  if (streak > 0) {
    parts.push(`Current streak: ${streak} day${streak !== 1 ? 's' : ''}. Keep it going.`);
  }

  // Scores
  if (snapshot?.hasSessions && snapshot.weeklyDeltas) {
    const { academic, finance, stress } = snapshot.weeklyDeltas;
    const positives = [];
    const negatives = [];
    if (academic > 0) positives.push('academic'); else if (academic < 0) negatives.push('academic');
    if (finance  > 0) positives.push('finance');  else if (finance  < 0) negatives.push('finance');
    if (stress   < 0) positives.push('stress');   else if (stress   > 0) negatives.push('stress'); // stress: lower is better

    if (positives.length) parts.push(`Positive movement in: ${positives.join(', ')}.`);
    if (negatives.length) parts.push(`Needs attention: ${negatives.join(', ')}.`);
  }

  return parts.join(' ');
}
