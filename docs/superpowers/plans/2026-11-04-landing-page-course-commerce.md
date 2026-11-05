# Landing Page Course Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện landing page như một cửa hàng khóa học: giúp người dùng chọn mục tiêu, so sánh khóa học, xem lộ trình/nội dung/giảng viên và đi đến chi tiết hoặc tư vấn.

**Architecture:** Plan này chỉ bắt đầu sau khi Plan 1 hoàn thành và tái sử dụng toàn bộ tokens, page frame, navigation contracts, test harness và accessible-layer primitive từ Plan 1. Dữ liệu course/teacher vẫn đến từ API hiện có; landing view models chuẩn hóa field không đồng nhất và cung cấp loading/error/empty/partial states. Nội dung tĩnh như learning paths và FAQ nằm trong typed content module, không hardcode rải rác.

**Tech Stack:** React 19, TypeScript, React Router 7, existing course/teacher APIs, CSS/Tailwind 4 foundation from Plan 1, Lucide React, Vitest and Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-04-landing-page-course-commerce-solution.md`, with shared acceptance criteria from `docs/superpowers/specs/2026-11-04-landing-page-ui-ux-redesign.md`.

## Global Constraints

- Plan 1 is a prerequisite; do not duplicate or replace its tokens, Navbar, Hero, contact dialog, page frame or test harness.
- Không thay backend/schema API; adapter phải chấp nhận status `published` và `PUBLISHED`.
- Chỉ render claim, policy, giá, discount, thời lượng và kết quả đầu ra khi dữ liệu thật có; không bịa fallback marketing copy.
- Course card phải cho phép so sánh tên, outcome/description, trình độ/category, thời lượng/chương, giảng viên và giá khi API cung cấp.
- Course Finder không tự điều hướng khi đổi option; chỉ CTA explicit dẫn sang `/danh-muc-khoa-hoc?goal=<value>`.
- Chỉ course và teacher là card objects; learning paths, proof, FAQ và CTA dùng composition khác.
- Không external placeholder; image failure dùng local fallback và alt text từ content.
- Loading giữ layout; error có retry; empty có hướng đi tiếp; partial data không làm sập section.
- Responsive acceptance: không overflow/overlap/clipping ở 390/768/1440px; course/teacher controls hoạt động bằng keyboard.
- Giữ các visual/accessibility constraints của Plan 1 và mục tiêu inspector 0 FAIL.

## Review Focus

- API trả status hoa/thường, `null`, non-array hoặc course thiếu image/teacher/price/syllabus: section render an toàn, không crash hoặc bịa dữ liệu.
- Retry sau lỗi courses/teachers: chỉ gọi lại request sở hữu, chuyển `error → loading → success/empty` và không nhân đôi item.
- Course Finder nhận category có dấu/khoảng trắng/ký tự lạ: query dùng `URLSearchParams`, không ghép chuỗi thô.
- Course/teacher title, name và description rất dài: card/section wrap mà không đẩy CTA ra ngoài hoặc làm vỡ 390px.
- FAQ/course controls ở trạng thái expanded + focused, hoặc reduced motion: semantic state và visual state luôn đồng bộ.

---

## File Structure

- Create `frontend/src/components/landing/AsyncSectionState.tsx`: shared loading/error/empty container.
- Create `frontend/src/components/landing/CourseFinder.tsx`: goal selector and explicit catalog CTA.
- Create `frontend/src/components/landing/FeaturedCourses.tsx`: fetch/render published course products.
- Create `frontend/src/components/landing/CourseProductCard.tsx`: comparable course object.
- Create `frontend/src/components/landing/courseViewModel.ts`: API-to-view-model normalization.
- Create `frontend/src/components/landing/LearningPaths.tsx`: ordered learning paths.
- Create `frontend/src/components/landing/LearningExperience.tsx`: real syllabus/project preview.
- Create `frontend/src/components/landing/TeacherShowcase.tsx`: responsive teachers with async states.
- Create `frontend/src/components/landing/ProofSection.tsx`: verified proof only.
- Create `frontend/src/components/landing/PurchaseFaq.tsx`: semantic accordion.
- Expand `frontend/src/content/landingContent.ts`: finder options, paths, FAQ, verified proof/contact data.
- Modify `frontend/src/components/CourseAccordion.tsx`, `WhyChooseUs.tsx`, `Teachers.tsx`: compatibility re-exports during migration.
- Modify `frontend/src/components/CTA.tsx`, `Footer.tsx`, `frontend/src/pages/LandingPage.tsx`, `frontend/src/styles/LandingPage.css`.
- Test each created component plus final `LandingPage.test.tsx`.

### Task 1: Course data normalization and shared async states

**Files:**
- Create: `frontend/src/components/landing/courseViewModel.ts`
- Create: `frontend/src/components/landing/AsyncSectionState.tsx`
- Test: `frontend/src/components/landing/courseViewModel.test.ts`
- Test: `frontend/src/components/landing/AsyncSectionState.test.tsx`

**Interfaces:**
- Produces: `CourseCardViewModel`; `toCourseCardViewModel(course: Course): CourseCardViewModel`; `isPublishedCourse(course: Course): boolean`; `getCurriculumCount(course: Course): number`; `AsyncSectionState({ status, title, onRetry, emptyAction, children })`.

- [ ] **Step 1: Write failing adapter tests**

Assert status `published` and `PUBLISHED` are accepted; draft/archive rejected; curriculum count supports `courseData` and `syllabus`; price 0 maps to free label, discount only displays when positive and lower than price; missing teacher/image/duration yields `null`/local fallback, not invented text; malformed optional arrays return 0.

- [ ] **Step 2: Write failing async-state tests**

Assert loading exposes `aria-busy` and skeletons; error uses `role="alert"` plus named retry; empty renders heading and a real action link; success renders children; state transitions do not leave stale alerts.

- [ ] **Step 3: Run tests and verify failure**

Run: `npm run test:run -- courseViewModel.test.ts AsyncSectionState.test.tsx`  
Expected: FAIL because modules do not exist.

- [ ] **Step 4: Implement the exact interfaces**

Keep normalization pure and defensive; use existing `formatPriceOrFree`/`formatVND` utilities where compatible. Async state owns presentation only, not fetching.

- [ ] **Step 5: Run tests**

Run: `npm run test:run -- courseViewModel.test.ts AsyncSectionState.test.tsx`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/landing/courseViewModel.ts frontend/src/components/landing/courseViewModel.test.ts frontend/src/components/landing/AsyncSectionState.tsx frontend/src/components/landing/AsyncSectionState.test.tsx
git commit -m "feat: normalize landing course data states"
```

