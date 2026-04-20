// ============================================================
// FILE: src/pages/Schedule.jsx
// ============================================================

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { DUMMY_SCHEDULE } from '../lib/dummyData';

const TYPE_CONFIG = {
  class:   { color: '#4FC3F7', bg: 'rgba(79,195,247,0.12)',   label: 'Lecture'  },
  study:   { color: '#6C63FF', bg: 'rgba(108,99,255,0.12)',   label: 'Study'    },
  exam:    { color: '#FF6B6B', bg: 'rgba(255,107,107,0.15)',  label: 'EXAM'     },
  lab:     { color: '#00F5C4', bg: 'rgba(0,245,196,0.12)',    label: 'Lab'      },
  seminar: { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',    label: 'Seminar'  },
  meeting: { color: '#FF9800', bg: 'rgba(255,152,0,0.12)',    label: 'Meeting'  },
  break:   { color: 'rgba(255,255,255,0.2)', bg: 'rgba(255,255,255,0.04)', label: 'Break' },
};

const DAYS = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Today');
  const filtered = DUMMY_SCHEDULE.filter(s => s.day === activeDay);
  const urgentCount = DUMMY_SCHEDULE.filter(s => s.day === 'Today' && s.urgent).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)' }}>
          <Calendar size={20} color="#6C63FF" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Schedule</h1>
          <p className="text-xs text-white/30">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Urgent banner */}
      {activeDay === 'Today' && urgentCount > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)' }}>
          <AlertTriangle size={15} color="#FF6B6B" />
          <p className="text-xs text-white/70">
            <span style={{ color: '#FF6B6B' }}>ML Exam tomorrow</span> — prioritise study blocks today
          </p>
        </div>
      )}

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map(day => {
          const hasExam = DUMMY_SCHEDULE.some(s => s.day === day && s.type === 'exam');
          return (
            <button key={day} onClick={() => setActiveDay(day)}
              className="px-4 py-2 rounded-xl text-sm font-display font-semibold whitespace-nowrap transition-all duration-150 relative"
              style={{
                background: activeDay === day ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeDay === day ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: activeDay === day ? '#fff' : 'rgba(255,255,255,0.4)',
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {day}
              {hasExam && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#FF6B6B' }} />}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.length === 0
          ? <p className="text-sm text-white/20 text-center py-12">No events scheduled</p>
          : filtered.map(event => {
              const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.class;
              return (
                <div key={event.id} className="flex gap-4">
                  {/* Time */}
                  <div className="w-12 text-right flex-shrink-0 pt-3">
                    <span className="text-xs font-mono text-white/30">{event.time}</span>
                  </div>
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mt-3.5 flex-shrink-0"
                      style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}80` }} />
                    <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  {/* Card */}
                  <div className="flex-1 mb-3 p-3.5 rounded-2xl"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display font-semibold text-sm text-white/90">{event.title}</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${cfg.color}20`, color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-white/35">
                        <Clock size={10} />{event.duration}
                      </span>
                      {event.room && (
                        <span className="flex items-center gap-1 text-xs text-white/35">
                          <MapPin size={10} />{event.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}