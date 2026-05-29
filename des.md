# BIXBEE — Platform Description

## What BIXBEE Is

BIXBEE is an anonymous emotional expression platform. It exists for one purpose: to give people a place to say what they cannot say anywhere else.

No name. No profile. No email. No photo. No history. When you enter BIXBEE, you receive a 6-character alphanumeric identity — something like `47MK82` or `X99LQQ` — and that is the entirety of who you are on the platform. Nothing more is asked. Nothing more is stored.

The tagline is direct: **Your voice. No trace. No judgment.**

The platform is built on the premise that most people carry something they cannot say out loud — not because it is wrong or dangerous, but because there is no one safe enough to say it to. BIXBEE is that place.

---

## Core Identity and Privacy Model

The identity system is the foundation of the platform's trust contract with its users.

- Identity is a randomly generated 6-character alphanumeric code. There are over 1.7 million possible combinations.
- No personal data is collected at registration. No email, no name, no photo.
- Phone number verification (if used for abuse prevention) is stored only as an irreversible cryptographic hash. The platform itself cannot reverse it.
- Zero data points are stored about the user beyond their posts and their ID.
- The number of things a user can say is infinite.

This is not a privacy feature bolted on after the fact. It is the product.

---

## Content and Feed Model

Posts on BIXBEE are raw, unfiltered emotional transmissions. The sample content in the current build reflects the intended tone:

- "I threw away the note you gave me seven years ago. finally. it took me seven years."
- "i'm fundamentally exhausted and everyone thinks i'm just focused."
- "I don't think I know how to love people correctly. it always feels like i'm performing."
- "We sat in silence for twenty minutes in the car today. it wasn't awkward. i think that means it's real."

These are not curated. They are lowercase, unpolished, and honest. The platform's voice is intentionally raw.

The feed operates on two modes:

- **Fresh** — sorted by newest posts
- **Resonating** — sorted by most liked in the last 24 hours

There are no personalized algorithms. No echo chambers. No content tailored to keep you engaged longer. The feed is a flat, chronological or popularity-ranked stream of anonymous human expression.

Interaction is limited to a single action: a like. There are no comments, no replies, no quote posts, no threads. This is a deliberate design decision to eliminate the mechanics that turn expression into performance and disagreement into conflict.

---

## Platform Rules (Protocol)

Four rules govern the BIXBEE experience:

1. **Zero Identity** — No name, no photo, no email. Just a brutal 6-character alphanumeric ID.
2. **No Judgment** — Likes only. No comments. No replies. No algorithms optimizing for rage.
3. **Hashed Reality** — Your phone number is stored as an irreversible cryptographic hash. Even the platform cannot see it.
4. **Raw Feed** — Sorted by Fresh or Resonating. No personalized echo chambers.

---

## Current State: Frontend Landing Experience

The current repository is a frontend-only implementation. It is a single-page React landing experience designed to communicate the platform's identity, values, and aesthetic before the full product is built.

It is not a prototype of the application. It is a statement of intent — a high-fidelity editorial experience that establishes the visual language, motion system, and emotional tone of BIXBEE.

### Technology Stack

- React 19
- Vite 8
- JavaScript (no TypeScript)
- Tailwind CSS 3 with PostCSS and Autoprefixer
- GSAP with ScrollTrigger for all scroll-driven animation
- Three.js for the WebGL hero particle field
- Lucide React for iconography

### Visual Language

The design is brutalist. It uses high contrast, raw typography, and deliberate restraint. The color palette is near-monochrome with four accent colors used sparingly and with intent:

- Coral `#ff5c58` — primary action, urgency, identity
- Mint `#4ade80` — feed, freshness, signal
- Pink `#f472b6` — resonance, emotional weight
- Orange `#fb923c` — secondary narrative, warmth

Typography is set in three typefaces:

- **Instrument Serif** — display headings, large editorial type
- **Space Grotesk** — body text, UI elements
- **Fragment Mono** — labels, IDs, metadata, system text

The native cursor is hidden and replaced with a custom two-part cursor: a dot that tracks precisely and a ring that follows with elastic lag and stretches in the direction of movement. This is not decoration. It reinforces the sense that the interface is alive and responsive.

