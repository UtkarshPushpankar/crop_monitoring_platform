import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Signup = () => {
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

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Signup successfull: ", { name: data.user.name });
        navigate("/");
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
      {/* Wavy Top Border */}
      <div className="absolute top-0 left-0 w-full">
        <svg className="w-full h-20" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.6)"/>
          <path d="M0,10 C240,70 480,70 720,40 C960,10 1200,10 1440,40 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.4)"/>
          <path d="M0,20 C240,80 480,80 720,50 C960,20 1200,20 1440,50 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.2)"/>
        </svg>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,48L48,56C96,64,192,80,288,80C384,80,480,64,576,61.3C672,58,768,69,864,69.3C960,69,1056,58,1152,58.7C1248,58,1344,69,1392,74.7L1440,80L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" fill="rgba(34, 197, 94, 0.1)"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex  items-center justify-center min-h-[100vh] sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Signup Form */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Get Started Now</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-green-50/50"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-green-50/50"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-green-50/50"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the terms & policy
                </label>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mt-4"
              >
                Signup
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Sign in with Apple
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Have an account? </span>
                <NavLink to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Login Now
                </NavLink>
              </div>
            </form>
          </div>

          {/* Right Side - Marketing Content */}
          <div className="ml-20 text-center lg:text-left">
            <h2 className="text-5xl lg:text-4xl font-bold text-gray-800 mb-3">
              Reach your
            </h2>
            <h2 className="text-5xl lg:text-4xl font-bold text-gray-600 mb-3">
              customers faster,
            </h2>
            <h2 className="text-xl lg:text-4xl font-bold text-purple-600 mb-6">
              With Us.
            </h2>

            {/* Illustration Area */}
           <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-5 transform -rotate-2">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-green-600 text-base">AI Monitor</div>
                      <div className="text-xs text-gray-600">CROP HEALTH</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-green-100 rounded-lg p-2 text-center">
                      <div className="w-6 h-6 bg-green-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Healthy</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-2 text-center">
                      <div className="w-6 h-6 bg-blue-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Soil pH</div>
                    </div>
                    <div className="bg-red-100 rounded-lg p-2 text-center">
                      <div className="w-6 h-6 bg-red-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Pest Risk</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div/>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;