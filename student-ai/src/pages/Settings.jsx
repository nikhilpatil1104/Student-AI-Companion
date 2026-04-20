// ============================================================
// FILE: src/pages/Settings.jsx
// PURPOSE: User preferences, UI toggles, account display.
//          UI-only toggles where backend not present.
//          NO redesign — matches existing design system.
// MODULE: Settings (isolated)
// ============================================================

import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Mic, Volume2, Eye, Moon, User, Shield } from 'lucide-react';

// ── Toggle row ────────────────────────────────────────────────
function ToggleRow({ icon: Icon, label, description, value, onChange, color = '#6C63FF' }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}>
          <Icon size={13} color={color} />
        </div>
        <div>
          <p className="text-sm text-white/75 font-body">{label}</p>
          {description && <p className="text-xs text-white/25 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full flex-shrink-0 transition-all duration-200"
        style={{ background: value ? '#6C63FF' : 'rgba(255,255,255,0.1)' }}
        aria-pressed={value}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm"
          style={{ left: value ? 'calc(100% - 20px)' : 4 }}
        />
      </button>
    </div>
  );
}

// ── Select row ────────────────────────────────────────────────
function SelectRow({ icon: Icon, label, value, options, onChange, color = '#6C63FF' }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}>
          <Icon size={13} color={color} />
        </div>
        <p className="text-sm text-white/75 font-body">{label}</p>
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="glass-card p-5">
      <p className="font-display font-semibold text-xs text-white/30 uppercase tracking-widest mb-1">
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Persistent prefs via localStorage ────────────────────────
const PREFS_KEY = 'campuslife_prefs';
const loadPrefs = () => {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; }
  catch { return {}; }
};
const savePrefs = (p) => localStorage.setItem(PREFS_KEY, JSON.stringify(p));

export default function Settings({ profile }) {
  const [prefs, setPrefs] = useState({ ...defaultPrefs(), ...loadPrefs() });

  function set(key, value) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    savePrefs(updated);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <SettingsIcon size={20} color="rgba(255,255,255,0.5)" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Settings</h1>
          <p className="text-xs text-white/30">Preferences saved locally</p>
        </div>
      </div>

      {/* ── Account display (read-only) ── */}
      <Section title="Account">
        <div className="flex items-center gap-3 py-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#6C63FF,#00F5C4)', color: '#fff' }}>
            {profile?.name?.charAt(0) ?? 'S'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">{profile?.name ?? 'Student'}</p>
            <p className="text-xs text-white/30 font-mono">
              {profile?.tokens ?? 0} tokens · Lv.{Math.floor((profile?.tokens ?? 0) / 100) + 1}
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(0,245,196,0.1)', color: '#00F5C4' }}>
              <User size={11} />
              {profile?.major ?? 'Student'}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications">
        <ToggleRow icon={Bell}   label="Daily reminder"     description="Nudge at your preferred time" value={prefs.dailyReminder}   onChange={v => set('dailyReminder', v)}   color="#6C63FF" />
        <ToggleRow icon={Bell}   label="Streak alerts"      description="Warn before streak breaks"    value={prefs.streakAlerts}    onChange={v => set('streakAlerts', v)}    color="#FF6B6B" />
        <ToggleRow icon={Bell}   label="Weekly report alert" description="Notify when report is ready"  value={prefs.weeklyAlert}     onChange={v => set('weeklyAlert', v)}     color="#00F5C4" />
      </Section>

      {/* ── Voice & Audio ── */}
      <Section title="Voice & Audio">
        <ToggleRow icon={Mic}     label="Voice input"         description="Web Speech API"              value={prefs.voiceInput}      onChange={v => set('voiceInput', v)}      color="#4FC3F7" />
        <ToggleRow icon={Volume2} label="AI voice response"   description="Text-to-speech playback"     value={prefs.ttsEnabled}      onChange={v => set('ttsEnabled', v)}      color="#6C63FF" />
        <SelectRow icon={Volume2} label="Speech rate"
          value={prefs.ttsRate}
          options={[{ value:'0.8',label:'Slow' },{ value:'0.95',label:'Normal' },{ value:'1.15',label:'Fast' }]}
          onChange={v => set('ttsRate', v)}
          color="#6C63FF"
        />
      </Section>

      {/* ── Display ── */}
      <Section title="Display">
        <ToggleRow icon={Moon}    label="Dark mode"           description="Always on for now"           value={true}                  onChange={() => {}}                       color="#6C63FF" />
        <ToggleRow icon={Eye}     label="Show score deltas"   description="± badges on score cards"     value={prefs.showDeltas}      onChange={v => set('showDeltas', v)}      color="#FFD700" />
        <SelectRow icon={Eye}     label="Dashboard layout"
          value={prefs.layout}
          options={[{ value:'split',label:'Split (default)' },{ value:'stacked',label:'Stacked' }]}
          onChange={v => set('layout', v)}
          color="#FFD700"
        />
      </Section>

      {/* ── Privacy ── */}
      <Section title="Privacy">
        <ToggleRow icon={Shield}  label="Save sessions to Firebase" description="Requires Firebase config"  value={prefs.firebaseSync}    onChange={v => set('firebaseSync', v)}    color="#00F5C4" />
        <ToggleRow icon={Shield}  label="Analytics tracking"         description="Session activity summary" value={prefs.analyticsEnabled} onChange={v => set('analyticsEnabled', v)} color="#00F5C4" />
        <div className="pt-3">
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="text-xs px-4 py-2 rounded-xl transition-colors duration-150"
            style={{
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.2)',
              color: '#FF6B6B',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Clear all local data &amp; reset
          </button>
        </div>
      </Section>
    </div>
  );
}

function defaultPrefs() {
  return {
    dailyReminder:    false,
    streakAlerts:     true,
    weeklyAlert:      true,
    voiceInput:       true,
    ttsEnabled:       false,
    ttsRate:          '0.95',
    showDeltas:       true,
    layout:           'split',
    firebaseSync:     false,
    analyticsEnabled: true,
  };
}
