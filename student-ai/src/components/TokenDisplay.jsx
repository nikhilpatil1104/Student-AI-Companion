// ============================================================
// FILE: src/components/TokenDisplay.jsx
// PURPOSE: Gamified token balance + recent award notification
// ============================================================

import React from 'react';
import { Coins, Zap, Flame } from 'lucide-react';
import { getTokenMilestone } from '../lib/tokenScoring';

export default function TokenDisplay({ tokens, streak, recentAward, particles }) {
  const milestone = getTokenMilestone(tokens);

  return (
    <div className="relative">
      {/* Floating particles on token award */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="token-particle absolute pointer-events-none z-50 text-yellow-400 font-bold text-sm"
          style={{
            left: `${p.x}%`,
            bottom: '100%',
            animationDelay: `${p.delay}s`,
          }}
        >
          +⭐
        </div>
      ))}

      {/* Main token card */}
      <div
        className="glass-card p-4 relative overflow-hidden"
        style={{
          border: '1px solid rgba(255, 215, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(13, 17, 32, 0.9) 100%)',
        }}
      >
        {/* Corner sparkle */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{
            background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Token count */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255, 215, 0, 0.15)' }}
            >
              <Coins size={20} color="#FFD700" />
            </div>
            <div>
              <div className="text-xs text-white/40 font-body">Campus Tokens</div>
              <div
                className="text-2xl font-display font-bold token-glow"
                style={{ color: '#FFD700' }}
              >
                {tokens.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(255, 107, 107, 0.15)' }}
            >
              <Flame size={14} color="#FF6B6B" />
              <span className="text-sm font-bold font-mono" style={{ color: '#FF6B6B' }}>
                {streak}d
              </span>
            </div>
            <span className="text-xs text-white/30">streak</span>
          </div>
        </div>

        {/* Milestone badge */}
        {milestone && (
          <div className="mt-3 flex items-center gap-2 pt-3"
            style={{ borderTop: '1px solid rgba(255, 215, 0, 0.1)' }}
          >
            <span className="text-base">{milestone.badge.split(' ')[0]}</span>
            <div>
              <div className="text-xs font-semibold" style={{ color: '#FFD700' }}>
                {milestone.badge.split(' ').slice(1).join(' ')}
              </div>
              <div className="text-xs text-white/30">{milestone.message}</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent award notification */}
      {recentAward && (
        <div
          className="absolute -top-16 left-0 right-0 mx-auto w-fit px-4 py-2 rounded-2xl flex items-center gap-2 z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.9), rgba(0, 245, 196, 0.9))',
            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          <Zap size={16} color="#fff" />
          <span className="text-white font-bold text-sm whitespace-nowrap">
            +{recentAward.amount} tokens — {recentAward.badge || recentAward.reason}
          </span>
        </div>
      )}
    </div>
  );
}
