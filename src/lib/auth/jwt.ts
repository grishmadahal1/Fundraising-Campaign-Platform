/**
 * JWT utilities for token creation and verification.
 */
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from '@/config/env';

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
}

function getSecret(): Uint8Array {
  return new TextEncoder().encode(env.auth.jwtSecret());
}

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.auth.tokenExpiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as TokenPayload;
}
