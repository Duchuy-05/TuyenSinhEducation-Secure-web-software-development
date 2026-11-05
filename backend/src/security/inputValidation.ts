export class InputValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = 'InputValidationError';
  }
}

export function parsePositiveInteger(value: unknown, field: string, maximum = Number.MAX_SAFE_INTEGER): number {
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

export function parsePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  return {
    page: page === undefined ? 1 : parsePositiveInteger(page, 'page'),
    limit: limit === undefined ? 10 : parsePositiveInteger(limit, 'limit', 100),
  };
}

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export function assertSafeInput(value: unknown, path = 'input', depth = 0): void {
  if (depth > 20) {
    throw new InputValidationError(`${path} lồng nhau quá sâu`);
  }

  if (value === null || value === undefined || typeof value !== 'object') return;

  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key) || key.startsWith('$')) {
      throw new InputValidationError(`${path} chứa khóa không được phép: ${key}`);
    }
    assertSafeInput(child, `${path}.${key}`, depth + 1);
  }
}

export function pickAllowedFields<T extends readonly string[]>(
  body: unknown,
  allowedFields: T,
): Partial<Record<T[number], unknown>> {
  assertSafeInput(body);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new InputValidationError('Nội dung request phải là một object');
  }

  const source = body as Record<string, unknown>;
  const selected: Partial<Record<T[number], unknown>> = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      selected[field as T[number]] = source[field];
    }
  }
  return selected;
}
