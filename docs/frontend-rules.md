# frontend-rules.md — Football Trivia App

## 1. Stack & Tooling

- Framework: React 18+ with Vite
- Styling: TailwindCSS v3 — utility classes only, no inline styles except dynamic values
- Routing: React Router v6 — all routes defined in a single `router.jsx` file
- Animations: Framer Motion — only for entrance/exit transitions and meaningful feedback
- State: React Context API (`GameContext`) for global state; `useState` / `useReducer` for local state
- HTTP: Native `fetch` via service functions in `/services` — no Axios
- Linting: ESLint + Prettier enforced on save
- Node version: defined in `.nvmrc`, all devs use the same version

---

## 2. Project Structure

```
src/
├── assets/              # Static files: images, fonts, icons
├── components/
│   ├── ui/              # Atomic, reusable UI components (GlassCard, TimerBar, etc.)
│   └── layout/          # Layout wrappers (BackgroundLayout, RankingSidebar)
├── context/             # GameContext and provider
├── data/                # questions.json and static data
├── hooks/               # Custom hooks (useTimer, useGame)
├── pages/               # One file per route/page
├── services/            # API calls (scoreService.js)
├── utils/               # Pure helper functions and constants
├── router.jsx           # All route definitions in one place
└── main.jsx             # App entry point
```

**Rules:**
- One component per file, no exceptions
- File names: `PascalCase` for components and pages, `camelCase` for hooks, services, utils
- No business logic inside UI components — they are dumb, props-driven
- No direct API calls inside components — always go through `/services`
- No game logic inside pages — delegate to custom hooks

---

## 3. Component Rules

### 3.1 General
- Functional components only — no class components
- Every component must have a JSDoc comment at the top describing its purpose and props
- Props must be documented with PropTypes or JSDoc `@param` annotations
- Components receive data via props; they do not reach into Context directly unless they are page-level components
- Avoid prop drilling beyond 2 levels — use Context instead

