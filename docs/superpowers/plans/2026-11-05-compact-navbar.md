# Compact Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thu gọn Navbar landing page, thêm bề mặt mờ khi cuộn và phản hồi hover/focus rõ ràng mà không ảnh hưởng hành vi điều hướng hiện có.

**Architecture:** Thêm một state `isScrolled` cục bộ trong `NavBar.tsx`, cập nhật bằng passive scroll listener và phản chiếu qua class `site-header--scrolled`. CSS hiện có trong `LandingPage.css` chịu trách nhiệm về kích thước, button bo tròn, bề mặt cuộn và underline; không thêm dependency hay thay đổi routes.

**Tech Stack:** React 19, TypeScript, React Router 7, CSS, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-05-compact-navbar-design.md`

## Global Constraints

- Giữ nguyên tất cả route, nhãn, luồng đăng nhập/đăng xuất, menu mobile và focus trap hiện có.
- Header desktop cao 64px; mobile cao 56px; không co layout thêm khi cuộn.
- CTA chính, Đăng ký, account trigger và mobile menu trigger dùng `border-radius: 999px`.
- Sau ngưỡng cuộn 8px, áp dụng class trạng thái nền trắng trong suốt 88–92% kèm backdrop blur.
- Underline của nav desktop là 1px, xuất hiện khi hover và `:focus-visible`; reduced motion không có chuyển động nhưng vẫn thấy underline.
- Không thêm dependency, gradient hoặc icon-only CTA.

## Review Focus

- Render đầu trang với `window.scrollY > 8`: Navbar phải nhận state cuộn ngay, không chờ thao tác scroll tiếp theo.
- Event listener cuộn: passive, không nhân đôi sau re-render và được gỡ khi unmount.
- Chuyển qua breakpoint 1100px/720px: nav desktop ẩn đúng, mobile trigger vẫn có vùng chạm tối thiểu 44px.
- Keyboard focus ở nav desktop: underline hiển thị cùng focus outline, không chỉ khi hover chuột.
- `backdrop-filter` không hỗ trợ: nền trong suốt vẫn đảm bảo đọc được text và header không mất nền.

---

### Task 1: Thêm trạng thái cuộn cho Navbar

**Files:**
- Modify: `frontend/src/components/NavBar.tsx`
- Modify: `frontend/src/components/NavBar.test.tsx`

**Interfaces:**
- Produces: `site-header--scrolled` trên phần tử `<header>` khi `window.scrollY > 8`.
- Consumes: browser `scroll` event; không thay đổi props hoặc public API của `Navbar`.

- [ ] **Step 1: Viết test lỗi cho trạng thái cuộn**

Thêm test `adds the scrolled header class after the scroll threshold` vào `NavBar.test.tsx`: đặt `window.scrollY` là `9`, dispatch event `scroll`, rồi kiểm tra header có class `site-header--scrolled`. Test ngược lại với `scrollY = 0` để bảo đảm class không tồn tại.

- [ ] **Step 2: Chạy test để xác nhận lỗi**

Run: `npm run test:run -- src/components/NavBar.test.tsx`

Expected: FAIL vì `site-header--scrolled` chưa được render.

- [ ] **Step 3: Cài đặt state cuộn trong `NavBar.tsx`**

Tạo `const SCROLL_SURFACE_THRESHOLD = 8`; dùng `useState<boolean>` khởi tạo từ `window.scrollY > SCROLL_SURFACE_THRESHOLD`, và `useEffect` đăng ký passive listener cập nhật state. Gỡ listener trong cleanup. Ghép class của header theo dạng `site-header ${isScrolled ? 'site-header--scrolled' : ''}`.

- [ ] **Step 4: Chạy test component**

Run: `npm run test:run -- src/components/NavBar.test.tsx`

Expected: PASS, gồm các test menu mobile, account menu và trạng thái cuộn.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/NavBar.tsx frontend/src/components/NavBar.test.tsx
git commit -m "feat: add compact navbar scroll state"
```

### Task 2: Thiết kế compact surface và phản hồi navigation

**Files:**
- Modify: `frontend/src/styles/LandingPage.css`
- Test: `frontend/src/components/NavBar.test.tsx`

**Interfaces:**
- Consumes: class `site-header--scrolled` từ Task 1.
- Produces: header 64px/56px, controls bo tròn và underline desktop accessible.

- [ ] **Step 1: Mở rộng test semantic Navbar**

Thêm test xác nhận navigation chính vẫn chứa bốn link `Khóa học`, `Lộ trình`, `Giảng viên`, `FAQ` sau khi trạng thái cuộn thay đổi; test này bảo vệ việc CSS/class mới không thay đổi cấu trúc semantic.

- [ ] **Step 2: Chạy test để xác nhận lỗi do trạng thái mới chưa được kiểm tra**

Run: `npm run test:run -- src/components/NavBar.test.tsx`

Expected: PASS nếu cấu trúc semantic không bị đổi; đây là regression guard trước CSS-only task.

- [ ] **Step 3: Cập nhật `LandingPage.css`**

- Đặt `.navbar` ở `min-height: 64px`; ở mobile dùng `56px`, đồng thời cập nhật offset của `.mobile-nav-backdrop` và hero padding tương ứng.
- Thêm `.site-header--scrolled` với `background: rgba(255, 255, 255, .9)`, `backdrop-filter: blur(12px)` và transition chỉ cho `background-color`/`backdrop-filter`.
- Đặt `border-radius: 999px` cho `.button`, `.account-trigger`, `.mobile-menu-trigger`; giữ min-height và padding hiện hữu.
- Dùng pseudo-element cho `.nav-links a` để vẽ underline 1px bằng `transform: scaleX(0)`; chuyển sang `scaleX(1)` tại `:hover` và `:focus-visible`.
- Trong `prefers-reduced-motion`, loại bỏ transition của underline nhưng giữ trạng thái visible.

- [ ] **Step 4: Chạy test, lint và build**

Run: `npm run test:run && npm run lint && npm run build`

Expected: toàn bộ test pass, ESLint không có lỗi, Vite build exit 0.

- [ ] **Step 5: Kiểm tra thủ công responsive và keyboard**

Mở landing page ở 1440px, 768px, 390px; kiểm tra chiều cao header, target chạm, scroll surface, hover/focus underline, Escape/focus restoration của menu mobile và reduced motion.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/styles/LandingPage.css frontend/src/components/NavBar.test.tsx
git commit -m "style: refine compact navbar interactions"
```

## Self-review

- Spec coverage: Task 1 xử lý ngưỡng cuộn, listener và class; Task 2 xử lý kích thước, bo tròn, underline, reduced motion và regression verification.
- Type consistency: `site-header--scrolled` là contract duy nhất giữa React và CSS.
- Review focus: ngưỡng khởi tạo và scroll event được test ở Task 1; semantic nav ở Task 2; cleanup, breakpoint, focus visual và fallback blur được kiểm tra trực tiếp trong Task 2.
- Proportion: hai task độc lập kiểm thử được, không thay đổi cấu trúc ứng dụng hoặc thêm abstractions không cần thiết.
