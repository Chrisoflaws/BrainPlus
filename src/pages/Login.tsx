import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Attempting login for email:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        if (signInError.message === 'Invalid login credentials') {
          throw new Error('Incorrect email or password. Please try again.');
        }
        throw signInError;
      }

      if (data?.session?.access_token) {
        console.log('Login successful, token received');
        await login(data.session.access_token);
        navigate('/app/dashboard');
      } else {
        throw new Error('No session token received');
      }
    } catch (err) {
      console.error('Login process error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <img 
                src="/images/second-brain-logo.png" 
                alt="Second Brain AI Logo" 
                className="w-16 h-16 object-contain mx-auto"
              />
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    <p className="text-sm mt-1 text-red-300">
                      Need help? <button onClick={() => navigate('/support')} className="text-blue-400 hover:text-blue-300 underline">Contact support</button>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Signing in...' : 'Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    disabled={isLoading}
                    className="w-full bg-transparent border-2 border-blue-500/50 hover:border-blue-500 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;