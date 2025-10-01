import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { Request, Response } from 'express';
import { createPool, joinPool } from '../../src/controllers/poolController';
import Pool from '../../src/database/models/Pool';
import { IRequestWithUser } from '../../src/middleware/authMiddleware';
import { Types } from 'mongoose';

// Mock dependencies
vi.mock('../../src/database/models/Pool');
vi.mock('../../src/utils/asyncHandler', () => ({
  default: (fn: Function) => fn, // Simplified mock
}));

describe('Pool Controller Integration Tests', () => {
  let mockReq: Partial<IRequestWithUser>;
  let mockRes: Partial<Response>;
  let mockUser: any;
  let mockPool: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock authenticated user
    mockUser = {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    // Mock pool
    mockPool = {
      _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
      title: 'Test Pool',
      description: 'Test Description',
      amount: 100,
      location: 'Test Location',
      creator: mockUser._id,
      members: [],
      save: vi.fn().mockResolvedValue(true),
    };

    // Setup Pool static methods
    Pool.findOne = vi.fn();
    Pool.findById = vi.fn();

    mockReq = {
      user: mockUser,
      body: {},
      params: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('createPool', () => {
    it('should create pool successfully with authenticated user', async () => {
      // Arrange
      mockReq.body = {
        title: 'Test Pool',
        description: 'Test Description',
        amount: 100,
        closingDate: new Date(),
        location: 'Test Location',
      };

      // Mock Pool.findOne().sort() chain for getting the last pool number
      const mockFindOneChain = {
        sort: vi.fn().mockResolvedValue({ poolNumber: 5 }) // Mock last pool with number 5
      };
      vi.mocked(Pool.findOne).mockReturnValue(mockFindOneChain as any);
      vi.mocked(Pool).mockImplementation(() => mockPool as any);
      mockPool.save.mockResolvedValue(mockPool); // Return the pool itself

      // Act
      await createPool(mockReq as IRequestWithUser, mockRes as Response);

      // Assert
      expect(Pool.findOne).toHaveBeenCalled();
      expect(mockFindOneChain.sort).toHaveBeenCalledWith({ poolNumber: -1 });
      expect(Pool).toHaveBeenCalledWith({
        title: 'Test Pool',
        description: 'Test Description',
        amount: 100,
        closingDate: mockReq.body.closingDate,
        location: 'Test Location',
        creator: mockUser._id,
        poolNumber: 6, // Should be last pool number + 1
      });
      expect(mockPool.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockPool);
    });

    it('should reject pool creation with missing fields', async () => {
      // Arrange
      mockReq.body = {
        title: 'Test Pool',
        // Missing required fields
      };

      // Act & Assert
      await expect(
        createPool(mockReq as IRequestWithUser, mockRes as Response)
      ).rejects.toThrow('Please provide all required fields');

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should reject pool creation without authenticated user', async () => {
      // Arrange
      mockReq.user = null;
      mockReq.body = {
        title: 'Test Pool',
        description: 'Test Description',
        amount: 100,
        closingDate: new Date(),
        location: 'Test Location',
      };

      // Act & Assert
      await expect(
        createPool(mockReq as IRequestWithUser, mockRes as Response)
      ).rejects.toThrow('User not authenticated');

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('joinPool', () => {
    beforeEach(() => {
      mockReq.params = { id: mockPool._id.toString() };
    });

    it('should allow user to join pool successfully', async () => {
      // Arrange
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act
      await joinPool(mockReq as IRequestWithUser, mockRes as Response);

      // Assert
      expect(Pool.findById).toHaveBeenCalledWith(mockPool._id.toString());
      expect(mockPool.members).toContain(mockUser._id);
      expect(mockPool.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockPool);
    });

    it('should reject joining non-existent pool', async () => {
      // Arrange
      vi.mocked(Pool.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(
        joinPool(mockReq as IRequestWithUser, mockRes as Response)
      ).rejects.toThrow('Pool not found');

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should reject user joining pool they are already member of', async () => {
      // Arrange
      mockPool.members = [mockUser._id]; // User already a member
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act & Assert
      await expect(
        joinPool(mockReq as IRequestWithUser, mockRes as Response)
      ).rejects.toThrow('You are already a member of this pool');

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should reject joining pool without authentication', async () => {
      // Arrange
      mockReq.user = null;
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act & Assert
      await expect(
        joinPool(mockReq as IRequestWithUser, mockRes as Response)
      ).rejects.toThrow('User not authenticated');

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should handle multiple users joining same pool', async () => {
      // Arrange
      const anotherUser = new Types.ObjectId('507f1f77bcf86cd799439013');
      mockPool.members = [anotherUser]; // Another user already joined
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act
      await joinPool(mockReq as IRequestWithUser, mockRes as Response);

      // Assert
      expect(mockPool.members).toHaveLength(2);
      expect(mockPool.members).toContain(anotherUser);
      expect(mockPool.members).toContain(mockUser._id);
    });
  });
});