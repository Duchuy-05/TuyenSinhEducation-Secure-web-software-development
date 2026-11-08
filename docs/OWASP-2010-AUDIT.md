# Rà soát OWASP Top 10:2010 — Duc Huy Education

Ngày cập nhật: 2026-11-07. Baseline rà soát ban đầu: `2291c02`; phần Injection được cập nhật trên checkout chính. Báo cáo kiểm tra tĩnh frontend/backend, router → controller → service, xác thực, dữ liệu trả về, render HTML, client API và cấu hình. Chưa chạy pentest, kiểm tra TLS production hoặc audit dependency. Không coi kết quả tìm kiếm không có bằng chứng là chứng minh không có lỗ hổng.

## Tiến độ hiện tại: 45% theo checklist triển khai

Mỗi nhóm có 4 tiêu chí đồng trọng số: `[x]` có bằng chứng code, `[ ]` thiếu/chưa đầy đủ/chưa xác minh. Tổng 18/40 = 45%. Tiêu chí đã tích vẫn cần regression test; không có nhóm nào được chứng nhận hoàn tất. Khi có bằng chứng mới cần cập nhật checklist và tính lại số điểm, không ước lượng tùy ý.

| Nhóm 2010 | Tiêu chí có bằng chứng | Tiến độ |
|---|---:|---:|
| Injection | 3/4 | 75% |
| Cross-Site Scripting | 3/4 | 75% |
| Broken Authentication and Session Management | 2/4 | 50% |
| Insecure Direct Object References | 2/4 | 50% |
| Cross-Site Request Forgery | 0/4 | 0% |
| Security Misconfiguration | 2/4 | 50% |
| Insecure Cryptographic Storage | 1/4 | 25% |
| Failure to Restrict URL Access | 2/4 | 50% |
| Insufficient Transport Layer Protection | 1/4 | 25% |
| Unvalidated Redirects and Forwards | 2/4 | 50% |

## Injection

- [x] Các truy vấn khóa học kiểm tra dùng tham số TypeORM (`backend/src/services/CourseService.js`, `CourseServiceGV.js`).
- [ ] Đã kiểm tra ID số nguyên dương, pagination tối đa 100, payload object và giới hạn body 100 KB. Vẫn cần chuẩn hóa enum, độ dài chuỗi và schema nghiệp vụ cho toàn bộ API.
- [x] Bulk schedule dùng allowlist `sessionTitle`, `startTime`, `endTime`, `location`; client không thể chèn `id`, `classId`, `teacherId` hoặc `status`. Danh sách bulk giới hạn 1–100 phần tử.
- [x] Có regression test cho SQL-like ID, object thay scalar, prototype pollution, `$where`, pagination quá lớn và field mass-assignment (`backend/src/security/inputValidation.test.js`).

## XSS

- [x] `backend/src/services/PostService.ts` sanitize nội dung bài viết khi tạo/cập nhật.
- [x] `frontend/src/pages/Post/PostDetail.tsx` sanitize trước `dangerouslySetInnerHTML`.
- [x] Nội dung text thông thường render bằng JSX được React escape.
- [ ] Test stored/reflected/DOM XSS và kiểm soát URL media/course blocks; xác minh CSP trên HTML frontend. Helmet ở API không tự bảo vệ HTML do frontend host khác phục vụ.

## Authentication và session

- [x] JWT có hạn: access 15 phút, refresh 7 ngày; cookie `httpOnly` (`AuthControllers.ts`, `AuthService.ts`).
- [x] Đăng nhập kiểm tra bcrypt và trạng thái xác minh; backend có verify JWT (`auth.middleware.ts`).
- [ ] Rate limit đăng nhập/OTP/đăng ký, OTP sinh bằng CSPRNG, giới hạn thử; hiện OTP dùng `Math.random()`. Chính sách đăng ký và đổi mật khẩu chưa thống nhất.
- [ ] Thu hồi session khi logout/đổi mật khẩu và refresh rotation; hiện logout chỉ xóa cookie, refresh token cũ vẫn có thể dùng. Cần kiểm tra claim, thuật toán và trạng thái tài khoản; Google linking cần xác minh email/audience phù hợp luồng OAuth.

## IDOR

- [x] Draft khóa học được scope theo teacher; controller kiểm tra role (`CourseController.getTeacherProfile`, `CourseServiceGV.getDraft`). Không kết luận thiếu role chỉ vì router dùng mỗi verifyToken.
- [x] Enrollment có ownership lớp; sửa/xóa lịch và thông báo có ownership; đơn hàng kiểm tra userId hoặc admin (`ClassEnrollmentService`, `ScheduleService`, `AnnouncementService`, `PaymentService`).
- [ ] Read lịch theo classId/id phải kiểm tra thành viên lớp/chủ lớp. `ScheduleController.getByClassId/getById` không truyền danh tính tới service. Thông báo theo lớp/id hiện public (`announcement.router.ts`).
- [ ] Khi tạo thông báo cần xác nhận quyền trên classId; `AnnouncementController.create` gắn teacherId từ server nhưng `AnnouncementService.create` chưa kiểm tra quyền lớp. Test chéo hai học viên/hai giảng viên và admin.

## CSRF

