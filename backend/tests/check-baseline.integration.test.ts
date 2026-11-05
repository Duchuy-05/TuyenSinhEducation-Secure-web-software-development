import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DataSource } from "typeorm";
import { checkMigrationBaseline } from "../scripts/check-migration-baseline";
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

test("check-migration-baseline integration test suite", async (t) => {
  if (!testDbUrl) {
    t.skip("MIGRATION_TEST_MYSQL_URL is not set. Skipping baseline check integration tests.");
    return;
  }

  const dbName = getDbName(testDbUrl);
  assert.ok(
    dbName.endsWith("_migration_test"),
    `MIGRATION_TEST_MYSQL_URL database name must end with '_migration_test'. Found: '${dbName}'`
  );

  const dbType = (process.env.DB_TYPE as "mysql" | "mariadb") || "mysql";
  const migrationsPattern = path.join(__dirname, "../src/models/migrations/*.ts").replace(/\\/g, "/");

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

    // 0. Clean database
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0;");
    const existingTables: any[] = await queryRunner.query("SHOW TABLES;");
    for (const row of existingTables) {
      const tblName = Object.values(row)[0];
      await queryRunner.query(`DROP TABLE IF EXISTS \`${tblName}\`;`);
    }
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 1. Run migrations to establish initial baseline
    await testDataSource.runMigrations();

    // Insert sentinel data
    await queryRunner.query(
      "INSERT INTO users (full_name, email, role, isVerified) VALUES ('Baseline Sentinel', 'sentinel_baseline@test.local', 'admin', 1);"
    );

    // Case 1: Baseline match should succeed
    const validResult = await checkMigrationBaseline(testDataSource);
    assert.equal(validResult.ok, true, `Expected baseline check to succeed, got: ${validResult.reason}`);

    // Verify sentinel record preserved and no writes occurred
    const sentinelRows: any[] = await queryRunner.query(
      "SELECT * FROM users WHERE email = 'sentinel_baseline@test.local';"
    );
    assert.equal(sentinelRows.length, 1, "Sentinel record should remain untouched after check");

    // Case 2: Missing table or modified column should fail check
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0;");
    await queryRunner.query("DROP TABLE orders;");
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1;");

    const missingTableResult = await checkMigrationBaseline(testDataSource);
    assert.equal(missingTableResult.ok, false, "Check should fail when a table is missing");
    assert.ok(
      missingTableResult.differences?.some((d) => d.includes("orders")),
      "Differences should mention missing orders table"
    );

    // Re-create orders table
    await queryRunner.query(
      "CREATE TABLE `orders` (`id` int NOT NULL AUTO_INCREMENT, `order_code` varchar(255) NOT NULL, `user_id` int NOT NULL, `course_id` int NOT NULL, `amount` int NOT NULL, `status` enum ('pending', 'paid', 'cancelled', 'failed') NOT NULL DEFAULT 'pending', `payment_method` enum ('payos_auto', 'admin_manual') NULL, `payos_transaction_id` varchar(255) NULL, `checkout_url` text NULL, `qr_code_url` text NULL, `payment_link_expires_at` timestamp NULL, `payment_note` text NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_e462c2f2237b3049aa6be3fce0` (`order_code`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `FK_a922b820eeef29ac1c6800e826a` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `FK_8f64e2f0728bad0f6c6aa6413b2` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );

    // Case 3: Altered column causes check to fail
    await queryRunner.query("ALTER TABLE users ADD COLUMN unexpected_col VARCHAR(100) NULL;");
    const extraColResult = await checkMigrationBaseline(testDataSource);
    assert.equal(extraColResult.ok, false, "Check should fail when schema has extra column");

    // Revert extra column
    await queryRunner.query("ALTER TABLE users DROP COLUMN unexpected_col;");

    // Case 4: Strange migration history causes check to fail
    await queryRunner.query(
      "INSERT INTO migrations (timestamp, name) VALUES (9999999999999, 'UnexpectedFutureMigration9999999999999');"
    );
    const strangeHistoryResult = await checkMigrationBaseline(testDataSource);
    assert.equal(strangeHistoryResult.ok, false, "Check should fail when strange migration exists in history");
    assert.match(strangeHistoryResult.reason || "", /Unexpected migration found in history/);

    // Clean up strange history
    await queryRunner.query(
      "DELETE FROM migrations WHERE name = 'UnexpectedFutureMigration9999999999999';"
    );

    // Case 5: CLI child process test
    const projectRoot = path.resolve(__dirname, "..");
    const cliRes = spawnSync(
      "node",
      ["-r", "ts-node/register", "scripts/check-migration-baseline.ts"],
      {
        cwd: projectRoot,
        env: {
          PATH: process.env.PATH,
          SYSTEMROOT: process.env.SYSTEMROOT,
          MYSQL_URL: testDbUrl,
          DB_TYPE: dbType,
        },
        encoding: "utf-8",
      }
    );
    assert.equal(cliRes.status, 0, `CLI check-baseline failed: ${cliRes.stderr || cliRes.stdout}`);
    assert.match(cliRes.stdout, /SUCCESS/, "CLI should print SUCCESS");

    await queryRunner.release();
  } finally {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  }
});
