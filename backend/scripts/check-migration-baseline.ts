import { DataSource } from "typeorm";

export interface CheckBaselineResult {
  ok: boolean;
  reason?: string;
  differences?: string[];
}

export async function checkMigrationBaseline(dataSource: DataSource): Promise<CheckBaselineResult> {
  const shouldClose = !dataSource.isInitialized;
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  try {
    const baselineName = "InitialSchema1793750400000";
    const loadedMigrationNames = dataSource.migrations.map((migration) => migration.name);
    if (loadedMigrationNames.length !== 1 || loadedMigrationNames[0] !== baselineName) {
      return {
        ok: false,
        reason: "Baseline check supports the initial migration only; review the loaded migration list.",
      };
    }

    const queryRunner = dataSource.createQueryRunner();
    try {
      // 1. Check if migrations table exists and inspect history
      const hasMigrationsTable = await queryRunner.hasTable("migrations");
      if (hasMigrationsTable) {
        const rows: any[] = await queryRunner.query(
          "SELECT name FROM `migrations` ORDER BY id ASC;"
        );
        for (const row of rows) {
          if (row.name !== baselineName) {
            return {
              ok: false,
              reason: `Unexpected migration found in history: '${row.name}'. Baseline check is only valid for InitialSchema.`,
            };
          }
        }
      }

      // 2. Inspect schema diff between DB and entity metadata
      const schemaBuilder = dataSource.driver.createSchemaBuilder();
      const sqlDiff = await schemaBuilder.log();

      if (sqlDiff.upQueries.length > 0) {
        const queryList = sqlDiff.upQueries.map((q) => q.query);
        return {
          ok: false,
          reason: `Database schema differs from entities (${sqlDiff.upQueries.length} DDL statements required).`,
          differences: queryList,
        };
      }

      return {
        ok: true,
      };
    } finally {
      await queryRunner.release();
    }
  } finally {
    if (shouldClose && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// CLI entry point
if (require.main === module) {
  (async () => {
    try {
      console.log("Checking database schema baseline compatibility...");
      const { AppDataSource } = require("../src/models/DataSource");
      const result = await checkMigrationBaseline(AppDataSource);

      if (result.ok) {
        console.log("SUCCESS: Database schema matches baseline metadata perfectly.");
        process.exit(0);
      } else {
        console.error("FAILURE: Database schema baseline check failed.");
        console.error("Reason:", result.reason);
        if (result.differences && result.differences.length > 0) {
          console.error("Differences:");
          result.differences.forEach((diff) => console.error(" -", diff));
        }
        process.exit(1);
      }
    } catch (err: any) {
      console.error("FAILURE: An error occurred during schema baseline check.");
      console.error("Error:", err.message || err);
      process.exit(1);
    }
  })();
}
