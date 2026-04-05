# BIXBEE Frontend

Brutalist, motion-heavy, single-page React landing experience for BIXBEE.

BIXBEE is an anonymous emotional expression platform.

- No name
- No profile
- No email
- No photo
- 6-character identity only

Tagline: Your voice. No trace. No judgment.

## What This Repository Contains

This project is a frontend-only implementation focused on:

- Editorial brutalist visual language
- High-density animation system (GSAP + ScrollTrigger)
- Interactive WebGL hero field (Three.js)
- Performance-aware scroll synchronization and cleanup
- Mobile-responsive behavior with motion fallbacks

## Tech Stack

- React 19
- Vite 8
- JavaScript (no TypeScript)
- Tailwind CSS 3 + PostCSS + Autoprefixer
- GSAP + ScrollTrigger
- Three.js
- Lucide React icons

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## NPM Scripts

- `npm run dev` -> Starts Vite dev server
- `npm run build` -> Creates production build in `dist/`
- `npm run preview` -> Serves production build locally
- `npm run lint` -> Runs ESLint

## Project Structure

```text
bixbee/
├─ public/
│  ├─ favicon.svg
│  └─ icons.svg
├─ src/
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  ├─ main.jsx
│  └─ assets/
│     ├─ hero.png
│     ├─ react.svg
│     └─ vite.svg
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
└─ postcss.config.js
```

## Frontend Architecture

Current architecture is a single composition file (`src/App.jsx`) containing all section and utility components.

This was intentional to keep choreography control in one place while refining interactions.

### Architectural Layers

1. App Shell Layer
	 - Global overlays (noise, cursor, progress)
	 - Navbar
	 - Root section composition

2. Interaction Primitives Layer
	 - `CustomCursor`
	 - `ScrollProgress`
	 - `TextReveal`
	 - `MagneticButton`
	 - `ScrambleText`
	 - `NumberCounter`

3. Visual Engine Layer
	 - `ParticleCanvas` (Three.js instanced tetrahedrons)
	 - Mouse tilt + click shatter behavior

4. Section Layer
	 - `HeroSection`
	 - `SplitScreenTransition`
	 - `ManifestoSection`
	 - `FeaturesSection`
	 - `IdentitySection`
	 - `ExploreSection`
	 - `FinalCTA`
	 - `Footer`

### Component Map

- `App` orchestrates global setup and section order.
- `Navbar` controls top-level navigation state and scroll-reactive styling.
- `HeroSection` provides entry narrative, scramble title, and CTA anchors.
- `SplitScreenTransition` uses pinned timeline to reveal next section.
- `ManifestoSection` uses sticky narrative reveal synced with scroll progression.
- `FeaturesSection` switches between horizontal-scroll desktop and stacked mobile behavior.
- `IdentitySection` combines ID cycler and animated stat counters.
- `ExploreSection` shows staggered anonymous post cards with alternating motion.
- `FinalCTA` and `Footer` close conversion path.

## Scroll and Animation System Design

The page uses GSAP timelines and ScrollTrigger with explicit cleanup to avoid drift and trigger leaks.

### Stability Controls

- `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })`
- `ScrollTrigger.defaults({ fastScrollEnd: true })`
- `scrub` is tuned per section for fast-scroll resilience
- `invalidateOnRefresh: true` on critical triggers
- `anticipatePin: 1` on pinned sections
- `gsap.matchMedia()` for desktop/mobile divergence

### Behavior Strategy

- Desktop:
	- Pinned narrative and horizontal-reel sections
	- Container-based animation syncing in feature track
- Mobile:
	- No horizontal pin track
	- Reduced-motion directional reveals
	- Lower particle count and cheaper interpolation paths

## WebGL System Design (Hero)

`ParticleCanvas` uses:

- InstancedMesh for high particle volume
- Tetrahedron geometry per instance
- Typed arrays for target and position interpolation
- Frame-by-frame morph + shatter modulation
- Mouse-based rotational tilt

Performance details:

- Pixel ratio capped
- RAF cancelation on unmount
- Timeout cleanup for shatter burst
- Geometry/material/renderer disposal

## Styling Architecture

Styling is hybrid:

- Utility-first classes from Tailwind
- Project-level tokens in `src/index.css`
- CSS variables for base palette
- Imported Google Fonts for brutalist typographic tone

Primary token set:

- `--bg`
- `--fg`
- `--border`

Global overlays:

- Full-page noise film
- Custom cursor layer
- Hidden native scrollbars

## Build and Bundling Architecture

Vite build output uses vendor chunk segmentation in `vite.config.js`:

- `three-vendor`
- `gsap-vendor`
- `react-vendor`
- `icons-vendor`

This keeps app code chunk small and isolates heavy rendering libraries.

## File-by-File Responsibility

- `src/main.jsx`
	- React root mounting
	- Global stylesheet import

- `src/App.jsx`
	- Full page composition
	- Motion logic
	- WebGL setup/teardown
	- Section content

- `src/index.css`
	- Global resets
	- Theme variables
	- Noise overlay behavior

- `tailwind.config.js`
	- Font tokens
	- Color extensions

- `postcss.config.js`
	- Tailwind + Autoprefixer pipeline

- `vite.config.js`
	- React plugin
	- Build splitting strategy

## Deployment Notes

Suitable for:

- Vercel
- Netlify
- GitHub Pages (with base-path config if needed)
- Any static host serving Vite output

Production command:

```bash
npm run build
```

Deploy the generated `dist/` directory.

## Troubleshooting

### 1) Git safe directory warning on Linux

```bash
git config --global --add safe.directory /absolute/path/to/repo
```

### 2) Chunk warning from Vite

- This project already splits large vendor chunks.
- If needed, adjust `chunkSizeWarningLimit` in `vite.config.js`.

### 3) Scroll jitter after editing section heights

- Ensure each new trigger has cleanup on unmount.
- Keep `invalidateOnRefresh: true` on pinned timelines.
- Run `ScrollTrigger.refresh()` after major layout changes.

### 4) Cursor feels offset

- Check browser zoom level.
- Verify no parent transform wraps the entire app root.

## Recommended Next Refactor (Optional)

When scaling this codebase, split `src/App.jsx` into:

```text
src/
├─ components/
│  ├─ ui/
│  │  ├─ CustomCursor.jsx
│  │  ├─ ScrollProgress.jsx
│  │  ├─ MagneticButton.jsx
│  │  └─ TextReveal.jsx
│  ├─ sections/
│  │  ├─ HeroSection.jsx
│  │  ├─ ManifestoSection.jsx
│  │  ├─ FeaturesSection.jsx
│  │  ├─ IdentitySection.jsx
│  │  ├─ ExploreSection.jsx
│  │  └─ FinalCTA.jsx
│  └─ webgl/
│     └─ ParticleCanvas.jsx
└─ App.jsx
```

This improves ownership boundaries without changing runtime behavior.

## License

This project currently has no explicit license file.
Add a LICENSE before open distribution.
