# Solution Spec — Landing Page bán khóa học Đức Huy Education

## 1. Quyết định sản phẩm

Landing page sẽ được thiết kế như **cửa hàng khóa học trực tuyến**, không phải trang giới thiệu chung về trung tâm.

Trong 5 giây đầu, người xem phải trả lời được:

1. Website này bán gì?
2. Có khóa học nào phù hợp với mình?
3. Khóa học mang lại kết quả gì?
4. Giá, thời lượng, trình độ và giảng viên là ai?
5. Bước tiếp theo là xem chi tiết, mua/ghi danh hay nhận tư vấn?

Hành động chính: **khám phá và xem chi tiết khóa học**.  
Hành động phụ: **nhận tư vấn chọn khóa**.

## 2. Ý tưởng thiết kế chủ đạo

> Trên trang này, **mục tiêu nghề nghiệp của người học** trở thành **lộ trình dẫn đến khóa học phù hợp**.

Trang không dùng hình minh họa coding chung chung làm ý tưởng chính. Sản phẩm thật — tên khóa học, lộ trình, bài học, dự án, giảng viên, giá và kết quả — là chất liệu thị giác chính.

### Live thing: Bộ chọn khóa học nhanh

Ngay trong hero hoặc ngay sau hero có một control duy nhất:

**“Bạn muốn học để làm gì?”**

- Lựa chọn: Bắt đầu lập trình / Frontend / Backend / Thiết kế UI/UX.
- Khi chọn, trang scroll/focus đến nhóm khóa học tương ứng hoặc chuyển sang catalog với query parameter.
- Không yêu cầu đăng nhập, không chặn việc đọc trang.
- Hoạt động bằng keyboard và ngón tay; khi JavaScript lỗi vẫn có link đến catalog.

Live thing này thể hiện rõ website đang giúp người dùng **chọn sản phẩm học tập**, không chỉ đọc thông tin thương hiệu.

## 3. Thứ tự thông tin

Mỗi section phải đưa ra một claim và bằng chứng:

| Section | Claim | Bằng chứng trên giao diện |
|---|---|---|
| Hero | Có thể tìm được khóa học công nghệ phù hợp | Tên sản phẩm, giá trị, CTA catalog, bộ chọn nhanh |
| Khóa học nổi bật | Sản phẩm học tập có thể so sánh | Card có giá, trình độ, thời lượng, giảng viên, kết quả |
| Lộ trình theo mục tiêu | Người mới không cần tự nhớ thứ tự khóa học | Nhóm Beginner / Frontend / Backend / UI/UX với thứ tự rõ |
| Trải nghiệm học | Khóa học có nội dung và hoạt động thật | Preview syllabus, dự án, hình thức mentor, quyền truy cập |
| Giảng viên | Người dạy có chuyên môn liên quan | Ảnh, vai trò, kinh nghiệm, khóa đang dạy |
| Bằng chứng | Sản phẩm đáng tin | Số liệu được xác minh; không dùng vanity metrics chưa có nguồn |
| FAQ mua hàng | Gỡ rào cản trước quyết định | Giá, thanh toán, thời hạn truy cập, hoàn tiền, hỗ trợ, yêu cầu đầu vào |
| CTA cuối | Chọn khóa ngay hoặc nhận tư vấn | Hai hành động có phân cấp rõ |

Không giữ section nếu section đó không có claim hoặc bằng chứng.

## 4. Page blueprint

```text
┌─ Header: logo | Khóa học | Lộ trình | Giảng viên | FAQ | Tài khoản
│
├─ Hero
│  ├─ H1: Học kỹ năng công nghệ qua khóa học thực hành
│  ├─ Supporting copy
│  ├─ [Khám phá khóa học]  Nhận tư vấn
│  └─ Hình/sản phẩm thật: lesson + project + instructor
│
├─ Course finder: “Bạn muốn học để làm gì?”
│
├─ Khóa học nổi bật
│  ├─ Filter theo mục tiêu/trình độ
│  └─ Course product cards + xem tất cả
│
├─ Lộ trình học
│  └─ Một composition dạng sequence, không phải 3 card icon
│
├─ Bên trong một khóa học
│  └─ Syllabus preview + project output + mentor support
│
├─ Giảng viên
│
├─ Proof đã xác minh
│
├─ FAQ trước khi mua
│
├─ CTA: Chọn khóa phù hợp
│
└─ Footer
```

## 5. Giải pháp chi tiết theo component

### 5.1 `LandingPage.tsx`

