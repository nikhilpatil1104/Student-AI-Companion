// ============================================================
// FILE: src/lib/tokenScoring.js
// PURPOSE: Token scoring algorithm + score clamping
// ============================================================

// ── Token award logic ────────────────────────────────────────
// Called after AI response arrives to validate + finalize tokens

export function calculateTokenReward(aiResponse, userQuery) {
  if (!aiResponse) return { amount: 0, reason: 'No response received' };

  const { academicImpact, financialImpact, stressImpact } = aiResponse;

  // Sum up score deltas
  const totalDelta =
    (academicImpact?.score_delta || 0) +
    (financialImpact?.score_delta || 0) +
    (stressImpact?.score_delta || 0);

  // Detect query quality (student engaged thoughtfully?)
  const queryLength = userQuery?.trim().split(' ').length || 0;
  const isThoughtful = queryLength >= 5;

  // Scoring tiers
  if (totalDelta >= 6 && isThoughtful) {
    return {
      amount: 20,
      reason: 'Balanced, positive impact across all areas!',
      badge: aiResponse.tokenReward?.badge || '⚖️ Life Balancer',
      tier: 'balanced',
    };
  }

  if (totalDelta >= 2 || isThoughtful) {
    return {
      amount: 10,
      reason: 'Good effort — keep building momentum!',
      badge: '📈 Progress Maker',
      tier: 'good',
    };
  }

  return {
    amount: 0,
    reason: 'Focus on balance across academics, finance, and wellness.',
    badge: null,
    tier: 'poor',
  };
}

// ── Clamp scores between 0–100 ───────────────────────────────
export function clampScore(current, delta) {
  return Math.min(100, Math.max(0, current + delta));
}

// ── Apply score deltas to user profile ───────────────────────
export function applyScoreDeltas(currentScores, aiResponse) {
  if (!aiResponse) return currentScores;

  return {
    academic: clampScore(
      currentScores.academic,
      aiResponse.academicImpact?.score_delta || 0
    ),
    finance: clampScore(
      currentScores.finance,
      aiResponse.financialImpact?.score_delta || 0
    ),
    stress: clampScore(
      currentScores.stress,
      aiResponse.stressImpact?.score_delta || 0
    ),
  };
}

// ── Score color thresholds ───────────────────────────────────
export function getScoreColor(score, type = 'default') {
  // Stress score: lower is BETTER
  if (type === 'stress') {
    if (score <= 30) return { color: '#00F5C4', label: 'Zen Master' };
    if (score <= 55) return { color: '#FFD700', label: 'Managing' };
    return { color: '#FF6B6B', label: 'Overloaded' };
  }

  // Academic / Finance: higher is BETTER
  if (score >= 80) return { color: '#00F5C4', label: 'Excellent' };
  if (score >= 60) return { color: '#4FC3F7', label: 'Good' };
  if (score >= 40) return { color: '#FFD700', label: 'Needs Work' };
  return { color: '#FF6B6B', label: 'Critical' };
}

// ── Streak bonus ─────────────────────────────────────────────
export function getStreakBonus(streak) {
  if (streak >= 7) return { bonus: 10, label: '🔥 Week Warrior!' };
  if (streak >= 3) return { bonus: 5, label: '⚡ On a Roll!' };
  return { bonus: 0, label: null };
}

// ── Token milestone messages ─────────────────────────────────
export const TOKEN_MILESTONES = [
  { threshold: 500, badge: '🏆 Campus Legend', message: 'You\'ve reached legendary status!' },
  { threshold: 250, badge: '💎 Diamond Student', message: 'Diamond-level decision maker!' },
  { threshold: 100, badge: '🥇 Gold Scholar', message: 'Breaking into the top tier!' },
  { threshold: 50, badge: '🥈 Silver Thinker', message: 'Building great habits!' },
  { threshold: 10, badge: '🌱 Rising Star', message: 'Your journey begins!' },
];

export function getTokenMilestone(tokens) {
  return TOKEN_MILESTONES.find(m => tokens >= m.threshold) || null;
}
