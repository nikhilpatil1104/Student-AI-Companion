// ============================================================
// FILE: src/pages/Analytics.jsx  (UPDATED — uses dummy data)
// ============================================================

import React from 'react';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';
import { DUMMY_WEEKLY_ANALYTICS, MASTER_STUDENT, DUMMY_GRADES } from '../lib/dummyData';
import { scoreLabel } from '../lib/analytics';

function BarChart({ data, valueKey, color, maxOverride }) {
  const max = maxOverride ?? Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1.5 h-28 w-full">
      {data.map(d => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-lg relative group transition-all duration-700"
            style={{
              height: `${Math.max((d[valueKey] / max) * 88, d[valueKey] > 0 ? 6 : 2)}px`,
              background: d[valueKey] > 0 ? `linear-gradient(180deg,${color},${color}88)` : 'rgba(255,255,255,0.05)',
              minHeight: 2,
            }}>
            {d[valueKey] > 0 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-1.5 py-0.5 rounded"
                style={{ color, background: `${color}20` }}>
                {d[valueKey]}
              </div>
            )}
          </div>
          <span className="text-[10px] text-white/30 font-mono">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="glass-card p-4" style={{ border: `1px solid ${color}20` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
        <Icon size={15} color={color} />
      </div>
      <div className="font-display font-bold text-2xl text-white">{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color }}>{sub}</div>}
    </div>
  );
}

function ScoreRow({ label, value, type }) {
  const color = type === 'stress'
    ? value <= 40 ? '#00F5C4' : value <= 65 ? '#FFD700' : '#FF6B6B'
    : value >= 70 ? '#00F5C4' : value >= 45 ? '#FFD700' : '#FF6B6B';
  const pct = type === 'stress' ? 100 - value : value;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{value}/100 · {scoreLabel(value, type)}</span>
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Analytics({ profile }) {
  const scores = profile?.scores ?? MASTER_STUDENT.scores;
  const a      = DUMMY_WEEKLY_ANALYTICS;
  const atRisk = DUMMY_GRADES.filter(g => g.status === 'at-risk' || g.percentage < 70).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)' }}>
          <BarChart2 size={20} color="#6C63FF" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Analytics</h1>
          <p className="text-xs text-white/30">{MASTER_STUDENT.name} · This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Activity}   label="Sessions this week"  value={a.sessionsCount}         color="#6C63FF" />
        <StatCard icon={TrendingUp} label="Tokens earned"       value={a.totalTokensWeek}       color="#FFD700" sub="+130 this week" />
        <StatCard icon={BarChart2}  label="Study hours"         value={`${a.totalStudyHours}h`} color="#00F5C4" />
        <StatCard icon={Activity}   label="Subjects at risk"    value={atRisk}                  color="#FF6B6B" sub={atRisk > 0 ? 'Need attention' : 'All good'} />
      </div>

      <div className="glass-card p-5">
        <p className="font-display font-semibold text-sm text-white/70 mb-4">Token Earnings — This Week</p>
        <BarChart data={a.tokensByDay} valueKey="tokens" color="#6C63FF" />
      </div>

      <div className="glass-card p-5">
        <p className="font-display font-semibold text-sm text-white/70 mb-4">Study Hours — This Week</p>
        <BarChart data={a.studyHoursByDay} valueKey="hours" color="#00F5C4" maxOverride={8} />
      </div>

      <div className="glass-card p-5 space-y-4">
        <p className="font-display font-semibold text-sm text-white/70">Score Overview</p>
        <ScoreRow label="Academic" value={scores.academic} type="academic" />
        <ScoreRow label="Finance"  value={scores.finance}  type="finance" />
        <ScoreRow label="Stress"   value={scores.stress}   type="stress" />
        <p className="text-xs text-white/20 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          Based on {a.sessionsCount} AI Copilot sessions this week
        </p>
      </div>
    </div>
  );
}