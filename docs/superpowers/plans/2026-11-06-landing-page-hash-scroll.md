# Landing Page Hash Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make one click on a landing-page section link navigate from any route and smoothly scroll to the requested section.

**Architecture:** Keep the existing hash URLs as the navigation contract. Let `LandingPage` react to the current location hash after its sections mount, resolve the matching DOM element, and request a smooth scroll.

**Tech Stack:** React 19, React Router 7, TypeScript, Vitest, Testing Library

**Spec:** `C:/.Study at School/.Web Application Safety/TrangTuyenSinhEdu/docs/superpowers/specs/2026-11-06-landing-page-hash-scroll-design.md`

## Global Constraints

- Do not add dependencies.
- Preserve the existing `learning-paths` and `teachers` IDs and existing link URLs.
- Do not modify unrelated uncommitted changes in `frontend/src/pages/ContactPage.tsx` or `frontend/src/styles/LandingPage.css`.

## Review Focus

- Empty hash must not trigger a scroll.
- A hash whose element does not exist must not throw.
- `#learning-paths` must scroll to the learning-path section.
- `#teachers` must use the same generic mechanism rather than section-specific code.
- Hash values should be resolved only after the landing-page DOM exists.

---

### Task 1: Scroll to the landing-page hash after render

**Files:**
- Modify: `frontend/src/pages/LandingPage.tsx`
- Test: `frontend/src/pages/LandingPage.test.tsx`

**Interfaces:**
- Consumes: React Router `useLocation()` and the existing section IDs.
- Produces: Post-render smooth scrolling for a valid landing-page hash.

- [ ] **Step 1: Write the failing tests**

Add tests that render `LandingPage` with `MemoryRouter initialEntries={['/#learning-paths']}`, mock `HTMLElement.prototype.scrollIntoView`, and expect the `#learning-paths` element to receive `{ behavior: 'smooth' }`. Add a missing-target case such as `/#unknown` and assert rendering does not throw and scrolling is not called.

- [ ] **Step 2: Run the focused test and verify the new test fails**

Run: `npm test -- --run src/pages/LandingPage.test.tsx`

Expected: FAIL because `LandingPage` does not call `scrollIntoView`.

- [ ] **Step 3: Implement the minimal hash-scroll effect**

In `LandingPage`, call `useLocation()`. Add an effect keyed by `location.hash` that removes the leading `#`, exits for an empty hash, resolves the ID with `document.getElementById`, and calls `scrollIntoView({ behavior: 'smooth' })` when the target exists.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run src/pages/LandingPage.test.tsx`

Expected: all `LandingPage` tests PASS.

- [ ] **Step 5: Run regression verification**

Run: `npm test -- --run src/components/NavBar.test.tsx src/pages/LandingPage.test.tsx`

Run: `npm run build`

Expected: both test files PASS and the production build succeeds.

- [ ] **Step 6: Review the diff**

Confirm only the two planned frontend files and the two documentation files changed for this task, while pre-existing edits remain untouched.

### Task 2: Align the section heading below the fixed navbar

**Files:**
- Modify: `frontend/src/pages/LandingPage.tsx`
- Modify: `frontend/src/styles/LandingPage.css`
- Test: `frontend/src/pages/LandingPage.test.tsx`

**Interfaces:**
- Consumes: each landing section's `aria-labelledby` value and the fixed desktop/mobile navbar heights.
- Produces: the requested section heading positioned just below the fixed navbar after one navigation.

- [ ] **Step 1: Strengthen the failing tests**

Parameterize the valid-hash test for `#learning-paths`/`learning-paths-title` and `#teachers`/`teachers-title`. Assert that `scrollIntoView` is called with the heading as its receiver and `{ behavior: 'smooth', block: 'start' }`. Keep the unknown-hash no-op test.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --run src/pages/LandingPage.test.tsx`

Expected: FAIL because the section, rather than its labelled heading, currently receives `{ behavior: 'smooth' }` without `block: 'start'`.

- [ ] **Step 3: Implement heading-based scrolling and navbar offset**

Resolve the section from the hash, read its `aria-labelledby`, resolve that heading ID, and call `scrollIntoView({ behavior: 'smooth', block: 'start' })`. Add heading `scroll-margin-top` matching the fixed navbar height plus a small spacing token, including the existing 56px mobile navbar variant.

- [ ] **Step 4: Verify**

Run: `npm.cmd test -- --run src/pages/LandingPage.test.tsx`

Run: `npm.cmd test -- --run`

Run: `npm.cmd run build`

Expected: focused and full test suites PASS; production build succeeds.

- [ ] **Step 5: Keep hash navigation inside React Router**

Add a navbar routing test that starts on another route, clicks “Lộ trình”, and expects the `/` route to render in one click. Replace desktop and mobile internal `<a href>` items with React Router `Link to` items so native document navigation cannot override the heading scroll.

### Task 3: Wait for content above the anchor to settle

**Files:**
- Modify: `frontend/src/components/landing/FeaturedCourses.tsx`
- Modify: `frontend/src/pages/LandingPage.tsx`
- Test: `frontend/src/pages/LandingPage.test.tsx`

**Interfaces:**
- Produces: optional `FeaturedCourses.onSettled(): void`, called after success, empty, or error.
- Consumes: `LandingPage` uses the callback to permit hash scrolling to `learning-paths` and `teachers` only after the content above them has stabilized.

- [ ] **Step 1: Write a deferred-loading regression test**

Mock the course request with a pending Promise, render `/#learning-paths`, and assert no scroll occurs before resolution. Resolve the request to an empty array and assert the labelled heading scrolls exactly once.

- [ ] **Step 2: Verify RED**

Run: `npm.cmd test -- --run src/pages/LandingPage.test.tsx`

Expected: FAIL because scrolling currently happens before the course request settles.

- [ ] **Step 3: Implement the settled callback and scroll gate**

Add optional `onSettled` to `FeaturedCourses`, invoke it in `finally`, keep the parent callback stable, and gate only the two downstream navigation hashes until settled.

- [ ] **Step 4: Verify**

Run focused tests, the full frontend test suite, and the production build. All must pass.
