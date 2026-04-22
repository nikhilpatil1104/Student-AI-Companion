// ============================================================
// FILE: src/pages/Tokens.jsx
// ============================================================

import React from 'react';
import { Coins, Flame, Zap, CheckCircle, XCircle } from 'lucide-react';
import { DUMMY_TOKEN_HISTORY, TOKEN_MILESTONES_PROGRESS, MASTER_STUDENT } from '../lib/dummyData';

export default function Tokens({ profile }) {
  const tokens  = profile?.tokens  ?? MASTER_STUDENT.tokens;
  const streak  = profile?.streak  ?? MASTER_STUDENT.streak;
  const nextMilestone = TOKEN_MILESTONES_PROGRESS.find(m => !m.reached);
  const tokensToNext  = nextMilestone ? nextMilestone.threshold - tokens : 0;
  const progressToNext = nextMilestone
    ? Math.min((tokens / nextMilestone.threshold) * 100, 100)
    : 100;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.25)' }}>
          <Coins size={20} color="#FFD700" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Campus Tokens</h1>
          <p className="text-xs text-white/30">Earn by making good decisions</p>
        </div>
      </div>

      {/* Balance card */}
      <div className="glass-card p-5 relative overflow-hidden"
        style={{ border: '1px solid rgba(255,215,0,0.2)', background: 'linear-gradient(135deg,rgba(255,215,0,0.06),rgba(13,17,32,0.9))' }}>
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10"
          style={{ background: 'radial-gradient(circle,#FFD700,transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-xs text-white/30 mb-1">Total Balance</p>
            <p className="font-display font-bold text-5xl token-glow" style={{ color: '#FFD700' }}>{tokens}</p>
            <p className="text-sm text-white/40 mt-1">Campus Tokens</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl mb-2"
              style={{ background: 'rgba(255,107,107,0.15)' }}>
              <Flame size={14} color="#FF6B6B" />
              <span className="font-bold font-mono text-sm" style={{ color: '#FF6B6B' }}>{streak} day streak</span>
            </div>
            <p className="text-xs text-white/25">+5 bonus per session</p>
          </div>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/30">Next: {nextMilestone.icon} {nextMilestone.label}</span>
              <span className="font-mono" style={{ color: '#FFD700' }}>{tokensToNext} to go</span>
            </div>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${progressToNext}%`, background: 'linear-gradient(90deg,#FFD700,#FFA500)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div>
        <p className="font-display font-semibold text-xs text-white/30 uppercase tracking-widest mb-3">Milestones</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TOKEN_MILESTONES_PROGRESS.map(m => (
            <div key={m.label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl flex-shrink-0 min-w-[80px]"
              style={{
                background: m.reached ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${m.reached ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
                opacity: m.reached ? 1 : 0.5,
              }}>
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] text-center text-white/50 leading-tight">{m.label}</span>
              <span className="font-mono text-[10px]" style={{ color: m.reached ? '#FFD700' : 'rgba(255,255,255,0.2)' }}>
                {m.threshold}
              </span>
              {m.reached
                ? <CheckCircle size={12} color="#00F5C4" />
                : <XCircle size={12} color="rgba(255,255,255,0.15)" />
              }
            </div>
          ))}
        </div>
      </div>

      {/* How to earn */}
      <div className="glass-card p-4">
        <p className="font-display font-semibold text-xs text-white/30 uppercase tracking-widest mb-3">How to Earn</p>
        <div className="space-y-2">
          {[
            { icon: '⚖️', label: 'Balanced day decision',  tokens: '+20', color: '#00F5C4' },
            { icon: '📈', label: 'Good effort session',    tokens: '+10', color: '#4FC3F7' },
            { icon: '🔥', label: 'Streak bonus (3+ days)', tokens: '+5',  color: '#FF6B6B' },
            { icon: '❌', label: 'Poor balance',           tokens: '0',   color: 'rgba(255,255,255,0.2)' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between gap-3 py-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">{r.icon}</span>
                <span className="text-sm text-white/60">{r.label}</span>
              </div>
              <span className="font-mono font-bold text-sm" style={{ color: r.color }}>{r.tokens}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <p className="font-display font-semibold text-xs text-white/30 uppercase tracking-widest mb-3">Recent Activity</p>
        <div className="space-y-2">
          {DUMMY_TOKEN_HISTORY.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: t.type === 'earn' ? 'rgba(108,99,255,0.15)' : t.type === 'bonus' ? 'rgba(255,107,107,0.1)' : 'rgba(255,255,255,0.05)' }}>
                {t.type === 'earn' ? <Zap size={13} color="#6C63FF" /> : t.type === 'bonus' ? <Flame size={13} color="#FF6B6B" /> : <XCircle size={13} color="rgba(255,255,255,0.2)" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 truncate">{t.action}</p>
                {t.badge && <p className="text-xs text-white/30">{t.badge}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono font-bold text-sm"
                  style={{ color: t.tokens > 0 ? '#FFD700' : 'rgba(255,255,255,0.2)' }}>
                  {t.tokens > 0 ? `+${t.tokens}` : '—'}
                </p>
                <p className="text-[10px] text-white/20">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}