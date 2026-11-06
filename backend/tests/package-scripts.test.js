const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');

test('package scripts run JavaScript source and migrations', () => {
  assert.equal(pkg.type, 'commonjs');
  assert.equal(pkg.scripts.test, 'node --test --test-concurrency=1 "tests/**/*.test.js" "src/**/*.test.js"');
  assert.match(pkg.scripts.start, /src\/index\.js/);
  assert.match(pkg.scripts.dev, /src\/index\.js/);
  for (const command of Object.values(pkg.scripts)) assert.doesNotMatch(command, /ts-node|\btsc\b|dist\/.*\.js/);
  for (const operation of ['generate', 'show', 'run', 'revert']) {
    assert.match(pkg.scripts[`migration:${operation}`], /src\/models\/DataSource\.js/);
    assert.match(pkg.scripts[`migration:${operation}`], /typeorm\/cli\.js/);
  }
  assert.match(pkg.scripts['migration:generate'], /(?:^|\s)-o(?:\s|$)/);
  assert.equal(pkg.scripts['migration:check-baseline'], 'node scripts/check-migration-baseline.js');
});

test('Docker starts the JavaScript application', () => {
  const dockerfile = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
  assert.match(dockerfile, /CMD\s*\[\s*"npm",\s*"start"\s*\]/);
  assert.doesNotMatch(dockerfile, /\btsc\b/);
});
