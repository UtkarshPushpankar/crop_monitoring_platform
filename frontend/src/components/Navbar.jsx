import React, { useState } from 'react';
import { Search, ShoppingCart, Leaf, Phone, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', active: true },
    { name: 'About', href: '/about', active: false },
    { name: 'Products', href: '#', active: false },
    { name: 'Projects', href: '#', active: false },
  ];

  return (
    <div className=" bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  AgriConnect HUB
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-base font-medium transition-colors duration-200 relative ${
                      item.active
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    {item.active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"></div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side Icons and Call Button */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon */}
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>

              {/* Shopping Cart Icon */}
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Call Button */}
              <a
                href="tel:9430144489"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Phone className="h-4 w-4" />
                <div className="flex flex-col text-xs leading-tight">
                  <span>Call Anytime</span>
                  <span className="font-bold">9430144489</span>
                </div>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    item.active
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Icons */}
              <div className="flex items-center space-x-4 px-3 py-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
              
              {/* Mobile Call Button */}
              <div className="px-3 py-2">
                <a
                  href="tel:9430144489"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md w-full justify-center"
                >
                  <Phone className="h-4 w-4" />
                  <div className="flex flex-col text-xs leading-tight">
                    <span>Call Anytime</span>
                    <span className="font-bold">9430144489</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;