# Chuyển backend từ TypeScript sang JavaScript chạy trực tiếp trên Node.js

Ngày: 2026-11-05  
Trạng thái: bản thiết kế để rà soát; chưa triển khai

## 1. Mục đích và phạm vi

Người dùng muốn backend chỉ còn mã ứng dụng JavaScript (`.js`) chạy trực tiếp trên Node.js, bao gồm cả phần vừa tích hợp từ `feat/migration`. Lý do cụ thể của quyết định bỏ TypeScript chưa được nêu; thiết kế này giả định mục tiêu là đơn giản hóa việc viết và chạy backend, đồng thời giữ nguyên hành vi hiện có. Node.js vốn đã là runtime của backend; đây là chuyển đổi ngôn ngữ nguồn và công cụ chạy, không phải thay runtime.

Phạm vi: toàn bộ `backend/src`, `backend/scripts`, `backend/tests`, scripts trong `backend/package.json`, `backend/package-lock.json`, Dockerfile, các tham chiếu backend trong README và tài liệu migration. Tệp SQL dữ liệu mẫu vẫn là SQL. Frontend React/TypeScript, CSS và font hiển thị trên website nằm ngoài phạm vi. Nội dung HTML và `font-family` của mẫu email trong backend phải giữ nguyên.

## 2. Hiện trạng đã kiểm tra

- Nhánh hiện tại `security-Web`; workspace có thay đổi chưa commit: `backend/MIGRATIONS.md` bị xóa và `docs/MIGRATIONS.md` mới. Không tự ý khôi phục hoặc ghi đè những thay đổi này.
- `backend/src` có 68 tệp `.ts` và một tệp `.sql`; thêm 5 test `.ts` trong `backend/tests` và một script `.ts` trong `backend/scripts` (tổng 74 tệp TypeScript được liệt kê lúc khảo sát). Ngoài ra có một test cấu hình môi trường trong `backend/src/config` và một tệp khai báo `.d.ts`.
- Express 5, TypeORM, MySQL và các SDK tích hợp đã có trong `backend/package.json`. `ts-node` chạy chế độ dev/test/migration; `tsc` tạo `dist`; Docker phát triển chạy `npm run dev` trên Node 22 Alpine.
- 11 entity hiện định nghĩa bằng decorator và metadata TypeScript. `DataSource` đăng ký entity, chọn migration `.ts` hoặc `.js` theo tên tệp, và đặt `synchronize: false`, `migrationsRun: false`, `migrationsTransactionMode: "none"`.
- Migration `InitialSchema1793750400000` tạo 11 bảng. Script baseline, 5 test trong `backend/tests`, và test cấu hình môi trường là phần của phạm vi chuyển đổi. Một số test tích hợp chỉ chạy khi có `MIGRATION_TEST_MYSQL_URL` kết thúc bằng `_migration_test`.
- `README.md` và `docs/MIGRATIONS.md` còn hướng dẫn `ts-node`, `dist`, đường dẫn `.ts`, hoặc lệnh build TypeScript.

## 3. Các hướng đã cân nhắc

| Hướng | Lợi ích | Đánh đổi | Kết luận |
|---|---|---|---|
| Giữ Express và TypeORM; chuyển mã nguồn, entity, migration và test sang JavaScript | Ít thay đổi nghiệp vụ, API và database; dùng lại các thư viện hiện có | Phải chuyển decorator thành định nghĩa entity không dùng decorator và kiểm tra metadata kỹ | **Chọn làm hướng thiết kế** theo đề xuất trong cuộc trao đổi |
| Chuyển sang JavaScript đồng thời đổi ORM hoặc viết SQL thủ công | Có thể đơn giản hóa tầng dữ liệu về lâu dài | Viết lại mapping, truy vấn và migration; nguy cơ lệch schema và tăng phạm vi lớn | Không phù hợp mục tiêu giữ nguyên logic |
| Giữ TypeScript, chỉ chạy bản `dist` JavaScript | Ít công nhất | Mã nguồn, test và công cụ vẫn là TypeScript, không đạt yêu cầu chỉ dùng JavaScript | Loại |

