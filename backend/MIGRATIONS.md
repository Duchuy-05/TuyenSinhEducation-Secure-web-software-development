# Hướng Dẫn Quản Lý Database Migration (TypeORM & MySQL)

Tài liệu này cung cấp hướng dẫn vận hành, triển khai và xử lý sự cố migration cơ sở dữ liệu cho hệ thống backend TrangTuyenSinhEdu.

---

## 1. Giới thiệu: Migration so với Synchronize

- **Cơ chế cũ (`synchronize: true`):**
  TypeORM tự động so sánh entity TypeScript với database lúc ứng dụng khởi động và trực tiếp thực thi các câu lệnh `ALTER TABLE` / `CREATE TABLE`. Cơ chế này **rất nguy hiểm trên production** vì:
  - Dễ vô tình làm mất cột, mất dữ liệu hoặc lock bảng lúc server khởi động.
  - Không lưu lại lịch sử thay đổi để theo dõi (audit) hoặc hoàn tác (rollback).
  - Không thể review mã SQL DDL trước khi áp dụng.

- **Cơ chế mới (Explicit Migrations):**
  - `synchronize: false` và `migrationsRun: false` hoàn toàn. Ứng dụng khi chạy chỉ đọc schema sẵn có, không tự thay đổi schema DB.
  - Mọi thay đổi schema được mô tả trong các file migration có dấu thời gian (timestamp) với hai phương thức rõ ràng: `up()` (áp dụng) và `down()` (hoàn tác).
  - Lịch sử thực thi được ghi nhận trong bảng `migrations` trên database.
  - Migration chỉ được thực thi thủ công hoặc qua CI/CD pipeline bằng câu lệnh chuyên biệt trước khi deploy app.

---

## 2. Cấu hình môi trường

TypeORM CLI và script migration nạp biến môi trường độc lập, chỉ yêu cầu URL kết nối database:

- `MYSQL_URL`: Chuỗi kết nối MySQL chuẩn (ví dụ: `mysql://user:password@localhost:3306/dbname`).
  - Được nạp từ `backend/.env` hoặc truyền trực tiếp qua biến môi trường shell.
  - Không yêu cầu các biến của dịch vụ bên thứ ba như `JWT_SECRET`, `PAYOS_CLIENT_ID`, v.v.
- `DB_TYPE` *(tùy chọn)*: Mặc định là `mysql`. Khi kết nối với MariaDB (ví dụ môi trường phát triển local XAMPP), cấu hình `DB_TYPE=mariadb` để TypeORM điều chỉnh cách đối chiếu metadata chính xác.
- `MIGRATION_TEST_MYSQL_URL`: Chuỗi kết nối database dùng riêng cho test tích hợp (bắt buộc tên database phải có hậu tố `_migration_test` để đảm bảo an toàn, ví dụ `trangtuyensinh_migration_test`).

---

## 3. Bảng tra cứu câu lệnh

Tất cả câu lệnh được thực thi trong thư mục `backend/`:

| Mục đích | Môi trường Source (TypeScript) | Môi trường Build / Production (JavaScript) |
|---|---|---|
| **Kiểm tra trạng thái migration** | `npm run migration:show` | `npm run migration:show:prod` |
| **Thực thi pending migrations** | `npm run migration:run` | `npm run migration:run:prod` |
| **Hoàn tác migration gần nhất** | `npm run migration:revert` | `npm run migration:revert:prod` |
| **Tự động sinh migration khi sửa entity** | `npm run migration:generate src/models/migrations/<TenMigration>` | *(Chỉ sinh trên source TS)* |
| **Kiểm tra tương thích schema baseline** | `npm run migration:check-baseline` | *(Chỉ đọc, kiểm tra an toàn schema)* |
| **Chạy toàn bộ test suite** | `npm test` | `npm test` |
| **Build TypeScript sang JavaScript** | `npm run build` | `npm run build` |

---

## 4. Quy trình áp dụng migration

### A. Đối với Database trống (Fresh Database / Môi trường mới)

1. Kiểm tra trạng thái các migration pending:
   ```bash
   npm run migration:show
   ```
2. Thực thi toàn bộ migration:
   ```bash
   npm run migration:run
   # hoặc trên production sau khi build:
   npm run migration:run:prod
   ```
3. Xác nhận lại toàn bộ migration đã được đánh dấu `[X]`:
   ```bash
   npm run migration:show
   ```

---

### B. Đối với Database ĐANG CÓ DỮ LIỆU (Baseline chuyển đổi)

Khi chuyển từ `synchronize` sang migrations trên database đã có dữ liệu, các bảng đã tồn tại sẵn. Chạy lại `migration:run` thông thường sẽ báo lỗi `Table already exists`. Quy trình chuyển đổi an toàn:

1. **Xác định database đích & Sao lưu (Backup):**
   - Tạo bản dump backup đầy đủ trước khi thực hiện:
     ```bash
     mysqldump -u <user> -p --routines --triggers --single-transaction <dbname> > backup_before_migration.sql
     ```
   - Thử nghiệm restore file backup trên một database thử nghiệm cục bộ để xác minh tính toàn vẹn của backup.
2. **Dừng các tác vụ ghi (Stop Writes / Maintenance Window):**
   - Tạm dừng ứng dụng hoặc chuyển sang chế độ bảo trì để ngăn chặn dữ liệu mới ghi vào DB trong quá trình kiểm tra.
