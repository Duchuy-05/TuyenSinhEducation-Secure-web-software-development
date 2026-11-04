# Landing Page Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal each main Landing Page section with a two-second fade-and-rise animation the first time it enters the viewport.

**Architecture:** A reusable `ScrollReveal` component owns an `IntersectionObserver`, a DOM ref, and a one-way revealed state. Landing Page wraps the selected sections with this component, while CSS provides the hidden/revealed states and the reduced-motion fallback.

**Tech Stack:** React 19, TypeScript, CSS, browser `IntersectionObserver`, Vite

**Spec:** `docs/superpowers/specs/2026-11-04-landing-page-scroll-reveal-design.md`

## Global Constraints

- The transition duration is exactly 2 seconds.
- Each wrapped section animates at most once and remains visible afterward.
- Do not add a third-party animation dependency.
- `Navbar`, `Hero`, and `FloatingContact` remain immediately visible.
- Content must remain visible when reduced motion is requested or `IntersectionObserver` is unavailable.

## Review Focus

- An element already in the viewport on mount reveals normally.
- Scrolling away and back does not restart the animation.
- Browsers without `IntersectionObserver` show content immediately.
- Reduced-motion users do not receive the two-second motion effect.
- Wrapped components keep their existing layout and behavior.

---

### Task 1: Reusable ScrollReveal component

**Files:**
- Create: `frontend/src/components/ScrollReveal.tsx`
- Modify: `frontend/src/styles/LandingPage.css`

**Interfaces:**
- Consumes: React children through `ScrollRevealProps { children: ReactNode; className?: string }`.
- Produces: `ScrollReveal`, a wrapper that adds `scroll-reveal--visible` once its root intersects.

- [ ] **Step 1: Implement `ScrollReveal({ children, className }: ScrollRevealProps): JSX.Element`**

Use a root ref, initialize content as visible when `IntersectionObserver` is unavailable, observe with a small visibility threshold, and disconnect immediately after the first intersection and during cleanup.

- [ ] **Step 2: Add hidden, visible, and reduced-motion CSS states**

Use `opacity` and `transform: translateY(...)`; transition both properties for `2s` and override them inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 3: Run the TypeScript production build**

Run: `npm run build` from `frontend`
Expected: Vite exits successfully with no TypeScript or bundling errors.

### Task 2: Apply reveal behavior to Landing Page sections

**Files:**
- Modify: `frontend/src/pages/LandingPage.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from Task 1.
- Produces: Landing Page composition where `About`, `CourseAccordion`, `WhyChooseUs`, `Teachers`, `CTA`, and `Footer` reveal once on scroll.

- [ ] **Step 1: Import `ScrollReveal` and wrap the six selected sections individually**

Leave `Navbar`, `Hero`, and `FloatingContact` outside the wrappers.

- [ ] **Step 2: Run lint and the production build**

Run: `npm run lint` and `npm run build` from `frontend`
Expected: both commands exit successfully, or lint reports only pre-existing findings unrelated to the changed files.

- [ ] **Step 3: Verify browser behavior manually**

Confirm each selected section fades and rises over two seconds on first entry, stays visible after scrolling away and back, and becomes immediately visible with reduced motion enabled.
