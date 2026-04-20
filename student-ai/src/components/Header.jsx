// ============================================================
// FILE: src/components/Header.jsx
// PURPOSE: Top navigation bar with branding + user info
// ============================================================

import React from 'react';
import { Sparkles, Settings, Bell } from 'lucide-react';

export default function Header({ profile, onReset }) {
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        background: 'rgba(8, 11, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26, 32, 53, 0.6)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6C63FF20, #00F5C420)',
            border: '1px solid rgba(108,99,255,0.3)',
          }}
        >
          <Sparkles size={16} color="#6C63FF" />
        </div>
        <div>
          <span className="font-display font-bold text-sm text-white">CampusLife</span>
          <span className="font-display font-bold text-sm shimmer-text"> AI</span>
        </div>
      </div>

      {/* Center: greeting */}
      <div className="hidden sm:block text-center">
        <p className="text-xs text-white/30 font-body">
          {greeting}, <span className="text-white/60 font-medium">{profile?.name || 'Student'}</span> 👋
        </p>
      </div>

      {/* Right: User avatar */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl text-white/30 hover:text-white/60 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Bell size={16} />
        </button>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #00F5C4)',
            color: '#fff',
          }}
          onClick={onReset}
          title="Click to reset / change profile"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
