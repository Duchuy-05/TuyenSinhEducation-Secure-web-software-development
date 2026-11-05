import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

// Provide a dummy URL so parent process can import and test options without connecting
process.env.MYSQL_URL = process.env.MYSQL_URL || "mysql://dummy:dummy@localhost:3306/dummy";
import { AppDataSource } from "../src/models/DataSource";

test("AppDataSource configuration", () => {
  assert.equal(AppDataSource.options.synchronize, false, "synchronize must be false");
  assert.equal(AppDataSource.options.migrationsRun, false, "migrationsRun must be false");
  assert.equal(AppDataSource.isInitialized, false, "DataSource must not auto-connect on import");
  assert.equal(
    (AppDataSource.options as any).migrationsTableName,
    "migrations",
    "migrationsTableName should be migrations"
  );
  assert.equal(
    (AppDataSource.options as any).migrationsTransactionMode,
    "none",
    "migrationsTransactionMode should be none due to MySQL DDL non-transactional behavior"
  );
});

test("DataSource imports successfully in child process with only MYSQL_URL", () => {
  const dummyUrl = "mysql://test_user:test_secret@localhost:3306/test_db";
  const projectRoot = path.resolve(__dirname, "..");
  const script = "const { AppDataSource } = require('./src/models/DataSource'); if (AppDataSource.isInitialized) process.exit(2);";

  const res = spawnSync("node", ["-r", "ts-node/register", "-e", script], {
    cwd: projectRoot,
    env: {
      PATH: process.env.PATH,
      SYSTEMROOT: process.env.SYSTEMROOT,
      MYSQL_URL: dummyUrl,
    },
    encoding: "utf-8",
  });

  assert.equal(
    res.status,
    0,
    `Import failed with status ${res.status}. stderr: ${res.stderr}`
  );
});

test("DataSource loads DB_TYPE from backend/.env before selecting the driver", () => {
  const projectRoot = path.resolve(__dirname, "..");
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
  const res = spawnSync("node", ["-r", "ts-node/register", "-e", script], {
    cwd: projectRoot,
    env: {
      PATH: process.env.PATH,
      SYSTEMROOT: process.env.SYSTEMROOT,
      MYSQL_URL: "mysql://dummy:dummy@localhost:3306/dummy",
    },
    encoding: "utf-8",
  });
  assert.equal(res.status, 0, res.stderr || res.stdout);
});

test("loadDatabaseUrl fails clearly without leaking credentials when MYSQL_URL is missing", () => {
  const projectRoot = path.resolve(__dirname, "..");
  const secretCred = "super_secret_token_12345";
  const script = "const { loadDatabaseUrl } = require('./src/config/database'); loadDatabaseUrl();";

  const res = spawnSync("node", ["-r", "ts-node/register", "-e", script], {
    cwd: projectRoot,
    env: {
      PATH: process.env.PATH,
      SYSTEMROOT: process.env.SYSTEMROOT,
      SOME_OTHER_SECRET: secretCred,
    },
    encoding: "utf-8",
  });

  assert.notEqual(res.status, 0, "Should fail when MYSQL_URL is missing");
  assert.equal(
    res.stderr.includes(secretCred),
    false,
    "Error output must not leak secret credentials"
  );
  assert.match(
    res.stderr,
    /MYSQL_URL/,
    "Error should explicitly mention MYSQL_URL is missing or required"
  );
});

test("DataSource import fails clearly without leaking credentials when MYSQL_URL is missing", () => {
  const projectRoot = path.resolve(__dirname, "..");
  const secretCred = "super_secret_token_12345";
  const script = "require('./src/models/DataSource');";

  const res = spawnSync("node", ["-r", "ts-node/register", "-e", script], {
    cwd: projectRoot,
    env: {
      PATH: process.env.PATH,
      SYSTEMROOT: process.env.SYSTEMROOT,
      SOME_OTHER_SECRET: secretCred,
    },
    encoding: "utf-8",
  });

  assert.notEqual(res.status, 0, "Should fail when MYSQL_URL is missing");
  assert.equal(
    res.stderr.includes(secretCred),
    false,
    "Error output must not leak secret credentials"
  );
  assert.match(
    res.stderr,
    /MYSQL_URL/,
    "Error should explicitly mention MYSQL_URL is missing or required"
  );
});


test("Dist DataSource imports with only MYSQL_URL and uses .js migrations glob", () => {
  const dummyUrl = "mysql://test_user:test_secret@localhost:3306/test_db";
  const projectRoot = path.resolve(__dirname, "..");
  const script = `
    const { AppDataSource } = require('./dist/models/DataSource');
    if (AppDataSource.isInitialized) process.exit(2);
    const migrations = AppDataSource.options.migrations || [];
    const hasJsOnly = migrations.every((pattern) => typeof pattern === 'string' && pattern.endsWith('*.js'));
    if (!hasJsOnly) {
      console.error('Migrations in dist must only target *.js files:', migrations);
      process.exit(3);
    }
  `;

  const res = spawnSync("node", ["-e", script], {
    cwd: projectRoot,
    env: {
      PATH: process.env.PATH,
      SYSTEMROOT: process.env.SYSTEMROOT,
      MYSQL_URL: dummyUrl,
    },
    encoding: "utf-8",
  });

  assert.equal(
    res.status,
    0,
    `Dist import failed with status ${res.status}. stderr: ${res.stderr}`
  );
});
