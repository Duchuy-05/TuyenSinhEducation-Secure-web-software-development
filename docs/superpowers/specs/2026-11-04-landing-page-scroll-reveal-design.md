# Thiết kế hiệu ứng xuất hiện khi cuộn Landing Page

## Mục đích

Landing Page hiện hiển thị toàn bộ nội dung ngay khi tải. Thay đổi này giúp từng phần nội dung xuất hiện dần trong 2 giây khi người dùng cuộn đến, tạo cảm giác chuyển động nhưng vẫn giữ nội dung ổn định sau khi đã hiện.

## Mục tiêu

- Tạo component React `ScrollReveal` có thể tái sử dụng.
- Dùng `IntersectionObserver` để kích hoạt hiệu ứng khi phần nội dung đi vào vùng nhìn.
- Mỗi phần chỉ chạy hiệu ứng một lần và giữ nguyên trạng thái đã hiển thị.
- Hiệu ứng gồm mờ dần và trượt nhẹ từ dưới lên trong 2 giây.
- Tôn trọng thiết lập giảm chuyển động (`prefers-reduced-motion`) của người dùng.

## Phạm vi

Áp dụng cho `About`, `CourseAccordion`, `WhyChooseUs`, `Teachers`, `CTA` và `Footer`. `Navbar`, `Hero` và `FloatingContact` hiển thị ngay để nội dung đầu trang và chức năng điều hướng luôn sẵn sàng.

Không thay đổi nội dung, bố cục, dữ liệu hoặc hành vi bên trong các component hiện có.

## Các phương án đã cân nhắc

1. Thêm logic trực tiếp vào `LandingPage.tsx`: ít file hơn nhưng khó tái sử dụng và làm component trang chứa thêm logic hiệu ứng.
2. Tạo component `ScrollReveal` dùng chung: được chọn vì tách biệt logic, dễ đọc và có thể dùng lại ở trang khác.
3. Cài thư viện animation: linh hoạt hơn nhưng thêm dependency không cần thiết cho hiệu ứng đơn giản này.

## Thiết kế kỹ thuật

`ScrollReveal` bọc từng section và giữ một `ref` đến phần tử DOM. Khi `IntersectionObserver` phát hiện phần tử đi vào viewport, component chuyển sang trạng thái hiển thị và ngừng quan sát phần tử đó. CSS điều khiển `opacity` và `transform` với thời lượng 2 giây.

Nếu trình duyệt không hỗ trợ `IntersectionObserver`, nội dung sẽ được hiển thị ngay để tránh bị ẩn vĩnh viễn. Khi người dùng bật giảm chuyển động, nội dung cũng hiển thị ngay mà không chạy chuyển động kéo dài.

## Kiểm tra

- Build frontend thành công.
- Cuộn từ đầu đến cuối trang và xác nhận từng phần chạy đúng một lần.
- Cuộn ngược lên rồi xuống lại và xác nhận nội dung vẫn giữ nguyên.
- Kiểm tra chế độ giảm chuyển động và kích thước màn hình nhỏ.
