# Thiết kế Navbar thu gọn

## Mục đích

Làm thanh điều hướng của landing page gọn, nhẹ và có phản hồi trực quan rõ ràng hơn, nhưng vẫn giữ nguyên toàn bộ route, trạng thái đăng nhập, menu mobile, quản lý focus và vùng chạm hiện có.

## Mục tiêu

- Giảm chiều cao và cỡ chữ cảm nhận của header.
- Làm các hành động chính/phụ nhất quán bằng button bo tròn hoàn toàn.
- Cho các mục điều hướng phản hồi hover/focus tinh tế nhưng dễ nhận biết.
- Khi người dùng cuộn, header cố định vẫn dễ đọc mà không trở thành một mảng nền trắng đặc.

## Ngoài phạm vi

- Không đổi route, nhãn, logic xác thực, cấu trúc menu hoặc hành vi menu mobile.
- Không thu header thêm khi cuộn, không thay CTA bằng icon, không thêm gradient hay dependency mới.

## Các hướng đã cân nhắc

1. **Header thu gọn ổn định — được chọn.** Chiều cao giữ cố định, giảm kích thước ban đầu và chỉ đổi cách hiển thị bề mặt khi người dùng cuộn. Hướng này tránh làm thay đổi bố cục hoặc khiến vùng bấm bị di chuyển.
2. **Header co lại khi cuộn.** Header và control thu nhỏ dần khi cuộn. Không chọn vì làm layout thay đổi và các vùng thao tác bị dịch chuyển.

## Thiết kế được chọn

### Bố cục và chữ

- Header desktop cao 64px; mobile cao 56px.
- Logo, các mục điều hướng và control tài khoản giữ nguyên thứ tự hiện tại.
- Logo và nhãn điều hướng dùng font sans-serif hiện có, với cỡ chữ vừa phải để phù hợp header thấp hơn.
- Các vùng thao tác quan trọng vẫn có kích thước tối thiểu 44px khi phù hợp.

### Button và control

- CTA chính, nút Đăng ký, avatar tài khoản và nút mở menu mobile dùng cùng kiểu bo tròn hoàn toàn (`border-radius: 999px`).
- Đăng nhập vẫn là text link, không có trọng số thị giác ngang với CTA chính.

### Phản hồi của link

- Các link điều hướng desktop có đường gạch chân 1px khi hover hoặc focus bằng bàn phím.
- Đường gạch chân xuất hiện bằng `transform`/`opacity`; khi focus, nó luôn hiển thị rõ.
- Với `prefers-reduced-motion`, bỏ chuyển động nhưng vẫn hiển thị underline.

### Bề mặt khi cuộn

- Trước khi cuộn: giữ nền sáng đặc như hiện tại để tạo ấn tượng đầu trang rõ ràng.
- Sau ngưỡng cuộn nhỏ, khoảng 8px: chuyển sang nền trắng trong suốt nhẹ (khoảng 88–92%) kèm `backdrop-filter: blur(...)`, nhưng vẫn bảo đảm tương phản chữ.
- Không thay đổi chiều cao, bố cục hay vị trí vùng bấm trong quá trình chuyển trạng thái.
- Event listener cuộn là passive và được gỡ khi component unmount.

## Tiêu chí nghiệm thu

- Các test Navbar hiện có tiếp tục chạy xanh; bổ sung test cho class trạng thái đã cuộn và semantic nav.
- Header không che, tràn hoặc cắt button ở 390px, 768px và 1440px.
- Hover và `:focus-visible` của từng link desktop đều hiển thị underline 1px.
- Người dùng reduced motion vẫn thấy bề mặt khi cuộn và underline mà không có chuyển động.
- Đăng nhập/đăng xuất, Escape/focus trap của menu mobile và các route hiện có không bị ảnh hưởng.
