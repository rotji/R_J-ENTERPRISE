import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
    <header className="bg-black shadow-md fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Project Name */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-bold">
                R_J
              </span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-800">
            </span>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              Home
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`
            md:hidden 
            fixed left-0 right-0 
            top-[57px] 
            bg-white 
            border-t 
            shadow-lg 
            transition-all 
            duration-300 
            transform
            ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-[-100%] opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              className="text-white hover:text-gray-900 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              className="text-white hover:text-gray-900 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
