# Đặc tả redesign UI/UX Landing Page — Đức Huy Education

## 1. Mục tiêu

Biến landing page hiện tại từ một trang carousel + các khối template thành trang giáo dục có thể hiểu trong 5 giây, dẫn người dùng đến khóa học phù hợp và hoạt động ổn định ở 390/768/1440 px.

Người dùng chính được suy ra từ nội dung hiện có: học sinh/sinh viên hoặc người mới tìm khóa học công nghệ thực hành. Hành động chính: xem danh mục khóa học. Hành động phụ: nhận tư vấn.

## 2. Phạm vi

### Trong phạm vi

- `LandingPage.tsx` và các component trực tiếp: Navbar, Hero, About, CourseAccordion, WhyChooseUs, Teachers, CTA, Footer, FloatingContact, ScrollReveal.
- `LandingPage.css`, metadata của `index.html`, responsive layout, semantic HTML, keyboard/focus, loading/error/empty states.
- Giữ React 19, React Router, Tailwind 4 và API hiện có; không migration framework.

### Ngoài phạm vi

- Không thay backend, schema API, logic thanh toán hay dashboard.
- Không bịa thêm review, logo đối tác, thành tích hoặc số liệu chưa được xác minh.
- Không thêm video/stock photo không rõ bản quyền.

## 3. Ba hướng đã cân nhắc

1. **Chỉ vá responsive và accessibility.** Rủi ro thấp, nhưng carousel không có thông điệp và chuỗi card template vẫn không giải quyết bài toán chuyển đổi.
2. **Restyle giữ nguyên bố cục.** Cải thiện type, màu, spacing nhanh; tuy nhiên hero, information architecture và CTA vẫn yếu.
3. **Redesign có kiểm soát (khuyến nghị).** Giữ route, API, nội dung thật và brand name; xây lại hero, thứ tự nội dung, mobile navigation, trạng thái dữ liệu và visual system. Đây là hướng duy nhất xử lý đồng thời lỗi nhận diện, UX và responsive.

## 4. Art direction đề xuất

**Ý niệm:** lộ trình học trở thành trục kể chuyện của trang — từ “chọn đích đến”, “học theo lộ trình” đến “được mentor hỗ trợ”. Concept này phải được xác thực với nội dung/khóa học thật trước khi code.

- Tính cách: rõ ràng, nhiệt huyết, thực hành; không “corporate EdTech” chung chung.
- Màu: một ground sáng, ink đậm, một accent cam có đủ contrast. Không gradient, glass, glow hay nhiều màu accent cạnh tranh.
- Typography: tối đa hai font; display có cá tính hơn Inter mặc định, body rõ dấu tiếng Việt. H1 2 dòng trở xuống ở mọi viewport; body 16–20 px, 45–75 ký tự/dòng.
- Composition: hero split bất đối xứng với nội dung thật và một hình ảnh chủ đạo; các section liền kề không lặp cùng một card grid.
- Hình ảnh: ưu tiên ảnh giảng viên/lớp học/sản phẩm thật. Banner minh họa lập trình hiện tại không đủ tính sở hữu để làm hero.

Trong giai đoạn implement, chạy `draw.mjs` với `--keep palette` nếu cam là màu brand bắt buộc; direction sheet cuối cùng sẽ quyết định type/composition, không pha trộn nhiều direction.

## 5. Information architecture và copy deck

1. **Header:** wordmark, Khóa học, Lộ trình/Phương pháp, Giảng viên, Liên hệ; một CTA “Xem khóa học”. Login/register thu gọn theo trạng thái người dùng.
2. **Hero:** H1 nói rõ sản phẩm + đối tượng; một supporting sentence; một primary CTA “Xem khóa học”; một text link “Nhận tư vấn”. Không auto-rotating carousel.
3. **Khóa học nổi bật:** danh sách có tên, mô tả, giảng viên, số chương và giá/trạng thái rõ ràng; có link xem toàn bộ danh mục.
4. **Lộ trình/phương pháp:** thay bốn card “Tại sao chọn” chung chung bằng 3 bước có bằng chứng thật: chọn lộ trình, học dự án, nhận phản hồi mentor.
5. **Giảng viên:** danh sách responsive, không carousel tự tính cứng 3 card; loading skeleton, empty state và error có retry.
6. **Proof:** chỉ hiện các số liệu 10+/5000+/100+/95% sau khi chủ sở hữu xác minh. Nếu chưa xác minh, thay bằng thông tin có thể kiểm chứng (nội dung chương trình, hình thức hỗ trợ, lịch học).
7. **CTA cuối:** headline ngắn, một nút chính đi đến `/danh-muc-khoa-hoc`, link phụ đi đến `/lien-he`.
8. **Footer:** brand statement, nhóm link thật, thông tin liên hệ click được; bỏ link `#` và thống nhất tên Đức Huy Education (không để EduPro).

## 6. Functional requirements

### Navigation

