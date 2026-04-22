// ============================================================
// FILE: src/components/AIResponsePanel.jsx
// PURPOSE: Renders the structured AI response in a rich, animated layout
// ============================================================

import React, { useState } from 'react';
import {
  BookOpen, DollarSign, Heart, Lightbulb, Music,
  Zap, ChevronDown, ChevronUp, AlertTriangle, CheckCircle
} from 'lucide-react';

const SECTION_CONFIG = {
  academic: {
    icon: BookOpen,
    label: 'Academic Impact',
    color: '#4FC3F7',
    bg: 'rgba(79, 195, 247, 0.08)',
    border: 'rgba(79, 195, 247, 0.2)',
  },
  financial: {
    icon: DollarSign,
    label: 'Financial Impact',
    color: '#00F5C4',
    bg: 'rgba(0, 245, 196, 0.08)',
    border: 'rgba(0, 245, 196, 0.2)',
  },
  stress: {
    icon: Heart,
    label: 'Stress & Wellness',
    color: '#FF6B6B',
    bg: 'rgba(255, 107, 107, 0.08)',
    border: 'rgba(255, 107, 107, 0.2)',
  },
};

function ImpactSection({ type, data, delay }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = SECTION_CONFIG[type];
  const Icon = cfg.icon;
  const delta = data?.score_delta || 0;

  return (
    <div
      className="rounded-2xl overflow-hidden response-section"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        animationDelay: `${delay}ms`,
      }}
    >
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${cfg.color}20` }}>
            <Icon size={16} color={cfg.color} />
          </div>
          <span className="font-display font-semibold text-sm text-white/90">{cfg.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {delta !== 0 && (
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              style={{
                color: delta > 0 ? '#00F5C4' : '#FF6B6B',
                background: delta > 0 ? 'rgba(0,245,196,0.15)' : 'rgba(255,107,107,0.15)',
              }}
            >
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          {expanded ? <ChevronUp size={14} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.4)" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          <p className="text-sm text-white/60 leading-relaxed">{data?.assessment}</p>
          <div
            className="flex items-start gap-2 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <CheckCircle size={14} color={cfg.color} className="mt-0.5 flex-shrink-0" />
            <p className="text-white/80 leading-relaxed">{data?.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIResponsePanel({ response, isLoading, query }) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'rgba(108,99,255,0.3)' }} />
            <div className="h-4 w-48 rounded-lg animate-pulse" style={{ background: 'rgba(108,99,255,0.2)' }} />
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="mb-3 space-y-2">
              <div className="h-3 w-full rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i*0.1}s` }} />
              <div className="h-3 w-4/5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i*0.15}s` }} />
            </div>
          ))}
          <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6C63FF' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6C63FF', animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6C63FF', animationDelay: '0.4s' }} />
            <span className="ml-1">CampusLife AI is thinking...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!response) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center gap-4"
        style={{ minHeight: 280 }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <Lightbulb size={28} color="#6C63FF" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-white/80 mb-1">
            What's on your mind?
          </h3>
          <p className="text-sm text-white/30 max-w-xs leading-relaxed">
            Ask me anything about your day — studies, money, stress, productivity. I'll give you a full life-impact analysis.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {[
            "Should I skip class today?",
            "How do I stick to my budget?",
            "I have 3 exams this week",
          ].map(hint => (
            <span key={hint} className="text-xs px-3 py-1.5 rounded-full text-white/40"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              "{hint}"
            </span>
          ))}
        </div>
      </div>
    );
  }

  const urgencyColor = response.urgency === 'high' ? '#FF6B6B' : response.urgency === 'medium' ? '#FFD700' : '#00F5C4';

  return (
    <div className="space-y-3">
      {/* Header: situation summary */}
      <div
        className="glass-card p-5 response-section"
        style={{ animationDelay: '0ms' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(108,99,255,0.2)' }}>
              <Zap size={14} color="#6C63FF" />
            </div>
            <span className="font-display font-semibold text-sm text-white/80">Situation Analysis</span>
          </div>
          {response.urgency && (
            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold"
              style={{
                color: urgencyColor,
                background: `${urgencyColor}18`,
                border: `1px solid ${urgencyColor}30`,
              }}>
              {response.urgency.toUpperCase()} URGENCY
            </span>
          )}
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{response.situationSummary}</p>
      </div>

      {/* 3 impact sections */}
      <ImpactSection type="academic" data={response.academicImpact} delay={100} />
      <ImpactSection type="financial" data={response.financialImpact} delay={200} />
      <ImpactSection type="stress" data={response.stressImpact} delay={300} />

      {/* Recommendation */}
      <div
        className="rounded-2xl p-5 response-section"
        style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,245,196,0.06))',
          border: '1px solid rgba(108,99,255,0.25)',
          animationDelay: '400ms',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={16} color="#6C63FF" />
          <span className="font-display font-semibold text-sm" style={{ color: '#6C63FF' }}>
            Today's Recommendation
          </span>
        </div>
        <p className="text-sm text-white/85 leading-relaxed font-medium">{response.recommendation}</p>
      </div>

      {/* Music suggestion */}
      {response.musicSuggestion && (
        <div
          className="rounded-2xl p-4 response-section flex items-start gap-4"
          style={{
            background: 'rgba(0,245,196,0.06)',
            border: '1px solid rgba(0,245,196,0.15)',
            animationDelay: '500ms',
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,245,196,0.15)' }}>
            <Music size={18} color="#00F5C4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-semibold text-sm" style={{ color: '#00F5C4' }}>
                Music for Your Mood
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{ background: 'rgba(0,245,196,0.15)', color: '#00F5C4' }}>
                {response.musicSuggestion.mood}
              </span>
            </div>
            <p className="text-sm font-semibold text-white/80">
              {response.musicSuggestion.artist}
            </p>
            <p className="text-xs text-white/40 mt-0.5">{response.musicSuggestion.genre}</p>
            <p className="text-xs text-white/50 mt-1">{response.musicSuggestion.reason}</p>
          </div>
        </div>
      )}

      {/* Motivation */}
      {response.motivation && (
        <div
          className="rounded-2xl p-4 response-section text-center"
          style={{
            background: 'rgba(255,215,0,0.05)',
            border: '1px solid rgba(255,215,0,0.12)',
            animationDelay: '600ms',
          }}
        >
          <p className="text-sm text-white/70 italic leading-relaxed">
            ✨ "{response.motivation}"
          </p>
        </div>
      )}
    </div>
  );
}