### Task 2: Course Finder live interaction

**Files:**
- Create: `frontend/src/components/landing/CourseFinder.tsx`
- Modify: `frontend/src/content/landingContent.ts`
- Test: `frontend/src/components/landing/CourseFinder.test.tsx`

**Interfaces:**
- Produces: `CourseGoal = 'beginner' | 'frontend' | 'backend' | 'ui-ux'`; `CourseFinder({ initialGoal? }: { initialGoal?: CourseGoal }): JSX.Element`; `landingContent.courseGoals` with `value`, `label`, `queryValue`.
- Consumes: button/control tokens from Plan 1.

- [ ] **Step 1: Write failing interaction tests**

Assert question `Bạn muốn học để làm gì?`; four named options; arrow/Tab behavior follows selected control type; changing selection does not navigate; CTA href uses `URLSearchParams` and becomes `/danh-muc-khoa-hoc?goal=frontend`; invalid `initialGoal` falls back to `beginner`; no-JS fallback link targets catalog.

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test:run -- CourseFinder.test.tsx`  
Expected: FAIL because component does not exist.

- [ ] **Step 3: Implement typed goals and finder**

Use a fieldset/radio group or native select enhanced by CSS. Preserve a visible label, selected visual state and explicit CTA; do not use four feature cards.

- [ ] **Step 4: Add motion and reduced-motion behavior**

Animate only result summary/CTA with opacity + translate 180–250ms; reduced motion removes travel and never hides content.

- [ ] **Step 5: Run test and build**

Run: `npm run test:run -- CourseFinder.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/landing/CourseFinder.tsx frontend/src/components/landing/CourseFinder.test.tsx frontend/src/content/landingContent.ts frontend/src/styles/LandingPage.css
git commit -m "feat: add goal-based course finder"
```

### Task 3: Featured course commerce section

**Files:**
- Create: `frontend/src/components/landing/CourseProductCard.tsx`
- Create: `frontend/src/components/landing/FeaturedCourses.tsx`
- Modify: `frontend/src/components/CourseAccordion.tsx`
- Test: `frontend/src/components/landing/CourseProductCard.test.tsx`
- Test: `frontend/src/components/landing/FeaturedCourses.test.tsx`

**Interfaces:**
- Produces: `CourseProductCard({ course }: { course: CourseCardViewModel })`; `FeaturedCourses({ loadCourses = courseApi.getAllCourses }: { loadCourses?: () => Promise<Course[]> })`.
- Consumes: adapter and async state from Task 1.

- [ ] **Step 1: Write failing product-card tests**

Assert title links to `/khoa-hoc/:id`; outcome/short description, category/level, duration or curriculum count, teacher and price appear only when present; image alt contains course title; error swaps to local fallback; long content remains addressable; no `01` badge, nested button/link, shadow or remote placeholder.

- [ ] **Step 2: Write failing section-state tests**

Inject deferred/success/error/empty loaders. Assert loading skeleton, case-insensitive published filtering, max featured count chosen by a named constant, retry calls loader again without duplicates, empty links to catalog, and partial records render safely.

- [ ] **Step 3: Run tests and verify failure**

Run: `npm run test:run -- CourseProductCard.test.tsx FeaturedCourses.test.tsx`  
Expected: FAIL because new components do not exist.

- [ ] **Step 4: Implement card and section**

Render one heading `Khóa học nổi bật`, a concise comparison-oriented row and `Xem tất cả khóa học`. Use three columns desktop, two tablet and an 85–90vw snap item mobile or a tested one-column fallback.

- [ ] **Step 5: Preserve compatibility import**

Change `CourseAccordion.tsx` to re-export `FeaturedCourses` as default until all consumers migrate; remove old carousel/SVG/index code.

- [ ] **Step 6: Run tests and build**

Run: `npm run test:run -- CourseProductCard.test.tsx FeaturedCourses.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/landing/CourseProductCard.tsx frontend/src/components/landing/CourseProductCard.test.tsx frontend/src/components/landing/FeaturedCourses.tsx frontend/src/components/landing/FeaturedCourses.test.tsx frontend/src/components/CourseAccordion.tsx frontend/src/styles/LandingPage.css
git commit -m "feat: present courses as comparable products"
```

### Task 4: Learning paths, learning experience and verified proof

**Files:**
- Create: `frontend/src/components/landing/LearningPaths.tsx`
- Create: `frontend/src/components/landing/LearningExperience.tsx`
- Create: `frontend/src/components/landing/ProofSection.tsx`
- Modify: `frontend/src/components/WhyChooseUs.tsx`
- Modify: `frontend/src/components/About.tsx`
- Modify: `frontend/src/content/landingContent.ts`
- Test: `frontend/src/components/landing/LearningPaths.test.tsx`
- Test: `frontend/src/components/landing/LearningExperience.test.tsx`
- Test: `frontend/src/components/landing/ProofSection.test.tsx`

**Interfaces:**
- Produces: `LearningPath` type with `id`, `title`, `entry`, `courses`, `outcome`, `duration?`; `LearningExperience({ course? }: { course?: Course })`; `VerifiedProof` union that requires `verified: true` before numeric display.

- [ ] **Step 1: Write failing content-integrity tests**

Assert paths use semantic ordered content with real names, not four generic feature cards; experience renders available syllabus/project/mentor fields and an honest unavailable state; unverified numeric proof renders nothing; verified proof renders label/source-note; no 10+/5000+/100+/95% exists in default content.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test:run -- LearningPaths.test.tsx LearningExperience.test.tsx ProofSection.test.tsx`  
Expected: FAIL because modules/types do not exist.