A full-page noise film overlay sits at z-index 9999 at 2.2% opacity with soft-light blending. Scrollbars are hidden globally. The overall effect is a surface that feels printed rather than rendered.

### Page Sections

The landing page is composed of eight sections in sequence:

**HeroSection** — Full-screen entry. The BIXBEE wordmark scrambles on load using a character randomization effect that resolves to the correct text. The tagline sits below in monospace. Two CTAs: "Create Your ID" and "Explore Posts". A Three.js particle field of 12,000 instanced tetrahedrons (4,000 on mobile) fills the background, morphing between a cubic grid and a spherical form, responding to mouse movement with rotational tilt and shattering on click.

**SplitScreenTransition** — A pinned scroll transition where the screen splits horizontally and the two halves slide apart to reveal the next section. The BIXBEE wordmark is rendered in outline only, splitting with the panels.

**ManifestoSection** — A pinned narrative section. On desktop, the left side holds a large heading that changes color as the user scrolls through four statements on the right. The statements build the platform's emotional argument: "Not because it's wrong. Not because it's dangerous. Because there is no one safe enough. BIXBEE is that place." On mobile, each statement reveals independently on scroll.

**FeaturesSection** — The four platform rules presented as cards. On desktop, the cards are arranged in a horizontal reel that scrolls via a pinned container animation. Each card enters with a slight rotation and scale correction as it comes into view. On mobile, cards stack vertically with directional reveal animations.

**IdentitySection** — A high-contrast coral section. A cycling display of sample 6-character IDs rotates every 1.5 seconds with opacity and blur transitions. Three animated stat counters count up on scroll: 1.7M+ possible identities, 0 data points stored, infinity things you can say.

**ExploreSection** — Five sample anonymous posts rendered as cards. Cards alternate between left-offset and right-offset positions on desktop, each entering from the opposite direction on scroll with a slight rotation. Posts display the anonymous ID, the text, a like count, and a feed label (Fresh or Resonating).

**FinalCTA** — A conversion section. Large display type: "You have something to say." Subtext: "No one needs to know it's you." A single primary CTA button.

**Footer** — Minimal. The BIXBEE wordmark, the platform's core promise ("No data. No trace. No judgment."), and links to Terms and Privacy.

### Animation System

All animation is driven by GSAP and ScrollTrigger. The system is built for stability:

- `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })` prevents callback flooding and mobile resize jitter
- `ScrollTrigger.defaults({ fastScrollEnd: true })` ensures fast-scroll resilience
- `scrub` values are tuned per section (0.14 to 0.24) for smooth but responsive feel
- `invalidateOnRefresh: true` on all critical triggers ensures correct recalculation after layout changes
- `anticipatePin: 1` on all pinned sections prevents the flash before pinning
- `gsap.matchMedia()` separates desktop and mobile animation paths entirely
- All tweens and triggers are killed on component unmount to prevent memory leaks and ghost triggers

### WebGL System

The `ParticleCanvas` component uses Three.js `InstancedMesh` to render up to 12,000 tetrahedron instances in a single draw call. Each particle has a base grid position and a target position computed per frame. The mesh morphs continuously between a cubic distribution and a spherical shell using a sine-based time function. Mouse movement tilts the entire field via smooth interpolation. Clicking triggers a shatter burst that increases particle displacement for 1.5 seconds before returning to the base state.

Performance controls: pixel ratio capped at 1.5, RAF cancellation on unmount, timeout cleanup for shatter, full geometry/material/renderer disposal on unmount.

### Build Output

Vite splits the production bundle into isolated vendor chunks:

- `three-vendor` — 503 KB
- `react-vendor` — 182 KB
- `gsap-vendor` — 112 KB
- `icons-vendor` — 9 KB
- `index` (app code) — 28 KB

Total compressed payload is kept small by isolating the heavy rendering libraries from the application code.

---

## What We Are Building

The landing experience is the first artifact. The platform itself is what follows.

BIXBEE is being built as a full anonymous social expression product. The frontend landing establishes the design system, the motion language, and the product philosophy. The next phases of development will build the actual platform on top of this foundation.

