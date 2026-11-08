# Thiết kế mục “Chọn lộ trình theo mục tiêu”

## Mục đích

Giúp người xem đọc và so sánh nhanh bốn lộ trình hiện có trên landing page. Mỗi lộ trình là một box thông tin; box không dẫn trang và không chọn trạng thái.

## Phạm vi và giới hạn

- Giữ nguyên bốn lộ trình và nội dung từ `landingContent.learningPaths`.
- Chỉ đổi cấu trúc hiển thị của `LearningPaths.tsx` và CSS liên quan trong `LandingPage.css`; không thay bộ chọn khóa học ở section khác.
- Bốn lộ trình là các lựa chọn độc lập, nên dùng danh sách không thứ tự thay cho `<ol>` hiện tại.
- Dùng màu và kiểu chữ sẵn có của landing page. Không thêm thư viện, ảnh, biểu tượng trang trí hoặc lời gọi hành động giả.

## Các hướng đã cân nhắc

1. **Lưới bốn box, được chọn:** bốn cột trên desktop để so sánh cùng lúc; hai cột trên tablet; trên điện thoại cuộn ngang từng box với một phần box kế tiếp lộ ra. Phù hợp yêu cầu xếp ngang và giữ chữ đủ rộng.
2. **Băng trượt ở mọi kích thước:** tạo chuyển động liên tục nhưng che bớt các lựa chọn trên desktop, gây khó so sánh.
3. **Danh sách dọc có đường nối:** thể hiện thứ tự học nhưng bốn mục hiện tại là các mục tiêu khác nhau, không phải bốn bước nối tiếp.

## Thiết kế được chọn

```text
Chọn lộ trình theo mục tiêu

┌ Bắt đầu lập trình ┐ ┌ Frontend ┐ ┌ Backend ┐ ┌ Thiết kế UI/UX ┐
│ Phù hợp với ai    │ │ ...      │ │ ...     │ │ ...            │
│ Học phần          │ │ ...      │ │ ...     │ │ ...            │
│ Kết quả đạt được  │ │ ...      │ │ ...     │ │ ...            │
└───────────────────┘ └──────────┘ └─────────┘ └────────────────┘
```

- Các box có chiều cao cân bằng, khoảng đệm đều, tiêu đề rõ và ba lớp thông tin theo cùng thứ tự: đầu vào, học phần, kết quả.
- Trạng thái mặc định đủ phân tách bằng nền hoặc đường viền nhẹ. Hover nhấc box một chút và làm rõ viền/màu nhấn; con trỏ giữ mặc định để không gợi ý rằng box có thể bấm.
- Chuyển động ngắn và tắt khi người dùng bật giảm chuyển động. Trên thiết bị cảm ứng, thông tin vẫn đầy đủ mà không cần hover.
- Desktop hiển thị bốn box một hàng; tablet hai cột; điện thoại cuộn ngang có `scroll-snap`, không làm tràn cả trang.

## Tiêu chí hoàn thành

- Cả bốn lộ trình đọc được và so sánh được ở 390, 768 và 1440 px; không cắt chữ hoặc tràn ngang trang.
- Hover làm nổi bật đúng box và không gây xê dịch bố cục.
- Nội dung và ngữ nghĩa danh sách được giữ đúng; box không có hành vi bấm hoặc trạng thái chọn.
- Kiểm tra trực quan ở ba kích thước và chạy các bước kiểm tra frontend hiện có có liên quan.

## Ghi chú với tài liệu trước

Đặc tả landing page trước đó đề xuất bố cục dạng chuỗi. Yêu cầu mới của chủ dự án chọn lưới bốn box để so sánh các mục tiêu độc lập; thiết kế này áp dụng cho riêng section lộ trình.
