# Backend JavaScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển toàn bộ mã backend TypeScript sang JavaScript chạy trực tiếp trên Node.js, giữ nguyên API, schema/migration, dữ liệu và font.

**Architecture:** Giữ Express, TypeORM và MySQL. Dùng CommonJS rõ ràng; giữ các entity class JavaScript và định nghĩa mapping bằng `EntitySchema` có `target` là class đó. Chuyển ứng dụng, migration, test, scripts và Docker theo từng nhóm; chỉ gỡ công cụ TypeScript khi kiểm chứng cuối đạt.

**Tech Stack:** Node.js 22, JavaScript CommonJS, Express 5, TypeORM, MySQL 8.4, Node test runner, Docker Compose.

**Spec:** [Thiết kế chuyển backend sang JavaScript](../specs/2026-11-05-backend-javascript-migration-design.md)

## Global Constraints

- Chỉ chuyển backend; giữ nguyên frontend, CSS và font website. Giữ nguyên HTML và `font-family` trong `backend/src/utils/emailTemplates`.
- Giữ API contract, thông báo lỗi, xác thực, phân quyền, cookie/CORS, upload, email, PayOS.
- Giữ 11 bảng, toàn bộ cột/index/khóa ngoại/default/enum, tên `InitialSchema1793750400000`, SQL migration và bảng lịch sử `migrations`.
- `synchronize: false`, `migrationsRun: false`, `migrationsTransactionMode: "none"`; không thực hiện DDL trên DB thật trong việc chuyển mã.
- Giữ phiên bản package/runtime hiện tại; không nâng cấp thư viện cùng đợt. Dùng Node 22 trong Docker.
- DB tích hợp dành riêng cho test phải có tên kết thúc bằng `_migration_test`. Báo cáo rõ test nào skip.
- Tôn trọng thay đổi đang có của người dùng: `backend/MIGRATIONS.md` đã bị xóa, `docs/MIGRATIONS.md` là tệp mới; chỉnh tài liệu tại vị trí mới, không khôi phục tệp cũ.
- Mỗi nhóm chuyển đổi chỉ được coi là đã kiểm chứng khi có output lệnh tương ứng; toàn nhánh chỉ phát hành sau Task 7.

## Review Focus

1. **Schema hiện có chứa `nullable`, enum, tên cột tùy chỉnh:** test migration sau chuyển đổi phải cho `schemaBuilder.log().upQueries.length === 0` trên DB test.
2. **Database đã có lịch sử migration:** test/CLI phải thấy `InitialSchema1793750400000` đã hoàn thành, không chạy lại câu `CREATE TABLE`.
3. **Biến môi trường thiếu hoặc rỗng:** test config và startup phải giữ mã lỗi/thông báo hiện tại, không bắt đầu server với cấu hình sai.
4. **SDK phụ thuộc cách nạp module:** smoke test phải tải được các SDK thực sự được import và chạy được các luồng PayOS/Cloudinary/Google/email.
5. **Giá trị đầu vào sai và lỗi async:** test security/API phải giữ 400/401/403/404/500 cùng định dạng JSON và không lộ lỗi nội bộ.

---

## File map và ranh giới công việc

| Nhóm | Tệp hiện có cần chuyển/đổi | Vai trò |
|---|---|---|
| Mốc so sánh | `backend/package.json`, `backend/tests/*.test.ts`, `backend/src/config/env.validation.test.ts`, `backend/src/security/inputValidation.test.ts` | Ghi kết quả trước chuyển đổi; tạo cùng tập kiểm chứng sau chuyển đổi |
| Dữ liệu | `backend/src/models/entities/*.ts` (11), `backend/src/models/DataSource.ts`, `backend/src/models/migrations/1793750400000-InitialSchema.ts` | Class + EntitySchema, nguồn metadata, migration |
| Vận hành migration | `backend/scripts/check-migration-baseline.ts`, `backend/tests/{database-config,check-baseline,check-baseline.integration,migrations.integration,partial-migration.integration}.test.ts` | CLI, baseline và test DB |
| Nền ứng dụng | `backend/src/config/{env,database,cloudinary}.ts`, `backend/src/security/inputValidation.ts`, `backend/src/utils/{responseHandler,emailTemplates}.ts`, `backend/src/middlewares/*.ts` | Cấu hình, validation, middleware, email |
| Nghiệp vụ | `backend/src/services/*.ts` (14), `backend/src/controllers/*.ts` (13), `backend/src/routers/*.ts` (13), `backend/src/index.ts` | API và tích hợp |
| Chạy/đóng gói | `backend/package.json`, `backend/package-lock.json`, `backend/Dockerfile`, `backend/tsconfig.json`, `backend/src/types/multer-storage-cloudinary.d.ts`, `README.md`, `docs/MIGRATIONS.md` | Lệnh chạy, dependencies, Docker, tài liệu |

