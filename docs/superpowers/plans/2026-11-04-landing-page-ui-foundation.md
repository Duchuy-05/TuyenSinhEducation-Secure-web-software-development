# Landing Page UI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây lại nền tảng UI/UX của landing page để có first screen rõ nghĩa, responsive ổn định, navigation và dialog truy cập được, cùng một visual system thống nhất cho Plan 2 sử dụng.

**Architecture:** Giữ React 19, React Router 7, Tailwind 4 và API hiện có. Tách design tokens, content tĩnh và interaction hooks khỏi component; dùng CSS landing page là nguồn visual truth thay vì tiếp tục trộn inline style, raw hex và utility ngẫu nhiên. Plan này hoàn thiện shell, Header, Hero, modal liên hệ, semantics, metadata và responsive foundation; các section thương mại chi tiết thuộc Plan 2.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS 4, CSS custom properties, Lucide React, Vitest, jsdom, Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-04-landing-page-ui-ux-redesign.md` và các yêu cầu nền tảng dùng chung trong `docs/superpowers/specs/2026-11-04-landing-page-course-commerce-solution.md`.

## Global Constraints

- Không thay backend, schema API, protected routes, logic thanh toán hoặc framework.
- Màu cam là accent brand bắt buộc; chọn biến thể đạt WCAG AA thay cho việc phủ cam nhạt trên text.
- Tối đa hai typeface và năm cỡ chữ; body 16–18px, measure tối đa 65ch.
- Dùng một cặp outer margins `clamp(16px, 3vw, 32px)`; section gap 120–160px desktop và 72–96px mobile.
- Không gradient trang trí, glass, glow, eyebrow pill, index `01/02/03`, emoji UI, hairline trang trí, shadow card đứng yên hoặc placeholder network.
- Touch target tối thiểu 44×44px; text thường đạt contrast 4.5:1, large text 3:1; focus ring luôn nhìn thấy.
- Motion chỉ dùng transform/opacity; feedback 180–250ms; `prefers-reduced-motion` hiện content ngay.
- Không hiển thị claim 10+/5000+/100+/95% hoặc cam kết việc làm cho đến khi có xác nhận.
- Mọi task kết thúc bằng test/build tương ứng và một commit nhỏ, không trộn thay đổi ngoài phạm vi.

## Review Focus

- `localStorage.user` thiếu, JSON hỏng hoặc thiếu `name`: navbar vẫn render, không crash và avatar có fallback `U`.
- Menu mobile/user menu/dialog đang mở rồi người dùng bấm Escape, click outside hoặc chuyển route: overlay đóng, body unlock và focus trả về trigger.
- Viewport 390px với text zoom 200%: logo, menu button và CTA không overlap hoặc tạo horizontal overflow.
- `prefers-reduced-motion: reduce` hoặc không có `IntersectionObserver`: không có content bị opacity 0.
- Hero media lỗi hoặc asset chưa được thay: H1, supporting copy và CTA vẫn đủ để hiểu và thao tác.

---

## File Structure

- Create `frontend/src/test/setup.ts`: jest-dom setup, browser API stubs dùng chung.
- Create `frontend/src/components/landing/useDismissibleLayer.ts`: Escape, click-outside, focus return và body scroll lock cho mobile menu/dialog.
- Create `frontend/src/components/landing/LandingHero.tsx`: hero tĩnh có H1 và CTA thật.
- Create `frontend/src/content/landingContent.ts`: copy, navigation labels và contact data được xác nhận.
- Create `frontend/src/assets/course-fallback.svg`: fallback local, không network.
- Modify `frontend/package.json`: test scripts và dev dependencies.
- Modify `frontend/vite.config.ts` hoặc create nếu chưa có: Vitest/jsdom config.
- Modify `frontend/index.html`: Vietnamese metadata.
- Modify `frontend/src/pages/LandingPage.tsx`: semantic shell và section order placeholder cho Plan 2.
- Modify `frontend/src/components/NavBar.tsx`: desktop/mobile navigation và accessible account menu.
- Modify `frontend/src/components/Hero.tsx`: re-export/chuyển sang `LandingHero` trong giai đoạn migration, không cò carousel.
- Modify `frontend/src/components/FloatingContact.tsx`: một launcher + accessible dialog.
- Modify `frontend/src/components/ScrollReveal.tsx`: reveal an toàn và reduced-motion.
- Replace landing-specific rules in `frontend/src/styles/LandingPage.css`: tokens, frame, type, components, responsive và states.
- Test `frontend/src/components/NavBar.test.tsx`, `LandingHero.test.tsx`, `FloatingContact.test.tsx`, `ScrollReveal.test.tsx`, `frontend/src/pages/LandingPage.test.tsx`.

### Task 1: Test harness, metadata and design tokens

**Files:**
- Modify: `frontend/package.json`
- Create/Modify: `frontend/vite.config.ts`
- Create: `frontend/src/test/setup.ts`
- Modify: `frontend/index.html`
- Modify: `frontend/src/styles/LandingPage.css`
- Test: `frontend/src/pages/LandingPage.test.tsx`

**Interfaces:**
- Produces: `npm run test`, `npm run test:run`; CSS tokens `--color-ground`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-success`, `--color-error`, `--space-*`, `--type-*`, `--motion-fast`, `--motion-base`, `--page-gutter`, `--section-gap`.