- [ ] So khớp origin chính xác bằng URL.origin: `checkOrigin.middleware.ts` dùng startsWith, có thể chấp nhận hostname thêm hậu tố.
- [ ] Bảo vệ toàn bộ request thay đổi trạng thái; hiện chỉ đổi mật khẩu và tạo link thanh toán gắn checkOrigin.
- [ ] Bảo vệ login/logout/refresh; refresh đang GET và cấp cookie mới. Cookie production `SameSite=None` cần cơ chế CSRF thích hợp; CORS không thay thế CSRF.
- [ ] Test origin giả, thiếu header, form cross-site và refresh; webhook PayOS dùng xác minh chữ ký riêng, không áp dụng yêu cầu browser CSRF cho webhook.

## Cấu hình

- [x] Helmet và CORS allowlist trong `backend/src/index.ts`.
- [x] Có global error handler/404 và kiểm tra biến môi trường bắt buộc (`config/env.ts`).
- [ ] Checkout hiện vẫn `synchronize: true` ở `models/DataSource.ts`; cần tích hợp migration đã làm sau khi đối chiếu branch. Tách localhost khỏi allowlist production; secrets phải kiểm tra độ mạnh, không chỉ có giá trị.
- [ ] Cấu hình triển khai/kiểm thử bảo mật: Docker có password fallback cho dev; xác minh production không dùng fallback, hạn chế port DB, kiểm tra dependency và upload nội dung thực. Upload đã giới hạn 2 MB và định dạng Cloudinary, nhưng MIME client không phải bằng chứng nội dung an toàn.

## Lưu trữ mật mã

- [x] Mật khẩu được hash bcrypt cost 10 (`AuthService`, `UserService`).
- [ ] OTP chưa lưu dạng hash (`models/entities/User.ts`, `AuthService.ts`).
- [ ] Không trả passwordHash/OTP: User entity chưa `select:false`; `UserService.getAllUser/getUserById`, enrollment với relation user và `PaymentService.getOrderByCode` trả entity chứa user. Cần DTO allowlist và test response. Hash mật khẩu cũng là dữ liệu nhạy cảm.
- [ ] Xác minh quản lý/luân chuyển khóa, mã hóa backup/ổ đĩa và phân quyền DB. Chưa có bằng chứng vận hành để tích hoàn thành.

## Hạn chế URL

- [x] Các API admin users/teachers/registrations/posts dùng backend isAdmin; syllabus write dùng requireRoles.
- [x] Frontend `App.tsx` + `ProtectedRoute.tsx` có route theo vai trò.
- [ ] ProtectedRoute tin role trong localStorage chỉ là điều hướng UI; cần lấy trạng thái phiên từ server. Hoàn thiện phân loại public/private cho thông báo và lịch, xác thực ở backend cho mọi tài nguyên riêng.
- [ ] Test gọi API trực tiếp khi guest/student/teacher/admin, sửa role localStorage không được cấp quyền server.

## Bảo vệ đường truyền

- [x] Cookie production có Secure (`AuthControllers.ts`).
- [ ] Xác minh HTTPS và redirect HTTP trên frontend/API thực tế, cả reverse proxy.
- [ ] Xác minh HSTS trên host phục vụ HTML, certificate/TLS và mixed content; chỉ thấy Helmet ở backend chưa đủ.
- [ ] Validate URL production bắt buộc HTTPS và kiểm thử; `apiClient.ts` fallback HTTP localhost, `PaymentService.frontendUrl` cũng fallback HTTP. Cấu hình TLS kết nối DB chưa được xác minh.

## Redirect và forward

- [x] Redirect đăng nhập/role dùng các path cố định (`ProtectedRoute.tsx`, `services/apiClient.ts`).
- [x] PayOS returnUrl/cancelUrl được server dựng từ cấu hình, không lấy trực tiếp URL tùy ý từ request (`PaymentService.ts`).
- [ ] Validate scheme/host URL thanh toán trước khi lưu/hiển thị; `CourseDetailPage.tsx` dùng trực tiếp checkoutUrl từ API làm href. Đây là điểm cần hardening, chưa chứng minh người tấn công điều khiển được response PayOS.
- [ ] Test URL javascript:, protocol-relative, hostname gần giống và URL cấu hình sai; xác minh nguồn URL trước khi cho phép điều hướng.

## Thứ tự khắc phục và nghiệm thu

1. Ưu tiên cao: DTO loại secrets; đóng đọc thông báo/lịch trái quyền; kiểm tra classId khi tạo thông báo; sửa so sánh origin và bảo vệ CSRF toàn luồng.
2. Auth: hạn chế thử, OTP an toàn, thu hồi/rotation phiên, đồng bộ chính sách mật khẩu và Google account linking.
3. Validation/allowlist và XSS/URL, test endpoint chéo vai trò; tránh kết luận an toàn chỉ dựa middleware có tên phù hợp.
4. Tích hợp migration, cấu hình production, kiểm chứng TLS/CSP tại host thật; test regression frontend/backend.

Mỗi hạng mục chỉ đánh dấu hoàn thành sau khi có thay đổi code/config phù hợp và bằng chứng kiểm thử. Báo cáo này ghi baseline trước sửa, chưa triển khai các phần thiếu và chưa thay đổi database. Không cộng điểm migration ở worktree khác khi chưa có trong checkout được audit.