Các tệp `.ts` được chuyển sang `.js` tại cùng vị trí và tên cơ sở. `backend/src/sample_data.sql` giữ nguyên. Trong thời gian chuyển từng nhóm, checkout có thể tạm thời gồm cả TS/JS; không chạy deploy từ trạng thái trung gian.

### Task 1: Ghi mốc hành vi và kiểm tra CommonJS

**Files:** Read `backend/package.json`, `backend/src/index.ts`, `backend/src/models/**`, `backend/tests/**`; ghi kết quả vào ghi chú công việc của phiên triển khai, không sửa mã.

**Interfaces:** Produces danh sách lệnh/test đã chạy, các test skip/fail, danh sách SDK nạp được trong CommonJS, baseline metadata/schema; Task 2–7 dùng làm chuẩn so sánh.

- [ ] **Step 1: Chạy mốc kiểm chứng hiện tại.** Từ `backend/`: `npm test`, `npm run build`, `node -r ts-node/register src/config/env.validation.test.ts`, `node -r ts-node/register src/security/inputValidation.test.ts`; ghi exit code và tên test skip. Không tuyên bố migration đã kiểm tra nếu thiếu `MIGRATION_TEST_MYSQL_URL`.
- [ ] **Step 2: Trên DB `_migration_test`, ghi snapshot migration và schema.** Chạy test migration hiện tại và `migration:show`; lưu tên migration, số bảng, schema diff, trạng thái migration. Không dùng DB có dữ liệu thật.
- [ ] **Step 3: Kiểm tra module.** Trên Node 22, thử `require()` từng SDK thực sự được import (PayOS, Cloudinary, Google auth, Nodemailer, TypeORM, bcrypt, multer storage). Ghi lỗi cụ thể; nếu một SDK bắt buộc ESM, xử lý riêng và cập nhật spec/plan trước khi chuyển hàng loạt.

### Task 2: Chuyển class entity và mapping TypeORM

**Files:** Rename/modify `backend/src/models/entities/{User,Teacher,Course,CourseSyllabus,Registration,Post,Class,Schedule,ClassEnrollment,Announcement,Payment}.ts` → `.js`; create/modify `backend/tests/entity-metadata.test.js`.

**Interfaces:** Mỗi file export class cùng tên như cũ và schema tên `<ClassName>Schema` (`Payment.js` export `Order` và `OrderSchema`); `EntitySchema.options.target` là class đó. Các enum runtime export object cùng key/value. Task 3 đưa các schema vào `DataSource.entities`; Task 5 dùng class cho `new Entity()` và `getRepository(Entity)`.

- [ ] **Step 1: Viết test metadata trước.** Assert 11 class và schema được export; `schema.options.target === EntityClass`; `new User()` và `new Order()` dùng được; các enum như `UserRole.STUDENT === 'student'` giữ giá trị. Kiểm tra tên bảng và một tập đại diện cột `users.full_name`, `orders.order_code`, khóa ngoại/quan hệ.
- [ ] **Step 2: Chạy test để xác nhận fail do chưa có `.js`.** Run: `node --test tests/entity-metadata.test.js`. Expected: fail vì import hoặc export JS chưa tồn tại.
- [ ] **Step 3: Chuyển từng entity.** Giữ class rỗng hoặc logic class hiện có; định nghĩa `EntitySchema({ name, target, tableName, columns, relations, indices })` tường minh. Dùng function/lazy target cho quan hệ để tránh vòng import; không đổi tên thuộc tính và relation. Dùng TypeORM metadata từ bản TS và migration SQL để xác định từng thuộc tính.
- [ ] **Step 4: Chạy test mới.** Run: `node --test tests/entity-metadata.test.js`. Expected: pass 11 entity, class/enum/metadata đại diện.
- [ ] **Step 5: Review diff entity so với source TS, chỉ commit riêng khi nhóm kiểm chứng đạt.**

