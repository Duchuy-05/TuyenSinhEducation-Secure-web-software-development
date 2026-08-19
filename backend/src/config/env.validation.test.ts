import assert from 'node:assert/strict';
import { getMissingEnvKeys } from './env';

const backupDefined = process.env.TEST_ENV_DEFINED;
const backupBlank = process.env.TEST_ENV_BLANK;
const backupMissing = process.env.TEST_ENV_MISSING;

process.env.TEST_ENV_DEFINED = 'ready';
process.env.TEST_ENV_BLANK = '   ';
delete process.env.TEST_ENV_MISSING;

const missing = getMissingEnvKeys(['TEST_ENV_DEFINED', 'TEST_ENV_BLANK', 'TEST_ENV_MISSING']);

assert.deepEqual(missing, ['TEST_ENV_BLANK', 'TEST_ENV_MISSING']);

if (backupDefined === undefined) {
    delete process.env.TEST_ENV_DEFINED;
} else {
    process.env.TEST_ENV_DEFINED = backupDefined;
}

if (backupBlank === undefined) {
    delete process.env.TEST_ENV_BLANK;
} else {
    process.env.TEST_ENV_BLANK = backupBlank;
}

if (backupMissing === undefined) {
    delete process.env.TEST_ENV_MISSING;
} else {
    process.env.TEST_ENV_MISSING = backupMissing;
}

console.log('env.validation.test.ts passed');
