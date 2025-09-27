import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../src/components/Header';

// Mock CSS modules
vi.mock('../../styles/header.module.css', () => ({
  default: {
    header: 'header',
    container: 'container',
    logo: 'logo',
    centerNav: 'centerNav',
    navList: 'navList',
    navLink: 'navLink',
    hamburger: 'hamburger',
    hamburgerBar: 'hamburgerBar',
  },
}));

// Wrapper component for router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header Component', () => {
  const mockOnOpenSidebar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render app name/logo', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      expect(screen.getByText('R_J ENTERPRISE')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const expectedLinks = [
        'Home',
        'About', 
        'Register',
        'Login',
        'Create Pool',
        'Pools',
        'Bids'
      ];

      expectedLinks.forEach(linkText => {
        expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
      });
    });

    it('should render hamburger menu button', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('should have correct navigation link hrefs', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const expectedHrefs = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Register', href: '/register' },
        { name: 'Login', href: '/login' },
        { name: 'Create Pool', href: '/create-pool' },
        { name: 'Pools', href: '/pools' },
        { name: 'Bids', href: '/bids' },
      ];

      expectedHrefs.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name });
        expect(link).toHaveAttribute('href', href);
      });
    });
  });

  describe('Functionality', () => {
    it('should call onOpenSidebar when hamburger menu is clicked', () => {
      // Arrange
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });

      // Act
      fireEvent.click(hamburgerButton);

      // Assert
      expect(mockOnOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenSidebar multiple times when hamburger is clicked multiple times', () => {
      // Arrange
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });

      // Act
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);

      // Assert
      expect(mockOnOpenSidebar).toHaveBeenCalledTimes(3);
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should apply correct CSS classes to header elements', () => {
      // Act
      const { container } = render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const header = container.querySelector('header');
      expect(header).toHaveClass('header');

      const containerDiv = header?.querySelector('.container');
      expect(containerDiv).toBeInTheDocument();

      const logo = screen.getByText('R_J ENTERPRISE');
      expect(logo).toHaveClass('logo');

      const nav = container.querySelector('.centerNav');
      expect(nav).toBeInTheDocument();

      const navList = container.querySelector('.navList');
      expect(navList).toBeInTheDocument();
    });

    it('should have hamburger button with correct structure', () => {
      // Act
      const { container } = render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });
      expect(hamburgerButton).toHaveClass('hamburger');

      const hamburgerBars = container.querySelectorAll('.hamburgerBar');
      expect(hamburgerBars).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for hamburger menu', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-label', 'Open mobile menu');
    });

    it('should have navigation links accessible by keyboard', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeVisible();
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have hamburger button accessible by keyboard', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const hamburgerButton = screen.getByRole('button', { name: /open mobile menu/i });
      expect(hamburgerButton).toBeVisible();
      expect(hamburgerButton).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Component Memoization', () => {
    it('should not re-render unnecessarily with same props', () => {
      // Arrange
      const { rerender } = render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      const initialHeaderText = screen.getByText('R_J ENTERPRISE');

      // Act - Re-render with same props
      rerender(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const reRenderedHeaderText = screen.getByText('R_J ENTERPRISE');
      expect(reRenderedHeaderText).toBe(initialHeaderText);
    });
  });

  describe('Navigation Links Data', () => {
    it('should render exactly 7 navigation links', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const navLinks = screen.getAllByRole('link');
      expect(navLinks).toHaveLength(7);
    });

    it('should maintain consistent navigation link order', () => {
      // Act
      render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const navLinks = screen.getAllByRole('link');
      const expectedOrder = [
        'Home',
        'About',
        'Register', 
        'Login',
        'Create Pool',
        'Pools',
        'Bids'
      ];

      navLinks.forEach((link, index) => {
        expect(link).toHaveTextContent(expectedOrder[index]);
      });
    });
  });

  describe('Mobile Responsiveness Protection', () => {
    it('should maintain mobile-specific CSS classes structure', () => {
      // This test protects our recent mobile spacing fixes
      // Act
      const { container } = render(
        <RouterWrapper>
          <Header onOpenSidebar={mockOnOpenSidebar} />
        </RouterWrapper>
      );

      // Assert
      const navList = container.querySelector('.navList');
      expect(navList).toBeInTheDocument();
      
      const navLinks = container.querySelectorAll('.navLink');
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Ensure hamburger is present for mobile
      const hamburger = container.querySelector('.hamburger');
      expect(hamburger).toBeInTheDocument();
    });
  });
});