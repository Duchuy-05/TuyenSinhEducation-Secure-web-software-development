# Hero title desktop line-break design

## Goal

Prevent the landing-page hero title from overlapping the hero image on desktop by displaying the title as:

- `Khóa học về`
- `công nghệ`

Mobile layout behavior must remain unchanged.

## Design

Update the landing hero title presentation so the desktop title has an intentional line break after `về`. Remove the desktop-only `white-space: nowrap` behavior that allows the title to extend into the image. Keep the mobile media query free to use normal wrapping and preserve its existing font sizing and single-column layout.

Only the landing hero component and its related CSS should change. Hero copy, image, actions, links, and other landing sections remain unchanged.

## Validation

- Run the focused landing hero tests.
- Run the frontend production build.
- Confirm the title no longer overlaps the image at desktop widths.
- Confirm mobile markup and wrapping behavior remain unchanged.
