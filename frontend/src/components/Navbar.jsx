import React, { useContext, useState, useEffect } from 'react';
import { Search, ShoppingCart, Leaf, Phone, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import { User, LogOut, Compass, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const { isLoggedIn, username, email, login, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const navItems = [
    { name: 'Home', href: '/', active: false },
    { name: 'About', href: '/about', active: false },
    // { name: 'Dashboard', href: '/dashboard', active: false },
    { name: 'Contact', href: '/contact', active: false },
  ];

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout(); 
    setIsDropdownOpen(false);
    navigate('/'); 
  };

  const Profile = () => {
    return isLoggedIn ? (
      <div className="hidden md:flex items-center space-x-4">
        {/* Profile Section */}
        <div className="relative group dropdown-container" style={{ zIndex: 9999 }}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="relative  cursor-pointer  bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-500 ease-out flex items-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-100 hover:translate-y-1 border border-emerald-400/20 backdrop-blur-sm overflow-hidden"
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

            {/* Enhanced Profile Avatar */}
            <div className="relative w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-inner backdrop-blur-sm">
              <User className="h-5 w-5 text-white drop-shadow-sm" />
              {/* Pulsing online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white shadow-sm animate-pulse"></div>
            </div>

            {/* Enhanced Username with subtitle */}
            <div className="flex flex-col text-left">
              <span className="text-sm text-emerald-100/90 font-semibold">Welcome</span>
              <span className="text-sm font-semibold tracking-wide drop-shadow-sm">{username}</span>
            </div>

            {/* Enhanced Dropdown Arrow */}
            <ChevronDown
              className={`h-4 w-4 transition-all duration-300 ease-out drop-shadow-sm ${
                isDropdownOpen ? 'rotate-180 text-emerald-100' : 'text-white/90'
              }`}
            />
          </button>

          {/* Enhanced Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 bg-black/10 backdrop-blur-[2px]"
                style={{ zIndex: 9998 }}
                onClick={() => setIsDropdownOpen(false)}
              />

              <div
                className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-3 animate-in slide-in-from-top-2 duration-300 overflow-hidden"
                style={{
                  zIndex: 10000,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* User info header */}
                <div className="px-5 py-4 border-b border-gray-100/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-100">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{username}</p>
                      <p className="text-xs text-gray-500">{email}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced menu items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/agritools")
                      console.log('Explore clicked');
                      setIsDropdownOpen(false);
                    }}
                    className="group cursor-pointer w-full px-5 py-3.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 flex items-center space-x-3 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/8 group-hover:to-green-500/8 transition-all duration-300"></div>
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                        <Compass className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">Explore</span>
                        <p className="text-xs text-gray-500 group-hover:text-gray-600">Discover our features</p>
                      </div>
                    </div>
                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="group w-full  cursor-pointer  px-5 py-3.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center space-x-3 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/8 group-hover:to-pink-500/8 transition-all duration-300"></div>
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-red-100 group-hover:bg-red-200 transition-all duration-300 group-hover:scale-110">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">Logout</span>
                        <p className="text-xs text-gray-500 group-hover:text-gray-600">Sign out securely</p>
                      </div>
                    </div>
                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    ) : (
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="relative cursor-pointer group bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-500 ease-out shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 border border-emerald-400/20 backdrop-blur-sm overflow-hidden"
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

          <div className="relative z-10 flex items-center space-x-3">
            {/* Login icon */}
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>

            {/* Login text */}
            <span className="text-md font-semibold tracking-wide drop-shadow-sm">
              Login
            </span>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* Signup Button */}
        <button
          onClick={() => navigate("/signup")}
          className="relative cursor-pointer group bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-500 ease-out shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 border border-emerald-400/20 backdrop-blur-sm overflow-hidden"
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

          <div className="relative z-10 flex items-center space-x-3">
            {/* Signup icon */}
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>

            {/* Signup text */}
            <span className="text-md font-semibold tracking-wide drop-shadow-sm">
              Signup
            </span>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
      <nav className="relative bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 shadow-lg border-b border-emerald-100 overflow-visible">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-10 w-20 h-20 bg-emerald-300 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-20 w-24 h-24 bg-green-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1 left-1/3 w-16 h-16 bg-teal-300 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  AgriConnect
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item, key) => (
                  <Link
                    key={key}
                    to={item.href}
                    onClick={(e) => {
                      handleNavClick(item.name);
                    }}
                    className={`px-4 py-2 text-base font-medium transition-all duration-300 relative rounded-lg hover:bg-white/50 backdrop-blur-sm cursor-pointer ${
                      location.pathname === item.href
                        ? 'text-emerald-700 bg-white/30 shadow-sm'
                        : 'text-gray-700 hover:text-emerald-700'
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile/Auth Section */}
            <Profile />

            {/* Mobile Menu Button */}
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
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => {
                    handleNavClick(item.name);
                  }}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg cursor-pointer ${
                    location.pathname === item.href
                      ? 'text-emerald-700 bg-white/50 shadow-sm'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-white/30'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              {!isLoggedIn && (
                <div className="px-3 py-2 space-y-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    <span>Signup</span>
                  </button>
                </div>
              )}

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
