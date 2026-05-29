# BIXBEE — Frontend Codebase & Backend Plan

This document explains the current frontend (what exists, how the logic works) and
proposes how to build a backend for it, including some experimental options.

BIXBEE is an anonymous emotional expression platform. No name, no email, no photo —
just a **6-character identity** in the format `00AA00` (digit, digit, letter, letter,
digit, digit), i.e. the range **`00AA00` – `99ZZ99`**.

---

## 1. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 + CSS variables |
| Animation | GSAP + ScrollTrigger |
| 3D / WebGL | Three.js (instanced particles) |
| Icons | Lucide React |
| Language | JavaScript (no TypeScript) |

There is currently **no backend**. All state is client-side.

---

## 2. Directory Map

```text
src/
├─ main.jsx                 # React root mount
├─ App.jsx                  # Providers + router (intent-based)
├─ index.css                # Theme tokens, noise overlay, resets
├─ context/
│  ├─ useAuth.js            # AuthContext, generateId(), useAuth() hook
│  └─ AuthContext.jsx       # AuthProvider: identity state + login/signup/logout
├─ pages/
│  ├─ MainPage.jsx          # Landing composition (all sections)
│  └─ LoginPage.jsx         # Login / signup form + ID preview animation
└─ components/
   ├─ sections/             # HeroSection, ManifestoSection, FeaturesSection,
   │                        # IdentitySection, ExploreSection, FinalCTA,
   │                        # Navbar, Footer, SplitScreenTransition
   ├─ ui/                   # CustomCursor, ScrollProgress, TextReveal,
   │                        # MagneticButton, ScrambleText, NumberCounter
   └─ webgl/
      └─ ParticleCanvas.jsx # Three.js instanced tetrahedron hero field
```

---

## 3. Application Flow

### Routing (no router library)

`App.jsx` does **intent-based routing** instead of URL routing:

```jsx
const Router = () => {
  const { intent } = useAuth();        // null | 'login' | 'signup'
  return intent ? <LoginPage /> : <MainPage />;
};
```

- `intent === null` → show `MainPage` (the marketing landing page).
- `intent === 'login' | 'signup'` → show `LoginPage`.
- Buttons across the site call `setIntent('login')` or `setIntent('signup')`
  (Navbar "Enter Platform", Hero "Create Your ID" / "Explore Posts", FinalCTA).

There are no real URLs — refreshing always returns to `MainPage`.

### Global shell

`App.jsx` also mounts persistent overlays outside the router:
- `.noise` film (full-page grain via CSS)
- `CustomCursor` (custom cursor layer)
- `ScrollProgress` (scroll indicator)

GSAP + ScrollTrigger are registered once at module load with stability config
(`limitCallbacks`, `ignoreMobileResize`, `fastScrollEnd`).

---

## 4. Identity Logic (the core of the app)

### 4.1 Generation — `src/context/useAuth.js`

```js
export const generateId = () => {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const d = () => digits[Math.floor(Math.random() * 10)];
  const l = () => letters[Math.floor(Math.random() * 26)];
  return `${d()}${d()}${l()}${l()}${d()}${d()}`;   // DDLLDD → 00AA00 .. 99ZZ99
};
```

- Format is **fixed by position**: `[0-9][0-9][A-Z][A-Z][0-9][0-9]`.
- Purely random, **no uniqueness/collision check** (client can't know what's taken).

### 4.2 Validation — `src/context/AuthContext.jsx`

```js
const login = (id) => {
  const clean = (id || '').trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{2}[0-9]{2}$/.test(clean))
    return 'ID must match format 00AA00 (digits, letters, digits).';
  setIdentity(clean);
  setIntent(null);
  return null;
};
```

