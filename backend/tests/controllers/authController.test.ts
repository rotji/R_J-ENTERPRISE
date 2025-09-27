import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../../src/controllers/authController';
import User from '../../src/database/models/User';

// Mock dependencies
vi.mock('jsonwebtoken');
vi.mock('../../src/database/models/User');

describe('Auth Controller Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockUser: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-jwt-secret';

    mockReq = {
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      password: 'hashedpassword',
    };

    // Setup JWT mock
    vi.mocked(jwt.sign).mockReturnValue('mock-jwt-token' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      vi.mocked(User.findOne).mockResolvedValue(null); // No existing user
      vi.mocked(User.create).mockResolvedValue(mockUser);

      // Act
      await registerUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        token: 'mock-jwt-token',
      });
    });

    it('should reject registration with existing email', async () => {
      // Arrange
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser); // Existing user found

      // Act
      await registerUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });

    it('should handle validation errors', async () => {
      // Arrange
      mockReq.body = {
        username: '',
        email: 'invalid-email',
        password: '123',
      };

      const validationError = {
        name: 'ValidationError',
        errors: {
          username: { message: 'Username is required' },
          email: { message: 'Please provide a valid email' },
          password: { message: 'Password must be at least 6 characters' },
        },
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockRejectedValue(validationError);

      // Act
      await registerUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Username is required, Please provide a valid email, Password must be at least 6 characters',
      });
    });

    it('should handle server errors', async () => {
      // Arrange
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const serverError = new Error('Database connection failed');
      vi.mocked(User.findOne).mockRejectedValue(serverError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await registerUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Registration Error:', serverError);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
      });

      consoleSpy.mockRestore();
    });

    it('should handle missing required fields', async () => {
      // Arrange
      mockReq.body = {
        username: 'testuser',
        // Missing email and password
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue(mockUser);

      // Act
      await registerUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: undefined,
        password: undefined,
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUserWithMethods = {
        ...mockUser,
        matchPassword: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUserWithMethods);

      // Act
      await loginUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUserWithMethods.matchPassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        token: 'mock-jwt-token',
      });
    });

    it('should reject login with invalid credentials', async () => {
      // Arrange
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUserWithMethods = {
        ...mockUser,
        matchPassword: vi.fn().mockResolvedValue(false),
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUserWithMethods);

      // Act
      await loginUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    it('should reject login with non-existent user', async () => {
      // Arrange
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      vi.mocked(User.findOne).mockResolvedValue(null);

      // Act
      await loginUser(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });
  });
});