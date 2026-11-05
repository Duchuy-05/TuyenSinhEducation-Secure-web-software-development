import test from "node:test";
import assert from "node:assert/strict";
import { DataSource } from "typeorm";
import { checkMigrationBaseline } from "../scripts/check-migration-baseline";

test("baseline checker rejects a later loaded migration", async () => {
  const dataSource = {
    isInitialized: true,
    migrations: [
      { name: "InitialSchema1793750400000" },
      { name: "FutureSchema1800000000000" },
    ],
    createQueryRunner: () => ({
      hasTable: async () => false,
      release: async () => undefined,
    }),
    driver: {
      createSchemaBuilder: () => ({
        log: async () => ({ upQueries: [] }),
      }),
    },
  } as unknown as DataSource;

  const result = await checkMigrationBaseline(dataSource);
  assert.equal(result.ok, false);
  assert.match(result.reason || "", /initial migration only/i);
});
