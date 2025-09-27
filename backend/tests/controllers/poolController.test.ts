import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { Request, Response } from 'express';
import { createPool, joinPool, getPools } from '../../src/controllers/poolController';
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
  let mockNext: any;
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

    mockReq = {
      user: mockUser,
      body: {},
      params: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
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

      vi.mocked(Pool).mockImplementation(() => mockPool as any);
      mockPool.save.mockResolvedValue(mockPool); // Return the pool itself

      // Act
      await createPool(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(Pool).toHaveBeenCalledWith({
        title: 'Test Pool',
        description: 'Test Description',
        amount: 100,
        closingDate: mockReq.body.closingDate,
        location: 'Test Location',
        creator: mockUser._id,
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
        createPool(mockReq as IRequestWithUser, mockRes as Response, mockNext)
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
        createPool(mockReq as IRequestWithUser, mockRes as Response, mockNext)
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
      await joinPool(mockReq as IRequestWithUser, mockRes as Response, mockNext);

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
        joinPool(mockReq as IRequestWithUser, mockRes as Response, mockNext)
      ).rejects.toThrow('Pool not found');

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should reject user joining pool they are already member of', async () => {
      // Arrange
      mockPool.members = [mockUser._id]; // User already a member
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act & Assert
      await expect(
        joinPool(mockReq as IRequestWithUser, mockRes as Response, mockNext)
      ).rejects.toThrow('You are already a member of this pool');

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should reject joining pool without authentication', async () => {
      // Arrange
      mockReq.user = null;
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act & Assert
      await expect(
        joinPool(mockReq as IRequestWithUser, mockRes as Response, mockNext)
      ).rejects.toThrow('User not authenticated');

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should handle multiple users joining same pool', async () => {
      // Arrange
      const anotherUser = new Types.ObjectId('507f1f77bcf86cd799439013');
      mockPool.members = [anotherUser]; // Another user already joined
      vi.mocked(Pool.findById).mockResolvedValue(mockPool);

      // Act
      await joinPool(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(mockPool.members).toHaveLength(2);
      expect(mockPool.members).toContain(anotherUser);
      expect(mockPool.members).toContain(mockUser._id);
    });
  });

  describe('getPools', () => {
    let mockPools: any[];

    beforeEach(() => {
      mockPools = [
        {
          _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
          title: 'Rice Pool',
          description: 'Premium rice for bulk buying',
          amount: 50,
          location: 'Lagos',
          creator: mockUser._id,
          members: [],
          createdAt: new Date('2025-01-01'),
        },
        {
          _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Beans Pool',
          description: 'Quality beans for families',
          amount: 30,
          location: 'Abuja',
          creator: mockUser._id,
          members: [mockUser._id],
          createdAt: new Date('2025-01-02'),
        },
        {
          _id: new Types.ObjectId('507f1f77bcf86cd799439014'),
          title: 'Vegetable Pool',
          description: 'Fresh vegetables weekly',
          amount: 25,
          location: 'Kano',
          creator: mockUser._id,
          members: [],
          createdAt: new Date('2025-01-03'),
        },
      ];

      mockReq.query = {};
    });

    it('should get all pools without search parameter', async () => {
      // Arrange
      const mockFind = {
        sort: vi.fn().mockResolvedValue(mockPools),
      };
      vi.mocked(Pool.find).mockReturnValue(mockFind as any);

      // Act
      await getPools(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(Pool.find).toHaveBeenCalledWith({});
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(mockPools);
    });

    it('should search pools with search parameter', async () => {
      // Arrange
      mockReq.query = { search: 'rice' };
      const filteredPools = [mockPools[0]]; // Only rice pool
      const mockFind = {
        sort: vi.fn().mockResolvedValue(filteredPools),
      };
      vi.mocked(Pool.find).mockReturnValue(mockFind as any);

      // Act
      await getPools(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(Pool.find).toHaveBeenCalledWith({
        $text: {
          $search: 'rice',
          $caseSensitive: false,
        },
      });
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(filteredPools);
    });

    it('should handle search with multiple keywords', async () => {
      // Arrange
      mockReq.query = { search: 'beans quality' };
      const filteredPools = [mockPools[1]]; // Only beans pool
      const mockFind = {
        sort: vi.fn().mockResolvedValue(filteredPools),
      };
      vi.mocked(Pool.find).mockReturnValue(mockFind as any);

      // Act
      await getPools(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(Pool.find).toHaveBeenCalledWith({
        $text: {
          $search: 'beans quality',
          $caseSensitive: false,
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(filteredPools);
    });

    it('should return empty array when no pools match search', async () => {
      // Arrange
      mockReq.query = { search: 'nonexistent' };
      const mockFind = {
        sort: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(Pool.find).mockReturnValue(mockFind as any);

      // Act
      await getPools(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should handle case-insensitive search', async () => {
      // Arrange
      mockReq.query = { search: 'RICE' };
      const filteredPools = [mockPools[0]];
      const mockFind = {
        sort: vi.fn().mockResolvedValue(filteredPools),
      };
      vi.mocked(Pool.find).mockReturnValue(mockFind as any);

      // Act
      await getPools(mockReq as IRequestWithUser, mockRes as Response, mockNext);

      // Assert
      expect(Pool.find).toHaveBeenCalledWith({
        $text: {
          $search: 'RICE',
          $caseSensitive: false,
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(filteredPools);
    });
  });
});