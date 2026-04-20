// ============================================================
// FILE: src/App.jsx — full routing with all pages
// ============================================================

import React, { useState, useEffect } from 'react';
import OnboardingModal from './components/OnboardingModal';
import Dashboard       from './components/Dashboard';
import Sidebar         from './components/Sidebar';
import Analytics       from './pages/Analytics';
import WeeklyReport    from './pages/WeeklyReport';
import Settings        from './pages/Settings';
import Copilot         from './pages/Copilot';
import Grades          from './pages/Grades';
import Schedule        from './pages/Schedule';
import Leaderboard     from './pages/Leaderboard';
import Tokens          from './pages/Tokens';
import { DEMO_USER }   from './lib/firebase';

const STORAGE_KEY = 'campuslife_profile';

export default function App() {
  const [profile,        setProfile]        = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activePage,     setActivePage]     = useState('dashboard');
  const [isReady,        setIsReady]        = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { setProfile(JSON.parse(saved)); setShowOnboarding(false); }
      else        setShowOnboarding(true);
    } catch { setShowOnboarding(true); }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleOnboardingComplete = ({ name, major, year }) => {
    setProfile({ ...DEMO_USER, id: `user-${Date.now()}`, name, major, year,
      tokens: 0, scores: { academic: 65, finance: 55, stress: 40 }, streak: 0 });
    setShowOnboarding(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset your profile?')) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(null); setShowOnboarding(true); setActivePage('dashboard');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <Dashboard initialProfile={profile} onReset={handleReset} />;
      case 'grades':      return <Grades />;
      case 'schedule':    return <Schedule />;
      case 'leaderboard': return <Leaderboard />;
      case 'tokens':      return <Tokens profile={profile} />;
      case 'copilot':     return <Copilot profile={profile} />;
      case 'analytics':   return <Analytics profile={profile} />;
      case 'weekly':      return <WeeklyReport profile={profile} />;
      case 'settings':    return <Settings profile={profile} />;
      default:            return <Dashboard initialProfile={profile} onReset={handleReset} />;
    }
  };

  if (!isReady) return null;

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      {profile && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar activePage={activePage} onNavigate={setActivePage} profile={profile} />
          <main className="flex-1 overflow-y-auto">{renderPage()}</main>
        </div>
      )}
    </>
  );
}