- [ ] **Step 1: Add failing shell/metadata assertions**

Create `LandingPage.test.tsx` asserting one `<main>`, one visible H1 placeholder and navigation/footer landmarks. Add a small Node-side assertion or HTML read test for `lang="vi"`, the exact title `Khóa học công nghệ thực hành | Đức Huy Education`, viewport and a non-empty description.

- [ ] **Step 2: Run tests to verify the harness or assertions fail**

Run: `npm run test:run -- LandingPage.test.tsx`  
Expected: FAIL because test tooling/config or required semantics do not exist.

- [ ] **Step 3: Configure Vitest and Testing Library**

Add dev dependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`; configure `environment: 'jsdom'`, setup file and cleanup. Add scripts `test` and `test:run`.

- [ ] **Step 4: Replace global CSS foundation**

Define the produced tokens, explicit focus-visible styles, selection styles, one page frame class and reduced-motion override. Remove duplicate `.nav-actions`, `transition: all`, undefined `--bg-black`, resting shadows, decorative borders, gradient and global list reset that removes semantics without component scoping.

- [ ] **Step 5: Update document metadata**

Set `lang="vi"`, exact title above, Vietnamese description, brand favicon path and theme color based on the final accent token.

- [ ] **Step 6: Run the focused test and build**

Run: `npm run test:run -- LandingPage.test.tsx && npm run build`  
Expected: tests pass except assertions intentionally owned by later tasks must be marked with explicit TODO tests, and build exits 0.

- [ ] **Step 7: Commit**

```bash
git add frontend/package.json frontend/vite.config.ts frontend/src/test/setup.ts frontend/index.html frontend/src/styles/LandingPage.css frontend/src/pages/LandingPage.test.tsx
git commit -m "test: establish landing page design foundation"
```

### Task 2: Accessible dismissible-layer primitive and Navbar

**Files:**
- Create: `frontend/src/components/landing/useDismissibleLayer.ts`
- Modify: `frontend/src/components/NavBar.tsx`
- Test: `frontend/src/components/NavBar.test.tsx`

**Interfaces:**
- Produces: `useDismissibleLayer({ open, onClose, triggerRef, layerRef, lockScroll, trapFocus }): void`.
- Consumes: tokens and focus styles from Task 1.

- [ ] **Step 1: Write failing navbar interaction tests**

Assert: 390px/mobile state exposes a named menu button with target classes; `aria-expanded` mirrors state; first menu item receives focus; Tab stays within drawer; Escape and outside pointer close it and restore trigger focus. Assert account trigger is a button, works by click/keyboard, logout remains callable, corrupt `localStorage.user` does not crash, and desktop has only one visually primary CTA.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:run -- NavBar.test.tsx`  
Expected: FAIL on missing menu button, hover-only account menu and corrupt storage handling.

- [ ] **Step 3: Implement `useDismissibleLayer`**

Implement the exact hook interface above with Escape, outside pointer, focus trap, focus restoration and optional body scroll lock; ensure cleanup runs on unmount/route change.

