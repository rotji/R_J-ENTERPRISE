import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CreatePoolForm from '../../src/components/CreatePoolForm';
import * as api from '../../src/utils/api';

// Mock the API module
vi.mock('../../src/utils/api');

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreatePoolForm', () => {
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

  const renderCreatePoolForm = () => {
    return render(
      <BrowserRouter>
        <CreatePoolForm />
      </BrowserRouter>
    );
  };

  it('renders all form fields correctly', () => {
    renderCreatePoolForm();

    expect(screen.getByLabelText(/pool title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount per person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/closing date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sharing location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create pool/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', () => {
    renderCreatePoolForm();

    const titleInput = screen.getByLabelText(/pool title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const amountInput = screen.getByLabelText(/amount per person/i) as HTMLInputElement;
    const locationInput = screen.getByLabelText(/sharing location/i) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: 'Rice Pool Test' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(amountInput, { target: { value: '50' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });

    expect(titleInput.value).toBe('Rice Pool Test');
    expect(descriptionInput.value).toBe('Test description');
    expect(amountInput.value).toBe('50');
    expect(locationInput.value).toBe('Test Location');
  });

  it('submits form successfully with valid data', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockResolvedValueOnce({});

    renderCreatePoolForm();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/pool title/i), {
      target: { value: 'Rice Pool Test' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Premium rice for bulk buying' },
    });
    fireEvent.change(screen.getByLabelText(/amount per person/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/closing date/i), {
      target: { value: '2025-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/sharing location/i), {
      target: { value: 'Lagos, Nigeria' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create pool/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith(
        '/api/pools',
        'POST',
        {
          title: 'Rice Pool Test',
          description: 'Premium rice for bulk buying',
          amount: '50',
          closingDate: '2025-12-31',
          location: 'Lagos, Nigeria',
        },
        'mock-jwt-token'
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/pool created successfully/i)).toBeInTheDocument();
    });

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3000 });
  });

  it('shows error when user is not authenticated', async () => {
    // Mock localStorage to return null user info
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce('{}');

    renderCreatePoolForm();

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/pool title/i), {
      target: { value: 'Rice Pool Test' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Premium rice for bulk buying' },
    });
    fireEvent.change(screen.getByLabelText(/amount per person/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/closing date/i), {
      target: { value: '2025-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/sharing location/i), {
      target: { value: 'Lagos, Nigeria' },
    });

    const submitButton = screen.getByRole('button', { name: /create pool/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must be logged in to create a pool/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    mockApiCall.mockRejectedValueOnce(new Error('Network error'));

    renderCreatePoolForm();

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/pool title/i), {
      target: { value: 'Rice Pool Test' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Premium rice for bulk buying' },
    });
    fireEvent.change(screen.getByLabelText(/amount per person/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/closing date/i), {
      target: { value: '2025-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/sharing location/i), {
      target: { value: 'Lagos, Nigeria' },
    });

    const submitButton = screen.getByRole('button', { name: /create pool/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const mockApiCall = vi.mocked(api.apiCall);
    // Make the API call resolve slowly
    mockApiCall.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({}), 100);
        })
    );

    renderCreatePoolForm();

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/pool title/i), {
      target: { value: 'Rice Pool Test' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Premium rice for bulk buying' },
    });
    fireEvent.change(screen.getByLabelText(/amount per person/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/closing date/i), {
      target: { value: '2025-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/sharing location/i), {
      target: { value: 'Lagos, Nigeria' },
    });

    const submitButton = screen.getByRole('button', { name: /create pool/i });
    fireEvent.click(submitButton);

    // Check loading state
    expect(screen.getByText(/creating.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/pool created successfully/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', () => {
    renderCreatePoolForm();

    const submitButton = screen.getByRole('button', { name: /create pool/i });
    const titleInput = screen.getByLabelText(/pool title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount per person/i);
    const closingDateInput = screen.getByLabelText(/closing date/i);
    const locationInput = screen.getByLabelText(/sharing location/i);

    // Check that all inputs have required attribute
    expect(titleInput).toHaveAttribute('required');
    expect(descriptionInput).toHaveAttribute('required');
    expect(amountInput).toHaveAttribute('required');
    expect(closingDateInput).toHaveAttribute('required');
    expect(locationInput).toHaveAttribute('required');

    // Try to submit empty form
    fireEvent.click(submitButton);

    // Browser should prevent submission of required fields
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});