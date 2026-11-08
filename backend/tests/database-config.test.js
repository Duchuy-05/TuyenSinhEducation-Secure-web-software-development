"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const hideBackendEnv = `
  const fs = require('fs');
  const path = require('path');
  const originalExistsSync = fs.existsSync;
  fs.existsSync = (file) =>
    path.basename(file) === '.env' && path.basename(path.dirname(file)) === 'backend'
      ? false
      : originalExistsSync(file);
`;
// Provide a dummy URL so parent process can import and test options without connecting
process.env.MYSQL_URL = process.env.MYSQL_URL || "mysql://dummy:dummy@localhost:3306/dummy";
const DataSource_1 = require("../src/models/DataSource");
(0, node_test_1.default)("AppDataSource configuration", () => {
    const targets = DataSource_1.AppDataSource.options.entities.map((schema) => schema.options.target.name).sort();
    strict_1.default.deepEqual(targets, ["User", "Registration", "Course", "Teacher", "CourseSyllabus", "Post", "Class", "ClassEnrollment", "Schedule", "Announcement", "Order"].sort());
    strict_1.default.equal(DataSource_1.AppDataSource.options.synchronize, false, "synchronize must be false");
    strict_1.default.equal(DataSource_1.AppDataSource.options.migrationsRun, false, "migrationsRun must be false");
    strict_1.default.equal(DataSource_1.AppDataSource.isInitialized, false, "DataSource must not auto-connect on import");
    strict_1.default.equal(DataSource_1.AppDataSource.options.migrationsTableName, "migrations", "migrationsTableName should be migrations");
    strict_1.default.equal(DataSource_1.AppDataSource.options.migrationsTransactionMode, "none", "migrationsTransactionMode should be none due to MySQL DDL non-transactional behavior");
});
(0, node_test_1.default)("DataSource imports successfully in child process with only MYSQL_URL", () => {
    const dummyUrl = "mysql://test_user:test_secret@localhost:3306/test_db";
    const projectRoot = node_path_1.default.resolve(__dirname, "..");
    const script = "const { AppDataSource } = require('./src/models/DataSource'); if (AppDataSource.isInitialized) process.exit(2);";
    const res = (0, node_child_process_1.spawnSync)("node", ["-e", script], {
        cwd: projectRoot,
        env: {
            PATH: process.env.PATH,
            SYSTEMROOT: process.env.SYSTEMROOT,
            MYSQL_URL: dummyUrl,
        },
        encoding: "utf-8",
    });
    strict_1.default.equal(res.status, 0, `Import failed with status ${res.status}. stderr: ${res.stderr}`);
});
(0, node_test_1.default)("DataSource loads DB_TYPE from backend/.env before selecting the driver", () => {
    const projectRoot = node_path_1.default.resolve(__dirname, "..");
    const script = `
    const fs = require('fs');
    const path = require('path');
    const dotenv = require('dotenv');
    const originalExistsSync = fs.existsSync;
    fs.existsSync = (file) =>
      path.basename(file) === '.env' && path.basename(path.dirname(file)) === 'backend'
        ? true
        : originalExistsSync(file);
    dotenv.config = () => {
      process.env.DB_TYPE = 'mariadb';
      return { parsed: { DB_TYPE: 'mariadb' } };
    };
    const { AppDataSource } = require('./src/models/DataSource');
    if (AppDataSource.options.type !== 'mariadb') {
      console.error('Expected mariadb driver, got', AppDataSource.options.type);
      process.exit(1);
    }
  `;
    const res = (0, node_child_process_1.spawnSync)("node", ["-e", script], {
        cwd: projectRoot,
        env: {
            PATH: process.env.PATH,
            SYSTEMROOT: process.env.SYSTEMROOT,
            MYSQL_URL: "mysql://dummy:dummy@localhost:3306/dummy",
        },
        encoding: "utf-8",
    });
    strict_1.default.equal(res.status, 0, res.stderr || res.stdout);
});
(0, node_test_1.default)("loadDatabaseUrl fails clearly without leaking credentials when MYSQL_URL is missing", () => {
    const projectRoot = node_path_1.default.resolve(__dirname, "..");
    const secretCred = "super_secret_token_12345";
    const script = hideBackendEnv + "const { loadDatabaseUrl } = require('./src/config/database'); loadDatabaseUrl();";
    const res = (0, node_child_process_1.spawnSync)("node", ["-e", script], {
        cwd: projectRoot,
        env: {
            PATH: process.env.PATH,
            SYSTEMROOT: process.env.SYSTEMROOT,
            SOME_OTHER_SECRET: secretCred,
        },
        encoding: "utf-8",
    });
    strict_1.default.notEqual(res.status, 0, "Should fail when MYSQL_URL is missing");
    strict_1.default.equal(res.stderr.includes(secretCred), false, "Error output must not leak secret credentials");
    strict_1.default.match(res.stderr, /MYSQL_URL/, "Error should explicitly mention MYSQL_URL is missing or required");
});
(0, node_test_1.default)("DataSource import fails clearly without leaking credentials when MYSQL_URL is missing", () => {
    const projectRoot = node_path_1.default.resolve(__dirname, "..");
    const secretCred = "super_secret_token_12345";
    const script = hideBackendEnv + "require('./src/models/DataSource');";
    const res = (0, node_child_process_1.spawnSync)("node", ["-e", script], {
        cwd: projectRoot,
        env: {
            PATH: process.env.PATH,
            SYSTEMROOT: process.env.SYSTEMROOT,
            SOME_OTHER_SECRET: secretCred,
        },
        encoding: "utf-8",
    });
    strict_1.default.notEqual(res.status, 0, "Should fail when MYSQL_URL is missing");
    strict_1.default.equal(res.stderr.includes(secretCred), false, "Error output must not leak secret credentials");
    strict_1.default.match(res.stderr, /MYSQL_URL/, "Error should explicitly mention MYSQL_URL is missing or required");
});
(0, node_test_1.default)("JavaScript DataSource imports with only MYSQL_URL and uses .js migrations glob", () => {
    const dummyUrl = "mysql://test_user:test_secret@localhost:3306/test_db";
    const projectRoot = node_path_1.default.resolve(__dirname, "..");
    const script = `
    const { AppDataSource } = require('./src/models/DataSource');
    if (AppDataSource.isInitialized) process.exit(2);
    const migrations = AppDataSource.options.migrations || [];
    const hasJsOnly = migrations.every((pattern) => typeof pattern === 'string' && pattern.endsWith('*.js'));
    if (!hasJsOnly) {
      console.error('Migrations in dist must only target *.js files:', migrations);
      process.exit(3);
    }
  `;
    const res = (0, node_child_process_1.spawnSync)("node", ["-e", script], {
        cwd: projectRoot,
        env: {
            PATH: process.env.PATH,
            SYSTEMROOT: process.env.SYSTEMROOT,
            MYSQL_URL: dummyUrl,
        },
        encoding: "utf-8",
    });
    strict_1.default.equal(res.status, 0, `Dist import failed with status ${res.status}. stderr: ${res.stderr}`);
});
