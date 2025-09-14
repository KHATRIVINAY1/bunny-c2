import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, User, Lock, LogIn, Shield, Mail } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost/login/', formData);
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      onLogin("admin");
    } catch (err) {
      setError(err.response?.data?.detail || 
               err.response?.data?.non_field_errors?.[0] || 
               'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Username or Email
              </label>
              <div className={`relative rounded-lg transition-all duration-200 ${isFocused.username ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${isFocused.username ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => handleFocus('username')}
                  onBlur={() => handleBlur('username')}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Password
              </label>
              <div className={`relative rounded-lg transition-all duration-200 ${isFocused.password ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isFocused.password ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;