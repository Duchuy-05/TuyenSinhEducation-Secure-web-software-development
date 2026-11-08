# Landing Page Hash Scroll Design

## Intent

Khi người dùng đang ở một route khác và chọn “Lộ trình” hoặc “Giảng viên”, ứng dụng phải chuyển về landing page và cuộn tới đúng section chỉ với một lần nhấp.

## Goals

- Hỗ trợ trực tiếp các URL `/#learning-paths` và `/#teachers` sau khi React đã mount landing page.
- Cuộn mượt tới section tương ứng.
- Giữ nguyên cấu trúc link hiện tại trong navbar và footer.

## Non-goals

- Không thay đổi giao diện navbar, landing page hoặc các section.
- Không tạo hệ thống scroll restoration chung cho mọi route.
- Không thay đổi hành vi của hash không trỏ tới phần tử hiện có.

## Root Cause

Các link hiện dùng URL có hash, nhưng khi chuyển từ route khác, trình duyệt xử lý hash trước khi React Router render xong landing page. Phần tử đích chưa tồn tại ở thời điểm đó, nên lần nhấp đầu chỉ chuyển route và lần nhấp tiếp theo mới cuộn được.

## Approaches

1. **Xử lý hash trong `LandingPage` sau khi mount — được chọn.** Landing page là nơi biết chắc các section đã được render; giải pháp nhỏ, không thay đổi link và hỗ trợ cả URL được mở trực tiếp.
2. Bắt sự kiện click trong `Navbar`. Cách này không bao phủ footer, URL mở trực tiếp hoặc những link hash được thêm ở nơi khác.
3. Thêm scroll manager toàn cục. Tổng quát hơn nhưng quá lớn so với lỗi hiện tại.

## Design

`LandingPage` đọc `location.hash` bằng React Router. Trong effect chạy sau render, trang tìm section có ID tương ứng, đọc `aria-labelledby` của section rồi cuộn tới tiêu đề đó bằng `scrollIntoView({ behavior: 'smooth', block: 'start' })`. Tiêu đề có `scroll-margin-top` bằng chiều cao navbar cộng một khoảng thở nhỏ, nhờ đó tiêu đề nằm ngay dưới navbar thay vì bị khoảng đệm đầu section đẩy xuống thấp. Nếu hash trống, section không tồn tại hoặc không có tiêu đề hợp lệ thì không làm gì. Test trang landing khởi tạo router với cả hai URL hash và xác nhận đúng tiêu đề nhận lệnh cuộn.

Các link điều hướng nội bộ trong navbar dùng React Router `Link` thay vì thẻ `<a>` thuần. Điều này tránh full-page navigation và tránh cơ chế hash mặc định của trình duyệt cuộn lại tới mép section sau khi effect đã căn tiêu đề.

Khi landing page được mount từ route khác, `FeaturedCourses` phía trên hai section đích vẫn đang tải bất đồng bộ. `LandingPage` chờ callback “settled” của phần này trước khi cuộn tới `learning-paths` hoặc `teachers`. Callback phải chạy cho cả success, empty và error để việc cuộn không phụ thuộc kết quả API. Nhờ đó nội dung khóa học không thể nở chiều cao sau lệnh cuộn và đẩy tiêu đề xuống giữa viewport.

## Follow-up Root Cause

Lần sửa đầu đã xử lý thời điểm mount nhưng cuộn tới chính `<section>`. Các section có `padding-block: var(--section-gap)`, nên mép section nằm đúng vị trí trong khi tiêu đề vẫn cách navbar một khoảng rất lớn. Điểm cuộn đúng về mặt giao diện là tiêu đề được section tham chiếu qua `aria-labelledby`, không phải mép section.

Lần kiểm tra tiếp theo cho thấy vị trí vẫn dịch chuyển khi vào từ route khác: trạng thái skeleton của `FeaturedCourses` cao thấp hơn grid khóa học đã tải. Lệnh cuộn chạy trước khi API hoàn tất, sau đó phần nội dung phía trên thay đổi chiều cao và đẩy anchor xuống. Vì vậy điều kiện cuộn còn phải bao gồm trạng thái layout phía trên đã settled.

## Constraints

- Không thêm dependency.
- Không thay đổi các chỉnh sửa chưa commit trong `ContactPage.tsx` và `LandingPage.css`.
- Giữ nguyên các anchor `learning-paths` và `teachers`.