### Task 3: Chuyển DataSource, migration và kiểm tra database

**Files:** Rename/modify `backend/src/models/DataSource.ts`, `backend/src/models/migrations/1793750400000-InitialSchema.ts`, `backend/scripts/check-migration-baseline.ts`, `backend/tests/{database-config,check-baseline,check-baseline.integration,migrations.integration,partial-migration.integration}.test.ts` → `.js`; modify `backend/src/config/database.ts` → `.js` nếu Task 4 chưa chuyển.

**Interfaces:** `module.exports.AppDataSource`, `module.exports.loadDatabaseUrl`, `module.exports.checkMigrationBaseline(dataSource)` giữ cùng ý nghĩa; migration class giữ `name = 'InitialSchema1793750400000'`. Task 6 dùng `src/models/DataSource.js` cho CLI.

- [ ] **Step 1: Chuyển test DB và viết assertion trước.** Test `DataSource` load `.js` migration, `synchronize === false`, `migrationsRun === false`, đúng 11 target; `InitialSchema1793750400000` có trong danh sách. Test integration còn giữ guard `_migration_test` và kiểm tra up → no-op → down → up, sentinel record, schema diff bằng 0.
- [ ] **Step 2: Chạy test mới để thấy fail vì DataSource/migration JS chưa tồn tại.** Run: `node --test --test-concurrency=1 tests/database-config.test.js tests/migrations.integration.test.js`. Expected: fail do module cần chuyển; nếu test integration skip, ghi rõ trạng thái.
- [ ] **Step 3: Chuyển `DataSource`, migration, baseline script.** Giữ logic `MYSQL_URL`, `DB_TYPE`, flags, migration table, timestamp/name và nguyên văn câu SQL; đổi glob sang `src/models/migrations/*.js`. Bỏ `ts-node/register` trong subprocess test. Đảm bảo đường dẫn `.env` vẫn đúng khi chạy từ `backend/`.
- [ ] **Step 4: Chạy đủ test DB trên DB `_migration_test`.** Run: `node --test --test-concurrency=1 "tests/**/*.test.js"` từ `backend/`. Expected: mọi test DB chạy thật và pass, `schemaBuilder.log().upQueries.length === 0`; test skip không đạt cổng này.
- [ ] **Step 5: So sánh mốc Task 1.** Tên và số migration, bảng, cột/index/FK và SQL diff không đổi; nếu lệch, dừng để sửa mapping trước khi chuyển API.

### Task 4: Chuyển cấu hình, bảo vệ đầu vào, middleware và email

**Files:** Rename/modify `backend/src/config/{env,cloudinary}.ts`, `backend/src/security/inputValidation.ts`, `backend/src/utils/{responseHandler,emailTemplates}.ts`, `backend/src/middlewares/*.ts`, `backend/src/config/env.validation.test.ts`, `backend/src/security/inputValidation.test.ts` → `.js`.

**Interfaces:** Các export CommonJS giữ tên `validateRequiredEnv`, `getRequiredEnvValue`, `InputValidationError`, `parsePositiveInteger`, `parsePagination`, `assertSafeInput`, `pickAllowedFields`, `successHandler`, `errorHandler`, `getOtpEmailTemplate`, `verifyToken`, `requireRoles`, các upload middleware; Task 5 import bằng `require()`.