- [ ] **Step 3: Implement typed content and compositions**

Use a sequence composition for paths, split composition for experience and a full-width proof field only when verified data exists. Do not introduce repeated card grids or invented course ordering.

- [ ] **Step 4: Add compatibility exports**

Make `WhyChooseUs.tsx` export `LearningPaths`; make `About.tsx` export `ProofSection` or remove it from page composition when no verified proof exists.

- [ ] **Step 5: Run tests and build**

Run: `npm run test:run -- LearningPaths.test.tsx LearningExperience.test.tsx ProofSection.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/landing/LearningPaths.tsx frontend/src/components/landing/LearningPaths.test.tsx frontend/src/components/landing/LearningExperience.tsx frontend/src/components/landing/LearningExperience.test.tsx frontend/src/components/landing/ProofSection.tsx frontend/src/components/landing/ProofSection.test.tsx frontend/src/components/WhyChooseUs.tsx frontend/src/components/About.tsx frontend/src/content/landingContent.ts frontend/src/styles/LandingPage.css
git commit -m "feat: show learning paths and course evidence"
```

### Task 5: Responsive teacher showcase

**Files:**
- Create: `frontend/src/components/landing/TeacherShowcase.tsx`
- Modify: `frontend/src/components/Teachers.tsx`
- Test: `frontend/src/components/landing/TeacherShowcase.test.tsx`

