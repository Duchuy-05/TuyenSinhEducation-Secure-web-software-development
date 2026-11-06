const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Captured from the TypeScript routers, preserving declaration order.
const routes = {
  registration: ['GET /registrations', 'GET /registrations/:id', 'PATCH /registrations/:id/status', 'POST /registrations', 'PUT /registrations/:id', 'DELETE /registrations/:id'],
  post: ['GET /posts', 'GET /posts/published', 'GET /posts/:slugOrId', 'POST /posts', 'PUT /posts/:id', 'DELETE /posts/:id'],
  upload: ['POST /upload/avatar', 'POST /upload/course-image'],
  payment: ['POST /payments/payos-webhook', 'POST /payments/courses/:courseId/create-link', 'GET /payments/orders/:orderCode'],
};
const src = path.join(__dirname, '../src');
function withStubs(load, paymentService = {}) {
  const original = Module._load;
  Module._load = function(request, parent, ...rest) {
    if (/controllers\/(RegistrationController|PostController|UploadController|PaymentController)$/.test(request)) {
      return new Proxy({}, { get: () => new Proxy({}, { get: () => () => {} }) });
    }
    if (request.endsWith('/upload.middleware')) return { uploadAvatar: { single: () => (req, res, next) => next() }, uploadCourseImage: { single: () => (req, res, next) => next() } };
    if (/services\/(PaymentService|PostService)$/.test(request)) return { PaymentService: paymentService, PostService: {} };
    return original.call(this, request, parent, ...rest);
  };
  try { return load(); } finally { Module._load = original; }
}
function response() { return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; }

test('commerce routers retain TypeScript method, path, and order', () => {
  for (const [name, expected] of Object.entries(routes)) {
    const file = path.join(src, 'routers', name + '.router.js');
    assert.ok(fs.existsSync(file), name + ' JavaScript router must exist');
    const router = withStubs(() => require(file).default);
    assert.deepEqual(router.stack.filter(layer => layer.route).map(({ route }) => Object.keys(route.methods)[0].toUpperCase() + ' ' + route.path), expected);
  }
});

test('payment rejects invalid course ID before reaching the service', async () => {
  const file = path.join(src, 'controllers/PaymentController.js');
  assert.ok(fs.existsSync(file), 'JavaScript payment controller must exist');
  let calls = 0;
  const { PaymentController } = withStubs(() => require(file), { createCoursePaymentLink: async () => { calls++; throw new Error('service reached'); } });
  const res = response();
  await PaymentController.createCoursePaymentLink({ user: { id: 1 }, params: { courseId: 'bad' } }, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { status: 400, message: 'M\u00e3 kh\u00f3a h\u1ecdc kh\u00f4ng h\u1ee3p l\u1ec7' });
  assert.equal(calls, 0);
});

test('post creation rejects a blank title before reaching the service', async () => {
  const file = path.join(src, 'controllers/PostController.js');
  assert.ok(fs.existsSync(file), 'JavaScript post controller must exist');
  const { PostController } = withStubs(() => require(file));
  const res = response();
  await PostController.createPost({ body: { title: '   ' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, 400);
});

