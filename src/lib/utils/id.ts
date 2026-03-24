/**
 * ID generation utility.
 * Uses crypto.randomUUID for globally unique identifiers.
 */
import crypto from 'crypto';

export function generateId(): string {
  return crypto.randomUUID();
}