### 3.2 Naming Conventions
- Components: `PascalCase` — `QuestionCard`, `TimerBar`, `GlassCard`
- Custom hooks: `camelCase` prefixed with `use` — `useTimer`, `useGame`
- Context: `PascalCase` + `Context` suffix — `GameContext`
- Services: `camelCase` + `Service` suffix — `scoreService`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_GAME_TIME`, `POINTS_BY_DIFFICULTY`
- Event handlers: prefixed with `handle` — `handleAnswer`, `handleSubmit`

### 3.3 GlassCard — Base UI Container
All visible UI sections must use `GlassCard` as their wrapper. Direct Tailwind glass styles must NOT be duplicated across components — they live only in `GlassCard.jsx`.

```jsx
/** GlassCard — Base glassmorphism container for all UI sections */
const GlassCard = ({ children, className = '' }) => (
  <div className={`
    bg-white/10 backdrop-blur-md
    border border-white/20
    rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    p-6 ${className}
  `}>
    {children}
  </div>
);
```

---

## 4. Glassmorphism Design System

### 4.1 Core Visual Rules
- **All component containers** use glassmorphism — never opaque solid backgrounds
- Background images cover 100% of the viewport at all times (`object-cover`, `fixed`)
- A dark overlay (`bg-black/55`) sits between the background image and all content
- Components must feel like they are **floating above** the stadium image
- Never use white backgrounds inside containers — it breaks the glass effect

### 4.2 Glass Tokens
| Token | Value | Usage |
|---|---|---|
| Card bg | `bg-white/10` | Default glass card |
| Card bg (elevated) | `bg-white/15` | Active or focused cards |
| Backdrop blur | `backdrop-blur-md` (12px) | Standard blur |
| Backdrop blur (heavy) | `backdrop-blur-xl` (20px) | Modals, overlays |
| Border | `border border-white/20` | All glass containers |
| Shadow | `shadow-[0_8px_32px_rgba(0,0,0,0.4)]` | Depth illusion |
| Radius (default) | `rounded-2xl` | Cards and containers |
| Radius (large) | `rounded-3xl` | Full-page panels |

### 4.3 Color System
| Role | Tailwind Class | Usage |
|---|---|---|
| Primary accent | `emerald-400` / `emerald-500` | CTA buttons, correct answers, highlights |
| Danger | `rose-400` / `rose-500` | Wrong answers, low timer warning |
| Score / Gold | `yellow-400` | Score display, 1st place podium |
| Text primary | `text-white` | All main content |
| Text secondary | `text-white/80` | Labels, subtitles |
| Text muted | `text-white/60` | Hints, metadata |
| Glass button default | `bg-white/10 border-white/20` | Answer option default state |
| Glass button hover | `bg-white/20 border-white/60` | Answer option hover |

### 4.4 Forbidden Styles
- ❌ No `bg-white`, `bg-gray-*`, `bg-black` on containers
- ❌ No `text-black`, `text-gray-800` or any dark text — always white or white/opacity
- ❌ No `box-shadow` on text elements
- ❌ No inline `style={{ backdropFilter }}` unless Tailwind cannot express it
- ❌ No hardcoded hex colors anywhere in JSX

---

## 5. Layout Rules

### 5.1 Page Layout
- All content is **horizontally and vertically centered** on screen
- Use `min-h-screen flex items-center justify-content-center` on the root page wrapper
- Max width for single-column pages (Home, Countdown, GameOver): `max-w-md`
- Max width for two-column pages (Game, Leaderboard): `max-w-7xl`

### 5.2 Two-Column Game Layout
Game and Leaderboard pages use a fixed two-column layout:

```
┌─────────────────────────────┬──────────────┐
│                             │              │
│   MAIN CONTENT (flex-1)     │  SIDEBAR     │
│   QuestionCard              │  w-80        │
│   AnswerOptions             │  RankingSidebar│
│   TimerBar + ScoreDisplay   │              │
│                             │              │
└─────────────────────────────┴──────────────┘
```

- Desktop (`lg:`): side by side with `gap-6`
- Mobile (default): stacked vertically, sidebar below main content
- Sidebar never hides on mobile — it collapses to full width below

### 5.3 Responsive Breakpoints
| Breakpoint | Width | Behavior |
|---|---|---|
| default | < 1024px | Single column, mobile-first |
| `lg:` | ≥ 1024px | Two-column layout activates |
| `xl:` | ≥ 1280px | Wider content areas |

- **Always design mobile-first** — default styles are for small screens, `lg:` overrides for desktop
- Answer options grid: `grid grid-cols-1 lg:grid-cols-2 gap-3`
- Touch targets: minimum `44px` height on all interactive elements

---

## 6. UX & Interaction Rules

### 6.1 Feedback & States
Every interactive element must have all 4 states styled:
- **Default** — resting state
- **Hover** — visible but subtle change (`bg-white/20`, `border-white/60`)
- **Active/Pressed** — scale down slightly (`active:scale-95`)
- **Disabled** — `opacity-50 cursor-not-allowed pointer-events-none`

Answer options additionally have:
- **Correct** — `bg-emerald-500/40 border-emerald-400` — shown for 800ms, then next question loads
- **Wrong** — `bg-rose-500/40 border-rose-400` — shown for 800ms, then next question loads
- **Locked** — all options disabled after any selection until next question loads

### 6.2 Transitions & Animations
- Use Framer Motion for: page transitions, question card entrance, countdown animation
- Use CSS transitions for: button hover states, timer bar width, color changes
- Standard transition: `transition-all duration-200 ease-in-out`
- Never animate layout-affecting properties (width, height) without `overflow: hidden`
- Respect `prefers-reduced-motion` — wrap Framer Motion variants in a media query check

### 6.3 Timer Bar
- Changes color based on remaining time:
  - `> 60s` → `bg-emerald-400`
  - `30–60s` → `bg-yellow-400`
  - `< 30s` → `bg-rose-500`
- Width is a dynamic inline style: `style={{ width: `${percentage}%` }}`
- Transition: `transition-[width] duration-1000 ease-linear`
- Display time as `MM:SS` format (e.g. `04:32`)

### 6.4 Loading & Error States
- Every API call must handle 3 states: `loading`, `success`, `error`
- Loading: show a subtle glass skeleton or spinner — never freeze the UI
- Error: show a dismissible inline error message inside a glass card — never `alert()`
- If POST score fails, store the score in `localStorage` as fallback and retry once

### 6.5 Micro-copy Rules
- All user-facing text in Spanish (Argentina)
- CTA buttons: action verbs — "Jugar", "Ver Ranking", "Volver a Jugar"
- Error messages: friendly, non-technical — "Algo salió mal, intentá de nuevo"
- Input placeholder: "Tu nombre..." (not "Ingrese su nombre")
- Never show raw error objects or HTTP status codes to the user

---

## 7. Accessibility (a11y)

- Semantic HTML always: `<main>`, `<nav>`, `<section>`, `<button>`, `<input>` — never `<div onClick>`
- All images have descriptive `alt` attributes; decorative images use `alt=""`
- All form inputs have associated `<label>` elements (visible or `sr-only`)
- Focus ring must always be visible: never use `outline-none` without a custom `focus:ring`
- Color must never be the only indicator of meaning (correct/wrong answers also show an icon)
- Timer announces remaining time to screen readers using `aria-live="polite"`
- Keyboard navigable: Tab order must follow visual order; answer options navigable with arrow keys

---

## 8. Performance Rules

- Images in `/assets` must be optimized before use (WebP preferred, max 500KB per image)
- Background images use `loading="eager"` since they are critical for LCP
- `questions.json` is imported statically — never fetched at runtime
- Avoid `useEffect` for derived state — compute it inline or with `useMemo`
- Never re-render the entire game on every timer tick — timer state is isolated in `useTimer`
- Lazy-load `LeaderboardPage` and `GameOverPage` with `React.lazy()` since they are not on the critical path

---

## 9. State Management Rules

### 9.1 GameContext Shape
```js
{
  playerName: string,       // Set on HomePage
  score: number,            // Updated on each correct answer
  currentQuestion: object,  // Current question object
  questionIndex: number,    // Index in the shuffled questions array
  gameStatus: 'idle' | 'countdown' | 'playing' | 'finished',
  timeRemaining: number,    // Seconds remaining (300 → 0)
}
```

### 9.2 Rules
- GameContext is the single source of truth for game state
- Components never mutate context directly — they call action functions exposed by the context
- On game end, score is automatically POSTed via `scoreService` — this lives in a `useEffect` watching `gameStatus === 'finished'`
- On new game start, context resets completely before navigating to countdown
- `localStorage` is only used as a fallback for failed score submissions

---

## 10. Service Layer Rules

All backend communication goes through `/services/scoreService.js`:

```js
// scoreService.js — All API calls related to player scores

const BASE_URL = import.meta.env.VITE_API_URL;

export const postScore = async ({ name, score }) => { ... };
export const getLeaderboard = async () => { ... };
```

- `VITE_API_URL` must be defined in `.env` and `.env.example`
- Services always return `{ data, error }` — never throw to the caller
- Services never access Context, router, or any React API — they are pure async functions
- Never hardcode the API URL anywhere except `.env`

---

## 11. Git & Code Quality

- Commits follow Conventional Commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`
- No commented-out code committed to main
- No `console.log` in production code — use a `isDev` guard if needed for debugging
- ESLint must pass with zero errors before any commit
- Every new component must be added to this document if it introduces a new pattern

---

## 12. Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | ✅ |

- All env vars prefixed with `VITE_` to be exposed to the client
- `.env` is gitignored — `.env.example` is committed with placeholder values
- Never access `process.env` in frontend code — always use `import.meta.env`
