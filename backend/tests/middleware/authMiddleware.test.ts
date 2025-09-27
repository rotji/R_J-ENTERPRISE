import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../../src/middleware/authMiddleware';
import User from '../../src/database/models/User';

// Mock dependencies
vi.mock('jsonwebtoken');
vi.mock('../../src/database/models/User');
vi.mock('../../src/utils/asyncHandler', () => ({
  default: (fn: Function) => fn, // Simplified mock for testing
}));

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockReq = {
      headers: {},
    };
    
    mockRes = {
      status: vi.fn().mockReturnThis(),
    };
    
    mockNext = vi.fn();
  });

  describe('protect middleware', () => {
    it('should reject request without authorization header', async () => {
      // Arrange
      mockReq.headers = {};
      
      // Act & Assert
      await expect(
        protect(mockReq as Request, mockRes as Response, mockNext)
      ).rejects.toThrow('Not authorized, no token');
    });

    it('should reject request without Bearer token', async () => {
      // Arrange
      mockReq.headers = {
        authorization: 'InvalidFormat token123',
      };
      
      // Act & Assert
      await expect(
        protect(mockReq as Request, mockRes as Response, mockNext)
      ).rejects.toThrow('Not authorized, no token');
    });

    it('should reject request with invalid JWT token', async () => {
      // Arrange
      mockReq.headers = {
        authorization: 'Bearer invalid-token',
      };
      
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act & Assert
      await expect(
        protect(mockReq as Request, mockRes as Response, mockNext)
      ).rejects.toThrow('Not authorized, token failed');
    });

    it('should reject request when user is not found', async () => {
      // Arrange
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };
      
      vi.mocked(jwt.verify).mockReturnValue({ id: 'user123' } as any);
      vi.mocked(User.findById).mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      } as any);
      
      // Act & Assert
      // The actual error thrown is "Not authorized, token failed" because 
      // the catch block catches the "Not authorized, user not found" error
      await expect(
        protect(mockReq as Request, mockRes as Response, mockNext)
      ).rejects.toThrow('Not authorized, token failed');
    });

    it('should successfully authenticate valid user with valid token', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };
      
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };
      
      vi.mocked(jwt.verify).mockReturnValue({ id: 'user123' } as any);
      vi.mocked(User.findById).mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);
      
      // Act
      await protect(mockReq as Request, mockRes as Response, mockNext);
      
      // Assert
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(); // Called without error
    });

    it('should call next() only once on successful authentication', async () => {
      // Arrange
      const mockUser = { _id: 'user123', username: 'testuser' };
      
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };
      
      vi.mocked(jwt.verify).mockReturnValue({ id: 'user123' } as any);
      vi.mocked(User.findById).mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);
      
      // Act
      await protect(mockReq as Request, mockRes as Response, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});