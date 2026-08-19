# TrangTuyenSinhEdu — Hệ thống Website Tuyển sinh & Quản lý Đào tạo

> Nền tảng web full-stack cho trung tâm giáo dục: quảng bá khóa học, tuyển sinh học viên, và quản lý lớp học trực tuyến/offline theo 3 vai trò riêng biệt (Học viên – Giảng viên – Quản trị viên).

🔗 Repo: https://github.com/Duchuy-05/TuyenSinhEducation-Secure-web-software-development.git

---

## 1. Tổng quan

**DUC HUY EDUCATION** là hệ thống website tuyển sinh kết hợp LMS (Learning Management System) thu nhỏ, được xây dựng theo mô hình **client-server tách biệt (SPA + REST API)**. Dự án mô phỏng đầy đủ vòng đời của một trung tâm đào tạo trực tuyến: từ trang giới thiệu (landing page) thu hút học viên, đến quy trình đăng ký, giảng viên tạo khóa học bằng công cụ kéo-thả, mở lớp, quản lý lịch học, điểm danh và thông báo.

**Điểm nổi bật kỹ thuật:**
- Kiến trúc **phân lớp rõ ràng** (Router → Controller → Service → Entity) ở backend, dễ bảo trì và mở rộng.
- **Course Builder dạng kéo-thả (drag & drop)**: giảng viên tự thiết kế nội dung khóa học theo khối (block) mà không cần biết lập trình.
- **Phân quyền theo vai trò (RBAC)** với 3 luồng giao diện độc lập: Học viên / Giảng viên / Quản trị viên.
- Xác thực bằng **JWT + Google OAuth2**, xác minh email bằng OTP.
- Upload & lưu trữ ảnh qua **Cloudinary**.

---

## 2. Công nghệ sử dụng

### Backend
| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | TypeScript (Node.js) |
| Framework | Express 5 |
| ORM / Database | TypeORM + MySQL (mysql2) |
| Xác thực | JWT (jsonwebtoken), Google Auth Library, bcrypt |
| Upload ảnh | Multer + Cloudinary |
| Gửi email | Nodemailer (xác minh OTP, thông báo) |
| Khác | cookie-parser, cors, morgan (logging), uuid |

### Frontend
| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ / Thư viện UI | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Quản lý state | Zustand |
| Form | React Hook Form |
| Kéo-thả (Course Builder) | @hello-pangea/dnd |
| Soạn thảo nội dung | react-quill-new (rich text editor) |
| Đăng nhập Google | @react-oauth/google |
| UI/UX phụ trợ | lucide-react, react-icons, sweetalert2 |

---

## 3. Kiến trúc hệ thống

```
TrangTuyenSinhEdu/
├── backend/                      # REST API (Node.js + Express + TypeORM)
│   └── src/
│       ├── routers/              # Định nghĩa endpoint theo từng domain
│       ├── controllers/          # Xử lý request/response
│       ├── services/             # Business logic
│       ├── models/entities/      # Entity TypeORM (ánh xạ bảng DB)
│       ├── middlewares/          # Xác thực JWT, upload file
│       └── config/               # Cấu hình Cloudinary...
│
└── frontend/                     # Ứng dụng React SPA
    └── src/
        ├── components/           # Component dùng chung (Navbar, Hero, Footer...)
        ├── layouts/              # Layout khung theo vai trò (Student/Instructor)
        ├── pages/
        │   ├── admin/            # Trang quản trị
        │   ├── instructor/       # Trang giảng viên + Course Builder
        │   └── student/          # Trang học viên
        └── services/             # Gọi API (axios)
```

Frontend giao tiếp với Backend hoàn toàn qua **REST API** (`/api/...`), có cấu hình CORS + cookie credentials để hỗ trợ xác thực bằng cookie/JWT.

### Các module nghiệp vụ chính (Backend)
Hệ thống được chia theo domain, mỗi domain có đủ bộ Router – Controller – Service riêng:

- **Auth**: đăng ký, đăng nhập, đăng nhập Google, xác minh email OTP
- **Course** (Khóa học): CRUD khóa học, quy trình tạo bản nháp → kéo thả nội dung → xuất bản
- **CourseSyllabus**: giáo trình/chương trình học chi tiết
- **Class** (Lớp học): mở lớp học từ khóa học đã publish
- **ClassEnrollment**: học viên ghi danh vào lớp
- **Schedule**: lịch học của từng lớp
- **Registration**: đăng ký tuyển sinh từ học viên tiềm năng
- **Teacher / User**: hồ sơ giảng viên, quản lý người dùng
- **Announcement**: thông báo trong lớp học
- **Post**: bài viết/tin tức (blog tuyển sinh)

---

## 4. Mô tả các chức năng chính

### 4.1. Trang Landing Page (Trang chủ tuyển sinh)
Trang chủ được xây dựng dạng **một-trang-cuộn (one-page scroll)**, ghép từ các component độc lập, dễ tuỳ biến thứ tự và nội dung:

```
Navbar → Hero → About → CourseAccordion → WhyChooseUs → Teachers → CTA → Footer → FloatingContact
```

- **Navbar**: menu điều hướng, chuyển trang đăng nhập/đăng ký
- **Hero**: banner giới thiệu trung tâm, hình ảnh nổi bật
- **About**: giới thiệu về trung tâm/chương trình đào tạo
- **CourseAccordion**: danh sách khóa học nổi bật dạng accordion (mở rộng/thu gọn), lấy dữ liệu từ API `course`
- **WhyChooseUs**: lý do chọn trung tâm (điểm khác biệt, cam kết đầu ra...)
- **Teachers**: giới thiệu đội ngũ giảng viên
- **CTA (Call To Action)**: kêu gọi đăng ký/tư vấn
- **Footer**: thông tin liên hệ, mạng xã hội
- **FloatingContact**: nút liên hệ nhanh nổi (Zalo, Facebook, Hotline)

