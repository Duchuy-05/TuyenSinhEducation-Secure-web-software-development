import {
  assertSafeInput,
  parsePagination,
  parsePositiveInteger,
  pickAllowedFields,
} from './inputValidation';
import { inputGuard } from '../middlewares/inputGuard.middleware';

const assert = {
  equal(actual: unknown, expected: unknown) {
    if (actual !== expected) throw new Error(`expected ${String(expected)}, received ${String(actual)}`);
  },
  deepEqual(actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  },
  throws(action: () => void, expected: RegExp) {
    try {
      action();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (expected.test(message)) return;
      throw new Error(`expected error ${expected}, received ${message}`);
    }
    throw new Error(`expected action to throw ${expected}`);
  },
};

function run(name: string, testCase: () => void) {
  testCase();
  console.log(`passed: ${name}`);
}

run('parsePositiveInteger rejects SQL-like and non-scalar identifiers', () => {
  for (const value of ['1 OR 1=1', '1; DROP TABLE users', '1e3', 0, -1, 1.5, ['1'], { id: 1 }]) {
    assert.throws(() => parsePositiveInteger(value, 'id'), /id/);
  }
});

run('parsePositiveInteger accepts canonical positive integers only', () => {
  assert.equal(parsePositiveInteger('42', 'id'), 42);
  assert.equal(parsePositiveInteger(42, 'id'), 42);
});

run('parsePagination applies safe defaults and caps the result size', () => {
  assert.deepEqual(parsePagination(undefined, undefined), { page: 1, limit: 10 });
  assert.deepEqual(parsePagination('2', '100'), { page: 2, limit: 100 });
  assert.throws(() => parsePagination('1', '101'), /limit/);
  assert.throws(() => parsePagination('1 OR 1=1', '10'), /page/);
});

run('assertSafeInput rejects prototype-pollution and operator keys at any depth', () => {
  const constructorPayload = JSON.parse('{"profile":{"constructor":{"prototype":{"admin":true}}}}');
  const operatorPayload = { filter: { $where: 'sleep(1000)' } };

  assert.throws(() => assertSafeInput(constructorPayload), /constructor/);
  assert.throws(() => assertSafeInput(operatorPayload), /\$where/);
});

run('pickAllowedFields removes relationship and identity fields supplied by clients', () => {
  const selected = pickAllowedFields(
    { sessionTitle: 'Buổi 1', startTime: '2026-11-05T08:00:00Z', classId: 999, id: 12, teacherId: 7 },
    ['sessionTitle', 'startTime'] as const,
  );

  assert.deepEqual(selected, {
    sessionTitle: 'Buổi 1',
    startTime: '2026-11-05T08:00:00Z',
  });
});

run('inputGuard rejects dangerous request keys before route handlers execute', () => {
  let nextCalled = false;
  let statusCode = 0;
  let responseBody: any;
  const request = { body: JSON.parse('{"__proto__":{"isAdmin":true}}'), query: {}, params: {} };
  const response = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: unknown) {
      responseBody = body;
      return this;
    },
  };

  inputGuard(request as any, response as any, () => { nextCalled = true; });

  assert.equal(statusCode, 400);
  assert.equal(nextCalled, false);
  assert.equal(responseBody.status, 400);
});
