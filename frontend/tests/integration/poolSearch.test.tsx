import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AllPoolsPage from '../../src/pages/AllPools';
import * as api from '../../src/utils/api';

// Mock the API module
vi.mock('../../src/utils/api');

// Mock PoolCard component with more detailed implementation for search testing
vi.mock('../../src/components/PoolCard', () => ({
  default: ({ pool }: { pool: any }) => (
    <div data-testid={`pool-card-${pool._id}`} className="pool-card">
      <h3 data-testid={`pool-title-${pool._id}`}>{pool.title}</h3>
      <p data-testid={`pool-description-${pool._id}`}>{pool.description}</p>
      <div data-testid={`pool-amount-${pool._id}`}>${pool.amount}</div>
      <div data-testid={`pool-location-${pool._id}`}>{pool.location}</div>
      <div data-testid={`pool-members-${pool._id}`}>Members: {pool.members.length}</div>
      <button>Join Pool</button>
      <button>Bid</button>
    </div>
  ),
}));

describe('Pool Search Functionality - End to End', () => {
  const mockPools = [
    {
      _id: 'pool1',
      title: 'Premium Rice Pool',
      description: 'High quality basmati rice for bulk purchasing. Perfect for families and restaurants.',
      amount: 45,
      closingDate: '2025-12-31',
      location: 'Lagos, Nigeria',
      creator: 'user1',
      members: ['user1', 'user2'],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      _id: 'pool2',
      title: 'Fresh Beans Collection',
      description: 'Organic black beans and brown beans sourced directly from local farmers.',
      amount: 35,
      closingDate: '2025-11-30',
      location: 'Abuja, Nigeria',
      creator: 'user2',
      members: ['user2', 'user3', 'user4'],
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
    {
      _id: 'pool3',
      title: 'Weekly Vegetable Share',
      description: 'Fresh vegetables delivered weekly. Includes tomatoes, peppers, onions, and leafy greens.',
      amount: 25,
      closingDate: '2025-10-31',
      location: 'Kano, Nigeria',
      creator: 'user3',
      members: ['user3'],
      createdAt: '2025-01-03',
      updatedAt: '2025-01-03',
    },
    {
      _id: 'pool4',
      title: 'Rice and Beans Combo',
      description: 'Combined package of premium rice and quality beans at discounted price.',
      amount: 70,
      closingDate: '2025-09-30',
      location: 'Port Harcourt, Nigeria',
      creator: 'user4',
      members: [],
      createdAt: '2025-01-04',
      updatedAt: '2025-01-04',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderAllPoolsPage = () => {
    return render(
      <BrowserRouter>
        <AllPoolsPage />
      </BrowserRouter>
    );
  };

  describe('Search by Keywords', () => {
    it('should find pools by title keywords', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      // Initial load
      mockApiCall.mockResolvedValueOnce(mockPools);
      // Search for "rice"
      mockApiCall.mockResolvedValueOnce([mockPools[0], mockPools[3]]); // Both rice pools

      renderAllPoolsPage();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getAllByText(/pool/i)).toHaveLength(4);
      });

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'rice' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=rice', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
        expect(screen.getByTestId('pool-card-pool4')).toBeInTheDocument();
        expect(screen.queryByTestId('pool-card-pool2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pool-card-pool3')).not.toBeInTheDocument();
      });
    });

    it('should find pools by description keywords', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools); // Initial load
      mockApiCall.mockResolvedValueOnce([mockPools[1]]); // Search for "organic"

      renderAllPoolsPage();

      await waitFor(() => {
        expect(screen.getAllByText(/pool/i)).toHaveLength(4);
      });

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'organic' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=organic', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool2')).toBeInTheDocument();
        expect(screen.queryByTestId('pool-card-pool1')).not.toBeInTheDocument();
      });
    });

    it('should search for multiple keywords', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([mockPools[1], mockPools[3]]); // "beans" matches pools 2 and 4

      renderAllPoolsPage();

      await waitFor(() => {
        expect(screen.getAllByText(/pool/i)).toHaveLength(4);
      });

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'beans quality' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=beans%20quality', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool2')).toBeInTheDocument();
        expect(screen.getByTestId('pool-card-pool4')).toBeInTheDocument();
      });
    });
  });

  describe('Search by Location', () => {
    it('should find pools by location', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([mockPools[0]]); // Only Lagos pool

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'Lagos' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=Lagos', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
        expect(screen.getByTestId('pool-location-pool1')).toHaveTextContent('Lagos, Nigeria');
      });
    });
  });

  describe('Search Edge Cases', () => {
    it('should handle case-insensitive search', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([mockPools[2]]); // Vegetable pool

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'VEGETABLE' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=VEGETABLE', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool3')).toBeInTheDocument();
      });
    });

    it('should handle partial word matching', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([mockPools[2]]); // "veg" should match "vegetable"

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'veg' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=veg', 'GET');
      });
    });

    it('should handle no search results gracefully', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([]); // No results

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistentfood' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=nonexistentfood', 'GET');
      });

      await waitFor(() => {
        expect(screen.getByText(/no pools found/i)).toBeInTheDocument();
        expect(screen.queryByTestId(/pool-card-/)).not.toBeInTheDocument();
      });
    });

    it('should handle search API errors', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockRejectedValueOnce(new Error('Search service unavailable'));

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'rice' } });

      await waitFor(() => {
        expect(screen.getByText(/search service unavailable/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Performance and UX', () => {
    it('should debounce search queries to prevent excessive API calls', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValue(mockPools);

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);

      // Type multiple characters quickly
      fireEvent.change(searchInput, { target: { value: 'r' } });
      fireEvent.change(searchInput, { target: { value: 'ri' } });
      fireEvent.change(searchInput, { target: { value: 'ric' } });
      fireEvent.change(searchInput, { target: { value: 'rice' } });

      // Should only make the initial load call and one search call after debounce
      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledTimes(2);
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=rice', 'GET');
      });
    });

    it('should clear search results when search input is cleared', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools); // Initial load
      mockApiCall.mockResolvedValueOnce([mockPools[0]]); // Search results
      mockApiCall.mockResolvedValueOnce(mockPools); // Back to all pools

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);

      // Perform search
      fireEvent.change(searchInput, { target: { value: 'rice' } });

      await waitFor(() => {
        expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
        expect(screen.queryByTestId('pool-card-pool2')).not.toBeInTheDocument();
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools', 'GET');
      });

      await waitFor(() => {
        // All pools should be visible again
        expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
        expect(screen.getByTestId('pool-card-pool2')).toBeInTheDocument();
        expect(screen.getByTestId('pool-card-pool3')).toBeInTheDocument();
        expect(screen.getByTestId('pool-card-pool4')).toBeInTheDocument();
      });
    });

    it('should maintain search input focus during typing', () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValue(mockPools);

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      searchInput.focus();

      fireEvent.change(searchInput, { target: { value: 'rice' } });

      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe('Search Results Display', () => {
    it('should preserve pool information in search results', async () => {
      const mockApiCall = vi.mocked(api.apiCall);
      mockApiCall.mockResolvedValueOnce(mockPools);
      mockApiCall.mockResolvedValueOnce([mockPools[0]]); // Rice pool

      renderAllPoolsPage();

      const searchInput = screen.getByPlaceholderText(/search for pools/i);
      fireEvent.change(searchInput, { target: { value: 'rice' } });

      await waitFor(() => {
        const poolCard = screen.getByTestId('pool-card-pool1');
        expect(poolCard).toBeInTheDocument();
        
        // Verify all pool information is displayed
        expect(screen.getByTestId('pool-title-pool1')).toHaveTextContent('Premium Rice Pool');
        expect(screen.getByTestId('pool-description-pool1')).toHaveTextContent(/High quality basmati rice/);
        expect(screen.getByTestId('pool-amount-pool1')).toHaveTextContent('$45');
        expect(screen.getByTestId('pool-location-pool1')).toHaveTextContent('Lagos, Nigeria');
        expect(screen.getByTestId('pool-members-pool1')).toHaveTextContent('Members: 2');
      });
    });
  });
});