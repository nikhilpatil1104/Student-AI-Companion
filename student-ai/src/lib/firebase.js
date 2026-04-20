// ============================================================
// FILE: src/lib/firebase.js
// PURPOSE: Firebase initialization + Firestore helpers
// SCHEMA:
//   users/{userId}
//     ├── name: string
//     ├── email: string
//     ├── createdAt: timestamp
//     ├── tokens: number          ← Campus Token balance
//     ├── scores:
//     │     ├── academic: 0–100
//     │     ├── finance: 0–100
//     │     └── stress: 0–100    (lower = better stress)
//     └── sessions: []            ← last 10 AI sessions
//
//   sessions/{sessionId}
//     ├── userId: string
//     ├── query: string
//     ├── response: object        ← structured AI response
//     ├── tokensEarned: number
//     └── createdAt: timestamp
// ============================================================

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Default user profile ─────────────────────────────────────
export const DEFAULT_PROFILE = {
  tokens: 0,
  scores: {
    academic: 70,
    finance: 60,
    stress: 45,
  },
  sessionsCount: 0,
  streak: 0,
  lastActiveDate: null,
};

// ── Get or create user ───────────────────────────────────────
export async function getOrCreateUser(userId, name = 'Student') {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data();

  const newUser = {
    ...DEFAULT_PROFILE,
    name,
    createdAt: serverTimestamp(),
    lastActiveDate: new Date().toDateString(),
  };
  await setDoc(ref, newUser);
  return newUser;
}

// ── Update user scores + tokens ──────────────────────────────
export async function updateUserProgress(userId, { tokensEarned, scoreDeltas }) {
  const ref = doc(db, 'users', userId);
  const updates = {
    tokens: increment(tokensEarned),
    sessionsCount: increment(1),
    lastActiveDate: new Date().toDateString(),
  };

  if (scoreDeltas?.academic) {
    updates['scores.academic'] = increment(scoreDeltas.academic);
  }
  if (scoreDeltas?.finance) {
    updates['scores.finance'] = increment(scoreDeltas.finance);
  }
  if (scoreDeltas?.stress) {
    updates['scores.stress'] = increment(scoreDeltas.stress);
  }

  await updateDoc(ref, updates);
}

// ── Save AI session ──────────────────────────────────────────
export async function saveSession(userId, { query: userQuery, response, tokensEarned }) {
  await addDoc(collection(db, 'sessions'), {
    userId,
    query: userQuery,
    response,
    tokensEarned,
    createdAt: serverTimestamp(),
  });
}

// ── Get recent sessions ──────────────────────────────────────
export async function getRecentSessions(userId, count = 5) {
  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Demo mode (no Firebase) ──────────────────────────────────
export const DEMO_USER = {
  id: 'demo-user-001',
  name: 'Alex Chen',
  tokens: 240,
  scores: { academic: 72, finance: 58, stress: 38 },
  sessionsCount: 12,
  streak: 4,
};