Landing page có route riêng cho từng khóa học đặc thù (VD: `/khoa-hoc/scratch-tu-duy`) và route động cho các khóa học còn lại (`/khoa-hoc/:id`), phục vụ SEO và tối ưu trải nghiệm quảng cáo/marketing.

### 4.2. Chức năng Tạo khóa học (Course Builder — dành cho Giảng viên)
Đây là tính năng kỹ thuật nổi bật nhất của hệ thống, mô phỏng quy trình soạn khóa học kiểu kéo-thả tương tự các nền tảng LMS thương mại:

**Quy trình 3 bước:**
- **Khởi tạo bản nháp (Draft)** — Giảng viên đặt tên khóa học, hệ thống tự tạo `courseGroupId` để nhóm các phiên bản (nháp/đã xuất bản) của cùng một khóa học.
- **Soạn nội dung bằng kéo-thả** — Giao diện `CourseEditorPage` cho phép giảng viên xây dựng cấu trúc khóa học theo khối nội dung (block) — văn bản, bài giảng, video... — kéo-thả sắp xếp thứ tự bằng thư viện `@hello-pangea/dnd`. Toàn bộ cấu trúc được lưu dưới dạng JSON (`courseData`, `blocks`) và tự động lưu tiến độ (`updateDraft`) trong lúc chỉnh sửa.
- **Xuất bản (Publish)** — Khi hoàn tất, giảng viên xuất bản để chuyển trạng thái khóa học từ `draft` → `published`, hiển thị công khai trên landing page cho học viên đăng ký.

**Thông tin khóa học quản lý được:** tên, mô tả ngắn, đối tượng học, ảnh đại diện (upload qua Cloudinary), thời lượng, số buổi học, tần suất học, hình thức (`online` / `offline` / `hybrid`), sĩ số lớp, giá và giá khuyến mãi.

Ngoài Course Builder, giảng viên còn có trang **Danh sách khóa học của tôi** (`InstructorCoursesPage`) và trang **quản lý học viên/lớp học** riêng.

### 4.3. Chức năng Lớp học (Class Management)
Sau khi khóa học được xuất bản, giảng viên/quản trị viên mở **lớp học cụ thể** gắn với khóa học đó:

- **Tạo lớp học** (`InstructorCreateClassPage`): đặt tên lớp, ngày khai giảng/kết thúc, sĩ số tối đa, gắn với khóa học và giảng viên phụ trách.
- **Trạng thái lớp**: `upcoming` (sắp khai giảng) → `ongoing` (đang học) → `completed` (đã kết thúc).
- **Lịch học (Schedule)**: mỗi lớp có thời khóa biểu riêng, học viên xem lịch học tại `StudentSchedulePage`.
- **Ghi danh (ClassEnrollment)**: học viên đăng ký/được xếp vào lớp; quản trị viên quản lý danh sách học viên theo lớp tại `AdminClassStudents`.
- **Thông báo lớp học (Announcement)**: giảng viên gửi thông báo đến học viên trong lớp; học viên xem tại `StudentAnnouncementsPage`.
- **Trao đổi với giảng viên**: học viên có thể liên hệ trực tiếp giảng viên phụ trách lớp (`StudentContactInstructor`).

### 4.4. Các nhóm chức năng khác theo vai trò

**Học viên (Student):**
- Xem khóa học đã đăng ký (`MyCoursesPage`), lịch sử đăng ký/đơn hàng (`StudentOrdersCourses`)
- Xem lớp học, lịch học, thông báo, cài đặt tài khoản cá nhân

**Giảng viên (Instructor):**
- Dashboard tổng quan số liệu khóa học/lớp học
- Quản lý khóa học (tạo/soạn/xuất bản), quản lý lớp học, quản lý học viên trong lớp

**Quản trị viên (Admin):**
- Quản lý toàn bộ khóa học, giảng viên, học viên đăng ký tuyển sinh
- Quản lý bài viết/tin tức (CreatePost/EditPost) phục vụ marketing SEO
- Quản lý danh sách lớp học & học viên theo lớp

Toàn bộ các khu vực trên đều được bảo vệ bởi **ProtectedRoute** (kiểm tra vai trò người dùng trước khi cho truy cập), đảm bảo học viên, giảng viên và quản trị viên chỉ thấy đúng phần chức năng của mình.

---

## 5. Cài đặt & chạy dự án

### Yêu cầu
- Node.js >= 18
- MySQL Server

### Backend
```bash
cd backend
npm install
# Tạo file .env với các biến: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, CLOUDINARY_*, EMAIL_*
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Mặc định frontend chạy tại `http://localhost:5173`, backend kết nối CORS cho phép origin này.

---

## 6. Định hướng phát triển
- Hoàn thành báo cáo
- Hoàn thiện thanh toán trực tuyến cho học viên
- Bổ sung hệ thống chấm bài/kiểm tra trong lớp học
- Tối ưu SEO cho landing page và trang khóa học
- Thống kê báo cáo cho quản trị viên (doanh thu, tỉ lệ chuyển đổi tuyển sinh)
- Tích hợp các cách bảo mật cho trang Web