**Interfaces:**
- Produces: `TeacherShowcase({ loadTeachers = teacherApi.getAllTeachers }: { loadTeachers?: () => Promise<Teacher[]> })`.
- Consumes: `AsyncSectionState` from Task 1, local fallback from Plan 1.

- [ ] **Step 1: Write failing teacher-state tests**

Assert injected loader supports loading/success/error/retry/empty; missing avatar uses local fallback; card exposes name, title/specialization, experience and only real associated-course data; no external placeholder. Assert 1/2/3-column responsive classes instead of translate math tied to three visible items.

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test:run -- TeacherShowcase.test.tsx`  
Expected: FAIL because new showcase does not exist/current slider is fixed to three items.

- [ ] **Step 3: Implement responsive showcase**

Prefer CSS grid/list over carousel. If content count requires horizontal browsing, use native scroll snap with labelled controls and derive movement from element width, not `100 / 3`.

- [ ] **Step 4: Migrate compatibility export**

Make `Teachers.tsx` re-export the showcase and remove old hardcoded slider state.

- [ ] **Step 5: Run test and build**

Run: `npm run test:run -- TeacherShowcase.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/landing/TeacherShowcase.tsx frontend/src/components/landing/TeacherShowcase.test.tsx frontend/src/components/Teachers.tsx frontend/src/styles/LandingPage.css
git commit -m "feat: add resilient teacher showcase"
```

### Task 6: Purchase FAQ, conversion CTA and truthful Footer

**Files:**
- Create: `frontend/src/components/landing/PurchaseFaq.tsx`
- Modify: `frontend/src/content/landingContent.ts`
- Modify: `frontend/src/components/CTA.tsx`
- Modify: `frontend/src/components/Footer.tsx`
- Test: `frontend/src/components/landing/PurchaseFaq.test.tsx`
- Test: `frontend/src/components/CTA.test.tsx`
- Test: `frontend/src/components/Footer.test.tsx`

**Interfaces:**
- Produces: `FaqItem { id, question, answer, verified: true }`; semantic FAQ accordion; CTA links `/danh-muc-khoa-hoc` and `/lien-he`.

- [ ] **Step 1: Write failing FAQ tests**

Assert only verified FAQ items render; buttons expose `aria-expanded`/`aria-controls`; Enter/Space toggles; expanded panel has matching id; focus remains on trigger; reduced motion does not hide panel.

- [ ] **Step 2: Write failing CTA/Footer tests**

Assert exact CTA heading `Chọn khóa học phù hợp`; primary/secondary links are real and differently ranked; Footer contains no `href="#"`, no `EduPro`, phone/email use correct schemes and unverified website/QR is omitted.

- [ ] **Step 3: Run tests and verify failure**

Run: `npm run test:run -- PurchaseFaq.test.tsx CTA.test.tsx Footer.test.tsx`  
Expected: FAIL on missing FAQ, dead CTA buttons and fake Footer links/brand mismatch.

- [ ] **Step 4: Implement FAQ, CTA and Footer**

Use typed verified content; design Footer as a brand close rather than another card/sitemap grid. Do not invent answers to refund/payment/certificate questions.

- [ ] **Step 5: Run tests and build**

Run: `npm run test:run -- PurchaseFaq.test.tsx CTA.test.tsx Footer.test.tsx && npm run build`  
Expected: PASS; build exits 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/landing/PurchaseFaq.tsx frontend/src/components/landing/PurchaseFaq.test.tsx frontend/src/components/CTA.tsx frontend/src/components/CTA.test.tsx frontend/src/components/Footer.tsx frontend/src/components/Footer.test.tsx frontend/src/content/landingContent.ts frontend/src/styles/LandingPage.css
git commit -m "feat: complete course purchase decision flow"
```