## 4. Kết quả cần đạt và ranh giới

### Mục tiêu

1. Mọi mã ứng dụng, script vận hành và test trong backend dùng JavaScript. Các lệnh dev, start, test và migration chạy bằng Node.js/TypeORM CLI mà không cần `ts-node` hoặc `tsc`.
2. Giữ nguyên endpoint, phương thức HTTP, cấu trúc request/response, mã lỗi, xác thực, phân quyền, cookie/CORS, upload, email, PayOS và cách xử lý dữ liệu.
3. Giữ nguyên tên bảng/cột, kiểu dữ liệu, nullable/default, quan hệ, khóa ngoại, index, enum, thời gian, tên và thứ tự migration, lịch sử trong bảng `migrations`.
4. Giữ nguyên nội dung email và các khai báo font. Không thay đổi frontend hoặc CSS.
5. Không cần xóa toàn bộ `node_modules` hay tải lại toàn bộ dependencies chỉ vì đổi đuôi tệp.

### Ngoài phạm vi và điều không được xảy ra

- Không nâng cấp Express, TypeORM, MySQL, PayOS SDK hay các package khác trong cùng đợt, trừ khi có bằng chứng gói hiện tại không tương thích với JavaScript/module mode đã chọn.
- Không thay schema, dữ liệu thật, API contract, hoặc bật `synchronize`/`migrationsRun` tự động.
- Không tạo migration mới chỉ để đổi `.ts` thành `.js`; không chạy `migration:run`, `migration:revert`, `--fake`, `DROP` trên database thật trong quá trình chuyển mã.
- Không đổi tên migration class `InitialSchema1793750400000` hoặc sửa câu SQL của nó, ngoại trừ cú pháp bao quanh bắt buộc để chạy trong JavaScript.
- Không xem việc đổi phần mở rộng tệp là hoàn tất nếu runtime hoặc kiểm thử chưa qua.

## 5. Thiết kế kỹ thuật

### 5.1 Hệ module và đường dẫn

Ưu tiên **CommonJS** vì backend hiện không khai báo `"type": "module"`, mã build hiện chạy theo cách này, TypeORM CLI và script baseline đã dùng `require`/`__dirname`. Ghi rõ `"type": "commonjs"` trong `backend/package.json`; chuyển `import`/`export` sang `require`/`module.exports` nhất quán. Không trộn cú pháp ESM vào tệp `.js` CommonJS. Trước khi chốt, chạy kiểm tra tải từng SDK đang sử dụng; nếu một package bắt buộc ESM, cô lập cách nạp tương thích hoặc điều chỉnh quyết định module một lần cho toàn backend, không sửa từng nơi tùy tiện.

Mọi đường dẫn tương đối phải được rà soát khi bỏ `dist`: điểm chạy mới là `src/index.js`, và `DataSource`/script tìm migration trong `src/models/migrations/*.js`. Đường dẫn `.env`, tài nguyên tĩnh và thư mục làm việc phải được xác nhận trên Windows, Linux và trong Docker.

### 5.2 Chuyển mã nghiệp vụ

Chuyển router, controller, service, middleware, security, config, utility và entry point sang `.js` theo từng nhóm. Bỏ annotation/type assertion/interface/enum chỉ dùng bởi TypeScript; giữ nguyên điều kiện, xử lý lỗi, chuỗi thông báo, giá trị enum ở runtime, định dạng JSON và thứ tự middleware. Với enum TypeScript được dùng ở runtime, thay bằng object JavaScript có cùng giá trị. Với chỗ chỉ dựa vào type để biểu đạt ràng buộc đầu vào, kiểm tra xem validation runtime hiện có hay chưa; bổ sung kiểm tra tại ranh giới nếu thiếu, nhưng không tự đổi contract. Bỏ tệp `.d.ts` sau khi xác nhận không còn TypeScript trong backend.

