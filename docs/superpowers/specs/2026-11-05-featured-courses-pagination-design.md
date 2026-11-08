# Featured Courses Pagination Design

## Intent

Make the featured-courses section faster to scan: a centered, full-width title band establishes the section, and users browse published courses in discrete pages with compact next/previous controls.

## Selected approach

Use a full-width dark brand band behind the centered `Khóa học nổi bật` heading. Remove the existing comparison subtitle. Keep the existing data source and course cards, but make each card surface its category as an immediately visible label. The course list pages in groups of three on desktop, two on tablet, and one on mobile.

## Interaction

- Prev/next controls have compact arrow visuals, `aria-label` text, a minimum 44px hit target, and disabled states at the respective ends.
- A visible `Trang X / Y` status is announced politely when page changes.
- Course pages change with a short transform/opacity transition; reduced-motion users receive an immediate change.
- Loading, error and empty states keep their existing behavior. Pagination only appears when more than one page exists.

## Constraints

- Do not change backend APIs or course filtering: only published courses render.
- Do not invent course categories or marketing copy; show the supplied category only when present.
- Preserve the course-detail links and responsive layout.
- Keep keyboard operation and semantic section heading intact.
