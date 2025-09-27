import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AllPoolsPage from '../../src/pages/AllPools';
import * as api from '../../src/utils/api';

// Mock the API module
vi.mock('../../src/utils/api');

// Simple mock for PoolCard to avoid complexity
vi.mock('../../src/components/PoolCard', () => ({
  default: ({ pool }: { pool: any }) => (
    <div data-testid={`pool-card-${pool._id}`}>
      <h3>{pool.title}</h3>
    </div>
  ),
}));

describe('Pool Search Basic Functionality', () => {
  const mockPools = [
    {
      _id: 'pool1',
      title: 'Rice Pool',
      description: 'Premium rice',
      amount: 45,
      closingDate: '2025-12-31',
      location: 'Lagos',
      creator: 'user1',
      members: [],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      _id: 'pool2', 
      title: 'Beans Pool',
      description: 'Quality beans',
      amount: 35,
      closingDate: '2025-11-30',
      location: 'Abuja',
      creator: 'user2',
      members: [],
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
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

  it('should render search functionality', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValue(mockPools);

    renderAllPoolsPage();

    const searchInput = screen.getByPlaceholderText(/search for pools/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should handle basic search', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools); // Initial load
    mockApiCall.mockResolvedValueOnce([mockPools[0]]); // Search result

    renderAllPoolsPage();

    const searchInput = screen.getByPlaceholderText(/search for pools/i);
    fireEvent.change(searchInput, { target: { value: 'rice' } });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/pools?search=rice', 'GET');
    });
  });

  it('should handle empty search results', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce(mockPools);
    mockApiCall.mockResolvedValueOnce([]);

    renderAllPoolsPage();

    const searchInput = screen.getByPlaceholderText(/search for pools/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/no pools found/i)).toBeInTheDocument();
    });
  });
});