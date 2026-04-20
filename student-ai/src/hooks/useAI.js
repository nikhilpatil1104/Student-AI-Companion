// ============================================================
// FILE: src/hooks/useAI.js
// ============================================================

import { useState, useCallback } from 'react';
import { SYSTEM_PROMPT, buildUserMessage, parseAIResponse } from '../lib/aiPrompt';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const askAI = useCallback(async (userQuery, studentProfile) => {
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const userMessage = buildUserMessage(userQuery, studentProfile);

    // Try OpenAI if key exists
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('xxx')) {
      try {
        const res = await fetch(OPENAI_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 1200,
            response_format: { type: 'json_object' },
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const rawText = data.choices?.[0]?.message?.content || '';
          const parsed = parseAIResponse(rawText);
          if (parsed) {
            setLastResponse(parsed);
            setIsLoading(false);
            return parsed;
          }
        } else {
          console.error('OpenAI error:', data?.error?.message);
          setError(data?.error?.message || 'OpenAI failed');
        }
      } catch (err) {
        console.error('Fetch failed:', err.message);
        setError(err.message);
      }
    }

    // Always fall back to smart demo so the UI never breaks
    const demo = getDemoResponse(userQuery);
    setLastResponse(demo);
    setIsLoading(false);
    return demo;
  }, []);

  return { askAI, isLoading, error, lastResponse };
}