### 5.3 TypeORM và migration

Chuyển 11 entity từ decorator sang `EntitySchema` với `target` trỏ tới class JavaScript cùng tên hiện có. Mỗi file export class hiện hữu và schema tên `<ClassName>Schema` (ví dụ `UserSchema`, `OrderSchema`); `DataSource.entities` đăng ký các schema. Giữ class để các lệnh `new User()`, `new Order()`, v.v. và `getRepository(Entity)` tiếp tục có nghĩa; chỉ sửa các chỗ này nếu kiểm chứng thực tế buộc phải làm. Ghi tường minh kiểu cột/độ dài/default/nullability/unique/index/relation/join column/delete behavior, nhất là các cột trước đây được suy ra từ metadata TypeScript. Giữ tên entity/target để repository và quan hệ tra cứu đúng; không thay nghiệp vụ hoặc truy vấn nếu chưa cần.

Chuyển `DataSource` và migration hiện có sang `.js`; giữ `migrationsTableName: "migrations"`, `synchronize: false`, `migrationsRun: false`, chế độ transaction và nguyên tên/timestamp migration. Lệnh CLI source dùng `src/models/DataSource.js`; lệnh production dùng cùng mã JavaScript được đóng gói, không dựa vào `dist` TypeScript. Chuyển script kiểm tra baseline và các test migration sang `.js`; giữ điều kiện database test riêng. Đối chiếu metadata/entity và SQL diff trước/sau trên database thử nghiệm. Lịch sử migration đã chạy phải tiếp tục được TypeORM nhận ra.

### 5.4 Package, Docker và tài liệu

Giữ các runtime dependencies đang dùng như Express, TypeORM, mysql2, bcrypt, Cloudinary, PayOS, Google auth và Nodemailer nếu smoke test chứng minh chúng hoạt động với module mode mới. `reflect-metadata` chỉ gỡ khi không còn cách sử dụng nào cần nó. Sau khi toàn bộ kiểm chứng qua, gỡ `typescript`, `ts-node` và các `@types/*` không còn cần; cập nhật lockfile bằng npm. `nodemon` là công cụ dev độc lập và có thể giữ nếu đang hữu ích. Không xóa rồi cài lại toàn bộ package theo mặc định.

Thay scripts dev/start/test/migration/baseline để chạy `.js` trực tiếp; quyết định số phận lệnh `build` và alias `:prod` rõ ràng trong tài liệu: loại bỏ khi không còn bước build, hoặc dùng chúng cho bước đóng gói thật nếu có. Cập nhật Dockerfile/Compose và README/MIGRATIONS để chỉ tới lệnh và đường dẫn thực tế. Docker vẫn dùng Node 22; không đổi image hoặc version package trong cùng đợt.

## 6. Thứ tự thực hiện và cổng kiểm chứng

1. **Chụp mốc trước chuyển đổi:** ghi lại trạng thái Git, scripts, danh sách dependencies, API routes, các test hiện có; chạy test sẵn có. Với test DB, chỉ dùng database riêng `_migration_test`. Ghi lại metadata/schema diff và trạng thái migration để làm chuẩn so sánh.
2. **Chốt module mode và kiểm tra SDK:** thử tải các package thực sự được import với CommonJS trên Node 22; xử lý ngoại lệ trước khi chuyển hàng loạt.
3. **Chuyển tầng dữ liệu:** chuyển 11 entity, `DataSource`, migration và script baseline; so sánh metadata, 11 bảng, index/khóa ngoại và tên migration trên database thử nghiệm. Không tiếp tục nếu xuất hiện schema diff không giải thích được.
4. **Chuyển mã ứng dụng:** theo thứ tự config/security/utilities → services → controllers/middlewares → routers/entry point; kiểm tra startup và các API chính sau mỗi nhóm.
5. **Chuyển test và vận hành:** chuyển toàn bộ test `.ts`, gồm test trong `src/config`, cùng scripts trong `package.json`; cập nhật Dockerfile và tài liệu. Chạy test đơn vị và test migration tích hợp. Các test tích hợp bị skip do thiếu DB không được tính là đã xác minh migration.
6. **Kiểm thử hành vi:** đối chiếu trước/sau đối với đăng nhập và phân quyền, CRUD khóa học/lớp/đăng ký, thanh toán và webhook, upload, email, 404/500, CORS/cookie và startup với biến môi trường thiếu. Kiểm tra frontend gọi API và giao diện/font vẫn như cũ.
7. **Dọn dẹp cuối:** chỉ sau khi các bước trên đạt, gỡ dependency TypeScript và tệp cấu hình không còn dùng, cập nhật lockfile, rà soát không còn tham chiếu `.ts`, `ts-node`, `tsc`, `dist` cũ trong backend/tài liệu. Chạy lại toàn bộ kiểm chứng và build/chạy Docker.