- Dùng `<main>` bao phần nội dung chính; Navbar và Footer nằm ngoài.
- Mỗi section có `id`, heading và `aria-labelledby`.
- Sắp xếp lại: Hero → Course finder → Courses → Learning paths → Learning experience → Teachers → Proof/FAQ → CTA.
- `ScrollReveal` chỉ bọc các phần tử cần motion, không bọc nguyên Footer hay section dữ liệu.

### 5.2 `NavBar.tsx`

- Desktop navigation còn 4–5 link rõ nghĩa; bỏ CTA trùng nhau.
- Primary action: “Khóa học” hoặc “Khám phá khóa học”.
- Trạng thái chưa login: “Đăng nhập” là text link, “Đăng ký” là secondary action; không có ba nút cam cùng cấp.
- Mobile: logo + menu button. Menu mở bằng click/keyboard, khóa scroll nền, Escape để đóng, focus trap và return focus.
- User dropdown đổi từ hover-only `<div>` sang button có `aria-expanded`.

### 5.3 `Hero.tsx`

- Xóa auto carousel và indicator dots.
- Desktop dùng grid 12 cột: copy 5 cột, media 7 cột; mobile stack copy trước media.
- Chỉ có một H1, tối đa 2 dòng.
- Supporting sentence trả lời rõ khóa học gồm gì, học theo hình thức nào.
- Primary CTA tới `/danh-muc-khoa-hoc`; secondary text link tới `/lien-he`.
- Media không dùng banner generic. Ưu tiên montage thật gồm một lesson screen, project output và giảng viên; nếu chưa có, dùng một ảnh brand hiện có và ghi rõ cần thay.

Copy tạm để duyệt, không coi là claim cuối:

- H1: **Học kỹ năng công nghệ qua khóa học thực hành**
- Supporting: **Chọn lộ trình phù hợp, học qua dự án và nhận hỗ trợ từ giảng viên.**
- CTA: **Khám phá khóa học**

### 5.4 Course finder

- Component mới `CourseFinder` sử dụng segmented control hoặc select native-enhanced, không dùng bốn card icon.
- Dữ liệu option được map sang category/query hiện có.
- Sau khi chọn, nút “Xem khóa phù hợp” dẫn sang catalog có query; không tự chuyển trang khi user chỉ thay option.
- Trạng thái selected phân biệt bằng fill + text + semantic, không chỉ bằng màu.

### 5.5 `CourseAccordion.tsx`

- Đổi tên component thành `FeaturedCourses`; tên file và export khớp chức năng.
- Bỏ eyebrow pill “Khóa học nổi bật” và index `01/02/03`.
- Course card phải cho phép so sánh nhanh:
  - tên khóa;
  - mô tả kết quả một câu;
  - trình độ;
  - thời lượng hoặc số chương;
  - giảng viên;
  - giá/giá khuyến mãi nếu API có;
  - CTA “Xem khóa học”.
- Toàn card có thể là link, nhưng CTA vẫn phải có signifier rõ; không nested interactive controls.
- Desktop có thể dùng row 3 card; mobile ưu tiên horizontal snap có partial next-card cue hoặc stack 1 cột. Không ẩn mũi tên theo cách làm mất keyboard focus.
- Ảnh có `alt` từ course title; fallback là local asset.
- Loading skeleton giữ layout; error có retry; empty state dẫn đến catalog/liên hệ.

### 5.6 Learning paths thay `WhyChooseUs`

- Bỏ bốn card lời hứa chung chung.
- Dùng một sequence ngang desktop/dọc mobile, mô tả lộ trình thật theo course data.
- Mỗi path cho biết: đầu vào, thứ tự khóa, project đầu ra, thời lượng dự kiến.
- Không dùng số 01/02/03 như trang trí; nếu thứ tự quan trọng, dùng `<ol>` với tên bước thật.

### 5.7 Learning experience

- Section mới cho thấy bên trong khóa học thay vì chỉ nói “giáo trình thực tế”.
- Có một preview thật: syllabus, lesson title, assignment/project và cách giảng viên phản hồi.
- Nếu UI học viên hiện có được dùng làm preview, fragment phải dùng dữ liệu thật và gắn `data-ui`; không dùng fake dashboard thanh xám.

### 5.8 `Teachers.tsx`

- Đổi carousel tính cứng 3 item thành responsive list/grid hoặc carousel dựa trên `ResizeObserver`.
- Mỗi teacher hiển thị ảnh, tên, chức danh, kinh nghiệm liên quan và course đang dạy.
- Bỏ placeholder external; local neutral fallback nếu thiếu avatar.
- Loading/error/empty state dùng cùng state system với courses.
- Prev/next nếu có phải có `aria-label`, disabled state nhìn thấy nhưng không focusable.

### 5.9 Proof section

