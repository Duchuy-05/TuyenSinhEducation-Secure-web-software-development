const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const Module = require('node:module');
const jwt = require('jsonwebtoken');

const envKeys = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY'];
const previousEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
const dotenv = require('dotenv');
const previousConfig = dotenv.config;
const listeners = Object.fromEntries(['unhandledRejection', 'uncaughtException'].map(event => [event, process.listeners(event)]));
process.env.ACCESS_TOKEN_SECRET = 'contract-secret';
for (const key of ['REFRESH_TOKEN_SECRET', 'PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY']) process.env[key] = 'contract-value';
dotenv.config = () => ({});
const originalLoad = Module._load;
Module._load = function(request, parent, ...rest) {
  if (request.includes('/controllers/')) {
    return new Proxy({}, { get: () => new Proxy({}, { get: (_, name) => (req, res) => {
      if (name === 'login') throw new Error('private-contract-error');
      res.status(204).end();
    } }) });
  }
  if (request.endsWith('/models/DataSource')) return { AppDataSource: { initialize: async () => {} } };
  if (request.endsWith('/upload.middleware')) return new Proxy({}, { get: () => ({ single: () => (req, res, next) => next() }) });
  return originalLoad.call(this, request, parent, ...rest);
};
let app;
try { app = require('../src/index.js').app; } finally {
  Module._load = originalLoad;
  dotenv.config = previousConfig;
  for (const [key, value] of Object.entries(previousEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  for (const [event, before] of Object.entries(listeners)) for (const listener of process.listeners(event)) if (!before.includes(listener)) process.removeListener(event, listener);
}

test('mounted routers preserve endpoints and authentication boundaries', async () => {
  const previousSecret = process.env.ACCESS_TOKEN_SECRET;
  process.env.ACCESS_TOKEN_SECRET = 'contract-secret';
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const cases = [
      ['POST', '/api/auth/register', 204], ['GET', '/api/classes', 204],
      ['GET', '/api/schedules', 401], ['GET', '/api/class-enrollments/myclasses', 401],
      ['GET', '/api/announcements', 204], ['GET', '/api/posts/published', 204],
      ['GET', '/api/users', 401], ['GET', '/api/teachers', 204],
      ['GET', '/api/courses/lecturer', 401], ['GET', '/api/syllabi', 204],
      ['GET', '/api/registrations', 401], ['POST', '/api/payments/payos-webhook', 204],
      ['POST', '/api/upload/avatar', 401],
    ];
    for (const [method, path, status] of cases) assert.equal((await fetch(base + path, { method })).status, status, `${method} ${path}`);
    const token = jwt.sign({ role: 'student' }, 'contract-secret');
    assert.equal((await fetch(base + '/api/users', { headers: { cookie: `access_token=${token}` } })).status, 403);
    const missing = await fetch(base + '/api/no-such-route');
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { status: 404, message: 'Không tìm thấy đường dẫn yêu cầu' });
    const failure = await fetch(base + '/api/auth/login', { method: 'POST' });
    assert.equal(failure.status, 500);
    const body = await failure.json();
    assert.equal(body.status, 500);
    assert.equal(body.message, 'Đã có lỗi xảy ra, vui lòng thử lại sau');
    assert.ok(!JSON.stringify(body).includes('private-contract-error'));
    const allowed = await fetch(base + '/api/no-such-route', { headers: { origin: 'http://localhost:5173' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true');
    assert.ok(allowed.headers.get('content-security-policy').includes("default-src 'self'"));
    const disallowed = await fetch(base + '/api/no-such-route', { headers: { origin: 'https://untrusted.example' } });
    assert.equal(disallowed.headers.get('access-control-allow-origin'), null);
  } finally {
    if (previousSecret === undefined) delete process.env.ACCESS_TOKEN_SECRET; else process.env.ACCESS_TOKEN_SECRET = previousSecret;
    await new Promise(resolve => server.close(resolve));
  }
});

test('startup fails for each missing required environment key', () => {
  for (const missing of envKeys) {
    const env = { ...process.env, PORT: '0' };
    for (const key of envKeys) env[key] = 'present';
    delete env[missing];
    const child = spawnSync(process.execPath, ['-r', './tests/startup-contract-preload.cjs', './src/index.js'], {
      cwd: require('node:path').join(__dirname, '..'), encoding: 'utf8', env, timeout: 3000,
    });
    assert.equal(child.error, undefined, `${missing}: child must fail before timeout`);
    assert.notEqual(child.status, 0, missing);
    assert.match(child.stderr, new RegExp(missing));
  }
});

test('application mounts routers in the original prefix and order', () => {
  const names = ['auth', 'class', 'schedule', 'classenrollment', 'announcement', 'post', 'user', 'teacher', 'course', 'syllabus', 'registration', 'payment', 'user', 'upload'];
  const routers = names.map(name => require(`../src/routers/${name}.router.js`).default);
  const mounts = app.router.stack.filter(layer => routers.includes(layer.handle));
  assert.deepEqual(mounts.map(layer => routers.indexOf(layer.handle)), routers.map(router => routers.indexOf(router)));
  assert.deepEqual(mounts.map(layer => [layer.match('/api'), layer.match('/api/auth')]), names.map(name => name === 'auth' ? [false, true] : [true, true]));
});

