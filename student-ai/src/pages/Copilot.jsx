// ============================================================
// FILE: src/pages/Copilot.jsx
// MODIFIED: Uses strict input contract + structured output display
// MODULE: AI Copilot (isolated)
//
// Inputs fed to AI: grades | schedule | tokens | streak |
//                   stressScore | analytics
// Output rendered: summary | warnings | recommendations | studyPlan
// ============================================================

import React, { useState } from 'react';
import {
  Bot, AlertTriangle, CheckCircle, Clock,
  Send, Mic, MicOff, Zap
} from 'lucide-react';
import { callCopilotAI } from '../lib/ai';
import { useVoice } from '../hooks/useVoice';

// ── Output section components ─────────────────────────────────
function SummaryBlock({ text }) {
  if (!text) return null;
  return (
    <div className="glass-card p-4"
      style={{ border: '1px solid rgba(108,99,255,0.2)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: '#6C63FF', boxShadow: '0 0 6px #6C63FF' }} />
        <span className="font-display font-semibold text-xs text-white/50 uppercase tracking-wider">Summary</span>
      </div>
      <p className="text-sm text-white/75 leading-relaxed">{text}</p>
    </div>
  );
}

function WarningsList({ warnings }) {
  if (!warnings?.length) return null;
  return (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.18)' }}>
          <AlertTriangle size={13} color="#FF6B6B" className="mt-0.5 flex-shrink-0" />
          <p className="text-sm text-white/65">{w}</p>
        </div>
      ))}
    </div>
  );
}

function RecommendationsList({ items }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="font-display font-semibold text-xs text-white/40 uppercase tracking-wider mb-2">
        Recommendations
      </p>
      <div className="space-y-2">
        {items.map((r, i) => (
          <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.12)' }}>
            <CheckCircle size={13} color="#00F5C4" className="mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/70">{r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRIORITY_COLOR = { high: '#FF6B6B', medium: '#FFD700', low: '#00F5C4' };

function StudyPlan({ tasks }) {
  if (!tasks?.length) return null;
  return (
    <div>
      <p className="font-display font-semibold text-xs text-white/40 uppercase tracking-wider mb-2">
        Study Plan
      </p>
      <div className="space-y-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-mono text-xs text-white/30 w-12 flex-shrink-0">{t.time}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/75 truncate">{t.task}</p>
              <p className="text-xs text-white/25 mt-0.5">{t.duration}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={10} color="rgba(255,255,255,0.2)" />
              <span className="text-xs font-mono"
                style={{ color: PRIORITY_COLOR[t.priority] ?? 'rgba(255,255,255,0.3)' }}>
                {t.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Copilot page ─────────────────────────────────────────
export default function Copilot({ profile }) {
  const [freeText, setFreeText]   = useState('');
  const [result,   setResult]     = useState(null);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState(null);

  const { isListening, transcript, isSupported, startListening, stopListening } = useVoice({
    onResult: (text) => setFreeText(text),
  });

  async function handleAsk() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      // ── Strict inputs only — no fabrication ──────────────
      const inputs = {
        grades:      null,           // wire to grades module when available
        schedule:    null,           // wire to schedule module when available
        tokens:      profile?.tokens      ?? 0,
        streak:      profile?.streak      ?? 0,
        stressScore: profile?.scores?.stress ?? null,
        analytics:   null,           // wire to analytics module when available
        freeText,
      };
      const output = await callCopilotAI(inputs);
      if (!output) throw new Error('No response from AI');
      setResult(output);
    } catch (err) {
      setError('Something went wrong. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)' }}>
          <Bot size={20} color="#6C63FF" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">AI Copilot</h1>
          <p className="text-xs text-white/30">Powered by your real data</p>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-4 space-y-3"
        style={{ border: '1px solid rgba(108,99,255,0.2)' }}>
        <textarea
          value={isListening ? (transcript || '🎤 Listening…') : freeText}
          onChange={e => !isListening && setFreeText(e.target.value)}
          readOnly={isListening}
          placeholder={`What's on your mind? e.g. "I have two exams this week and I'm behind on sleep."`}
          rows={3}
          className="w-full bg-transparent text-white/85 placeholder-white/20 text-sm outline-none resize-none leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }}}
        />

        <div className="flex items-center justify-between gap-3">
          {/* Voice toggle */}
          {isSupported && (
            <button
              onClick={() => isListening ? stopListening() : startListening()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all"
              style={{
                background: isListening ? 'rgba(255,107,107,0.15)' : 'rgba(108,99,255,0.1)',
                border: isListening ? '1px solid rgba(255,107,107,0.3)' : '1px solid rgba(108,99,255,0.2)',
                color: isListening ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {isListening ? <MicOff size={12} /> : <Mic size={12} />}
              {isListening ? 'Stop' : 'Speak'}
            </button>
          )}
          <div className="flex-1" />

          {/* Context badges (read-only) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
              style={{ background: 'rgba(255,215,0,0.1)', color: 'rgba(255,215,0,0.6)' }}>
              {profile?.tokens ?? 0} tokens
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
              style={{ background: 'rgba(255,107,107,0.1)', color: 'rgba(255,107,107,0.6)' }}>
              stress {profile?.scores?.stress ?? '?'}
            </span>
          </div>

          <button
            onClick={handleAsk}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: loading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#6C63FF,#00F5C4)',
              color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading
              ? <><Zap size={12} className="animate-spin" /> Thinking…</>
              : <><Send size={12} /> Ask</>
            }
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)' }}>
          {error}
        </p>
      )}

      {/* ── Structured output ── */}
      {loading && !result && (
        <div className="space-y-3">
          {[100, 80, 90].map((w, i) => (
            <div key={i} className="h-3 rounded animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)', width: `${w}%`, animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3 animate-fadeInUp">
          <SummaryBlock         text={result.summary} />
          <WarningsList         warnings={result.warnings} />
          <RecommendationsList  items={result.recommendations} />
          <StudyPlan            tasks={result.studyPlan} />
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Bot size={32} color="rgba(108,99,255,0.3)" />
          <p className="text-sm text-white/20 max-w-xs">
            Type or speak your situation above. I'll analyze your real scores, streak, and stress level.
          </p>
        </div>
      )}
    </div>
  );
}
