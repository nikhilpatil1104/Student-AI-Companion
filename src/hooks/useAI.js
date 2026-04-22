// ============================================================
// FILE: src/hooks/useAI.js
// PURPOSE: OpenRouter AI API call hook
//          Model: mistralai/mistral-7b-instruct (free tier)
//          Fallback: meta-llama/llama-3-8b-instruct (free)
// ============================================================

import { useState, useCallback } from 'react';
import { SYSTEM_PROMPT, buildUserMessage, parseAIResponse } from '../lib/aiPrompt';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models on OpenRouter (use in order of preference)
const MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3-8b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
];

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const askAI = useCallback(async (userQuery, studentProfile) => {
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    // ── Demo mode: no API key configured ─────────────────
    if (!apiKey || apiKey.startsWith('sk-or-v1-xxx')) {
      await new Promise(r => setTimeout(r, 2000)); // simulate loading
      const demo = getDemoResponse(userQuery);
      setLastResponse(demo);
      setIsLoading(false);
      return demo;
    }

    const userMessage = buildUserMessage(userQuery, studentProfile);

    // Try models in sequence
    for (const model of MODELS) {
      try {
        const res = await fetch(OPENROUTER_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'CampusLife AI',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.warn(`Model ${model} failed:`, err);
          continue;
        }

        const data = await res.json();
        const rawText = data.choices?.[0]?.message?.content || '';
        const parsed = parseAIResponse(rawText);

        if (parsed) {
          setLastResponse(parsed);
          setIsLoading(false);
          return parsed;
        }
      } catch (err) {
        console.warn(`Model ${model} error:`, err);
        continue;
      }
    }

    // All models failed
    setError('Could not reach AI. Using demo response.');
    const demo = getDemoResponse(userQuery);
    setLastResponse(demo);
    setIsLoading(false);
    return demo;
  }, []);

  return { askAI, isLoading, error, lastResponse };
}

// ── Demo response for hackathon demo / no API key ─────────────
function getDemoResponse(query = '') {
  const isStressed = /stress|overwhelm|tired|exam|deadline/i.test(query);
  const isFinance = /money|broke|spend|cost|afford/i.test(query);

  return {
    situationSummary: isStressed
      ? "You're juggling a heavy load right now — deadlines stacking up while trying to keep everything together. That tension is real, and it's okay to acknowledge it."
      : isFinance
      ? "Your finances need attention before the end of the month. A small adjustment today can prevent a bigger headache later."
      : "Today looks like a crossroads day — multiple priorities competing for your limited time and energy. Let's make the most of it.",

    academicImpact: {
      assessment: "Your academic score shows solid fundamentals but needs consistent daily effort.",
      advice: "Block 90 minutes for deep work before checking your phone. Focus on the highest-stakes task first.",
      score_delta: 3,
    },
    financialImpact: {
      assessment: isFinance ? "Spending is outpacing income this week." : "Finances are manageable but room to optimize.",
      advice: isFinance
        ? "Skip one takeout meal today — cook instead. That's $12–15 saved immediately."
        : "Review your subscriptions this week. Cancel one you haven't used in 30 days.",
      score_delta: isFinance ? -1 : 2,
    },
    stressImpact: {
      assessment: isStressed ? "Stress levels are elevated — your body is signaling overload." : "Stress is present but manageable.",
      advice: isStressed
        ? "Do 4-7-8 breathing for 5 minutes right now. Inhale 4s, hold 7s, exhale 8s."
        : "A 20-minute walk outside will reset your focus better than scrolling.",
      score_delta: isStressed ? 5 : -2,
    },
    recommendation: isStressed
      ? "Schedule 3 focused 90-minute work blocks with 15-minute breaks. Protect your evening for rest — you can't pour from an empty cup."
      : "Start with your hardest task, then reward yourself with something enjoyable. Structure + reward = momentum.",

    motivation: isStressed
      ? "Every expert was once a student who felt exactly like you do right now. This season is temporary — your growth is permanent."
      : "Small wins compound. One good decision today plants the seed for tomorrow's breakthrough.",

    musicSuggestion: {
      mood: isStressed ? 'anxious' : 'focused',
      genre: isStressed ? 'Lo-fi Hip-Hop / Ambient' : 'Deep Focus / Instrumental',
      artist: isStressed ? 'Lofi Girl – "Rainy Day" playlist' : 'Brian Eno or "Deep Work" on Spotify',
      reason: isStressed
        ? "Slow BPM + minimal lyrics lower cortisol and calm the racing mind."
        : "Instrumental tracks eliminate lyrical distraction, extending your focus window.",
    },
    tokenReward: {
      amount: 20,
      reason: "You showed up and asked for guidance — that self-awareness earns full tokens.",
      badge: "⚖️ Life Navigator",
    },
    urgency: isStressed ? 'high' : 'medium',
  };
}
