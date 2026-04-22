// ============================================================
// FILE: src/components/OnboardingModal.jsx
// PURPOSE: First-run setup — collect student name + major
// ============================================================

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const MAJORS = [
  'Computer Science', 'Business', 'Engineering', 'Arts & Humanities',
  'Medicine / Health', 'Law', 'Sciences', 'Education', 'Other',
];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');

  const handleFinish = () => {
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      major: major || 'Undeclared',
      year: year || '1st Year',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8, 11, 20, 0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(13,17,32,0.98), rgba(18,22,40,0.98))',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 24,
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(108,99,255,0.1)',
        }}
      >
        {/* Top gradient bar */}
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #6C63FF, #00F5C4)' }}
        />

        {/* Ambient orb */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #6C63FF 0%, transparent 70%)',
            transform: 'translate(40%, -40%)',
          }}
        />

        <div className="p-8 relative z-10">
          {step === 1 ? (
            <>
              {/* Welcome step */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center animate-float"
                  style={{ background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)' }}
                >
                  <Sparkles size={22} color="#6C63FF" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-white">CampusLife AI</h1>
                  <p className="text-xs text-white/40">Your student decision copilot</p>
                </div>
              </div>

              <h2 className="font-display font-bold text-2xl text-white mb-2">
                Welcome, future legend 🎓
              </h2>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                I'm your personal AI copilot for academics, finance, stress, and daily decisions.
                Let's set you up in 30 seconds.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 font-body mb-1.5 block">What's your name?</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder-white/20 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-200"
                style={{
                  background: name.trim()
                    ? 'linear-gradient(135deg, #6C63FF, #00F5C4)'
                    : 'rgba(255,255,255,0.05)',
                  color: name.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              {/* Profile step */}
              <h2 className="font-display font-bold text-xl text-white mb-1">
                Nice to meet you, {name}! 👋
              </h2>
              <p className="text-sm text-white/40 mb-6">Tell me a bit more so I can personalize your experience.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Your major / field</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MAJORS.map(m => (
                      <button
                        key={m}
                        onClick={() => setMajor(m)}
                        className="py-2 px-2 rounded-xl text-xs transition-all duration-150 text-center"
                        style={{
                          background: major === m ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${major === m ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: major === m ? '#fff' : 'rgba(255,255,255,0.5)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-2 block">Year of study</label>
                  <div className="flex gap-2">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Grad'].map(y => (
                      <button
                        key={y}
                        onClick={() => setYear(y)}
                        className="flex-1 py-2 rounded-xl text-xs transition-all duration-150"
                        style={{
                          background: year === y ? 'rgba(0,245,196,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${year === y ? 'rgba(0,245,196,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          color: year === y ? '#00F5C4' : 'rgba(255,255,255,0.5)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF, #00F5C4)',
                  color: '#fff',
                }}
              >
                Start my journey 🚀
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