3. **Kiểm tra schema baseline (`migration:check-baseline`):**
   - Chạy lệnh kiểm tra chỉ đọc:
     ```bash
     npm run migration:check-baseline
     ```
   - Lệnh này sử dụng Schema Builder để so sánh cấu trúc hiện tại của DB với metadata entity của hệ thống.
   - Chỉ dùng lệnh này khi `InitialSchema` là migration duy nhất được nạp; các phiên bản sau cần kiểm tra schema theo migration tương ứng.
   - Nếu output báo **SUCCESS**, TypeORM không phát hiện câu lệnh DDL cần thiết so với metadata entity hiện tại. Vẫn cần kiểm tra migration đang chờ và dữ liệu trước khi đánh dấu baseline.
4. **Đánh dấu migration baseline đã chạy mà không tạo lại bảng (`--fake`):**
   - **Lưu ý quan trọng:** Chỉ dùng cờ `--fake` khi `InitialSchema` là migration pending duy nhất và schema đã được `check-baseline` xác nhận khớp! Không chạy `--fake` nếu có nhiều migration pending khác.
   - Chạy lệnh:
     ```bash
     npx typeorm-ts-node-commonjs migration:run -d src/models/DataSource.ts --fake
     # Hoặc trên bản dist:
     node ./node_modules/typeorm/cli.js migration:run -d dist/models/DataSource.js --fake
     ```
5. **Kiểm tra hậu kiểm (Verification):**
   - Kiểm tra `migration:show` để đảm bảo baseline đã đánh dấu `[X]`.
   - Kiểm tra số lượng bản ghi trên các bảng trọng yếu (users, courses, registrations, orders, v.v.) để chắc chắn dữ liệu nguyên vẹn.

---

### C. Xử lý khi Schema hiện tại bị LỆCH (Schema Drift)

Nếu `migration:check-baseline` báo **FAILURE** và liệt kê các câu lệnh DDL khác biệt:
- **TUYỆT ĐỐI KHÔNG** bật lại `synchronize: true`.
- **TUYỆT ĐỐI KHÔNG** tự ý `DROP TABLE` hoặc sửa tay trực tiếp trên DB production.
- **Biện pháp chuẩn:**
  1. Đánh giá danh sách `Differences` do tool chỉ ra.
  2. Tạo một migration chuyển tiếp (transitional migration) riêng để đưa các cột/chỉ mục bị thiếu hoặc sai kiểu về đúng chuẩn của entity.
  3. Kiểm thử migration chuyển tiếp trên database staging/bản sao backup trước khi áp dụng vào production.

---

## 5. Quy trình thêm Migration mới khi thay đổi Entity

Mỗi khi bạn sửa đổi model hoặc thêm entity mới:

1. **Sửa đổi Entity:** Cập nhật code trong `src/models/entities/*.ts`.
2. **Sinh Migration:** Chạy lệnh generate:
   ```bash
   npm run migration:generate src/models/migrations/AddFeatureX
   ```
3. **Review code SQL:** Mở file migration vừa sinh ra trong `src/models/migrations/`, kiểm tra cẩn thận:
   - Kiểu dữ liệu, độ dài, `nullable`, giá trị `default`.
   - Các khóa ngoại (Foreign Keys), ràng buộc xóa `ON DELETE CASCADE` / `SET NULL`.
   - Hàm `down()` có thực sự hoàn tác đầy đủ (drop FK trước khi drop table/column).
4. **Build & Kiểm thử:**
   ```bash
   npm run build
   npm test
   ```
5. **Commit & Deploy:** Commit file migration cùng các entity tương ứng vào Git.

---

## 6. Lưu ý an toàn & Xử lý sự cố MySQL DDL

> [!WARNING]
> Trong MySQL/MariaDB, hầu hết các câu lệnh DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`) gây **implicit commit** ngay lập tức và **KHÔNG THỂ ROLLBACK** bằng database transaction khi gặp lỗi giữa chừng.

### Checklist xử lý sự cố MySQL DDL thất bại một phần:
1. **Không tự động retry:** Khi một migration bị lỗi giữa chừng (ví dụ: tạo được 3 bảng thì bảng thứ 4 lỗi khóa ngoại), TypeORM sẽ dừng lại và **KHÔNG** ghi nhận migration đó vào bảng `migrations`.
2. **Kiểm tra trạng thái thực tế:** Dùng `SHOW TABLES;` và `DESCRIBE <table_name>;` để xem chính xác những lệnh nào đã được MySQL áp dụng.
3. **Phục hồi schema:**
   - Dùng script sửa lỗi có chủ đích (forward fix) hoặc thủ công hoàn tác các bảng/cột đã tạo dở dang trước khi chạy lại.
   - Không giả định lệnh `down()` có thể tự dọn dẹp một migration chạy dở.
   - Nếu ở production: restore lại bản backup chụp trước khi chạy migration là giải pháp an toàn nhất.
4. **Lệnh `revert`:** Lệnh `migration:revert` sẽ xóa toàn bộ bảng và dữ liệu của migration đó. Chỉ dùng `revert` trên môi trường dev/test hoặc khi migration mới sinh chưa chứa dữ liệu thật.
