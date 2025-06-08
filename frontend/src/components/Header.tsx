import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Project Name */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full">
              {/* Add logo here */}
            </div>
            <span className="text-xl font-bold text-gray-800">R_J ENTERPRISE</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 transition-colors duration-200 hover:text-gray-900">
              About
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <label htmlFor="nav-toggle" className="cursor-pointer">
              <input 
                type="checkbox" 
                id="nav-toggle" 
                className="hidden peer"
              />
              <Menu size={24} className="block peer-checked:hidden text-gray-600 transition-all duration-200" />
              <X size={24} className="hidden peer-checked:block text-gray-600 transition-all duration-200" />
              
              {/* Mobile Navigation Menu */}
              <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg transition-all duration-200 transform 
                            translate-y-[-100%] opacity-0 peer-checked:translate-y-0 peer-checked:opacity-100">
                <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                  <Link to="/" className="text-gray-600 transition-colors duration-200 hover:text-gray-900">
                    Home
                  </Link>
                  <Link to="/about" className="text-gray-600 transition-colors duration-200 hover:text-gray-900">
                    About
                  </Link>
                </div>
              </div>
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;