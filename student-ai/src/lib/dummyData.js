// ============================================================
// FILE: src/lib/dummyData.js
// PURPOSE: Master student dummy data — used by all pages
//          that don't yet have real Firebase data.
//          Student: Aryan Mehta, MSc Data Science, Year 1
// ============================================================

export const MASTER_STUDENT = {
  id:     'demo-user-001',
  name:   'Aryan Mehta',
  major:  'MSc Data Science',
  year:   '1st Year (Masters)',
  university: 'State University',
  tokens: 340,
  streak: 6,
  scores: { academic: 72, finance: 58, stress: 64 },
};

// ── GRADES ───────────────────────────────────────────────────
export const DUMMY_GRADES = [
  {
    id: 'g1',
    subject:    'Machine Learning',
    code:       'CS601',
    grade:      'B+',
    percentage: 86,
    credits:    4,
    status:     'ongoing',
    nextExam:   'Tomorrow',
    examDate:   getTomorrow(),
    chaptersTotal:   20,
    chaptersDone:    8,
    professor:  'Dr. Sandra Lee',
    trend:      'up',
  },
  {
    id: 'g2',
    subject:    'Advanced Statistics',
    code:       'STAT501',
    grade:      'A',
    percentage: 91,
    credits:    3,
    status:     'ongoing',
    nextExam:   'Next Week',
    examDate:   getNextWeek(),
    chaptersTotal:   12,
    chaptersDone:    10,
    professor:  'Dr. R. Patel',
    trend:      'stable',
  },
  {
    id: 'g3',
    subject:    'Deep Learning',
    code:       'CS612',
    grade:      'B',
    percentage: 79,
    credits:    4,
    status:     'ongoing',
    nextExam:   'In 2 Weeks',
    examDate:   getInNDays(14),
    chaptersTotal:   15,
    chaptersDone:    7,
    professor:  'Prof. James Wu',
    trend:      'down',
  },
  {
    id: 'g4',
    subject:    'Research Methodology',
    code:       'RS501',
    grade:      'A-',
    percentage: 88,
    credits:    2,
    status:     'ongoing',
    nextExam:   'In 3 Weeks',
    examDate:   getInNDays(21),
    chaptersTotal:   8,
    chaptersDone:    8,
    professor:  'Dr. M. Osei',
    trend:      'stable',
  },
  {
    id: 'g5',
    subject:    'Big Data Engineering',
    code:       'CS625',
    grade:      'C+',
    percentage: 68,
    credits:    3,
    status:     'at-risk',
    nextExam:   'In 10 Days',
    examDate:   getInNDays(10),
    chaptersTotal:   18,
    chaptersDone:    9,
    professor:  'Prof. Anika Roy',
    trend:      'down',
  },
];

// ── SCHEDULE ─────────────────────────────────────────────────
export const DUMMY_SCHEDULE = [
  // TODAY
  { id: 's1', title: 'Machine Learning Lecture',    type: 'class',    day: 'Today',     time: '09:00', duration: '90min', room: 'Hall B-204', urgent: true  },
  { id: 's2', title: 'ML Exam Prep — Chapters 9–20', type: 'study',   day: 'Today',     time: '11:00', duration: '3hr',   room: 'Library',    urgent: true  },
  { id: 's3', title: 'Lunch + Rest',                 type: 'break',   day: 'Today',     time: '14:00', duration: '45min', room: '',           urgent: false },
  { id: 's4', title: 'Past Papers Practice',         type: 'study',   day: 'Today',     time: '15:00', duration: '2hr',   room: 'Home',       urgent: true  },
  { id: 's5', title: 'Machine Learning EXAM',        type: 'exam',    day: 'Tomorrow',  time: '10:00', duration: '3hr',   room: 'Exam Hall 1',urgent: true  },
  // REST OF WEEK
  { id: 's6', title: 'Advanced Stats Lecture',       type: 'class',   day: 'Wed',       time: '10:00', duration: '90min', room: 'Room 301',   urgent: false },
  { id: 's7', title: 'Deep Learning Lab',            type: 'lab',     day: 'Wed',       time: '14:00', duration: '2hr',   room: 'CS Lab 2',   urgent: false },
  { id: 's8', title: 'Research Methodology Seminar', type: 'seminar', day: 'Thu',       time: '11:00', duration: '2hr',   room: 'Seminar A',  urgent: false },
  { id: 's9', title: 'Big Data Engineering Lecture', type: 'class',   day: 'Fri',       time: '09:00', duration: '90min', room: 'Hall C-102', urgent: false },
  { id:'s10', title: 'Thesis Advisor Meeting',        type: 'meeting', day: 'Fri',       time: '15:00', duration: '1hr',   room: 'Prof. Office',urgent: false},
];

