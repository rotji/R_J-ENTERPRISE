import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PoolCard from '../../src/components/PoolCard';
import * as api from '../../src/utils/api';
import type { Pool } from '../../src/components/PoolCard';

// Mock the API module
vi.mock('../../src/utils/api');

describe('PoolCard', () => {
  const mockPool: Pool = {
    _id: 'pool123',
    title: 'Rice Pool',
    description: 'Premium rice for bulk buying',
    amount: 50,
    closingDate: '2025-12-31',
    location: 'Lagos, Nigeria',
    creator: 'creator123',
    members: ['member1', 'member2'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  const mockUserInfo = {
    _id: 'user123',
    token: 'mock-jwt-token',
    username: 'testuser',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockUserInfo)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders pool information correctly', () => {
    render(<PoolCard pool={mockPool} />);

    expect(screen.getByText('Rice Pool')).toBeInTheDocument();
    expect(screen.getByText('Premium rice for bulk buying')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // member count
    expect(screen.getByText('12/31/2025')).toBeInTheDocument(); // closing date
    expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bid/i })).toBeInTheDocument();
  });

  it('shows "Joined" button when user is already a member', () => {
    const poolWithUserAsMember: Pool = {
      ...mockPool,
      members: ['member1', 'user123', 'member2'], // User is in members list
    };

    render(<PoolCard pool={poolWithUserAsMember} />);

    const joinButton = screen.getByRole('button', { name: /joined/i });
    expect(joinButton).toBeInTheDocument();
    expect(joinButton).toBeDisabled();
  });

  it('allows user to join pool successfully', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    const updatedPool: Pool = {
      ...mockPool,
      members: [...mockPool.members, 'user123'],
    };
    mockApiCall.mockResolvedValueOnce(updatedPool);

    render(<PoolCard pool={mockPool} />);

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/joining.../i)).toBeInTheDocument();
    });

    // Wait for API call to complete
    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith(
        `/api/pools/${mockPool._id}/join`,
        'POST',
        {},
        'mock-jwt-token'
      );
    });

    // Should update UI to show user has joined
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /joined/i })).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Updated member count
    });
  });

  it('shows error when user is not authenticated', async () => {
    // Mock localStorage to return empty user info
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce('{}');

    render(<PoolCard pool={mockPool} />);

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/you must be logged in to join a pool/i)).toBeInTheDocument();
    });
  });

  it('handles API errors when joining pool', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockRejectedValueOnce(new Error('Pool is full'));

    render(<PoolCard pool={mockPool} />);

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/pool is full/i)).toBeInTheDocument();
    });

    // Button should be enabled again after error
    expect(joinButton).not.toBeDisabled();
    expect(joinButton).toHaveTextContent(/join/i);
  });

  it('handles unknown API errors gracefully', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockRejectedValueOnce('Unknown error');

    render(<PoolCard pool={mockPool} />);

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/an unknown error occurred/i)).toBeInTheDocument();
    });
  });

  it('disables join button during loading', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    // Make API call resolve slowly
    mockApiCall.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ ...mockPool, members: [...mockPool.members, 'user123'] }), 100);
        })
    );

    render(<PoolCard pool={mockPool} />);

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    // Should be disabled and show loading text
    expect(joinButton).toBeDisabled();
    expect(screen.getByText(/joining.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /joined/i })).toBeInTheDocument();
    });
  });

  it('formats closing date correctly', () => {
    const poolWithDifferentDate: Pool = {
      ...mockPool,
      closingDate: '2025-06-15',
    };

    render(<PoolCard pool={poolWithDifferentDate} />);

    expect(screen.getByText('6/15/2025')).toBeInTheDocument();
  });

  it('updates member count correctly after joining', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    const updatedPool: Pool = {
      ...mockPool,
      members: [...mockPool.members, 'user123', 'anotheruser'],
    };
    mockApiCall.mockResolvedValueOnce(updatedPool);

    render(<PoolCard pool={mockPool} />);

    // Initial member count should be 2
    expect(screen.getByText('2')).toBeInTheDocument();

    const joinButton = screen.getByRole('button', { name: /join/i });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument(); // Updated to 4 members
    });
  });

  it('handles empty localStorage gracefully', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce(null);

    render(<PoolCard pool={mockPool} />);

    // Should render without crashing
    expect(screen.getByText('Rice Pool')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
  });

  it('renders bid button (placeholder functionality)', () => {
    render(<PoolCard pool={mockPool} />);

    const bidButton = screen.getByRole('button', { name: /bid/i });
    expect(bidButton).toBeInTheDocument();
    expect(bidButton).not.toBeDisabled();
  });

  it('displays pool with zero members correctly', () => {
    const emptyPool: Pool = {
      ...mockPool,
      members: [],
    };

    render(<PoolCard pool={emptyPool} />);

    expect(screen.getByText('0')).toBeInTheDocument(); // member count
  });

  it('handles very long pool descriptions', () => {
    const poolWithLongDescription: Pool = {
      ...mockPool,
      description: 'This is a very long description that might cause layout issues if not handled properly. It contains many words and should be displayed correctly without breaking the card layout.',
    };

    render(<PoolCard pool={poolWithLongDescription} />);

    expect(screen.getByText(/this is a very long description/i)).toBeInTheDocument();
  });
});