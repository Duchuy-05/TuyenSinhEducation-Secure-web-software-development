const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const express = require('express');
const jwt = require('jsonwebtoken');

const routes = {
  auth: ['POST /register', 'POST /login', 'GET /refresh', 'POST /verify-otp', 'POST /google', 'POST /logout'],
  user: ['GET /users', 'GET /users/:id', 'DELETE /users/:id', 'PUT /users/me', 'PUT /users/me/password'],
  teacher: ['GET /teachers', 'GET /teachers/pagination', 'GET /teachers/:id', 'POST /teachers', 'DELETE /teachers/:id', 'PUT /teachers/:id', 'POST /upload'],
};
const routerPath = name => path.join(__dirname, '../src/routers', `${name}.router.js`);
function loadRouter(name) {
  const original = Module._load;
  Module._load = function(request, parent, ...rest) {
    if (/controllers\/(AuthControllers|UserController|TeacherController)$/.test(request)) {
      const handler = () => { throw new Error('controller boundary reached'); };
      return new Proxy({}, { get: () => new Proxy({}, { get: () => handler }) });
    }
    if (request.endsWith('/upload.middleware')) return { uploadAvatar: { single: () => (req, res, next) => next() } };
    return original.call(this, request, parent, ...rest);
  };
  try { return require(routerPath(name)).default; } finally { Module._load = original; }
}

test('converted routers retain the original route methods and paths', () => {
  for (const [name, expected] of Object.entries(routes)) {
    assert.ok(fs.existsSync(routerPath(name)), `${name} JavaScript router must exist`);
    const router = loadRouter(name);
    const actual = router.stack.filter(layer => layer.route).map(({route}) => `${Object.keys(route.methods)[0].toUpperCase()} ${route.path}`);
    assert.deepEqual(actual, expected);
  }
});

test('protected user route rejects missing token and non-admin role', async () => {
  const app = express();
  app.use((req, res, next) => { req.cookies = {}; if (req.headers.authorization) req.cookies.access_token = req.headers.authorization; next(); });
  app.use(loadRouter('user'));
  const previousSecret = process.env.ACCESS_TOKEN_SECRET;
  const server = app.listen(0);
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/users`;
    assert.equal((await fetch(url)).status, 401);
    process.env.ACCESS_TOKEN_SECRET = 'test-only-secret';
    const token = jwt.sign({ role: 'student' }, process.env.ACCESS_TOKEN_SECRET);
    assert.equal((await fetch(url, { headers: { authorization: token } })).status, 403);
  } finally { if (previousSecret === undefined) delete process.env.ACCESS_TOKEN_SECRET; else process.env.ACCESS_TOKEN_SECRET = previousSecret; await new Promise(resolve => server.close(resolve)); }
});
