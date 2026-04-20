// ============================================================
// FILE: src/pages/WeeklyReport.jsx  (UPDATED — uses dummy data)
// ============================================================

import React from 'react';
import { TrendingUp, Calendar, Zap, BookOpen, Target, Flame } from 'lucide-react';
import { DUMMY_WEEKLY_ANALYTICS, DUMMY_GRADES, MASTER_STUDENT } from '../lib/dummyData';
import { getISOWeek } from '../lib/progress';

function ConsistencyDots({ active, total = 7 }) {
  return (
    <div className="flex gap-1.5 mt-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="w-6 h-6 rounded-md"
          style={{
            background: i < active ? 'rgba(108,99,255,0.7)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${i < active ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
          }} />
      ))}
      <span className="text-xs text-white/30 ml-1 self-center">{active}/{total} days</span>
    </div>
  );
}

export default function WeeklyReport({ profile }) {
  const a      = DUMMY_WEEKLY_ANALYTICS;
  const scores = profile?.scores ?? MASTER_STUDENT.scores;
  const streak = profile?.streak ?? MASTER_STUDENT.streak;
  const week   = getISOWeek();

  const atRiskSubjects = DUMMY_GRADES.filter(g => g.percentage < 75);
  const urgentExam     = DUMMY_GRADES.find(g => g.nextExam === 'Tomorrow');

  // Build narrative from real dummy values
  const summaryParts = [];
  if (a.activeDays >= 5) summaryParts.push(`Strong week — active ${a.activeDays}/7 days with ${a.totalStudyHours}h of study logged.`);
  else summaryParts.push(`You were active ${a.activeDays}/7 days and logged ${a.totalStudyHours}h of study.`);
  summaryParts.push(`Earned ${a.totalTokensWeek} tokens across ${a.sessionsCount} AI sessions.`);
  if (urgentExam) summaryParts.push(`⚠️ ${urgentExam.subject} exam is tomorrow — ${urgentExam.chaptersTotal - urgentExam.chaptersDone} chapters still uncovered.`);
  if (streak > 0) summaryParts.push(`${streak}-day streak active — keep it going.`);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5 animate-fadeInUp">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(0,245,196,0.12)', border: '1px solid rgba(0,245,196,0.2)' }}>
            <TrendingUp size={20} color="#00F5C4" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">Weekly Report</h1>
            <p className="text-xs text-white/30">Week {week} · {MASTER_STUDENT.name}</p>
          </div>
        </div>
        <p className="text-xs text-white/20 font-mono pt-1">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      {/* Summary */}
      <div className="glass-card p-5" style={{ border: '1px solid rgba(0,245,196,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} color="#00F5C4" />
          <span className="font-display font-semibold text-sm text-white/70">Week in Review</span>
        </div>
        <p className="text-sm text-white/65 leading-relaxed">{summaryParts.join(' ')}</p>
      </div>

      {/* Urgent alert */}
      {urgentExam && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }}>
          <p className="text-sm font-semibold text-white/80">🚨 {urgentExam.subject} — Exam Tomorrow</p>
          <p className="text-xs text-white/40 mt-1">
            {urgentExam.chaptersTotal - urgentExam.chaptersDone} chapters remaining · Use the AI Copilot for an emergency study plan
          </p>
        </div>
      )}

      {/* Token changes */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} color="#FFD700" />
          <span className="font-display font-semibold text-sm text-white/70">Token Changes</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Earned',      value: a.totalTokensWeek, color: '#FFD700' },
            { label: 'Sessions',    value: a.sessionsCount,   color: '#6C63FF' },
            { label: 'Avg/Session', value: Math.round(a.totalTokensWeek / a.sessionsCount), color: '#00F5C4' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 rounded-xl"
              style={{ background: `${color}0D`, border: `1px solid ${color}20` }}>
              <div className="font-display font-bold text-lg" style={{ color }}>{value}</div>
              <div className="text-xs text-white/30 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} color="#4FC3F7" />
            <span className="font-display font-semibold text-sm text-white/70">Study Consistency</span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
            style={{ color: '#00F5C4', background: 'rgba(0,245,196,0.1)' }}>
            {a.consistencyScore >= 85 ? 'Excellent' : a.consistencyScore >= 57 ? 'Consistent' : 'Irregular'}
          </span>
        </div>
        <ConsistencyDots active={a.activeDays} />
        <div className="flex items-center gap-1.5 mt-3">
          <Flame size={12} color="#FF6B6B" />
          <span className="text-xs text-white/40">{streak}-day streak active</span>
        </div>
      </div>

      {/* Academic snapshot */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} color="#6C63FF" />
          <span className="font-display font-semibold text-sm text-white/70">Academic Snapshot</span>
        </div>
        <div className="space-y-3">
          {DUMMY_GRADES.map(g => {
            const color = g.percentage >= 80 ? '#00F5C4' : g.percentage >= 65 ? '#4FC3F7' : g.percentage >= 50 ? '#FFD700' : '#FF6B6B';
            return (
              <div key={g.id} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-36 truncate">{g.subject}</span>
                <div className="flex-1 score-bar">
                  <div className="score-fill" style={{ width: `${g.percentage}%`, background: color }} />
                </div>
                <span className="font-mono text-xs w-8 text-right" style={{ color }}>{g.percentage}%</span>
                <span className="font-bold text-xs w-6 text-right" style={{ color }}>{g.grade}</span>
              </div>
            );
          })}
        </div>
        {atRiskSubjects.length > 0 && (
          <p className="text-xs text-white/30 mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            ⚠️ {atRiskSubjects.map(g => g.subject).join(', ')} need attention this week
          </p>
        )}
      </div>
    </div>
  );
}