// ── LEADERBOARD ───────────────────────────────────────────────
export const DUMMY_LEADERBOARD = [
  { rank: 1,  name: 'Priya Sharma',   major: 'MSc AI',            tokens: 890, streak: 21, badge: '🏆', avatar: 'PS', change: 'same' },
  { rank: 2,  name: 'Lucas Ferreira', major: 'MSc Data Science',  tokens: 740, streak: 14, badge: '💎', avatar: 'LF', change: 'up'   },
  { rank: 3,  name: 'Mei Lin',        major: 'MSc ML',            tokens: 680, streak: 18, badge: '🥇', avatar: 'ML', change: 'up'   },
  { rank: 4,  name: 'Aryan Mehta',    major: 'MSc Data Science',  tokens: 340, streak: 6,  badge: '⚡', avatar: 'AM', change: 'down', isMe: true },
  { rank: 5,  name: 'Sofia Torres',   major: 'MSc Statistics',    tokens: 310, streak: 9,  badge: '🎯', avatar: 'ST', change: 'up'   },
  { rank: 6,  name: 'James Okafor',   major: 'MSc Big Data',      tokens: 280, streak: 4,  badge: '📈', avatar: 'JO', change: 'same' },
  { rank: 7,  name: 'Hana Nakamura',  major: 'MSc Data Science',  tokens: 245, streak: 7,  badge: '🌟', avatar: 'HN', change: 'up'   },
  { rank: 8,  name: 'Ali Hassan',     major: 'MSc AI',            tokens: 190, streak: 2,  badge: '🔥', avatar: 'AH', change: 'down' },
  { rank: 9,  name: 'Emma Clark',     major: 'MSc ML',            tokens: 165, streak: 5,  badge: '💪', avatar: 'EC', change: 'same' },
  { rank: 10, name: 'Ravi Kumar',     major: 'MSc Robotics',      tokens: 120, streak: 1,  badge: '🌱', avatar: 'RK', change: 'down' },
];

// ── TOKENS HISTORY ────────────────────────────────────────────
export const DUMMY_TOKEN_HISTORY = [
  { id: 't1', action: 'AI Copilot Session',     tokens: +20, date: 'Today',      time: '08:45', type: 'earn',  badge: '⚖️ Life Navigator'   },
  { id: 't2', action: 'Streak Bonus (6 days)',  tokens: +5,  date: 'Today',      time: '08:45', type: 'bonus', badge: '🔥 On a Roll'         },
  { id: 't3', action: 'AI Copilot Session',     tokens: +10, date: 'Yesterday',  time: '21:10', type: 'earn',  badge: null                   },
  { id: 't4', action: 'AI Copilot Session',     tokens: +20, date: 'Yesterday',  time: '14:30', type: 'earn',  badge: '⚖️ Balanced Day'      },
  { id: 't5', action: 'Poor Balance Penalty',   tokens:  0,  date: '2 days ago', time: '22:00', type: 'miss',  badge: null                   },
  { id: 't6', action: 'AI Copilot Session',     tokens: +10, date: '3 days ago', time: '10:15', type: 'earn',  badge: null                   },
  { id: 't7', action: 'Streak Bonus (3 days)',  tokens: +5,  date: '3 days ago', time: '10:15', type: 'bonus', badge: '⚡ On a Roll'          },
  { id: 't8', action: 'AI Copilot Session',     tokens: +20, date: '4 days ago', time: '09:00', type: 'earn',  badge: '⚖️ Life Navigator'   },
  { id: 't9', action: 'AI Copilot Session',     tokens: +20, date: '5 days ago', time: '11:30', type: 'earn',  badge: null                   },
  { id:'t10', action: 'AI Copilot Session',     tokens: +10, date: '6 days ago', time: '16:00', type: 'earn',  badge: null                   },
];

export const TOKEN_MILESTONES_PROGRESS = [
  { label: 'Rising Star',    threshold: 10,  icon: '🌱', reached: true  },
  { label: 'Silver Thinker', threshold: 50,  icon: '🥈', reached: true  },
  { label: 'Gold Scholar',   threshold: 100, icon: '🥇', reached: true  },
  { label: 'Diamond Student',threshold: 250, icon: '💎', reached: true  },
  { label: 'Campus Legend',  threshold: 500, icon: '🏆', reached: false },
];

// ── WEEKLY ANALYTICS DATA ─────────────────────────────────────
export const DUMMY_WEEKLY_ANALYTICS = {
  tokensByDay: [
    { day: 'Mon', tokens: 25 },
    { day: 'Tue', tokens: 20 },
    { day: 'Wed', tokens: 0  },
    { day: 'Thu', tokens: 30 },
    { day: 'Fri', tokens: 10 },
    { day: 'Sat', tokens: 20 },
    { day: 'Sun', tokens: 25 },
  ],
  studyHoursByDay: [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 0.0 },
    { day: 'Thu', hours: 5.5 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 6.0 },
    { day: 'Sun', hours: 3.5 },
  ],
  totalStudyHours: 24.5,
  totalTokensWeek: 130,
  sessionsCount:   7,
  activeDays:      6,
  consistencyScore: 86,
};

// ── helpers ───────────────────────────────────────────────────
function getTomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function getNextWeek() {
  const d = new Date(); d.setDate(d.getDate() + 7);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function getInNDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}