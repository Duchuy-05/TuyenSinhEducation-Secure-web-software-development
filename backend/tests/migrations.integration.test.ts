import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { DataSource } from "typeorm";
import { User } from "../src/models/entities/User";
import { Registration } from "../src/models/entities/Registration";
import { Course } from "../src/models/entities/Course";
import { Teacher } from "../src/models/entities/Teacher";
import { CourseSyllabus } from "../src/models/entities/CourseSyllabus";
import { Post } from "../src/models/entities/Post";
import { Class } from "../src/models/entities/Class";
import { ClassEnrollment } from "../src/models/entities/ClassEnrollment";
import { Schedule } from "../src/models/entities/Schedule";
import { Announcement } from "../src/models/entities/Announcement";
import { Order } from "../src/models/entities/Payment";

const testDbUrl = process.env.MIGRATION_TEST_MYSQL_URL;

function getDbName(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.pathname.replace(/^\//, "");
  } catch {
    return "";
  }
}

test("Migration lifecycle integration test", async (t) => {
  if (!testDbUrl) {
    t.skip("MIGRATION_TEST_MYSQL_URL is not set. Skipping MySQL integration tests.");
    return;
  }

  const dbName = getDbName(testDbUrl);
  assert.ok(
    dbName.endsWith("_migration_test"),
    `MIGRATION_TEST_MYSQL_URL database name must end with '_migration_test' for safety. Found: '${dbName}'`
  );

  const migrationsPattern = path.join(__dirname, "../src/models/migrations/*.ts").replace(/\\/g, "/");

  const dbType = (process.env.DB_TYPE as "mysql" | "mariadb") || "mysql";

  const testDataSource = new DataSource({
    type: dbType,
    url: testDbUrl,
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: "migrations",
    migrationsTransactionMode: "none",
    entities: [User, Registration, Course, Teacher, CourseSyllabus, Post, Class, ClassEnrollment, Schedule, Announcement, Order],
    migrations: [migrationsPattern],
  });

  await testDataSource.initialize();

  try {
    const queryRunner = testDataSource.createQueryRunner();

    // Reset test database tables to ensure clean starting state
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0;");
    const existingTables: any[] = await queryRunner.query("SHOW TABLES;");
    for (const row of existingTables) {
      const tblName = Object.values(row)[0];
      await queryRunner.query(`DROP TABLE IF EXISTS \`${tblName}\`;`);
    }
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 1. Run migrations
    const executed = await testDataSource.runMigrations();
    assert.ok(executed.length >= 1, "At least one migration should be executed");
    assert.equal(executed[0].name, "InitialSchema1793750400000", "First migration should be InitialSchema1793750400000");

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
      assert.ok(hasTable, `Table ${tbl} should exist after migration:run`);
    }

    // 3. Check schema builder diff is empty (entities match migration schema exactly)
    const sqlInMemory = await testDataSource.driver.createSchemaBuilder().log();
    assert.equal(
      sqlInMemory.upQueries.length,
      0,
      `Schema differences detected between entities and database: ${sqlInMemory.upQueries.map((q) => q.query).join("; ")}`
    );

    // 4. Sentinel record check
    await queryRunner.query(
      "INSERT INTO users (full_name, email, role, isVerified) VALUES ('Sentinel User', 'sentinel@test.local', 'student', 1)"
    );

    // Second run should be a no-op
    const secondRun = await testDataSource.runMigrations();
    assert.equal(secondRun.length, 0, "Second run should execute 0 migrations");

    const sentinelRows: any[] = await queryRunner.query(
      "SELECT * FROM users WHERE email = 'sentinel@test.local'"
    );
    assert.equal(sentinelRows.length, 1, "Sentinel user should still exist after second migration:run");

    // 5. Revert migration
    await testDataSource.undoLastMigration();

    for (const tbl of expectedTables) {
      const existsAfterRevert = await queryRunner.hasTable(tbl);
      assert.equal(existsAfterRevert, false, `Table ${tbl} should be dropped after migration:revert`);
    }

    // 6. Up again
    const reExecuted = await testDataSource.runMigrations();
    assert.equal(reExecuted.length, 1, "Re-running after revert should execute InitialSchema again");

    await queryRunner.release();
  } finally {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  }
});
