# Featured Courses Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the featured-course section a centered full-width title band and accessible paged course navigation.

**Architecture:** Keep fetching and published-course normalization in `FeaturedCourses`. Add a small exported pagination helper for deterministic slicing and page bounds, then render it through accessible controls. CSS owns responsive page capacity and presentation, while React determines the course group from a shared three-course page size.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS.

**Spec:** `C:/.Study at School/.Web Application Safety/TrangTuyenSinhEdu/docs/superpowers/specs/2026-11-05-featured-courses-pagination-design.md`

## Global Constraints

- Only published courses render; no backend or API change.
- No subtitle below the section title; title band is full-width and centered.
- Prev/next controls must remain keyboard-accessible with 44px minimum targets and accurate disabled states.
- Preserve course-detail links, loading/error/empty states and reduced-motion support.

## Review Focus

- Fewer than three courses must render one page without disabled controls confusing keyboard users.
- A final partial page must render its remaining courses without empty placeholder cards.
- Retrying after an error must reset pagination to the first valid page.
- A changed course result set must not leave the user on an out-of-range page.
- Long category labels must wrap rather than overflow a card.

---

### Task 1: Test and implement pagination state

**Files:**
- Modify: `frontend/src/components/landing/FeaturedCourses.tsx`
- Create: `frontend/src/components/landing/FeaturedCourses.test.tsx`

**Interfaces:**
- Produces: `FEATURED_COURSE_PAGE_SIZE = 3` and `getFeaturedCoursePage<T>(items: T[], page: number, pageSize?: number)`.

- [ ] **Step 1: Write failing tests**

Test page slicing, final partial pages, out-of-range page correction, published filtering, title without the old subtitle, and prev/next status and disabled states.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm run test:run -- FeaturedCourses.test.tsx`
Expected: FAIL because the helper and pagination controls do not exist.

- [ ] **Step 3: Implement minimal pagination state and controls**

Reset to the first page after a successful load or retry; derive total pages from the filtered result; render controls only for multiple pages.

- [ ] **Step 4: Run focused test and full frontend tests**

Run: `npm run test:run -- FeaturedCourses.test.tsx && npm run test:run`
Expected: PASS.

### Task 2: Restyle title band, card categories and responsive pages

**Files:**
- Modify: `frontend/src/components/landing/CourseProductCard.tsx`
- Modify: `frontend/src/styles/LandingPage.css`

- [ ] **Step 1: Write failing component assertions**

Test that a supplied category is visible before the course title and an absent category is omitted.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm run test:run -- CourseProductCard.test.tsx`
Expected: FAIL because the category label is not a card heading detail.

- [ ] **Step 3: Implement category label and section styles**

Use the current visual tokens: a full-bleed title band, centered heading, compact arrow buttons and 3/2/1 responsive card grids. Add transition and reduced-motion styles without a gradient, resting shadow, or decorative rule.

- [ ] **Step 4: Verify**

Run: `npm run test:run && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/landing/FeaturedCourses.tsx frontend/src/components/landing/FeaturedCourses.test.tsx frontend/src/components/landing/CourseProductCard.tsx frontend/src/components/landing/CourseProductCard.test.tsx frontend/src/styles/LandingPage.css
git commit -m "feat: paginate featured courses"
```
