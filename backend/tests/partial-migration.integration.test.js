"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const typeorm_1 = require("typeorm");
const testDbUrl = process.env.MIGRATION_TEST_MYSQL_URL;
(0, node_test_1.default)("failed migration leaves partial DDL but no success history", async (t) => {
    if (!testDbUrl) {
        t.skip("MIGRATION_TEST_MYSQL_URL is not set. Skipping MySQL integration test.");
        return;
    }
    const databaseName = new URL(testDbUrl).pathname.replace(/^\//, "");
    strict_1.default.ok(databaseName.endsWith("_migration_test"));
    const tableName = `migration_partial_probe_${Date.now()}_${process.pid}`;
    const migrationName = "PartialFailure1800000000000";
    class PartialFailure1800000000000 {
        name = migrationName;
        async up(queryRunner) {
            const create = `CREATE TABLE \`${tableName}\` (\`id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`;
            await queryRunner.query(create);
            await queryRunner.query(create);
        }
        async down(queryRunner) {
            await queryRunner.query(`DROP TABLE \`${tableName}\``);
        }
    }
    const dataSource = new typeorm_1.DataSource({
        type: process.env.DB_TYPE || "mysql",
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
        await strict_1.default.rejects(dataSource.runMigrations());
        const queryRunner = dataSource.createQueryRunner();
        try {
            strict_1.default.equal(await queryRunner.hasTable(tableName), true, "First DDL should remain after failure");
            const history = await queryRunner.query("SELECT name FROM migrations WHERE name = ?", [migrationName]);
            strict_1.default.equal(history.length, 0, "Failed migration must not be recorded as complete");
        }
        finally {
            await queryRunner.release();
        }
    }
    finally {
        if (dataSource.isInitialized) {
            const queryRunner = dataSource.createQueryRunner();
            try {
                if (await queryRunner.hasTable(tableName)) {
                    await queryRunner.query(`DROP TABLE \`${tableName}\``);
                }
            }
            finally {
                await queryRunner.release();
                await dataSource.destroy();
            }
        }
    }
});