- 390 px: logo không wrap; hiện menu button tối thiểu 44×44 px; drawer/menu có `aria-expanded`, Escape, click outside, focus trap và trả focus khi đóng.
- Desktop: không quá một CTA nổi bật; trạng thái active có cả semantic lẫn visual.
- User menu dùng button, hỗ trợ click/keyboard; không chỉ mở bằng hover.

### Hero

- Có duy nhất một `h1` hiển thị ngay first viewport.
- CTA là `Link` thật, không phải button không handler.
- Nếu vẫn giữ carousel (không khuyến nghị): phải có pause, accessible names, `aria-live` phù hợp, dừng khi hover/focus và tôn trọ `prefers-reduced-motion`.

### Data sections

- Loading: skeleton giữ chiều cao section và `aria-busy`/status text cho screen reader.
- Error: heading + mô tả ngắn + nút “Thử lại”; không biến section thành một dòng chữ đỏ.
- Empty: giải thích và dẫn đến danh mục/liên hệ phù hợp.
- Course image có `alt` theo tên khóa học; lỗi ảnh dùng local fallback, không phụ thuộc `via.placeholder.com`.
- Teacher carousel nếu giữ lại phải dựa trên số item hiển thị theo breakpoint, có label cho prev/next và không dịch sai ở tablet/mobile.

### Modal liên hệ

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; focus trap, Escape, return focus.
- Close button có accessible name; icon từ Lucide, không emoji.
- QR dùng import asset hợp lệ; hotline `tel:0926008221` khớp text hiển thị; website URL được xác minh.
- Nút floating không che nội dung/CTA; trên mobile chỉ giữ một entry point, từ 48×48 px.

## 7. Visual-system requirements

- Token hóa color, type, spacing 4/8/16/24/40/64/96, motion và radius; xóa duplicate `.nav-actions`, inline styles và các raw hex không thuộc palette.
- Tối đa 5 cỡ chữ. Khoảng cách section 120–160 px desktop, 72–96 px mobile; cùng một cặp outer margins.
- Không eyebrow pill, `01/02/03`, gradient, glass, shadow trên card đứng yên, hairline trang trí, icon-topped feature cards hay dãy card giống hệt nhau.
- Button chỉ có primary/secondary/text; touch target tối thiểu 44×44 px; focus ring rõ, không `focus:outline-none` khi không có thay thế.
- Running text đạt WCAG AA 4.5:1; large text 3:1; không dùng opacity để làm nhạt nội dung chính.
- Motion chỉ dùng transform/opacity, 180–300 ms cho feedback; reveal theo từng phần tử thay vì fade cả section trong 2 giây; reduced motion hiển thị ngay.

## 8. Accessibility, semantics và metadata

- `html lang="vi"`; title và description nói rõ Đức Huy Education; favicon/OG metadata dùng asset thật.
- Có `<header>`, `<main>`, các `<section aria-labelledby>`, `<footer>` và heading hierarchy không nhảy cấp.
- Icon-only controls có accessible name; decorative icons `aria-hidden="true"`.
- Tab order theo visual order; không có hidden focusable item; link ngoài có tín hiệu phù hợp.

## 9. Responsive behavior

- **390 px:** header gọn một hàng; hero không crop mất chủ thể; không horizontal overflow; CTA không chồng; course list cuộn snap hoặc stack có dấu hiệu rõ; footer không bị floating controls che.
- **768 px:** outer margins hai bên bằng nhau; không có paragraph dài hơn 75 ký tự/dòng.
- **1440 px:** hero media chiếm khoảng 45–55% first viewport nhưng title/CTA vẫn là focal point; không section nào hồ dón một bên và bỏ trống nửa còn lại.

## 10. Acceptance criteria

- Production build thành công.
- `lint.mjs` không còn FAIL; mọi WARN còn lại có lý do được ghi rõ.
- `inspect.mjs` trên production preview đạt 0 FAIL ở 1440/768/390 px.
- Không overflow ngang; không content clipping; H1 và mọi section heading tối đa 2 dòng.
- Kiểm thử keyboard cho mobile menu, user menu, course controls, teacher controls và contact dialog.
- Các flow `/danh-muc-khoa-hoc`, `/lien-he`, `/login`, `/register`, logout vẫn hoạt động.
- Kiểm tra loading/error/empty/success cho course và teacher API.
- Mở và phê bình toàn bộ screenshot desktop/tablet/mobile; mục tiêu điểm sau redesign: design ≥7.5, usability ≥8, creativity ≥7, content ≥7 (overall ≥7.5).

## 11. Các nội dung cần chủ sở hữu xác nhận trước launch

- Cam là màu brand bắt buộc.
- Đối tượng học chính và lời hứa giá trị cụ thể của H1.
- Tính xác thực của 10+ năm, 5000+ học viên, 100+ khóa học, 95% hài lòng và “cam kết giới thiệu việc làm”.
- Ảnh lớp học, giảng viên, học viên hoặc sản phẩm thật có thể sử dụng.
- Hotline, website, email, địa chỉ và QR Zalo chính xác.

