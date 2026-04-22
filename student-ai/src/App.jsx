// ============================================================
// FILE: src/App.jsx
// PURPOSE: Root component — handles onboarding flow + user state
// ============================================================

import React, { useState, useEffect } from 'react';
import OnboardingModal from './components/OnboardingModal';
import Dashboard from './components/Dashboard';
import { DEMO_USER } from './lib/firebase';

const STORAGE_KEY = 'campuslife_profile';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load saved profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
    } catch {
      setShowOnboarding(true);
    }
    setIsReady(true);
  }, []);

  // Save profile changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const handleOnboardingComplete = ({ name, major, year }) => {
    const newProfile = {
      ...DEMO_USER,
      id: `user-${Date.now()}`,
      name,
      major,
      year,
      tokens: 0,
      scores: { academic: 65, finance: 55, stress: 40 },
      streak: 0,
    };
    setProfile(newProfile);
    setShowOnboarding(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset your profile? Your progress will be saved in localStorage.')) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
      setShowOnboarding(true);
    }
  };

  if (!isReady) return null;

  return (
    <>
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      {profile && (
        <Dashboard
          initialProfile={profile}
          onReset={handleReset}
        />
      )}
    </>
  );
}