- [ ] **Step 4: Rebuild Navbar semantics and hierarchy**

Use `<header><nav aria-label="Điều hướng chính">`; links: Khóa học, Lộ trình, Giảng viên, FAQ; primary CTA links to `/danh-muc-khoa-hoc`; login is text-level and register secondary. Parse stored user inside guarded `try/catch`; replace avatar `<div>` with button and remove emoji.

- [ ] **Step 5: Add responsive navbar CSS**

At 390px keep a one-line wordmark plus 44px menu trigger, hide desktop groups and render a full-height drawer; prevent overlap at 200% text zoom. At desktop keep one row and no pill/glass navigation.

- [ ] **Step 6: Run tests and build**

Run: `npm run test:run -- NavBar.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/landing/useDismissibleLayer.ts frontend/src/components/NavBar.tsx frontend/src/components/NavBar.test.tsx frontend/src/styles/LandingPage.css
git commit -m "feat: rebuild accessible responsive navigation"
```

### Task 3: Product-focused static Hero

**Files:**
- Create: `frontend/src/content/landingContent.ts`
- Create: `frontend/src/components/landing/LandingHero.tsx`
- Create: `frontend/src/assets/course-fallback.svg`
- Modify: `frontend/src/components/Hero.tsx`
- Test: `frontend/src/components/landing/LandingHero.test.tsx`

**Interfaces:**
- Produces: `LandingHero(): JSX.Element`; `landingContent.hero` with `title`, `description`, `primaryCta`, `secondaryCta`, `mediaAlt`.
- Consumes: page frame/button/type tokens from Task 1.

- [ ] **Step 1: Write failing hero tests**

Assert exact temporary H1 `Học kỹ năng công nghệ qua khóa học thực hành`; one H1 only; primary link `/danh-muc-khoa-hoc`; secondary link `/lien-he`; media has meaningful alt; no timer, carousel controls or dots; broken media does not hide copy/actions.

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test:run -- LandingHero.test.tsx`  
Expected: FAIL because current Hero is an auto carousel without H1.

- [ ] **Step 3: Implement typed content and `LandingHero`**

Move approved labels/copy into `landingContent.ts`. Build a 12-column desktop hero (copy 5, media 7) and copy-first mobile composition. Use local fallback asset; do not add unlicensed imagery.

- [ ] **Step 4: Migrate `Hero.tsx` without breaking imports**

Make existing default export render/re-export `LandingHero`; remove banner array, interval state and carousel-only code.

- [ ] **Step 5: Add hero CSS and responsive assertions**

Use `clamp()` display type, maximum two-line measure at 1440/768/390, one primary filled action and one text link. Ensure the media may fail without changing layout semantics.

- [ ] **Step 6: Run tests and build**

Run: `npm run test:run -- LandingHero.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/content/landingContent.ts frontend/src/components/landing/LandingHero.tsx frontend/src/components/landing/LandingHero.test.tsx frontend/src/components/Hero.tsx frontend/src/assets/course-fallback.svg frontend/src/styles/LandingPage.css
git commit -m "feat: replace carousel with product-focused hero"
```

### Task 4: Accessible contact dialog

**Files:**
- Modify: `frontend/src/components/FloatingContact.tsx`
- Modify/Create: `frontend/src/content/landingContent.ts`
- Test: `frontend/src/components/FloatingContact.test.tsx`
- Asset: use a verified local QR asset; if none exists, omit QR block rather than inventing one.

**Interfaces:**
- Consumes: `useDismissibleLayer` from Task 2 and verified `landingContent.contact`.
- Produces: one launcher and dialog labelled `Liên hệ Đức Huy Education`.

- [ ] **Step 1: Write failing dialog tests**

Assert one launcher on mobile; dialog has `role="dialog"`, `aria-modal="true"`, labelled title; focus enters dialog, loops, closes with Escape/overlay/close button and returns to launcher. Assert phone link exactly `tel:0926008221`, no emoji, no remote placeholder and reduced-motion disables pulse.

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test:run -- FloatingContact.test.tsx`  
Expected: FAIL on missing dialog semantics/focus behavior and mismatched phone link.

- [ ] **Step 3: Rebuild launcher and dialog**

