import React, { useState } from 'react';
import { Leaf, Search, ShoppingCart, Phone } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google clicked');
  };

  const handleAppleSignIn = () => {
    console.log('Sign in with Apple clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Social Media Icons */}
            <div className="flex space-x-4 text-gray-400">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            
            <span className="text-gray-600 text-sm">Welcome to AgriConnect Hub</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">AgriConnect HUB</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-1">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Products</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Projects</a>
            </div>

            {/* Right Side Icons and Phone */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600" />
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <div className="bg-yellow-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <div className="text-sm">
                  <div>Call Anytime</div>
                  <div className="font-bold">9430144469</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get Started Now</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  required
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the terms & policy
                </label>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-800 transition duration-200"
              >
                Signup
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-green-100 text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-200"
                >
                  <div className="w-5 h-5 bg-red-500 rounded mr-3"></div>
                  <span className="text-gray-700 font-medium">Sign in with Google</span>
                </button>

                <button
                  onClick={handleAppleSignIn}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-200"
                >
                  <div className="w-5 h-5 bg-black rounded mr-3"></div>
                  <span className="text-gray-700 font-medium">Sign in with Apple</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <span className="text-gray-600">Have an account? </span>
                <a href="#" className="text-blue-600 hover:underline font-medium">Sign In</a>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Reach your customers faster,{' '}
              <span className="text-purple-600">With Us.</span>
            </h1>

            {/* Illustration */}
            <div className="relative bg-green-400 rounded-3xl p-8 mt-8 overflow-hidden">
              {/* Fresh Vegetables Sign */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                Fresh VEGETABLES
              </div>
              
              {/* Simplified illustration representation */}
              <div className="flex justify-center items-end space-x-4 mt-8">
                {/* Person 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 bg-yellow-400 rounded-t-full mb-2"></div>
                  <div className="w-12 h-16 bg-green-600 rounded-b-lg"></div>
                </div>
                
                {/* Person 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 bg-red-400 rounded-t-full mb-2"></div>
                  <div className="w-12 h-16 bg-orange-600 rounded-b-lg"></div>
                </div>
                
                {/* Vegetable Stand */}
                <div className="bg-green-500 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <div className="w-3 h-3 bg-green-700 rounded"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <div className="w-3 h-3 bg-green-800 rounded"></div>
                  </div>
                </div>
                
                {/* Person 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 bg-orange-400 rounded-t-full mb-2"></div>
                  <div className="w-12 h-16 bg-yellow-600 rounded-b-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;