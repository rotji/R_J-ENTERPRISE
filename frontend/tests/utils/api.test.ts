import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiCall, getUserDashboardData, getAdminDashboardData } from '../../src/utils/api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock apiBaseUrl
vi.mock('../../src/utils/apiBaseUrl', () => ({
  default: 'http://localhost:3000',
}));

describe('API Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('apiCall function', () => {
    it('should make successful GET request', async () => {
      // Arrange
      const mockData = { message: 'success', data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockData)),
      });

      // Act
      const result = await apiCall('/test-endpoint', 'GET');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockData);
    });

    it('should make successful POST request with data', async () => {
      // Arrange
      const requestData = { name: 'Test Pool', amount: 100 };
      const mockResponse = { id: '123', ...requestData };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });

      // Act
      const result = await apiCall('/pools', 'POST', requestData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/pools',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include authorization token when provided', async () => {
      // Arrange
      const token = 'test-token';
      const mockData = { user: 'test' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockData)),
      });

      // Act
      await apiCall('/protected-endpoint', 'GET', null, token);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/protected-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        }
      );
    });

    it('should handle API error responses', async () => {
      // Arrange
      const errorMessage = 'Unauthorized access';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ message: errorMessage }),
      });

      // Act & Assert
      await expect(
        apiCall('/protected-endpoint', 'GET')
      ).rejects.toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network connection failed');
      mockFetch.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(
        apiCall('/test-endpoint', 'GET')
      ).rejects.toThrow('Network connection failed');
    });

    it('should handle responses without error message', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}), // No message property
      });

      // Act & Assert
      await expect(
        apiCall('/test-endpoint', 'GET')
      ).rejects.toThrow('Something went wrong');
    });
  });

  describe('getUserDashboardData', () => {
    it('should call correct endpoint with token', async () => {
      // Arrange
      const token = 'user-token';
      const mockDashboardData = {
        pools: [],
        transactions: [],
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockDashboardData)),
      });

      // Act
      const result = await getUserDashboardData(token);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/dashboards/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer user-token',
          },
        }
      );
      expect(result).toEqual(mockDashboardData);
    });
  });

  describe('getAdminDashboardData', () => {
    it('should call correct admin endpoint with token', async () => {
      // Arrange
      const token = 'admin-token';
      const mockAdminData = {
        users: { daily: 5, weekly: 20, monthly: 100 },
        revenue: { daily: 1000, weekly: 5000, monthly: 20000 },
        pools: { daily: 2, weekly: 10, monthly: 50 },
        allBids: [],
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockAdminData)),
      });

      // Act
      const result = await getAdminDashboardData(token);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/dashboards/admin',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer admin-token',
          },
        }
      );
      expect(result).toEqual(mockAdminData);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle malformed JSON response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue('invalid-json-{'),
      });

      // Act & Assert
      await expect(
        apiCall('/test-endpoint', 'GET')
      ).rejects.toThrow('Unexpected token');
    });

    it('should handle missing fetch response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce(undefined);

      // Act & Assert
      await expect(
        apiCall('/test-endpoint', 'GET')
      ).rejects.toThrow();
    });
  });
});