Use one 48px launcher, Lucide icons and the shared dismissible-layer hook. Import QR statically only if a verified asset is present; otherwise render phone/email/contact-page actions.

- [ ] **Step 4: Add non-obscuring responsive placement**

Reserve safe bottom/right offsets, remove continuous breathing/ripple motion on mobile and ensure footer/CTA are not covered at 390px.

- [ ] **Step 5: Run tests and build**

Run: `npm run test:run -- FloatingContact.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/FloatingContact.tsx frontend/src/components/FloatingContact.test.tsx frontend/src/content/landingContent.ts frontend/src/styles/LandingPage.css
git commit -m "fix: make contact dialog accessible and reliable"
```

### Task 5: Semantic page shell and safe motion

**Files:**
- Modify: `frontend/src/pages/LandingPage.tsx`
- Modify: `frontend/src/components/ScrollReveal.tsx`
- Modify: `frontend/src/styles/LandingPage.css`
- Test: `frontend/src/pages/LandingPage.test.tsx`
- Test: `frontend/src/components/ScrollReveal.test.tsx`

**Interfaces:**
- Produces: one `<main id="main-content">`, skip link, stable section anchors `courses`, `learning-paths`, `teachers`, `faq`; `ScrollReveal` content visible without observer or with reduced motion.
- Consumes: Header/Hero/dialog from Tasks 2–4.

- [ ] **Step 1: Add failing shell and motion tests**

Assert skip link targets main, one H1, landmarks are in reading order, Footer is outside reveal wrapper, all named sections have associated headings, and ScrollReveal is visible for reduced motion/missing observer. Add 390px DOM/class assertions preventing duplicate fixed navigation/actions.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:run -- LandingPage.test.tsx ScrollReveal.test.tsx`  
Expected: FAIL on missing main/skip link/section semantics or reveal behavior.

- [ ] **Step 3: Recompose `LandingPage` shell**

Render skip link, Navbar, main, Hero, existing content sections in temporary compatible order, CTA, Footer and FloatingContact. Add stable anchors now so Plan 2 can replace bodies without changing navigation contracts.

- [ ] **Step 4: Refine `ScrollReveal`**

Expose optional `as` only if needed; default content visible in markup and add motion class after client capability check so script failure never creates blank bands. Animate child parts via CSS data attributes rather than the whole section for two seconds.

- [ ] **Step 5: Run complete automated checks**

Run: `npm run test:run && npm run lint && npm run build`  
Expected: tests/build pass; lint has no new errors attributable to changed files.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/LandingPage.tsx frontend/src/pages/LandingPage.test.tsx frontend/src/components/ScrollReveal.tsx frontend/src/components/ScrollReveal.test.tsx frontend/src/styles/LandingPage.css
git commit -m "refactor: establish semantic landing page shell"
```

### Task 6: Foundation visual gate and regression pass

**Files:**
- Modify as findings require: files changed in Tasks 1–5 only.
- Generate: `.taste-skill/after-foundation/*` (audit artifacts, do not commit unless repository policy requests it).

**Interfaces:**
- Consumes: complete Plan 1 build.
- Produces: verified foundation ready for Plan 2.

- [ ] **Step 1: Run production and source gates**

Run from repository root:

```bash
cd frontend
npm run test:run
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

Then run `lint.mjs` on landing source and `inspect.mjs` on the production preview with output `.taste-skill/after-foundation`.

Expected: automated tests/build pass; design lint and inspector report 0 FAIL for Plan 1-owned areas.

- [ ] **Step 2: Inspect every screenshot**

Open desktop/tablet/mobile fold and full-page sheets. Verify first-screen comprehension, equal margins, H1 ≤2 lines, no navbar overlap/overflow, dialog launcher placement and visible focus.

- [ ] **Step 3: Test keyboard flows manually**

Tab through skip link, main nav, mobile drawer, account menu, hero CTAs and contact dialog. Verify Escape, focus trap, return focus and body unlock.

- [ ] **Step 4: Fix only Plan 1 regressions and rerun gates**

Repeat until 0 FAIL in owned areas and no source test regression. Record any remaining failures caused solely by legacy commerce sections as inputs to Plan 2.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "fix: close landing foundation visual regressions"
```

