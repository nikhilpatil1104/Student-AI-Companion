// ============================================================
// FILE: src/lib/ai.js  — SMART CONTEXTUAL AI
// ============================================================

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3-8b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
];

export const AI_SYSTEM_PROMPT = `
You are CampusLife AI — a sharp, empathetic student life advisor.
You read the student's EXACT situation and give SPECIFIC, actionable advice.

You ONLY respond in this exact JSON (no markdown, no extra text):
{
  "summary": "2-3 sentences that directly address what the student said — be specific, not generic",
  "warnings": ["specific warning based on their actual situation", "..."],
  "recommendations": ["specific step 1 with details", "specific step 2 with details", "..."],
  "studyPlan": [
    { "time": "HH:MM", "task": "exact task name", "duration": "Xmin", "priority": "high|medium|low" }
  ]
}

RULES — READ CAREFULLY:
- If they mention an exam tomorrow: create an EMERGENCY study plan covering remaining chapters
- If they mention specific chapters (e.g. "20 chapters left"): plan chapter blocks per hour
- If they mention a subject (e.g. "chemistry"): give subject-specific advice
- If they are stressed: acknowledge it briefly, then give practical steps
- studyPlan MUST have real time blocks if exam/deadline is mentioned
- recommendations must be numbered steps, not generic advice
- NEVER say "block 90 minutes" generically — calculate based on their actual chapters/time
- NEVER repeat the same recommendation twice
- summary must restate their exact problem back to them
`.trim();

export function buildCopilotMessage({ grades, schedule, tokens, streak, stressScore, analytics, freeText }) {
  const parts = [];
  if (stressScore !== null && stressScore !== undefined) parts.push(`Stress: ${stressScore}/100`);
  parts.push(`Tokens: ${tokens} | Streak: ${streak} days`);
  if (grades && Object.keys(grades).length)    parts.push(`Grades: ${JSON.stringify(grades)}`);
  if (schedule && schedule.length)             parts.push(`Schedule today: ${JSON.stringify(schedule.slice(0,5))}`);
  if (analytics)                               parts.push(`Activity: ${JSON.stringify(analytics)}`);
  if (freeText?.trim())                        parts.push(`Student says: "${freeText.trim()}"`);
  return parts.join('\n');
}

export function parseCopilotResponse(rawText) {
  try {
    const cleaned = rawText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    const p = JSON.parse(cleaned);
    return {
      summary:         typeof p.summary === 'string' ? p.summary : '',
      warnings:        Array.isArray(p.warnings)        ? p.warnings        : [],
      recommendations: Array.isArray(p.recommendations) ? p.recommendations : [],
      studyPlan:       Array.isArray(p.studyPlan)       ? p.studyPlan       : [],
    };
  } catch { return null; }
}

export async function callCopilotAI(inputs) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey.startsWith('sk-or-v1-xxx')) {
    await new Promise(r => setTimeout(r, 1200));
    return getSmartDemoOutput(inputs);
  }

  const userMessage = buildCopilotMessage(inputs);
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
            { role: 'system', content: AI_SYSTEM_PROMPT },
            { role: 'user',   content: userMessage },
          ],
          temperature: 0.75,
          max_tokens: 700,
        }),
      });
      if (!res.ok) continue;
      const data   = await res.json();
      const raw    = data.choices?.[0]?.message?.content ?? '';
      const parsed = parseCopilotResponse(raw);
      if (parsed) return parsed;
    } catch { continue; }
  }
  return getSmartDemoOutput(inputs);
}

