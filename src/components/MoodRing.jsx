// ============================================================
// FILE: src/components/MoodRing.jsx
// PURPOSE: Animated ambient mood indicator based on stress + scores
// ============================================================

import React, { useMemo } from 'react';

const MOODS = [
  { label: 'Zen Mode', emoji: '🧘', color: '#00F5C4', bg: 'rgba(0,245,196,0.1)', desc: 'Balanced and in control' },
  { label: 'Focused', emoji: '🎯', color: '#4FC3F7', bg: 'rgba(79,195,247,0.1)', desc: 'Sharp and productive' },
  { label: 'Grinding', emoji: '⚡', color: '#FFD700', bg: 'rgba(255,215,0,0.1)', desc: 'Working hard, stay hydrated' },
  { label: 'Stressed', emoji: '🔥', color: '#FF9800', bg: 'rgba(255,152,0,0.1)', desc: 'Take a breath, you got this' },
  { label: 'Overloaded', emoji: '🆘', color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', desc: 'Time to ask for help' },
];

function getMood(scores) {
  const { academic, finance, stress } = scores;
  const avgPositive = (academic + finance) / 2;
  if (stress <= 25 && avgPositive >= 75) return MOODS[0];
  if (stress <= 40 && avgPositive >= 60) return MOODS[1];
  if (stress <= 55 && avgPositive >= 45) return MOODS[2];
  if (stress <= 70) return MOODS[3];
  return MOODS[4];
}

export default function MoodRing({ scores }) {
  const mood = useMemo(() => getMood(scores), [scores]);

  return (
    <div
      className="glass-card p-4 flex items-center gap-4 relative overflow-hidden"
      style={{ border: `1px solid ${mood.color}25` }}
    >
      {/* Background pulse */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{ background: `radial-gradient(circle at 20% 50%, ${mood.color}08, transparent 60%)` }}
      />

      {/* Emoji with rotating ring */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 48 48">
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={mood.color}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.4"
          />
        </svg>
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center text-xl"
          style={{ background: mood.bg }}
        >
          {mood.emoji}
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10">
        <div className="font-display font-bold text-sm" style={{ color: mood.color }}>
          {mood.label}
        </div>
        <div className="text-xs text-white/40 mt-0.5">{mood.desc}</div>
      </div>

      {/* Right: overall score */}
      <div className="ml-auto relative z-10 text-right">
        <div className="text-xs text-white/30 mb-1">Overall</div>
        <div
          className="font-mono font-bold text-lg"
          style={{ color: mood.color }}
        >
          {Math.round((scores.academic + scores.finance + (100 - scores.stress)) / 3)}
        </div>
      </div>
    </div>
  );
}