### Near-Term: Core Platform

The immediate next phase is the functional application:

- **Identity generation** — On first visit, a 6-character ID is generated and stored locally. No account creation. No server-side identity record.
- **Post creation** — A minimal compose interface. Text only. No media. No formatting. The post is attributed to the session's ID.
- **Feed** — A real-time or near-real-time feed of posts sorted by Fresh or Resonating. Infinite scroll or paginated load.
- **Like interaction** — A single tap/click to resonate with a post. No undo required. No comment thread.
- **Backend** — A lightweight API layer handling post storage, like counts, and feed queries. The privacy model requires that no user-identifying data is stored beyond the hashed verification token (if verification is implemented).

### Medium-Term: Platform Depth

Once the core loop is functional, the platform expands in ways that deepen the experience without compromising anonymity:

- **ID persistence across devices** — A mechanism for a user to carry their ID to a new device without linking it to any personal data. Likely a recovery phrase or exportable token.
- **Resonating algorithm refinement** — The 24-hour resonating window may be tuned or expanded. Decay curves for older posts. Potential for weekly or all-time resonating views.
- **Content moderation** — Anonymous platforms require moderation infrastructure. The approach must be designed to remove harmful content without creating surveillance of users. Likely a combination of automated filtering and community flagging with human review.
- **Post expiry** — Posts may be designed to expire after a set period, reinforcing the ephemeral, no-trace philosophy.
- **Mobile application** — A native or PWA mobile experience. The landing already implements mobile-responsive behavior and reduced-motion fallbacks. The app layer follows the same design system.

### Long-Term: Platform Vision

BIXBEE's long-term position is as the primary destination for honest, unattributed human expression on the internet. The product thesis is that the current social web has made authentic expression impossible because everything is attributed, archived, and optimized for engagement. BIXBEE inverts this entirely.

The platform does not compete with Twitter, Reddit, or Instagram. It occupies a different space: the things people think but do not post anywhere else. The addressable audience is everyone who has ever written something in a notes app and deleted it before sharing.

Future directions include:

- **Themed spaces or channels** — Optional, non-personalized topic groupings (grief, work, relationships) that users can browse without subscribing or following.
- **Temporal feeds** — Time-boxed events where posts are only visible for a fixed window, creating a shared moment of collective expression.
- **API access** — A read-only public API for researchers studying anonymous emotional expression patterns at scale, with appropriate ethical constraints.
- **Internationalization** — The platform's value proposition is universal. Localization into major languages is a natural expansion path.

---

## Codebase Refactor Path

The current codebase is intentionally monolithic. All components live in `src/App.jsx` to keep choreography control in one place during the design phase. When the platform moves into active development, the recommended split is:

```
src/
  components/
    ui/
      CustomCursor.jsx
      ScrollProgress.jsx
      MagneticButton.jsx
      TextReveal.jsx
      ScrambleText.jsx
      NumberCounter.jsx
    sections/
      HeroSection.jsx
      SplitScreenTransition.jsx
      ManifestoSection.jsx
      FeaturesSection.jsx
      IdentitySection.jsx
      ExploreSection.jsx
      FinalCTA.jsx
      Footer.jsx
    webgl/
      ParticleCanvas.jsx
  App.jsx
```

This split improves ownership boundaries, enables independent testing of sections, and makes the codebase maintainable as the team grows. It does not change any runtime behavior.

---

## Deployment

The current build is a static site. It deploys to any static host:

- Vercel (recommended for zero-config deployment)
- Netlify
- GitHub Pages (requires base-path configuration if not served from root)
- Any CDN serving the `dist/` directory

Production build command: `npm run build`

The output is the `dist/` directory.

---

## Summary

BIXBEE is a platform for saying what you cannot say anywhere else. The current repository is a high-fidelity frontend landing experience that establishes the visual identity, motion system, and product philosophy. The platform being built on top of it will be a fully functional anonymous expression product with a privacy model that is not a feature but a founding principle. The design, the copy, the interaction model, and the technical architecture all serve a single idea: your voice, with no trace, and no judgment.
