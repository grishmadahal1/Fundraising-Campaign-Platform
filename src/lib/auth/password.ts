/**
 * Password hashing utilities using the Web Crypto API.
 * Uses PBKDF2 — no native addon dependencies required.
 */
import crypto from 'crypto';

const SALT_LENGTH = 16;
const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

export async function comparePassword(password: string, stored: string): Promise<boolean> {
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return hash === originalHash;
}