// ── Smart demo output — reads the freeText and responds specifically ──
function getSmartDemoOutput({ freeText = '', stressScore, tokens, streak, grades }) {
  const text = freeText.toLowerCase();

  // ── Exam tomorrow + chapters left scenario ──────────────
  const examTomorrow  = /exam.{0,20}tomorrow|tomorrow.{0,20}exam/i.test(text);
  const chapterMatch  = text.match(/(\d+)\s*ch(apter)?s?\s*(left|remaining|to (cover|study|read|do))/i);
  const chaptersLeft  = chapterMatch ? parseInt(chapterMatch[1]) : null;
  const subjectMatch  = text.match(/\b(chemistry|physics|math|statistics|machine learning|deep learning|biology|calculus|algebra|history|english|cs|programming)\b/i);
  const subject       = subjectMatch ? subjectMatch[1] : 'your subject';
  const isStressed    = stressScore > 60 || /stress|panic|anxious|worried|overwhelm|scared/i.test(text);
  const hasMoney      = /broke|money|budget|afford|rent|food|expense/i.test(text);
  const noSleep       = /sleep|tired|exhausted|no sleep|haven.t slept/i.test(text);

  // ── EXAM TOMORROW SCENARIO ──
  if (examTomorrow && chaptersLeft) {
    const hoursAvailable = 10; // assume ~10 hrs before sleep
    const minsPerChapter = Math.floor((hoursAvailable * 60) / chaptersLeft);
    const roundedMins    = Math.max(Math.min(minsPerChapter, 45), 15); // clamp 15–45 min per chapter

    const warnings = [
      `You have ${chaptersLeft} chapters left with the exam tomorrow — this is a high-pressure crunch.`,
    ];
    if (isStressed) warnings.push('Panic studying reduces retention. Stick to the plan below and breathe.');
    if (noSleep)    warnings.push('Avoid all-nighters — sleep deprivation cuts memory consolidation by 40%.');

    const recommendations = [
      `Spend ~${roundedMins} minutes per chapter — focus on definitions, key formulas, and past paper questions only.`,
      `Prioritise chapters with highest exam weightage first — skip detailed reading, use headings and summaries.`,
      `After every 3 chapters, do a 10-minute active recall quiz — write key points from memory.`,
      `Stop studying by 11 PM — sleep is non-negotiable for memory consolidation before an exam.`,
    ];

    // Build time-blocked study plan
    const studyPlan = [];
    let hour = 9, min = 0;
    const batches = Math.ceil(chaptersLeft / 3);
    for (let i = 0; i < Math.min(batches, 5); i++) {
      const chapStart = i * 3 + 1;
      const chapEnd   = Math.min(chapStart + 2, chaptersLeft);
      studyPlan.push({
        time: `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`,
        task: `${subject.charAt(0).toUpperCase()+subject.slice(1)} — Chapters ${chapStart}–${chapEnd} (scan + key points)`,
        duration: `${roundedMins * 3}min`,
        priority: 'high',
      });
      // Add break every 2 blocks
      const nextMin = min + roundedMins * 3;
      hour += Math.floor(nextMin / 60);
      min   = nextMin % 60;
      if (i % 2 === 1 && i < batches - 1) {
        studyPlan.push({
          time: `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`,
          task: 'Break — walk, water, light snack. No phone doom-scrolling.',
          duration: '10min',
          priority: 'low',
        });
        min += 10;
        if (min >= 60) { hour++; min -= 60; }
      }
    }
    studyPlan.push({
      time: '22:00',
      task: 'Past paper — attempt 5 exam-style questions under timed conditions',
      duration: '45min',
      priority: 'high',
    });
    studyPlan.push({
      time: '23:00',
      task: 'Stop studying. Prep bag, set alarm, sleep by 11:30 PM',
      duration: '30min',
      priority: 'medium',
    });

    return {
      summary: `You have ${chaptersLeft} chapters of ${subject} left and the exam is tomorrow. That's about ${roundedMins} minutes per chapter if you start now. This is doable — but only if you stop panicking and follow a strict chapter-by-chapter sprint plan.`,
      warnings,
      recommendations,
      studyPlan,
    };
  }

  // ── GENERAL EXAM TOMORROW (no chapter count) ──
  if (examTomorrow) {
    return {
      summary: `Your ${subject} exam is tomorrow and you're behind. The next 10 hours matter more than any other — focused, deliberate review beats re-reading everything.`,
      warnings: ['Time is critical — passive re-reading wastes it. Use active recall only.'],
      recommendations: [
        `List the top 10 topics most likely to appear based on past papers or the syllabus outline.`,
        `For each topic: write a 1-page summary from memory, then check it against your notes.`,
        `Do at least 20 past paper questions — this is the highest-ROI activity before any exam.`,
        `Sleep by midnight — memory consolidation happens during sleep, not all-nighters.`,
      ],
      studyPlan: [
        { time: '09:00', task: `${subject} — Identify top 10 exam topics`,                  duration: '30min', priority: 'high'   },
        { time: '09:30', task: `${subject} — Active recall on topics 1–4`,                   duration: '90min', priority: 'high'   },
        { time: '11:00', task: 'Break — hydrate, 10 min walk',                               duration: '15min', priority: 'low'    },
        { time: '11:15', task: `${subject} — Active recall on topics 5–8`,                   duration: '90min', priority: 'high'   },
        { time: '13:00', task: 'Lunch — proper meal, no studying',                           duration: '45min', priority: 'medium' },
        { time: '13:45', task: `${subject} — Past paper questions (20 questions timed)`,     duration: '90min', priority: 'high'   },
        { time: '15:15', task: `${subject} — Weak areas review from past paper mistakes`,    duration: '60min', priority: 'high'   },
        { time: '22:00', task: 'Final review — key formulas/definitions only, then sleep',   duration: '30min', priority: 'medium' },
      ],
    };
  }

  // ── FINANCIAL STRESS ──
  if (hasMoney) {
    return {
      summary: `You're dealing with financial pressure on top of your studies — that's a real cognitive load that affects focus. Let's address both.`,
      warnings: [
        'Financial stress is one of the top reasons students underperform academically — address it directly.',
        streak < 3 ? 'Your streak is low — financial anxiety may be disrupting your routine.' : null,
      ].filter(Boolean),
      recommendations: [
        'List every expense from the last 7 days — identify 1–2 non-essentials you can cut immediately.',
        'Check if your university has an emergency student hardship fund — most do and it\'s underused.',
        'Meal prep 3 days of food today — reduces daily spend by $8–15 and decision fatigue.',
        'Set a daily spending limit in your phone notes — track every purchase for 7 days.',
      ],
      studyPlan: [
        { time: '10:00', task: 'Write out full monthly budget — income vs every expense',     duration: '30min', priority: 'high'   },
        { time: '10:30', task: 'Research university financial aid / hardship grants online',  duration: '20min', priority: 'high'   },
        { time: '14:00', task: 'Focused study block — top academic priority',                 duration: '90min', priority: 'high'   },
      ],
    };
  }

  // ── NO SLEEP / TIRED ──
  if (noSleep) {
    return {
      summary: `You're running on low sleep — your cognitive performance right now is significantly reduced. Pushing harder won't help; working smarter will.`,
      warnings: [
        'Sleep deprivation reduces working memory, decision-making, and retention by up to 40%.',
        'Caffeine delays sleep debt but doesn\'t eliminate it — plan a recovery night tonight.',
      ],
      recommendations: [
        'Do your most important task now in a 45-minute focused block — not longer, your attention span is shorter.',
        'Skip anything low-priority today — protect your energy for what matters most.',
        'Take a 20-minute nap before 3 PM if possible — proven to restore alertness for 2–3 hours.',
        'Commit to sleeping 7+ hours tonight — one good night partially reverses sleep debt.',
      ],
      studyPlan: [
        { time: '09:00', task: 'Highest priority task — 45 min max, then stop',              duration: '45min', priority: 'high'   },
        { time: '09:50', task: '20-min nap or eyes-closed rest (set an alarm)',               duration: '20min', priority: 'medium' },
        { time: '10:15', task: 'Second priority task — another 45 min block',                 duration: '45min', priority: 'high'   },
        { time: '11:00', task: 'Light activity — walk outside, no screens',                   duration: '20min', priority: 'low'    },
      ],
    };
  }

  // ── GENERIC FALLBACK — still personalised ──
  const lowGrade = grades ? Object.entries(grades).find(([,v]) => v < 65) : null;
  return {
    summary: `${freeText.trim() ? `You said: "${freeText.trim()}". ` : ''}Here's a personalised plan based on your current streak (${streak} days), ${tokens} tokens, and stress level (${stressScore ?? '?'}/100).`,
    warnings: [
      stressScore > 65 ? `Stress at ${stressScore}/100 — above healthy threshold. Add recovery time today.` : null,
      lowGrade ? `${lowGrade[0]} is at ${lowGrade[1]}% — needs focused attention this week.` : null,
      streak === 0 ? 'No active streak — start one today by completing this session.' : null,
    ].filter(Boolean),
    recommendations: [
      'Start with your hardest subject in a 90-minute deep work block — no phone.',
      'Review what you covered yesterday for 10 minutes before starting new material — spaced repetition.',
      tokens < 100 ? 'You\'re at an early token milestone — 3 more sessions gets you to Gold Scholar.' : `You have ${tokens} tokens — you\'re in the top tier. Keep the streak.`,
      'Plan tomorrow the night before — 5 minutes of planning saves 30 minutes of confusion.',
    ],
    studyPlan: [
      { time: '09:00', task: 'Deep work — highest priority subject, phone in another room', duration: '90min', priority: 'high'   },
      { time: '10:30', task: 'Break — walk, water, no doom-scrolling',                      duration: '15min', priority: 'low'    },
      { time: '10:45', task: 'Review yesterday\'s notes — active recall only',               duration: '30min', priority: 'medium' },
      { time: '11:15', task: 'Second priority subject or assignment',                         duration: '75min', priority: 'high'   },
      { time: '14:00', task: 'Past paper / practice problems',                                duration: '60min', priority: 'high'   },
    ],
  };
}