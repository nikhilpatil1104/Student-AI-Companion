// ============================================================
// FILE: src/hooks/useTokens.js
// PURPOSE: Token state, animations, and Firebase sync
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { calculateTokenReward, applyScoreDeltas, getStreakBonus } from '../lib/tokenScoring';
import { updateUserProgress, saveSession } from '../lib/firebase';

export function useTokens(initialProfile) {
  const [profile, setProfile] = useState(initialProfile);
  const [recentAward, setRecentAward] = useState(null);
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);

  // ── Spawn token particles for animation ──────────────────
  const spawnParticles = useCallback((count = 5) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x: 40 + Math.random() * 60, // % from left
      delay: Math.random() * 0.5,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1500);
  }, []);

  // ── Process AI response → update scores + tokens ─────────
  const processResponse = useCallback(async (aiResponse, userQuery, userId) => {
    const reward = calculateTokenReward(aiResponse, userQuery);
    const streakBonus = getStreakBonus(profile.streak);
    const totalTokens = reward.amount + streakBonus.bonus;

    const newScores = applyScoreDeltas(profile.scores, aiResponse);

    const deltas = {
      academic: newScores.academic - profile.scores.academic,
      finance: newScores.finance - profile.scores.finance,
      stress: newScores.stress - profile.scores.stress,
    };

    // Optimistic UI update
    setProfile(prev => ({
      ...prev,
      tokens: prev.tokens + totalTokens,
      scores: newScores,
      streak: prev.streak + 1,
    }));

    if (totalTokens > 0) {
      setRecentAward({
        ...reward,
        amount: totalTokens,
        streakBonus: streakBonus.bonus,
        streakLabel: streakBonus.label,
      });
      spawnParticles(totalTokens === 20 ? 8 : 4);
      setTimeout(() => setRecentAward(null), 4000);
    }

    // Persist to Firebase (non-blocking)
    if (userId && !userId.startsWith('demo')) {
      try {
        await Promise.all([
          updateUserProgress(userId, {
            tokensEarned: totalTokens,
            scoreDeltas: deltas,
          }),
          saveSession(userId, {
            query: userQuery,
            response: aiResponse,
            tokensEarned: totalTokens,
          }),
        ]);
      } catch (err) {
        console.warn('Firebase sync failed (offline?):', err);
      }
    }

    return { reward, totalTokens, newScores };
  }, [profile, spawnParticles]);

  return {
    profile,
    setProfile,
    recentAward,
    particles,
    processResponse,
  };
}
