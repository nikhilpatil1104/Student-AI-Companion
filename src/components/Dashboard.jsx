// ============================================================
// FILE: src/components/Dashboard.jsx
// PURPOSE: Main dashboard layout — 2-column grid on desktop,
//          stacked on mobile. Orchestrates all sub-components.
// ============================================================

import React, { useState } from 'react';
import { History, ChevronRight } from 'lucide-react';

import ScoreCard from './ScoreCard';
import VoiceInput from './VoiceInput';
import AIResponsePanel from './AIResponsePanel';
import TokenDisplay from './TokenDisplay';
import MoodRing from './MoodRing';
import Header from './Header';

import { useAI } from '../hooks/useAI';
import { useTokens } from '../hooks/useTokens';

export default function Dashboard({ initialProfile, onReset }) {
  const { askAI, isLoading } = useAI();
  const { profile, recentAward, particles, processResponse } = useTokens(initialProfile);
  const [response, setResponse] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);

  const handleQuery = async (query) => {
    if (!query.trim() || isLoading) return;
    setLastQuery(query);

    const aiResponse = await askAI(query, profile);
    if (!aiResponse) return;

    setResponse(aiResponse);

    const { totalTokens } = await processResponse(aiResponse, query, initialProfile.id);

    setSessionHistory(prev => [
      { query, tokens: totalTokens, time: new Date() },
      ...prev.slice(0, 4),
    ]);
  };

  const scoreDelta = response
    ? {
        academic: response.academicImpact?.score_delta,
        finance: response.financialImpact?.score_delta,
        stress: response.stressImpact?.score_delta,
      }
    : {};

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Ambient background orbs */}
      <div
        className="ambient-orb w-96 h-96 opacity-20"
        style={{ background: '#6C63FF', top: '-10%', left: '-10%' }}
      />
      <div
        className="ambient-orb w-80 h-80 opacity-10"
        style={{ background: '#00F5C4', bottom: '10%', right: '-5%' }}
      />

      {/* Header */}
      <Header profile={profile} onReset={onReset} />

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── Row 1: Mood + Scores ── */}
        <div className="space-y-3">
          <MoodRing scores={profile.scores} />

          <div className="grid grid-cols-3 gap-3">
            <ScoreCard
              type="academic"
              score={profile.scores.academic}
              delta={scoreDelta.academic}
              icon="📚"
              label="Academic"
            />
            <ScoreCard
              type="finance"
              score={profile.scores.finance}
              delta={scoreDelta.finance}
              icon="💰"
              label="Finance"
            />
            <ScoreCard
              type="stress"
              score={profile.scores.stress}
              delta={scoreDelta.stress}
              icon="🧠"
              label="Stress"
            />
          </div>
        </div>

        {/* ── Row 2: Token Display ── */}
        <TokenDisplay
          tokens={profile.tokens}
          streak={profile.streak}
          recentAward={recentAward}
          particles={particles}
        />

        {/* ── Row 3: Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Left: Voice input + history */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input panel */}
            <div
              className="glass-card p-5"
              style={{ border: '1px solid rgba(108,99,255,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#6C63FF', boxShadow: '0 0 8px #6C63FF' }}
                />
                <span className="font-display font-semibold text-sm text-white/80">
                  Ask your AI Copilot
                </span>
              </div>

              <VoiceInput onSubmit={handleQuery} isLoading={isLoading} />
            </div>

            {/* Session history */}
            {sessionHistory.length > 0 && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <History size={14} color="rgba(255,255,255,0.3)" />
                  <span className="text-xs text-white/30 font-body">Recent sessions</span>
                </div>
                <div className="space-y-2">
                  {sessionHistory.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <p className="text-xs text-white/50 truncate flex-1">{s.query}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {s.tokens > 0 && (
                          <span className="text-xs font-mono font-bold"
                            style={{ color: '#FFD700' }}>
                            +{s.tokens}
                          </span>
                        )}
                        <ChevronRight size={10} color="rgba(255,255,255,0.2)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick prompts */}
            <div className="glass-card p-4">
              <p className="text-xs text-white/30 mb-3 font-body">Quick prompts</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "What should I do today?",
                  "I have an exam tomorrow",
                  "I'm stressed about money",
                  "Help me plan my week",
                  "I haven't slept well",
                ].map(p => (
                  <button
                    key={p}
                    onClick={() => handleQuery(p)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-xl transition-all duration-150 text-left"
                    style={{
                      background: 'rgba(108,99,255,0.08)',
                      border: '1px solid rgba(108,99,255,0.15)',
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI response */}
          <div className="lg:col-span-3">
            <AIResponsePanel
              response={response}
              isLoading={isLoading}
              query={lastQuery}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-white/15 font-body">
            CampusLife AI — Built for students, by students 🎓
          </p>
        </div>
      </main>
    </div>
  );
}
