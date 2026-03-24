/**
 * @jest-environment node
 */
import { hashPassword, comparePassword } from '@/lib/auth/password';

describe('password utilities', () => {
  it('hashes a password into salt:hash format', async () => {
    const hash = await hashPassword('mypassword');
    expect(hash).toContain(':');
    const [salt, derived] = hash.split(':');
    expect(salt.length).toBe(32); // 16 bytes hex
    expect(derived.length).toBe(128); // 64 bytes hex
  });

  it('produces different hashes for the same password (unique salt)', async () => {
    const hash1 = await hashPassword('samepassword');
    const hash2 = await hashPassword('samepassword');
    expect(hash1).not.toBe(hash2);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('correcthorse');
    const result = await comparePassword('correcthorse', hash);
    expect(result).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correcthorse');
    const result = await comparePassword('wrongpassword', hash);
    expect(result).toBe(false);
  });
});