- Chỉ render 10+/5000+/100+/95% sau khi được xác minh.
- Nếu chưa xác minh, thay bằng proof có thể kiểm tra: số course published từ API, tổng lesson thật, hình thức hỗ trợ, course preview.
- Không dùng con số lớn chỉ để lấp khoảng trống.

### 5.10 FAQ mua hàng

- Accordion semantic bằng button, `aria-expanded`, `aria-controls`.
- Câu hỏi ưu tiên: học phí, thanh toán, thời hạn truy cập, hoàn tiền, hỗ trợ giảng viên, yêu cầu đầu vào, chứng chỉ.
- Không bịa policy; mục chưa có câu trả lời phải được chủ sở hữu cung cấp.

### 5.11 `CTA.tsx`

- Headline ngắn: “Chọn khóa học phù hợp”.
- Primary `Link`: `/danh-muc-khoa-hoc`.
- Secondary text link: `/lien-he`.
- Không dùng hai button cùng visual weight; không dùng button không handler.

### 5.12 `Footer.tsx`

- Brand close lớn, tên nhất quán Đức Huy Education.
- Link khóa học lấy từ route/data thật hoặc trỏ đến catalog; không `href="#"`.
- Email dùng `mailto:`, phone dùng `tel:0926008221` sau khi xác minh.
- Bỏ hairline trang trí; dùng spacing và tone change để phân nhóm.

### 5.13 `FloatingContact.tsx`

- Mobile chỉ có một contact launcher; không hai icon luôn animation.
- Launcher mở dialog có focus trap, Escape, return focus, `role="dialog"`, `aria-modal` và labelled title.
- Dùng Lucide icons thay emoji.
- QR import từ local asset; không dùng chuỗi path runtime sai và không fallback tới placeholder external.
- Tôn trọ `prefers-reduced-motion`.

## 6. Visual system

### Màu

Cam hiện tại được giữ như dấu hiệu brand nếu chủ sở hữu xác nhận, nhưng phải đổi sang tông đủ contrast.

Vai trò token:

- `--color-ground`: nền chính sáng trung tính.
- `--color-surface`: tone step cho section/product card.
- `--color-ink`: text chính rất đậm.
- `--color-muted`: text phụ vẫn đạt 4.5:1.
- `--color-accent`: CTA và một điểm nhấn thứ hai tối đa.
- `--color-success`, `--color-error`: chỉ dùng cho trạng thái.

Không gradient, glass, glow hoặc terracotta phủ diện rộng.

### Typography

- Chọn một font display có hỗ trợ tiếng Việt và một font text, hoặc một variable family duy nhất.
- Tối đa 5 type token: display, h2, h3, body, small.
- H1 dùng `clamp()`, tracking âm nhẹ, line-height 0.95–1.05.
- Body 16–18 px, line-height 1.5–1.6, measure tối đa 60–65ch.
- Không uppercase letter-spacing cho eyebrow; không nhấn một từ bằng màu/italic trong headline.

### Spacing và frame

- Token: 4, 8, 16, 24, 40, 64, 96, 144 px.
- Outer margin: `clamp(16px, 3vw, 32px)`; mọi section dùng cùng frame.
- Section gap: 120–160 px desktop, 72–96 px mobile.
- Mỗi desktop screen có một dominant element; không hồ dón text sang nửa trái và bỏ trống nửa phải.

### Components

- Button: một primary fill, một text/secondary; corner style thống nhất.
- Product card dùng tone step và spacing, không shadow/1px outline lúc đứng yên.
- Chỉ card hóa course và teacher vì đây là các object có thể duyệt. Feature, stats, CTA và FAQ không bị đóng thành các card giống nhau.
- Icons dùng Lucide duy nhất; bỏ emoji và SVG icon tự chế trùng chức năng.

## 7. Imagery

Mục tiêu tối thiểu 4 hình ảnh/sản phẩm thật trên trang:

1. Hero: trải nghiệm học hoặc project output.
2. Course section: thumbnail riêng theo khóa.
3. Learning experience: lesson/project preview.
4. Teacher section: avatar giảng viên thật.

Nguyên tắc:

- Không coi banner minh họa ngôn ngữ lập trình là bằng chứng về chất lượng khóa học.
- Hình cùng tỷ lệ crop và treatment.
- Không dùng placeholder network.
- Ảnh tìm từ nguồn mở phải download local, ghi creator/licence/source trong Footer và report.

## 8. Motion

