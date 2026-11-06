const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const express = require('express');
const jwt = require('jsonwebtoken');

// Captured from the TypeScript routers before conversion, including declaration order.
const routes = {
  "course": [
    "GET /courses/lecturer",
    "POST /courses/draft",
    "GET /courses/draft/:courseGroupId",
    "PUT /courses/draft/:courseGroupId",
    "POST /courses/:courseGroupId/publish",
    "PATCH /courses/draft/:courseGroupId/unpublish",
    "GET /courses",
    "GET /courses/pagination",
    "GET /courses/:id",
    "POST /courses",
    "PUT /courses/:id",
    "DELETE /courses/:id"
  ],
  "class": [
    "GET /classes",
    "GET /classes/:id",
    "POST /classes",
    "PUT /classes/:id"
  ],
  "syllabus": [
    "GET /syllabi",
    "GET /syllabi/:id",
    "GET /courses/:courseId/syllabi",
    "POST /syllabi",
    "PUT /syllabi/:id",
    "POST /courses/:courseId/syllabi/bulk",
    "PUT /courses/:courseId/syllabus",
    "DELETE /syllabi/:id"
  ],
  "schedule": [
    "GET /schedules/my-upcoming",
    "GET /schedules",
    "GET /schedules/:id",
    "POST /schedules",
    "POST /schedules/bulk",
    "PUT /schedules/:id",
    "DELETE /schedules/:id"
  ],
  "classenrollment": [
    "GET /class-enrollments/myclasses",
    "GET /class-enrollments",
    "POST /class-enrollments",
    "POST /class-enrollments/bulk",
    "PUT /class-enrollments/:id",
    "DELETE /class-enrollments/:id"
  ],
  "announcement": [
    "GET /announcements/my",
    "GET /announcements",
    "GET /announcements/:id",
    "POST /announcements",
    "PUT /announcements/:id",
    "DELETE /announcements/:id"
  ]
};
const routerPath = name => path.join(__dirname, '../src/routers', name + '.router.js');
function loadRouter(name) {
  const original = Module._load;
  Module._load = function(request, parent, ...rest) {
    if (/controllers\/(CourseController|ClassController|CourseSyllabusController|ScheduleController|ClassEnrollmentController|AnnouncementController)$/.test(request)) {
      const handler = () => { throw new Error('controller boundary reached'); };
      return new Proxy({}, { get: () => new Proxy({}, { get: () => handler }) });
    }
    if (request.endsWith('/upload.middleware')) return { uploadCourseImage: { single: () => (req, res, next) => next() } };
    return original.call(this, request, parent, ...rest);
  };
  try { return require(routerPath(name)).default; } finally { Module._load = original; }
}

test('learning routers retain TypeScript route methods, paths, and order', () => {
  for (const [name, expected] of Object.entries(routes)) {
    assert.ok(fs.existsSync(routerPath(name)), name + ' JavaScript router must exist');
    const actual = loadRouter(name).stack.filter(layer => layer.route).map(({route}) => Object.keys(route.methods)[0].toUpperCase() + ' ' + route.path);
    assert.deepEqual(actual, expected);
  }
});

test('class creation rejects missing credentials and student role', async () => {
  const app = express();
  app.use((req, res, next) => { req.cookies = {}; if (req.headers.authorization) req.cookies.access_token = req.headers.authorization; next(); });
  app.use(loadRouter('class'));
  const previousSecret = process.env.ACCESS_TOKEN_SECRET;
  const server = app.listen(0);
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const url = 'http://127.0.0.1:' + server.address().port + '/classes';
    assert.equal((await fetch(url, { method: 'POST' })).status, 401);
    process.env.ACCESS_TOKEN_SECRET = 'test-only-secret';
    const token = jwt.sign({ role: 'student' }, process.env.ACCESS_TOKEN_SECRET);
    assert.equal((await fetch(url, { method: 'POST', headers: { authorization: token } })).status, 403);
  } finally { if (previousSecret === undefined) delete process.env.ACCESS_TOKEN_SECRET; else process.env.ACCESS_TOKEN_SECRET = previousSecret; await new Promise(resolve => server.close(resolve)); }
});
