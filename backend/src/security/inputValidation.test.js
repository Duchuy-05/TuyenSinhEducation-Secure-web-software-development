"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inputValidation_1 = require("./inputValidation");
const inputGuard_middleware_1 = require("../middlewares/inputGuard.middleware");
const { getOtpEmailTemplate } = require('../utils/emailTemplates');

const assert = {
    equal(actual, expected) {
        if (actual !== expected)
            throw new Error(`expected ${String(expected)}, received ${String(actual)}`);
    },
    deepEqual(actual, expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
        }
    },
    throws(action, expected) {
        try {
            action();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (expected.test(message))
                return;
            throw new Error(`expected error ${expected}, received ${message}`);
        }
        throw new Error(`expected action to throw ${expected}`);
    },
};
function run(name, testCase) {
    testCase();
    console.log(`passed: ${name}`);
}
run('email template retains the font family, OTP, and year', () => {
    const html = getOtpEmailTemplate('123456', 2026);
    assert.equal(html.includes("font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"), true);
    assert.equal(html.includes('123456'), true);
    assert.equal(html.includes('2026'), true);
});
run('parsePositiveInteger rejects SQL-like and non-scalar identifiers', () => {
    for (const value of ['1 OR 1=1', '1; DROP TABLE users', '1e3', 0, -1, 1.5, '9007199254740992', ['1'], { id: 1 }]) {
        assert.throws(() => (0, inputValidation_1.parsePositiveInteger)(value, 'id'), /id/);
    }
});
run('parsePositiveInteger accepts canonical positive integers only', () => {
    assert.equal((0, inputValidation_1.parsePositiveInteger)('42', 'id'), 42);
    assert.equal((0, inputValidation_1.parsePositiveInteger)(42, 'id'), 42);
});
run('parsePagination applies safe defaults and caps the result size', () => {
    assert.deepEqual((0, inputValidation_1.parsePagination)(undefined, undefined), { page: 1, limit: 10 });
    assert.deepEqual((0, inputValidation_1.parsePagination)('2', '100'), { page: 2, limit: 100 });
    assert.throws(() => (0, inputValidation_1.parsePagination)('1', '101'), /limit/);
    assert.throws(() => (0, inputValidation_1.parsePagination)('1 OR 1=1', '10'), /page/);
});
run('assertSafeInput rejects prototype-pollution and operator keys at any depth', () => {
    const constructorPayload = JSON.parse('{"profile":{"constructor":{"prototype":{"admin":true}}}}');
    const operatorPayload = { filter: { $where: 'sleep(1000)' } };
    assert.throws(() => (0, inputValidation_1.assertSafeInput)(constructorPayload), /constructor/);
    assert.throws(() => (0, inputValidation_1.assertSafeInput)(operatorPayload), /\$where/);
});
run('pickAllowedFields removes relationship and identity fields supplied by clients', () => {
    const selected = (0, inputValidation_1.pickAllowedFields)({ sessionTitle: 'Buổi 1', startTime: '2026-11-05T08:00:00Z', classId: 999, id: 12, teacherId: 7 }, ['sessionTitle', 'startTime']);
    assert.deepEqual(selected, {
        sessionTitle: 'Buổi 1',
        startTime: '2026-11-05T08:00:00Z',
    });
});
run('inputGuard rejects dangerous request keys before route handlers execute', () => {
    let nextCalled = false;
    let statusCode = 0;
    let responseBody;
    const request = { body: JSON.parse('{"__proto__":{"isAdmin":true}}'), query: {}, params: {} };
    const response = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(body) {
            responseBody = body;
            return this;
        },
    };
    (0, inputGuard_middleware_1.inputGuard)(request, response, () => { nextCalled = true; });
    assert.equal(statusCode, 400);
    assert.equal(nextCalled, false);
    assert.equal(responseBody.status, 400);
    assert.equal(responseBody.message.includes('__proto__'), true);
});
