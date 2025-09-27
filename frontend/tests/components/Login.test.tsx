import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API base URL
vi.mock('../../src/utils/apiBaseUrl', () => ({
  default: 'http://localhost:3000',
}));

// Mock localStorage
const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Wrapper component for router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should have proper form structure and attributes', () => {
      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /login/i }) as HTMLButtonElement;

      expect(emailInput.type).toBe('email');
      expect(emailInput.required).toBe(true);
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBe(true);
      expect(submitButton.type).toBe('submit');
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when user types', () => {
      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Login Submission', () => {
    it('should submit login form with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          _id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          token: 'mock-jwt-token',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        });
      });
    });

    it('should store user info in localStorage on successful login', async () => {
      const userData = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        token: 'mock-jwt-token',
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(userData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'userInfo',
          JSON.stringify(userData)
        );
      });
    });

    it('should show success message on successful login', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          _id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          token: 'mock-jwt-token',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/login successful! redirecting/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on invalid credentials', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: 'Invalid email or password',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    it('should display generic error message when server response has no message', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error. please try again/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should have required fields with proper types', () => {
      render(
        <RouterWrapper>
          <Login />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      expect(emailInput.required).toBe(true);
      expect(emailInput.type).toBe('email');
      expect(passwordInput.required).toBe(true);
      expect(passwordInput.type).toBe('password');
    });
  });
});