import test from "node:test";
import assert from "node:assert/strict";
import { DataSource, MigrationInterface, QueryRunner } from "typeorm";

const testDbUrl = process.env.MIGRATION_TEST_MYSQL_URL;

test("failed migration leaves partial DDL but no success history", async (t) => {
  if (!testDbUrl) {
    t.skip("MIGRATION_TEST_MYSQL_URL is not set. Skipping MySQL integration test.");
    return;
  }

  const databaseName = new URL(testDbUrl).pathname.replace(/^\//, "");
  assert.ok(databaseName.endsWith("_migration_test"));
  const tableName = `migration_partial_probe_${Date.now()}_${process.pid}`;
  const migrationName = "PartialFailure1800000000000";

  class PartialFailure1800000000000 implements MigrationInterface {
    name = migrationName;

    async up(queryRunner: QueryRunner): Promise<void> {
      const create = `CREATE TABLE \`${tableName}\` (\`id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`;
      await queryRunner.query(create);
      await queryRunner.query(create);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE \`${tableName}\``);
    }
  }

  const dataSource = new DataSource({
    type: (process.env.DB_TYPE as "mysql" | "mariadb") || "mysql",
    url: testDbUrl,
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: "migrations",
    migrationsTransactionMode: "none",
    entities: [],
    migrations: [PartialFailure1800000000000],
  });

  try {
    await dataSource.initialize();
    await assert.rejects(dataSource.runMigrations());

    const queryRunner = dataSource.createQueryRunner();
    try {
      assert.equal(await queryRunner.hasTable(tableName), true, "First DDL should remain after failure");
      const history: any[] = await queryRunner.query(
        "SELECT name FROM migrations WHERE name = ?",
        [migrationName]
      );
      assert.equal(history.length, 0, "Failed migration must not be recorded as complete");
    } finally {
      await queryRunner.release();
    }
  } finally {
    if (dataSource.isInitialized) {
      const queryRunner = dataSource.createQueryRunner();
      try {
        if (await queryRunner.hasTable(tableName)) {
          await queryRunner.query(`DROP TABLE \`${tableName}\``);
        }
      } finally {
        await queryRunner.release();
        await dataSource.destroy();
      }
    }
  }
});
