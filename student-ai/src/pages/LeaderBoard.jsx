// ============================================================
// FILE: src/pages/Leaderboard.jsx
// ============================================================

import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { DUMMY_LEADERBOARD, MASTER_STUDENT } from '../lib/dummyData';

const RANK_STYLE = {
  1: { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',  border: 'rgba(255,215,0,0.25)',  size: 'text-lg' },
  2: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.1)', border: 'rgba(192,192,192,0.2)', size: 'text-base' },
  3: { color: '#CD7F32', bg: 'rgba(205,127,50,0.1)',  border: 'rgba(205,127,50,0.2)',  size: 'text-base' },
};

export default function Leaderboard() {
  const me = DUMMY_LEADERBOARD.find(u => u.isMe);
  const tokensToNext = me ? (DUMMY_LEADERBOARD[me.rank - 2]?.tokens ?? 0) - me.tokens : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.25)' }}>
          <Trophy size={20} color="#FFD700" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Leaderboard</h1>
          <p className="text-xs text-white/30">{MASTER_STUDENT.university} · This Week</p>
        </div>
      </div>

      {/* My position card */}
      {me && (
        <div className="glass-card p-4"
          style={{ border: '1px solid rgba(108,99,255,0.3)', background: 'rgba(108,99,255,0.08)' }}>
          <p className="text-xs text-white/30 mb-2">Your position</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-2xl" style={{ color: '#6C63FF' }}>#{me.rank}</span>
              <div>
                <p className="font-semibold text-sm text-white">{me.name}</p>
                <p className="text-xs text-white/40">{me.tokens} tokens · {me.streak}d streak</p>
              </div>
            </div>
            {tokensToNext > 0 && (
              <div className="text-right">
                <p className="text-xs text-white/30">To reach #{me.rank - 1}</p>
                <p className="font-mono font-bold text-sm" style={{ color: '#FFD700' }}>+{tokensToNext} tokens</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[DUMMY_LEADERBOARD[1], DUMMY_LEADERBOARD[0], DUMMY_LEADERBOARD[2]].map((u, i) => {
          const displayRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const s = RANK_STYLE[displayRank];
          const heightClass = displayRank === 1 ? 'pt-0' : 'pt-4';
          return (
            <div key={u.rank} className={`flex flex-col items-center gap-2 ${heightClass}`}>
              <div className="text-2xl">{u.badge}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
                style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                {u.avatar}
              </div>
              <p className="text-xs text-white/70 text-center font-semibold truncate w-full text-center">{u.name.split(' ')[0]}</p>
              <div className="text-center">
                <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{u.tokens}</p>
                <p className="text-[10px] text-white/25">tokens</p>
              </div>
              <div className="py-1 px-3 rounded-full text-xs font-bold"
                style={{ background: s.bg, color: s.color }}>#{displayRank}</div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {DUMMY_LEADERBOARD.map(u => {
          const ChangeIcon = u.change === 'up' ? TrendingUp : u.change === 'down' ? TrendingDown : Minus;
          const changeColor = u.change === 'up' ? '#00F5C4' : u.change === 'down' ? '#FF6B6B' : 'rgba(255,255,255,0.2)';
          const s = RANK_STYLE[u.rank];
          return (
            <div key={u.rank}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150"
              style={{
                background: u.isMe ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: u.isMe ? '1px solid rgba(108,99,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
              }}>
              <span className="font-mono font-bold text-sm w-6 text-center"
                style={{ color: s?.color ?? 'rgba(255,255,255,0.3)' }}>
                {u.rank}
              </span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                style={{ background: u.isMe ? 'linear-gradient(135deg,#6C63FF,#00F5C4)' : 'rgba(255,255,255,0.08)', color: '#fff' }}>
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/85 truncate">
                  {u.name} {u.isMe && <span className="text-xs text-white/30">(you)</span>}
                </p>
                <p className="text-xs text-white/30 truncate">{u.major}</p>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={11} color="#FF6B6B" />
                <span className="text-xs font-mono text-white/40">{u.streak}d</span>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm" style={{ color: s?.color ?? '#FFD700' }}>{u.tokens}</p>
                <p className="text-[10px] text-white/20">tokens</p>
              </div>
              <ChangeIcon size={13} color={changeColor} />
            </div>
          );
        })}
      </div>
    </div>
  );
}