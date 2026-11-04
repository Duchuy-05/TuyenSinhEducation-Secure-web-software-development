# Database Migrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution, or superpowers:subagent-driven-development if the user chooses delegation. Track steps with checkboxes.

**Goal:** Chuyển backend từ tự đồng bộ schema sang migration TypeORM có lịch sử, giữ nguyên cấu trúc model hiện tại và bảo toàn dữ liệu có sẵn.

**Architecture:** Giữ AppDataSource dùng chung cho ứng dụng và CLI; nạp riêng cấu hình DB để CLI không phụ thuộc JWT/PayOS. Migration khởi tạo mô tả 11 entity; database có sẵn chỉ được baseline sau khi đối chiếu schema. Migration chạy bằng lệnh riêng, không chạy tự động lúc server khởi động.

**Tech Stack:** TypeScript, TypeORM phiên bản trong package-lock.json, MySQL/mysql2, ts-node, node:test/assert.

**Spec:** ../specs/2026-11-04-database-migrations-design.md

## Global Constraints

- Worktree: C:\Users\Anh\.codex\worktrees\4875\TrangTuyenSinhEdu; branch feat/database-migrations.
- Không sửa quan hệ model hay nghiệp vụ trong lần chuyển đổi này.
- Không chạy DDL lên database hiện có khi chưa xác định database đích và tình trạng dữ liệu.
- MySQL DDL không đảm bảo rollback toàn bộ bằng transaction; down không thay thế backup.
- Không copy hoặc commit secrets. Không thay đổi checkout gốc hay merge trong giai đoạn này.
- Chưa rõ database đích có dữ liệu hay không; việc viết và kiểm thử trên DB dùng riêng vẫn có thể tiến hành, triển khai DB thật phải chờ câu trả lời.

## Review Focus

1. CLI hoạt động khi chỉ có MYSQL_URL, không đòi JWT/PayOS (Task 1).
2. Chạy JS trong dist không nạp trùng migration TS (Task 1/2).
3. Schema hiện có lệch baseline: phải dừng, không đánh dấu đã chạy (Task 3).
4. Chạy migration lần hai không đổi schema hoặc dữ liệu (Task 2).
5. Lỗi giữa các DDL có thể để lại schema một phần; không tự fake/retry hoặc báo rollback thành công (Task 3).

## File map

- Modify backend/src/models/DataSource.ts: cấu hình DB và migration chung.
- Create backend/src/config/database.ts: nạp MYSQL_URL độc lập với cấu hình dịch vụ ngoài.
- Modify backend/package.json: các script migration cho source và dist.
- Create backend/src/models/migrations/1793750400000-InitialSchema.ts: baseline up/down.
- Create backend/tests/database-config.test.ts: kiểm tra cấu hình không cần kết nối DB.
- Create backend/tests/migrations.integration.test.ts: vòng đời trên MySQL thử nghiệm.
- Create backend/scripts/check-migration-baseline.ts: kiểm tra schema chỉ đọc trước baseline.
- Create backend/MIGRATIONS.md: hướng dẫn sử dụng và triển khai.
- Spec/plan: theo dõi bằng Git thông thường; quy tắc ignore docs đã được bỏ theo yêu cầu người dùng.

## Task 1: DataSource và CLI độc lập

**Interfaces:** Giữ export AppDataSource: DataSource. Thêm loadDatabaseUrl(): string trong config/database.ts; trả URL đã kiểm tra, thiếu URL thì lỗi rõ ràng không chứa credentials. Không initialize khi import.

- [x] Ghi nhận baseline: npm ci, npm run build trong backend; đọc phiên bản TypeORM đã khóa và CLI --help. npm test hiện là placeholder báo lỗi, không dùng nó làm bằng chứng test regression.
- [x] Viết database-config.test.ts dùng node:test/assert: assert.equal(AppDataSource.options.synchronize, false); assert.equal(AppDataSource.options.migrationsRun, false); child process import thành công chỉ với MYSQL_URL; thiếu URL thất bại mà stderr không chứa credentials.
- [x] Chạy node --require ts-node/register --test tests/database-config.test.ts, xác nhận thất bại do cấu hình cũ.
- [x] Implement loadDatabaseUrl: đọc backend/.env theo __dirname, không ghi đè biến môi trường được cấp từ shell; không import config/env.ts vì module đó có cơ chế override riêng.
- [x] Sửa DataSource import reflect-metadata và loadDatabaseUrl trước khi tạo instance. synchronize=false, migrationsRun=false, migrationsTableName=migrations, migrationsTransactionMode=none. Glob chỉ chọn .ts khi chạy source và .js khi chạy build; chuẩn hóa separator Windows.
- [x] Thêm script typeorm dùng typeorm-ts-node-commonjs; migration:generate/show/run/revert trỏ src/models/DataSource.ts. Thêm migration:show:prod/run:prod/revert:prod dùng node ./node_modules/typeorm/cli.js trỏ dist/models/DataSource.js. Chốt cú pháp bằng CLI đã cài, không đoán theo phiên bản khác.
- [x] Chạy test cấu hình và npm run build. Kiểm tra import bản dist chỉ với MYSQL_URL và không mở kết nối tự động; xác nhận đường dẫn migration chỉ dùng JS.
- [x] Commit các file Task 1 với message feat: configure explicit database migrations.

