import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AllPoolsPage from '../../src/pages/AllPools';
import * as api from '../../src/utils/api';

// Mock the API module
vi.mock('../../src/utils/api');

// Mock PoolCard component
vi.mock('../../src/components/PoolCard', () => ({
  default: ({ pool }: { pool: any }) => (
    <div data-testid={`pool-card-${pool._id}`}>
      <h3>{pool.title}</h3>
      <p>{pool.description}</p>
      <span>${pool.amount}</span>
    </div>
  ),
}));

describe('AllPoolsPage', () => {
  const mockPools = [
    {
      _id: 'pool1',
      title: 'Rice Pool',
      description: 'Premium rice for bulk buying',
      amount: 50,
      closingDate: '2025-12-31',
      location: 'Lagos',
      creator: 'user1',
      members: ['user1', 'user2'],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      _id: 'pool2',
      title: 'Beans Pool',
      description: 'Quality beans for families',
      amount: 30,
      closingDate: '2025-11-30',
      location: 'Abuja',
      creator: 'user2',
      members: ['user2'],
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
    {
      _id: 'pool3',
      title: 'Vegetable Pool',
      description: 'Fresh vegetables weekly delivery',
      amount: 25,
      closingDate: '2025-10-31',
      location: 'Kano',
      creator: 'user3',
      members: [],
      createdAt: '2025-01-03',
      updatedAt: '2025-01-03',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page title and search input', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools);

    render(<AllPoolsPage />);

    expect(screen.getByText(/all available pools/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search for pools \(e\.g\., rice, beans\)\.\.\./i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading pools/i)).not.toBeInTheDocument();
    });
  });

  it('loads and displays pools successfully', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools);

    render(<AllPoolsPage />);

    // Should show loading initially
    expect(screen.getByText(/loading pools/i)).toBeInTheDocument();

    // Wait for pools to load
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
      expect(screen.getByTestId('pool-card-pool2')).toBeInTheDocument();
      expect(screen.getByTestId('pool-card-pool3')).toBeInTheDocument();
    });

    // Check API was called correctly
    expect(mockApiCall).toHaveBeenCalledWith('/api/pools', 'GET');
  });

  it('shows "No pools found" message when pools array is empty', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce([]);

    render(<AllPoolsPage />);

    await waitFor(() => {
      expect(screen.getByText(/no pools found/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockRejectedValueOnce(new Error('Network error'));

    render(<AllPoolsPage />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Should not show pool cards on error
    expect(screen.queryByTestId('pool-card-pool1')).not.toBeInTheDocument();
  });

  it('performs search with debouncing', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    // First call for initial load
    mockApiCall.mockResolvedValueOnce(mockPools);
    // Second call for search results
    const searchResults = [mockPools[0]]; // Only rice pool
    mockApiCall.mockResolvedValueOnce(searchResults);

    render(<AllPoolsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search for pools/i);

    // Type search term
    fireEvent.change(searchInput, { target: { value: 'rice' } });

    // Wait for debounce delay (300ms) + API call
    await waitFor(
      () => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=rice', 'GET');
      },
      { timeout: 1000 }
    );

    // Should show only search results
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
      expect(screen.queryByTestId('pool-card-pool2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pool-card-pool3')).not.toBeInTheDocument();
    });
  });

  it('clears search results when search term is empty', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    // First call for initial load
    mockApiCall.mockResolvedValueOnce(mockPools);
    // Second call for search
    mockApiCall.mockResolvedValueOnce([mockPools[0]]);
    // Third call when search is cleared
    mockApiCall.mockResolvedValueOnce(mockPools);

    render(<AllPoolsPage />);

    const searchInput = screen.getByPlaceholderText(/search for pools/i);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
    });

    // Search for something
    fireEvent.change(searchInput, { target: { value: 'rice' } });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=rice', 'GET');
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/pools', 'GET');
    });

    // Should show all pools again
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
      expect(screen.getByTestId('pool-card-pool2')).toBeInTheDocument();
      expect(screen.getByTestId('pool-card-pool3')).toBeInTheDocument();
    });
  });

  it('handles search with no results', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    // Initial load
    mockApiCall.mockResolvedValueOnce(mockPools);
    // Search with no results
    mockApiCall.mockResolvedValueOnce([]);

    render(<AllPoolsPage />);

    const searchInput = screen.getByPlaceholderText(/search for pools/i);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
    });

    // Search for non-existent item
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=nonexistent', 'GET');
    });

    await waitFor(() => {
      expect(screen.getByText(/no pools found/i)).toBeInTheDocument();
    });

    // Should not show any pool cards
    expect(screen.queryByTestId('pool-card-pool1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pool-card-pool2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pool-card-pool3')).not.toBeInTheDocument();
  });

  it('handles multiple rapid search inputs correctly (debouncing)', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools); // Initial load
    mockApiCall.mockResolvedValueOnce([mockPools[1]]); // Final search result

    render(<AllPoolsPage />);

    const searchInput = screen.getByPlaceholderText(/search for pools/i);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('pool-card-pool1')).toBeInTheDocument();
    });

    // Rapidly type multiple characters
    fireEvent.change(searchInput, { target: { value: 'b' } });
    fireEvent.change(searchInput, { target: { value: 'be' } });
    fireEvent.change(searchInput, { target: { value: 'bea' } });
    fireEvent.change(searchInput, { target: { value: 'bean' } });
    fireEvent.change(searchInput, { target: { value: 'beans' } });

    // Should only make one API call after debounce delay
    await waitFor(
      () => {
        expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=beans', 'GET');
        expect(mockApiCall).toHaveBeenCalledTimes(2); // Initial + final search
      },
      { timeout: 1000 }
    );
  });

  it('maintains search input value correctly', () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools);

    render(<AllPoolsPage />);

    const searchInput = screen.getByPlaceholderText(/search for pools/i) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput.value).toBe('test search');
  });
});