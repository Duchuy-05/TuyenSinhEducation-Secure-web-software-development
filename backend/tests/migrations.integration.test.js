"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const node_path_1 = __importDefault(require("node:path"));
const typeorm_1 = require("typeorm");
const User_1 = require("../src/models/entities/User");
const Registration_1 = require("../src/models/entities/Registration");
const Course_1 = require("../src/models/entities/Course");
const Teacher_1 = require("../src/models/entities/Teacher");
const CourseSyllabus_1 = require("../src/models/entities/CourseSyllabus");
const Post_1 = require("../src/models/entities/Post");
const Class_1 = require("../src/models/entities/Class");
const ClassEnrollment_1 = require("../src/models/entities/ClassEnrollment");
const Schedule_1 = require("../src/models/entities/Schedule");
const Announcement_1 = require("../src/models/entities/Announcement");
const Payment_1 = require("../src/models/entities/Payment");
const testDbUrl = process.env.MIGRATION_TEST_MYSQL_URL;
function getDbName(urlStr) {
    try {
        const parsed = new URL(urlStr);
        return parsed.pathname.replace(/^\//, "");
    }
    catch {
        return "";
    }
}
(0, node_test_1.default)("Migration lifecycle integration test", async (t) => {
    if (!testDbUrl) {
        t.skip("MIGRATION_TEST_MYSQL_URL is not set. Skipping MySQL integration tests.");
        return;
    }
    const dbName = getDbName(testDbUrl);
    strict_1.default.ok(dbName.endsWith("_migration_test"), `MIGRATION_TEST_MYSQL_URL database name must end with '_migration_test' for safety. Found: '${dbName}'`);
    const migrationsPattern = node_path_1.default.join(__dirname, "../src/models/migrations/*.js").replace(/\\/g, "/");
    const dbType = process.env.DB_TYPE || "mysql";
    const testDataSource = new typeorm_1.DataSource({
        type: dbType,
        url: testDbUrl,
        synchronize: false,
        migrationsRun: false,
        migrationsTableName: "migrations",
        migrationsTransactionMode: "none",
        entities: [User_1.UserSchema, Registration_1.RegistrationSchema, Course_1.CourseSchema, Teacher_1.TeacherSchema, CourseSyllabus_1.CourseSyllabusSchema, Post_1.PostSchema, Class_1.ClassSchema, ClassEnrollment_1.ClassEnrollmentSchema, Schedule_1.ScheduleSchema, Announcement_1.AnnouncementSchema, Payment_1.OrderSchema],
        migrations: [migrationsPattern],
    });
    await testDataSource.initialize();
    try {
        strict_1.default.deepEqual(testDataSource.migrations.map((migration) => migration.name), ["InitialSchema1793750400000"]);
        const queryRunner = testDataSource.createQueryRunner();
        // Reset test database tables to ensure clean starting state
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0;");
        const existingTables = await queryRunner.query("SHOW TABLES;");
        for (const row of existingTables) {
            const tblName = Object.values(row)[0];
            await queryRunner.query(`DROP TABLE IF EXISTS \`${tblName}\`;`);
        }
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1;");
        // 1. Run migrations
        const executed = await testDataSource.runMigrations();
        strict_1.default.ok(executed.length >= 1, "At least one migration should be executed");
        strict_1.default.equal(executed[0].name, "InitialSchema1793750400000", "First migration should be InitialSchema1793750400000");
        // 2. Check 11 tables exist
        const expectedTables = [
            "users",
            "teachers",
            "courses",
            "course_syllabus",
            "registrations",
            "posts",
            "classes",
            "schedules",
            "class_enrollments",
            "announcements",
            "orders",
        ];
        for (const tbl of expectedTables) {
            const hasTable = await queryRunner.hasTable(tbl);
            strict_1.default.ok(hasTable, `Table ${tbl} should exist after migration:run`);
        }
        // 3. Check schema builder diff is empty (entities match migration schema exactly)
        const sqlInMemory = await testDataSource.driver.createSchemaBuilder().log();
        strict_1.default.equal(sqlInMemory.upQueries.length, 0, `Schema differences detected between entities and database: ${sqlInMemory.upQueries.map((q) => q.query).join("; ")}`);
        // 4. Sentinel record check
        await queryRunner.query("INSERT INTO users (full_name, email, role, isVerified) VALUES ('Sentinel User', 'sentinel@test.local', 'student', 1)");
        // Second run should be a no-op
        const secondRun = await testDataSource.runMigrations();
        strict_1.default.equal(secondRun.length, 0, "Second run should execute 0 migrations");
        const sentinelRows = await queryRunner.query("SELECT * FROM users WHERE email = 'sentinel@test.local'");
        strict_1.default.equal(sentinelRows.length, 1, "Sentinel user should still exist after second migration:run");
        // 5. Revert migration
        await testDataSource.undoLastMigration();
        for (const tbl of expectedTables) {
            const existsAfterRevert = await queryRunner.hasTable(tbl);
            strict_1.default.equal(existsAfterRevert, false, `Table ${tbl} should be dropped after migration:revert`);
        }
        // 6. Up again
        const reExecuted = await testDataSource.runMigrations();
        strict_1.default.equal(reExecuted.length, 1, "Re-running after revert should execute InitialSchema again");
        await queryRunner.release();
    }
    finally {
        if (testDataSource.isInitialized) {
            await testDataSource.destroy();
        }
    }
});
