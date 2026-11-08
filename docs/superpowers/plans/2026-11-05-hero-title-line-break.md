# Hero Title Desktop Line-Break Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the landing-page hero title inside the copy column by forcing a line break after `về` on desktop while preserving the existing mobile wrapping behavior.

**Architecture:** Keep the hero content and accessible heading in `LandingHero.tsx`, but render the two visual title lines as separate spans. Use desktop CSS to display those spans as blocks and a mobile override to display them inline so the existing narrow-screen flow remains unchanged.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS.

## Global Constraints

- Desktop title must display `Khóa học về` on line 1 and `công nghệ` on line 2.
- Mobile layout behavior must remain unchanged.
- Only the landing hero component, its focused test, and related landing CSS should change.
- Do not change hero copy, image, actions, links, or other landing sections.

---

### Task 1: Add a regression test for the desktop title structure

**Files:**
- Modify: `frontend/src/components/landing/LandingHero.test.tsx:6-11`
- Test: `frontend/src/components/landing/LandingHero.test.tsx`

**Interfaces:**
- Consumes: `LandingHero` rendered inside `MemoryRouter`.
- Produces: A regression assertion that the heading contains two separately marked title lines while retaining the complete accessible heading name.

- [ ] **Step 1: Extend the existing hero test with line-specific queries**

Add assertions after the existing heading assertion:

```tsx
expect(screen.getByTestId('landing-title-line-1')).toHaveTextContent('Khóa học về');
expect(screen.getByTestId('landing-title-line-2')).toHaveTextContent('công nghệ');
```

Keep the existing accessible-name assertion so the full heading remains `Khóa học về công nghệ`.

- [ ] **Step 2: Run the focused test to verify it fails**

Run from `frontend`:

```powershell
npm run test:run -- src/components/landing/LandingHero.test.tsx
```

Expected: FAIL because the current hero has no elements with the two requested test IDs.

- [ ] **Step 3: Commit the failing regression test**

```powershell
git add frontend/src/components/landing/LandingHero.test.tsx
git commit -m "test: cover desktop hero title lines" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 2: Render controlled title lines and constrain desktop CSS

**Files:**
- Modify: `frontend/src/components/landing/LandingHero.tsx:8-17`
- Modify: `frontend/src/styles/LandingPage.css:108-110, 217-220`

**Interfaces:**
- Consumes: `landingContent.hero.title` for the existing accessible title text and the two fixed Vietnamese title fragments required by the approved design.
- Produces: An `h1#landing-title` whose two spans are block-level on desktop and inline on mobile, without changing the heading's accessible name.

- [ ] **Step 1: Replace the single nowrap title span with two marked spans**

Change the heading to:

```tsx
<h1 id="landing-title">
  <span data-testid="landing-title-line-1">Khóa học về</span>
  <span data-testid="landing-title-line-2">công nghệ</span>
</h1>
```

Do not change the surrounding section, description, media, or CTA markup.

- [ ] **Step 2: Make the title lines block-level only above the mobile breakpoint**

Replace the current desktop rule:

```css
.landing-hero h1 span { display: block; white-space: nowrap; }
```

with:

```css
.landing-hero h1 span { display: block; }
```

Inside the existing `@media (max-width: 720px)` block, add:

```css
.landing-hero h1 span { display: inline; }
```

This removes the overflow-causing `white-space: nowrap` and keeps mobile text flowing normally.

- [ ] **Step 3: Run the focused test to verify it passes**

Run from `frontend`:

```powershell
npm run test:run -- src/components/landing/LandingHero.test.tsx
```

Expected: PASS, including the original accessible heading and CTA route assertions.

- [ ] **Step 4: Commit the implementation**

```powershell
git add frontend/src/components/landing/LandingHero.tsx frontend/src/styles/LandingPage.css frontend/src/components/landing/LandingHero.test.tsx
git commit -m "fix: keep desktop hero title inside copy column" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Verify the landing-page change

**Files:**
- Verify: `frontend/src/components/landing/LandingHero.tsx`
- Verify: `frontend/src/styles/LandingPage.css`
- Verify: `frontend/src/components/landing/LandingHero.test.tsx`

**Interfaces:**
- Consumes: The completed hero title implementation from Task 2.
- Produces: Test and build evidence that the fix does not break the frontend.

- [ ] **Step 1: Run the full frontend test suite**

Run from `frontend`:

```powershell
npm run test:run
```

Expected: PASS with no regressions in landing or shared components.

- [ ] **Step 2: Run the frontend production build**

Run from `frontend`:

```powershell
npm run build
```

Expected: Vite completes successfully and emits the production bundle.

- [ ] **Step 3: Check the final diff**

Run from the repository root:

```powershell
git diff HEAD~1 --check
git status --short
```

Expected: no whitespace errors; only the intended hero component, CSS, test, and previously existing unrelated worktree files are present.
