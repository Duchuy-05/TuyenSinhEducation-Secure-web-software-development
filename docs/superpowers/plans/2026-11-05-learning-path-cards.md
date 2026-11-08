# Kế hoạch triển khai box so sánh lộ trình học

> **Dành cho người triển khai:** Dùng kỹ năng `superpowers:subagent-driven-development` hoặc `superpowers:executing-plans` để thực hiện từng phần việc. Đánh dấu các bước bằng ô kiểm `- [ ]`.

**Mục tiêu:** Hiển thị bốn lộ trình học thành bốn box thông tin dễ đọc, xếp trên một hàng ở desktop, có hiệu ứng hover nhẹ và bố cục phù hợp các màn hình nhỏ hơn.

**Cách thực hiện:** Tiếp tục lấy dữ liệu từ `landingContent.learningPaths`. Chỉ sửa cấu trúc HTML trong component lộ trình và CSS dành cho mục này. Bộ chọn khóa học ở phần khác vẫn đảm nhiệm việc dẫn người xem tới danh mục khóa học.

**Công nghệ:** React 19, TypeScript, CSS, Vitest và Testing Library.

**Bản thiết kế:** `docs/superpowers/specs/2026-11-05-learning-path-cards-design.md`

## Yêu cầu chung

- Giữ nguyên dữ liệu và nội dung của cả bốn lộ trình trong `landingContent.learningPaths`.
- Box chỉ để đọc và so sánh: không có liên kết, nút bấm, trạng thái được chọn, con trỏ hình bàn tay hoặc thư viện mới.
- Desktop hiển thị bốn cột; tablet hiển thị hai cột; điện thoại cho cuộn ngang từng box, có thể nhìn thấy một phần box kế tiếp. Cả trang không bị tràn ngang.
- Hover có thể nhấc nhẹ và nhấn màu box nhưng không làm các box khác dịch chuyển. Trên màn hình cảm ứng, toàn bộ nội dung luôn hiện rõ. Tôn trọng cài đặt `prefers-reduced-motion: reduce`.
- Giữ nguyên các chỉnh sửa chưa commit của phần khác, đặc biệt trong `frontend/src/styles/LandingPage.css`. Dùng lại hệ màu và khoảng cách của landing page.

## Những điểm cần chú ý khi rà soát

- Tiêu đề hoặc tên học phần tiếng Việt dài phải xuống dòng trong box, không bị cắt ở 390, 768 và 1440 px.
- Trên điện thoại, chỉ dải box cuộn ngang; chiều rộng toàn trang không thay đổi.
- Người dùng cảm ứng và bàn phím đọc được mọi thông tin mà không cần hover; box không xuất hiện như một điểm điều khiển giả.
- Khi bật chế độ giảm chuyển động, hiệu ứng dịch chuyển và chuyển tiếp của hover được tắt hoặc rút xuống mức tối thiểu.
- Thay đổi CSS không làm hỏng card khóa học, card giảng viên hoặc các chỉnh sửa chưa commit trong landing page.

---

### Phần việc 1: Hiển thị và tạo kiểu cho bốn box lộ trình

**Tệp liên quan:**
- Sửa: `frontend/src/components/landing/LearningPaths.tsx`
- Sửa: `frontend/src/styles/LandingPage.css` — chỉ các quy tắc `.learning-paths` và phần đáp ứng màn hình của chúng
- Tạo bài kiểm tra: `frontend/src/components/landing/LearningPaths.test.tsx`

**Đầu vào và đầu ra:**
- Đầu vào: `landingContent.learningPaths` với các trường `id`, `title`, `entry`, `courses` và `outcome`.
- Đầu ra: component mặc định `LearningPaths()`; giữ nguyên ID của section và tiêu đề là `learning-paths` và `learning-paths-title`.

- [x] **Bước 1 — Viết bài kiểm tra ngữ nghĩa.** Render `LearningPaths`; kiểm tra section có một danh sách không thứ tự gồm bốn mục, mỗi mục hiển thị đủ tên, đối tượng phù hợp, học phần và kết quả. Kiểm tra section không chứa liên kết hoặc nút bấm.
- [x] **Bước 2 — Xác nhận bài kiểm tra thất bại với mã hiện tại.** Chạy `npm run test:run -- src/components/landing/LearningPaths.test.tsx` trong thư mục `frontend`; kết quả dự kiến: thất bại vì component hiện dùng danh sách có thứ tự.
- [x] **Bước 3 — Sửa `LearningPaths.tsx`.** Đổi `<ol>` thành `<ul>`, thêm class riêng cho danh sách và từng box. Sắp nội dung theo thứ tự: tên lộ trình, đối tượng phù hợp, học phần có nhãn, kết quả. Giữ nguyên nội dung gốc và `key={path.id}`; không thêm thành phần tương tác.
- [x] **Bước 4 — Sửa CSS đúng phạm vi.** Thay các quy tắc lộ trình cũ bằng lưới bốn cột `minmax(0, 1fr)` ở desktop, hai cột dưới 960 px và dải cuộn ngang có `scroll-snap` dưới 720 px. Đặt padding, nền, chữ và khoảng cách nhất quán. Hover chỉ đổi điểm nhấn và dịch nhẹ box, không đổi con trỏ. Thêm quy tắc giảm chuyển động vào media query hiện có hoặc quy tắc riêng cho mục này.
- [x] **Bước 5 — Chạy lại bài kiểm tra của component.** Chạy `npm run test:run -- src/components/landing/LearningPaths.test.tsx` trong `frontend`; kết quả dự kiến: thành công.
- [x] **Bước 6 — Kiểm tra frontend.** Chạy `npm run test:run`, `npm run lint` và `npm run build` trong `frontend`; cả ba lệnh cần trả mã 0. Nếu có lỗi sẵn có không liên quan, ghi riêng lỗi đó và xác nhận bài kiểm tra của component cùng bản build vẫn đạt.
- [x] **Bước 7 — Kiểm tra giao diện thực tế.** Xem trang ở 390, 768 và 1440 px; kiểm tra năm điểm trong mục “Những điểm cần chú ý khi rà soát”, hiệu ứng hover và chế độ giảm chuyển động. Nếu có lỗi, chỉ chỉnh các quy tắc của mục lộ trình.
- [x] **Bước 8 — Xem lại diff và commit đúng phần việc.** Stage `LearningPaths.tsx` và bài kiểm tra mới. Với `LandingPage.css`, chỉ stage phần thay đổi của mục lộ trình vì tệp này đang có chỉnh sửa khác. Xác nhận diff đã stage không chứa công việc khác, rồi commit với thông điệp `feat: present learning paths as comparison cards`.

## Tự rà soát kế hoạch

Component, CSS và kiểm tra được gộp vào một phần việc vì chúng cùng tạo ra một thay đổi giao diện có thể rà soát độc lập. Các bước trên bao phủ dữ liệu, ngữ nghĩa, bố cục đáp ứng màn hình, hover, giảm chuyển động và yêu cầu box không tương tác trong bản thiết kế. Không cần đổi dữ liệu, định tuyến hoặc thư viện.