### Task 7: Integrate the commerce page and verify the full journey

**Files:**
- Modify: `frontend/src/pages/LandingPage.tsx`
- Modify: `frontend/src/pages/LandingPage.test.tsx`
- Modify: `frontend/src/styles/LandingPage.css`
- Generate: `.taste-skill/after/*` (audit artifacts).

**Interfaces:**
- Consumes: every Plan 1 primitive and Tasks 1–6 of this plan.
- Produces: final order Hero → CourseFinder → FeaturedCourses → LearningPaths → LearningExperience → TeacherShowcase → optional Proof → PurchaseFaq → CTA.

- [ ] **Step 1: Write failing full-page tests**

Assert section order and headings; exactly one H1; all navigation anchors exist; CTA/routes are correct; API error states do not remove section headings; default page contains no unverified claims, `href="#"`, remote placeholders, carousel timer or dead buttons.

- [ ] **Step 2: Run full-page test and verify failure**

Run: `npm run test:run -- LandingPage.test.tsx`  
Expected: FAIL until all new sections replace legacy bodies.

- [ ] **Step 3: Integrate final composition**

Import the new landing components directly, remove obsolete wrappers/imports and ensure Footer remains outside main/reveal. Delete dead legacy CSS after checking no other page uses each selector.

- [ ] **Step 4: Run all automated checks**

Run: `npm run test:run && npm run lint && npm run build`  
Expected: all tests/build pass; changed files have no lint errors.

- [ ] **Step 5: Run design gates on production preview**

Run `lint.mjs` for landing source, then `inspect.mjs` against `vite preview` output into `.taste-skill/after`. Expected: 0 FAIL at 1440/768/390, no still-page/reduced-motion blank bands and no contrast/overflow warning left undefended.

- [ ] **Step 6: Inspect and critique screenshots**

Open every fold/full-page screenshot. Record critique in required round format; verify first screen reads as a course marketplace in five seconds, layouts do not repeat, at least four honest images/product fragments exist, and Course Finder is the one live thing. Fix top three visible issues and re-run, maximum three rounds.

- [ ] **Step 7: Keyboard and route regression**

Verify skip link, mobile/account menus, Course Finder, product links, retry controls, FAQ and contact dialog. Click `/danh-muc-khoa-hoc`, `/lien-he`, `/login`, `/register`, course details and logout; confirm no existing flow regressed.

- [ ] **Step 8: Commit**

```bash
git add frontend
git commit -m "feat: ship course-commerce landing experience"
```

