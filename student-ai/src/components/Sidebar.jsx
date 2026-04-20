// ============================================================
// FILE: src/components/Sidebar.jsx
// MODIFIED: Added Analytics, Weekly Report, Settings nav items
// ============================================================

import React, { useState } from 'react';
import {
  LayoutDashboard, BookOpen, Calendar, Trophy,
  Coins, Bot, BarChart2, TrendingUp, Settings,
  ChevronLeft, ChevronRight, GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  // ── Existing (DO NOT REMOVE) ─────────────────────────────
  { id: 'dashboard',    label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'grades',       label: 'Grades',            icon: BookOpen },
  { id: 'schedule',     label: 'Schedule',          icon: Calendar },
  { id: 'leaderboard',  label: 'Leaderboard',       icon: Trophy },
  { id: 'tokens',       label: 'Tokens',            icon: Coins },
  { id: 'copilot',      label: 'AI Copilot',        icon: Bot },
  // ── NEW ──────────────────────────────────────────────────
  { id: 'analytics',    label: 'Analytics',         icon: BarChart2,  isNew: true },
  { id: 'weekly',       label: 'Weekly Report',     icon: TrendingUp, isNew: true },
  { id: 'settings',     label: 'Settings',          icon: Settings,   isNew: true },
];

export default function Sidebar({ activePage, onNavigate, profile }) {
  const [collapsed, setCollapsed] = useState(false);

  const tokens = profile?.tokens ?? 0;
  const name   = profile?.name   ?? 'Student';
  const level  = profile ? Math.floor(profile.tokens / 100) + 1 : 1;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-30"
      style={{
        width: collapsed ? 64 : 220,
        background: 'rgba(8, 11, 20, 0.95)',
        borderRight: '1px solid rgba(26, 32, 53, 0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: '1px solid rgba(26,32,53,0.6)', minHeight: 56 }}
      >
        <div
          className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#6C63FF20,#00F5C420)', border: '1px solid rgba(108,99,255,0.3)' }}
        >
          <GraduationCap size={16} color="#6C63FF" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sm text-white whitespace-nowrap">
            CampusLife <span className="shimmer-text">AI</span>
          </span>
        )}
      </div>

      {/* ── User card ── */}
      {!collapsed && (
        <div
          className="mx-3 my-3 p-3 rounded-2xl"
          style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.15)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-display font-bold text-xs"
              style={{ background: 'linear-gradient(135deg,#6C63FF,#00F5C4)', color: '#fff' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{name}</p>
              <p className="text-xs text-white/30 font-mono">Lv.{level} · {tokens} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed avatar */}
      {collapsed && (
        <div className="flex justify-center my-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs"
            style={{ background: 'linear-gradient(135deg,#6C63FF,#00F5C4)', color: '#fff' }}
          >
            {initials}
          </div>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, isNew }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
              style={{
                background: active ? 'rgba(108,99,255,0.18)' : 'transparent',
                border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              }}
            >
              <Icon
                size={16}
                className="flex-shrink-0"
                color={active ? '#6C63FF' : undefined}
              />
              {!collapsed && (
                <span className="font-body text-sm truncate flex-1">{label}</span>
              )}
              {!collapsed && isNew && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(0,245,196,0.15)', color: '#00F5C4' }}
                >
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-center mb-4 mx-auto w-8 h-8 rounded-xl transition-colors duration-150"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
