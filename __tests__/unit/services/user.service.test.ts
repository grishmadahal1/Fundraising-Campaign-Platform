/**
 * @jest-environment node
 */

// Mock jose before any imports that depend on it
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  })),
  jwtVerify: jest.fn(),
}));

jest.mock('@/repositories/user.repository');
jest.mock('@/lib/auth/password');
jest.mock('@/lib/auth/jwt');

import { userService } from '@/services/user.service';
import { userRepository } from '@/repositories/user.repository';
import * as passwordUtils from '@/lib/auth/password';
import * as jwtUtils from '@/lib/auth/jwt';

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;
const mockPassword = passwordUtils as jest.Mocked<typeof passwordUtils>;
const mockJwt = jwtUtils as jest.Mocked<typeof jwtUtils>;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user and returns auth response', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockPassword.hashPassword.mockResolvedValue('salt:hash');
      mockUserRepo.create.mockImplementation(async (user) => user);
      mockJwt.signToken.mockResolvedValue('mock-token');

      const result = await userService.register({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('jane@example.com');
      expect(result.user.name).toBe('Jane Smith');
      expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
      expect(mockPassword.hashPassword).toHaveBeenCalledWith('password123');
    });

    it('throws if email is already registered', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 'existing',
        email: 'jane@example.com',
        name: 'Jane',
        passwordHash: 'hash',
        createdAt: '',
        updatedAt: '',
      });

      await expect(
        userService.register({
          name: 'Jane',
          email: 'jane@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-1',
      email: 'jane@example.com',
      name: 'Jane Smith',
      passwordHash: 'salt:hash',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('returns auth response for valid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockPassword.comparePassword.mockResolvedValue(true);
      mockJwt.signToken.mockResolvedValue('mock-token');

      const result = await userService.login({
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.id).toBe('user-1');
    });

    it('throws for non-existent email', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        userService.login({ email: 'unknown@example.com', password: 'pass' })
      ).rejects.toThrow('Invalid email or password');
    });

    it('throws for wrong password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockPassword.comparePassword.mockResolvedValue(false);

      await expect(
        userService.login({ email: 'jane@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getProfile', () => {
    it('returns user profile without passwordHash', async () => {
      mockUserRepo.findById.mockResolvedValue({
        id: 'user-1',
        email: 'jane@example.com',
        name: 'Jane Smith',
        passwordHash: 'secret',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      const profile = await userService.getProfile('user-1');

      expect(profile).toEqual({
        id: 'user-1',
        email: 'jane@example.com',
        name: 'Jane Smith',
        createdAt: '2024-01-01T00:00:00Z',
      });
      expect(profile).not.toHaveProperty('passwordHash');
    });

    it('throws if user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.getProfile('missing')).rejects.toThrow('User not found');
    });
  });
});
