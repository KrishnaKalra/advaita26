# AI Coding Guidelines for advaita26

## Project Overview
This is a Next.js 16 interactive parallax scrolling website featuring multi-scene cinematic animations with Stranger Things-inspired themes. The app uses client-side rendering for complex GSAP animations, scroll triggers, and mouse-based parallax effects. Three.js is installed for future 3D integrations but not yet implemented.

## Key Technologies & Patterns
- **Next.js 16** with App Router and TypeScript
- **GSAP** (GreenSock Animation Platform) for high-performance animations, scroll triggers, and inertia effects
- **Tailwind CSS v4** with custom theme variables in `globals.css`
- **CSS Modules** for scene-specific styling (e.g., `parallax.scene1.module.css`)
- **React Three Fiber/Drei** prepared for 3D elements (types in `types/three.d.ts`)

## Architecture Notes
- Main orchestrator in `components/core/SceneManager.tsx` manages scene transitions, earthquake effects, and scroll-based seams
- Individual scenes in `components/scenes/` follow parallax pattern: mouse + scroll inertia using `gsap.quickTo`
- Animation state scoped with `gsap.context()`; continuous updates via `gsap.ticker.add(tick)`
- Scroll triggers use `ScrollTrigger.create` with `scrub: true` for smooth progress-based animations
- Shake effects via data attributes (`data-shake`, `data-shake-strength`, `data-shake-seed`) registered globally

## Critical Developer Workflows
- `npm run dev` for development with hot reload
- `npm run build` for production build; `npm run start` for preview
- `npm run lint` for ESLint checks
- Animations require testing on target devices for 60fps smoothness; use browser dev tools for performance profiling

## Specific Conventions
- Element refs with `useRef<HTMLDivElement>`; query with `frame.querySelector` inside `gsap.context`
- Inertia helpers: `const set = gsap.quickTo(el, 'x', { duration: 4, ease: 'power4.out' })`
- Parallax values: `scrollValue(level, max, direction)` and `mouseValue(maxScroll, level, axis)`
- Scene frames use 3:2 aspect ratio (`aspect-ratio: 3 / 2`) with overflow hidden
- Custom fonts loaded in `globals.css`; CSS vars like `--font-stranger`
- Positioning via CSS modules: `.wrap` absolute positioned, widths/heights as percentages
- Fog/smoke animations: `gsap.to(el, { xPercent: -20, duration: 20, repeat: -1, yoyo: true })`
- Seams between scenes: fixed images with `ScrollTrigger` scrubbing for reveal effects

## Code Examples
- Scroll trigger setup: `ScrollTrigger.create({ trigger: frame, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: self => { scrollP = self.progress } })`
- Inertia application: `bgSet.y(scrollValue(1, 30, 1) + mouseValue(30, 2, 'y'))`
- Shake registration: `registerShakeTargets(Array.from(frame.querySelectorAll('[data-shake="true"]')))`

Focus on performance-critical animations and visual polish. When adding 3D, integrate with existing GSAP for hybrid 2D/3D scenes.</content>
<parameter name="filePath">f:\Home\Neal Dev\Websites\advaita26\.github\copilot-instructions.md