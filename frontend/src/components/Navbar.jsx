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
    <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
      
      <nav className="relative bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 shadow-lg border-b border-emerald-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-10 w-20 h-20 bg-emerald-300 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-20 w-24 h-24 bg-green-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1 left-1/3 w-16 h-16 bg-teal-300 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  फसलSaathi
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
                    className={`px-4 py-2 text-base font-medium transition-all duration-300 relative rounded-lg hover:bg-white/50 backdrop-blur-sm ${
                      item.active
                        ? 'text-emerald-700 bg-white/30 shadow-sm'
                        : 'text-gray-700 hover:text-emerald-700'
                    }`}
                  >
                    {item.name}
                    {item.active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side Icons and Call Button */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon */}
              <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-white/50 rounded-lg transition-all duration-300 backdrop-blur-sm">
                <Search className="h-5 w-5" />
              </button>

              {/* Shopping Cart Icon */}
              <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-white/50 rounded-lg transition-all duration-300 backdrop-blur-sm">
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Call Button */}
              <a
                href="tel:9430144489"
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-300 backdrop-blur-sm"
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
          <div className="md:hidden bg-gradient-to-r from-white/95 via-emerald-50/95 to-green-50/95 border-t border-emerald-100 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                    item.active
                      ? 'text-emerald-700 bg-white/50 shadow-sm'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-white/30'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Icons */}
              <div className="flex items-center space-x-4 px-3 py-2">
                <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-white/50 rounded-lg transition-all duration-300">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-white/50 rounded-lg transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
              
              {/* Mobile Call Button */}
              <div className="px-3 py-2">
                <a
                  href="tel:9430144489"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg w-full justify-center"
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