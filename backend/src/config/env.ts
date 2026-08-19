import dotenv from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
} else {
    console.warn('[ENV] Không tìm thấy file .env tại:', envPath);
}

export const REQUIRED_ENV_KEYS = [
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'PAYOS_CLIENT_ID',
    'PAYOS_API_KEY',
    'PAYOS_CHECKSUM_KEY',
] as const;

export function getMissingEnvKeys(keys: readonly string[]) {
    return keys.filter((key) => {
        const value = process.env[key];
        return !value || value.trim() === '';
    });
}

export function getRequiredEnvValue(key: string): string {
    const value = process.env[key];
    if (!value || value.trim() === '') {
        throw new Error(`Server chưa cấu hình ${key}`);
    }

    return value.trim();
}

export function validateRequiredEnv(keys: readonly string[] = REQUIRED_ENV_KEYS) {
    const missingKeys = getMissingEnvKeys(keys);
    if (missingKeys.length > 0) {
        throw new Error(`Server chưa cấu hình biến môi trường bắt buộc: ${missingKeys.join(', ')}`);
    }
}