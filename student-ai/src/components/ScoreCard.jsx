// ============================================================
// FILE: src/components/ScoreCard.jsx
// PURPOSE: Animated circular score indicator for each life area
// ============================================================

import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../lib/tokenScoring';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCard({ type, score, delta, icon, label }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animate, setAnimate] = useState(false);

  const { color, label: statusLabel } = getScoreColor(score, type);

  // Animate score counting up on mount / change
  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1200;
    const from = displayScore;
    const to = score;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  useEffect(() => {
    if (delta !== 0 && delta !== undefined) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(t);
    }
  }, [delta]);

  const strokeDashoffset = CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE;

  // Stress: invert visual (lower = better → show inverted ring)
  const effectiveScore = type === 'stress' ? 100 - displayScore : displayScore;
  const ringOffset = CIRCUMFERENCE - (effectiveScore / 100) * CIRCUMFERENCE;

  return (
    <div
      className="glass-card p-5 flex flex-col items-center gap-3 relative overflow-hidden group"
      style={{
        background: animate
          ? `rgba(${hexToRgb(color)}, 0.08)`
          : 'rgba(13, 17, 32, 0.8)',
        borderColor: animate ? `${color}60` : 'rgba(26, 32, 53, 0.8)',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
        }}
      />

      {/* SVG Ring */}
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="rgba(26, 32, 53, 0.8)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 50 50)"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
          {/* Center icon */}
          <text x="50" y="44" textAnchor="middle" fontSize="18">{icon}</text>
          {/* Center score */}
          <text
            x="50" y="62"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fontFamily="Syne"
            fill={color}
          >
            {displayScore}
          </text>
        </svg>

        {/* Delta badge */}
        {delta !== 0 && delta !== undefined && (
          <div
            className="absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full font-mono"
            style={{
              background: delta > 0 ? 'rgba(0, 245, 196, 0.2)' : 'rgba(255, 107, 107, 0.2)',
              color: delta > 0 ? '#00F5C4' : '#FF6B6B',
              border: `1px solid ${delta > 0 ? '#00F5C440' : '#FF6B6B40'}`,
            }}
          >
            {delta > 0 ? `+${delta}` : delta}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <div className="font-display font-semibold text-sm text-white/90">{label}</div>
        <div className="text-xs mt-0.5" style={{ color }}>{statusLabel}</div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '108, 99, 255';
}
