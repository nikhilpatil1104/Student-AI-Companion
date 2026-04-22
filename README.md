# 🎓 CampusLife AI – Student Decision Copilot

> Voice-powered AI assistant for student life decisions, gamified with Campus Tokens.

---

## 📁 Project Structure

```
campuslife-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard layout
│   │   ├── ScoreCard.jsx          # Academic/Finance/Stress score indicators
│   │   ├── VoiceInput.jsx         # Web Speech API voice button
│   │   ├── AIResponsePanel.jsx    # Displays structured AI response
│   │   ├── TokenDisplay.jsx       # Gamified token balance display
│   │   ├── MoodRing.jsx           # Animated mood/status indicator
│   │   └── OnboardingModal.jsx    # First-time user setup
│   ├── hooks/
│   │   ├── useVoice.js            # Voice input logic
│   │   ├── useAI.js               # AI API call logic (OpenRouter)
│   │   └── useTokens.js           # Token scoring logic
│   ├── lib/
│   │   ├── firebase.js            # Firebase init + helpers
│   │   ├── aiPrompt.js            # AI system prompt builder
│   │   └── tokenScoring.js        # Token scoring algorithm
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind
├── .env.example                   # Environment variables template
├── firebase.json                  # Firebase config
├── firestore.rules                # Firestore security rules
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Setup

```bash
npm install
cp .env.example .env
# Fill in your keys
npm run dev
```

## 🔑 Environment Variables

```
VITE_OPENROUTER_API_KEY=your_key
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🏆 Token System
- Good decision → +10 tokens
- Balanced day → +20 tokens  
- Poor balance → 0 tokens