## 7. Rủi ro và cách giảm

| Rủi ro | Cách giảm và dấu hiệu đạt |
|---|---|
| Mất lỗi kiểu được TypeScript phát hiện | Giữ test hành vi; kiểm tra input tại ranh giới API/env; tập trung kiểm tra nhánh lỗi và các giá trị `null`/`undefined` |
| EntitySchema thiếu metadata vốn được suy ra từ decorator | So sánh schema builder diff, cột/index/FK và chạy migration lifecycle trên DB test; không chấp nhận diff phát sinh |
| Mất nhận diện migration cũ hoặc chạy DDL lại | Giữ class name/timestamp/SQL, đối chiếu bảng `migrations`, kiểm tra `migration:show` trước và sau; không chạy lệnh trên DB thật để thử |
| Lỗi CommonJS/ESM của SDK hoặc đường dẫn tài nguyên | Smoke test import SDK và startup trên Node 22; kiểm tra `.env`, assets, Docker trên các môi trường mục tiêu |
| API trả kết quả khác dù test vẫn xanh | So sánh contract và test luồng trọng yếu; kiểm thử cùng frontend |
| Bộ test hiện tại thiếu DB test và tự skip | Báo cáo rõ test nào chạy/skip; yêu cầu một lượt chạy với DB `_migration_test` trước khi kết luận phần migration đạt |
| Dữ liệu thật bị ảnh hưởng khi deploy | Tách chuyển mã khỏi DDL; backup và xác định DB đích trước mọi thao tác migration vận hành; rollback code bằng bản phát hành cũ nếu lỗi ứng dụng; chỉ phục hồi DB nếu thực sự có thao tác DDL/dữ liệu |

## 8. Tiêu chí hoàn thành

- Không còn tệp nguồn/test/script `.ts` hoặc `.d.ts` trong backend; tệp `.sql` được giữ.
- `npm run dev`, `npm start`, `npm test`, các lệnh migration và baseline chạy bằng JavaScript trực tiếp; Docker backend khởi động được.
- Test hiện có chạy đạt; test tích hợp migration đã chạy thực sự trên DB `_migration_test`, không chỉ bị skip; `migration:show` nhận đúng lịch sử; schema diff bằng 0 so với baseline đã ghi.
- API và các luồng nghiệp vụ trọng yếu cho kết quả tương đương; frontend, CSS, font website và font mẫu email giữ nguyên.
- Lockfile và tài liệu khớp với cách chạy mới; không còn phụ thuộc `ts-node`/`tsc` trong quy trình backend.

## 9. Quyết định còn lại cho giai đoạn lập kế hoạch

Thiết kế mặc định giữ Express, TypeORM và CommonJS. Người triển khai cần rà lại danh sách SDK được import, viết checklist API cụ thể theo route hiện có, và xác định cách chạy DB test tại máy/CI. Nếu lý do người dùng muốn bỏ TypeScript đòi hỏi đổi luôn ORM, ESM hoặc phiên bản Node, cần sửa thiết kế trước khi triển khai; các thay đổi đó nằm ngoài giả định hiện tại.