- Signature move: khi thay mục tiêu trong Course finder, nhóm course kết quả chuyển trạng thái bằng opacity + translate ngắn.
- Section entrance: heading, copy, media stagger 60–80 ms; không fade nguyên block trong 2 giây.
- Hover/press/focus cho mọi control, 180–250 ms.
- Không auto carousel.
- `prefers-reduced-motion` bỏ travel và hiện nội dung ngay.

## 9. Loading, empty và error states

Course và teacher dùng chung một state vocabulary:

- **Loading:** skeleton có kích thước gần với content; container có `aria-busy`.
- **Empty:** heading ngắn, lý do, CTA sang catalog hoặc contact.
- **Error:** giữ nguyên heading của section; thông báo thân thiện; nút “Thử lại”; không chỉ hiển thị text đỏ.
- **Partial data:** render item hợp lệ và bỏ qua item lỗi có logging, không làm sập cả section.

## 10. Responsive solution

### 390 px

- Header cao tối đa 64–72 px, logo một dòng, menu target ≥44 px.
- Hero copy xuất hiện trước media; H1 tối đa 2 dòng.
- CTA primary full-width khi cần; secondary là text link, không hai nút ngang bị ép.
- Product card chiếm 85–90% viewport nếu cuộn ngang, để lộ một phần card tiếp theo.
- Floating contact không che CTA/footer; chỉ một launcher.

### 768 px

- Dùng 6 hoặc 8-column layout; margins hai bên bằng nhau.
- Course card 2 cột hoặc horizontal snap.
- Teacher card 2 cột; không dùng công thức translate theo 3 item.

### 1440 px

- Hero split 5/7 hoặc 6/6 tùy direction sheet.
- Course row tối đa 3–4 item; không thu nhỏ text để nhét thêm card.
- Media chiếm ít nhất 40% hero, nhưng H1/CTA là focal point thương mại.

## 11. SEO và semantics

- `html lang="vi"`.
- Title dự kiến: `Khóa học công nghệ thực hành | Đức Huy Education`.
- Description mô tả danh mục khóa học và hình thức học, không dùng slogan rỗng.
- Một H1; mỗi section có H2; course title trong list là H3.
- Có `Course`/`ItemList` structured data chỉ khi dữ liệu thật đủ trường; không hardcode rating/review.

## 12. Thứ tự triển khai

1. Xác nhận content, claim, giá, asset và màu brand.
2. Chạy design direction cho sector education/e-commerce, giữ palette nếu cam là brand.
3. Thiết lập token và reset; sửa metadata.
4. Xây Header + Hero + Course finder ở 1440 và 390 px trước.
5. Xây product course section cùng loading/error/empty states.
6. Xây Learning paths, Learning experience, Teachers, Proof, FAQ, CTA, Footer.
7. Sửa modal contact và toàn bộ keyboard/focus behavior.
8. Thêm motion và reduced-motion sau khi static layout đã hoàn chỉnh.
9. Build, lint, inspect, mở screenshot 1440/768/390, fix tối đa ba vòng.

## 13. Tiêu chí nghiệm thu

- Người lạ xem first screen 5 giây có thể nói: đây là website bán khóa học công nghệ, có thể xem khóa hoặc nhận tư vấn.
- H1, CTA catalog và ít nhất một course/product cue hiển thị trong first viewport.
- Course card hiển thị đủ các trường so sánh cần thiết; không cần vào detail chỉ để biết giá/trình độ/thời lượng.
- Tất cả CTA dẫn đến route hoặc action thật.
- Mobile header, user menu, contact dialog, course controls và FAQ hoạt động hoàn toàn bằng keyboard.
- Không horizontal overflow, overlap hoặc content clipping ở 390/768/1440 px.
- WCAG AA cho text và focus states.
- `lint.mjs`: 0 FAIL; `inspect.mjs`: 0 FAIL trên production build.
- Không có gradient trang trí, eyebrow pill, index 01/02/03, emoji UI, shadow card đứng yên, glass panel hay placeholder network.
- Ít nhất 4 hình ảnh/product fragments thật, có alt text và credit nếu là asset bên ngoài.
- Mục tiêu critique: design ≥7.5, usability ≥8, creativity ≥7, content ≥7, overall ≥7.5.

## 14. Dữ liệu cần xác nhận trước khi code hoàn chỉnh

- Danh sách category và mục tiêu học thật cho Course finder.
- Giá, discount, trình độ, thời lượng và kết quả đầu ra của từng khóa.
- Chính sách truy cập, hoàn tiền, mentor, chứng chỉ và thanh toán.
- Claim 10+/5000+/100+/95% và “cam kết giới thiệu việc làm” (chính xác thông tin này).
- Ảnh/video thật của course, lesson, project, giảng viên và học viên (sẽ cung cấp sau).
- Cam là màu brand bắt buộc.