## Task 2: Migration khởi tạo và vòng đời trên DB thử nghiệm

**Interfaces:** InitialSchema1793750400000 implements MigrationInterface; up(queryRunner: QueryRunner): Promise<void>; down(queryRunner: QueryRunner): Promise<void>. Dùng AppDataSource từ Task 1.

- [x] Viết integration test chỉ nhận MIGRATION_TEST_MYSQL_URL, tuyệt đối không fallback MYSQL_URL. Chỉ chạy trên database dùng riêng có tên kết thúc _migration_test; không tự DROP DATABASE. Khi thiếu URL thì skip rõ ràng, không báo đã kiểm thử DB.
- [x] Viết assertions: up tạo đủ users, teachers, courses, course_syllabus, registrations, posts, classes, schedules, class_enrollments, announcements, orders; lịch sử có đúng baseline; schema builder log().upQueries rỗng; lần run thứ hai trả []; dữ liệu sentinel còn nguyên. down trên DB thử nghiệm bỏ hết bảng nghiệp vụ và baseline history; up lại thành công.
- [x] Chạy test khi chưa có migration, xác nhận fail nếu MySQL thử nghiệm sẵn sàng. Nếu chưa có MySQL, ghi rõ giới hạn và chuẩn bị môi trường riêng trước khi khẳng định vòng đời đã chạy.
- [x] Sinh baseline trên database thử nghiệm trống từ metadata entity hiện tại, lưu tên file/class đúng interface trên. Review SQL đầy đủ: kiểu cột, nullable/default, enum, unique, FK, cascade và thứ tự down. Không tự sửa quan hệ Course.user/full_name trong migration.
- [x] Giữ SQL tĩnh trong up/down, không dùng synchronize hoặc tạo schema động theo entity lúc chạy. Không dùng IF NOT EXISTS để che schema lệch. down tháo FK trước khi drop bảng.
- [x] Chạy integration test và npm run build; chạy CLI show/run bằng dist trên DB thử nghiệm, xác nhận chỉ phát hiện một migration, không có pending sau run.
- [x] Commit migration và test với message feat: add initial MySQL schema migration.

## Task 3: Chuyển DB hiện có và tài liệu vận hành

**Interfaces:** scripts/check-migration-baseline.ts chạy bằng npm run migration:check-baseline, dùng AppDataSource với synchronize=false/migrationsRun=false. Exit 0 khi schema khớp và lịch sử không có migration ngoài baseline; exit 1 khi lệch hoặc lỗi. Không ghi DB, không log URL, destroy kết nối trong finally.

- [x] Thêm integration cases: DB giống baseline có sentinel được check thành công; thay đổi một cột hoặc thiếu một bảng làm check thất bại; schema và dữ liệu không đổi sau check. Thêm lịch sử lạ làm check thất bại.
- [x] Implement check bằng schema builder log() để phát hiện schema khác metadata; kiểm tra danh sách migration/history trước khi cho phép baseline. Chỉ dùng công cụ này cho phiên bản baseline ban đầu, tài liệu ghi rõ không áp dụng với entity đã thay đổi ở các release sau.
- [x] Thêm case lỗi DDL trên DB dùng riêng: lệnh thất bại, không có history cho migration chưa hoàn thành, không tự đánh dấu thành công. Không mặc định schema đã được rollback.
- [x] Viết backend/MIGRATIONS.md bằng tiếng Việt: giải thích migration so với synchronize; setup MYSQL_URL; bảng lệnh source/dist; generate khi đổi entity, review SQL, build và deploy.
- [x] Hướng dẫn DB trống: show → run → show. Hướng dẫn DB có dữ liệu: xác định target, backup và kiểm tra restore trên bản sao, dừng tác vụ ghi, check-baseline, review; chỉ khi khớp và baseline là migration pending duy nhất mới chạy migration:run -- --fake. Không chạy fake cho nhiều migration pending. Kiểm tra dữ liệu/số bản ghi sau đó.
- [x] Ghi rõ schema lệch phải xử lý migration chuyển tiếp riêng; không tự drop hay synchronize. Revert baseline xóa bảng và dữ liệu, chỉ dùng cho DB thử nghiệm; phục hồi production cần backup/forward fix được review. Đưa checklist xử lý MySQL DDL thất bại một phần.
- [x] Chạy test cấu hình, integration nếu có DB riêng, build và git diff --check. Đối chiếu README commands với package.json; báo riêng test đã chạy và test bị skip.
- [x] Stage đúng spec và plan bằng git add; commit cùng tài liệu/script/test Task 3. Không commit .env, node_modules hoặc dist.

## Handoff và nghiệm thu

- [ ] Review toàn bộ diff: entity/controller/service không bị sửa; migration bảo toàn schema hiện tại; không có secrets.
- [ ] Báo file thay đổi, kết quả kiểm tra, giới hạn và commit/branch cho người dùng.
- [ ] Chỉ triển khai trên DB thật sau khi biết DB đích/tình trạng dữ liệu và có backup phù hợp; ghi rõ nếu mới hoàn thành code mà chưa áp dụng DB.
- [ ] Merge vào nhánh người dùng chọn sau khi kiểm tra xong; không coi merge code là đã chạy migration DB.
