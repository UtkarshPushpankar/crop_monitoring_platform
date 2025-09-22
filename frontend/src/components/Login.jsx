import React, { useState, useEffect, useContext } from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { AuthContext } from "../context/authcontext";

const Login = () => {
  const navigate = useNavigate();
  const { login, username } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");

      return;
    }
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`🦄 Welcome ${data.user.name}!`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        console.log("Login successfull: ", { name: data.user.name, email: data.user.email });
        login({ name: data.user.name, email: data.user.email })
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error('Login Failed', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Server Error', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google?redirect=/";
  };

  // For Microsoft login
  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:5000/auth/microsoft?redirect=/";
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
      {/* Wavy Top Border */}
      <div className="absolute top-0 left-0 w-full">
        <svg className="w-full h-20" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.6)" />
          <path d="M0,10 C240,70 480,70 720,40 C960,10 1200,10 1440,40 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.4)" />
          <path d="M0,20 C240,80 480,80 720,50 C960,20 1200,20 1440,50 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.2)" />
        </svg>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,48L48,56C96,64,192,80,288,80C384,80,480,64,576,61.3C672,58,768,69,864,69.3C960,69,1056,58,1152,58.7C1248,58,1344,69,1392,74.7L1440,80L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" fill="rgba(34, 197, 94, 0.1)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[100vh] sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - Login Form */}
          <div className={`bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <h3 className="text-md lg:text-md font-medium text-gray-700 mb-6">Enter your credentials to access your account</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* <div className="flex items-center pt-2">
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
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r cursor-pointer from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mt-4"
              >
                Login
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
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={handleGoogleLogin}

                >
                  <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <img src="https://cdn-icons-png.flaticon.com/128/732/732221.png" className='w-[20px] h-[20px] mr-3' ></img>
                  Sign in with Microsoft
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Don't have an account yet? </span>
                <Link to="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Signup Now
                </Link>
              </div>
            </form>
          </div>

          {/* Right Side - Marketing Content */}
          <div className="ml-20 text-center lg:text-left ">
            <div
              className={`transform transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
            >
              <h2 className="text-5xl lg:text-4xl font-bold text-gray-800 mb-3">
                Smarter farming ,
              </h2>
              <h2 className="text-5xl lg:text-4xl font-bold text-gray-600 mb-3">
                Healthier crops,
              </h2>
              <h2 className="text-xl lg:text-4xl font-bold text-purple-600 mb-6">
                Smarter Yields.
              </h2>
            </div>
            {/* Illustration Area */}
            <div className={`relative p-8 transition-all duration-700 delay-200 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-green-300 rounded-full opacity-30 animate-bounce transform transition-all duration-500 ${isLoaded ? 'scale-100 opacity-30' : 'scale-0 opacity-0'}`}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 3) * 30}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${2 + i * 0.3}s`,
                      transitionDelay: `${1000 + i * 100}ms`
                    }}
                  />
                ))}
              </div>

              {/* Main monitor card */}
              <div className={`relative group transform transition-all duration-800 ${isLoaded ? 'scale-100 opacity-100 rotate-0' : 'scale-90 opacity-0 rotate-3'}`} style={{ transitionDelay: '600ms' }}>
                {/* Outer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />

                {/* Main card container */}
                <div className="relative bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-3xl p-6 shadow-2xl transform transition-all duration-500 rotate-2 group-hover:rotate-0 group-hover:scale-105">

                  {/* Inner white card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 transform transition-all duration-300 -rotate-1 group-hover:rotate-0 group-hover:scale-102">

                    {/* Header with animated logo */}
                    <div className={`flex items-center justify-center space-x-4 mb-6 transform transition-all duration-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-300/50 transition-all duration-500 ${isLoaded ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`} style={{ transitionDelay: '1200ms' }}>
                          <Leaf className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        </div>
                        {/* Pulsing ring */}
                        <div className={`absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-30 transition-all duration-300 ${isLoaded ? 'opacity-30' : 'opacity-0'}`} style={{ transitionDelay: '900ms' }} />
                      </div>

                      <div className={`text-left transform transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} style={{ transitionDelay: '1300ms' }}>
                        <div className="font-bold text-green-600 text-lg tracking-wide">AI Monitor</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Crop Intelligence</div>
                      </div>
                    </div>

                    {/* Metrics grid with enhanced animations */}
                    <div className={`grid grid-cols-3 gap-3 mb-6 transform transition-all duration-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
                      {/* Healthy Status */}
                      <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center transform transition-all duration-500 hover:scale-102 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Healthy</div>
                        <div className="text-xs text-green-600 font-bold">98%</div>
                      </div>

                      {/* Soil pH */}
                      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center transform transition-all duration-500 hover:scale-102 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ transitionDelay: '1100ms' }}>
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Soil pH</div>
                        <div className="text-xs text-blue-600 font-bold">6.8</div>
                      </div>

                      {/* Pest Risk */}
                      <div className={`bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center transform transition-all duration-500 hover:scale-102 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Pest Risk</div>
                        <div className="text-xs text-orange-600 font-bold">Low</div>
                      </div>
                    </div>

                    {/* Enhanced status indicators */}
                    <div className={`flex justify-center items-center space-x-3 mb-4 transform transition-all duration-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1300ms' }}>
                      {[
                        { color: 'green', bgColor: 'bg-gradient-to-br from-green-400 to-green-600' },
                        { color: 'blue', bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600' },
                        { color: 'yellow', bgColor: 'bg-gradient-to-br from-yellow-400 to-yellow-600' }
                      ].map((item, index) => (
                        <div key={index} className="relative group/indicator">
                          <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center shadow-lg hover:shadow-${item.color}-300/50 transition-all duration-500 cursor-pointer transform hover:scale-110 ${isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ transitionDelay: `${1300 + index * 100}ms` }}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 group-hover/indicator:opacity-30 group-hover/indicator:animate-ping transition-opacity" />
                        </div>
                      ))}
                    </div>

                    {/* Action button with sliding effect */}
                    {/* <div className="relative overflow-hidden rounded-lg">
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-green-300/50 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn">
                        <span className="relative z-10">View Detailed Report</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                      </button>
                    </div> */}
                  </div>
                </div>

                {/* Floating info cards */}
                <div className={`absolute -top-4 -right-4 bg-white rounded-lg p-2 shadow-lg transform transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${isLoaded ? 'scale-100' : 'scale-0'}`} style={{ transitionDelay: '1500ms' }}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-xs font-medium">24°C</span>
                  </div>
                </div>

                <div className={`absolute -bottom-4 -left-4 bg-white rounded-lg p-2 shadow-lg transform transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${isLoaded ? 'scale-100' : 'scale-0'}`} style={{ transitionDelay: '1600ms' }}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
                    </svg>
                    <span className="text-xs font-medium">Sunny</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;