"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = void 0;
exports.parsePositiveInteger = parsePositiveInteger;
exports.parsePagination = parsePagination;
exports.assertSafeInput = assertSafeInput;
exports.pickAllowedFields = pickAllowedFields;
class InputValidationError extends Error {
    status = 400;
    constructor(message) {
        super(message);
        this.name = 'InputValidationError';
    }
}
exports.InputValidationError = InputValidationError;
function parsePositiveInteger(value, field, maximum = Number.MAX_SAFE_INTEGER) {
    const isCanonicalString = typeof value === 'string' && /^[1-9]\d*$/.test(value);
    const isIntegerNumber = typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
    if (!isCanonicalString && !isIntegerNumber) {
        throw new InputValidationError(`${field} phải là số nguyên dương hợp lệ`);
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isSafeInteger(parsed) || parsed > maximum) {
        throw new InputValidationError(`${field} vượt quá giới hạn cho phép`);
    }
    return parsed;
}
function parsePagination(page, limit) {
    return {
        page: page === undefined ? 1 : parsePositiveInteger(page, 'page'),
        limit: limit === undefined ? 10 : parsePositiveInteger(limit, 'limit', 100),
    };
}
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
function assertSafeInput(value, path = 'input', depth = 0) {
    if (depth > 20) {
        throw new InputValidationError(`${path} lồng nhau quá sâu`);
    }
    if (value === null || value === undefined || typeof value !== 'object')
        return;
    for (const [key, child] of Object.entries(value)) {
        if (FORBIDDEN_KEYS.has(key) || key.startsWith('$')) {
            throw new InputValidationError(`${path} chứa khóa không được phép: ${key}`);
        }
        assertSafeInput(child, `${path}.${key}`, depth + 1);
    }
}
function pickAllowedFields(body, allowedFields) {
    assertSafeInput(body);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new InputValidationError('Nội dung request phải là một object');
    }
    const source = body;
    const selected = {};
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(source, field)) {
            selected[field] = source[field];
        }
    }
    return selected;
}
