# Database migrations

Mục tiêu: quản lý phiên bản schema MySQL bằng TypeORM trong worktree riêng, giữ nguyên model và dữ liệu nghiệp vụ hiện tại.

## Phương án
- Chọn TypeORM migrations: tận dụng entity và dependency hiện có, có lịch sử up/down.
- Giữ synchronize: không có lịch sử thay đổi được review, không đáp ứng mục tiêu.
- Dùng công cụ migration khác: thêm dependency và hai nguồn cấu hình không cần thiết.

## Thiết kế
- Tắt synchronize và không tự chạy migration khi server khởi động.
- Cấu hình DataSource dùng được qua CLI, nạp biến môi trường và tìm migration đúng ở src/dist.
- Thêm lệnh generate, show, run, revert và migration khởi tạo cho 11 entity hiện tại.
- Database trống: chạy migration khởi tạo.
- Database có dữ liệu: đối chiếu schema với baseline trước khi ghi nhận baseline; không chạy lại CREATE TABLE hoặc tự động xóa dữ liệu.
- Viết hướng dẫn backup, triển khai, rollback và thêm migration khi đổi entity.
- Kiểm tra compile, CLI và vòng đời migration trên database thử nghiệm nếu môi trường cung cấp.

## Giới hạn
Không sửa quan hệ model hay nghiệp vụ trong lần chuyển đổi này. Không chạy DDL lên database hiện có khi chưa xác định database đích và tình trạng dữ liệu. MySQL DDL không đảm bảo rollback toàn bộ bằng transaction; down không thay thế backup.

## Cần xác định
Database đích đang trống hay có dữ liệu cần bảo toàn.
