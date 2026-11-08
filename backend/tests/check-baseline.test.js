"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const check_migration_baseline_1 = require("../scripts/check-migration-baseline");
(0, node_test_1.default)("baseline checker rejects a later loaded migration", async () => {
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
    };
    const result = await (0, check_migration_baseline_1.checkMigrationBaseline)(dataSource);
    strict_1.default.equal(result.ok, false);
    strict_1.default.match(result.reason || "", /initial migration only/i);
});
