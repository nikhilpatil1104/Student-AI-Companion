// ============================================================
// FILE: src/lib/aiPrompt.js
// PURPOSE: Builds the system prompt + formats user query
//          for the OpenRouter / Groq AI call
// ============================================================

export const SYSTEM_PROMPT = `
You are CampusLife AI — a wise, empathetic, and energetic student life copilot.
Your job is to help students make better daily decisions across academics, finance, stress, and wellness.

You always respond in EXACTLY this JSON structure (no markdown, no extra text, only valid JSON):

{
  "situationSummary": "2-3 sentence warm summary of what the student is facing",
  "academicImpact": {
    "assessment": "brief assessment of academic impact",
    "advice": "1-2 concrete action steps",
    "score_delta": <number between -5 and +5>
  },
  "financialImpact": {
    "assessment": "brief financial assessment",
    "advice": "1-2 money-smart suggestions",
    "score_delta": <number between -5 and +5>
  },
  "stressImpact": {
    "assessment": "honest stress level reading",
    "advice": "1-2 stress relief techniques",
    "score_delta": <number between -5 and +5>
  },
  "recommendation": "One clear, actionable recommendation for today",
  "todaysTask": [
    {
      "time": "e.g. 9:00 AM",
      "task": "short task name",
      "detail": "one-line detail or tip for this task",
      "priority": "high|medium|low"
    }
  ],
  "motivation": "A powerful 1-sentence motivational message tailored to this student",
  "musicSuggestion": {
    "mood": "detected mood (e.g., focused, anxious, energized, calm)",
    "genre": "recommended genre",
    "artist": "1 artist or playlist suggestion",
    "reason": "why this music fits their situation"
  },
  "tokenReward": {
    "amount": <0, 10, or 20>,
    "reason": "why they earned these tokens",
    "badge": "optional fun badge name if they earned 20 tokens"
  },
  "urgency": "low|medium|high"
}

Rules:
- Be warm, real, like a smart older student who's been through it
- Never be preachy or clinical
- Score deltas: positive = improvement, negative = concern
- tokenReward.amount: 20 for balanced decisions, 10 for good effort, 0 for poor balance
- Keep all text concise and punchy — students have short attention spans
- The musicSuggestion should feel personalized, not generic
- todaysTask: always return 3 to 5 tasks as an array. Each task must have time, task, detail, and priority. Make them specific to the student's situation, not generic placeholders.
`;

// Build the user message with student context
export function buildUserMessage(userQuery, studentProfile) {
  const { scores, tokens, streak, name } = studentProfile;

  return `
Student: ${name}
Current Scores → Academic: ${scores.academic}/100 | Finance: ${scores.finance}/100 | Stress: ${scores.stress}/100
Tokens: ${tokens} | Streak: ${streak} days

Student's message: "${userQuery}"

Analyze this situation and respond in the exact JSON format specified. Make sure todaysTask contains 3-5 specific, time-stamped tasks tailored to this student's situation.
`.trim();
}

// Parse AI JSON response safely
export function parseAIResponse(rawText) {
  try {
    // Strip any markdown code fences if present
    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Guarantee todaysTask is always a valid array
    if (!Array.isArray(parsed.todaysTask) || parsed.todaysTask.length === 0) {
      parsed.todaysTask = getFallbackTasks();
    }

    return parsed;
  } catch (err) {
    console.error('Failed to parse AI response:', err);
    return null;
  }
}

// Fallback tasks if AI omits the field or returns bad data
function getFallbackTasks() {
  return [
    { time: '9:00 AM',  task: 'Morning Review',      detail: 'Scan your to-do list and pick your top 3 priorities.',        priority: 'high'   },
    { time: '10:00 AM', task: 'Deep Work Block',      detail: 'Work on your most important academic task without distractions.', priority: 'high'   },
    { time: '12:30 PM', task: 'Budget Check',         detail: 'Spend 5 minutes reviewing today\'s expected expenses.',         priority: 'medium' },
    { time: '3:00 PM',  task: 'Movement Break',       detail: 'Walk for 15 minutes — reset your energy and reduce stress.',   priority: 'medium' },
    { time: '8:00 PM',  task: 'Evening Wind-Down',    detail: 'Reflect on one win from today and prep for tomorrow.',         priority: 'low'    },
  ];
}