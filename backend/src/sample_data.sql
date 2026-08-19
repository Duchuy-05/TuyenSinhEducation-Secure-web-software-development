-- ========================================
-- SAMPLE DATA FOR TRANG TUYỂN SINH
-- ========================================

-- ========================================
-- INSERT DATA INTO users TABLE
-- ========================================
INSERT INTO users (full_name, email, phone, password_hash, avatar_url, role, created_at, updated_at) VALUES
('Nguyễn Văn A', 'nguyena@gmail.com', '0912345678', '$2a$10$K7L9m.transactionhistory', NULL, 'student', NOW(), NOW()),
('Trần Thị B', 'tranthib@gmail.com', '0923456789', '$2a$10$K7L9m.transactionhistory', NULL, 'student', NOW(), NOW()),
('Lê Văn C', 'levanc@gmail.com', '0934567890', '$2a$10$K7L9m.transactionhistory', NULL, 'student', NOW(), NOW()),
('Phạm Thị D', 'phamthid@gmail.com', '0945678901', '$2a$10$K7L9m.transactionhistory', NULL, 'admin', NOW(), NOW());

-- ========================================
-- INSERT DATA INTO teachers TABLE
-- ========================================
INSERT INTO teachers (full_name, email, phone, title, experience, company, bio, avatar_url, created_at, updated_at) VALUES
('Dr. Hoàng Minh Tuấn', 'hoang.tuan@company.com', '0912111111', 'Ph.D', '10 years', 'Tech Company A', 'Chuyên gia về lập trình web và mobile', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888833/main-sample.png', NOW(), NOW()),
('Assoc. Prof. Đỗ Hồng Quân', 'do.quan@company.com', '0912222222', 'Tiến sĩ', '8 years', 'University B', 'Giảng viên về cơ sở dữ liệu', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888833/main-sample.png', NOW(), NOW()),
('Ths. Võ Thị Thanh Hương', 'vo.huong@company.com', '0912333333', 'Thạc sĩ', '5 years', 'Tech Company C', 'Chuyên gia UX/UI Design', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888833/main-sample.png', NOW(), NOW()),
('Mr. Nguyễn Đức Anh', 'nguyen.anh@company.com', '0912444444', 'Kỹ sư', '6 years', 'Tech Company D', 'Chuyên gia DevOps và Cloud', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888833/main-sample.png', NOW(), NOW());

-- ========================================
-- INSERT DATA INTO courses TABLE
-- ========================================
INSERT INTO courses (course_group_id, teacher_id, category, title, short_desc, target, image_url, duration, format, price, discount_price, status, created_at, updated_at) VALUES
('GROUP_01', 1, 'Web Development', 'Advanced ReactJS & TypeScript', 'Học React cấp nâng cao với TypeScript', 'Sinh viên CNTT, lập trình viên', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '8 weeks', 'online', 2999000, NULL, 'published', NOW(), NOW()),
('GROUP_02', 2, 'Database', 'SQL Optimization & Performance Tuning', 'Tối ưu hóa truy vấn SQL', 'DBA, Database Developer', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '6 weeks', 'hybrid', 1999000, NULL, 'published', NOW(), NOW()),
('GROUP_03', 3, 'Design', 'UI/UX Design Masterclass', 'Thiết kế giao diện người dùng chuyên nghiệp', 'Designer, Product Manager', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '10 weeks', 'offline', 3500000, NULL, 'published', NOW(), NOW()),
('GROUP_04', 4, 'DevOps', 'Kubernetes & Docker Essentials', 'Container orchestration và deployment', 'DevOps Engineer, Backend Developer', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '8 weeks', 'online', 2500000, NULL, 'draft', NOW(), NOW()),
('GROUP_05', 1, 'Web Development', 'Node.js Backend Development', 'Xây dựng backend với Node.js', 'Lập trình viên JavaScript', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '12 weeks', 'hybrid', 3999000, NULL, 'published', NOW(), NOW());

('GROUP_06', 1, 'Lập trình C/C++', 'C++ Cơ bản đến Nâng cao', 'Chinh phục tư duy thuật toán và cấu trúc dữ liệu', 'Học sinh, Sinh viên CNTT', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '10 weeks', 'online', 1500000, NULL, 'published', NOW(), NOW()),
('GROUP_07', 2, 'Lập trình Python', 'Cày nát thuật toán Python', 'Tối ưu mã nguồn và giải các bài toán kinh điển', 'Học sinh thi HSG, sinh viên', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '8 weeks', 'online', 1800000, 1500000, 'published', NOW(), NOW()),
-- 2. DANH MỤC: Ôn thi Tin học trẻ
('GROUP_08', 3, 'Ôn thi Tin học trẻ', 'Luyện thi Tin học trẻ - Bảng A (Tiểu học)', 'Tư duy lập trình Scratch và Python cơ bản', 'Học sinh Tiểu học', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '12 weeks', 'hybrid', 2200000, NULL, 'published', NOW(), NOW()),
('GROUP_09', 3, 'Ôn thi Tin học trẻ', 'Bồi dưỡng Tin học trẻ - Bảng B (THCS)', 'Giải đề Pascal/C++/Python nâng cao', 'Học sinh THCS', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '16 weeks', 'offline', 2800000, 2500000, 'published', NOW(), NOW()),
-- 3. DANH MỤC: Ôn thi đại học
('GROUP_10', 4, 'Ôn thi đại học', 'Luyện Đề Đánh Giá Tư Duy (TSA) - Bách Khoa', 'Trọn bộ phương pháp toán, đọc hiểu và khoa học', 'Học sinh lớp 12', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '15 weeks', 'online', 2500000, NULL, 'published', NOW(), NOW()),
('GROUP_11', 4, 'Ôn thi đại học', 'Bứt phá điểm số HSA - ĐHQG Hà Nội', 'Định lượng, định tính giải nhanh đề thi ĐGNL', 'Học sinh lớp 11, 12', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '15 weeks', 'hybrid', 2400000, 2000000, 'published', NOW(), NOW()),
('GROUP_12', 1, 'Ôn thi đại học', 'Tổng ôn Nền tảng Tốt nghiệp THPT', 'Chống liệt và lấy chắc 8 điểm các môn khối A', 'Học sinh lớp 12 mất gốc', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '20 weeks', 'online', 1900000, NULL, 'draft', NOW(), NOW()),
-- 4. DANH MỤC: Lớp 6 - Lớp 9
('GROUP_13', 2, 'Lớp 6 - Lớp 9', 'Toán học 9 - Chinh phục điểm 10 thi vào 10', 'Hệ thống hóa toàn bộ kiến thức đại số, hình học', 'Học sinh lớp 9', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '24 weeks', 'offline', 1200000, NULL, 'published', NOW(), NOW()),
('GROUP_14', 2, 'Lớp 6 - Lớp 9', 'Ngữ Văn 8 - Bí quyết viết văn nghị luận', 'Phân tích tác phẩm và nghị luận xã hội sâu sắc', 'Học sinh lớp 8', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '16 weeks', 'online', 1100000, 900000, 'published', NOW(), NOW()),
('GROUP_15', 3, 'Lớp 6 - Lớp 9', 'Tiếng Anh 6 - Bám sát Global Success', 'Ngữ pháp, từ vựng và giao tiếp cơ bản', 'Học sinh lớp 6', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '12 weeks', 'online', 950000, NULL, 'published', NOW(), NOW()),
-- 5. DANH MỤC: Lớp 10 - Lớp 12
('GROUP_16', 4, 'Lớp 10 - Lớp 12', 'Vật Lý 11 - Nền tảng Điện học và Quang học', 'Bản chất vật lý sinh động, bài tập chia dạng', 'Học sinh lớp 11', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '16 weeks', 'hybrid', 1300000, NULL, 'published', NOW(), NOW()),
('GROUP_17', 1, 'Lớp 10 - Lớp 12', 'Hóa Học 12 - Trọn gói Hóa Hữu Cơ', 'Tư duy giải nhanh đồ thị, peptit, este', 'Học sinh lớp 12', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '18 weeks', 'online', 1400000, 1200000, 'published', NOW(), NOW()),
('GROUP_18', 3, 'Lớp 10 - Lớp 12', 'Sinh Học 10 - Trọng tâm Sinh học tế bào', 'Khám phá thế giới vi mô và di truyền học', 'Học sinh lớp 10', 'https://res.cloudinary.com/dirjsggep/image/upload/v1780888831/cld-sample-2.jpg', '12 weeks', 'offline', 1150000, NULL, 'draft', NOW(), NOW());

-- ========================================
-- INSERT DATA INTO course_syllabus TABLE
-- ========================================
INSERT INTO course_syllabus (course_id, order_index, title, description) VALUES
(1, 1, 'React Basics & Components', 'Giới thiệu React, JSX, Components, Props, State'),
(1, 2, 'Hooks & State Management', 'useState, useEffect, useContext, Custom Hooks'),
(1, 3, 'TypeScript Advanced', 'Generic types, Interfaces, Decorators'),
(1, 4, 'Project Building', 'Xây dựng dự án thực tế'),

(2, 1, 'SQL Query Fundamentals', 'SELECT, WHERE, JOIN, GROUP BY'),
(2, 2, 'Indexing Strategy', 'Tạo index, Query Plan, Performance Monitoring'),
(2, 3, 'Advanced Query Optimization', 'Subqueries, CTEs, Window Functions'),

(3, 1, 'Design Principles', 'Color Theory, Typography, Layout'),
(3, 2, 'Prototyping Tools', 'Figma, Adobe XD, Sketch'),
(3, 3, 'User Research & Testing', 'Usability Testing, A/B Testing'),
(3, 4, 'Real Project', 'Design cho dự án thực tế'),

(4, 1, 'Docker Basics', 'Containerization, Dockerfile, Images'),
(4, 2, 'Kubernetes Introduction', 'Pods, Services, Deployments'),
(4, 3, 'CI/CD Pipeline', 'GitHub Actions, GitLab CI'),

(5, 1, 'Node.js Fundamentals', 'Event Loop, Modules, NPM'),
(5, 2, 'Express.js Framework', 'Routing, Middleware, Error Handling'),
(5, 3, 'Database Integration', 'MongoDB, PostgreSQL connection'),
(5, 4, 'Authentication & Security', 'JWT, OAuth, Security Best Practices'),
(5, 5, 'API Development', 'RESTful API, GraphQL basics');

-- ========================================
-- INSERT DATA INTO registrations TABLE
-- ========================================
INSERT INTO registrations (user_id, course_id, contact_name, contact_email, contact_phone, note, status, handled_by, registered_at, contacted_at) VALUES
(1, '1', 'Nguyễn Văn A', 'nguyena@gmail.com', '0912345678', 'Quan tâm về React advanced', 'confirmed', 'admin1', NOW(), NOW()),
(2, '1', 'Trần Thị B', 'tranthib@gmail.com', '0923456789', NULL, 'pending', NULL, NOW(), NULL),
(3, '2', 'Lê Văn C', 'levanc@gmail.com', '0934567890', 'Muốn học SQL optimization', 'contacted', 'admin1', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, '3', 'Nguyễn Văn A', 'nguyena@gmail.com', '0912345678', 'Thích UI/UX Design', 'confirmed', 'admin2', NOW(), NOW()),
(2, '5', 'Trần Thị B', 'tranthib@gmail.com', '0923456789', 'Học Node.js backend', 'pending', NULL, NOW(), NULL),
(3, '4', 'Lê Văn C', 'levanc@gmail.com', '0934567890', NULL, 'confirmed', 'admin1', NOW(), NOW()),
(NULL, '1', 'Phạm Văn E', 'phamvane@gmail.com', '0956789012', 'Khách hàng mới', 'pending', NULL, NOW(), NULL),
(1, '2', 'Nguyễn Văn A', 'nguyena@gmail.com', '0912345678', 'Cập nhật thông tin', 'confirmed', 'admin2', NOW(), NOW()),
(2, '3', 'Trần Thị B', 'tranthib@gmail.com', '0923456789', 'Rất quan tâm khóa này', 'contacted', 'admin1', NOW(), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(NULL, '5', 'Hoàng Thị F', 'hoangthif@gmail.com', '0967890123', NULL, 'cancelled', 'admin2', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL);

-- ========================================
-- NOTES:
-- ========================================
-- 1. Thay thế password_hash bằng hash thực tế (sử dụng bcrypt)
-- 2. Thay thế NOW() bằng timestamp cụ thể nếu cần
-- 3. Kiểm tra lại các khóa ngoài (foreign keys) trước khi INSERT
-- 4. Thực hiện các câu lệnh tuần tự theo thứ tự phụ thuộc
-- 5. Registrations: user_id có thể NULL (khách hàng chưa đăng ký tài khoản), course_id tham chiếu đến course table
-- 6. Status có các giá trị: pending, contacted, confirmed, cancelled