- [ ] **Step 1: Chuyển test hiện có và thêm assertion rủi ro.** Giữ case env thiếu/rỗng; input số âm/không nguyên/quá lớn; `InputValidationError` đi qua middleware thành JSON lỗi như trước. Test snapshot chuỗi HTML email hoặc assertion `font-family` và OTP không đổi.
- [ ] **Step 2: Chạy test JS để thấy fail do module cũ chưa chuyển.** Run: `node --test src/config/env.validation.test.js src/security/inputValidation.test.js`. Expected: fail vì JS module chưa tồn tại.
- [ ] **Step 3: Chuyển module và middleware sang CommonJS.** Bỏ type annotation/`as const`/interface, giữ giá trị runtime và thứ tự middleware; giữ template email nguyên nội dung. Không mở rộng tập tag HTML hay thay cấu hình CORS/CSP.
- [ ] **Step 4: Chạy test và kiểm tra cú pháp.** Run: `node --test src/config/env.validation.test.js src/security/inputValidation.test.js`; `node --check` cho các `.js` vừa chuyển. Expected: pass/exit 0.

### Task 5: Chuyển nghiệp vụ và toàn bộ API

**Files:** Rename/modify `backend/src/services/*.ts` (14), `backend/src/controllers/*.ts` (13), `backend/src/routers/*.ts` (13), `backend/src/index.ts` → `.js`; create/modify test hành vi tại `backend/tests/api-contract.test.js` và các test domain cần thiết.

**Interfaces:** Giữ các export class/controller/service và default router dưới tên tương đương qua CommonJS; giữ route path, HTTP method, middleware order, status và JSON shape. `index.js` export `app` để test mở server cổng tạm; chỉ khởi động listener khi chạy trực tiếp (`require.main === module`). Consumes các class/schema từ Task 2, config/middleware từ Task 4 và DataSource từ Task 3.

- [ ] **Step 1: Viết test contract trước.** Chụp danh sách route/method từ `index.ts` + router hiện tại; test 404, lỗi 500 không lộ nội bộ, xác thực/role sai, JSON lỗi input sai. Với tích hợp ngoài, dùng stub/mock ở ranh giới SDK để assert request/response và webhook signature; không gọi dịch vụ thật trong test.
- [ ] **Step 2: Chạy test để thấy fail vì API JS chưa tồn tại.** Run: `node --test tests/api-contract.test.js`. Expected: fail do module/router JS chưa tồn tại.
- [ ] **Step 3: Chuyển service theo domain, rồi controller/router tương ứng.** Thứ tự: auth/user/teacher; course/class/syllabus/schedule/enrollment/announcement; registration/post; upload/payment/email. Giữ `new Entity()` và repository theo class target; thay enum TS bằng object JS của Task 2. Chuyển `index.ts` cuối cùng, giữ thứ tự middleware/routes, startup và handler lỗi.
- [ ] **Step 4: Chạy test contract và smoke test API có DB test.** Run: `node --test tests/api-contract.test.js`; chạy `node -r dotenv/config src/index.js` với cấu hình test hợp lệ và gọi các endpoint chính. Expected: cùng status/JSON trước chuyển đổi; không mất route, auth, upload hoặc callback thanh toán.
- [ ] **Step 5: Kiểm tra hành vi tích hợp có kiểm soát.** Với tài khoản/dịch vụ thử nghiệm, xác nhận đăng nhập, CRUD, email, PayOS/webhook và Cloudinary; nếu không có credential, ghi rõ phần chưa thể xác minh và không nhận là đã đạt tiêu chí tích hợp.

### Task 6: Đổi lệnh chạy, dependencies, Docker và hướng dẫn

**Files:** Modify `backend/package.json`, `backend/package-lock.json`, `backend/Dockerfile`, `README.md`, `docs/MIGRATIONS.md`; create `backend/tests/package-scripts.test.js`; remove `backend/tsconfig.json`, `backend/src/types/multer-storage-cloudinary.d.ts` khi không còn cần.

**Interfaces:** `npm run dev` và `npm start` chạy `src/index.js`; `npm test` dùng `node --test --test-concurrency=1 "tests/**/*.test.js" "src/**/*.test.js"` để tránh chạy test cũ trong `dist`; `migration:generate/show/run/revert` dùng TypeORM CLI với `src/models/DataSource.js`; `migration:generate` xuất JavaScript (`-o`); `migration:check-baseline` chạy `node scripts/check-migration-baseline.js`.

