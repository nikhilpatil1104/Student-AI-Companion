// ============================================================
// FILE: src/pages/Grades.jsx
// ============================================================

import React, { useState } from 'react';
import { BookOpen, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { DUMMY_GRADES, MASTER_STUDENT } from '../lib/dummyData';

const GRADE_COLOR = { A: '#00F5C4', 'A-': '#00F5C4', 'B+': '#4FC3F7', B: '#4FC3F7', 'C+': '#FFD700', C: '#FF9800', D: '#FF6B6B' };

function GradeRing({ percentage, color }) {
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 34 34)"
        style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${color}80)` }} />
      <text x="34" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Syne" fill={color}>{percentage}%</text>
    </svg>
  );
}

function ChapterBar({ done, total, color }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/30">Chapters covered</span>
        <span className="font-mono" style={{ color }}>{done}/{total} ({pct}%)</span>
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Grades() {
  const [selected, setSelected] = useState(null);
  const gpa = (DUMMY_GRADES.reduce((s, g) => s + g.percentage, 0) / DUMMY_GRADES.length / 10).toFixed(1);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(79,195,247,0.15)', border: '1px solid rgba(79,195,247,0.25)' }}>
            <BookOpen size={20} color="#4FC3F7" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">Grades</h1>
            <p className="text-xs text-white/30">{MASTER_STUDENT.major} · {MASTER_STUDENT.year}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-2xl" style={{ color: '#00F5C4' }}>{gpa}</div>
          <div className="text-xs text-white/30">Avg Score</div>
        </div>
      </div>

      {/* Alert: upcoming exam tomorrow */}
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }}>
        <AlertTriangle size={16} color="#FF6B6B" className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white/80">Machine Learning exam is TOMORROW</p>
          <p className="text-xs text-white/40 mt-0.5">You've covered 8/20 chapters · 12 chapters remaining · Use AI Copilot to get a study plan</p>
        </div>
      </div>

      {/* Grade cards */}
      <div className="space-y-3">
        {DUMMY_GRADES.map(g => {
          const color = GRADE_COLOR[g.grade] ?? '#FFD700';
          const open  = selected === g.id;
          const TrendIcon = g.trend === 'up' ? TrendingUp : g.trend === 'down' ? TrendingDown : Minus;
          const trendColor = g.trend === 'up' ? '#00F5C4' : g.trend === 'down' ? '#FF6B6B' : 'rgba(255,255,255,0.3)';

          return (
            <div key={g.id}
              className="glass-card overflow-hidden cursor-pointer transition-all duration-200"
              style={{ border: `1px solid ${open ? color + '40' : 'rgba(26,32,53,0.8)'}` }}
              onClick={() => setSelected(open ? null : g.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <GradeRing percentage={g.percentage} color={color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm text-white">{g.subject}</span>
                    {g.status === 'at-risk' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B' }}>AT RISK</span>
                    )}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5">{g.code} · {g.professor}</div>
                  <div className="text-xs text-white/40 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {g.nextExam === 'Tomorrow'
                      ? <span style={{ color: '#FF6B6B' }}>Exam Tomorrow ({g.examDate})</span>
                      : <span>Next exam: {g.nextExam} ({g.examDate})</span>
                    }
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-display font-bold text-xl" style={{ color }}>{g.grade}</span>
                  <TrendIcon size={14} color={trendColor} />
                  <span className="text-xs text-white/20">{g.credits} cr</span>
                </div>
              </div>

              {open && (
                <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <ChapterBar done={g.chaptersDone} total={g.chaptersTotal} color={color} />
                  {g.chaptersTotal - g.chaptersDone > 0 && (
                    <p className="text-xs text-white/40">
                      ⚠️ {g.chaptersTotal - g.chaptersDone} chapters still to cover before exam
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}