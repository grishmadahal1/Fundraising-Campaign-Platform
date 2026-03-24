/**
 * User Service — business logic for user registration and authentication.
 * Orchestrates between the repository layer and auth utilities.
 */
import { userRepository } from '@/repositories';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';
import { generateId } from '@/lib/utils';
import type { CreateUserInput, LoginInput, AuthResponse, UserProfile } from '@/types';

export const userService = {
  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const now = new Date().toISOString();
    const user = await userRepository.create({
      id: generateId(),
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
      createdAt: now,
      updatedAt: now,
    });

    const token = await signToken({ userId: user.id, email: user.email });

    return {
      token,
      user: toProfile(user),
    };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = await signToken({ userId: user.id, email: user.email });

    return {
      token,
      user: toProfile(user),
    };
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return toProfile(user);
  },
};

function toProfile(user: { id: string; email: string; name: string; createdAt: string }): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