- [ ] **Step 1: Viết/điều chỉnh kiểm tra scripts.** Assert `package.json` có `"type": "commonjs"`, các lệnh không chứa `ts-node`, `tsc`, `dist/*.js`, và Docker gọi lệnh chạy mới. Test `migration:generate` có cờ xuất JS.
- [ ] **Step 2: Chạy kiểm tra để thấy fail với cấu hình cũ.** Run: `node --test tests/package-scripts.test.js`. Expected: fail vì `ts-node`, `dist` và thiếu `type`.
- [ ] **Step 3: Cập nhật scripts và tài liệu.** Giữ alias `:prod` chỉ nếu có khác biệt vận hành thật; nếu không, bỏ và ghi một lệnh duy nhất trong README/MIGRATIONS. Không chạy `migration:run/revert/--fake` trên DB thật để thử lệnh. Docker phải dùng source JS, không phụ thuộc `tsc`.
- [ ] **Step 4: Gỡ dependency TS cuối cùng.** Sau khi code/test đã JS, gỡ `typescript`, `ts-node`, `@types/*`; gỡ `reflect-metadata` chỉ nếu kiểm tra sử dụng và TypeORM metadata chứng minh không cần. Cập nhật lockfile bằng npm; không xóa toàn bộ `node_modules`.
- [ ] **Step 5: Chạy lệnh package và Docker.** Run: `npm test`, `npm run migration:show` trên DB test, `npm run migration:check-baseline` trên DB test phù hợp; `docker compose build backend` và startup. Expected: exit 0 và không gọi TypeScript toolchain.

### Task 7: Kiểm chứng toàn diện và bàn giao

**Files:** Read toàn bộ `backend/**`, `README.md`, `docs/MIGRATIONS.md`, `frontend/src/index.css`; chỉ sửa lỗi được phát hiện trong tệp thuộc Task 2–6.

**Interfaces:** Produces báo cáo lệnh đã chạy, test pass/skip, schema parity, API parity, tài liệu và giới hạn còn lại. Không có thay đổi schema/dữ liệu thật.

- [ ] **Step 1: Quét tệp và tham chiếu cũ.** Run: `rg --files backend | rg '\.(ts|tsx|d\.ts)$'`; `rg -n 'ts-node|tsc|DataSource\.ts|dist/models|dist/index' backend README.md docs/MIGRATIONS.md` (bỏ qua `node_modules` và tài liệu lịch sử). Expected: không còn tham chiếu runtime TypeScript; tệp `sample_data.sql` còn nguyên.
- [ ] **Step 2: Chạy test tổng và test DB tích hợp.** Run: `npm test` với `MIGRATION_TEST_MYSQL_URL` trỏ tới DB `_migration_test`. Expected: không fail, test migration không skip; schema diff 0, migration cũ được nhận diện.
- [ ] **Step 3: Chạy smoke test ứng dụng và Docker.** Xác minh startup khi env đủ/thiếu, các route và luồng ở Task 5, CORS/cookie, 404/500; đối chiếu font frontend ở `frontend/src/index.css` và HTML email không đổi. Expected: hành vi và output tương đương mốc Task 1.
- [ ] **Step 4: Rà soát diff và cập nhật tài liệu nếu cần.** Chỉ đưa vào commit các tệp thuộc chuyển đổi; giữ nguyên thay đổi không liên quan của người dùng. Ghi rõ test tích hợp nào chưa thể chạy vì thiếu credential/DB; không khẳng định hoàn tất nếu cổng bắt buộc chưa đạt.

## Handoff và rollback

Mỗi task có thể được review riêng nhưng trạng thái chuyển đổi giữa các task không dùng để deploy. Tạo commit theo nhóm đã kiểm chứng khi quyền Git cho phép; nếu workspace không cho ghi `.git`, giữ diff để người dùng review, không tìm cách vượt quyền. Khi triển khai, phát hành bản JS sau khi toàn bộ cổng đạt. Nếu bản phát hành lỗi, quay về bản backend trước đó; vì chuyển đổi này không chạy DDL trên DB thật, không cần rollback database trừ khi có thao tác dữ liệu/schema khác ngoài kế hoạch.
