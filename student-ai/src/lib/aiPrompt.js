// ============================================================
// FILE: src/lib/aiPrompt.js
// ============================================================

export const SYSTEM_PROMPT = `
You are CampusLife AI — a wise, empathetic, and energetic student life copilot.
Your job is to help students make better daily decisions across academics, finance, stress, and wellness.

You MUST respond in EXACTLY this JSON structure (no markdown, no extra text, only valid JSON):

{
  "situationSummary": "2-3 sentence warm summary of what the student is facing",
  "academicImpact": {
    "assessment": "specific assessment of academic impact based on their question",
    "advice": "1-2 concrete action steps tailored to their situation",
    "score_delta": 0
  },
  "financialImpact": {
    "assessment": "specific financial assessment based on their question",
    "advice": "1-2 money-smart suggestions tailored to their situation",
    "score_delta": 0
  },
  "stressImpact": {
    "assessment": "honest stress level reading based on their question",
    "advice": "1-2 stress relief techniques tailored to their situation",
    "score_delta": 0
  },
  "recommendation": "One clear, actionable recommendation for today based on exactly what they asked",
  "todaysTask": [
    {
      "time": "9:00 AM",
      "task": "specific task name",
      "detail": "one-line detail for this specific task",
      "priority": "high"
    }
  ],
  "motivation": "A powerful 1-sentence motivational message tailored to this exact student situation",
  "musicSuggestion": {
    "mood": "detected mood",
    "genre": "recommended genre",
    "artist": "1 artist or playlist suggestion",
    "reason": "why this music fits their situation"
  },
  "tokenReward": {
    "amount": 20,
    "reason": "why they earned these tokens",
    "badge": "fun badge name"
  },
  "urgency": "low"
}

CRITICAL RULES:
- Read the student message carefully and respond SPECIFICALLY to what they asked
- Never give generic responses — every field must reference their actual situation
- todaysTask: always return exactly 5 tasks, time-stamped, specific to their question
- score_delta must be a number between -5 and +5
- urgency must be exactly: low, medium, or high
- tokenReward.amount must be exactly: 0, 10, or 20
- Be warm and real, like a smart older student who has been through it
- Never be preachy or clinical
`;

export function buildUserMessage(userQuery, studentProfile) {
  const { scores, tokens, streak, name } = studentProfile;
  return `
Student: ${name}
Academic Score: ${scores.academic}/100 | Finance Score: ${scores.finance}/100 | Stress Score: ${scores.stress}/100
Tokens: ${tokens} | Streak: ${streak} days

Student's question: "${userQuery}"

Respond ONLY with valid JSON. No markdown. No explanation. Just the JSON object.
`.trim();
}

export function parseAIResponse(rawText) {
  try {
    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Guarantee todaysTask is always a valid array of 5
    if (!Array.isArray(parsed.todaysTask) || parsed.todaysTask.length === 0) {
      parsed.todaysTask = [
        { time: '9:00 AM',  task: 'Morning Focus',    detail: 'Start with your most important task.',           priority: 'high'   },
        { time: '10:30 AM', task: 'Deep Work Block',  detail: '90 minutes of uninterrupted focused work.',       priority: 'high'   },
        { time: '12:30 PM', task: 'Midday Check-In',  detail: 'Assess progress and adjust your afternoon plan.', priority: 'medium' },
        { time: '3:00 PM',  task: 'Movement Break',   detail: '15-minute walk to reset your focus.',             priority: 'medium' },
        { time: '8:00 PM',  task: 'Reflect + Prep',   detail: 'One win from today + set tomorrow priority.',     priority: 'low'    },
      ];
    }

    return parsed;
  } catch (err) {
    console.error('Failed to parse AI response:', err);
    return null;
  }
}