function getDemoResponse(query = '') {
  const isStressed = /stress|overwhelm|tired|exam|deadline/i.test(query);
  const isFinance  = /money|broke|spend|cost|afford/i.test(query);
  const isSleep    = /sleep|slept|tired|rest/i.test(query);
  const isToday    = /today|plan|week|schedule/i.test(query);

  return {
    situationSummary: isStressed
      ? `You're dealing with real pressure right now around "${query}". Deadlines and stress stack fast — but you reached out, and that's the first smart move.`
      : isFinance
      ? `Money stress is real, especially as a student. Based on what you shared ("${query}"), let's make a practical plan to stabilize things today.`
      : isSleep
      ? `Sleep deprivation hits harder than most students realize — it tanks focus, memory, and mood all at once. Let's address "${query}" with a realistic recovery plan.`
      : `You asked: "${query}". Let's break down exactly how this affects your academics, finances, and stress — and what to do about it today.`,

    academicImpact: {
      assessment: isStressed
        ? "Stress is actively compressing your study effectiveness — you're working harder but retaining less."
        : isSleep
        ? "Poor sleep reduces memory consolidation by up to 40%. Lectures and study sessions are giving you less than they should."
        : "Your academic momentum is solid but needs a focused push to stay on track.",
      advice: isStressed
        ? "Use the Pomodoro method: 25 min focused study, 5 min break. Do 4 rounds max then stop. Quality over quantity."
        : isSleep
        ? "Prioritize 7 hours tonight — even one good night improves recall significantly. Reschedule non-urgent study to tomorrow."
        : "Block 90 minutes of deep work on your single most important task before opening any apps.",
      score_delta: isStressed ? -2 : isSleep ? -3 : 3,
    },
    financialImpact: {
      assessment: isFinance
        ? "Your spending pattern needs an immediate reset. Small daily leaks add up to big monthly deficits."
        : "Finances are stable but there's untapped room to optimize your monthly spend.",
      advice: isFinance
        ? "Do a 10-minute bank app audit right now. Find one recurring charge to pause this week."
        : "Cook one extra meal at home this week — saves $10–15 and builds a healthy habit.",
      score_delta: isFinance ? -2 : 2,
    },
    stressImpact: {
      assessment: isStressed
        ? "Your stress is at a level where it's creating a feedback loop — anxiety makes focus harder, which creates more anxiety."
        : isSleep
        ? "Sleep debt is compounding your stress response. Your nervous system is running on overdrive."
        : "Stress is present but manageable. A few targeted actions today will keep it from escalating.",
      advice: isStressed
        ? "Right now: box breathing. Inhale 4s → hold 4s → exhale 4s → hold 4s. Repeat 4 times. It physically lowers cortisol."
        : isSleep
        ? "Set a hard phone cutoff at 10 PM tonight. Blue light delays melatonin by 90 minutes."
        : "A 15-minute walk outside — no headphones — resets your stress baseline better than any app.",
      score_delta: isStressed ? 5 : isSleep ? 4 : -1,
    },
    recommendation: isStressed
      ? `For "${query}": write down every deadline you're worried about, rank them by due date, then work on #1 only. Clarity kills anxiety faster than effort does.`
      : isFinance
      ? "Spend 10 minutes today making a simple weekly budget. Even a rough one cuts overspending by 20% just by making it visible."
      : isSleep
      ? "Tonight: phone off at 10 PM, room dark and cool, no caffeine after 2 PM. One good night changes tomorrow completely."
      : `For "${query}": pick your single most important task, do it for 90 minutes straight, then reassess. One focused hour beats three distracted ones.`,

    todaysTask: isStressed
      ? [
          { time: '8:00 AM',  task: 'Box Breathing Reset',    detail: '4 rounds of box breathing to lower cortisol before you start.',         priority: 'high'   },
          { time: '9:00 AM',  task: 'Deadline Dump',          detail: 'Write every deadline on paper. Rank by due date. Focus on #1 only.',     priority: 'high'   },
          { time: '10:00 AM', task: '25-Min Pomodoro Sprint', detail: 'Work on top task for 25 min, 5 min break. Repeat 4 times max.',          priority: 'high'   },
          { time: '1:00 PM',  task: 'Real Lunch Break',       detail: 'Eat away from your desk. 20 min minimum. No studying.',                  priority: 'medium' },
          { time: '9:00 PM',  task: 'Hard Stop',              detail: 'Close books. Prep for tomorrow. 7+ hours of sleep is non-negotiable.',   priority: 'medium' },
        ]
      : isFinance
      ? [
          { time: '8:30 AM',  task: 'Bank App Audit',         detail: 'Open your bank app. Find one charge to cancel or pause today.',          priority: 'high'   },
          { time: '10:00 AM', task: 'Weekly Budget Draft',    detail: 'Write income vs. fixed costs. Set a daily spend limit.',                  priority: 'high'   },
          { time: '12:00 PM', task: 'Cook Lunch',             detail: 'Skip takeout today — $12–15 saved immediately.',                         priority: 'high'   },
          { time: '3:00 PM',  task: 'Deep Work Block',        detail: 'Focus on top academic task for 90 min uninterrupted.',                   priority: 'medium' },
          { time: '8:00 PM',  task: "Tomorrow's Spend Cap",   detail: "Write tomorrow's spending limit and stick to it.",                        priority: 'low'    },
        ]
      : isSleep
      ? [
          { time: '8:00 AM',  task: 'Light Exposure',         detail: 'Get outside for 10 min. Natural light resets your circadian rhythm.',    priority: 'high'   },
          { time: '9:30 AM',  task: 'Priority-Only Work',     detail: 'Do only your #1 task. Low sleep = limited cognitive budget.',            priority: 'high'   },
          { time: '12:00 PM', task: '20-Min Nap (optional)',  detail: 'If possible, a 20-min nap restores alertness. No longer or youll groggy.', priority: 'medium' },
          { time: '2:00 PM',  task: 'Last Caffeine',          detail: 'No coffee or tea after 2 PM — caffeine has a 6-hour half-life.',         priority: 'medium' },
          { time: '10:00 PM', task: 'Phone Off',              detail: 'Hard cutoff. Dark room, cool temp. Target 7–8 hours tonight.',           priority: 'high'   },
        ]
      : [
          { time: '8:00 AM',  task: 'Set Top 3 Goals',        detail: 'Write the 3 things that matter most today. Nothing else counts.',        priority: 'high'   },
          { time: '9:30 AM',  task: '90-Min Deep Work',       detail: 'Phone on DND. Work on goal #1 only. No multitasking.',                  priority: 'high'   },
          { time: '12:30 PM', task: 'Midday Reset',           detail: 'Eat, walk 10 min, check progress vs. your top 3.',                      priority: 'medium' },
          { time: '3:00 PM',  task: 'Goal #2 Block',          detail: 'Second focused work session. 60–90 min max.',                           priority: 'medium' },
          { time: '8:00 PM',  task: 'Reflect + Prep',         detail: "Write one win from today. Set tomorrow's single top priority.",          priority: 'low'    },
        ],

    motivation: isStressed
      ? "The pressure you feel right now is proof you care — and caring is the starting point of every breakthrough."
      : isSleep
      ? "One good night of sleep will make you sharper tomorrow than three all-nighters ever could."
      : isFinance
      ? "Financial stress is temporary. The habits you build right now will pay off for decades."
      : "You don't need a perfect day — you need one good decision. Make it now and build from there.",

    musicSuggestion: {
      mood: isStressed ? 'anxious' : isSleep ? 'fatigued' : isFinance ? 'focused' : 'energized',
      genre: isStressed ? 'Lo-fi Hip-Hop / Ambient' : isSleep ? 'Soft Ambient / Sleep Sounds' : 'Deep Focus / Instrumental',
      artist: isStressed
        ? 'Lofi Girl – "Rainy Day" playlist'
        : isSleep
        ? '"Sleep" by Max Richter or Yellow Brick Cinema'
        : 'Brian Eno – "Music for Airports" or "Deep Work" on Spotify',
      reason: isStressed
        ? "60–70 BPM tracks match resting heart rate and physically calm your nervous system."
        : isSleep
        ? "Slow, predictable soundscapes signal safety to your brain and accelerate sleep onset."
        : "Instrumental music boosts focus by 15% by eliminating lyrical distraction.",
    },
    tokenReward: {
      amount: 20,
      reason: "Seeking guidance instead of guessing — that's the highest-ROI move a student can make.",
      badge: "⚖️ Life Navigator",
    },
    urgency: isStressed ? 'high' : isSleep ? 'high' : isFinance ? 'medium' : 'medium',
  };
}