- The regex enforces the same positional format as the generator.
- `login` only checks the **shape** — it does not verify the ID actually exists
  anywhere (there's no store of issued IDs).

### 4.3 Persistence — `AuthProvider`

```js
const [identity, setIdentity] = useState(() => localStorage.getItem(STORAGE_KEY));
useEffect(() => { /* sync identity -> localStorage */ }, [identity]);
```

- Identity is stored in `localStorage` under key `bixbee.identity`.
- `signup()` calls `generateId()`, sets it as identity, and returns it.
- `logout()` clears it.

### 4.4 Context API surface

`AuthProvider` exposes: `{ identity, intent, setIntent, login, signup, logout }`.
`useAuth()` is the consumer hook (throws if used outside the provider).

---

## 5. LoginPage Logic — `src/pages/LoginPage.jsx`

- Two modes toggled by tabs: **`login`** ("Enter ID") and **`signup`** ("New ID").
- **Login mode:** controlled `<input>` forces uppercase + 6-char max; submitting
  calls `login(value)` and shows the returned error string if invalid.
- **Signup mode:** shows an animated **preview** of a random ID that flickers every
  90 ms for ~1.1 s using `generateId()`, then submitting calls `signup()`.
- `switchMode` resets value/error and re-seeds the preview.

> Note: the preview is purely cosmetic. The committed ID comes from `signup()`'s
> own `generateId()` call.

---

## 6. Landing Sections (`MainPage`)

Rendered in order, all driven by GSAP/ScrollTrigger:

| Section | Purpose / Logic |
|---------|-----------------|
| `Navbar` | Fixed; toggles blurred background after `scrollY > 100`; anchor links to `#manifesto`, `#features`, `#explore`. |
| `HeroSection` | WebGL particle field + scramble title; parallax `yPercent` on scroll; CTAs set intent. |
| `SplitScreenTransition` | Pinned timeline reveal between hero and narrative. |
| `ManifestoSection` | Sticky narrative reveal synced to scroll progress. |
| `FeaturesSection` | Horizontal-scroll reel on desktop, stacked on mobile (`gsap.matchMedia`). |
| `IdentitySection` | Cycles demo IDs every 1.5 s; animated stat counters. |
| `ExploreSection` | Renders a **hardcoded `POSTS` array** of anonymous posts with alternating scroll-in motion. "Load More Signals" button is **non-functional**. |
| `FinalCTA` | Closing conversion CTA → `setIntent('signup')`. |
| `Footer` | Closing footer. |

### Hardcoded data that a backend must replace

- `ExploreSection.jsx` → `POSTS` array (`id`, `text`, `likes`, `time`).
- `IdentitySection.jsx` → `IDS` demo array + stat numbers.

> **Stat accuracy bug:** `IdentitySection` shows "1,700,000+ Possible Identities",
> but the real identity space for `DDLLDD` is
> `10² × 26² × 10² = 6,760,000`. Update this number when wiring real data.

---

## 7. UI / WebGL Primitives

- `CustomCursor` — replaces native cursor.
- `ScrollProgress` — top/side scroll progress bar.
- `TextReveal` — masked line/word reveal on scroll.
- `MagneticButton` — pointer-follow magnetic hover.
- `ScrambleText` — character scramble-in effect (hero title).
- `NumberCounter` — animated count-up to a target value.
- `ParticleCanvas` — Three.js `InstancedMesh` of tetrahedrons with mouse tilt +
  click shatter; caps pixel ratio and disposes geometry/material/renderer on unmount.

---

## 8. Current Limitations (what the backend must solve)

1. **No persistence beyond the browser** — clearing `localStorage` loses the identity.
2. **No uniqueness** — two users can generate the same ID; collisions are silent.
3. **Login is shape-only** — any well-formed ID "logs in", even one never issued.
4. **Posts are static** — no create, no real likes, no feed, no pagination.
5. **"Load More Signals" is dead** — needs a paginated endpoint.

---

## 9. Backend Plan

Goal: keep it anonymous, minimal, and aligned with the existing frontend.

### 9.1 Recommended baseline stack

Stay in one language (Node) since the frontend is already Node/Vite:

- **Runtime/framework:** Node + **Express** (or **Fastify** for speed/schema).
- **DB (dev):** **SQLite** via `better-sqlite3` (single file, zero setup).
- **DB (prod):** **PostgreSQL** (same SQL, swap the driver).
- **No auth framework:** the 6-char ID *is* the credential — anonymous by design.

### 9.2 Data model

```sql
identities(
  id          TEXT PRIMARY KEY,         -- 00AA00 format
  created_at  TIMESTAMP DEFAULT now()
);

posts(
  id          TEXT PRIMARY KEY,         -- e.g. nanoid
  author_id   TEXT REFERENCES identities(id),
  text        TEXT NOT NULL,
  likes       INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT now()
);

likes(
  post_id      TEXT REFERENCES posts(id),
  identity_id  TEXT REFERENCES identities(id),
  PRIMARY KEY (post_id, identity_id)   -- prevents double-like
);
```

### 9.3 API surface

```
POST /api/identity         -> { id }            # server generates a UNIQUE id
POST /api/session          -> { id } | 400      # validate an existing id (regex + exists)
GET  /api/posts?cursor=    -> { posts, next }   # paginated feed (powers "Load More")
POST /api/posts            -> { post }          # body: { id, text }
POST /api/posts/:id/like   -> { likes }         # idempotent per identity
```

### 9.4 Move ID generation server-side

The client `generateId` keeps doing the **preview flicker only**. The real ID is
issued by `POST /api/identity`, which retries on collision:

```js
function issueId(db) {
  for (let i = 0; i < 20; i++) {
    const id = generateId();                    // same DDLLDD logic, server-side
    try {
      db.prepare('INSERT INTO identities(id) VALUES (?)').run(id);
      return id;
    } catch { /* PK collision → retry */ }
  }
  throw new Error('identity space saturated');
}
```

### 9.5 Frontend wiring changes

- `signup()` → `await POST /api/identity`, store returned id.
- `login()` → keep the regex check, then `await POST /api/session` to confirm it exists.
- `ExploreSection` → replace `POSTS` with `GET /api/posts`; wire "Load More" to `cursor`.
- Add a compose box that calls `POST /api/posts`.
- Like button → `POST /api/posts/:id/like`.

### 9.6 Security must-dos

- **Rate-limit `/api/session`**: the keyspace is only 6,760,000 → brute-forceable.
- **Validate `text` server-side** (length, trim) — never trust client limits.
- **CORS**: lock to the frontend origin only.
- Consider an **HttpOnly cookie session** instead of holding the raw ID in JS, so
  the credential isn't readable by XSS.

---

## 10. Experimental Directions (optional)

These are "nice to explore" ideas, ranked roughly by ambition:

1. **Edge + KV store** — Deploy the API on Cloudflare Workers / Vercel Edge with
   Cloudflare KV or Upstash Redis. Identities and like-counters fit a KV model
   well and give global low latency.

2. **Realtime feed** — Push new posts live via **WebSocket** or **SSE** so the
   "void" feels alive. Pairs nicely with the existing motion-heavy UI
   (animate a card in when a new signal arrives).

3. **Ephemeral / self-destructing posts** — Lean into "no trace": posts auto-expire
   (TTL in Redis, or a `expires_at` sweep). Reinforces the anonymity theme.

4. **Proof-of-work signup** — Instead of accounts, require a tiny client-side PoW
   (hashcash) before issuing an identity, throttling spam without captchas or PII.

5. **Sentiment / emotion tagging** — Run post text through a lightweight on-device
   or serverless model to tag emotion, then drive card color/motion by sentiment
   (ties data to the brutalist visual system).

6. **Vector "resonance" feed** — Embed posts and surface semantically similar ones
   ("signals that resonate") using a vector DB (pgvector / Qdrant) instead of
   chronological order.

7. **CRDT/local-first** — Use something like Yjs/Automerge so the feed works
   offline and syncs later — fits the "your data stays yours" ethos.

> Start with §9 (Express + SQLite, 5 endpoints). Layer §10 ideas only after the
> basic feed + identity loop works end to end.
